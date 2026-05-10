# Tasks App — Frontend Architecture & Project Conventions

## Goal

Tasks App is a learning project created to deeply understand the frontend stack, architectural style and development conventions used in modern frontend applications.

The architecture must:

* stay simple and pragmatic
* avoid accidental complexity
* keep business logic isolated from Vue
* scale naturally as the application grows
* promote maintainability and testability
* encourage modular thinking and clean boundaries

---

# Core Architectural Principles

## 1. Modular architecture by business area

The application is organized by functional modules.

Example:

```txt
features/tasks
```

A module contains:

* domain
* application use cases
* API access
* state
* composables
* UI
* routes
* tests

The module is the main unit of cohesion.

---

## 2. Vue is not the center of the architecture

Vue is responsible for:

* rendering
* reactivity
* UI orchestration

Business logic should not depend on:

* Vue components
* Pinia
* router
* UI details

---

## 3. Domain first

Domain objects are pure JavaScript.

They:

* represent business concepts
* contain behavior — domain classes should not be anemic
* do not contain Vue reactivity
* do not know APIs
* do not know UI

Domain classes encapsulate their own rules and return new instances when state changes (immutable updates).

Avoid plain data objects with no behavior for concepts that have real business rules.

Example:

```js
export class Task {
  constructor({ id, title, description = '', completed = false }) {
    this.id = id
    this.title = title
    this.description = description
    this.completed = completed
  }

  toggle() {
    return new Task({
      id: this.id,
      title: this.title,
      description: this.description,
      completed: !this.completed,
    })
  }

  isValid() {
    return this.title.trim().length > 0
  }
}
```

---

## 4. Use cases orchestrate business operations

Use cases live in:

```txt
application/
```

Examples:

```txt
listTasks.js
createTask.js
toggleTask.js
deleteTask.js
```

Use cases:

* coordinate business flow
* use repositories
* contain application behavior
* do not contain Vue logic
* do not contain UI logic

Example:

```js
import { httpTaskRepository } from '../api/httpTaskRepository'

export async function listTasks() {
  return httpTaskRepository.findAll()
}
```

---

## 5. API layer adapts external data

The API layer is responsible for:

* HTTP calls via Axios
* DTO mapping
* adapting external data to domain objects

Structure:

```txt
api/
  taskApi.js
  httpTaskRepository.js
```

Example responsibilities:

```txt
taskApi.js
```

Low-level HTTP communication. Wraps Axios, knows the endpoint URLs.

```txt
httpTaskRepository.js
```

Transforms API response DTOs into domain objects. Always returns `Task` instances, never raw API shapes.

Example:

```js
// httpTaskRepository.js
import { taskApi } from './taskApi'
import { Task } from '../domain/Task'

export const httpTaskRepository = {
  async findAll() {
    const data = await taskApi.getAll()

    return data.map((dto) => new Task(dto))
  },
}
```

> When no backend exists yet, replace `httpTaskRepository` with an `inMemoryTaskRepository` or `localStorageTaskRepository` that satisfies the same interface. Use cases remain unchanged.

---

## 6. Composables adapt use cases to Vue

Composable responsibilities:

* reactivity
* loading states
* error handling
* UI orchestration

Composable responsibilities DO NOT include:

* business rules
* persistence logic
* domain logic

Illustrative example:

```js
// composables/useTasks.js
import { ref } from 'vue'
import { listTasks } from '../application/listTasks'

export function useTasks() {
  const tasks = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function load() {
    isLoading.value = true

    try {
      tasks.value = await listTasks()
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  return {
    tasks,
    isLoading,
    error,
    load,
  }
}
```

---

## 7. State belongs to the module

Pinia stores live inside their module.

Example:

```txt
features/tasks/store/useTasksStore.js
```

Global application setup (router instantiation, Pinia setup) belongs in:

* `main.js`
* `app/router/index.js`

No dedicated Pinia bootstrap file is needed.

---

## 8. Routes are modular

Each module owns its routes.

Example:

```txt
features/tasks/router/routes.js
```

The global router only aggregates routes.

---

# Final Project Structure

