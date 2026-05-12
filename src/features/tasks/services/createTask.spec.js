import { describe, it, expect } from 'vitest'
import { Task } from '../model/Task.js'
import { createTask } from './createTask.js'

describe('createTask', () => {
  it('should return a valid Task with the given title and description', () => {
    const task = createTask({ title: 'Buy milk', description: 'Whole milk' })

    expect(task).toBeInstanceOf(Task)
    expect(task.title).toBe('Buy milk')
    expect(task.description).toBe('Whole milk')
    expect(task.completed).toBe(false)
  })

  it('should generate a unique id', () => {
    const a = createTask({ title: 'Task A' })
    const b = createTask({ title: 'Task B' })

    expect(a.id).toBeTruthy()
    expect(a.id).not.toBe(b.id)
  })

  it('should trim whitespace from title and description', () => {
    const task = createTask({ title: '  Buy milk  ', description: '  Whole milk  ' })

    expect(task.title).toBe('Buy milk')
    expect(task.description).toBe('Whole milk')
  })

  it('should throw when title is empty', () => {
    expect(() => createTask({ title: '' })).toThrow('El título de la tarea no puede estar vacío')
  })

  it('should throw when title is only whitespace', () => {
    expect(() => createTask({ title: '   ' })).toThrow('El título de la tarea no puede estar vacío')
  })

  it('should default description to empty string when not provided', () => {
    const task = createTask({ title: 'Buy milk' })
    expect(task.description).toBe('')
  })
})
