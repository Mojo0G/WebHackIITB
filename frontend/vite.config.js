import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for Docker mapping
    port: 3000, 
    allowedHosts: [
      'cosmic-watch-frontend.onrender.com'
    ],
    watch: {
      usePolling: true // Needed for Docker hot-reload on Windows/Mac
    }
  },
  preview: {
    host: true,
    port: 3000,
    allowedHosts: [
      'cosmic-watch-frontend.onrender.com'
    ]
  }
})
