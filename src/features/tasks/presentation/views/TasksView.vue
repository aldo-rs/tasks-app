<script setup>
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { add } from 'ionicons/icons'
import { useTasksStore } from '../store/useTasksStore'
import TaskList from '../components/TaskList.vue'

const router = useRouter()
const store = useTasksStore()
</script>

<template>
  <IonPage>
    <IonHeader class="tasks-header">
      <IonToolbar class="tasks-toolbar">
        <IonTitle class="tasks-title">Mis Tareas</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent class="tasks-content">
      <TaskList
        :pending-tasks="store.pendingTasks"
        :completed-tasks="store.completedTasks"
        @toggle-task="store.toggleTask"
        @edit-task="(id) => router.push({ name: 'tasks.edit', params: { id } })"
      />

      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton
          class="tasks-fab"
          color="pdm-primary"
          aria-label="Añadir tarea"
          @click="router.push({ name: 'tasks.new' })"
        >
          <IonIcon :icon="add" />
        </IonFabButton>
      </IonFab>
    </IonContent>
  </IonPage>
</template>

<style scoped>
ion-fab {
  margin-bottom: var(--ion-safe-area-bottom, 0);
}

.tasks-header,
.tasks-toolbar {
  border: 0;
  box-shadow: none;
}

.tasks-toolbar {
  --background: var(--color-bg);
  --min-height: 72px;
  --border-width: 0;
  --border-color: transparent;
  --box-shadow: none;
}

/* Ionic can draw the divider with pseudo-elements (mode-specific). */
.tasks-header::after,
.tasks-toolbar::after,
:deep(ion-header.tasks-header.header-ios)::after,
:deep(ion-header.tasks-header.header-md)::after,
:deep(ion-toolbar.tasks-toolbar.toolbar-ios)::after,
:deep(ion-toolbar.tasks-toolbar.toolbar-md)::after {
  display: none !important;
  height: 0 !important;
  background: none !important;
  box-shadow: none !important;
  border: 0 !important;
}

.tasks-title {
  text-align: center;
  font-size: 1.6rem;
  font-weight: var(--font-weight-title);
  font-family: var(--font-family);
  color: var(--color-text);
  padding-inline: 0;
}

.tasks-fab {
  width: 64px;
  height: 64px;
  --border-radius: 50%;
}

.tasks-fab ion-icon {
  font-size: 30px;
}

/* Small per-mode tweak so title appears visually centered in iOS and MD */
:global(.ios) .tasks-title {
  transform: translateX(-2px);
}

:global(.md) .tasks-title {
  transform: translateX(-1px);
}

.tasks-content {
  --background: var(--color-bg);
  --padding-top: var(--space-sm);
  --padding-bottom: calc(var(--space-xl) + env(safe-area-inset-bottom));
  --padding-start: var(--space-md);
  --padding-end: var(--space-md);
}
</style>
