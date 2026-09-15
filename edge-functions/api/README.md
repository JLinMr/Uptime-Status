# API 目录说明

本目录 (`edge-functions/api/`) 包含 **腾讯云 EdgeOne Pages** 的 API 代理实现，对接 UptimeRobot **v3 API**。

## 文件说明

### status.js

运行在边缘节点上的代理函数，主要功能：

- 转发请求到 `https://api.uptimerobot.com/v3`
- 处理 CORS（跨域）请求
- 服务端缓存（5 分钟）与 429 限流响应

逻辑与 `api/status.js`（Cloudflare 版）共用同一套实现，但由于EdgeOne的Edge Functions只读取特定目录下的代码，特此抽离。

## 接口说明

| 路由 | 说明 |
|------|------|
| `GET /api/status` | 获取监控列表及近 30 天事件 |
| `GET /api/status?refresh=1` | 强制刷新，跳过服务端缓存 |
| `GET /api/status?monitorId=xxx` | 获取指定监控的响应时间统计 |

## 请求处理

1. **OPTIONS**：返回 CORS 头部
2. **GET / POST**：转发到 UptimeRobot v3（Bearer Token 认证）
3. **429**：返回 `{ error, retryAfter }`

## 环境变量

```bash
VITE_UPTIMEROBOT_API_KEY = "你的 Read-Only API Key"
VITE_UPTIMEROBOT_API_URL = "/api/status"

# 以下任选其一，供边缘函数使用
UPTIMEROBOT_API_KEY = "你的 Read-Only API Key"

# 可选访问密码：服务端运行时配置，留空公开访问；建议使用长随机密码
# Cloudflare 可设置为 Secret；修改后重新部署，登录后 7 天内刷新免输密码
SERVER_ACCESS_PASSWORD = ""
```

## 部署说明

- 支持 **腾讯云 EdgeOne Pages**、**Cloudflare Pages**
- 路由 `/api/status` 由平台自动处理
- 无需额外路由配置

> 旧版 v2 接口（`.../v2/getMonitors`）已停用，请勿再使用。
