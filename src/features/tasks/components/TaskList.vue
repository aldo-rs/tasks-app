<script setup>
defineProps({
  pendingTasks: {
    type: Array,
    required: true,
  },
  completedTasks: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="task-list">
    <!-- Pending tasks -->
    <ul v-if="pendingTasks.length > 0">
      <li v-for="task in pendingTasks" :key="task.id">
        <TaskItem :task="task" />
      </li>
    </ul>

    <!-- Empty state -->
    <div v-else class="task-list__empty">
      <p class="task-list__empty-text">No tienes tareas pendientes</p>
      <p class="task-list__empty-hint">Pulsa + para añadir tu primera tarea</p>
    </div>
  </div>
</template>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.task-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-2xl) var(--space-md);
  text-align: center;
}

.task-list__empty-text {
  font-size: 1rem;
  font-weight: var(--font-weight-label);
  color: var(--color-text);
}

.task-list__empty-hint {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>
