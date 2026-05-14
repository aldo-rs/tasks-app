/**
 * HTTP client for tasks endpoints.
 *
 * This module is the place where backend communication for tasks should live.
 * UI components and stores should consume higher-level services/composables instead
 * of calling fetch/axios directly.
 */
export function createTasksApi({
  httpClient = fetch,
  baseUrl = '/api/tasks',
} = {}) {
  async function request(path = '', { method = 'GET', body } = {}) {
    const response = await httpClient(`${baseUrl}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${method} ${baseUrl}${path}`)
    }

    if (response.status === 204) {
      return null
    }

    return response.json()
  }

  return {
    listTasks() {
      return request()
    },
    createTask(payload) {
      return request('', { method: 'POST', body: payload })
    },
    updateTask(id, payload) {
      if (!id) {
        throw new Error('Task id is required')
      }

      return request(`/${id}`, { method: 'PUT', body: payload })
    },
    deleteTask(id) {
      if (!id) {
        throw new Error('Task id is required')
      }

      return request(`/${id}`, { method: 'DELETE' })
    },
  }
}

