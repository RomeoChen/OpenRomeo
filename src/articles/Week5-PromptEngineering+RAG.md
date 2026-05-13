# Week 5：AI工程能力（上）—— Prompt Engineering + RAG

> **目标**：掌握Prompt Engineering（Few-shot/CoT/ReAct）和RAG全流程（索引/检索/生成），刷题5-8道 + 完成AI项目
> **时间**：工作日每天3小时（08:30-09:30算法 + 20:00-22:00 AI工程）
> **参考**：《04-AI工程能力详解》

---

## 📅 每日详细安排

### 周一：Prompt Engineering核心技巧（Few-shot + CoT）

**08:30-09:30 · 算法**
- LeetCode #1 [两数之和](https://leetcode.com/problems/two-sum/)再刷（哈希表）
- 练习场景题：手写数组扁平化

**20:00-21:30 · Prompt Engineering（Few-shot + Chain-of-Thought）**
> 学习资源：https://www.promptingguide.ai/ + Vercel AI SDK文档

- **Zero-shot（零样本）**：
  ```
  用户：把"Hello"翻译成中文
  模型：你好
  ```

- **Few-shot（少样本，给示例）**：
  ```
  用户：把以下句子翻译成中文：
  "The weather is nice" → 天气很好
  "I love coding" → 我喜欢编程
  "AI is amazing" →
  模型：人工智能很神奇
  ```

- **Chain-of-Thought（CoT，逐步思考）**：
  ```
  用户：一个商店有23个苹果，卖掉了8个，又进货了12个。现在有多少苹果？
  思考：23 - 8 = 15，15 + 12 = 27
  最终：27个苹果
  ```

- **Few-shot + CoT组合**：
  ```
  用户：判断以下数字是奇数还是偶数（先思考，再回答）：
  12 → 12是偶数（能被2整除）
  7 → 7是奇数（不能被2整除）
  15 →
  模型：15是奇数（15 ÷ 2 = 7 余 1，不能被2整除）
  ```

- **Vercel AI SDK调用（必会）**：
  ```typescript
  import { generateText } from 'ai'
  import { openai } from '@ai-sdk/openai'
  
  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt: '用一句话解释量子计算',
    system: '你是一位量子物理学家，用通俗易懂的语言解释',
    maxTokens: 200,
    temperature: 0.7,
  })
  
  console.log(text)  // 模型输出
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `AI-PromptEngineering.md`
- 包含：Zero-shot/Few-shot/CoT示例、Vercel AI SDK代码

---

### 周二：ReAct（推理+行动）+ 流式输出

**08:30-09:30 · 算法**
- LeetCode #283 [移动零](https://leetcode.com/problems/move-zeroes/)再刷
- LeetCode #121 [买卖股票](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)再刷

**20:00-21:30 · ReAct（推理+行动）+ 流式输出（SSE）**
> 学习资源：Vercel AI SDK官方文档 + LangChain.js

- **ReAct（Reasoning + Acting）**：
  - 让大模型在推理过程中调用外部工具（搜索/计算/查数据库）
  - 循环：Thought（思考）→ Action（行动）→ Observation（观察）

- **ReAct示例（伪代码）**：
  ```
  用户：北京今天的天气如何？
  
  Thought：我需要先查一下北京的天气
  Action：search_weather(city="北京")
  Observation：今天气温15-25度，晴
  
  Thought：现在我有天气信息了，可以回答用户了
  Final Answer：今天北京气温15-25度，天气晴朗，适合出行。
  ```

- **LangChain.js ReAct Agent**：
  ```typescript
  import { createReactAgent } from 'langchain/agents'
  import { search } from './tools/search'
  
  const agent = createReactAgent({
    llm: new ChatOpenAI({ model: 'gpt-4o' }),
    tools: [search],
  })
  
  const response = await agent.invoke({
    input: '帮我查一下北京今天的天气'
  })
  ```

- **流式输出（SSE，实时看到打字效果）**：
  ```typescript
  import { streamText } from 'ai'
  
  const result = await streamText({
    model: openai('gpt-4o'),
    prompt: '写一篇关于AI的短文',
  })
  
  // 流式返回（一个字一个字地显示）
  for await (const chunk of result.fullStream) {
    process.stdout.write(chunk.textDelta)
  }
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `AI-ReAct与流式输出.md`
- 包含：ReAct原理、LangChain Agent代码、流式输出代码

---

### 周三：RAG全流程（索引→检索→生成）

**08:30-09:30 · 算法**
- LeetCode #20 [有效括号](https://leetcode.com/problems/valid-parentheses/)再刷
- LeetCode #3 [无重复字符的最长子串](https://leetcode.com/problems/longest-substring-without-repeating-characters/)再刷

