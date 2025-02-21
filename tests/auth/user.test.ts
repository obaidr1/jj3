import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import RegisterForm from '../../src/components/auth/RegisterForm.vue'
import LoginForm from '../../src/components/auth/LoginForm.vue'

describe('User Authentication', () => {
  // Mock user data
  const testUser = {
    email: 'test@example.com',
    password: 'Password123!'
  }

  describe('Registration', () => {
    it('should create a new user successfully', async () => {
      const wrapper = mount(RegisterForm, {
        props: {
          onSubmit: vi.fn()
        }
      })

      // Fill in the registration form
      await wrapper.find('[data-test="email-input"]').setValue(testUser.email)
      await wrapper.find('[data-test="password-input"]').setValue(testUser.password)
      await wrapper.find('form').trigger('submit')

      expect(wrapper.emitted('submit')).toBeTruthy()
    })

    it('should show validation errors for invalid input', async () => {
      const wrapper = mount(RegisterForm)
      
      // Test invalid email
      await wrapper.find('[data-test="email-input"]').setValue('invalid-email')
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.text()).toContain('Please enter a valid email')
    })
  })

  describe('Login', () => {
    it('should login successfully with correct credentials', async () => {
      const wrapper = mount(LoginForm, {
        props: {
          onSubmit: vi.fn()
        }
      })

      await wrapper.find('[data-test="email-input"]').setValue(testUser.email)
      await wrapper.find('[data-test="password-input"]').setValue(testUser.password)
      await wrapper.find('form').trigger('submit')

      expect(wrapper.emitted('submit')).toBeTruthy()
    })
  })
}) 