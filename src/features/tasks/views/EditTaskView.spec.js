import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const mockSaveTask = vi.fn()
const mockDeleteTask = vi.fn()

// Mock the composable so the view test is isolated from business logic.
vi.mock('../composables/useEditTask.js', () => ({
  useEditTask: () => ({
    title: { value: 'Buy milk' },
    description: { value: 'Whole milk' },
    isFormValid: { value: true },
    showTitleError: { value: false },
    saveTask: mockSaveTask,
    deleteTask: mockDeleteTask,
  }),
}))

vi.mock('@ionic/vue', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    alertController: { create: vi.fn(async () => ({ present: vi.fn() })) },
    toastController: { create: vi.fn(async () => ({ present: vi.fn() })) },
  }
})

import EditTaskView from './EditTaskView.vue'

describe('EditTaskView', () => {
  beforeEach(() => {
    mockSaveTask.mockReset()
    mockDeleteTask.mockReset()
  })

  it('should call saveTask when form is submitted', async () => {
    const wrapper = mount(EditTaskView)

    await wrapper.get('.edit-task-form').trigger('submit')

    expect(mockSaveTask).toHaveBeenCalled()
  })

  it('should open the context menu when clicking the menu button', async () => {
    const wrapper = mount(EditTaskView)

    expect(wrapper.find('.edit-task-inline-menu').exists()).toBe(false)
    await wrapper.get('.edit-task-menu-button').trigger('click')
    expect(wrapper.find('.edit-task-inline-menu').exists()).toBe(true)
  })

  it('should close the context menu after clicking Eliminar', async () => {
    const wrapper = mount(EditTaskView)

    await wrapper.get('.edit-task-menu-button').trigger('click')
    await wrapper.get('.edit-task-menu-delete').trigger('click')

    expect(wrapper.find('.edit-task-inline-menu').exists()).toBe(false)
  })

  it('should call deleteTask when pressing Eliminar', async () => {
    const wrapper = mount(EditTaskView)

    await wrapper.get('.edit-task-menu-button').trigger('click')
    await wrapper.get('.edit-task-menu-delete').trigger('click')

    expect(mockDeleteTask).toHaveBeenCalled()
  })
})
