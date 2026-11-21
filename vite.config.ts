import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Relative asset URLs so the build works from a subpath such as GitHub Pages.
  base: './',
  build: {
    outDir: 'docs',
    // Wipe docs/ on every build so stale hashed assets never pile up.
    emptyOutDir: true,
    // Icon packs stay as separate, cacheable files instead of data URIs inside the bundle.
    // INLINE_ASSETS=1 inlines everything, for hosts that only take a handful of files.
    assetsInlineLimit: process.env.INLINE_ASSETS ? Number.MAX_SAFE_INTEGER : 0,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
})
