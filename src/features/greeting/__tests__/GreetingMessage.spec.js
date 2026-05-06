import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GreetingMessage from '../components/GreetingMessage.vue'

describe('GreetingMessage', () => {
  it('should display a greeting with the given name', () => {
    const wrapper = mount(GreetingMessage, { props: { name: 'Aldo' } })
    expect(wrapper.text()).toBe('Hello Aldo')
  })

  it('should still render when name is an empty string', () => {
    const wrapper = mount(GreetingMessage, { props: { name: '' } })
    expect(wrapper.text()).toBe('Hello')
  })
})

