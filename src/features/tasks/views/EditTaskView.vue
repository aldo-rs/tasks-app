<script setup>
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ellipsisVertical } from 'ionicons/icons'
import { Task } from '../domain/Task.js'
import { useTasksStore } from '../store/useTasksStore.js'

const route = useRoute()
const router = useRouter()
const store = useTasksStore()

const title = ref('')
const description = ref('')
const isMenuOpen = ref(false)
const menuContainerRef = ref(null)

const taskId = computed(() => String(route.params.id ?? ''))
const isFormValid = computed(() => title.value.trim().length > 0)

watchEffect(() => {
  const task = store.getTaskById(taskId.value)

  if (!task) {
    router.replace('/')
    return
  }

  title.value = task.title
  description.value = task.description
})

function clearFocus() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}

function closeMenu() {
  isMenuOpen.value = false
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function getMenuContainerElement() {
  const refValue = menuContainerRef.value
  if (!refValue) return null
  return refValue.$el ?? refValue
}

function handleOutsideInteraction(event) {
  if (!isMenuOpen.value) return

  const path = typeof event.composedPath === 'function' ? event.composedPath() : []
  const containerEl = getMenuContainerElement()
  const clickedInsideMenu = containerEl ? path.includes(containerEl) : false

  if (!clickedInsideMenu) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleOutsideInteraction, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleOutsideInteraction, true)
})

function saveTask() {
  if (!isFormValid.value) return

  const currentTask = store.getTaskById(taskId.value)
  if (!currentTask) return

  const updatedTask = new Task({
    id: currentTask.id,
    title: title.value.trim(),
    description: description.value.trim(),
    completed: currentTask.completed,
  })

  closeMenu()
  clearFocus()
  store.updateTask(updatedTask)
  router.push('/')
}

function deleteCurrentTask() {
  closeMenu()
  clearFocus()
  store.deleteTask(taskId.value)
  router.push('/')
}
</script>

<template>
  <IonPage>
    <IonHeader class="edit-task-header">
      <IonToolbar class="edit-task-toolbar">
        <IonButtons slot="start" class="edit-task-toolbar-side">
          <IonBackButton default-href="/" text="" class="edit-task-back-button" />
        </IonButtons>

        <IonTitle class="edit-task-title">Editar tarea</IonTitle>

        <IonButtons ref="menuContainerRef" slot="end" class="edit-task-toolbar-side edit-task-toolbar-side--menu">
          <IonButton fill="clear" class="edit-task-menu-button" @click.stop="toggleMenu">
            <IonIcon :icon="ellipsisVertical" />
          </IonButton>

          <div
            v-if="isMenuOpen"
            class="edit-task-inline-menu"
            role="menu"
            aria-label="Opciones de tarea"
            @pointerdown.stop
            @click.stop
          >
            <button type="button" class="edit-task-menu-delete" @click.stop="deleteCurrentTask">Eliminar</button>
          </div>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent class="edit-task-content">
      <form class="edit-task-form" @submit.prevent="saveTask">
        <div class="edit-task-field">
          <label class="edit-task-label" for="task-name">Nombre</label>
          <IonInput
            id="task-name"
            v-model="title"
            class="edit-task-input"
            placeholder="Ej: Revisar documentos"
            :maxlength="100"
            autocomplete="off"
          />
        </div>

        <div class="edit-task-field">
          <label class="edit-task-label" for="task-description">Descripción</label>
          <IonTextarea
            id="task-description"
            v-model="description"
            class="edit-task-textarea"
            placeholder="Describe los detalles de la tarea"
            :maxlength="100"
            :rows="4"
          />
          <p class="edit-task-hint">Máximo 100 caracteres</p>
        </div>

        <IonButton class="edit-task-submit" type="submit" expand="block" :disabled="!isFormValid">
          Guardar
        </IonButton>
      </form>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.edit-task-header,
.edit-task-toolbar {
  border: 0;
  box-shadow: none;
}

.edit-task-toolbar {
  --background: var(--color-bg);
  --min-height: 72px;
  --border-width: 0;
  --border-color: transparent;
  --box-shadow: none;
  overflow: visible;
}

.edit-task-toolbar::part(container) {
  overflow: visible;
}

:deep(ion-header.edit-task-header) {
  overflow: visible;
}

.edit-task-header::after,
.edit-task-toolbar::after,
:deep(ion-header.edit-task-header.header-ios)::after,
:deep(ion-header.edit-task-header.header-md)::after,
:deep(ion-toolbar.edit-task-toolbar.toolbar-ios)::after,
:deep(ion-toolbar.edit-task-toolbar.toolbar-md)::after {
  display: none !important;
  height: 0 !important;
  background: none !important;
  box-shadow: none !important;
  border: 0 !important;
}

.edit-task-title {
  text-align: center;
  font-family: var(--font-family);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  padding-inline: 0;
}

.edit-task-toolbar-side {
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-task-toolbar-side--menu {
  position: relative;
  overflow: visible;
}

.edit-task-back-button,
.edit-task-menu-button {
  margin: 0;
  --color: var(--color-text);
}

.edit-task-content {
  --background: var(--color-bg);
  --padding-top: var(--space-lg);
  --padding-start: var(--space-lg);
  --padding-end: var(--space-lg);
  --padding-bottom: var(--space-2xl);
}

.edit-task-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.edit-task-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.edit-task-label {
  font-family: var(--font-family);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text);
}

.edit-task-input,
.edit-task-textarea {
  --background: var(--color-bg);
  --border-width: 0;
  --color: var(--color-text);
  --highlight-height: 0;
  --highlight-color-focused: transparent;
  --placeholder-color: var(--color-text-muted);
  --padding-start: var(--space-md);
  --padding-end: var(--space-md);
  --padding-top: 14px;
  --padding-bottom: 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-family: var(--font-family);
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.edit-task-input:focus-within,
.edit-task-textarea:focus-within {
  border-color: var(--color-primary);
}

.edit-task-hint {
  margin: 0;
  font-family: var(--font-family);
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.edit-task-submit {
  --background: var(--color-primary);
  --background-activated: var(--color-primary-hover);
  --background-disabled: var(--color-primary-disabled);
  --color: #ffffff;
  --border-radius: 30px;
  --box-shadow: none;
  font-family: var(--font-family);
  font-size: 0.95rem;
  font-weight: 600;
  height: 48px;
  text-transform: none;
  margin-top: var(--space-sm);
}

.edit-task-submit::part(native) {
  border-radius: 30px;
}

.edit-task-inline-menu {
  position: absolute;
  right: 0;
  min-width: 140px;
  padding: var(--space-xs);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: var(--color-bg);
  box-shadow: none;
  z-index: 20;
}

.edit-task-menu-delete {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--color-text);
  text-align: left;
  padding: var(--space-sm) var(--space-md);
  border-radius: 10px;
  font-size: 0.95rem;
  cursor: pointer;
}
</style>
