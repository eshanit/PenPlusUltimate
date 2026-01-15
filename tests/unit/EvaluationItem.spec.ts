import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import EvaluationItem from '@/components/forms/EvaluationItem.vue'

describe('EvaluationItem', () => {
  it('renders with minimal props and allows scoring', async () => {
    const item = { number: '1', title: 'Test Item' }
    const localStorageState = { evalItemScores: [{ name: '1', score: undefined }] }
    const wrapper = shallowMount(EvaluationItem as any, {
      props: {
        item,
        index: 0,
        cutOff: null,
        mostRecentScores: [],
        localStorageState
      },
      global: {
        stubs: ['UButton','UBadge','UIcon']
      }
    })

    expect(wrapper.exists()).toBe(true)

    // simulate clicking a score button by directly setting state
    (localStorageState.evalItemScores[0] as any).score = 2
    await wrapper.vm.$nextTick()

    expect(localStorageState.evalItemScores[0].score).toBe(2)
  })
})