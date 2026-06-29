import { defineConfig } from '@tanstack/start/config'
import vercel from '@tanstack/vercel-adapter'

export default defineConfig({
  server: {
    adapter: vercel(),
  },
})