```txt
src/
  App.vue
  # Root Vue component

  main.js
  # Application entry point
  # Bootstraps Vue, Pinia, Router and global styles

  app/
    # Global application setup and composition

    router/
      index.js
      # Creates and exports router instance

      routes.js
      # Aggregates routes from all features

  features/
    # Business modules organized by functional area

    tasks/
      # Tasks module

      domain/
        Task.js
        # Rich domain class
        # No Vue, no API knowledge

      application/
        listTasks.js
        createTask.js
        toggleTask.js
        deleteTask.js

      api/
        taskApi.js
        # Low-level HTTP communication
        # Knows endpoints and Axios

        httpTaskRepository.js
        # Maps DTOs to Task domain objects

      composables/
        useTasks.js
        useCreateTask.js

      store/
        useTasksStore.js

      router/
        routes.js
        # Routes owned by this feature

      views/
        # Router-connected pages/screens

        TasksView.vue
        NewTaskView.vue

      components/
        # Presentational components of this feature

        TaskList.vue
        TaskItem.vue
        CompletedPanel.vue
        TaskForm.vue

      __tests__/
        domain/
        application/
        composables/
        store/
        views/
        components/

  shared/
    # Cross-feature reusable technical/UI code
    # Must remain business-agnostic

    ui/
      AppButton.vue
      AppInput.vue

    lib/
      # Generic utility helpers

      date.js

    config/
      # Shared configuration

      env.js

  design/
    # Visual system of the application

    styles/
      main.css
      reset.css
      typography.css

    tokens/
      colors.css
      spacing.css
      radius.css

    themes/
      light.css
      dark.css
```

---

# Dependency Direction

The dependency flow should remain:

```txt
UI
 ↓
Composables
 ↓
Application
 ↓
Domain
```

Technical details remain isolated in the API layer.

---

# Import Conventions

Prefer absolute imports using the `@` alias.

Good:

```js
import { Task } from '@/features/tasks/domain/Task'
```

Avoid:

```js
import { Task } from '../../../domain/Task'
```

---

# Domain Immutability

Domain entities should prefer immutable updates.

Good:

```js
const updatedTask = task.toggle()
```

Avoid:

```js
task.completed = true
```

Immutable updates make domain behavior:

* more predictable
* easier to test
* easier to reason about

---

# Store Responsibility

Stores coordinate reactive application state.

Stores should remain thin orchestration/state layers.

Avoid placing:

* business rules
* HTTP calls
* DTO mapping

inside stores.

---

# Naming Conventions

## Use cases

Use verbs:

```txt
createTask
listTasks
toggleTask
deleteTask
```

---

## Composables

Always start with `use`.

Examples:

```txt
useTasks
useCreateTask
```

---

## Stores

```txt
useTasksStore
```

---

## Vue components

Use PascalCase:

```txt
TaskList.vue
TaskItem.vue
CreateTaskForm.vue
```

---

# Testing Philosophy

Test behavior, not implementation.

Preferred testing focus:

* domain behavior
* use case behavior
* composable behavior
* UI interactions

Avoid:

* testing framework internals
* testing private implementation details
* tightly coupling tests to component structure

---

# Anti-Patterns To Avoid

## DO NOT organize globally by technical type

Bad:

```txt
components/
services/
repositories/
stores/
```

This breaks module cohesion.

Keep everything related to a business feature inside its own `features/<name>/` module.

---

## DO NOT place business logic inside Vue components

Bad:

```vue
onClick => fetch + validate + mutate + business rules
```

---

## DO NOT mix API concerns with UI

Components should not:

* call fetch directly
* know endpoints
* transform DTOs

---

# Architectural Goal

The architecture should allow the application to grow naturally without major rewrites.

The structure should support future additions such as:

* filters
* search
* persistence
* authentication
* synchronization
* offline support
* drag & drop

while keeping the codebase understandable and maintainable.

---

# References

* [Feature-Sliced Design](https://feature-sliced.design/?utm_source=chatgpt.com) — Frontend architecture methodology organized by business functionality
* [Vue Style Guide (Official)](https://vuejs.org/style-guide/?utm_source=chatgpt.com) — Naming, structure and Vue conventions
* [Pinia Documentation](https://pinia.vuejs.org/core-concepts/?utm_source=chatgpt.com) — Official store patterns and best practices
* [Vue Router Lazy Loading](https://router.vuejs.org/guide/advanced/lazy-loading.html?utm_source=chatgpt.com) — Route-based code splitting and modular routing
* [Vitest Documentation](https://vitest.dev/guide/?utm_source=chatgpt.com) — Testing framework for unit and component testing
* [Cypress Best Practices](https://docs.cypress.io/app/core-concepts/best-practices?utm_source=chatgpt.com) — End-to-end and ATDD testing practices
* [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2011/11/22/Clean-Architecture.html?utm_source=chatgpt.com) — Foundational architecture principles adapted to frontend development
