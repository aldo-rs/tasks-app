import { createRouter, createWebHistory } from '@ionic/vue-router'
import { tasksRoutes } from '@/features/tasks/presentation/routes.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...tasksRoutes],
})

export default router
