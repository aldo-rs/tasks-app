import { describe, it, expect, vi } from 'vitest'
import { createTasksApi } from './tasksApi.js'

describe('createTasksApi', () => {
  it('should request tasks list with GET', async () => {
    const payload = [{ id: '1', title: 'Comprar pan' }]
    const httpClient = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
    })

    const tasksApi = createTasksApi({ httpClient, baseUrl: '/tasks' })
    const result = await tasksApi.listTasks()

    expect(httpClient).toHaveBeenCalledWith('/tasks', {
      method: 'GET',
      headers: undefined,
      body: undefined,
    })
    expect(result).toEqual(payload)
  })

  it('should request task creation with JSON payload', async () => {
    const payload = { title: 'Nueva tarea', description: 'Descripción' }
    const httpClient = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: '10', ...payload }),
    })

    const tasksApi = createTasksApi({ httpClient, baseUrl: '/tasks' })

    await tasksApi.createTask(payload)

    expect(httpClient).toHaveBeenCalledWith('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  })

  it('should throw when response is not ok', async () => {
    const httpClient = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })

    const tasksApi = createTasksApi({ httpClient, baseUrl: '/tasks' })

    await expect(tasksApi.listTasks()).rejects.toThrow('Request failed: GET /tasks')
  })
})

