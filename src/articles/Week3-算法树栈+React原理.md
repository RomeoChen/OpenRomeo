# Week 3：算法（树/栈队列）+ React原理（Fiber/Diff/Hooks）

> **目标**：掌握树/栈队列算法、理解React Fiber架构/Virtual DOM Diff/Hooks原理，刷题8-10道
> **时间**：工作日每天3小时（08:30-09:30算法 + 20:00-22:00框架）
> **参考**：《02-React-Vue框架详解》《03-算法与数据结构详解》

---

## 📅 每日详细安排

### 周一：树的遍历（最常见的算法类型）

**08:30-09:30 · 算法**
- LeetCode #94 [二叉树中序遍历](https://leetcode.com/problems/binary-tree-inorder-traversal/)
- 递归版本 + 迭代版本（用栈模拟递归）
- **迭代版本（手写，必背）**：
  ```javascript
  function inorder(root) {
    const result = []
    const stack = []
    let cur = root
    while (cur || stack.length) {
      while (cur) {
        stack.push(cur)
        cur = cur.left
      }
      cur = stack.pop()
      result.push(cur.val)
      cur = cur.right
    }
    return result
  }
  ```

**20:00-21:30 · React Fiber架构（为什么需要Fiber？）**
> 学习资源：React官方文档 + React Tech Stack

- **为什么需要Fiber？**
  - React 15的递归调和（Reconciliation）不可中断
  - 主线程被阻塞 → 用户输入/动画卡顿
  - Fiber把递归渲染变成**可中断的增量渲染**

- **Fiber核心思想**：
  - 每个React元素 → 一个Fiber节点（包含`child`/`sibling`/`return`三个指针）
  - 每个时间片（16ms）只处理一个Fiber节点
  - 优先级：用户交互 > 数据更新 > 动画 > 网络请求

- **Fiber结构**（简化版）：
  ```javascript
  fiber = {
    type,        // 'div' | 'span' | Component
    key,         // diff时的唯一标识
    stateNode,   // DOM节点
    child,       // 第一个子节点
    sibling,     // 下一个兄弟节点
    return,      // 父节点
    memoizedState, // hooks链表头
    memoizedProps,
    pendingProps,
    // ...更多字段
  }
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `React-Fiber架构.md`
- 包含：Fiber五指针关系图、为什么需要Fiber、可中断渲染流程

---

### 周二：更多树算法 + Virtual DOM与Diff

**08:30-09:30 · 算法**
- LeetCode #102 [二叉树层序遍历](https://leetcode.com/problems/binary-tree-level-order-traversal/)
- BFS（队列）+ DFS（栈）两种解法
- **层序遍历BFS（手写）**：
  ```javascript
  function levelOrder(root) {
    if (!root) return []
    const result = []
    const queue = [root]
    while (queue.length) {
      const level = []
      const size = queue.length
      for (let i = 0; i < size; i++) {
        const node = queue.shift()
        level.push(node.val)
        if (node.left) queue.push(node.left)
        if (node.right) queue.push(node.right)
      }
      result.push(level)
    }
    return result
  }
  ```

**20:00-21:30 · Virtual DOM与Diff算法**
> 学习资源：React官方文档

- **Diff算法三个核心策略**：
  1. **同级比较**（只比较同一层级，不跨层级）
  2. **类型不同则替换**（`div` → `span` → 整个子树卸载重建）
  3. **使用key优化列表**（`key`帮助识别哪些节点变了）

- **Diff对比过程**：
  - 新的虚拟DOM vs 旧的虚拟DOM → 找出差异 → 最小化DOM操作
  - key的作用：告诉React哪些元素是"同一个"，避免不必要的重新创建

- **手写简化Diff**：
  ```javascript
  function diff(oldTree, newTree) {
    const patches = []
    // 递归对比
    function walk(oldNode, newNode, index = 0, patches) {
      // 1. 类型不同 → 替换
      if (oldNode.type !== newNode.type) {
        patches.push({ type: 'REPLACE', node: newNode })
      } else if (oldNode.key !== newNode.key) {
        // 2. key不同 → 替换
        patches.push({ type: 'REPLACE', node: newNode })
      } else {
        // 3. 类型相同 → 比较props和children
        if (oldNode.props !== newNode.props) {
          patches.push({ type: 'PROPS', props: newNode.props })
        }
        // 递归比较children
        oldNode.children.forEach((child, i) => {
          walk(child, newTree.children[i], i, patches)
        })
      }
    }
    walk(oldTree, newTree, 0, patches)
    return patches
  }
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `React-VirtualDOM与Diff.md`
- 包含：Diff三大策略、key的作用、手写简化Diff代码

