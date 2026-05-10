<script setup>
defineProps({
  task: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="task-item" :class="{ 'task-item--completed': task.completed }">
    <button class="task-item__toggle" :aria-label="task.completed ? 'Marcar pendiente' : 'Marcar completada'">
      <span class="task-item__circle">
        <svg v-if="task.completed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </button>

    <div class="task-item__content">
      <p class="task-item__title">{{ task.title }}</p>
      <p v-if="task.description" class="task-item__description">{{ task.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  background-color: var(--color-bg);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: opacity 0.2s;
}

.task-item--completed {
  opacity: 0.6;
}

.task-item__toggle {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  padding: 0;
}

.task-item__circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-bg-secondary);
  color: var(--color-primary);
  transition: border-color 0.2s;
}

.task-item--completed .task-item__circle {
  border-color: var(--color-primary);
  background-color: transparent;
}

.task-item__circle svg {
  width: 14px;
  height: 14px;
}

.task-item__content {
  flex: 1;
  min-width: 0;
}

.task-item__title {
  font-size: 0.9375rem;
  font-weight: var(--font-weight-label);
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-item--completed .task-item__title {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.task-item__description {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
