# Week 2：JS基础（下）+ TypeScript入门 + CSS布局

> **目标**：掌握TypeScript基础、Flex/Grid/BFC布局，刷题5-8道
> **时间**：工作日每天3小时（08:30-09:30算法 + 20:00-22:00理论）
> **参考**：《01-JS-TS基础详解》《07-CSS与布局详解》

---

## 📅 每日详细安排

### 周一：TypeScript基础（类型系统）

**08:30-09:30 · 算法**
- LeetCode #70 [爬楼梯](https://leetcode.com/problems/climbing-stairs/)（斐波那契，DP）
- 理解一维动态规划的思路

**20:00-21:30 · TypeScript基础（类型注解+接口+类型推断）**
> 学习资源：《TypeScript编程》第1-3章

- **类型注解**：`let name: string = 'romeo'`
- **接口**：
  ```typescript
  interface User {
    name: string
    age: number
    email?: string  // 可选属性
    readonly id: number  // 只读属性
  }
  ```
- **类型推断**：`let x = 3` 自动推断为 `number`
- **泛型函数**：
  ```typescript
  function identity<T>(arg: T): T {
    return arg
  }
  ```
- **枚举**：
  ```typescript
  enum Direction { Up, Down, Left, Right }
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `TS-类型系统.md`
- 包含：类型注解、接口、泛型、枚举、类型推断示例

---

### 周二：TypeScript高级类型（面试加分项）

**08:30-09:30 · 算法**
- LeetCode #206 [反转链表](https://leetcode.com/problems/reverse-linked-list/)（递归+迭代）
- 理解链表反转的双指针和递归思路

**20:00-21:30 · TS高级类型（条件类型+映射类型+infer）**
> 学习资源：《TypeScript编程》第4-6章

- **条件类型**：
  ```typescript
  type IsString<T> = T extends string ? true : false
  type A = IsString<'hello'>  // true
  type B = IsString<123>      // false
  ```
- **映射类型**：
  ```typescript
  type Readonly<T> = { readonly [P in keyof T]: T[P] }
  type Partial<T> = { [P in keyof T]?: T[P] }
  ```
- **内置工具类型**：`Partial<T>`、`Required<T>`、`Readonly<T>`、`Pick<T,K>`、`Omit<T,K>`、`Record<K,V>`
- **infer**：
  ```typescript
  type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
  ```
- **手写Pick**：
  ```typescript
  type myPick<T, K extends keyof T> = { [P in K]: T[P] }
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 更新 `TS-类型系统.md`，增加高级类型章节
- 重点：手写内置工具类型

---

### 周三：CSS Flex布局（最常用的布局方式）

**08:30-09:30 · 算法**
- LeetCode #141 [环形链表](https://leetcode.com/problems/linked-list-cycle/)（快慢指针）
- 理解环形链表的检测方法

**20:00-21:30 · CSS Flex布局（5种经典场景）**
> 学习资源：《CSS世界（第2版）》第6章

- **基础属性**：
  - `display: flex` → 开启Flex布局
  - `flex-direction: row/column` → 主轴方向
  - `justify-content` → 主轴对齐（flex-start/center/flex-end/space-between）
  - `align-items` → 交叉轴对齐（stretch/flex-start/center/flex-end）
  - `flex-wrap: wrap` → 换行

- **场景1：水平垂直居中（5种方案）**
  ```css
  /* 方案1：flex */
  .parent { display: flex; justify-content: center; align-items: center; }
  
  /* 方案2：flex + margin:auto */
  .parent { display: flex; }
  .child { margin: auto; }
  
  /* 方案3：grid */
  .parent { display: grid; place-items: center; }
  
  /* 方案4：绝对定位 + transform */
  .parent { position: relative; }
  .child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
  
  /* 方案5：绝对定位 + margin */
  .parent { position: relative; }
  .child { position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto; }
  ```

