<script setup>
const emit = defineEmits(['toggle', 'edit'])

defineProps({
  task: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="task-item" :class="{ 'task-item--completed': task.completed }">
    <button
      type="button"
      class="task-item__toggle"
      :class="{ 'task-item__toggle--completed': task.completed }"
      :aria-label="task.completed ? 'Marcar pendiente' : 'Marcar completada'"
      @click="emit('toggle', task.id)"
    >
      <span v-if="!task.completed" class="task-item__circle" />
      <span v-else class="task-item__check" aria-hidden="true">
        <svg
          class="task-item__check-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </button>

    <button type="button" class="task-item__content" @click="emit('edit', task.id)">
      <p class="task-item__title">{{ task.title }}</p>
      <p v-if="task.description" class="task-item__description">{{ task.description }}</p>
    </button>
  </div>
</template>

<style scoped>
.task-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  transition: background-color 0.2s;
}

.task-item--completed {
  background-color: var(--color-bg-soft);
  border-color: var(--color-border);
}

.task-item__toggle {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  margin-top: 2px;
  padding: 0;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-item__toggle--completed {
  width: 34px;
  height: 34px;
}

.task-item__circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-full);
  border: 2px solid #7e7e7e;
  color: var(--color-primary);
  transition: border-color 0.2s;
}

.task-item__check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--color-primary);
}

.task-item__check-icon {
  width: 32px;
  height: 32px;
}

.task-item__content {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 0;
  text-align: left;
  cursor: pointer;
}

.task-item__title {
  font-family: var(--font-family);
  font-size: 17px;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-item--completed .task-item__title {
  text-decoration: line-through;
  color: var(--color-text-completed);
}

.task-item__description {
  font-family: var(--font-family);
  font-size: 12px;
  font-weight: 300;
  color: var(--color-text);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-item--completed .task-item__description {
  color: var(--color-text-completed);
}
</style>
