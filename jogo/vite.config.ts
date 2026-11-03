import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE_PATH permite publicar num subcaminho (ex.: GitHub Pages em /projeto-pinguim/).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
