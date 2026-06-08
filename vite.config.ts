import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` must match the GitHub Pages repo path for asset URLs to resolve.
export default defineConfig({
  base: '/pomodoro-timer/',
  plugins: [react()],
})
