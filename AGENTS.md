# OpenRomeo 开发指南

> Romeo Chen 的个人主页 + 前端求职刷题平台

## 项目概述

这是一个 **Vue 3 + TypeScript + Vite** 构建的个人网站，包含两个核心功能：
1. **技术文章展示** — 展示学习笔记和技术文章（Markdown 格式）
2. **前端求职刷题系统** — 8 周学习计划，55+ 道面试题（选择题 + 自由回答 + 答案）

部署地址：https://open-romeo.vercel.app

---

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API) |
| 语言 | TypeScript |
| 构建 | Vite 6 |
| UI 组件 | Naive UI |
| 样式 | Tailwind CSS + PostCSS |
| 路由 | Vue Router 4 |
| Markdown | markdown-it |
| 测试 | Vitest (单元) + Playwright (E2E) |

---

## 项目结构

```
D:\OpenRomeo
├── src/
│   ├── main.ts                 # 入口
│   ├── App.vue                 # 根组件（路由容器）
│   ├── style.css               # 全局样式
│   ├── articles/              # Markdown 文章（12篇）
│   │   ├── hello-world.md
│   │   ├── vue3-composition-api.md
│   │   ├── vite-plugin-guide.md
│   │   ├── Week1-JS基础上.md ~ Week8-模拟面试+简历+投递.md
│   ├── components/
│   │   └── QuestionBlock.vue   # 题目展示组件
│   ├── data/
│   │   ├── articles.ts         # 文章元数据（标题/日期/标签）
│   │   └── questions.ts        # 面试题库（55+题，含答案）
│   ├── router/
│   │   └── index.ts            # 路由配置
│   ├── views/
│   │   ├── Home.vue            # 首页（文章列表 + 刷题入口）
│   │   ├── Article.vue         # 文章详情页
│   │   └── Quiz.vue            # 刷题页面
│   ├── utils/
│   │   └── questionStore.ts    # 题目状态管理
│   └── test/                   # 单元测试
├── e2e/                        # E2E 测试
├── index.html
├── package.json
└── vite.config.ts
```

---

## 路由结构

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 首页，文章列表 + 刷题入口 |
| `/article/:slug` | Article | 文章详情（Markdown 渲染） |
| `/quiz` | Quiz | 刷题页面（55+面试题） |

---

## 数据模型

### Article（文章元数据）

```typescript
interface Article {
  slug: string      // URL slug，如 "hello-world"
  title: string     // 标题
  date: string      // 日期，如 "2026-01-15"
  tags: string[]    // 标签，如 ["Vue", "TypeScript"]
}
```

### Question（面试题）

```typescript
type QuestionType = 'single' | 'multiple' | 'free'

interface Question {
  id: string        // 唯一标识，如 "w1-closure-1"
  week: number       // 所属周（1-8）
  topic: string      // 主题，如 "闭包"、"原型链"
  type: QuestionType
  question: string   // 题目内容
  options?: string[] // 选项（选择题）
  correctAnswer?: number[] // 正确答案索引
  hint?: string      // 提示
  answer: string     // 完整答案解析
}
```

---

## 内容结构（8周求职学习计划）

| 周 | 主题 | 题目数 |
|----|------|--------|
| Week1 | JS 基础（上）：闭包/原型链/继承/EventLoop/Promise | ~12 题 |
| Week2 | JS 基础（下）+ TypeScript + CSS 布局 | ~10 题 |
| Week3 | 算法（树/栈队列）+ React 原理（Fiber/Diff/Hooks） | ~8 题 |
| Week4 | 算法（DP/图）+ Vue3 响应式 + 工程化 | ~8 题 |
| Week5 | AI 工程（上）：Prompt Engineering + RAG 全流程 | ~5 题 |
| Week6 | AI 工程（下）：Agent 开发 + 浏览器与网络 | ~6 题 |
| Week7 | 项目准备：STAR 法则 + 系统设计 | ~6 题 |
| Week8 | 收尾冲刺：模拟面试 + 简历 + 投递 | ~5 题 |

---

## 开发命令

```bash
# 安装依赖
npm install

# 开发预览
npm run dev

# 构建生产版本
npm run build

# 单元测试
npm run test:run

# 单元测试（watch 模式）
npm run test

# E2E 测试
npm run test:e2e

# E2E 测试（UI 模式）
npm run test:e2e:ui

# 预览生产构建
npm run preview
```

---

## 开发工作流

> 每次代码改动后，按以下顺序执行：

1. **单元测试** — `npm run test:run`，确保所有测试通过
2. **构建验证** — `npm run build`，确保 TypeScript 编译 + Vite 构建成功
3. **提交代码** — `git add . && git commit -m "描述"`
4. **推送远端** — `git push origin main`
5. **部署 Vercel** — 自动部署（已有 Vercel 配置）

---

## 主题配色

- 主色：`#22c55e`（绿色）
- 深色模式：默认开启（黑色背景 + 绿色点缀）
- 浅色模式：白色背景 + 绿色强调

---

## 注意事项

1. **Hooks 调用顺序** — Vue 组件中不要在条件语句中使用 Hooks，因为依赖链表顺序
2. **响应式** — 基础类型用 `ref()`，对象用 `reactive()`
3. **Markdown 文章** — 放在 `src/articles/` 目录，元数据在 `src/data/articles.ts`
4. **题目新增** — 在 `src/data/questions.ts` 中按周分组添加
5. **图片资源** — 建议使用 CDN 或公共 URL，避免本地图片打包

---

## 联系方式

- GitHub: https://github.com/RomeoChen
- 网站：https://open-romeo.vercel.app