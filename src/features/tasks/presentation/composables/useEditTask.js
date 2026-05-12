import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { alertController, toastController } from '@ionic/vue'
import { useTasksStore } from '../store/useTasksStore.js'
import { clearFocus } from '@/shared/utils/clearFocus.js'
import { updateTask } from '../../services/updateTask.js'
import { deleteTask as deleteTaskService } from '../../services/deleteTask.js'

export function useEditTask() {
  const route = useRoute()
  const router = useRouter()
  const store = useTasksStore()

  const title = ref('')
  const description = ref('')

  const taskId = computed(() => String(route.params.id ?? ''))
  // UI validation — disables the submit button. Domain validation lives in updateTask.
  const isFormValid = computed(() => title.value.trim().length > 0)
  const showTitleError = computed(() => title.value.length > 0 && !isFormValid.value)

  // Watch taskId immediately so it also handles forward navigations to a different task.
  watch(
    taskId,
    (id) => {
      const task = store.getTaskById(id)
      if (!task) {
        router.replace({ name: 'tasks.list' })
        return
      }
      title.value = task.title
      description.value = task.description
    },
    { immediate: true },
  )

  async function saveTask() {
    if (!isFormValid.value) return

    const currentTask = store.getTaskById(taskId.value)
    if (!currentTask) return

    const updatedTask = updateTask(currentTask, {
      title: title.value,
      description: description.value,
    })

    clearFocus()
    store.updateTask(updatedTask)

    const toast = await toastController.create({
      message: 'Tarea guardada',
      duration: 2000,
      position: 'bottom',
    })
    toast.present()

    router.push({ name: 'tasks.list' })
  }

  async function deleteTask() {
    const alert = await alertController.create({
      header: 'Eliminar tarea',
      message: '¿Estás seguro de que quieres eliminar esta tarea?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            clearFocus()
            const id = deleteTaskService(taskId.value)
            store.deleteTask(id)

            const toast = await toastController.create({
              message: 'Tarea eliminada',
              duration: 2000,
              position: 'bottom',
            })
            toast.present()

            router.push({ name: 'tasks.list' })
          },
        },
      ],
    })

    await alert.present()
  }

  return { title, description, isFormValid, showTitleError, saveTask, deleteTask }
}

