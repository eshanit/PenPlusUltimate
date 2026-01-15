import { mount } from '@vue/test-utils'
import OnlineStatus from '@/components/shared/OnlineStatus.vue'
import { describe, it, expect } from 'vitest'

describe('OnlineStatus', () => {
  it('renders online status when navigator.onLine is true', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
    const wrapper = mount(OnlineStatus)
    expect(wrapper.text()).toContain('Online')
  })

  it('renders offline status when navigator.onLine is false', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })
    const wrapper = mount(OnlineStatus)
    expect(wrapper.text()).toContain('Offline')
  })
})