**20:00-21:30 · RAG（检索增强生成）全流程**
> 学习资源：LangChain.js RAG文档 + Pinecone官方文档

- **RAG三步流程**：
  1. **索引（Indexing）**：文档切分 → Embedding → 存入向量数据库
  2. **检索（Retrieval）**：用户问题Embedding → 在向量库中找最相似的K个文档块
  3. **生成（Generation）**：把检索到的文档块 + 用户问题 → 一起发给LLM → 生成答案

- **RAG代码实现（LangChain.js + Pinecone）**：
  ```typescript
  import { PineconeStore } from '@langchain/pinecone'
  import { OpenAIEmbeddings } from '@langchain/openai'
  import { Document } from 'langchain/document'
  
  // ========== 1. 索引阶段 ==========
  const texts = [
    'React是一个用于构建用户界面的JavaScript库',
    'Vue是一个渐进式JavaScript框架',
    'Angular是一个完整的前端框架',
  ]
  
  const docs = texts.map(t => new Document({ pageContent: t }))
  
  // Embedding + 存入Pinecone
  const vectorStore = await PineconeStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({ model: 'text-embedding-3-small' }),
    { pineconeIndex: index, namespace: 'tech-docs' }
  )
  
  // ========== 2. 检索阶段 ==========
  const results = await vectorStore.similaritySearch(
    '什么是React？',  // 用户问题
    2  // 取Top2最相似的文档
  )
  
  // ========== 3. 生成阶段 ==========
  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt: `根据以下文档回答用户问题：
  文档：${results.map(r => r.pageContent).join('\n')}
  问题：什么是React？`
  })
  ```

- **文档切分策略**：
  - 固定长度切分：`chunk_size=500, chunk_overlap=50`
  - 按语义切分：用NLP识别句子边界
  - 切分太小：丢失上下文；切分太大：引入噪声

- **Embedding模型选择**：
  - `text-embedding-3-small`：便宜，适合中文，速度快
  - `text-embedding-3-large`：贵，效果更好
  - 中文支持：`text-embedding-3-small`已支持中文

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `AI-RAG全流程.md`
- 包含：RAG三步流程、LangChain+Pinecone代码、文档切分策略

---

### 周四：RAG优化（Hybrid Search + Rerank + Self-RAG）

**08:30-09:30 · 算法**
- LeetCode #206 [反转链表](https://leetcode.com/problems/reverse-linked-list/)再刷
- LeetCode #141 [环形链表](https://leetcode.com/problems/linked-list-cycle/)再刷

**20:00-21:30 · RAG优化（Hybrid Search + Rerank + Self-RAG）**
> 学习资源：LangChain Rerank文档 + Self-RAG论文

- **Hybrid Search（混合检索）**：
  - 向量检索（语义相似性）：找"意思相近"的内容
  - 关键词检索（BM25）：找"包含关键词"的内容
  - 两者结合：既懂语义又会匹配关键词

  ```typescript
  import { EnsembleRetriever } from 'langchain/retrievers/ensemble'
  
  const retriever = new EnsembleRetriever({
    retrievers: [
      vectorStore.asRetriever(),  // 向量检索
      bm25Retriever,              // 关键词检索
    ],
    weights: [0.5, 0.5]  // 各占50%
  })
  ```

- **Rerank（重排序，让结果更准）**：
  - 第一轮：用向量检索快速找出Top50候选
  - 第二轮：用Cross-Encoder重新排序（更准确但更慢）
  - 最终输出：Top5最相关的结果

  ```typescript
  import { ContextualCompressionRetriever } from 'langchain/retrievers/contextual_compression'
  import { CohereRerank } from '@langchain/cohere'
  
  const compressor = new CohereRerank({ model: 'rerank-english-v3.0' })
  
  const retriever = new ContextualCompressionRetriever({
    baseRetriever: vectorStore.asRetriever(),
    documentCompressor: compressor,
  })
  ```

