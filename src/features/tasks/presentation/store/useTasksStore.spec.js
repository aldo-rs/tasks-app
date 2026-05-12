import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { Task } from '../../model/Task.js'
import { useTasksStore } from './useTasksStore.js'

describe('useTasksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should start with an empty task list', () => {
    const store = useTasksStore()
    expect(store.tasks).toHaveLength(0)
  })

  it('should add a new task', () => {
    const store = useTasksStore()
    store.addTask(new Task({ id: '1', title: 'Buy milk' }))
    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0].title).toBe('Buy milk')
  })

  it('should separate pending and completed tasks via computed', () => {
    const store = useTasksStore()
    store.addTask(new Task({ id: '1', title: 'Pending task' }))
    store.addTask(new Task({ id: '2', title: 'Done task', completed: true }))

    expect(store.pendingTasks).toHaveLength(1)
    expect(store.pendingTasks[0].id).toBe('1')
    expect(store.completedTasks).toHaveLength(1)
    expect(store.completedTasks[0].id).toBe('2')
  })

  it('should toggle task from pending to completed', () => {
    const store = useTasksStore()
    store.addTask(new Task({ id: '1', title: 'Buy milk' }))

    store.toggleTask('1')

    expect(store.tasks[0].completed).toBe(true)
    expect(store.completedTasks).toHaveLength(1)
    expect(store.pendingTasks).toHaveLength(0)
  })

  it('should toggle task back to pending when already completed', () => {
    const store = useTasksStore()
    store.addTask(new Task({ id: '1', title: 'Buy milk', completed: true }))

    store.toggleTask('1')

    expect(store.tasks[0].completed).toBe(false)
  })

  it('should not mutate the original task when toggling', () => {
    const store = useTasksStore()
    const original = new Task({ id: '1', title: 'Buy milk' })
    store.addTask(original)

    store.toggleTask('1')

    // The store replaces the entry; the original object passed in should be untouched.
    expect(original.completed).toBe(false)
  })

  it('should do nothing when toggling a non-existent task id', () => {
    const store = useTasksStore()
    store.addTask(new Task({ id: '1', title: 'Buy milk' }))

    store.toggleTask('non-existent')

    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0].completed).toBe(false)
  })

  it('should update an existing task by id', () => {
    const store = useTasksStore()
    store.addTask(new Task({ id: '1', title: 'Tarea 1', description: 'Inicial' }))

    store.updateTask(new Task({ id: '1', title: 'Tarea actualizada', description: 'Editada' }))

    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0].title).toBe('Tarea actualizada')
    expect(store.tasks[0].description).toBe('Editada')
    expect(store.getTaskById('1')?.title).toBe('Tarea actualizada')
  })

  it('should do nothing when updating a task with a non-existent id', () => {
    const store = useTasksStore()
    store.addTask(new Task({ id: '1', title: 'Buy milk' }))

    store.updateTask(new Task({ id: 'ghost', title: 'Ghost task' }))

    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0].title).toBe('Buy milk')
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
