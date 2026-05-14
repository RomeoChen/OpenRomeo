export interface Article {
  slug: string
  title: string
  date: string
  tags: string[]
}

// Static metadata (small - not bundled with content)
export const articles: Article[] = [
  {
    slug: 'hello-world',
    title: 'Hello World',
    date: '2026-01-15',
    tags: ['Intro'],
  },
  {
    slug: 'vue3-composition-api',
    title: 'Vue3 Composition API 最佳实践',
    date: '2026-02-01',
    tags: ['Vue', 'TypeScript'],
  },
  {
    slug: 'vite-plugin-guide',
    title: 'Vite 插件开发指南',
    date: '2026-02-20',
    tags: ['Vite', 'Plugin'],
  },
  {
    slug: '00-8周学习计划总览',
    title: '2026前端求职 · 8周详细学习计划总览',
    date: '2026-05-13',
    tags: ['求职', '学习计划', '2026'],
  },
  {
    slug: 'Week1-JS基础上',
    title: 'Week1 · JS基础（上）：闭包/原型链/继承/EventLoop/Promise',
    date: '2026-05-13',
    tags: ['求职', 'Week1', 'JavaScript'],
  },
  {
    slug: 'Week2-JS基础下+CSS',
    title: 'Week2 · JS基础（下）+ TypeScript + CSS布局',
    date: '2026-05-13',
    tags: ['求职', 'Week2', 'TypeScript', 'CSS'],
  },
  {
    slug: 'Week3-算法树栈+React原理',
    title: 'Week3 · 算法（树/栈队列）+ React原理（Fiber/Diff/Hooks）',
    date: '2026-05-13',
    tags: ['求职', 'Week3', '算法', 'React'],
  },
  {
    slug: 'Week4-算法DP图+Vue3工程化',
    title: 'Week4 · 算法（DP/图）+ Vue3响应式 + 工程化（Webpack/性能）',
    date: '2026-05-13',
    tags: ['求职', 'Week4', '算法', 'Vue3', '工程化'],
  },
  {
    slug: 'Week5-PromptEngineering+RAG',
    title: 'Week5 · AI工程（上）：Prompt Engineering + RAG全流程',
    date: '2026-05-13',
    tags: ['求职', 'Week5', 'AI工程', 'RAG'],
  },
  {
    slug: 'Week6-Agent+浏览器网络',
    title: 'Week6 · AI工程（下）：Agent开发 + 浏览器与网络',
    date: '2026-05-13',
    tags: ['求职', 'Week6', 'AI工程', 'Agent', '浏览器'],
  },
  {
    slug: 'Week7-项目STAR+系统设计',
    title: 'Week7 · 项目准备：STAR法则梳理 + 系统设计 + 高频场景题',
    date: '2026-05-13',
    tags: ['求职', 'Week7', '项目', 'STAR', '系统设计'],
  },
  {
    slug: 'Week8-模拟面试+简历+投递',
    title: 'Week8 · 收尾冲刺：模拟面试 + 简历定稿 + 作品集上线 + 投递开始',
    date: '2026-05-13',
    tags: ['求职', 'Week8', '简历', '作品集', '面试'],
  },
]

// Dynamic import map - lazily loads each article's markdown content
// This prevents all 12 articles from being bundled into the main JS file
const contentLoaders = import.meta.glob('../articles/*.md', { query: '?raw', import: 'default' })

export async function loadArticleContent(slug: string): Promise<string> {
  const key = `../articles/${slug}.md`
  const loader = contentLoaders[key]
  if (!loader) {
    return `# Article not found\n\nCould not find article: ${slug}`
  }
  return (loader as () => Promise<string>)()
}
