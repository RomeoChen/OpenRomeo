# Week 8：收尾冲刺 —— 模拟面试 + 简历定稿 + 作品集上线 + 投递开始

> **目标**：完成2-3次模拟面试、简历ATS友好定稿、作品集上线、开始投递10+家公司
> **时间**：工作日每天3小时（08:30-09:30算法 + 20:00-22:00收尾工作）
> **参考**：《09-简历与作品集详解》《11-面试技巧详解》《12-学习资源详解》

---

## 📅 每日详细安排

### 周一：算法冲刺 + 简历定稿

**08:30-09:30 · 算法**
- 重做LeetCode Top 30高频题（必考）
- 重点：两数之和、买卖股票、移动零、有效括号、爬楼梯、反转链表、LRU缓存

**20:00-22:00 · 简历ATS友好定稿**

> **ATS（Applicant Tracking System）：招聘系统自动筛选简历，关键词匹配不上直接淘汰**

- **ATS友好简历格式**：
  - ✅ 单列布局（左对齐）
  - ✅ 纯文本（不要表格、不要图片）
  - ✅ 字体统一（Arial/Georgia）
  - ✅ 文件格式：PDF（Word可能被解析错乱）
  - ✅ 标题清晰（Experience/Projects/Skills）

- **简历结构**：
  ```
  Romeo Chen
  Full Stack Developer | AI Frontend
  📧 romeo@example.com | 📱 138-xxxx-xxxx | 🔗 github.com/RomeoChen
  
  ─────────────────────────────
  SUMMARY
  ─────────────────────────────
  3年前端开发经验，擅长React/Vue/TypeScript，主攻AI工程能力
  （RAG/Agent开发），有字节/抖音电商面试经历，追求技术深度与工程落地。
  
  ─────────────────────────────
  SKILLS
  ─────────────────────────────
  前端框架：React, Vue, Next.js, TypeScript
  AI工程：OpenAI API, Vercel AI SDK, LangChain.js, RAG, Agent
  工程化：Vite, Webpack, GitHub Actions, Vercel部署
  数据库：PostgreSQL, MongoDB, Pinecone
  语言：JavaScript, TypeScript, Python
  
  ─────────────────────────────
  EXPERIENCE
  ─────────────────────────────
  [公司名] | 前端开发工程师 | 2022.03 - 至今
  • 负责React中台系统开发，主导架构设计，开发效率提升40%
  • 性能优化：LCP 4.2s → 1.8s，Lighthouse 60 → 92
  • AI项目：基于RAG的知识库问答系统，准确率85%，用户满意度+40%
  
  ─────────────────────────────
  PROJECTS
  ─────────────────────────────
  AI知识库问答系统 | Next.js + Vercel AI SDK + Pinecone
  • 基于RAG（LangChain.js + OpenAI Embedding）实现智能问答
  • Hybrid Search + Rerank优化检索准确率达85%
  • 流式输出（Server-Sent Events），用户体验提升显著
  
  微前端架构 | qiankun + Vue/React
  • 5个独立应用整合为微前端，构建时间 5min → 1min
  • CSS样式隔离 + qiankun沙箱机制，零样式冲突
  
  ─────────────────────────────
  EDUCATION
  ─────────────────────────────
  [学校名] | 计算机科学 | 本科 | 2018 - 2022
  ```

- **ATS关键词清单**（必须包含）：
  - 技术栈：React, Vue, TypeScript, Next.js, Vite, Webpack
  - AI相关：RAG, Agent, LLM, OpenAI API, LangChain, Embedding
  - 工程化：CI/CD, GitHub Actions, Vercel, 性能优化
  - 软技能：架构设计、技术选型、团队协作

**21:30-22:00 · 检查简历**
- [ ] PDF格式
- [ ] 单列左对齐
- [ ] 包含所有ATS关键词
- [ ] 项目有数据结果（R）
- [ ] 长度：1-2页

---

### 周二：算法冲刺 + 作品集上线（Next.js + Vercel）

**08:30-09:30 · 算法**
- 重做LeetCode Top 30高频题
- 重点：树的三种遍历（递归+迭代都要会）

**20:00-22:00 · 作品集上线**

