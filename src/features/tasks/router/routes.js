export const tasksRoutes = [
  {
    path: '/',
    name: 'tasks.list',
    component: () => import('../views/TasksView.vue'),
  },
  {
    path: '/tasks/new',
    name: 'tasks.new',
    component: () => import('../views/NewTaskView.vue'),
  },
  {
    path: '/tasks/:id/edit',
    name: 'tasks.edit',
    component: () => import('../views/EditTaskView.vue'),
  },
]
