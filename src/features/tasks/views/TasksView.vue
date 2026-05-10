<script setup>
import { useTasksStore } from '../store/useTasksStore'
import TaskList from '../components/TaskList.vue'
import FloatingButton from '../../../shared/components/FloatingButton.vue'

const store = useTasksStore()
</script>

<template>
  <div class="tasks-view">
    <header class="tasks-header">
      <h1 class="tasks-title">Mis Tareas</h1>
    </header>

    <main class="tasks-content">
      <TaskList :pending-tasks="store.pendingTasks" :completed-tasks="store.completedTasks" />
    </main>

    <FloatingButton aria-label="Añadir tarea" />
  </div>
</template>

<style scoped>
.tasks-view {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background-color: var(--color-bg-soft);
}

.tasks-header {
  background-color: var(--color-bg);
  padding: var(--space-xl) var(--space-md) var(--space-md);
  text-align: center;
  border-bottom: 1px solid var(--color-bg-secondary);
}

.tasks-title {
  font-size: 1.5rem;
  font-weight: var(--font-weight-title);
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.tasks-content {
  flex: 1;
  padding: var(--space-md);
}
</style>
