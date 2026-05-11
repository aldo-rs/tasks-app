import { describe, it, expect } from 'vitest'
import { Task } from '../domain/Task.js'
import { createTaskUseCase } from './createTaskUseCase.js'

describe('createTaskUseCase', () => {
  it('should return a valid Task with the given title and description', () => {
    const task = createTaskUseCase({ title: 'Buy milk', description: 'Whole milk' })

    expect(task).toBeInstanceOf(Task)
    expect(task.title).toBe('Buy milk')
    expect(task.description).toBe('Whole milk')
    expect(task.completed).toBe(false)
  })

  it('should generate a unique id', () => {
    const a = createTaskUseCase({ title: 'Task A' })
    const b = createTaskUseCase({ title: 'Task B' })

    expect(a.id).toBeTruthy()
    expect(a.id).not.toBe(b.id)
  })

  it('should trim whitespace from title and description', () => {
    const task = createTaskUseCase({ title: '  Buy milk  ', description: '  Whole milk  ' })

    expect(task.title).toBe('Buy milk')
    expect(task.description).toBe('Whole milk')
  })

  it('should throw when title is empty', () => {
    expect(() => createTaskUseCase({ title: '' })).toThrow()
  })

  it('should throw when title is only whitespace', () => {
    expect(() => createTaskUseCase({ title: '   ' })).toThrow()
  })

  it('should default description to empty string when not provided', () => {
    const task = createTaskUseCase({ title: 'Buy milk' })
    expect(task.description).toBe('')
  })
})
