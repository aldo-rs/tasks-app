<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonInput,
  IonTextarea,
  IonButton,
} from '@ionic/vue'
import { useCreateTask } from '../composables/useCreateTask.js'

const { title, description, isFormValid, submit } = useCreateTask()
</script>

<template>
  <IonPage>
    <IonHeader class="new-task-header">
      <IonToolbar class="new-task-toolbar">
        <IonButtons slot="start" class="new-task-toolbar-side">
          <IonBackButton default-href="/" text="" class="new-task-back-button" />
        </IonButtons>
        <IonTitle class="new-task-title">Nueva Tarea</IonTitle>
        <IonButtons slot="end" class="new-task-toolbar-side" aria-hidden="true" />
      </IonToolbar>
    </IonHeader>

    <IonContent class="new-task-content">
      <form class="new-task-form" @submit.prevent="submit">

        <div class="new-task-field">
          <label class="new-task-label" for="task-name">Nombre</label>
          <IonInput
            id="task-name"
            v-model="title"
            class="new-task-input"
            placeholder="Ej: Revisar documentos"
            :maxlength="100"
            autocomplete="off"
          />
        </div>

        <div class="new-task-field">
          <label class="new-task-label" for="task-description">Descripción</label>
          <IonTextarea
            id="task-description"
            v-model="description"
            class="new-task-textarea"
            placeholder="Describe los detalles de la tarea"
            :maxlength="100"
            :rows="4"
          />
          <p class="new-task-hint">Máximo 100 caracteres</p>
        </div>

        <IonButton
          class="new-task-submit"
          type="submit"
          expand="block"
          :disabled="!isFormValid"
        >
          Guardar
        </IonButton>

      </form>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.new-task-header,
.new-task-toolbar {
  border: 0;
  box-shadow: none;
}

.new-task-toolbar {
  --background: var(--color-bg);
  --min-height: 72px;
  --border-width: 0;
  --border-color: transparent;
  --box-shadow: none;
}

/* Ionic can draw the divider with pseudo-elements (mode-specific). */
.new-task-header::after,
.new-task-toolbar::after,
:deep(ion-header.new-task-header.header-ios)::after,
:deep(ion-header.new-task-header.header-md)::after,
:deep(ion-toolbar.new-task-toolbar.toolbar-ios)::after,
:deep(ion-toolbar.new-task-toolbar.toolbar-md)::after {
  display: none !important;
  height: 0 !important;
  background: none !important;
  box-shadow: none !important;
  border: 0 !important;
}

.new-task-title {
  text-align: center;
  font-family: var(--font-family);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  padding-inline: 0;
}

.new-task-toolbar-side {
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-task-back-button {
  margin: 0;
  --color: var(--color-text);
}

/* Small per-mode tweak so title appears visually centered in iOS and MD */
:global(.ios) .new-task-title {
  transform: translateX(-2px);
}

:global(.md) .new-task-title {
  transform: translateX(-1px);
}

.new-task-content {
  --background: var(--color-bg);
  --padding-top: var(--space-lg);
  --padding-start: var(--space-lg);
  --padding-end: var(--space-lg);
  --padding-bottom: var(--space-2xl);
}

.new-task-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.new-task-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.new-task-label {
  font-family: var(--font-family);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text);
}

.new-task-input {
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

.new-task-input:focus-within {
  border-color: var(--color-primary);
}

.new-task-textarea {
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

.new-task-textarea:focus-within {
  border-color: var(--color-primary);
}

.new-task-hint {
  font-family: var(--font-family);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin: 0;
}

.new-task-submit {
  --background: var(--color-primary);
  --background-activated: var(--color-primary-hover);
  --background-disabled: var(--color-primary-disabled);
  --color: #ffffff;
  --border-radius: 20px;
  --box-shadow: none;
  font-family: var(--font-family);
  font-size: 0.95rem;
  font-weight: 600;
  height: 48px;
  text-transform: none;
  margin-top: var(--space-sm);
}
</style>



