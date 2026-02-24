import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Jerry-s-website/', // 👈 重要：匹配 GitHub 仓库名以确保路径引用正确
  server: {
    port: 5173,
    // 添加允许访问的 Ngrok 域名
    allowedHosts: [
      "retroserrate-jeffry-unconfusedly.ngrok-free.dev", // 你当前 ngrok 生成的域名
      ".ngrok-free.dev", // 通配，避免每次启动都改
    ]
  }
})