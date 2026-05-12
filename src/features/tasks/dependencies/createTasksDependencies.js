/**
 * Composition root for the tasks module.
 *
 * This is where services and repositories will be assembled once
 * an API layer or persistence layer is introduced.
 *
 * Example (future):
 *   const repository = new InMemoryTaskRepository()
 *   const createTaskService = new CreateTaskService(repository)
 *
 * For now, services are pure functions and need no injection.
 */
export function createTasksDependencies() {
  return {}
}

