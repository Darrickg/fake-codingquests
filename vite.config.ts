import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves the site from /<repo-name>/, so the workflow sets BASE_PATH.
// Vercel and local dev serve from the root.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
  },
})