- **场景2：Sticky Footer（底部固定）**
  ```css
  body { display: flex; flex-direction: column; min-height: 100vh; }
  main { flex: 1; }  /* 内容区自动扩展 */
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `CSS-Flex布局.md`
- 包含5种经典场景代码

---

### 周四：CSS Grid布局（更强大的二维布局）

**08:30-09:30 · 算法**
- LeetCode #94 [二叉树中序遍历](https://leetcode.com/problems/binary-tree-inorder-traversal/)（递归+迭代）
- 理解递归和栈的思路

**20:00-21:30 · CSS Grid布局（两栏+圣杯+响应式）**
> 学习资源：《CSS世界（第2版）》第7章

- **基础属性**：
  - `display: grid` → 开启Grid布局
  - `grid-template-columns: 1fr 2fr` → 列宽比例
  - `gap: 20px` → 间距
  - `grid-area` → 命名网格区域

- **场景1：两栏布局（Sidebar + Main）**
  ```css
  .container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 20px;
  }
  ```

- **场景2：圣杯布局（Header + Sidebar + Main + Footer）**
  ```css
  .container {
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 200px 1fr 150px;
    min-height: 100vh;
  }
  header { grid-column: 1 / -1; }
  aside:first-of-type { grid-column: 1; }
  main { grid-column: 2; }
  aside:last-of-type { grid-column: 3; }
  footer { grid-column: 1 / -1; }
  ```

- **场景3：响应式Grid**
  ```css
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  ```

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `CSS-Grid布局.md`
- 包含两栏、圣杯、响应式代码

---

### 周五：BFC（块级格式化上下文）+ CSS新特性

**08:30-09:30 · 算法**
- LeetCode #104 [二叉树最大深度](https://leetcode.com/problems/maximum-depth-of-binary-tree/)（递归）
- 理解递归树的最大深度

**20:00-21:30 · BFC + CSS新特性**
> 学习资源：《深入解析CSS》第4章

- **BFC触发条件**：
  - `overflow: hidden/auto`（非visible）
  - `display: flex/grid/inline-block`
  - `position: absolute/fixed`
  - `float: left/right`

- **BFC作用**：
  1. 清除浮动（`overflow: hidden`）
  2. 防止margin重叠（不同BFC不重叠）
  3. 自适应两栏布局（触发BFC的那一栏不会被浮动影响）

- **CSS新特性**：
  - `:has()` 伪类（父选择器）：`div:has(.child)` → 选择包含.child的div
  - `@container` 容器查询
  - `color-mix()` 颜色混合
  - `clamp()` 响应式字号：`font-size: clamp(1rem, 2vw, 2rem)`

**21:30-22:00 · 整理笔记（Obsidian）**
- 创建 `CSS-BFC与新特性.md`
- BFC三作用 + CSS新特性示例

---

### 周六：复盘日

**09:00-11:00 · 复盘本周算法题**
- 重做本周所有算法题（#70、#206、#141、#94、#104）
- 确保每道题都能白板写出

**14:00-17:00 · TS+CSS综合练习**
- 用TypeScript写一个工具函数（泛型+条件类型）
- 用Flex/Grid实现一个响应式卡片布局
- 模拟面试：TS类型系统 + CSS布局
- 录音自己回答，对照改进

**19:00-21:00 · 整理Obsidian笔记**
- 检查以下笔记是否完成：
  - [ ] TS-类型系统.md
  - [ ] CSS-Flex布局.md
  - [ ] CSS-Grid布局.md
  - [ ] CSS-BFC与新特性.md

---

### 周日：休息日

- 完全放松
- 浏览掘金(https://juejin.cn/)看前端CSS相关文章
- **晚上早点睡觉**

---

## 📊 Week 2 总结

| 指标 | 目标 | 实际 | 状态 |
|------|------|------|------|
| 算法题 | 5道 | __ | __ |
| TypeScript | 能手写内置工具类型 | __ | __ |
| Flex布局 | 5种居中方案 | __ | __ |
| Grid布局 | 两栏+圣杯+响应式 | __ | __ |
| BFC | 清除浮动+防重叠+自适应 | __ | __ |

---

## ⚠️ 常见问题

**Q：Flex和Grid什么时候用？**
A：一维布局（导航、按钮组）用Flex；二维布局（卡片网格、仪表盘）用Grid

**Q：TypeScript的`unknown`和`any`有什么区别？**
A：`any`跳过类型检查，`unknown`必须进行类型检查才能操作（更安全）

**Q：BFC为什么能清除浮动？**
A：BFC是一个独立的渲染区域，里面的浮动元素会参与BFC的高度计算
