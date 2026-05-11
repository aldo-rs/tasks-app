<script setup>
import { ref } from 'vue'
import { IonIcon } from '@ionic/vue'
import { chevronDownOutline } from 'ionicons/icons'
import TaskItem from './TaskItem.vue'

const isCompletedCollapsed = ref(false)

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
    <ul v-if="pendingTasks.length > 0" class="task-list__group">
      <li v-for="task in pendingTasks" :key="task.id">
        <TaskItem :task="task" />
      </li>
    </ul>

    <!-- Completed tasks -->
    <button
      v-if="completedTasks.length > 0"
      type="button"
      class="task-list__completed-header"
      :class="{ 'task-list__completed-header--with-pending': pendingTasks.length > 0 }"
      @click="isCompletedCollapsed = !isCompletedCollapsed"
    >
      <IonIcon
        :icon="chevronDownOutline"
        class="task-list__completed-icon"
        :class="{ 'task-list__completed-icon--collapsed': isCompletedCollapsed }"
      />
      <span>Completadas ({{ completedTasks.length }})</span>
    </button>

    <ul
      v-if="completedTasks.length > 0"
      v-show="!isCompletedCollapsed"
      class="task-list__group task-list__group--completed"
    >
      <li v-for="task in completedTasks" :key="task.id">
        <TaskItem :task="task" />
      </li>
    </ul>

    <!-- Empty state -->
    <div v-if="pendingTasks.length === 0 && completedTasks.length === 0" class="task-list__empty">
      <p class="task-list__empty-text">No tienes tareas pendientes</p>
      <p class="task-list__empty-hint">Pulsa + para añadir tu primera tarea</p>
    </div>
  </div>
</template>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.task-list__group {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.task-list__group--completed {
  margin-top: 0;
}

.task-list__completed-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-xs);
  width: 100%;
  padding: var(--space-xs) 0;
  border: none;
  background: transparent;
  font-family: 'Poppins', var(--font-family);
  font-size: 0.95rem;
  font-weight: 400;
  color: #1a1a1a;
}

.task-list__completed-header--with-pending {
  margin-top: var(--space-md);
}

.task-list__completed-icon {
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.task-list__completed-icon--collapsed {
  transform: rotate(-90deg);
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
