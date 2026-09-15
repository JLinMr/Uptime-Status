import test from 'node:test'
import assert from 'node:assert/strict'
import { accessGate, validSession } from '../lib/access.js'
import { onRequest as cloudflare } from '../functions/api/status.js'
import { onRequest as edgeone } from '../edge-functions/api/status.js'
import vercel from '../api/status.js'

const env = { SERVER_ACCESS_PASSWORD: 'test-long-password-123456789' }
const request = (action, body, cookie) =>
  new Request(`https://example.com/api/status${action ? `?action=${action}` : ''}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', ...(cookie ? { cookie } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  })
async function login() {
  const res = await accessGate(request('login', { password: env.SERVER_ACCESS_PASSWORD }), env)
  assert.equal(res.status, 200)
  assert.match(res.headers.get('set-cookie'), /HttpOnly; SameSite=Strict; Max-Age=604800; Secure/)
  return res.headers.get('set-cookie').split(';')[0]
}

test('unset password keeps public access', async () => {
  assert.equal(await accessGate(request(), { SERVER_ACCESS_PASSWORD: '' }), null)
  assert.deepEqual(
    await (await accessGate(request('auth'), { SERVER_ACCESS_PASSWORD: '' })).json(),
    { enabled: false, authenticated: true }
  )
})
test('password, session persistence, tampering, expiry and rotation', async () => {
  assert.equal((await accessGate(request(), env)).status, 401)
  assert.equal((await accessGate(request('login', { password: 'wrong' }), env)).status, 401)
  const cookie = await login()
  assert.equal(await accessGate(request('', undefined, cookie), env), null)
  assert.equal(
    (await (await accessGate(request('auth', undefined, cookie), env)).json()).authenticated,
    true
  )
  assert.equal(await validSession(cookie + 'x', env.SERVER_ACCESS_PASSWORD), false)
  assert.equal(await validSession(cookie, 'changed-password'), false)
  assert.equal(
    await validSession(cookie, env.SERVER_ACCESS_PASSWORD, Date.now() + 8 * 86400000),
    false
  )
  assert.match(
    (await accessGate(request('logout', {}), env)).headers.get('set-cookie'),
    /Max-Age=0/
  )
})
test('rejects malformed bodies, oversized requests, invalid methods and cross-origin login', async () => {
  assert.equal((await accessGate(request('login'), env)).status, 405)
  assert.equal((await accessGate(request('login', null), env)).status, 401)
  assert.equal(
    (await accessGate(request('login', { password: 'a'.repeat(5000) }), env)).status,
    413
  )
  const req = request('login', { password: env.SERVER_ACCESS_PASSWORD })
  req.headers.set('origin', 'https://attacker.example')
  assert.equal((await accessGate(req, env)).status, 403)
})
for (const [name, handler] of [
  ['Cloudflare', cloudflare],
  ['EdgeOne', edgeone]
]) {
  test(`${name} protects status and lazy response-time endpoints before upstream fetch`, async () => {
    for (const query of ['', '?monitorId=1', '?refresh=1']) {
      const res = await handler({
        request: new Request(`https://example.com/api/status${query}`),
        env
      })
      assert.equal(res.status, 401)
      assert.equal(res.headers.get('cache-control'), 'private, no-store')
    }
    const cookie = await login()
    const res = await handler({ request: request('auth', undefined, cookie), env })
    assert.equal((await res.json()).authenticated, true)
  })
}
test('Vercel uses the same cookie and protects the endpoint', async () => {
  const original = process.env.SERVER_ACCESS_PASSWORD
  process.env.SERVER_ACCESS_PASSWORD = env.SERVER_ACCESS_PASSWORD
  try {
    const res = {
      headers: {},
      setHeader(k, v) {
        this.headers[k.toLowerCase()] = v
      },
      status(n) {
        this.code = n
        return this
      },
      send(v) {
        this.body = JSON.parse(v)
        return this
      }
    }
    await vercel(
      {
        method: 'GET',
        url: '/api/status?monitorId=1',
        headers: { host: 'example.com' },
        query: { monitorId: '1' }
      },
      res
    )
    assert.equal(res.code, 401)
    assert.equal(res.headers['cache-control'], 'private, no-store')
    const cookie = await login()
    await vercel(
      {
        method: 'GET',
        url: '/api/status?action=auth',
        headers: { host: 'example.com', cookie },
        query: { action: 'auth' }
      },
      res
    )
    assert.equal(res.body.authenticated, true)
  } finally {
    if (original === undefined) delete process.env.SERVER_ACCESS_PASSWORD
    else process.env.SERVER_ACCESS_PASSWORD = original
  }
})
