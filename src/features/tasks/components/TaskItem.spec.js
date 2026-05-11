import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskItem from './TaskItem.vue'

const pendingTask = { id: '1', title: 'Buy milk', description: 'Whole milk', completed: false }
const completedTask = { id: '2', title: 'Read book', description: '', completed: true }

describe('TaskItem', () => {
  it('should render the task title', () => {
    const wrapper = mount(TaskItem, { props: { task: pendingTask } })
    expect(wrapper.text()).toContain('Buy milk')
  })

  it('should render the description when present', () => {
    const wrapper = mount(TaskItem, { props: { task: pendingTask } })
    expect(wrapper.text()).toContain('Whole milk')
  })

  it('should not render a description element when description is empty', () => {
    const wrapper = mount(TaskItem, { props: { task: completedTask } })
    expect(wrapper.find('.task-item__description').exists()).toBe(false)
  })

  it('should emit toggle with the task id when clicking the toggle button', async () => {
    const wrapper = mount(TaskItem, { props: { task: pendingTask } })

    await wrapper.get('.task-item__toggle').trigger('click')

    expect(wrapper.emitted('toggle')).toEqual([['1']])
  })

  it('should emit edit with the task id when clicking the content area', async () => {
    const wrapper = mount(TaskItem, { props: { task: pendingTask } })

    await wrapper.get('.task-item__content').trigger('click')

    expect(wrapper.emitted('edit')).toEqual([['1']])
    expect(wrapper.emitted('toggle')).toBeUndefined()
  })

  it('should apply the completed modifier class when task is completed', () => {
    const wrapper = mount(TaskItem, { props: { task: completedTask } })
    expect(wrapper.find('.task-item--completed').exists()).toBe(true)
  })

  it('should not apply the completed modifier class when task is pending', () => {
    const wrapper = mount(TaskItem, { props: { task: pendingTask } })
    expect(wrapper.find('.task-item--completed').exists()).toBe(false)
  })

  it('should label the toggle button as "Marcar completada" for pending tasks', () => {
    const wrapper = mount(TaskItem, { props: { task: pendingTask } })
    expect(wrapper.get('.task-item__toggle').attributes('aria-label')).toBe('Marcar completada')
  })

  it('should label the toggle button as "Marcar pendiente" for completed tasks', () => {
    const wrapper = mount(TaskItem, { props: { task: completedTask } })
    expect(wrapper.get('.task-item__toggle').attributes('aria-label')).toBe('Marcar pendiente')
  })
})

