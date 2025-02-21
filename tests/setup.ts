import { config } from '@vue/test-utils'
import { createPinia } from 'pinia'
import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/vue'

// Setup Pinia
const pinia = createPinia()

// Global test setup
config.global.plugins = [pinia]

// Clean up after each test
afterEach(() => {
  cleanup()
}) 