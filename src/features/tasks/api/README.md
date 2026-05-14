# Tasks API layer

Este folder contiene piezas de comunicacion HTTP con backend para el modulo de tareas.

- `tasksApi.js`: cliente HTTP explicito de endpoints (`list/create/update/delete`).
- Permite inyectar `httpClient` (ej: `fetch` real o mocks en tests).

Objetivo educativo: mantener el acceso a red aislado de componentes, store y logica de UI.
