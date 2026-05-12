import { Task } from '../model/Task.js'

/**
 * Creates a new task from the given fields.
 * Returns the created Task. Does not know about the store or any framework.
 *
 * @param {{ title: string, description?: string }} fields
 * @returns {Task}
 * @throws {Error} if the task is invalid
 */
export function createTask({ title, description = '' }) {
  const task = new Task({
    id: crypto.randomUUID(),
    title: title.trim(),
    description: description.trim(),
  })

  if (!task.isValid()) {
    throw new Error('El título de la tarea no puede estar vacío')
  }

  return task
}

