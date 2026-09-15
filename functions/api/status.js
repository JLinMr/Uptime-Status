import { accessGate, serverPassword } from '../../lib/access.js'
import {
  getCachedMonitorStatus,
  fetchMonitorResponseTime,
  parseRequestApiKey,
  corsHeaders,
  CACHE_TTL_MS
} from '../../api/status.js'

const json = (body, status = 200, publicCache = false) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': publicCache ? `public, max-age=${CACHE_TTL_MS / 1000 | 0}` : 'private, no-store' }
})

export async function onRequest(context) {
  const request = context?.request ?? context

  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (request.method !== 'GET' && request.method !== 'POST') return json({ error: '只支持 GET / POST' }, 405)

  try {
    const denied = await accessGate(request, context.env)
    if (denied) return denied
    const url = new URL(request.url)
    const apiKey = await parseRequestApiKey(context)
    const monitorId = url.searchParams.get('monitorId')

    if (monitorId) {
      return json({ responseTimeStats: await fetchMonitorResponseTime({ apiKey, monitorId }) }, 200, !serverPassword(context.env))
    }

    const force = ['1', 'true'].includes(url.searchParams.get('refresh'))
    return json(await getCachedMonitorStatus(apiKey, { force }), 200, !serverPassword(context.env))
  } catch (e) {
    if (e.name === 'RateLimitError') {
      return json({ error: e.message, retryAfter: e.retryAfter }, 429)
    }
    return json({ error: e.message || '请求失败' }, 500)
  }
}
