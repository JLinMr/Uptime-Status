<p align="center">
  <img src="public/logo.svg" width="100" height="100" alt="Status Monitor Logo">
</p>

<h1 align="center">Website Monitor</h1>

<p align="center">An Elegant Website Status Monitoring Dashboard</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/JLinmr/uptime-status" title="Deploy with Vercel">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  <a href="https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2FJLinMr%2FUptime-Status&output-directory=dist&install-command=npm%20install&build-command=npm%20run%20build" target="_blank" rel="noopener noreferrer">
    <img src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg" alt="Deploy with EdgeOne Pages">
  </a>
  <a href="https://console.cloud.tencent.com/edgeone/pages?action=create" title="Deploy to Tencent Cloud EdgeOne Pages">
    <img src="https://img.shields.io/badge/-Deploy-00A4FF?style=for-the-badge&labelColor=00A4FF&color=00A4FF&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNNi41IDIwcS0yLjI3NSAwLTMuODg3LTEuNTc1VDEgMTQuNTc1cTAtMS45NSAxLjE3NS0zLjQ3NVQ1LjI1IDkuMTVxLjYyNS0yLjMgMi41LTMuNzI1VDEyIDRxMi45MjUgMCA0Ljk2MyAyLjAzOFQxOSAxMXExLjcyNS4yIDIuODYzIDEuNDg4VDIzIDE1LjVxMCAxLjg3NS0xLjMxMiAzLjE4OFQxOC41IDIweiIvPjwvc3ZnPg==&borderRadius=6" alt="Deploy to Tencent Cloud EdgeOne" height="32" />
  </a>
  <a href="https://dash.cloudflare.com/" title="Deploy to Cloudflare Pages">
    <img src="https://img.shields.io/badge/-Deploy-F38020?style=for-the-badge&labelColor=F38020&color=F38020&logo=cloudflare&logoColor=white&borderRadius=6" alt="Deploy to Cloudflare Pages" height="32" />
  </a>
</p>

<p align="center">🎮 Live Demo:
  <a href="https://status.bsgun.cn" target="_blank">
    https://status.bsgun.cn
  </a>
</p>

<div align="center">
  <a href="./README.md">简体中文</a>|English
</div>

## 📖 Introduction

Website Monitor is a website status monitoring dashboard developed based on the UptimeRobot **v3 API**, supporting multi-website status monitoring, outage statistics and other functions. It features a clean and beautiful interface, responsive design, and supports light/dark theme switching.

> **Upgrade notice**: UptimeRobot has deprecated the legacy v2 endpoint (`.../v2/getMonitors`). If you are still on an older version, please pull the latest code and redeploy, otherwise data loading may fail or time out.

## ✨ Feature Preview

