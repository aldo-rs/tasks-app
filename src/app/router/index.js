import { createRouter, createWebHistory } from 'vue-router'
import { tasksRoutes } from '@/features/tasks/router/routes.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...tasksRoutes],
})

export default router
