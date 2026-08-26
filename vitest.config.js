import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    testTimeout: 30000,
    hookTimeout: 60000,
    // The two integration test files (appsScript, registrations) hit the
    // SAME live Google Apps Script deployment. Vitest runs test files in
    // parallel by default, and concurrent writes/reads against the same
    // deployment cause contention that makes requests time out (observed as
    // cascading failures in appsScript.integration.test.js). Running files
    // sequentially avoids this — see AGENTS.md "Known fragile areas".
    fileParallelism: false,
  },
})