![Feature Preview](https://i1.wp.com/dev.ruom.top/i/2025/01/25/629114.webp)

## ✨ Features

- 📊 Real-time Monitoring: Supports multiple monitoring methods
- 📱 Responsive Design: Adapts to mobile and desktop devices
- 🌓 Theme Switching: Supports light/dark mode
- 📈 Data Statistics: Visual display of uptime and response time (loaded on click)
- 🔔 Outage Records: Detailed downtime records and cause analysis
- 🔄 Auto-refresh: Automatically updates monitoring data (5-minute cache)
- 🔃 Sorting: Sort by name, time, or status with ascending/descending order
- 💫 Smooth Animations: Fluid UI interaction experience

### UptimeRobot API Changes

UptimeRobot has fully migrated to the **v3 REST API**. The legacy v2 endpoint is no longer available:

| Item | v2 (deprecated) | v3 (current) |
|------|-----------------|--------------|
| URL | `https://api.uptimerobot.com/v2/getMonitors` | `https://api.uptimerobot.com/v3` |
| Auth | POST form + `api_key` | `Authorization: Bearer <key>` |
| Data | Single response | Paginated REST (monitors, incidents, etc.) |

This project connects to v3 through the `/api/status` server-side proxy. You do **not** need to call UptimeRobot directly from the frontend when deployed.

## ⚙️ Deployment & Configuration

### Requirements

- Node.js >= 16.16.0
- NPM >= 8.15.0 or PNPM >= 8.0.0

### Get UptimeRobot API Key

1. Register/Log in to [UptimeRobot](https://uptimerobot.com/)
2. Go to [Integrations & API](https://dashboard.uptimerobot.com/integrations)
3. Scroll to the bottom and create a **Read-Only API Key** in the Main API keys section
4. Copy the generated API Key

### API Proxy Instructions

This project supports the following three deployment methods, all of which can automatically handle cross-origin requests:

1. **Tencent Cloud EdgeOne Pages**
   - Click the blue "Deploy" button above
   - Connect to GitHub and select the project
   - Select Vue as the framework preset and click Deploy
   - Use the default configuration `VITE_UPTIMEROBOT_API_URL = "/api/status"`

2. **Vercel**
   - Click the black "Deploy" button above
   - Connect to GitHub and select the project
   - Enter the project name and click Create
   - Use the default configuration `VITE_UPTIMEROBOT_API_URL = "/api/status"`

3. **Cloudflare Pages**
   - Click the orange "Deploy" button above
   - Navigate to the Workers & Pages section
   - Click Create, select Pages, connect to GitHub, select the project, and click Begin setup
   - Select Vue as the framework preset and click Save & Deploy
   - Use the default configuration `VITE_UPTIMEROBOT_API_URL = "/api/status"`

4. **Other Platforms**
   - Build your own API proxy targeting `https://api.uptimerobot.com/v3`
   - Set `VITE_UPTIMEROBOT_API_URL` to your proxy address in the `.env` file

### Quick Start

1. Clone the repository
```bash
git clone https://github.com/JLinmr/uptime-status.git
cd uptime-status
```

2. Install dependencies
```bash
pnpm install
# or
npm install
```

3. Configure environment variables

Modify the following settings in the `.env` file:
```bash
# UptimeRobot API Key (Read-Only is sufficient)
VITE_UPTIMEROBOT_API_KEY = "your API key"

# UptimeRobot API URL
# When deploying to Vercel / Cloudflare Pages / EdgeOne:
VITE_UPTIMEROBOT_API_URL = "/api/status"

# For local development with direct v3 access:
# VITE_UPTIMEROBOT_API_URL = "https://api.uptimerobot.com/v3"

# Website Title
VITE_APP_TITLE = "Website Monitor"

# Optional access password: empty means public access; use a long random password
# Set as a server runtime variable (Secret on Cloudflare), then redeploy
# Locally use .env.local; requires same-origin /api/status functions; login lasts 7 days
SERVER_ACCESS_PASSWORD = ""
```

> `VITE_UPTIMEROBOT_STATUS_SORT` has been removed. Use the sort control in the page header; your preference is saved in the browser.

4. Development & Debugging
```bash
pnpm dev
# or
npm run dev
```

5. Build & Deploy
```bash
pnpm build
# or
npm run build
```
The built files are in the `dist` directory. Deploy the `dist` directory to your server.

## CDN Sponsorship

CDN acceleration and security protection for this project are sponsored by Tencent EdgeOne: EdgeOne provides a long-term valid free plan with unlimited traffic and requests, covering mainland China nodes with no overcharge fees. Interested users can visit the EdgeOne official website to learn more.
<a href="https://edgeone.ai/en?from=github" target="_blank">
    Best Asian CDN, Edge & Security Solutions - Tencent EdgeOne
<img src="https://edgeone.ai/media/34fe3a45-492d-4ea4-ae5d-ea1087ca7b4b.png" width="500" height="100">
</a>

## 📝 License

This project is open-source under the [MIT License](LICENSE). Please comply with the license when using it.

## 🙏 Acknowledgments

- [UptimeRobot](https://uptimerobot.com/) - Provides monitoring API support
- [Vue.js](https://vuejs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Chart.js](https://www.chartjs.org/) - Charting library
