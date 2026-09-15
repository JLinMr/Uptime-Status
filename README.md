<p align="center">
  <img src="public/logo.svg" width="100" height="100" alt="Status Monitor Logo">
</p>

<h1 align="center">站点监测</h1>

<p align="center">优雅的站点状态监控面板</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/JLinmr/uptime-status" title="使用 Vercel 部署">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  <a href="https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2FJLinMr%2FUptime-Status&output-directory=dist&install-command=npm%20install&build-command=npm%20run%20build" target="_blank" rel="noopener noreferrer">
    <img src="https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg" alt="Deploy with EdgeOne Pages">
  </a>
  <a href="https://console.cloud.tencent.com/edgeone/pages?action=create" title="使用腾讯云 EdgeOne Pages 部署">
    <img src="https://img.shields.io/badge/-Deploy-00A4FF?style=for-the-badge&labelColor=00A4FF&color=00A4FF&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNNi41IDIwcS0yLjI3NSAwLTMuODg3LTEuNTc1VDEgMTQuNTc1cTAtMS45NSAxLjE3NS0zLjQ3NVQ1LjI1IDkuMTVxLjYyNS0yLjMgMi41LTMuNzI1VDEyIDRxMi45MjUgMCA0Ljk2MyAyLjAzOFQxOSAxMXExLjcyNS4yIDIuODYzIDEuNDg4VDIzIDE1LjVxMCAxLjg3NS0xLjMxMiAzLjE4OFQxOC41IDIweiIvPjwvc3ZnPg==&borderRadius=6" alt="部署到腾讯云 EdgeOne" height="32" />
  </a>
  <a href="https://dash.cloudflare.com/" title="使用 Cloudflare Pages 部署">
    <img src="https://img.shields.io/badge/-Deploy-F38020?style=for-the-badge&labelColor=F38020&color=F38020&logo=cloudflare&logoColor=white&borderRadius=6" alt="部署到 Cloudflare Pages" height="32" />
  </a>
</p>

<p align="center">🎮 在线演示：
  <a href="https://status.bsgun.cn" target="_blank">
    https://status.bsgun.cn
  </a>
</p>

<div align="center">
  简体中文|<a href="./README-en.md">English</a>
</div>

## 📖 简介

站点监测是一个基于 UptimeRobot **v3 API** 开发的站点状态监控面板，支持多站点状态监控、故障统计等功能。界面简洁美观，响应式设计，支持亮暗主题切换。

> **升级提示**：UptimeRobot 已停用旧版 v2 接口（`.../v2/getMonitors`）。若你仍在使用旧版代码，请拉取最新版本并重新部署，否则会出现加载失败或请求超时。

## ✨ 功能预览