- **Self-RAG（让模型自我判断是否需要检索）**：
  - 在prompt中让模型自己决定是否需要检索
  - 减少不必要的检索，降低Token成本

  ```typescript
  const prompt = `
  你是一个AI助手。当用户提问时，先判断是否需要检索知识库。
  
  如果需要检索，回答格式：
  [Retrieval] 用户问题中需要检索的部分
  [Answer] 基于检索结果的回答
  
  如果不需要检索，直接回答：
  [Direct] 你的回答
  `
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 更新 `AI-RAG全流程.md`，增加RAG优化章节
- 包含：Hybrid Search、Rerank、Self-RAG代码

---

### 周五：AI项目实战（做一个RAG知识库问答系统）

**08:30-09:30 · 算法**
- LeetCode #70 [爬楼梯](https://leetcode.com/problems/climbing-stairs/)再刷
- LeetCode #146 [LRU缓存](https://leetcode.com/problems/lru-cache/)再刷

**20:00-22:00 · AI项目实战（Next.js + Vercel AI SDK + Pinecone）**

> **项目目标**：做一个AI知识库问答系统（类似Perplexity），用户问问题 → RAG检索 → AI回答

- **技术栈**：
  - 前端：Next.js 14 + Tailwind CSS
  - AI：Vercel AI SDK（OpenAI GPT-4o）
  - 向量数据库：Pinecone（免费额度）
  - Embedding：OpenAI text-embedding-3-small
  - 部署：Vercel（免费）

- **项目结构**：
  ```
  knowledge-qa/
  ├── app/
  │   ├── page.tsx          # 首页（输入框）
  │   ├── api/
  │   │   └── chat/route.ts  # API路由（RAG逻辑）
  │   └── layout.tsx
  ├── lib/
  │   ├── pinecone.ts       # Pinecone初始化
  │   ├── openai.ts         # OpenAI初始化
  │   └── rag.ts            # RAG核心逻辑
  ├── docs/                  # 知识库文档（.txt/.md）
  ├── package.json
  └── .env.local
  ```

- **核心代码（API路由）**：
  ```typescript
  // app/api/chat/route.ts
  import { streamText } from 'ai'
  import { openai } from '@ai-sdk/openai'
  import { PineconeStore } from '@langchain/pinecone'
  import { OpenAIEmbeddings } from '@langchain/openai'
  import { pinecone } from '@/lib/pinecone'
  
  export async function POST(req: Request) {
    const { messages } = await req.json()
    const userMessage = messages[messages.length - 1].content
    
    // 1. 用户问题Embedding
    const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' })
    const index = pinecone.Index('knowledge-base')
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index })
    
    // 2. 检索Top3相关文档
    const docs = await vectorStore.similaritySearch(userMessage, 3)
    
    // 3. 构建Prompt（加入检索到的文档）
    const context = docs.map(d => d.pageContent).join('\n\n')
    const prompt = `根据以下知识库内容回答用户问题：
    
    知识库内容：
    ${context}
    
    用户问题：${userMessage}
    
    回答要求：
    1. 只基于知识库内容回答，不要编造
    2. 如果知识库没有相关内容，说"我不知道"
    3. 用简洁清晰的语言回答`
    
    // 4. 流式生成答案
    const result = await streamText({
      model: openai('gpt-4o'),
      prompt,
    })
    
    return result.toDataStreamResponse()
  }
  ```

- **环境变量**：
  ```
  OPENAI_API_KEY=sk-xxx      # OpenAI API Key
  PINECONE_API_KEY=xxx        # Pinecone API Key
  PINECONE_ENVIRONMENT=us-east-1
  PINECONE_INDEX=knowledge-base
  ```

**21:30-22:00 · 整理项目文档（Obsidian）**
- 创建 `项目-AI知识库问答系统.md`
- 包含：项目架构图、核心代码、技术栈、环境变量配置

---

### 周六：AI项目完善 + 复盘

**09:00-11:00 · 完善AI项目**
- 部署到Vercel（免费）
- 测试RAG效果（问几个问题看检索是否准确）
- 优化Prompt（Few-shot/CoT）
- 添加上传文档功能（让用户上传自己的知识库）

**14:00-17:00 · 复盘本周算法题 + AI知识**
- 重做本周所有算法题（#1/#283/#121/#20/#3/#206/#141/#70/#146）
- 复盘：Prompt Engineering、RAG全流程、RAG优化
- 模拟面试：AI项目讲解

**19:00-21:00 · 整理Obsidian笔记**
- 检查以下笔记是否完成：
  - [ ] AI-PromptEngineering.md
  - [ ] AI-ReAct与流式输出.md
  - [ ] AI-RAG全流程.md
  - [ ] 项目-AI知识库问答系统.md

---

### 周日：休息日

- 完全放松
- 浏览LangChain Blog (https://blog.langchain.dev/)
- **晚上早点睡觉**

---

## 📊 Week 5 总结

| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| Prompt Engineering | Few-shot/CoT/ReAct | __ | __ |
| RAG全流程 | 能手写索引+检索+生成 | __ | __ |
| RAG优化 | Hybrid Search/Rerank/Self-RAG | __ | __ |
| AI项目 | RAG知识库问答系统上线 | __ | __ |
| Token成本 | 知道如何控制成本 | __ | __ |