---

### 周三：反转链表 + React Hooks原理

**08:30-09:30 · 算法**
- LeetCode #206 [反转链表](https://leetcode.com/problems/reverse-linked-list/)
- **迭代版本（手写）**：
  ```javascript
  function reverseList(head) {
    let prev = null
    let cur = head
    while (cur) {
      const next = cur.next
      cur.next = prev
      prev = cur
      cur = next
    }
    return prev
  }
  ```
- **递归版本**：
  ```javascript
  function reverseList(head) {
    if (!head || !head.next) return head
    const newHead = reverseList(head.next)
    head.next.next = head
    head.next = null
    return newHead
  }
  ```

**20:00-21:30 · React Hooks原理（为什么Hooks不能写在if/循环中？）**
> 学习资源：React官方文档 + Hooks源码分析

- **Hooks的渲染模式**：
  - React靠`memoizedState`链表存储所有hooks的状态
  - 每次渲染按**顺序**读取链表中的hook（第一个是useState，第二个是useEffect...）

- **为什么不能条件/循环中写Hooks？**
  - 如果第一次渲染`if(user)`跳过了一个hook
  - 第二次渲染`if(admin)`又包含了那个hook
  - Hooks链表顺序就错了 → React无法正确匹配状态

- **useState原理**：
  ```javascript
  function useState(initialState) {
    const hook = currentHook = hooks[currentIndex++]
    if (!hook) {
      // 首次渲染：初始化
      hook = { state: initialState, queue: [] }
      hooks.push(hook)
    }
    // 更新时：从queue中取出所有setState
    hook.state = hook.queue.reduce((s, a) => a(s), hook.state)
    const setState = (action) => {
      hook.queue.push(action)
      schedule()  // 触发重新渲染
    }
    return [hook.state, setState]
  }
  ```

- **useEffect原理**：
  - `useEffect`在组件渲染后调用
  - 通过`queue`链表存储所有effect
  - `flushPassiveEffects`在浏览器绘制后统一执行

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `React-Hooks原理.md`
- 包含：memoizedState链表图、为什么不能条件/循环中写Hooks、useState/useEffect原理

---

### 周四：栈/队列 + Vue3响应式原理

**08:30-09:30 · 算法**
- LeetCode #20 [有效括号](https://leetcode.com/problems/valid-parentheses/)
- **栈解法（手写）**：
  ```javascript
  function isValid(s) {
    const stack = []
    const map = { ')': '(', ']': '[', '}': '{' }
    for (const char of s) {
      if ('([{'.includes(char)) {
        stack.push(char)
      } else {
        if (stack.pop() !== map[char]) return false
      }
    }
    return stack.length === 0
  }
  ```

**20:00-21:30 · Vue3响应式原理（Proxy vs Object.defineProperty）**
> 学习资源：Vue3官方文档 + 源码分析

- **Vue2的问题（Object.defineProperty）**：
  - 无法监听新增属性（需要`Vue.set`）
  - 无法监听数组下标变化（Vue2重写了数组方法）
  - 深度监听需要递归， 성능差

- **Vue3的解决方案（Proxy）**：
  ```javascript
  const reactive = (obj) => {
    return new Proxy(obj, {
      get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver)
        // 依赖收集：track(target, key)
        track(target, key)
        // 深度代理
        return typeof result === 'object' ? reactive(result) : result
      },
      set(target, key, value, receiver) {
        const oldValue = target[key]
        const result = Reflect.set(target, key, value, receiver)
        // 触发更新：trigger(target, key)
        if (oldValue !== value) {
          trigger(target, key)
        }
        return result
      },
      deleteProperty(target, key) {
        const result = Reflect.deleteProperty(target, key)
        trigger(target, key)
        return result
      }
    })
  }
  ```

