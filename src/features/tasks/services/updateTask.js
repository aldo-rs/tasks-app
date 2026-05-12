import { Task } from '../model/Task.js'
/**
 * Builds an updated version of an existing task with the given edits.
 * Returns a new Task instance. Does not mutate the original.
 * Does not know about the store or any framework.
 *
 * @param {Task} currentTask - the task as it exists in the store
 * @param {{ title: string, description?: string }} edits
 * @returns {Task}
 * @throws {Error} if the resulting task would be invalid
 */
export function updateTask(currentTask, { title, description = '' }) {
  const updatedTask = new Task({
    id: currentTask.id,
    title: title.trim(),
    description: description.trim(),
    completed: currentTask.completed,
  })
  if (!updatedTask.isValid()) {
    throw new Error('El título de la tarea no puede estar vacío')
  }
  return updatedTask
}
