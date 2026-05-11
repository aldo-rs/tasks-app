import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockDeleteTask = vi.fn()
const mockUpdateTask = vi.fn()
const mockGetTaskById = vi.fn()

const routeState = {
  params: { id: '1' },
}

vi.mock('vue-router', () => ({
  useRoute: () => routeState,
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}))

vi.mock('../store/useTasksStore.js', () => ({
  useTasksStore: () => ({
    getTaskById: mockGetTaskById,
    updateTask: mockUpdateTask,
    deleteTask: mockDeleteTask,
  }),
}))

import EditTaskView from './EditTaskView.vue'

describe('EditTaskView', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockReplace.mockReset()
    mockDeleteTask.mockReset()
    mockUpdateTask.mockReset()
    mockGetTaskById.mockReset()

    routeState.params.id = '1'
    mockGetTaskById.mockReturnValue({
      id: '1',
      title: 'Buy milk',
      description: 'Whole milk',
      completed: false,
    })
  })

  it('should delete task and navigate to list when pressing Eliminar', async () => {
    const wrapper = mount(EditTaskView)

    await wrapper.get('.edit-task-menu-button').trigger('click')
    await wrapper.get('.edit-task-menu-delete').trigger('click')

    expect(mockDeleteTask).toHaveBeenCalledWith('1')
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('should redirect to list when task id does not exist', () => {
    mockGetTaskById.mockReturnValue(undefined)

    mount(EditTaskView)

    expect(mockReplace).toHaveBeenCalledWith('/')
  })
})
