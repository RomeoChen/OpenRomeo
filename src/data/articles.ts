export interface Article {
  slug: string
  title: string
  date: string
  tags: string[]
  content: string
}

export const articles: Article[] = [
  {
    slug: 'hello-world',
    title: 'Hello World',
    date: '2026-01-15',
    tags: ['Intro'],
    content: `# Hello World

Welcome to my personal website! This is my first post.

## About Me

I'm a full stack developer passionate about building cool things with code.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Naive UI

\`\`\`javascript
const greeting = 'Hello, World!';
console.log(greeting);
\`\`\`

Stay tuned for more updates!`
  },
  {
    slug: 'vue3-composition-api',
    title: 'Vue3 Composition API 最佳实践',
    date: '2026-02-01',
    tags: ['Vue', 'TypeScript'],
    content: `# Vue3 Composition API 最佳实践

Vue3 的 Composition API 带来了更灵活的代码组织方式。

## 为什么使用 Composition API

1. **更好的类型推导**
2. **更好的代码复用**
3. **更清晰的逻辑组织**

## 示例代码

\`\`\`typescript
import { ref, computed, onMounted } from 'vue'

export function useCounter() {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  onMounted(() => {
    console.log('Counter mounted!')
  })
  
  return { count, doubled, increment }
}
\`\`\`

## 总结

Composition API 让 Vue 组件更加简洁和可维护。`
  },
  {
    slug: 'vite-plugin-guide',
    title: 'Vite 插件开发指南',
    date: '2026-02-20',
    tags: ['Vite', 'Plugin'],
    content: `# Vite 插件开发指南

Vite 的插件系统非常强大，让我来介绍如何开发一个 Vite 插件。

## 插件基础结构

\`\`\`typescript
export function myPlugin() {
  return {
    name: 'my-plugin',
    transform(code, id) {
      if (id.endsWith('.js')) {
        return {
          code: code.replace(/foo/g, 'bar'),
          map: null
        }
      }
    }
  }
}
\`\`\`

## 常用钩子

- \`resolveId\` - 解析模块 ID
- \`load\` - 加载模块内容
- \`transform\` - 转换代码
- \`buildStart\` - 构建开始时调用

Happy coding!`
  }
]
