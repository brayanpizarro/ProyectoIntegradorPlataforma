import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    ignoreAnnotations: true,
  },
  server: {
    open: true, // Esto abrirá automáticamente el navegador
    port: 5173,
    host: 'localhost'
  }
})
