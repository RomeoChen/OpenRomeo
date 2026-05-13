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
  },
  {
    slug: '00-8周学习计划总览',
    title: '2026前端求职 · 8周详细学习计划总览',
    date: '2026-05-13',
    tags: ['求职', '学习计划', '2026'],
    content: modules['../articles/00-8周学习计划总览.md'] as string
  },
  {
    slug: 'Week1-JS基础上',
    title: 'Week1 · JS基础（上）：闭包/原型链/继承/EventLoop/Promise',
    date: '2026-05-13',
    tags: ['求职', 'Week1', 'JavaScript'],
    content: modules['../articles/Week1-JS基础上.md'] as string
  },
  {
    slug: 'Week2-JS基础下+CSS',
    title: 'Week2 · JS基础（下）+ TypeScript + CSS布局',
    date: '2026-05-13',
    tags: ['求职', 'Week2', 'TypeScript', 'CSS'],
    content: modules['../articles/Week2-JS基础下+CSS.md'] as string
  },
  {
    slug: 'Week3-算法树栈+React原理',
    title: 'Week3 · 算法（树/栈队列）+ React原理（Fiber/Diff/Hooks）',
    date: '2026-05-13',
    tags: ['求职', 'Week3', '算法', 'React'],
    content: modules['../articles/Week3-算法树栈+React原理.md'] as string
  },
  {
    slug: 'Week4-算法DP图+Vue3工程化',
    title: 'Week4 · 算法（DP/图）+ Vue3响应式 + 工程化（Webpack/性能）',
    date: '2026-05-13',
    tags: ['求职', 'Week4', '算法', 'Vue3', '工程化'],
    content: modules['../articles/Week4-算法DP图+Vue3工程化.md'] as string
  },
  {
    slug: 'Week5-PromptEngineering+RAG',
    title: 'Week5 · AI工程（上）：Prompt Engineering + RAG全流程',
    date: '2026-05-13',
    tags: ['求职', 'Week5', 'AI工程', 'RAG'],
    content: modules['../articles/Week5-PromptEngineering+RAG.md'] as string
  },
  {
    slug: 'Week6-Agent+浏览器网络',
    title: 'Week6 · AI工程（下）：Agent开发 + 浏览器与网络',
    date: '2026-05-13',
    tags: ['求职', 'Week6', 'AI工程', 'Agent', '浏览器'],
    content: modules['../articles/Week6-Agent+浏览器网络.md'] as string
  },
  {
    slug: 'Week7-项目STAR+系统设计',
    title: 'Week7 · 项目准备：STAR法则梳理 + 系统设计 + 高频场景题',
    date: '2026-05-13',
    tags: ['求职', 'Week7', '项目', 'STAR', '系统设计'],
    content: modules['../articles/Week7-项目STAR+系统设计.md'] as string
  },
  {
    slug: 'Week8-模拟面试+简历+投递',
    title: 'Week8 · 收尾冲刺：模拟面试 + 简历定稿 + 作品集上线 + 投递开始',
    date: '2026-05-13',
    tags: ['求职', 'Week8', '简历', '作品集', '面试'],
    content: modules['../articles/Week8-模拟面试+简历+投递.md'] as string
  }
]
