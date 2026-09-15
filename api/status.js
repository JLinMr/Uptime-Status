import { accessGate, serverPassword } from '../lib/access.js'
const API = 'https://api.uptimerobot.com/v3'
const DAY30 = 30 * 24 * 60 * 60 * 1000
export const CACHE_TTL_MS = 5 * 60 * 1000

export class RateLimitError extends Error {
  constructor(retryAfter = 60) {
    super('API 速率限制')
    this.name = 'RateLimitError'
    this.retryAfter = Math.max(1, Math.ceil(Number(retryAfter) || 60))
  }
}

const trim = (v) => v?.replace(/^["']|["']$/g, '').trim()
const absUrl = (path) => path.startsWith('http') ? path : `${API}${path.startsWith('/') ? path : `/${path}`}`

const keyOf = (o = {}) => trim(o.apiKey) || trim(o.api_key)  || trim(o?.env?.UPTIMEROBOT_API_KEY) || trim(o?.env?.VITE_UPTIMEROBOT_API_KEY)  || trim(typeof process !== 'undefined' ? process.env?.UPTIMEROBOT_API_KEY : undefined) || trim(typeof process !== 'undefined' ? process.env?.VITE_UPTIMEROBOT_API_KEY : undefined)

async function get(apiKey, url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' }
  })
  if (res.status === 429) {
    const wait = Number(res.headers.get('Retry-After'))
      || Math.max(1, Number(res.headers.get('X-RateLimit-Reset')) - Math.floor(Date.now() / 1000))
    throw new RateLimitError(wait || 60)
  }
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`)
  return res.json()
}

async function paginate(apiKey, path) {
  const items = []
  let url = absUrl(path)
  while (url) {
    const page = await get(apiKey, url)
    items.push(...(page.data || []))
    url = page.nextLink ? absUrl(page.nextLink) : null
  }
  return items
}

function mergeIncidents(list, monitors) {
  const map = new Map()
  for (const item of list) {
    const id = item.monitor?.id
    if (id) (map.get(id) ?? (map.set(id, []), map.get(id))).push(item)
  }
  for (const m of monitors) {
    if (!m.lastIncident) continue
    const arr = map.get(m.id) || []
    if (!arr.some((x) => String(x.id) === String(m.lastIncident.id))) {
      map.set(m.id, [...arr, m.lastIncident])
    }
  }
  return map
}

export async function fetchMonitorStatus({ apiKey } = {}) {
  const key = keyOf({ apiKey })
  if (!key) throw new Error('缺少 API Key')
  const since = new Date(Date.now() - DAY30).toISOString()
  const [monitors, incidents] = await Promise.all([
    paginate(key, '/monitors?limit=200'),
    paginate(key, `/incidents?started_after=${encodeURIComponent(since)}`)
  ])
  const byMonitor = mergeIncidents(incidents, monitors)
  return {
    monitors: monitors.map((m) => ({
      ...m,
      incidents: byMonitor.get(m.id) || [],
      responseTimeStats: null
    }))
  }
}

export async function fetchMonitorResponseTime({ apiKey, monitorId } = {}) {
  const key = keyOf({ apiKey })
  if (!key || !monitorId) throw new Error('缺少参数')
  return get(key, `${API}/monitors/${monitorId}/stats/response-time?includeTimeSeries=true`)
}

let cache = null
export async function getCachedMonitorStatus(apiKey, { force = false } = {}) {
  if (!force && cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.data
  const data = await fetchMonitorStatus({ apiKey })
  cache = { at: Date.now(), data }
  return data
}

export async function parseRequestApiKey(input) {
  const env = keyOf(input)
  if (env) return env

  const req = input?.request ?? input
  if (!req || typeof req !== 'object') return null

  const auth = req.headers?.get?.('Authorization') ?? req.headers?.authorization
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) return auth.slice(7)

  if (typeof req.url !== 'string') return null
  const q = new URL(req.url).searchParams
  return q.get('api_key') || q.get('apiKey') || null
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

export default async function handler(req, res) {
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v))
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: '只支持 GET / POST' })

  try {
    const protocol = req.headers['x-forwarded-proto'] === 'http' ? 'http' : 'https'
    const request = new Request(`${protocol}://${req.headers.host}${req.url}`, {
      method: req.method, headers: req.headers,
      ...(req.method === 'POST' ? { body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {}) } : {})
    })
    const denied = await accessGate(request)
    if (denied) {
      denied.headers.forEach((v, k) => res.setHeader(k, v))
      return res.status(denied.status).send(await denied.text())
    }
    res.setHeader('Cache-Control', 'private, no-store')
    const apiKey = keyOf({})
      || req.headers.authorization?.replace(/^Bearer\s+/i, '')
      || req.query?.api_key || req.query?.apiKey
      || req.body?.api_key || req.body?.apiKey
    const monitorId = req.query?.monitorId
    if (monitorId) {
      return res.json({ responseTimeStats: await fetchMonitorResponseTime({ apiKey, monitorId }) })
    }
    const force = ['1', 'true'].includes(String(req.query?.refresh))
    const data = await getCachedMonitorStatus(apiKey, { force })
    res.setHeader('Cache-Control', serverPassword() ? 'private, no-store' : `public, max-age=${CACHE_TTL_MS / 1000 | 0}`)
    return res.json(data)
  } catch (e) {
    if (e instanceof RateLimitError) {
      return res.status(429).json({ error: e.message, retryAfter: e.retryAfter })
    }
    return res.status(500).json({ error: e.message || '请求失败' })
  }
}
