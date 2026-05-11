export const tasksRoutes = [
  {
    path: '/',
    component: () => import('../views/TasksView.vue'),
  },
  {
    path: '/tasks/new',
    component: () => import('../views/NewTaskView.vue'),
  },
]
