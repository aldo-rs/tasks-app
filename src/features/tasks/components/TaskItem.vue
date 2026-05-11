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
    <button
      class="task-item__toggle"
      :class="{ 'task-item__toggle--completed': task.completed }"
      :aria-label="task.completed ? 'Marcar pendiente' : 'Marcar completada'"
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
  border: 1px solid #cdcdcd;
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  transition: background-color 0.2s;
}

.task-item--completed {
  background-color: #f8f9fa;
  border-color: #e0e0e0;
}

.task-item__toggle {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
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
  width: 28px;
  height: 28px;
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
  color: #565555;
}

.task-item__description {
  font-family: var(--font-family);
  font-size: 12px;
  font-weight: 300;
  color: #212121;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-item--completed .task-item__description {
  color: #565555;
}
</style>
