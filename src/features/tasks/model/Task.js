/**
 * Task is a rich domain object.
 * It encapsulates business rules and behavior — not anemic.
 */
export class Task {
  constructor({ id, title, description = '', completed = false }) {
    this.id = id
    this.title = title
    this.description = description
    this.completed = completed
  }

  /** Returns a new Task with toggled completion state (immutable). */
  toggle() {
    return new Task({ ...this, completed: !this.completed })
  }

  /** A task is only valid when it has a non-empty title. */
  isValid() {
    return this.title.trim().length > 0
  }
}
