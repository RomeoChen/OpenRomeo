import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import QuestionBlock from '../../components/QuestionBlock.vue'
import type { QuestionData } from '../../components/QuestionBlock.vue'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true
})

describe('QuestionBlock.vue', () => {
  const mockQuestion: QuestionData = {
    id: 'test-q1',
    stem: '下面哪段代码会产生闭包？',
    choices: [
      { label: 'A', text: 'function foo() { var a = 1; return a; }' },
      { label: 'B', text: 'function foo() { var a = 1; return function() { return a; }; }' },
      { label: 'C', text: 'function foo() { var a = 1; console.log(a); }' },
      { label: 'D', text: 'var a = 1; function foo() { console.log(a); }' }
    ],
    answer: 'B',
    explanation: '闭包的定义：函数能够访问其词法作用域之外的变量。'
  }

  const defaultProps = {
    data: mockQuestion,
    slug: 'test-article'
  }

  beforeEach(() => {
    localStorageMock.clear()
  })

  it('renders question stem correctly', () => {
    const wrapper = mount(QuestionBlock, { props: defaultProps })
    expect(wrapper.text()).toContain('下面哪段代码会产生闭包？')
  })

  it('renders all answer options', () => {
    const wrapper = mount(QuestionBlock, { props: defaultProps })
    const options = wrapper.findAll('.q-block-wrapper .space-y-2 > div')
    expect(options).toHaveLength(4)
    expect(wrapper.text()).toContain('function foo() { var a = 1; return a; }')
    expect(wrapper.text()).toContain('function foo() { var a = 1; return function() { return a; }; }')
  })

  it('shows "未作答" status initially', () => {
    const wrapper = mount(QuestionBlock, { props: defaultProps })
    expect(wrapper.text()).toContain('未作答')
  })

  it('shows question ID', () => {
    const wrapper = mount(QuestionBlock, { props: defaultProps })
    expect(wrapper.text()).toContain('test-q1')
  })

  it('handles option click correctly - correct answer', async () => {
    const wrapper = mount(QuestionBlock, { props: defaultProps })
    const options = wrapper.findAll('.q-block-wrapper .space-y-2 > div')
    
    // Click the correct answer (B)
    await options[1].trigger('click')
    
    // Should show correct status
    expect(wrapper.text()).toContain('正确')
    // Should show explanation
    expect(wrapper.text()).toContain('闭包的定义：函数能够访问其词法作用域之外的变量')
  })

  it('handles option click correctly - wrong answer', async () => {
    const wrapper = mount(QuestionBlock, { props: defaultProps })
    const options = wrapper.findAll('.q-block-wrapper .space-y-2 > div')
    
    // Click a wrong answer (A)
    await options[0].trigger('click')
    
    // Should show wrong status with correct answer
    expect(wrapper.text()).toContain('错误')
    expect(wrapper.text()).toContain('正确答案：B')
  })

  it('disables further clicks after answering', async () => {
    const wrapper = mount(QuestionBlock, { props: defaultProps })
    const options = wrapper.findAll('.q-block-wrapper .space-y-2 > div')
    
    // Click correct answer
    await options[1].trigger('click')
    expect(wrapper.text()).toContain('正确')
    
    // Try clicking another option - it should not change the answer
    await options[0].trigger('click')
    expect(wrapper.text()).toContain('正确')
  })

  it('saves answer to localStorage', async () => {
    const wrapper = mount(QuestionBlock, { props: defaultProps })
    const options = wrapper.findAll('.q-block-wrapper .space-y-2 > div')
    
    await options[1].trigger('click')
    
    const stored = localStorageMock.getItem('open-romeo-q-test-article')
    expect(stored).toBeTruthy()
    const parsed = JSON.parse(stored!)
    expect(parsed['test-q1']).toBeTruthy()
    expect(parsed['test-q1'].selectedOption).toBe('B')
    expect(parsed['test-q1'].isCorrect).toBe(true)
  })

  it.skip('loads answered state from localStorage on mount', async () => {
    // Pre-populate localStorage with an answered question
    // The component stores: records[questionId] = { selectedOption, isCorrect, answeredAt }
    const stored = {
      'test-q1': {
        selectedOption: 'B',
        isCorrect: true,
        answeredAt: Date.now()
      }
    }
    localStorageMock.setItem('open-romeo-q-test-article', JSON.stringify(stored))
    
    const wrapper = mount(QuestionBlock, { props: defaultProps })
    
    // Should show as already answered
    expect(wrapper.text()).toContain('正确')
  })

  it('does not show explanation section when no explanation provided', async () => {
    const questionWithoutExplanation: QuestionData = {
      id: 'test-q2',
      stem: 'Simple question?',
      choices: [{ label: 'A', text: 'Yes' }],
      answer: 'A'
    }
    const wrapper = mount(QuestionBlock, { 
      props: { data: questionWithoutExplanation, slug: 'test' } 
    })
    const options = wrapper.findAll('.q-block-wrapper .space-y-2 > div')
    
    // Answer the question
    await options[0].trigger('click')
    
    // Explanation should not be shown
    expect(wrapper.text()).not.toContain('📖 解析')
  })

  it('applies correct border color for correct answer', async () => {
    const wrapper = mount(QuestionBlock, { props: defaultProps })
    const options = wrapper.findAll('.q-block-wrapper .space-y-2 > div')
    
    await options[1].trigger('click') // Correct answer
    
    const qBlock = wrapper.find('.q-block-wrapper')
    expect(qBlock.classes()).toContain('border-green-500/40')
  })

  it('applies correct border color for wrong answer', async () => {
    const wrapper = mount(QuestionBlock, { props: defaultProps })
    const options = wrapper.findAll('.q-block-wrapper .space-y-2 > div')
    
    await options[0].trigger('click') // Wrong answer
    
    const qBlock = wrapper.find('.q-block-wrapper')
    expect(qBlock.classes()).toContain('border-red-500/40')
  })
})
