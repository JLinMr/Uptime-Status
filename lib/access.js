// Shared Web Crypto implementation: no PBKDF2, database or additional secret.
const COOKIE = 'uptime_session'
const TTL = 7 * 24 * 60 * 60
const encoder = new TextEncoder()
export const serverPassword = (env) =>
  env?.SERVER_ACCESS_PASSWORD ??
  (typeof process !== 'undefined' ? process.env?.SERVER_ACCESS_PASSWORD : '') ??
  ''
const hex = (bytes) =>
  Array.from(new Uint8Array(bytes), (x) => x.toString(16).padStart(2, '0')).join('')
async function key(password) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(`uptime-session-v1\0${password}`),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}
async function sign(password, payload) {
  return hex(await crypto.subtle.sign('HMAC', await key(password), encoder.encode(payload)))
}
export async function validSession(cookie, password, now = Date.now()) {
  if (!password) return true
  const token = (cookie || '')
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1)
  if (!token || token.length > 200) return false
  const [expires, nonce, signature, extra] = token.split('.')
  if (
    extra !== undefined ||
    !/^\d{10}$/.test(expires) ||
    !/^[a-f0-9]{32}$/.test(nonce || '') ||
    !/^[a-f0-9]{64}$/.test(signature || '')
  )
    return false
  if (Number(expires) <= Math.floor(now / 1000) || Number(expires) > Math.floor(now / 1000) + TTL)
    return false
  return crypto.subtle.verify(
    'HMAC',
    await key(password),
    Uint8Array.from(signature.match(/../g), (b) => parseInt(b, 16)),
    encoder.encode(`${expires}.${nonce}`)
  )
}
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'private, no-store',
      ...headers
    }
  })
const cookieValue = (value, request, age) =>
  `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`

// Returns a Response for auth actions / rejected requests; null permits the API request.
export async function accessGate(request, env) {
  const password = serverPassword(env)
  const action = new URL(request.url).searchParams.get('action')
  if (action === 'auth') {
    if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405)
    return json({
      enabled: !!password,
      authenticated: await validSession(request.headers.get('cookie'), password)
    })
  }
  if (action === 'login' || action === 'logout') {
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
    const origin = request.headers.get('origin')
    if (origin && origin !== new URL(request.url).origin)
      return json({ error: 'Invalid origin' }, 403)
    if (action === 'logout')
      return json({ authenticated: false }, 200, { 'Set-Cookie': cookieValue('', request, 0) })
    if (!password) return json({ authenticated: true })
    if (!request.headers.get('content-type')?.startsWith('application/json'))
      return json({ error: 'Expected JSON' }, 415)
    if (Number(request.headers.get('content-length')) > 4096)
      return json({ error: 'Request too large' }, 413)
    let body
    try {
      // Bound streamed bodies too, even when Content-Length is absent.
      const reader = request.body?.getReader()
      if (!reader) return json({ error: 'Invalid request' }, 400)
      const chunks = []
      let length = 0
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        length += value.length
        if (length > 4096) {
          await reader.cancel()
          return json({ error: 'Request too large' }, 413)
        }
        chunks.push(value)
      }
      const bytes = new Uint8Array(length)
      let offset = 0
      for (const chunk of chunks) {
        bytes.set(chunk, offset)
        offset += chunk.length
      }
      body = JSON.parse(new TextDecoder().decode(bytes))
    } catch {
      return json({ error: 'Invalid request' }, 400)
    }
    if (typeof body?.password !== 'string' || body.password.length > 1024)
      return json({ error: 'Invalid password' }, 401)
    // Fixed-size MAC verification avoids a variable-time plaintext comparison.
    const challenge = hex(crypto.getRandomValues(new Uint8Array(16)))
    const expected = await sign(password, challenge)
    const matches = await crypto.subtle.verify(
      'HMAC',
      await key(body.password),
      Uint8Array.from(expected.match(/../g), (b) => parseInt(b, 16)),
      encoder.encode(challenge)
    )
    if (!matches) return json({ error: 'Invalid password' }, 401)
    const payload = `${Math.floor(Date.now() / 1000) + TTL}.${hex(crypto.getRandomValues(new Uint8Array(16)))}`
    return json({ authenticated: true }, 200, {
      'Set-Cookie': cookieValue(`${payload}.${await sign(password, payload)}`, request, TTL)
    })
  }
  if (!(await validSession(request.headers.get('cookie'), password)))
    return json({ error: 'Authentication required' }, 401)
  return null
}
