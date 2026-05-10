# Copilot Instructions

## Project context

This repository is a learning-oriented frontend POC for a simple tasks-app.

The goal is to learn and practice a modern frontend stack while building a small, well-structured application.

Current and planned stack for this project:
- Vue 3
- Vite
- JavaScript first, with TypeScript only if explicitly introduced later
- Pinia
- Vue Router
- Ionic for UI and mobile-first layouts when it adds value
- Axios for HTTP communication when API access is needed
- Vitest for unit and component tests
- Cypress for end-to-end tests

Prioritize:
- clarity over cleverness
- simplicity over abstraction
- maintainability over premature architecture
- conventional patterns over advanced patterns
- learning value over enterprise-style complexity

Follow `docs/AI/engineering-principles.md` as the complementary source of quality principles, especially KISS, YAGNI, SOLID, and behavior-focused testing.

## Project goal

This is a POC intended to learn the stack through a simple task management app.

When several valid solutions exist:
- prefer the most explicit and educational one
- prefer code that is easy to read and modify
- prefer small, incremental changes over big rewrites
- choose patterns that help understanding Vue, state management, routing, UI composition, Ionic, and API integration

Avoid unnecessary complexity.

## General principles

Follow these principles in every change:
- KISS: prefer the simplest solution that works
- YAGNI: do not add abstractions, libraries, files, or layers before they are needed
- SOLID: keep responsibilities clear and dependencies explicit
- Clean Code: use clear names, small functions, and readable structure
- Consistency: follow the existing project style before introducing a new one

Do not over-engineer.

## Working style

Before changing code:
- understand the current implementation and folder structure
- reuse existing patterns when they are good enough
- prefer small, safe, incremental changes
- avoid large refactors unless explicitly requested
- do not change routes, public APIs, contracts, or file structure without a clear reason

When implementing a feature:
- start from the user flow
- solve the current need first
- keep the diff focused
- explain important trade-offs briefly when relevant

When introducing Ionic or Axios:
- integrate them gradually
- avoid broad rewrites just to fit the new tool
- preserve readability and keep the learning path clear

## Architecture guidelines

Use separation of concerns pragmatically.

Prefer this progression:
- start simple with focused components and local state
- extract a composable when logic becomes reusable or hard to read
- introduce services, repositories, or adapters when API or persistence complexity justifies them
- isolate infrastructure details when external communication or storage becomes important

General guidance:
- Components should focus on rendering and user interaction
- Composables can manage reactive state and UI-facing logic
- Stores should hold shared application state, not every piece of local UI state
- Services or repositories can encapsulate Axios calls when HTTP integration appears
- Infrastructure code should isolate API, storage, or external service details

Avoid:
- business rules spread across multiple `.vue` components
- direct Axios calls deeply coupled to presentational components
- duplicated state
- hidden side effects
- generic abstractions with no immediate value

## Vue guidelines

Use Vue 3 Composition API and follow the patterns already present in the repository.

Prefer:
- `script setup`
- small and focused components
- explicit props and emits
- computed values for derived state
- local state for local UI concerns
- clear loading, empty, and error states

Avoid:
- oversized components
- unnecessary watchers
- mutating props
- complex logic inside templates
- mixing rendering concerns with business logic

## Ionic guidelines

Use Ionic when it improves the mobile-first user experience and stays consistent with the project.

Prefer:
- reusable UI patterns based on Ionic components when they provide clear value
- simple screen composition
- accessible interactions and clear navigation
- consistency with Ionic design patterns once introduced

Avoid:
- wrapping every small element in unnecessary abstractions
- mixing incompatible styling approaches without reason
- bypassing Ionic conventions unless there is a clear benefit

If Ionic is introduced:
- keep presentation concerns in UI components
- avoid embedding business logic into Ionic page components
- use Ionic components to improve usability, not to add visual complexity

## JavaScript / TypeScript guidance

Follow the language already used in the touched files.

Prefer:
- JavaScript in JavaScript areas of the project
- readable, explicit code
- practical typing only if TypeScript is explicitly introduced

Do not migrate files to TypeScript unless explicitly requested.

Avoid:
- unnecessary type-level complexity
- mixed JS/TS conventions without a clear reason
- clever patterns that reduce readability

## State management

Use the simplest state location that fits the need.

Prefer:
- local component state for isolated UI behavior
- composables for reusable reactive logic
- Pinia for shared state across components or views

Avoid:
- moving trivial local state into a global store
- duplicating the same source of truth across component state and stores

## Axios and API integration

Keep HTTP integration isolated and explicit.

Prefer:
- a focused API client or service layer for Axios-based communication
- centralizing base URL, headers, and common request configuration when needed
- mapping API responses into app-friendly shapes when useful
- explicit loading and error handling around requests

Avoid:
- spreading endpoint URLs across multiple components
- calling Axios directly from deeply nested UI components
- leaking backend response shapes everywhere if a small mapping layer improves clarity
- premature repository patterns if a simple service module is enough

If no backend exists yet:
- keep API integration easy to mock or replace
- prefer simple, incremental structures over full data layers

## Persistence guidelines

If local persistence is added, keep it simple.

Prefer:
- isolated modules for `localStorage` access
- clear serialization and deserialization boundaries
- graceful fallback when storage is unavailable or invalid

Avoid:
- scattering storage keys across the codebase
- mixing persistence details with rendering logic

## Styling and UX

Prioritize usability over visual complexity.

- design mobile-first when applicable
- keep screens simple and focused
- make primary actions obvious
- provide feedback for loading, success, empty, and error states
- maintain consistency with the existing styling approach
- if Ionic is used, align with Ionic interaction and layout patterns

Do not introduce a new styling solution unless explicitly requested or clearly necessary.

## Testing

Add or update tests when behavior changes.

Prefer:
- unit tests for pure logic, composables, store behavior, and service helpers
- component tests for meaningful UI behavior
- e2e tests for critical user flows

Prioritize tests for:
- creating a task
- preventing invalid task creation
- completing a task
- deleting a task
- filtering tasks
- persistence behavior if storage is introduced
- request success and failure flows if Axios-based integration is introduced

Tests should describe behavior, not implementation details.

Use clear names such as:
- should add a new task
- should prevent creating an empty task
- should mark a task as completed
- should show an error when loading tasks fails

Avoid overly brittle tests and snapshots unless they add clear value.

## Error handling

Always consider:
- loading state
- empty state
- form validation errors
- network errors
- storage errors when persistence exists
- unexpected errors

Do not silently ignore failures.

## Code quality

Before finishing a change:
- run or suggest relevant tests
- keep the diff small
- remove unused code
- avoid unrelated formatting changes
- avoid speculative abstractions
- ensure names are clear and consistent

## Documentation

Add comments only when they explain why something exists.

Do not comment obvious code.

Update `README.md` or project documentation when:
- setup changes
- scripts change
- architecture changes meaningfully
- Ionic or Axios integration changes developer workflow
- the app behavior no longer matches the default starter template

## AI collaboration rules

When asked to generate code:
- infer conventions from the repository instead of inventing them
- prefer incremental changes over large rewrites
- recommend the simplest safe option when several options exist
- explain important trade-offs briefly
- ask for clarification only when the requirement is genuinely ambiguous

When reviewing code:
- be direct
- separate critical issues from nice-to-have improvements
- focus on correctness, maintainability, architecture, and user impact

For this project specifically:
- optimize for learning value
- avoid premature enterprise layering
- keep examples practical and easy to evolve
- prefer explicit code over hidden magic

