import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Task } from '../domain/Task.js'
import { useTasksStore } from '../store/useTasksStore.js'

export function useCreateTask() {
  const router = useRouter()
  const store = useTasksStore()

  const title = ref('')
  const description = ref('')

  const isFormValid = computed(() => title.value.trim().length > 0)

  function submit() {
    if (!isFormValid.value) return

    const task = new Task({
      id: crypto.randomUUID(),
      title: title.value.trim(),
      description: description.value.trim(),
    })

    store.addTask(task)
    router.push('/')
  }

  return { title, description, isFormValid, submit }
}

