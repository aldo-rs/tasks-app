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

* business model
* business services/use cases
* API/infrastructure access
* dependency composition
* presentation layer
* routes

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

Vue should remain isolated inside:

```txt
presentation/
```

---

## 3. Presentation layer

The presentation layer contains everything related to Vue/Ionic and user interaction.

Structure:

```txt
presentation/
  views/
  components/
  composables/
  store/
```

Responsibilities include:

* rendering
* reactive orchestration
* state synchronization
* user interaction
* screen state
* component composition

This layer acts as the boundary between:

```txt
Vue world
```

and:

```txt
business world
```

---

## 4. Domain first

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

## 5. Services orchestrate business operations

Services live in:

```txt
services/
```

Examples:

```txt
listTasks.js
createTask.js
toggleTask.js
deleteTask.js
```

Services:

* coordinate business flow
* use repositories
* contain application behavior
* do not contain Vue logic
* do not contain UI logic
* do not know Pinia

Services should depend on abstractions/repositories, not infrastructure details.

---

## 6. API layer adapts external systems

API layer responsibilities:

* HTTP calls
* Axios
* LocalStorage
* IndexedDB
* external APIs
* DTO mapping

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

Low-level HTTP communication. Knows endpoints and Axios.

```txt
httpTaskRepository.js
```

Maps DTOs into domain objects and implements repository contracts.

Example:

```js
import { taskApi } from './taskApi'
import { Task } from '../model/Task'

export class HttpTaskRepository {
  async findAll() {
    const data = await taskApi.getAll()

    return data.map((dto) => new Task(dto))
  }
}
```

> When no backend exists yet, API implementations can be replaced with:
>
> * `inMemoryTaskRepository`
> * `localStorageTaskRepository`
>
> without changing services.

---

## 7. Dependencies are assembled manually

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

const toggleTaskService =
  new ToggleTaskService(repository)
```

The dependencies layer acts as the:

```txt
Composition Root
```

of the module.

This keeps:

* infrastructure outside Vue
* services decoupled
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

## 8. Composables adapt business flows to Vue

Composable responsibilities:

* UI orchestration
* reactive state adaptation
* loading states
* error handling
* coordinating services
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
    toggleTaskService,
  } = useTasksDependencies()

  async function toggleTask(task) {

    const updatedTask =
      await toggleTaskService.execute(task)

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
business world
```

---

## 9. Store responsibility

Stores are reactive application state containers.

Stores belong to:

```txt
presentation layer
```

not to:

* model
* services
* api

Pinia is a Vue concern.

Therefore stores should remain isolated from business logic.

---

## 10. What stores SHOULD contain

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

## 11. What stores SHOULD NOT contain

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

## 12. Who updates the store?

Composable/ViewModel updates the store.

Correct flow:

```txt
View
 ↓
Composable/ViewModel
 ↓
Service
 ↓
Repository
 ↓
API
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

## 13. State belongs to the module

Pinia stores live inside their module.

Example:

```txt
features/tasks/presentation/store/useTasksStore.js
```

Global application setup belongs in:

* `main.js`
* `app/router/index.js`

No dedicated Pinia bootstrap file is needed.

---

## 14. Routes are modular

Each module owns its routes.

Example:

```txt
features/tasks/routes.js
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
      model/
        Task.js
        Task.test.js

      services/
        listTasks.js
        listTasks.test.js
        createTask.js
        createTask.test.js
        toggleTask.js
        toggleTask.test.js
        deleteTask.js
        deleteTask.test.js

      api/
        taskApi.js
        httpTaskRepository.js

      dependencies/
        createTasksDependencies.js

      presentation/
        routes.js

        views/
          TasksView.vue
          TasksView.test.js
          NewTaskView.vue
          NewTaskView.test.js

        components/
          TaskItem.vue
          TaskItem.test.js
          TaskSection.vue
          TaskSection.test.js
          TaskForm.vue
          TaskForm.test.js

        composables/
          useTasksViewModel.js
          useTasksViewModel.test.js

        store/
          useTasksStore.js
          useTasksStore.test.js

  shared/
    components/
      AppButton.vue
      AppInput.vue

    composables/

    services/

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

# Testing Philosophy

Test behavior, not implementation.

Preferred testing focus:

* domain behavior
* service behavior
* composable behavior
* UI interactions

Avoid:

* testing framework internals
* testing private implementation details
* tightly coupling tests to component structure

---

# Test Location Convention

Unit tests should live close to the implementation they validate.

Good:

```txt
Task.js
Task.test.js
```

Good:

```txt
useTasksViewModel.js
useTasksViewModel.test.js
```

Good:

```txt
TaskItem.vue
TaskItem.test.js
```

Avoid centralized test folders like:

```txt
__tests__/
```

Keeping tests near their implementation improves:

* discoverability
* maintainability
* refactoring safety
* module cohesion

---

# Dependency Direction

The dependency flow should remain:

```txt
View
 ↓
Composable/ViewModel
 ↓
Service
 ↓
Model
```

Technical details remain isolated in:

```txt
api/
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
import { Task } from '@/features/tasks/model/Task'
```

Avoid:

```js
import { Task } from '../../../model/Task'
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

## Services

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

## DO NOT mix API/infrastructure with presentation

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

* [Feature-Sliced Design](https://feature-sliced.design?utm_source=chatgpt.com)
* [Vue Style Guide (Official)](https://vuejs.org/style-guide/?utm_source=chatgpt.com)
* [Pinia Documentation](https://pinia.vuejs.org/core-concepts/?utm_source=chatgpt.com)
* [Vue Router Lazy Loading](https://router.vuejs.org/guide/advanced/lazy-loading.html?utm_source=chatgpt.com)
* [Vitest Documentation](https://vitest.dev/guide/?utm_source=chatgpt.com)
* [Cypress Best Practices](https://docs.cypress.io/app/core-concepts/best-practices?utm_source=chatgpt.com)
* [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2011/11/22/Clean-Architecture.html?utm_source=chatgpt.com)
