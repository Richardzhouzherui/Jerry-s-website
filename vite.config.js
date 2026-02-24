import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    base: command === 'build' ? '/Jerry-s-website/' : '/',
    server: {
      port: 5173,
      allowedHosts: [
        "retroserrate-jeffry-unconfusedly.ngrok-free.dev",
        ".ngrok-free.dev",
      ]
    }
  }
})