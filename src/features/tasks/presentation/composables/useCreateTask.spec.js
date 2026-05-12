import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

import { useCreateTask } from './useCreateTask.js'
import { useTasksStore } from '../store/useTasksStore.js'

describe('useCreateTask', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockPush.mockReset()
  })

  it('should not submit when title is empty', () => {
    const { title, submit } = useCreateTask()
    const store = useTasksStore()

    title.value = ''
    submit()

    expect(store.tasks.length).toBe(0)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should not submit when title is only whitespace', () => {
    const { title, submit } = useCreateTask()
    const store = useTasksStore()

    title.value = '   '
    submit()

    expect(store.tasks.length).toBe(0)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should add a new task when title is valid', () => {
    const { title, description, submit } = useCreateTask()
    const store = useTasksStore()

    title.value = 'Buy milk'
    description.value = 'Whole milk'
    submit()

    expect(store.tasks.length).toBe(1)
    expect(store.tasks[0].title).toBe('Buy milk')
    expect(store.tasks[0].description).toBe('Whole milk')
    expect(store.tasks[0].completed).toBe(false)
  })

  it('should navigate to / after successful submit', () => {
    const { title, submit } = useCreateTask()

    title.value = 'Buy milk'
    submit()

    expect(mockPush).toHaveBeenCalledWith({ name: 'tasks.list' })
  })
})

