import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import YourComponent from '~/src/components/YourComponent.vue'

describe('YourComponent', () => {
  it('renders the heading', () => {
    const wrapper = mount(YourComponent)
    expect(wrapper.find('h1').text()).toBe('Example Component')
  })
}) 