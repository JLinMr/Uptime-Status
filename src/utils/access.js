const configured = import.meta.env.VITE_UPTIMEROBOT_API_URL
export const accessUrl =
  configured && !configured.includes('api.uptimerobot.com') ? configured : '/api/status'
export let accessEnabled = false
export async function accessRequest(action, password) {
  const url = new URL(accessUrl, window.location.origin)
  url.searchParams.set('action', action)
  const response = await fetch(url, {
    method: action === 'auth' ? 'GET' : 'POST',
    credentials: 'same-origin',
    cache: 'no-store',
    ...(action === 'login'
      ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }
      : {})
  })
  if (!response.ok) throw new Error(response.status === 401 ? 'password' : 'connection')
  const result = await response.json()
  if (typeof result.authenticated !== 'boolean') throw new Error('connection')
  if (action === 'auth') accessEnabled = result.enabled === true
  return result
}
export function clearMonitorCache() {
  try {
    localStorage.removeItem('uptime_status_cache')
  } catch {}
}
