# Week 6：AI工程能力（下）—— Agent开发 + 浏览器与网络

> **目标**：掌握Agent开发（MCP/ReAct/Function Calling）和浏览器渲染机制/HTTP，刷题5-8道
> **时间**：工作日每天3小时（08:30-09:30算法 + 20:00-22:00 AI/浏览器）
> **参考**：《04-AI工程能力详解》《06-浏览器与网络详解》

---

## 📅 每日详细安排

### 周一：Function Calling（让AI调用外部工具）

**08:30-09:30 · 算法**
- LeetCode #94 [二叉树中序遍历](https://leetcode.com/problems/binary-tree-inorder-traversal/)再刷
- LeetCode #102 [层序遍历](https://leetcode.com/problems/binary-tree-level-order-traversal/)再刷

**20:00-21:30 · Function Calling（让大模型调用工具）**
> 学习资源：OpenAI Function Calling文档 + Vercel AI SDK

- **Function Calling是什么？**
  - 告诉大模型"你会哪些工具"，让它自己决定调用哪个
  - 大模型输出一个JSON（包含工具名+参数）
  - 程序执行工具，返回结果给大模型
  - 大模型再生成最终答案

- **Vercel AI SDK + Function Calling**：
  ```typescript
  import { generateText, tool } from 'ai'
  import { openai } from '@ai-sdk/openai'
  import { z } from 'zod'
  
  // 定义工具
  const weatherTool = tool({
    description: '查询某个城市的天气',
    parameters: z.object({
      city: z.string().describe('城市名称'),
    }),
    execute: async ({ city }) => {
      // 实际调用天气API
      const res = await fetch(`https://api.weather.com/?city=${city}`)
      return { city, weather: '晴天', temp: '25°C' }
    },
  })
  
  // 使用工具
  const { text, toolCalls } = await generateText({
    model: openai('gpt-4o'),
    tools: [weatherTool],
    prompt: '北京今天的天气怎么样？',
  })
  
  console.log(toolCalls)  // [{toolName: 'weather', args: { city: '北京' }}]
  console.log(text)       // 最终生成的自然语言回答
  ```

- **多工具Function Calling**：
  ```typescript
  const tools = [weatherTool, searchTool, calculatorTool]
  
  const { text, toolCalls } = await generateText({
    model: openai('gpt-4o'),
    tools,
    prompt: '帮我查一下北京天气，然后计算一下如果我穿一件T恤会不会冷（室温25°C）',
  })
  
  // 可能输出两个toolCalls：
  // [{toolName: 'weather', args: { city: '北京' }}, {toolName: 'calculator', args: { ... }}]
  ```

- **常见工具类型**：
  - 搜索：`search(query)` → 调用Google/Bing API
  - 计算：`calculate(expression)` → 调用计算器
  - 数据库：`query(sql)` → 执行SQL
  - API：`httpRequest(url, method)` → 发送HTTP请求

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `AI-FunctionCalling.md`
- 包含：Function Calling原理、Vercel AI SDK多工具代码、常见工具类型

---

### 周二：ReAct Agent（推理+行动循环）

**08:30-09:30 · 算法**
- LeetCode #70 [爬楼梯](https://leetcode.com/problems/climbing-stairs/)再刷
- LeetCode #322 [零钱兑换](https://leetcode.com/problems/coin-change/)再刷

**20:00-21:30 · ReAct Agent（LangChain.js）**
> 学习资源：LangChain.js Agents文档

- **ReAct三步循环**：
  1. **Thought**：思考下一步该做什么
  2. **Action**：执行一个工具
  3. **Observation**：观察结果，再思考

- **LangChain.js ReAct Agent**：
  ```typescript
  import { createReactAgent } from 'langchain/agents'
  import { ChatOpenAI } from '@langchain/openai'
  import { search, calculator, weather } from './tools'
  
  const agent = createReactAgent({
    llm: new ChatOpenAI({ model: 'gpt-4o', temperature: 0 }),
    tools: [search, calculator, weather],
  })
  
  // Agent执行循环
  const response = await agent.invoke({
    input: '帮我查一下北京天气，然后计算华氏度是多少'
  })
  
  // Agent内部执行流程：
  // Thought: 我需要先查北京天气
  // Action: weather(city="北京")
  // Observation: 天气：晴天，25°C
  // Thought: 现在我需要把25°C转成华氏度
  // Action: calculator(expression="25 * 9 / 5 + 32")
  // Observation: 结果：77°F
  // Final Answer: 北京今天天气晴天，气温25°C，即77°F。
  ```

- **Agent的五大能力**：
  | 能力 | 说明 | 工具 |
  |------|------|------|
  | 搜索 | 实时信息查询 | search |
  | 计算 | 数学运算 | calculator |
  | API | 第三方服务 | httpRequest |
  | 代码执行 | 运行代码 | pythonExecutor |
  | 数据库 | 读写数据 | dbQuery |

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `AI-Agent开发.md`
- 包含：ReAct循环原理、LangChain Agent代码、五大工具类型

---

### 周三：MCP协议（Model Context Protocol）

**08:30-09:30 · 算法**
- LeetCode #200 [岛屿数量](https://leetcode.com/problems/number-of-islands/)再刷
- LeetCode #994 [腐烂的橘子](https://leetcode.com/problems/rotting-oranges/)再刷

**20:00-21:30 · MCP协议（Anthropic提出的AI工具标准）**
> 学习资源：https://modelcontextprotocol.io/

- **MCP是什么？**
  - AI模型连接外部工具的**标准化协议**（类似USB-C）
  - 一次开发，任何支持MCP的AI都能用
  - 解决"每个AI工具都要单独对接"的问题

- **MCP架构**：
  ```
  ┌─────────┐    ┌────────────┐    ┌─────────┐
  │  AI     │ ←→ │  MCP Host  │ ←→ │  Tools  │
  │ Model   │    │  (Claude)  │    │ (本地)  │
  └─────────┘    └────────────┘    └─────────┘
                        ↓
                 ┌────────────┐
                 │   MCP      │
                 │  Servers   │
                 │ (GitHub/   │
                 │  Slack/)   │
                 └────────────┘
  ```

- **MCP Server示例（文件系统）**：
  ```typescript
  import { Server } from '@modelcontextprotocol/sdk/server/index.js'
  import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
  
  const server = new Server({
    name: 'filesystem-server',
    version: '1.0.0',
  }, {
    capabilities: { tools: {} },
  })
  
  server.setRequestHandler('tools/list', async () => ({
    tools: [
      {
        name: 'read_file',
        description: '读取文件内容',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string' }
          }
        }
      },
      {
        name: 'write_file',
        description: '写入文件内容',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string' },
            content: { type: 'string' }
          }
        }
      }
    ]
  }))
  
  await server.connect(new StdioServerTransport())
  ```

- **MCP vs Function Calling**：
  | 特性 | MCP | Function Calling |
  |------|-----|-----------------|
  | 标准化 | 是（通用协议） | 否（各厂商不同） |
  | 实时性 | 本地运行，实时 | 需要API调用 |
  | 适用场景 | 本地工具（文件系统、Git） | 远程API（搜索、天气） |
  | 生态 | 快速增长中 | 已成熟 |

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `AI-MCP协议.md`
- 包含：MCP架构图、MCP Server代码、MCP vs Function Calling对比

---

### 周四：浏览器渲染机制（CRP）+ Event Loop

**08:30-09:30 · 算法**
- LeetCode #206 [反转链表](https://leetcode.com/problems/reverse-linked-list/)再刷
- LeetCode #226 [翻转二叉树](https://leetcode.com/problems/invert-binary-tree/)再刷

**20:00-21:30 · 浏览器渲染机制（CRP + 关键渲染路径）**
> 学习资源：https://web.dev/critical-rendering-path/

- **CRP六步**：
  1. **HTML解析**：字节 → 字符 → Token → Node → DOM Tree
  2. **CSS解析**：CSS → CSSOM Tree
  3. **Render Tree**：DOM + CSSOM → Render Tree（只有可见节点）
  4. **Layout**（Reflow）：计算每个节点的位置和大小
  5. **Paint**：把节点绘制到图层（像素填充）
  6. **Composite**：合并图层，上传到GPU

- **阻塞渲染**：
  - `<script>`（同步）→ 阻塞HTML解析 → 阻塞渲染
  - `<script async>` → 下载完立即执行，不阻塞HTML解析
  - `<script defer>` → HTML解析完再执行，不阻塞渲染
  - `<link rel="stylesheet">` → 阻塞Paint（CSS是渲染阻塞资源）

- **优化CRP**：
  ```html
  <!-- CSS放head，JS放body末尾 -->
  <head>
    <!-- 关键CSS内联 -->
    <style>body { font-size: 16px; }</style>
    <!-- 非关键CSS异步加载 -->
    <link rel="preload" href="non-critical.css" as="style" onload="this.rel='stylesheet'">
    <!-- 关键JS异步 -->
    <script async src="analytics.js"></script>
  </head>
  <body>
    <!-- 内容 -->
    <!-- 非关键JS放末尾 -->
    <script defer src="app.js"></script>
  </body>
  ```

- **CSS选择器性能**：
  - 浏览器从右到左匹配选择器（从叶子到根）
  - `#id`最快（直接定位），`.class`次之，`div p`最慢
  - 避免：`div ul li a`（多层嵌套）

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `浏览器-渲染机制.md`
- 包含：CRP六步流程图、script defer/async区别、CRP优化代码

