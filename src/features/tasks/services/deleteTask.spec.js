import { describe, it, expect } from 'vitest'
import { deleteTask } from './deleteTask.js'

describe('deleteTask', () => {
  it('should return the id when valid', () => {
    expect(deleteTask('1')).toBe('1')
  })
  it('should throw when id is empty', () => {
    expect(() => deleteTask('')).toThrow('Se requiere un id para eliminar la tarea')
  })
  it('should throw when id is undefined', () => {
    expect(() => deleteTask(undefined)).toThrow('Se requiere un id para eliminar la tarea')
  })
})
