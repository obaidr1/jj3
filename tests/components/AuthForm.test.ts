import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import AuthForm from '../../components/auth/AuthForm.vue'

describe('AuthForm', () => {
  const pinia = createPinia()

  it('validates email format', async () => {
    const wrapper = mount(AuthForm, {
      global: {
        plugins: [pinia]
      },
      props: {
        mode: 'login'
      }
    })

    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('invalid-email')
    await wrapper.find('form').trigger('submit')

    // Check for error message
    expect(wrapper.text()).toContain('Invalid email')
  })

  it('validates password length', async () => {
    const wrapper = mount(AuthForm, {
      global: {
        plugins: [pinia]
      },
      props: {
        mode: 'register'
      }
    })

    const passwordInput = wrapper.find('input[type="password"]')
    await passwordInput.setValue('123')
    await wrapper.find('form').trigger('submit')

    // Check for error message
    expect(wrapper.text()).toContain('Password must be at least 8 characters')
  })
}) 