---

### 周五：HTTP/2 + HTTP/3 + 前端安全

**08:30-09:30 · 算法**
- LeetCode #146 [LRU缓存](https://leetcode.com/problems/lru-cache/)再刷
- LeetCode #20 [有效括号](https://leetcode.com/problems/valid-parentheses/)再刷

**20:00-21:30 · HTTP/2 + HTTP/3 + 前端安全**
> 学习资源：HTTP权威指南 + OWASP Top 10

- **HTTP/2核心特性**：

| 特性 | 说明 | 解决的问题 |
|------|------|---------|
| **多路复用** | 一个TCP连接并行多个请求 | HTTP/1.1队头阻塞 |
| **头部压缩**（HPACK） | HPACK算法压缩Header | Header体积大 |
| **服务端推送** | 服务端主动推送资源 | 减少RTT |
| **流优先级** | 重要资源先传输 | 带宽分配不均 |

- **HTTP/3核心特性**：
  - 基于**QUIC**（UDP），不是TCP → 解决TCP队头阻塞
  - 0-RTT建连（首次连接后缓存，下次无需握手）
  - 内置TLS 1.3（加密是内置的）

- **HTTP各版本对比**：
  | 版本 | 关键特性 | 默认端口 |
  |------|---------|---------|
  | HTTP/1.0 | 短连接 | 80 |
  | HTTP/1.1 | 长连接、pipeline | 80 |
  | HTTP/2 | 多路复用、HPACK | 443 |
  | HTTP/3 | QUIC、0-RTT | 443 |

