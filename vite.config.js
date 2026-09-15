import { defineConfig, loadEnv } from 'vite'
import { localApi } from './lib/dev-api.js'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [vue(), {
    name: 'local-status-api',
    configureServer(server) { server.middlewares.use(localApi(loadEnv(mode, process.cwd(), ''))) },
    configurePreviewServer(server) { server.middlewares.use(localApi(loadEnv(mode, process.cwd(), ''))) }
  }],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3100,
    open: true
  }
}))
