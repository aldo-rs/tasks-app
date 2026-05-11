import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Task } from '../domain/Task.js'
import { useTasksStore } from '../store/useTasksStore.js'
import { clearFocus } from '@/shared/utils/clearFocus.js'

export function useCreateTask() {
  const router = useRouter()
  const store = useTasksStore()

  const title = ref('')
  const description = ref('')

  const isFormValid = computed(() => title.value.trim().length > 0)

  function resetForm() {
    title.value = ''
    description.value = ''
  }

  function submit() {
    if (!isFormValid.value) return

    const task = new Task({
      id: crypto.randomUUID(),
      title: title.value.trim(),
      description: description.value.trim(),
    })

    store.addTask(task)
    resetForm()
    clearFocus()
    router.push({ name: 'tasks.list' })
  }

  return { title, description, isFormValid, resetForm, submit }
}