- **手写reactive**：
  ```javascript
  const { reactive, effect } = createReactivity()
  
  function createReactivity() {
    const deps = new Map()  // key → Set<fn>
    
    const reactive = (obj) => new Proxy(obj, {
      get(target, key) {
        track(target, key)
        return Reflect.get(target, key)
      },
      set(target, key, value) {
        Reflect.set(target, key, value)
        trigger(target, key)
        return true
      }
    })
    
    const track = (target, key) => {
      const fn = currentEffect
      if (fn) {
        if (!deps.has(key)) deps.set(key, new Set())
        deps.get(key).add(fn)
      }
    }
    
    const trigger = (target, key) => {
      const effects = deps.get(key)
      effects?.forEach(fn => fn())
    }
    
    let currentEffect = null
    const effect = (fn) => {
      currentEffect = fn
      fn()
      currentEffect = null
    }
    
    return { reactive, effect }
  }
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `Vue3-响应式原理.md`
- 包含：Proxy vs defineProperty对比、手写reactive代码、track/trigger原理

---

### 周五：LRU缓存 + Vite原理与配置

**08:30-09:30 · 算法**
- LeetCode #146 [LRU缓存](https://leetcode.com/problems/lru-cache/)（哈希表+双向链表）
- **手写LRU（面试高频）**：
  ```javascript
  class LRUCache {
    constructor(capacity) {
      this.capacity = capacity
      this.map = new Map()
    }
    
    get(key) {
      if (!this.map.has(key)) return -1
      const val = this.map.get(key)
      // 移到末尾（最新使用）
      this.map.delete(key)
      this.map.set(key, val)
      return val
    }
    
    put(key, val) {
      if (this.map.has(key)) {
        this.map.delete(key)
      } else if (this.map.size >= this.capacity) {
        // 删除最旧的（Map的第一个）
        const oldest = this.map.keys().next().value
        this.map.delete(oldest)
      }
      this.map.set(key, val)
    }
  }
  ```

**20:00-21:30 · Vite原理与配置**
> 学习资源：Vite官方文档 (vitejs.dev)

- **Vite vs Webpack**：
  | 特性 | Vite | Webpack |
  |------|------|---------|
  | 开发启动 | ESM按需编译（秒开） | 全量打包（慢） |
  | 生产构建 | Rollup | Webpack |
  | HMR | ESM（按模块） | 全量重新构建 |
  | 配置 | 简单 | 复杂 |

- **Vite核心原理**：
  - 开发时：浏览器直接用`<script type="module">`加载ESM，Vite Server按需编译（只编译当前需要的模块）
  - 生产时：Rollup进行Tree-shaking和代码分割

- **Vite配置示例**：
  ```javascript
  import { defineConfig } from 'vite'
  import vue from '@vitejs/plugin-vue'
  import path from 'path'
  
  export default defineConfig({
    plugins: [vue()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') }
    },
    server: {
      port: 3000,
      proxy: {
        '/api': { target: 'http://localhost:8080', changeOrigin: true }
      }
    },
    build: {
      rollupOptions: {
        output: { manualChunks: { 'vue-vendor': ['vue', 'vue-router'] } }
      }
    }
  })
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `工程化-Vite.md`
- 包含：Vite vs Webpack对比、Vite配置示例

---

### 周六：复盘日

**09:00-11:00 · 复盘本周算法题**
- 重做本周所有算法题（#94、#102、#206、#20、#146）
- 重点：二叉树三种遍历、LRU缓存（哈希表+双向链表）

**14:00-17:00 · 框架原理综合练习**
- 模拟面试：React Fiber、Virtual DOM Diff、Hooks原理、Vue3 Proxy
- 录音自己回答，对照改进

**19:00-21:00 · 整理Obsidian笔记**
- 检查以下笔记是否完成：
  - [ ] React-Fiber架构.md
  - [ ] React-VirtualDOM与Diff.md
  - [ ] React-Hooks原理.md
  - [ ] Vue3-响应式原理.md
  - [ ] 工程化-Vite.md

---

### 周日：休息日

- 完全放松
- 浏览Vue.js官方博客(https://blog.vuejs.org/)
- **晚上早点睡觉**

---

## 📊 Week 3 总结

| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| 算法题 | 5道（树+栈） | __ | __ |
| React Fiber | 能解释可中断渲染 | __ | __ |
| Virtual DOM Diff | Diff三大策略 | __ | __ |
| Hooks原理 | 为什么不能条件中写 | __ | __ |
| Vue3 Proxy | 手写reactive | __ | __ |
| Vite | vs Webpack区别 | __ | __ |
