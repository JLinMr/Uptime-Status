import { accessEnabled, accessUrl, clearMonitorCache } from './access'
import axios from 'axios'
import {
  fetchMonitorStatus,
  fetchMonitorResponseTime as fetchRtApi,
  RateLimitError,
  CACHE_TTL_MS
} from '../../api/status.js'
import { processMonitorData, patchResponseTimeStats } from './monitor'

const URL = import.meta.env.VITE_UPTIMEROBOT_API_URL
const KEY = import.meta.env.VITE_UPTIMEROBOT_API_KEY?.replace(/^["']|["']$/g, '').trim()
const DIRECT = !URL?.startsWith('/') && (!URL?.startsWith('http') || URL.includes('api.uptimerobot.com'))
const CACHE_KEY = 'uptime_status_cache'
const HDRS = KEY ? { Authorization: `Bearer ${KEY}` } : undefined

export { RateLimitError, patchResponseTimeStats }
export const isRateLimit = (e) => e instanceof RateLimitError || e?.name === 'RateLimitError'

const readCache = (stale = false) => {
  try {
    const { at, monitors } = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
    if (!at || !Array.isArray(monitors)) return null
    if (!stale && Date.now() - at >= CACHE_TTL_MS) return null
    return monitors
  } catch { return null }
}

export const writeCache = (monitors) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), monitors })) } catch {}
}

export const waitRetry = (sec, onTick) => {
  let left = Math.max(1, Math.ceil(sec))
  onTick?.(left)
  return new Promise((resolve) => {
    const t = setInterval(() => {
      left -= 1
      if (left <= 0) { clearInterval(t); resolve() }
      else onTick?.(left)
    }, 1000)
  })
}

const axiosErr = (e) => {
  if (e.response?.status === 401 && accessEnabled) {
    clearMonitorCache()
    window.dispatchEvent(new Event('uptime-unauthorized'))
    throw new Error('Authentication required')
  }
  if (e.response?.status === 429) {
    const w = Number(e.response.data?.retryAfter) || Number(e.response.headers?.['retry-after']) || 60
    throw new RateLimitError(w)
  }
  throw new Error(e.response?.data?.error || e.message)
}

async function proxyGet(params) {
  try {
    return (await axios.get(accessEnabled ? accessUrl : URL, { timeout: 60000, params, headers: HDRS })).data
  } catch (e) { axiosErr(e) }
}

export const fetchMonitorData = async ({ force = false } = {}) => {
  const hit = !force && readCache()
  if (hit) return hit

  let monitors
  if (DIRECT && !accessEnabled) {
    monitors = (await fetchMonitorStatus({ apiKey: KEY })).monitors.map(processMonitorData)
  } else {
    const data = await proxyGet(force ? { refresh: 1 } : undefined)
    if (!Array.isArray(data?.monitors)) throw new Error(data?.error || 'API 失败')
    monitors = data.monitors.map(processMonitorData)
  }
  writeCache(monitors)
  return monitors
}

export const fetchMonitorResponseTime = async (monitorId) => {
  if (DIRECT && !accessEnabled) return fetchRtApi({ apiKey: KEY, monitorId })
  return (await proxyGet({ monitorId }))?.responseTimeStats ?? null
}

export { readCache }
