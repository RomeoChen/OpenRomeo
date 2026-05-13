# Week 1：JS基础（上）—— 闭包/原型链/继承/EventLoop/Promise

> **目标**：掌握JS核心概念（闭包、原型链、继承、事件循环、Promise），刷题5-8道
> **时间**：工作日每天3小时（08:30-09:30算法 + 20:00-22:00理论）
> **参考**：《01-JS-TS基础详解》

---

## 📅 每日详细安排

### 周一：闭包（最核心的概念）

**08:30-09:30 · 算法**
- LeetCode #1 [两数之和](https://leetcode.com/problems/two-sum/)（哈希表，O(n)解法）
- 复习暴力解法O(n²)，对比哈希表解法

**20:00-21:30 · 闭包（3个场景）**
> 学习资源：《JavaScript高级程序设计（第5版）》第10章

- **场景1：防抖/节流**（必会，手写debounce/throttle）
  ```javascript
  function debounce(fn, delay) {
    let timer = null
    return function(...args) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, delay)
    }
  }
  ```
- **场景2：模块化（IIFE）**（私有变量，模拟块级作用域）
- **场景3：函数工厂**（偏函数，科里化基础）

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `JS-闭包.md`，包含：
  - 闭包定义：函数记住并访问外部变量
  - 3个场景代码示例
  - 闭包优缺点（内存泄漏风险）

---

### 周二：原型链（JS面向对象的根基）

**08:30-09:30 · 算法**
- LeetCode #283 [移动零](https://leetcode.com/problems/move-zeroes/)（双指针）
- 理解快慢指针的思路

**20:00-21:30 · 原型链（完整图解）**
> 学习资源：《JavaScript高级程序设计（第5版）》第8章

- **原型链五步**：
  1. `person.__proto__` 指向 `Person.prototype`
  2. `Person.prototype.__proto__` 指向 `Object.prototype`
  3. `Object.prototype.__proto__` 为 `null`（终点）
  4. `Function.__proto__` 指向 `Function.prototype`
  5. `Function.prototype.__proto__` 指向 `Object.prototype`

- **手写instanceof**：
  ```javascript
  function myInstanceOf(left, right) {
    let proto = left.__proto__
    while (proto !== null) {
      if (proto === right.prototype) return true
      proto = proto.__proto__
    }
    return false
  }
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `JS-原型链.md`
- 画原型链示意图（手绘拍照存Obsidian）
- 写instanceof手写代码

---

### 周三：继承（6种方式）

**08:30-09:30 · 算法**
- LeetCode #121 [买卖股票](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)（动态规划入门）
- 理解"最大差值"的思路

**20:00-21:30 · 继承（6种方式）**
> 学习资源：《JavaScript高级程序设计（第5版）》第9章

| 方式 | 优点 | 缺点 |
|------|------|------|
| 原型链继承 | 简单 | 引用类型共享 |
| 构造函数继承 | 不共享 | 不能继承原型属性 |
| 组合继承 | 完美 | 调用两次构造函数 |
| 原型式继承 | 简洁 | 引用类型共享 |
| 寄生式继承 | 可增强 | 同上 |
| **寄生组合式继承** | **最佳方案** | — |

- **寄生组合式继承（手写，必会）**：
  ```javascript
  function Parent(name) { this.name = name }
  Parent.prototype.say = function() { console.log(this.name) }
  
  function Child(name, age) {
    Parent.call(this, name)
    this.age = age
  }
  
  function inherit(Child, Parent) {
    Child.prototype = Object.create(Parent.prototype)
    Child.prototype.constructor = Child
  }
  inherit(Child, Parent)
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `JS-继承.md`
- 画6种继承方式对比表
- 重点标注寄生组合式继承

---

### 周四：事件循环（浏览器异步的基石）

**08:30-09:30 · 算法**
- LeetCode #20 [有效括号](https://leetcode.com/problems/valid-parentheses/)（栈）
- 理解栈在匹配问题中的应用

**20:00-21:30 · 事件循环（宏任务/微任务）**
> 学习资源：https://javascript.info/event-loop

- **任务队列**：
  - **宏任务**：setTimeout/setInterval、I/O、setImmediate、UI渲染
  - **微任务**：Promise.then/Promise.catch、queueMicrotask、MutationObserver、process.nextTick

- **执行顺序口诀**：先微后宏，同一轮次微任务全部执行完，再执行下一个宏任务