![功能预览](https://i1.wp.com/dev.ruom.top/i/2025/01/25/629114.webp)

## ✨ 特性

- 📊 实时监控：支持多种监控方式
- 📱 响应式设计：适配移动端和桌面端
- 🌓 主题切换：支持亮色/暗色主题
- 📈 数据统计：可视化展示可用率和响应时间（响应时间点击后加载）
- 🔔 故障记录：详细的宕机记录和原因分析
- 🔄 自动刷新：定时自动更新监控数据（5 分钟缓存）
- 🔃 排序切换：支持按名称、时间、状态排序及升序/降序
- 💫 平滑动画：流畅的用户界面交互体验

### UptimeRobot API 变更说明

UptimeRobot 已全面切换到 **v3 REST API**，旧版 v2 接口已不可用。主要变化：

| 项目 | v2（已停用） | v3（当前） |
|------|-------------|-----------|
| 地址 | `https://api.uptimerobot.com/v2/getMonitors` | `https://api.uptimerobot.com/v3` |
| 认证 | POST 表单 + `api_key` | `Authorization: Bearer <key>` |
| 数据 | 单次返回 | 分页 REST（monitors、incidents 等） |

本项目已通过 `/api/status` 服务端代理对接 v3，部署时 **无需** 在前端直连 UptimeRobot。

## ⚙️ 部署配置

### 环境要求

- Node.js >= 16.16.0
- NPM >= 8.15.0 或 PNPM >= 8.0.0

### 获取 UptimeRobot API Key

1. 注册/登录 [UptimeRobot](https://uptimerobot.com/)
2. 进入 [Integrations & API](https://dashboard.uptimerobot.com/integrations)
3. 下拉到最底部在 Main API keys 部分创建 **Read-Only API Key**
4. 复制生成的 API Key

### API 代理说明

本项目支持以下三种部署方式,均可实现自动处理跨域请求:

1. **腾讯云 EdgeOne Pages**
   - 点击上方蓝色 "Deploy" 按钮
   - 连接到GitHub，选择项目
   - 框架预设选择Vue，点击开始部署
   - 使用默认配置 `VITE_UPTIMEROBOT_API_URL = "/api/status"`

2. **Vercel**
   - 点击上方黑色 "Deploy" 按钮
   - 连接到GitHub，选择项目
   - 填写项目名称，点击Create
   - 使用默认配置 `VITE_UPTIMEROBOT_API_URL = "/api/status"`

3. **Cloudflare Pages**
   - 点击上方橙色 "Deploy" 按钮
   - 找到计算(worker) 部分
   - 点击创建，选择Pages，连接到GitHub，选择项目，点击开始创建
   - 框架预设选择Vue，点击保持并部署
   - 使用默认配置 `VITE_UPTIMEROBOT_API_URL = "/api/status"`

4. **其他平台**
   - 自行搭建 API 代理，代理目标为 `https://api.uptimerobot.com/v3`
   - 在 `.env` 文件中设置 `VITE_UPTIMEROBOT_API_URL` 为你的 API 代理地址

### 快速开始

1. 克隆项目
```bash
git clone https://github.com/JLinmr/uptime-status.git
cd uptime-status
```

2. 安装依赖
```bash
pnpm install
# 或
npm install
```

3. 配置环境变量

在 `.env` 文件中修改以下配置：
```bash
# UptimeRobot API Key（Read-Only 即可）
VITE_UPTIMEROBOT_API_KEY = "你的 API Key"

# UptimeRobot API URL
# 部署到 Vercel / Cloudflare Pages / EdgeOne 等平台时使用：
VITE_UPTIMEROBOT_API_URL = "/api/status"

# 本地开发直连 v3 时可改为：
# VITE_UPTIMEROBOT_API_URL = "https://api.uptimerobot.com/v3"

# 站点名称
VITE_APP_TITLE = "梦爱吃鱼"

# 访问密码（可选）：留空公开访问；请使用长随机密码
# 在部署平台的服务端环境变量中设置（Cloudflare 可使用 Secret），修改后重新部署
# 本地可在 .env.local 设置；需部署同源 /api/status 函数，登录后 7 天内刷新免输密码
SERVER_ACCESS_PASSWORD = ""
```

> 已移除 `VITE_UPTIMEROBOT_STATUS_SORT` 配置项，排序请在页面右上角选择，偏好会自动保存到浏览器。

4. 开发调试
```bash
pnpm dev
# 或
npm run dev
```

5. 构建部署
```bash
pnpm build
# 或
npm run build
```
构建的文件在 `dist` 目录下，将 `dist` 目录部署到服务器即可。

## CDN赞助

本项目 CDN 加速及安全防护由 Tencent EdgeOne 赞助：EdgeOne 提供长期有效的免费套餐，包含不限量的流量和请求，覆盖中国大陆节点，且无任何超额收费，感兴趣的朋友可以去 EdgeOne 官网获取
<a href="https://edgeone.ai/zh?from=github" target="_blank">
    最佳亚洲 CDN、Edge 和安全解决方案 - 腾讯 EdgeOne
<img src="https://edgeone.ai/media/34fe3a45-492d-4ea4-ae5d-ea1087ca7b4b.png" width="500" height="100">
</a>

## 📝 开源协议

本项目基于 [MIT License](LICENSE) 开源，使用时请遵守开源协议。

## 🙏 致谢

- [UptimeRobot](https://uptimerobot.com/) - 提供监控 API 支持
- [Vue.js](https://vuejs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Chart.js](https://www.chartjs.org/) - 图表库
