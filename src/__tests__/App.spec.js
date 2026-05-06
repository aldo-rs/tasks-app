import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('should render the app title', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('POC for learning Vue 3!')
  })

  it('should display a greeting in the app', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Hello')
  })
})
