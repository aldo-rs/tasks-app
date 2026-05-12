import { describe, it, expect } from 'vitest'
import { Task } from '../model/Task.js'
import { updateTask } from './updateTask.js'

const existingTask = new Task({ id: '1', title: 'Buy milk', description: 'Whole milk', completed: false })

describe('updateTask', () => {
  it('should return a new Task with updated title and description', () => {
    const updated = updateTask(existingTask, { title: 'Buy oat milk', description: 'Oat' })

    expect(updated).toBeInstanceOf(Task)
    expect(updated.title).toBe('Buy oat milk')
    expect(updated.description).toBe('Oat')
  })

  it('should preserve id and completed state from the original task', () => {
    const completed = new Task({ id: '2', title: 'Done task', completed: true })
    const updated = updateTask(completed, { title: 'Done task edited' })

    expect(updated.id).toBe('2')
    expect(updated.completed).toBe(true)
  })

  it('should not mutate the original task', () => {
    updateTask(existingTask, { title: 'New title' })

    expect(existingTask.title).toBe('Buy milk')
  })

  it('should trim whitespace from title and description', () => {
    const updated = updateTask(existingTask, { title: '  Buy oat milk  ', description: '  Oat  ' })

    expect(updated.title).toBe('Buy oat milk')
    expect(updated.description).toBe('Oat')
  })

  it('should throw when updated title is empty', () => {
    expect(() => updateTask(existingTask, { title: '' })).toThrow('El título de la tarea no puede estar vacío')
  })

  it('should throw when updated title is only whitespace', () => {
    expect(() => updateTask(existingTask, { title: '   ' })).toThrow('El título de la tarea no puede estar vacío')
  })
})
