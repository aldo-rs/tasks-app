import { describe, it, expect } from 'vitest'
import { Task } from './Task'

describe('Task', () => {
  it('should create a task with default values', () => {
    const task = new Task({ id: '1', title: 'Buy milk' })

    expect(task.completed).toBe(false)
    expect(task.description).toBe('')
  })

  it('should be valid when title is not empty', () => {
    const task = new Task({ id: '1', title: 'Buy milk' })

    expect(task.isValid()).toBe(true)
  })

  it('should not be valid when title is empty', () => {
    const task = new Task({ id: '1', title: '   ' })

    expect(task.isValid()).toBe(false)
  })

  it('should toggle completion state without mutating the original', () => {
    const task = new Task({ id: '1', title: 'Buy milk' })
    const toggled = task.toggle()

    expect(toggled.completed).toBe(true)
    expect(task.completed).toBe(false)
  })

  it('should toggle back to pending when already completed', () => {
    const task = new Task({ id: '1', title: 'Buy milk', completed: true })

    expect(task.toggle().completed).toBe(false)
  })
})

