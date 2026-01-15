import { beforeEach } from 'vitest'

// noop for process.client and window-based APIs if needed
Object.defineProperty(globalThis, 'process', {
  value: { env: {} },
  writable: true
})

globalThis.fetch = globalThis.fetch || (() => Promise.resolve({ json: () => ({}) }))
