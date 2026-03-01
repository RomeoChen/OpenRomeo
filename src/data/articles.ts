export interface Article {
  slug: string
  title: string
  date: string
  tags: string[]
  content: string
}

const modules = import.meta.glob('../articles/*.md', { as: 'raw', eager: true })

export const articles: Article[] = [
  {
    slug: 'hello-world',
    title: 'Hello World',
    date: '2026-01-15',
    tags: ['Intro'],
    content: modules['../articles/hello-world.md'] as string
  },
  {
    slug: 'vue3-composition-api',
    title: 'Vue3 Composition API 最佳实践',
    date: '2026-02-01',
    tags: ['Vue', 'TypeScript'],
    content: modules['../articles/vue3-composition-api.md'] as string
  },
  {
    slug: 'vite-plugin-guide',
    title: 'Vite 插件开发指南',
    date: '2026-02-20',
    tags: ['Vite', 'Plugin'],
    content: modules['../articles/vite-plugin-guide.md'] as string
  }
]
