# Week 4：算法（动态规划/图）+ Vue3生态 + 工程化（Webpack/性能优化）

> **目标**：掌握DP和图算法、理解Webpack、性能优化、React19/Vue新特性，刷题8-10道
> **时间**：工作日每天3小时（08:30-09:30算法 + 20:00-22:00框架/工程化）
> **参考**：《02-React-Vue框架详解》《03-算法与数据结构详解》《05-工程化能力详解》

---

## 📅 每日详细安排

### 周一：动态规划入门（DP最重要的的一天）

**08:30-09:30 · 算法**
- LeetCode #70 [爬楼梯](https://leetcode.com/problems/climbing-stairs/)（一维DP）
- LeetCode #198 [打家劫舍](https://leetcode.com/problems/house-robber/)（一维DP）
- **DP五步法**：
  1. 确定`dp[i]`含义
  2. 推导递推公式
  3. 初始化`dp`数组
  4. 确定遍历顺序
  5. 手动推导验证

- **爬楼梯DP（手写）**：
  ```javascript
  function climbStairs(n) {
    if (n <= 2) return n
    const dp = [0, 1, 2]  // dp[i] = 第i阶的方法数
    for (let i = 3; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2]  // 最后一步：爬1阶 or 爬2阶
    }
    return dp[n]
  }
  ```

- **打家劫舍DP（手写）**：
  ```javascript
  function rob(nums) {
    if (!nums.length) return 0
    if (nums.length === 1) return nums[0]
    const dp = [nums[0], Math.max(nums[0], nums[1])]
    for (let i = 2; i < nums.length; i++) {
      dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i])
    }
    return dp[nums.length - 1]
  }
  ```

**20:00-21:30 · React 19新特性（2026必考）**
> 学习资源：React官方博客 + React 19 RC

- **React Compiler（自动优化）**：
  - 编译器自动分析代码，在编译时做memo优化
  - 不用手动`useCallback`/`useMemo`
  - Babel/Preset插件支持

- **React Server Components（RSC，零客户端JS）**：
  ```jsx
  // app/page.server.jsx  ← 服务端组件，无水合成本
  async function Page() {
    const data = await db.query('SELECT * FROM posts')
    return <PostList posts={data} />
  }
  
  // app/InteractiveButton.client.jsx  ← 客户端组件
  'use client'
  function Button() {
    const [count, setCount] = useState(0)
    return <button onClick={() => setCount(c => c + 1)}>{count}</button>
  }
  ```

- **Actions（表单提交新时代）**：
  ```jsx
  function Form() {
    async function submit(data) {
      'use server'  // 直接在服务端执行
      await db.create({ ...data })
    }
    return <form action={submit}>...</form>
  }
  ```

- **其他新特性**：
  - `use()` Hook：能在组件内读取Promise/Context
  - 改进的`ref`作为props
  - `metadata`对象（自动生成`<title>`/`<meta>`）

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `React-19新特性.md`
- 包含：React Compiler、RSC、Actions代码示例

---

### 周二：经典DP问题 + Vue Vapor Mode

**08:30-09:30 · 算法**
- LeetCode #322 [零钱兑换](https://leetcode.com/problems/coin-change/)（完全背包DP）
- LeetCode #416 [分割等和子集](https://leetcode.com/problems/partition-equal-subset-sum/)（01背包）

- **零钱兑换DP（手写）**：
  ```javascript
  function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity)
    dp[0] = 0
    for (let coin of coins) {
      for (let i = coin; i <= amount; i++) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1)
      }
    }
    return dp[amount] === Infinity ? -1 : dp[amount]
  }
  ```

**20:00-21:30 · Vue Vapor Mode（Vue的RSC）**
> 学习资源：Vue.js官方博客

- **Vapor Mode是什么？**
  - 类比React Server Components（RSC）
  - Vue新编译策略：生成高效的DOM操作代码（类似Svelte）
  - 彻底去掉虚拟DOM，减少内存开销

- **核心区别**：
  | 模式 | 虚拟DOM | 编译策略 |
  |------|---------|---------|
  | Vue Current | 有 | template → render function |
  | Vue Vapor | 无 | template → direct DOM ops |
  | React RSC | 有 | Server Component + Client Component |

