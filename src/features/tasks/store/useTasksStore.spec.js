import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { Task } from '../domain/Task.js'
import { useTasksStore } from './useTasksStore.js'

describe('useTasksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should update an existing task by id', () => {
    const store = useTasksStore()
    const originalTask = new Task({ id: '1', title: 'Tarea 1', description: 'Inicial' })

    store.addTask(originalTask)

    store.updateTask(new Task({ id: '1', title: 'Tarea actualizada', description: 'Editada' }))

    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0].title).toBe('Tarea actualizada')
    expect(store.tasks[0].description).toBe('Editada')
    expect(store.getTaskById('1')?.title).toBe('Tarea actualizada')
  })

  it('should delete a task by id', () => {
    const store = useTasksStore()

    store.addTask(new Task({ id: '1', title: 'Tarea 1' }))
    store.addTask(new Task({ id: '2', title: 'Tarea 2' }))

    store.deleteTask('1')

    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0].id).toBe('2')
    expect(store.getTaskById('1')).toBeUndefined()
  })
})

