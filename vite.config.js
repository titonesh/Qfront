import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5003',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  define: {
    'process.env': {}
  }
})