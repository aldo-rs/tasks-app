import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

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

vi.mock('../application/updateTaskUseCase.js', () => ({
  updateTaskUseCase: vi.fn((currentTask, edits) => ({ ...currentTask, ...edits })),
}))

vi.mock('../application/deleteTaskUseCase.js', () => ({
  deleteTaskUseCase: vi.fn((id) => id),
}))

vi.mock('vue-router', () => ({
  useRoute: () => routeState,
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}))

vi.mock('../store/useTasksStore.js', () => ({
  useTasksStore: () => ({
    getTaskById: mockGetTaskById,
    updateTask: mockUpdateTask,
    deleteTask: mockDeleteTask,
  }),
}))

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

import { useEditTask } from './useEditTask.js'

describe('useEditTask', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
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

  it('should populate title and description from store on init', () => {
    const { title, description } = useEditTask()

    expect(title.value).toBe('Buy milk')
    expect(description.value).toBe('Whole milk')
  })

  it('should redirect to list when task does not exist', () => {
    mockGetTaskById.mockReturnValue(undefined)

    useEditTask()

    expect(mockReplace).toHaveBeenCalledWith({ name: 'tasks.list' })
  })

  it('should mark form as valid when title is not empty', () => {
    const { isFormValid } = useEditTask()
    expect(isFormValid.value).toBe(true)
  })

  it('should mark form as invalid when title is only whitespace', () => {
    mockGetTaskById.mockReturnValue({ id: '1', title: '   ', description: '', completed: false })
    const { isFormValid } = useEditTask()
    expect(isFormValid.value).toBe(false)
  })

  it('should show title error only when title has been typed and cleared', () => {
    const { title, showTitleError } = useEditTask()

    title.value = 'something'
    title.value = '   '
    expect(showTitleError.value).toBe(true)

    title.value = ''
    expect(showTitleError.value).toBe(false)
  })

  it('should update task and navigate to list on saveTask', async () => {
    const { saveTask } = useEditTask()

    await saveTask()

    expect(mockUpdateTask).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', title: 'Buy milk', description: 'Whole milk' }),
    )
    expect(mockPush).toHaveBeenCalledWith({ name: 'tasks.list' })
  })

  it('should show a confirmation alert on deleteTask', async () => {
    const { deleteTask } = useEditTask()

    await deleteTask()

    expect(mockAlertPresent).toHaveBeenCalled()
    expect(mockDeleteTask).not.toHaveBeenCalled()
  })

  it('should delete task and navigate to list after confirming', async () => {
    const { deleteTask } = useEditTask()

    await deleteTask()

    const destructiveBtn = lastAlertConfig.buttons.find((b) => b.role === 'destructive')
    await destructiveBtn.handler()

    expect(mockDeleteTask).toHaveBeenCalledWith('1')
    expect(mockPush).toHaveBeenCalledWith({ name: 'tasks.list' })
  })

  it('should not delete task when pressing cancel in the alert', async () => {
    const { deleteTask } = useEditTask()

    await deleteTask()

    const cancelBtn = lastAlertConfig.buttons.find((b) => b.role === 'cancel')
    expect(cancelBtn.handler).toBeUndefined()
    expect(mockDeleteTask).not.toHaveBeenCalled()
  })

  it('should not save when form is invalid', async () => {
    mockGetTaskById.mockReturnValue({ id: '1', title: '', description: '', completed: false })
    const { saveTask } = useEditTask()

    await saveTask()

    expect(mockUpdateTask).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })
})

