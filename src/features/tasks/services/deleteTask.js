/**
 * Validates that a task id is present before deletion.
 * Returns the id. Does not know about the store or any framework.
 *
 * In a real app this is where the API call would live (via an injected repository).
 *
 * @param {string} id
 * @returns {string}
 * @throws {Error} if id is missing
 */
export function deleteTask(id) {
  if (!id) {
    throw new Error('Se requiere un id para eliminar la tarea')
  }
  return id
}