> **作品集要求**：展示3-5个项目（含1个AI项目），写2-3篇技术博客，部署到Vercel

- **Next.js作品集模板**（快速搭建）：
  ```bash
  npx create-next-app@latest portfolio
  # 选择：TypeScript + Tailwind CSS + App Router + No ESLint（快速）
  ```

- **作品集页面结构**：
  ```
  portfolio/
  ├── app/
  │   ├── page.tsx              # 首页（Hero + 项目列表）
  │   ├── projects/
  │   │   └── [slug]/page.tsx   # 项目详情页
  │   ├── blog/
  │   │   └── [slug]/page.tsx   # 技术博客
  │   └── about/page.tsx        # 关于我
  ├── components/
  │   ├── Header.tsx
  │   ├── ProjectCard.tsx
  │   └── BlogCard.tsx
  └── content/
      ├── projects/             # 项目md文件
      └── blog/                 # 博客md文件
  ```

- **项目列表（至少5个）**：

  **项目1：AI知识库问答系统**（重点展示）
  > 基于RAG的智能问答系统，支持文档上传、语义搜索、流式回答
  
  **项目2：性能优化**
  > LCP 4.2s → 1.8s，Lighthouse 60 → 92
  
  **项目3：微前端架构**
  > qiankun微前端，5个应用整合，构建时间减少80%
  
  **项目4：React组件库**
  > 20+通用组件，TypeScript类型完备
  
  **项目5：Vue3管理后台**
  > Vue3 + Element Plus + Pinia + 权限管理

- **技术博客（至少3篇）**：

  **博客1：RAG实战：从零构建AI知识库问答系统**
  > 详细讲解RAG全流程（文档切分→Embedding→检索→生成），附代码

  **博客2：React Fiber架构深度解析**
  > 可中断渲染、memoizedState链表、Diff三大策略

  **博客3：前端性能优化实战（LCP 4.2s → 1.8s）**
  > 详细的优化步骤和Lighthouse数据对比

- **部署到Vercel**：
  ```bash
  # 1. GitHub创建仓库
  git init
  git add .
  git commit -m "feat: portfolio v1.0"
  git remote add origin git@github.com:RomeoChen/portfolio.git
  git push -u origin main
  
  # 2. Vercel导入（自动检测Next.js）
  # vercel.com → New Project → Import Git Repository
  # 域名：romeochen.vercel.app
  ```

**21:30-22:00 · 作品集Lighthouse优化**
- 用Lighthouse测试作品集首页
- 目标：LCP < 2.5s，INP < 200ms，CLS < 0.1
- 优化：图片WebP格式、CSS/JS压缩、字体优化

---

### 周三：模拟面试2 + 自我介绍练习

**08:30-09:30 · 算法**
- 重做LeetCode Top 30高频题
- 重点：DP（爬楼梯/打家劫舍/零钱兑换）

**20:00-22:00 · 模拟面试2（找朋友/同事）**

> **模拟面试流程**（60分钟）：
> 1. 自我介绍（2分钟）
> 2. 算法题（2道，30分钟）
> 3. 项目讲解（1个，10分钟）
> 4. 场景题（1道，10分钟）
> 5. 反问（5分钟）

- **自我介绍模板（电梯演讲，2分钟）**：
  > "我叫Romeo，3年前端开发经验。
  >
  > 我最近在字节做React中台，主导了性能优化项目（LCP 4.2s→1.8s）和AI知识库问答系统（RAG，准确率85%）。
  >
  > 我擅长React/Vue/TypeScript，对AI工程能力（RAG/Agent开发）有深入实践，做过完整的AI项目。
  >
  > 我对技术有好奇心，喜欢深入原理（比如React Fiber架构、Vue3 Proxy响应式），也注重工程落地（比如Vite/Webpack性能优化、微前端架构）。
  >
  > 我目前在看React/AI方向的岗位，希望能加入一个有技术挑战的团队。"

- **面试后复盘**：
  - [ ] 算法题是否做出来了？
  - [ ] 项目讲解是否清晰（STAR法则）？
  - [ ] 场景题是否有思路？
  - [ ] 有什么回答不好的地方需要改进？

