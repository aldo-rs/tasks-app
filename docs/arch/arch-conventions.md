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
* infrastructure
* dependencies composition
* reactive state
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

Vue should remain mostly isolated inside:

```txt
views/
components/
composables/
store/
```

---

## 3. Domain first

Domain objects are pure JavaScript.

They:

* represent business concepts
* contain behavior
* should not be anemic
* do not contain Vue reactivity
* do not know APIs
* do not know stores
* do not know UI

Domain classes encapsulate their own rules and prefer immutable updates.

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
* do not know Pinia

Use cases should depend on abstractions/repositories, not infrastructure details.

---

## 5. Infrastructure adapts external systems

Infrastructure is responsible for:

* HTTP calls
* Axios
* LocalStorage
* IndexedDB
* external APIs
* DTO mapping

Structure:

```txt
infrastructure/
  taskApi.js
  httpTaskRepository.js
```

Example responsibilities:

```txt
taskApi.js
```

Low-level HTTP communication. Knows endpoints and Axios.

```txt
httpTaskRepository.js
```

Maps DTOs into domain objects and implements repository contracts.

Example:

```js
import { taskApi } from './taskApi'
import { Task } from '../domain/Task'

export class HttpTaskRepository {
  async findAll() {
    const data = await taskApi.getAll()

    return data.map((dto) => new Task(dto))
  }
}
```

> When no backend exists yet, infrastructure can be replaced with:
>
> * `inMemoryTaskRepository`
> * `localStorageTaskRepository`
>
> without changing use cases.

---

## 6. Dependencies are assembled manually

Dependencies are composed explicitly using manual dependency composition.

Structure:

```txt
dependencies/
  createTasksDependencies.js
```

Example:

```js
const repository =
  new HttpTaskRepository(taskApi)

const toggleTaskUseCase =
  new ToggleTaskUseCase(repository)
```

The dependencies layer acts as the:

```txt
Composition Root
```

of the module.

This keeps:

* infrastructure outside Vue
* use cases decoupled
* dependencies explicit
* testing simple

Avoid complex DI containers unless the application truly needs them.

Frontend applications usually benefit more from:

```txt
explicit composition
```

than from:

```txt
runtime dependency injection magic
```

---

## 7. Composables adapt business flows to Vue

Composable responsibilities:

* UI orchestration
* reactive state adaptation
* loading states
* error handling
* coordinating use cases
* updating stores

Composable responsibilities DO NOT include:

* business rules
* persistence logic
* HTTP logic
* DTO mapping

Example:

```js
import { useTasksStore } from '../store/useTasksStore'
import { useTasksDependencies } from '../dependencies/createTasksDependencies'

export function useTasksViewModel() {

  const store = useTasksStore()

  const {
    toggleTaskUseCase,
  } = useTasksDependencies()

  async function toggleTask(task) {

    const updatedTask =
      await toggleTaskUseCase.execute(task)

    store.updateTask(updatedTask)
  }

  return {
    tasks: store.tasks,
    toggleTask,
  }
}
```

Composable/ViewModel is the boundary between:

```txt
Vue world
```

and:

```txt
business/application world
```

---

## 8. Store responsibility

Stores are reactive application state containers.

Stores belong to:

```txt
UI/Application reactive layer
```

not to:

* domain
* application
* infrastructure

Pinia is a Vue concern.

Therefore stores should remain isolated from business logic.

---

## 9. What stores SHOULD contain

Stores may contain:

* reactive shared state
* derived/computed state
* thin state update operations

Example:

```js
tasks
selectedTask
filters
pendingTasks
completedTasks
```

Store update example:

```js
function updateTask(updatedTask) {
  tasks.value = tasks.value.map(task =>
    task.id === updatedTask.id
      ? updatedTask
      : task
  )
}
```

---

## 10. What stores SHOULD NOT contain

Avoid placing inside stores:

* business rules
* HTTP calls
* Axios
* DTO mapping
* complex orchestration
* domain invariants

Bad:

```js
await axios.post(...)
```

inside store actions.

Bad:

```js
store.closeMonthlyAccounting()
```

if it contains real business logic.

---

## 11. Who updates the store?

Composable/ViewModel updates the store.

Correct flow:

```txt
View
 ↓
Composable/ViewModel
 ↓
Use Case
 ↓
Repository
 ↓
Infrastructure/API
 ↓
Composable/ViewModel
 ↓
Store.update()
 ↓
Vue reactive rerender
```

The store should behave like:

```txt
reactive application memory
```

not like:

```txt
backend service layer
```

---

## 12. State belongs to the module

Pinia stores live inside their module.

Example:

```txt
features/tasks/store/useTasksStore.js
```

Global application setup belongs in:

* `main.js`
* `app/router/index.js`

No dedicated Pinia bootstrap file is needed.

---

## 13. Routes are modular

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

  main.js

  app/
    router/
      index.js
      routes.js

  features/

    tasks/

      domain/
        Task.js

      application/
        listTasks.js
        createTask.js
        toggleTask.js
        deleteTask.js

      infrastructure/
        taskApi.js
        httpTaskRepository.js

      dependencies/
        createTasksDependencies.js

      composables/
        useTasksViewModel.js

      store/
        useTasksStore.js

      router/
        routes.js

      views/
        TasksView.vue
        NewTaskView.vue

      components/
        TaskItem.vue
        TaskSection.vue
        TaskForm.vue

      __tests__/
        domain/
        application/
        composables/
        store/
        views/
        components/

  shared/

    ui/
      AppButton.vue
      AppInput.vue

    lib/
      date.js

    config/
      env.js

  design/

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
View
 ↓
Composable/ViewModel
 ↓
Application
 ↓
Domain
```

Technical details remain isolated in:

```txt
infrastructure/
```

Dependencies are assembled from:

```txt
dependencies/
```

Stores remain orthogonal reactive state containers.

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

* predictable
* testable
* easier to reason about

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
useTasksViewModel
useCreateTaskViewModel
```

---

## Stores

```txt
useTasksStore
```

---

## Dependencies composition

```txt
createTasksDependencies
```

---

## Vue components

Use PascalCase:

```txt
TaskList.vue
TaskItem.vue
TaskForm.vue
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

Keep everything related to a business feature inside its own module.

---

## DO NOT place business logic inside Vue components

Bad:

```vue
onClick => fetch + validate + mutate + business rules
```

---

## DO NOT mix infrastructure with UI

Components and composables should not:

* call Axios directly
* know endpoints
* transform DTOs

---

## DO NOT turn Pinia into a god service

Avoid:

```txt
Store → HTTP → business → orchestration → state
```

Stores should remain:

```txt
reactive state containers
```

not:

```txt
application service layers
```

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

while keeping the codebase understandable, testable and maintainable.

---

# References

* [Feature-Sliced Design](https://feature-sliced.design/?utm_source=chatgpt.com)
* [Vue Style Guide (Official)](https://vuejs.org/style-guide/?utm_source=chatgpt.com)
* [Pinia Documentation](https://pinia.vuejs.org/core-concepts/?utm_source=chatgpt.com)
* [Vue Router Lazy Loading](https://router.vuejs.org/guide/advanced/lazy-loading.html?utm_source=chatgpt.com)
* [Vitest Documentation](https://vitest.dev/guide/?utm_source=chatgpt.com)
* [Cypress Best Practices](https://docs.cypress.io/app/core-concepts/best-practices?utm_source=chatgpt.com)
* [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2011/11/22/Clean-Architecture.html?utm_source=chatgpt.com)