- **手写输出以下代码的顺序**：
  ```javascript
  console.log('1')  // 同步
  
  setTimeout(() => console.log('2'), 0)  // 宏任务
  
  Promise.resolve().then(() => console.log('3'))  // 微任务
  
  console.log('4')  // 同步
  
  // 输出顺序：1 → 4 → 3 → 2
  ```

- **进阶题**：
  ```javascript
  async function asyncOrder() {
    console.log('1')
    await Promise.resolve()
    console.log('2')
    setTimeout(() => console.log('3'), 0)
    new Promise(resolve => {
      console.log('4')
      resolve()
    }).then(() => console.log('5'))
    console.log('6')
  }
  asyncOrder()
  // 输出：1 → 6 → 2 → 4 → 5 → 3
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `JS-事件循环.md`
- 画事件循环流程图
- 写输出题（至少5道）

---

### 周五：Promise（异步编程的核心）

**08:30-09:30 · 算法**
- LeetCode #3 [无重复字符的最长子串](https://leetcode.com/problems/longest-substring-without-repeating-characters/)（滑动窗口）
- 理解滑动窗口的思路

**20:00-21:30 · Promise（手写Promise）**
> 学习资源：《JavaScript高级程序设计（第5版）》第11章

- **Promise状态**：pending → fulfilled/rejected（不可逆）
- **手写Promise构造函数**：
  ```javascript
  class MyPromise {
    constructor(executor) {
      this.state = 'pending'
      this.value = undefined
      this.callbacks = []
      
      const resolve = (value) => {
        if (this.state !== 'pending') return
        this.state = 'fulfilled'
        this.value = value
        this.callbacks.forEach(cb => cb.onFulfilled(value))
      }
      
      const reject = (reason) => {
        if (this.state !== 'pending') return
        this.state = 'rejected'
        this.value = reason
        this.callbacks.forEach(cb => cb.onRejected(reason))
      }
      
      try {
        executor(resolve, reject)
      } catch (e) {
        reject(e)
      }
    }
    
    then(onFulfilled, onRejected) {
      return new MyPromise((resolve, reject) => {
        const handle = (callback, fallback) => {
          try {
            const fn = typeof callback === 'function' ? callback : fallback
            if (this.state === 'fulfilled') {
              resolve(fn(this.value))
            } else if (this.state === 'rejected') {
              reject(fn(this.value))
            } else {
              this.callbacks.push({
                onFulfilled: (v) => resolve(fn(v)),
                onRejected: (v) => reject(fn(v))
              })
            }
          } catch (e) {
            reject(e)
          }
        }
        
        handle(onFulfilled, v => v)
        handle(onRejected, v => { throw v })
      })
    }
    
    static all(promises) { /* 重点手写 */ }
    static race(promises) { /* 重点手写 */ }
  }
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `JS-Promise.md`
- 写手写Promise代码（完整版）
- 重点：Promise.then()返回新Promise、Promise.all()手写

---

### 周六：复盘日

**09:00-11:00 · 复盘本周算法题**
- 重做本周所有算法题（#1、#283、#121、#20、#3）
- 重点：两数之和(哈希表)、移动零(双指针)、买卖股票(DP)、有效括号(栈)、无重复字符(滑动窗口)
- 确保每道题都能白板写出

**14:00-17:00 · JS综合练习**
- 模拟面试：闭包、原型链、继承、事件循环、Promise
- 录音自己回答，对照改进

**19:00-21:00 · 整理Obsidian笔记**
- 检查以下笔记是否完成：
  - [ ] JS-闭包.md
  - [ ] JS-原型链.md
  - [ ] JS-继承.md
  - [ ] JS-事件循环.md
  - [ ] JS-Promise.md

---

### 周日：休息日

- 完全放松（运动、电影、游戏）
- 可以浏览掘金(https://juejin.cn/)看前端文章
- **晚上早点睡觉**

---

## 📊 Week 1 总结

| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| 算法题 | 5道 | __ | __ |
| 闭包手写 | 防抖函数 | __ | __ |
| 原型链 | 能画图解释 | __ | __ |
| 继承 | 手写寄生组合式 | __ | __ |
| 事件循环 | 5道输出题全对 | __ | __ |
| Promise | 手写Promise.all | __ | __ |

---

## ⚠️ 常见问题

**Q：闭包内存泄漏怎么办？**
A：闭包引用外部变量后，手动设为null帮助垃圾回收（`timer = null`）

**Q：Promise和async/await有什么区别？**
A：async/await是Promise的语法糖，让异步代码看起来像同步代码

**Q：事件循环和微任务队列的优先级？**
A：同一轮事件循环中，**微任务队列优先于宏任务队列**执行