**21:30-22:00 · 整理简历+作品集**
- 更新简历（根据面试反馈调整）
- 更新作品集（添加面试中提到的项目亮点）

---

### 周四：算法冲刺 + 开始投递

**08:30-09:30 · 算法**
- 重做LeetCode Top 30高频题
- 重点：查漏补缺，针对性练习弱项

**20:00-22:00 · 开始投递（10+家公司）**

> **投递优先级**：
> 1. 内推优先（朋友/前同事/校友）
> 2. 目标公司（字节/腾讯/阿里面 AI/前端岗）
> 3. 中小公司（积累面试经验）

- **简历投递清单**：
  - [ ] 字节跳动（内推：找朋友）
  - [ ] 腾讯（官网投递）
  - [ ] 阿里巴巴（官网投递）
  - [ ] 美团（官网投递）
  - [ ] 拼多多（官网投递）
  - [ ] 快手（官网投递）
  - [ ] 小红书（官网投递）
  - [ ] B站（官网投递）
  - [ ] 蚂蚁（官网投递）
  - [ ] 滴滴（官网投递）

- **投递注意事项**：
  - 每家公司**只投一个岗位**（投多个容易被ATS标记）
  - 每天投递**不超过5家**（留精力准备面试）
  - 记录投递时间和岗位（面试时知道自己投了啥）

**21:30-22:00 · 面试进度表**
- 创建 `面试进度表.md`（Obsidian）
- 记录：投递时间、公司、岗位、状态（已投递/一面/二面/offer）

---

### 周五：模拟面试3 + 复盘

**08:30-09:30 · 算法**
- 最终复盘LeetCode Top 30高频题
- 确保每道题都能在20分钟内做出来

**20:00-21:00 · 模拟面试3（找朋友/同事）**
- 进行第三次模拟面试
- 重点练习弱项（根据前两次反馈调整）

**21:00-22:00 · 最终复盘**
- 整理所有Obsidian笔记
- 确保以下内容都已完成：
  - [ ] 算法笔记（闭包/原型链/Promise/Event Loop）
  - [ ] React/Vue笔记（Fiber/Diff/Hooks/Proxy）
  - [ ] AI笔记（Prompt/RAG/Agent/MCP）
  - [ ] 工程化笔记（Vite/Webpack/CI/CD）
  - [ ] 项目STAR文档（3个）
  - [ ] 简历（ATS友好版）
  - [ ] 作品集（上线版）

---

### 周六：最后准备

**09:00-11:00 · 最终复盘**
- 再次回看所有模拟面试录像
- 针对性改进

**14:00-17:00 · 准备面试材料**
- 打印简历（5份）
- 准备笔记本+笔
- 确认手机/电脑充电
- 准备好自我介绍（背熟）

**19:00-21:00 · 放松**
- 看电影/运动/玩游戏
- **早点睡觉**

---

### 周日：休息日（非常重要）

- 完全放松
- 不要学习
- 保持好心态
- 准备迎接下周面试

---

## 🎉 8周完成庆祝！

**你已完成：**
- ✅ 算法题：70-100道
- ✅ AI项目：1个（RAG知识库问答系统）
- ✅ STAR项目：3个（含AI项目）
- ✅ 模拟面试：2-3次
- ✅ 简历：ATS友好定稿
- ✅ 作品集：上线（Lighthouse > 90）
- ✅ 投递：10+家公司

**接下来：**
- 📅 等待面试通知
- 📚 根据面试反馈针对性复习
- 💪 每次面试后复盘改进
- 🎯 最终拿下Offer！

---

## 📊 Week 8 总结

| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| 简历 | ATS友好PDF定稿 | __ | __ |
| 作品集 | Next.js + Vercel上线 | __ | __ |
| Lighthouse | LCP/INP/CLS达标 | __ | __ |
| 模拟面试 | 3次完整模拟 | __ | __ |
| 自我介绍 | 电梯演讲2分钟 | __ | __ |
| 投递 | 10+家公司 | __ | __ |
| 面试进度表 | 创建并维护 | __ | __ |

---

*恭喜你完成8周系统准备！🎉 接下来就是收获offer的季节！*
