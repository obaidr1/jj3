import { describe, it, expect } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils'

describe('App', async () => {
  await setup({
    browser: true
  })

  it('renders the home page', async () => {
    const page = await createPage('/')
    const html = await page.innerHTML('body')
    expect(html).toContain('Welcome')
  })
}) 