- **XSS防御（跨站脚本攻击）**：
  - **反射型XSS**：URL中带恶意脚本，服务器直接返回
  - **存储型XSS**：恶意脚本存入数据库，所有用户都中招
  - **DOM型XSS**：纯前端JS渲染时执行恶意脚本

  ```javascript
  // 防御：输出时转义
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }
  
  // React默认防XSS（自动转义）
  // Vue默认防XSS（自动转义）
  // 不用v-html直接渲染用户输入
  ```

- **CSRF防御（跨站请求伪造）**：
  ```typescript
  // 方案1：CSRF Token
  // 服务器生成随机token，表单中带上，验证时检查
  
  // 方案2：SameSite Cookie
  // Cookie: Set-Cookie: session=xxx; SameSite=Strict
  // Strict：完全禁止跨站携带Cookie
  // Lax：导航请求（GET）允许，其他不允许
  // None：允许跨站（需Secure）
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `网络-HTTP2HTTP3+安全.md`
- 包含：HTTP/2 vs HTTP/3对比、XSS防御CSRF防御代码

---

### 周六：复盘日

**09:00-11:00 · 复盘本周算法题**
- 重做本周所有算法题（#94/#102/#70/#322/#200/#994/#206/#226/#146/#20）
- 重点：二叉树遍历（递归+迭代）、DP、LRU缓存

**14:00-17:00 · AI + 浏览器综合练习**
- 完善AI Agent项目（添加更多工具）
- 模拟面试：Function Calling、ReAct Agent、MCP协议、CRP、HTTP/2

**19:00-21:00 · 整理Obsidian笔记**
- 检查以下笔记是否完成：
  - [ ] AI-FunctionCalling.md
  - [ ] AI-Agent开发.md
  - [ ] AI-MCP协议.md
  - [ ] 浏览器-渲染机制.md
  - [ ] 网络-HTTP2HTTP3+安全.md

---

### 周日：休息日

- 完全放松
- 回顾Week 5-6的AI工程能力笔记
- **晚上早点睡觉**

---

## 📊 Week 6 总结

| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| Function Calling | Vercel AI SDK多工具调用 | __ | __ |
| ReAct Agent | LangChain Agent循环 | __ | __ |
| MCP协议 | 理解MCP vs Function Calling | __ | __ |
| 浏览器CRP | 六步流程 + CRP优化 | __ | __ |
| HTTP/2 vs HTTP/3 | 多路复用/QUIC | __ | __ |
| XSS/CSRF | 防御方案 | __ | __ |
