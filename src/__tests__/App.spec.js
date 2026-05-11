import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('should mount without errors', () => {
    const wrapper = mount(App, {
      global: {
        // IonRouterOutlet requires the Ionic router internals — stub it in unit tests.
        stubs: { IonRouterOutlet: true },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
