import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BFF_TARGET = process.env.BFF_TARGET ?? 'http://localhost:4000'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Trailing slashes keep app routes like /authentication from being proxied.
      '/api/': { target: BFF_TARGET, changeOrigin: true },
      '/auth/': { target: BFF_TARGET, changeOrigin: true },
    },
  },
})
