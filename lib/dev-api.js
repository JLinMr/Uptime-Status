import { onRequest } from '../functions/api/status.js'

// Vite serves the same API contract in development and local preview.
export function localApi(env) {
  return async (req, res, next) => {
    if (req.url?.split('?')[0] !== '/api/status') return next()
    try {
      let body = ''
      for await (const chunk of req) {
        body += chunk
        if (Buffer.byteLength(body) > 4096) {
          res.writeHead(413)
          res.end()
          return
        }
      }
      const request = new Request(`http://${req.headers.host}${req.url}`, {
        method: req.method,
        headers: req.headers,
        ...(body && req.method !== 'GET' && req.method !== 'HEAD' ? { body } : {})
      })
      const response = await onRequest({ request, env })
      res.writeHead(response.status, Object.fromEntries(response.headers))
      res.end(await response.text())
    } catch {
      res.writeHead(500)
      res.end('Local API failed')
    }
  }
}
