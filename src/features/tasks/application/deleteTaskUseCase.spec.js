import { describe, it, expect } from 'vitest'
import { deleteTaskUseCase } from './deleteTaskUseCase.js'
describe('deleteTaskUseCase', () => {
  it('should return the id when valid', () => {
    expect(deleteTaskUseCase('1')).toBe('1')
  })
  it('should throw when id is empty', () => {
    expect(() => deleteTaskUseCase('')).toThrow()
  })
  it('should throw when id is undefined', () => {
    expect(() => deleteTaskUseCase(undefined)).toThrow()
  })
})
