import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Task } from '@/features/tasks/domain/Task.js'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])

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

  function getTaskById(id) {
    return tasks.value.find((t) => t.id === id)
  }

  function updateTask(updatedTask) {
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = new Task(updatedTask)
    }
  }

  function deleteTask(id) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  return {
    tasks,
    pendingTasks,
    completedTasks,
    addTask,
    toggleTask,
    getTaskById,
    updateTask,
    deleteTask,
  }
})
