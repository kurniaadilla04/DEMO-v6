import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'


export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
    allowedHosts: [
      'f152fb29e7d8.ngrok-free.app'
    ],
    proxy: {
      "/api": {
        target: "http://192.168.31.56:5000",
        changeOrigin: true,
      },
    },
  },
})
