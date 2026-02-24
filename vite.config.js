import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/Jerry-s-website/' : '/',
  server: {
    port: 5173,
    // 添加允许访问的 Ngrok 域名
    allowedHosts: [
      "retroserrate-jeffry-unconfusedly.ngrok-free.dev", // 你当前 ngrok 生成的域名
      ".ngrok-free.dev", // 通配，避免每次启动都改
    ]
  }
})