- **现状**：目前处于实验性阶段，但2026年可能成为主流
- **面试回答**：Vapor Mode是Vue对标React RSC的方案，目标都是减少客户端JS体积

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `Vue-VaporMode.md`
- 包含：Vapor Mode vs RSC对比、Vue编译策略变化

---

### 周三：图的BFS/DFS + Webpack原理与优化

**08:30-09:30 · 算法**
- LeetCode #200 [岛屿数量](https://leetcode.com/problems/number-of-islands/)（BFS/DFS）
- **BFS版本（手写）**：
  ```javascript
  function numIslands(grid) {
    let count = 0
    const m = grid.length, n = grid[0].length
    const dirs = [[0,1],[1,0],[-1,0],[0,-1]]
    
    function bfs(r, c) {
      const queue = [[r, c]]
      grid[r][c] = '0'  // 标记已访问
      while (queue.length) {
        const [x, y] = queue.shift()
        for (const [dx, dy] of dirs) {
          const nx = x + dx, ny = y + dy
          if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === '1') {
            grid[nx][ny] = '0'
            queue.push([nx, ny])
          }
        }
      }
    }
    
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (grid[i][j] === '1') {
          count++
          bfs(i, j)
        }
      }
    }
    return count
  }
  ```

**20:00-21:30 · Webpack原理与优化**
> 学习资源：Webpack官方文档 + 《深入浅出Webpack》

- **Webpack构建流程**：
  1. `初始化`：读取配置，初始化compiler
  2. `编译`：用loader处理每个模块，生成AST
  3. `输出`：用Plugin处理chunks，输出bundle

- **Loader vs Plugin**：
  - Loader：转换器（把A文件变成B文件，如`babel-loader`把ES6转ES5）
  - Plugin：扩展器（在构建过程中插入额外的行为，如`HtmlWebpackPlugin`生成HTML）

- **Tree Shaking（消除死代码）**：
  - 基于ES Module的静态分析
  - `sideEffects: false`告诉Webpack哪些文件没有副作用（可以删除）
  - 只能去除**没有被使用的export**

- **Code Splitting（代码分割）**：
  ```javascript
  // 方式1：动态import
  const module = await import('./module.js')
  
  // 方式2：配置splitChunks
  module.exports = {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: { test: /[\\/]node_modules[\\/]/, name: 'vendors', priority: 10 }
        }
      }
    }
  }
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `工程化-Webpack.md`
- 包含：构建流程、Tree Shaking、Code Splitping配置

---

### 周四：图的遍历 + 性能优化（Core Web Vitals）

**08:30-09:30 · 算法**
- LeetCode #994 [腐烂的橘子](https://leetcode.com/problems/rotting-oranges/)（BFS多源最短路）
- **BFS多源最短路（手写）**：
  ```javascript
  function orangesRotting(grid) {
    const m = grid.length, n = grid[0].length
    const queue = []
    let fresh = 0
    
    // 初始化：所有腐烂橘子入队，统计新鲜橘子数量
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (grid[i][j] === 2) queue.push([i, j, 0])
        else if (grid[i][j] === 1) fresh++
      }
    }
    
    const dirs = [[0,1],[1,0],[-1,0],[0,-1]]
    let time = 0
    
    while (queue.length) {
      const [x, y, t] = queue.shift()
      time = t
      for (const [dx, dy] of dirs) {
        const nx = x + dx, ny = y + dy
        if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === 1) {
          grid[nx][ny] = 2
          fresh--
          queue.push([nx, ny, t + 1])
        }
      }
    }
    
    return fresh === 0 ? time : -1
  }
  ```

**20:00-21:30 · 性能优化（Core Web Vitals 2026版）**
> 学习资源：web.dev + Google Search Central

- **Core Web Vitals三大指标**：

| 指标 | 定义 | 2026目标 | 优化手段 |
|------|------|---------|---------|
| **LCP**（最大内容绘制） | 视口中最大元素加载时间 | <2.5s | 预加载、CDN、图片优化、SSR |
| **INP**（交互到下一绘制） | 用户交互到视觉反馈的时间 | <200ms | 减少主线程阻塞、代码分割、Web Worker |
| **CLS**（累积布局偏移） | 页面视觉稳定性 | <0.1 | 固定图片/视频尺寸、避免动态插入内容 |

- **LCP优化**：
  ```html
  <!-- 预加载LCP图片 -->
  <link rel="preload" as="image" href="hero.jpg">
  <!-- 预连接关键域名 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  ```

- **INP优化**：
  - 长任务拆分：`requestIdleCallback`/`requestAnimationFrame`
  - 代码分割：React.lazy + Suspense
  - Web Worker：`new Worker('heavy-task.js')`

- **CLS优化**：
  ```css
  /* 给图片/视频预留空间 */
  img, video { aspect-ratio: 16/9; width: 100%; height: auto; }
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `性能优化-CoreWebVitals.md`
- 包含：三大指标定义、LCP/INP/CLS优化手段

