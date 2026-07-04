import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' = relatívne cesty k buildnutým súborom.
// Vďaka tomu ten istý build funguje aj na Verceli (koreň "/")
// aj na GitHub Pages (podpriečinok "/<repo>/").
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
})
