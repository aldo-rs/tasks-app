import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockDeleteTask = vi.fn()
const mockUpdateTask = vi.fn()
const mockGetTaskById = vi.fn()

const mockToastPresent = vi.fn()
const mockAlertPresent = vi.fn()
let lastAlertConfig = null

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

// Mock Ionic controllers only — keep the rest of the module intact.
vi.mock('@ionic/vue', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    alertController: {
      create: vi.fn(async (config) => {
        lastAlertConfig = config
        return { present: mockAlertPresent }
      }),
    },
    toastController: {
      create: vi.fn(async () => ({ present: mockToastPresent })),
    },
  }
})

import EditTaskView from './EditTaskView.vue'

describe('EditTaskView', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockReplace.mockReset()
    mockDeleteTask.mockReset()
    mockUpdateTask.mockReset()
    mockGetTaskById.mockReset()
    mockToastPresent.mockReset()
    mockAlertPresent.mockReset()
    lastAlertConfig = null

    routeState.params.id = '1'
    mockGetTaskById.mockReturnValue({
      id: '1',
      title: 'Buy milk',
      description: 'Whole milk',
      completed: false,
    })
  })

  it('should redirect to list when task id does not exist', () => {
    mockGetTaskById.mockReturnValue(undefined)

    mount(EditTaskView)

    expect(mockReplace).toHaveBeenCalledWith({ name: 'tasks.list' })
  })

  it('should save task and navigate to task list', async () => {
    const wrapper = mount(EditTaskView)

    // The watch with immediate:true pre-populates title from the mock task.
    // Triggering submit when the form is valid should call updateTask and navigate.
    await wrapper.get('.edit-task-form').trigger('submit')

    expect(mockUpdateTask).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', title: 'Buy milk', description: 'Whole milk' }),
    )
    expect(mockPush).toHaveBeenCalledWith({ name: 'tasks.list' })
  })

  it('should show delete confirmation alert when pressing Eliminar', async () => {
    const wrapper = mount(EditTaskView)

    await wrapper.get('.edit-task-menu-button').trigger('click')
    await wrapper.get('.edit-task-menu-delete').trigger('click')

    expect(mockAlertPresent).toHaveBeenCalled()
    expect(mockDeleteTask).not.toHaveBeenCalled()
  })

  it('should delete task and navigate to list after confirming in the alert', async () => {
    const wrapper = mount(EditTaskView)

    await wrapper.get('.edit-task-menu-button').trigger('click')
    await wrapper.get('.edit-task-menu-delete').trigger('click')

    // Simulate user pressing the destructive button inside the alert.
    const destructiveBtn = lastAlertConfig.buttons.find((b) => b.role === 'destructive')
    await destructiveBtn.handler()

    expect(mockDeleteTask).toHaveBeenCalledWith('1')
    expect(mockPush).toHaveBeenCalledWith({ name: 'tasks.list' })
  })

  it('should not delete task when cancelling the alert', async () => {
    const wrapper = mount(EditTaskView)

    await wrapper.get('.edit-task-menu-button').trigger('click')
    await wrapper.get('.edit-task-menu-delete').trigger('click')

    const cancelBtn = lastAlertConfig.buttons.find((b) => b.role === 'cancel')
    // Cancel buttons have no handler — just verify delete was not called.
    expect(cancelBtn.handler).toBeUndefined()
    expect(mockDeleteTask).not.toHaveBeenCalled()
  })
})
