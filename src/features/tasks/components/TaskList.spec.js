import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from './TaskList.vue'

describe('TaskList', () => {
  it('should emit toggle-task with pending task id when clicking its radio', async () => {
    const wrapper = mount(TaskList, {
      props: {
        pendingTasks: [{ id: '1', title: 'Buy milk', description: '', completed: false }],
        completedTasks: [],
      },
      global: {
        stubs: {
          IonIcon: true,
        },
      },
    })

    await wrapper.get('.task-item__toggle').trigger('click')

    expect(wrapper.emitted('toggle-task')).toEqual([['1']])
  })

  it('should emit toggle-task with completed task id when clicking its radio', async () => {
    const wrapper = mount(TaskList, {
      props: {
        pendingTasks: [],
        completedTasks: [{ id: '2', title: 'Read book', description: '', completed: true }],
      },
      global: {
        stubs: {
          IonIcon: true,
        },
      },
    })

    await wrapper.get('.task-item__toggle').trigger('click')

    expect(wrapper.emitted('toggle-task')).toEqual([['2']])
  })
})

