import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Task } from '@/features/tasks/domain/Task.js'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([
    new Task({
      id: '1',
      title: 'Buy milk',
      description: 'Milk for my hijas',
      completed: false,
    }),
    new Task({
      id: '2',
      title: 'Llamar a mamá',
      description: 'Confirmar hora de la cena',
      completed: true,
    }),
  ])

  const pendingTasks = computed(() => tasks.value.filter((t) => !t.completed))
  const completedTasks = computed(() => tasks.value.filter((t) => t.completed))

  function addTask(task) {
    tasks.value.push(task)
  }

  function toggleTask(id) {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      tasks.value[index] = tasks.value[index].toggle()
    }
  }

  function deleteTask(id) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  return { tasks, pendingTasks, completedTasks, addTask, toggleTask, deleteTask }
})
