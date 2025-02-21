import { describe, it, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import AuthForm from '../components/auth/AuthForm.vue'

// Test user credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'dancer'
}

interface AuthResponse {
  user: any;
  token: string;
  refreshToken: string;
}

describe('Authentication', () => {
  const pinia = createPinia()

  it('renders login form', () => {
    const wrapper = mount(AuthForm, {
      global: {
        plugins: [pinia]
      },
      props: {
        mode: 'login'
      }
    })

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('renders register form', () => {
    const wrapper = mount(AuthForm, {
      global: {
        plugins: [pinia]
      },
      props: {
        mode: 'register'
      }
    })

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('input[id="name"]').exists()).toBe(true)
  })
})

// Test cases
describe('Authentication Flow', () => {
  // 1. Registration
  test('User Registration', async () => {
    const response = await $fetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: TEST_USER
    })

    expect(response.user).toBeDefined()
    expect(response.token).toBeDefined()
    expect(response.refreshToken).toBeDefined()
  })

  // 2. Login
  test('User Login', async () => {
    const response = await $fetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: {
        email: TEST_USER.email,
        password: TEST_USER.password
      }
    })

    expect(response.user).toBeDefined()
    expect(response.token).toBeDefined()
    expect(response.refreshToken).toBeDefined()
  })

  // 3. Token Refresh
  test('Token Refresh', async () => {
    const loginResponse = await $fetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: {
        email: TEST_USER.email,
        password: TEST_USER.password
      }
    })

    const refreshResponse = await $fetch<Omit<AuthResponse, 'user'>>('/api/auth/refresh', {
      method: 'POST',
      body: {
        refreshToken: loginResponse.refreshToken
      }
    })

    expect(refreshResponse.token).toBeDefined()
    expect(refreshResponse.refreshToken).toBeDefined()
  })
}) 