import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Explicitly set an empty PostCSS config to prevent Vite from
// walking up to the parent E:\Projects\postcss.config.mjs
// (which requires @tailwindcss/postcss not installed here).
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [],
    },
  },
})