---

### 周五：CI/CD（GitHub Actions）+ 本周算法总复盘

**08:30-09:30 · 算法**
- LeetCode #146 [LRU缓存](https://leetcode.com/problems/lru-cache/)再刷
- LeetCode #226 [翻转二叉树](https://leetcode.com/problems/invert-binary-tree/)（递归）
- **翻转二叉树（手写，递归版）**：
  ```javascript
  function invertTree(root) {
    if (!root) return null
    const left = invertTree(root.left)
    const right = invertTree(root.right)
    root.left = right
    root.right = left
    return root
  }
  ```

**20:00-21:30 · CI/CD（GitHub Actions自动部署）**
> 学习资源：GitHub Actions官方文档

- **GitHub Actions核心概念**：
  - `workflow`：自动化流程（`.yml`文件）
  - `job`：一组步骤
  - `step`：具体action
  - `action`：可复用单元

- **自动部署到Vercel**：
  ```yaml
  # .github/workflows/deploy.yml
  name: Deploy to Vercel
  
  on:
    push:
      branches: [main]
  
  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        
        - name: Setup Node
          uses: actions/setup-node@v4
          with:
            node-version: '20'
            
        - name: Install and Build
          run: |
            npm ci
            npm run build
            
        - name: Deploy to Vercel
          uses: amondnet/vercel-action@v25
          with:
            vercel-token: ${{ secrets.VERCEL_TOKEN }}
            vercel-org-id: ${{ secrets.ORG_ID }}
            vercel-project-id: ${{ secrets.PROJECT_ID }}
            vercel-args: '--prod'
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `工程化-CICD.md`
- 包含：GitHub Actions核心概念、自动部署到Vercel配置

---

### 周六：复盘日

**09:00-11:00 · 复盘本周算法题**
- 重做本周所有算法题（#70/#198/#322/#416/#200/#994/#226/#146）
- 重点：DP五步法、图BFS/DFS、LRU缓存

**14:00-17:00 · 框架/工程化综合练习**
- 模拟面试：React19新特性、Vue Vapor Mode、Webpack、Core Web Vitals、CI/CD
- 录音自己回答，对照改进

**19:00-21:00 · 整理Obsidian笔记**
- 检查以下笔记是否完成：
  - [ ] React-19新特性.md
  - [ ] Vue-VaporMode.md
  - [ ] 工程化-Webpack.md
  - [ ] 性能优化-CoreWebVitals.md
  - [ ] 工程化-CICD.md

---

### 周日：休息日

- 完全放松
- 浏览Reddit r/reactjs (https://reddit.com/r/reactjs)
- **晚上早点睡觉**

---

## 📊 Week 4 总结

| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| DP算法 | 能手写爬楼梯/打家劫舍/零钱兑换 | __ | __ |
| 图算法 | BFS/DFS两种解法 | __ | __ |
| React19 | RSC/Compiler/Actions | __ | __ |
| Vue Vapor | 解释与RSC的区别 | __ | __ |
| Webpack | Tree Shaking + Code Splitting | __ | __ |
| Core Web Vitals | LCP/INP/CLS优化方案 | __ | __ |
| CI/CD | GitHub Actions自动部署到Vercel | __ | __ |
