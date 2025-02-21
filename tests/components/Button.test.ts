import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import Button from '../../components/ui/button/Button.vue'

describe('Button', () => {
  it('renders with default slot content', () => {
    render(Button, {
      slots: {
        default: 'Click me'
      }
    })
    
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
}) 