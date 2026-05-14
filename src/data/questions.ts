export type QuestionType = 'single' | 'multiple' | 'free'

export interface Question {
  id: string
  week: number
  topic: string
  type: QuestionType
  question: string
  options?: string[]
  correctAnswer?: number[]
  hint?: string
  answer: string
}

export interface QuizProgress {
  currentIndex: number
  answered: Record<string, boolean>
}

export const questions: Question[] = [
  // ═══════════════════════════════════════════════
  // Week 1: JS基础（上）—— 闭包/原型链/继承/EventLoop/Promise
  // ═══════════════════════════════════════════════
  
  // --- 闭包 ---
  {
    id: 'w1-closure-1',
    week: 1,
    topic: '闭包',
    type: 'single',
    question: '下面哪段代码会产生闭包？',
    options: [
      'A. function foo() { var a = 1; return a; }',
      'B. function foo() { var a = 1; return function() { return a; }; }',
      'C. function foo() { var a = 1; console.log(a); }',
      'D. var a = 1; function foo() { console.log(a); }'
    ],
    correctAnswer: [1],
    answer: '答案：B\n\n闭包的定义：函数能够访问其词法作用域之外的变量。\n\nB中内部函数return function() { return a; }引用了外层变量a，即使foo()执行完毕，a依然被内部函数持有，形成闭包。\n\nA：a是局部变量但没有形成闭包（没有函数引用它）\nC：a在函数内部但没有形成闭包（没有内部函数）\nD：这是全局变量，不是闭包'
  },
  {
    id: 'w1-closure-2',
    week: 1,
    topic: '闭包',
    type: 'single',
    question: '以下代码的输出是什么？\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}',
    options: [
      'A. 0, 1, 2',
      'B. 3, 3, 3',
      'C. 2, 2, 2',
      'D. undefined, undefined, undefined'
    ],
    correctAnswer: [1],
    answer: '答案：B\n\n输出：3, 3, 3\n\n原因：var是函数作用域，不是块级作用域。for循环中的setTimeout都是引用同一个变量i。当100ms后setTimeout执行时，for循环早已结束，i已经变成了3。\n\n解决方案：使用let（块级作用域）或者使用闭包保存每个i的值：\n\n// 方案1：使用let\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100); // 0, 1, 2\n}\n\n// 方案2：使用IIFE闭包\nfor (var i = 0; i < 3; i++) {\n  (function(i) {\n    setTimeout(() => console.log(i), 100); // 0, 1, 2\n  })(i)\n}'
  },
  {
    id: 'w1-closure-3',
    week: 1,
    topic: '闭包',
    type: 'free',
    question: '请手写一个防抖函数 debounce，并说明闭包在其中是如何体现的。',
    answer: '防抖函数实现：\n\nfunction debounce(fn, delay) {\n  let timer = null\n  return function(...args) {\n    clearTimeout(timer)\n    timer = setTimeout(() => {\n      fn.apply(this, args)\n    }, delay)\n  }\n}\n\n闭包体现：\n1. timer变量是debounce的局部变量\n2. 返回的函数形成了闭包，引用了外层的timer\n3. 每次调用返回函数时，都能访问和修改同一个timer变量\n4. 定时器结束后，timer依然被闭包引用，不会被GC回收\n\n应用场景：搜索框输入联想（用户停止输入后才发送请求）、窗口调整大小（停止调整后才执行）'
  },

  // --- 原型链 ---
  {
    id: 'w1-prototype-1',
    week: 1,
    topic: '原型链',
    type: 'single',
    question: '以下代码的输出是什么？\n\nfunction Person(name) { this.name = name; }\nPerson.prototype.sayHi = function() { return "Hi, " + this.name; }\nconst p = new Person("Romeo");\nconsole.log(p.sayHi());\nconsole.log(p.constructor === Person);',
    options: [
      'A. "Hi, Romeo" 和 true',
      'B. "Hi, Romeo" 和 false',
      'C. Error 和 true',
      'D. "Hi, Romeo" 和 Error'
    ],
    correctAnswer: [0],
    answer: '答案：A\n\n输出："Hi, Romeo" 和 true\n\n解析：\n1. new Person("Romeo")创建实例p，p.name = "Romeo"\n2. p.sayHi()：先在p自身属性中查找，没有；再在p.__proto__（即Person.prototype）中找到sayHi方法\n3. p.constructor：Person.prototype上默认有constructor属性，指向Person函数本身'
  },
  {
    id: 'w1-prototype-2',
    week: 1,
    topic: '原型链',
    type: 'single',
    question: '关于原型链的描述，正确的是？',
    options: [
      'A. Object.prototype.__proto__ === null',
      'B. Function.prototype.__proto__ === Object.prototype',
      'C. 所有对象都有__proto__属性',
      'D. 构造函数没有prototype属性'
    ],
    correctAnswer: [0, 1],
    answer: '答案：A和B\n\nA正确：Object.prototype是原型链的终点，__proto__为null\nB正确：Function是一个函数，函数的prototype指向一个对象，该对象的__proto__指向Object.prototype\n\nC错误：Object.prototype没有__proto__（为null）\nD错误：所有函数都有prototype属性，指向一个包含constructor和__proto__的对象'
  },
  {
    id: 'w1-prototype-3',
    week: 1,
    topic: '原型链',
    type: 'free',
    question: '请用ES5语法（不用class）实现一个继承体系：Animal（父类）和Dog（子类），Dog需要有自己的bark方法和重写的eat方法。',
    answer: 'ES5原型链继承实现：\n\n// 父类\nfunction Animal(name) {\n  this.name = name\n}\nAnimal.prototype.eat = function() {\n  return this.name + " is eating"\n}\n\n// 子类\nfunction Dog(name, breed) {\n  // 调用父类构造函数（盗用构造函数）\n  Animal.call(this, name)\n  this.breed = breed\n}\n\n// 关键：设置原型链\nDog.prototype = Object.create(Animal.prototype)\nDog.prototype.constructor = Dog\n\n// 子类自己的方法\nDog.prototype.bark = function() {\n  return this.name + " is barking: Woof! Woof!"\n}\n\n// 重写父类方法\nDog.prototype.eat = function() {\n  return this.name + " is eating dog food"\n}\n\n// 测试\nconst d = new Dog("Buddy", "Golden Retriever")\nconsole.log(d.bark())   // "Buddy is barking: Woof! Woof!"\nconsole.log(d.eat())    // "Buddy is eating dog food"\nconsole.log(d instanceof Dog)     // true\nconsole.log(d instanceof Animal)  // true'
  },

  // --- Event Loop ---
  {
    id: 'w1-eventloop-1',
    week: 1,
    topic: 'Event Loop',
    type: 'single',
    question: '以下代码的执行顺序是什么？\n\nconsole.log("1");\nsetTimeout(() => console.log("2"), 0);\nPromise.resolve().then(() => console.log("3"));\nconsole.log("4");',
    options: [
      'A. 1, 2, 3, 4',
      'B. 1, 4, 2, 3',
      'C. 1, 4, 3, 2',
      'D. 1, 3, 4, 2'
    ],
    correctAnswer: [2],
    answer: '答案：C\n\n执行顺序：1, 4, 3, 2\n\n详细解析：\n1. console.log("1") → 同步代码，立即执行\n2. setTimeout(() => console.log("2"), 0) → 宏任务，放入宏队列\n3. Promise.resolve().then(() => console.log("3")) → 微任务，放入微队列\n4. console.log("4") → 同步代码，立即执行\n\n事件循环执行顺序：\n同步代码 → 微队列 → 宏队列\n所以：先执行1和4，再执行微队列中的3，最后执行宏队列中的2'
  },
  {
    id: 'w1-eventloop-2',
    week: 1,
    topic: 'Event Loop',
    type: 'single',
    question: '以下代码的执行顺序是什么？\n\nasync function async1() {\n  console.log("2");\n  await async2();\n  console.log("5");\n}\nasync function async2() {\n  console.log("3");\n}\nconsole.log("1");\nasync1();\nconsole.log("4");',
    options: [
      'A. 1, 2, 3, 4, 5',
      'B. 1, 2, 3, 5, 4',
      'C. 1, 3, 2, 4, 5',
      'D. 1, 2, 4, 3, 5'
    ],
    correctAnswer: [0],
    answer: '答案：A\n\n执行顺序：1, 2, 3, 4, 5\n\n解析：\n1. console.log("1") → 同步，立即执行\n2. async1()调用：\n   - console.log("2") → 同步，立即执行\n   - await async2() → 调用async2\n3. async2()中：console.log("3") → 同步，立即执行，async2返回undefined，await后面的代码进入微队列\n4. console.log("4") → 同步，立即执行\n5. 主线程空闲，执行微队列：console.log("5")\n\nasync/await本质：await后面的代码等价于Promise.then()，是微任务'
  },
  {
    id: 'w1-eventloop-3',
    week: 1,
    topic: 'Event Loop',
    type: 'free',
    question: '请解释JavaScript事件循环（Event Loop）的工作机制，并说明宏任务和微任务的区别。',
    answer: 'Event Loop工作原理：\n\nJavaScript是单线程语言，通过事件循环机制处理异步操作。\n\n核心执行顺序：\n1. 执行同步代码（调用栈）\n2. 执行所有微任务（微队列，如Promise.then, async await, MutationObserver）\n3. 执行一个宏任务（宏队列，如setTimeout, setInterval, I/O, UI渲染）\n4. 重复步骤2-3\n\n宏任务 vs 微任务：\n| 类型 | 来源 | 示例 |\n|------|------|------|\n| 宏任务 | 浏览器API | setTimeout, setInterval, I/O, UI渲染, requestAnimationFrame |\n| 微任务 | 语言本身 | Promise.then/catch/finally, async/await, MutationObserver, queueMicrotask |\n\n为什么区分？\n- 微任务优先级更高，确保异步操作尽快执行\n- 每个宏任务执行完后，都要清空所有微任务\n- 微任务可以添加新的微任务，形成微任务队列链'
  },

  // --- Promise ---
  {
    id: 'w1-promise-1',
    week: 1,
    topic: 'Promise',
    type: 'single',
    question: '以下代码的输出是什么？\n\nPromise.resolve(1)\n  .then(x => x + 1)\n  .then(x => { throw new Error("Failed"); })\n  .catch(e => 3)\n  .then(x => console.log(x));',
    options: [
      'A. 1',
      'B. 2',
      'C. 3',
      'D. Error'
    ],
    correctAnswer: [2],
    answer: '答案：C\n\n输出：3\n\n解析：\n1. Promise.resolve(1) → resolve(1)\n2. .then(x => x + 1) → 返回 2\n3. .then(x => { throw new Error("Failed") }) → 抛出错误，进入catch\n4. .catch(e => 3) → 捕获错误，返回 3（注意：catch返回的值会继续传递）\n5. .then(x => console.log(x)) → 打印 3\n\n关键点：catch返回的值会传递给下一个then，所以输出3而不是Error'
  },
  {
    id: 'w1-promise-2',
    week: 1,
    topic: 'Promise',
    type: 'free',
    question: '请手写一个Promise.all函数，要求处理并发请求，当所有Promise成功时返回结果数组，任一失败时立即reject。',
    answer: 'Promise.all实现：\n\nPromise.all = function(promises) {\n  return new Promise((resolve, reject) => {\n    if (!Array.isArray(promises)) {\n      return reject(new TypeError("Arguments must be an array"))\n    }\n    \n    const results = new Array(promises.length)\n    let resolvedCount = 0\n    \n    promises.forEach((promise, index) => {\n      Promise.resolve(promise).then(\n        (value) => {\n          results[index] = value\n          resolvedCount++\n          if (resolvedCount === promises.length) {\n            resolve(results)\n          }\n        },\n        (reason) => {\n          reject(reason)  // 任一失败，立即reject\n        }\n      )\n    })\n    \n    // 处理空数组情况\n    if (promises.length === 0) {\n      resolve(results)\n    }\n  })\n}\n\n// 测试\nPromise.all([\n  Promise.resolve(1),\n  Promise.resolve(2),\n  Promise.resolve(3)\n]).then(console.log) // [1, 2, 3]\n\nPromise.all([\n  Promise.resolve(1),\n  Promise.reject("error")\n]).catch(console.log) // "error"'
  },

  // ═══════════════════════════════════════════════
  // Week 2: TS基础 + CSS布局
  // ═══════════════════════════════════════════════
  
  // --- TypeScript ---
  {
    id: 'w2-ts-1',
    week: 2,
    topic: 'TypeScript类型',
    type: 'single',
    question: '以下TypeScript类型定义，哪个正确表示一个可选的只读用户对象？',
    options: [
      'A. type User = { name: string, age?: number, readonly id: number }',
      'B. type User = { name: string, age?: number, id: number }',
      'C. type User = { name: string, age: number?, readonly id: number }',
      'D. type User = { readonly name?: string, age: number, readonly id: number }'
    ],
    correctAnswer: [0],
    answer: '答案：A\n\nTS类型语法：\n- ?：可选属性（可以不存在）\n- readonly：只读属性（不能修改）\n\nA正确：age?表示可选，readonly id表示只读\nB错误：id没有readonly，但题目要求只读\nC错误：可选属性用?，不是?\nD错误：name是可选但也是只读，题目没有要求name只读'
  },
  {
    id: 'w2-ts-2',
    week: 2,
    topic: 'TypeScript泛型',
    type: 'single',
    question: '以下TypeScript泛型代码，哪个能正确返回数组的第一个元素？',
    options: [
      'A. function first<T>(arr: T[]): T { return arr[0]; }',
      'B. function first<T>(arr: T): T { return arr[0]; }',
      'C. function first<T extends any[]>(arr: T): T[0] { return arr[0]; }',
      'D. function first<T>(arr: Array<T>): T { return arr.pop(); }'
    ],
    correctAnswer: [0],
    answer: '答案：A\n\nA正确：arr: T[]表示T类型的数组，返回T即第一个元素的类型\nB错误：arr: T表示单个T类型，没有数组下标操作\nC语法上可以，但过于复杂\nD错误：pop()返回的是最后一个元素，且会修改原数组'
  },
  {
    id: 'w2-ts-3',
    week: 2,
    topic: 'TypeScript泛型',
    type: 'free',
    question: '请解释TypeScript中的泛型（Generics），并用代码展示：如何写一个通用的响应类型 Result<T>，以及如何在API接口中使用它。',
    answer: '泛型：让类型像参数一样被传入，实现代码复用和类型安全。\n\nResult<T>通用响应类型：\n\ntype Result<T> = \n  | { success: true; data: T }\n  | { success: false; error: string }\n\n// API接口示例\ninterface User {\n  id: number\n  name: string\n}\n\nasync function fetchUser(id: number): Promise<Result<User>> {\n  try {\n    const res = await fetch(`/api/users/${id}`)\n    const data = await res.json()\n    return { success: true, data }\n  } catch (e) {\n    return { success: false, error: e.message }\n  }\n}\n\n// 使用\nconst result = await fetchUser(1)\nif (result.success) {\n  console.log(result.data.name) // 类型安全！\n} else {\n  console.error(result.error)\n}\n\n泛型的优势：\n1. 类型推导：success为true时，data自动推导为User类型\n2. 代码复用：一个Result<T>可以用于所有API\n3. 类型安全：避免了any的盲目性'
  },

  // --- CSS布局 ---
  {
    id: 'w2-css-1',
    week: 2,
    topic: 'Flex布局',
    type: 'single',
    question: '以下Flex布局代码，哪个能让三个子元素水平垂直居中？\n\n.container {\n  display: flex;\n  /* 以下哪项？*/\n}',
    options: [
      'A. justify-content: center; align-items: center;',
      'B. justify-content: space-between; align-items: center;',
      'C. flex-direction: column; justify-content: center;',
      'D. justify-content: center; flex-direction: column;'
    ],
    correctAnswer: [0],
    answer: '答案：A\n\njustify-content控制主轴（默认水平）方向对齐\nalign-items控制交叉轴（默认垂直）方向对齐\n\nA正确：justify-content: center（水平居中）+ align-items: center（垂直居中）\nB错误：space-between会让元素分散排列，不居中\nC错误：flex-direction: column改变了主轴为垂直方向，此时justify-content控制垂直，但还需要align-items控制水平\nD错误：flex-direction: column改变了主轴，两个属性作用轴互换，不能实现水平垂直同时居中'
  },
  {
    id: 'w2-css-2',
    week: 2,
    topic: 'Grid布局',
    type: 'single',
    question: '以下CSS Grid代码，哪个可以创建一个3列等宽、间隙为20px的网格布局？',
    options: [
      'A. display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;',
      'B. display: grid; grid-template-columns: 33% 33% 33%; gap: 20px;',
      'C. display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 20px;',
      'D. display: flex; flex-wrap: wrap; gap: 20px;'
    ],
    correctAnswer: [0],
    answer: '答案：A\n\nA正确：grid-template-columns: repeat(3, 1fr)创建3列等宽（各占1份），gap: 20px设置间隙\nB错误：33% 33% 33%虽然近似等宽，但有3个列会有4条边线，不精确；且没有考虑gap导致的额外宽度\nC错误：grid-gap是旧语法（已废弃），现代浏览器使用gap\nD错误：这是Flex布局，不是Grid布局'
  },
  {
    id: 'w2-css-3',
    week: 2,
    topic: 'BFC',
    type: 'free',
    question: '请解释什么是BFC（Block Formatting Context），并说明如何创建BFC，以及BFC能解决哪些CSS布局问题？',
    answer: 'BFC（块格式化上下文）：独立的渲染区域，容器内部和外部布局互不影响。\n\n如何创建BFC（满足任一条件）：\n1. 根元素（html）\n2. overflow !== visible（常用overflow: hidden/auto）\n3. display: inline-block / flex / grid / table\n4. position: absolute / fixed\n5. float !== none\n\nBFC能解决的问题：\n\n1. 清除浮动（父元素坍塌）：\n   .parent { overflow: hidden; } // 创建BFC，包含浮动子元素\n\n2. 防止 margin 合并：\n   .parent { overflow: hidden; } // 阻止父子/兄弟margin合并\n\n3. 两栏自适应布局：\n   .left { float: left; width: 200px; }\n   .right { overflow: hidden; } // 自适应剩余宽度\n\n原理：BFC内部的布局不会影响外部，外部的布局也不会影响内部'
  },

  // ═══════════════════════════════════════════════
  // Week 3: 算法（树/栈队列）+ React原理
  // ═══════════════════════════════════════════════
  
  // --- 算法：树 ---
  {
    id: 'w3-tree-1',
    week: 3,
    topic: '二叉树遍历',
    type: 'single',
    question: '以下哪个是二叉树中序遍历（左→根→右）的正确递归实现？',
    options: [
      'A. function inorder(root) { if(root) { console.log(root.val); inorder(root.left); inorder(root.right); } }',
      'B. function inorder(root) { if(root) { inorder(root.left); console.log(root.val); inorder(root.right); } }',
      'C. function inorder(root) { if(root) { inorder(root.left); inorder(root.right); console.log(root.val); } }',
      'D. function inorder(root) { if(!root) return; console.log(root.val); inorder(root.left); inorder(root.right); }'
    ],
    correctAnswer: [1],
    answer: '答案：B\n\n中序遍历顺序：左子树 → 根节点 → 右子树\n\nB代码顺序：inorder(root.left) → console.log(root.val) → inorder(root.right)，符合\n\nA错误：先访问根（先序）\nC错误：先访问右子树，再访问根（不是标准遍历顺序）\nD错误：先访问根节点（先序）'
  },
  {
    id: 'w3-tree-2',
    week: 3,
    topic: '二叉树遍历',
    type: 'free',
    question: '请用迭代（非递归）方式实现二叉树的前序遍历，并说明为什么需要用栈来模拟递归。',
    answer: '前序遍历迭代实现（根→左→右）：\n\nfunction preorderTraversal(root) {\n  const result = []\n  const stack = []\n  \n  if (!root) return result\n  \n  stack.push(root)\n  while (stack.length > 0) {\n    const node = stack.pop()\n    result.push(node.val)  // 访问根\n    \n    // 先压右子树，再压左子树（出栈时左子树先出）\n    if (node.right) stack.push(node.right)\n    if (node.left) stack.push(node.left)\n  }\n  \n  return result\n}\n\n为什么用栈模拟递归：\n1. 递归调用栈隐式保存了：当前节点状态、左右子树待访问的上下文\n2. 迭代需要手动用栈保存：需要回溯时访问的节点\n3. 本质：将系统调用栈换成手动管理的栈，避免递归深度限制（栈溢出）'
  },

  // --- React Fiber ---
  {
    id: 'w3-react-1',
    week: 3,
    topic: 'React Fiber',
    type: 'single',
    question: 'React Fiber架构的核心改进是什么？',
    options: [
      'A. 虚拟DOM的引入',
      'B. 可中断的渲染和优先级调度',
      'C. 更好的TypeScript支持',
      'D. 服务端渲染支持'
    ],
    correctAnswer: [1],
    answer: '答案：B\n\nReact Fiber是React 16引入的核心架构重构：\n\nFiber的核心特性：\n1. 可中断渲染（Concurrent Mode基础）：React可以将渲染工作拆分成小单元（Fiber节点），在渲染过程中暂停、恢复、放弃\n2. 优先级调度：React根据任务的紧急程度安排执行顺序（用户交互优先，长任务让路）\n3. 双缓存：workInProgress树和current树，实现平滑更新\n\n与虚拟DOM的关系：Fiber不是替代虚拟DOM，而是对虚拟DOM diff过程的重构'
  },
  {
    id: 'w3-react-2',
    week: 3,
    topic: 'React Diff',
    type: 'single',
    question: 'React的Diff算法在对比树时，核心策略是什么？',
    options: [
      'A. 逐层对比每个节点，相同key的节点认为是同一节点',
      'B. 全量对比新旧两棵树的每个节点',
      'C. 通过DOM节点类型决定是复用还是销毁重建',
      'D. 先比较叶子节点，再逐层向上比较'
    ],
    correctAnswer: [2],
    answer: '答案：C\n\nReact Diff三大策略（逐层对比）：\n\n1. Tree Diff：逐层对比，不同层级节点直接删除重建\n2. Component Diff：同类组件尝试DOM复用（调用componentWillReceiveProps）；不同类则卸载重建\n3. Element Diff：同层元素通过key判断：\n   - key和type相同 → 复用\n   - key或type不同 → 删除重建\n\n关键：React通过DOM类型（div/span等）判断是否可复用，避免了O(n³)的全量对比复杂度'
  },
  {
    id: 'w3-react-3',
    week: 3,
    topic: 'React Hooks',
    type: 'free',
    question: '请解释useState的工作原理，以及React如何通过链表和Fiber节点实现Hooks的State关联。',
    answer: 'useState工作原理：\n\nReact Hooks基于Fiber节点的memoizedState链表：\n\nFiber节点结构（简化）：\n{\n  memoizedState: {  // Hook链表的头\n    baseState: 0,\n    queue: { pending: null },\n    next: {  // 第二个Hook\n      baseState: "",\n      queue: { pending: null }\n    }\n  }\n}\n\nuseState执行过程：\n1. 首次渲染：创建Hook对象，加入Fiber.memoizedState链表\n2. 每次渲染：通过链表顺序匹配（Hooks调用顺序必须稳定！）\n3. setState时：将更新加入queue.pending链表，返回新的workInProgress树\n4. 再次渲染时：处理pending链表，计算最终state\n\n关键约束：Hooks不能出现在条件语句中，因为链表是按顺序匹配的！\n\n为什么不用对象/数组存储：\n- 链表插入/删除效率高（O(1)）\n- 支持任意数量的Hooks（数组长度固定不行）'
  },

  // ═══════════════════════════════════════════════
  // Week 4: 算法（DP/图）+ Vue3工程化
  // ═══════════════════════════════════════════════
  
  // --- 动态规划 ---
  {
    id: 'w4-dp-1',
    week: 4,
    topic: '动态规划',
    type: 'single',
    question: '动态规划的五步法，正确的顺序是？\n①确定递推公式 ②确定遍历顺序 ③初始化dp数组 ④手动推导验证 ⑤确定dp[i]含义',
    options: [
      'A. ⑤①②③④',
      'B. ⑤③①②④',
      'C. ⑤③②①④',
      'D. ⑤②①③④'
    ],
    correctAnswer: [1],
    answer: '答案：B\n\n动态规划五步法（正确顺序）：\n\n1. ⑤确定dp[i]含义：明确状态表示什么\n2. ③初始化dp数组：确定起始状态\n3. ①确定递推公式：从子问题推导dp[i]\n4. ②确定遍历顺序：确保子问题先被计算\n5. ④手动推导验证：用具体例子验证正确性\n\n示例（爬楼梯）：\n- dp[i]含义：第i阶楼梯有dp[i]种方法\n- 初始化：dp[1]=1, dp[2]=2\n- 递推公式：dp[i]=dp[i-1]+dp[i-2]\n- 遍历顺序：从i=3到n\n- 验证：dp[3]=dp[2]+dp[1]=2+1=3 ✓'
  },
  {
    id: 'w4-dp-2',
    week: 4,
    topic: '动态规划',
    type: 'free',
    question: '请用动态规划解决"零钱兑换"问题（LeetCode #322）：给定硬币面额[1, 2, 5]和金额11，求最少硬币数。',
    answer: '零钱兑换DP解法：\n\nfunction coinChange(coins, amount) {\n  // dp[i] = 凑成金额i最少需要多少硬币\n  const dp = new Array(amount + 1).fill(Infinity)\n  dp[0] = 0  // 金额0需要0个硬币\n  \n  for (const coin of coins) {\n    for (let i = coin; i <= amount; i++) {\n      // 完全背包：每个硬币可以重复使用，遍历金额时从小到大\n      dp[i] = Math.min(dp[i], dp[i - coin] + 1)\n    }\n  }\n  \n  return dp[amount] === Infinity ? -1 : dp[amount]\n}\n\n// coins=[1,2,5], amount=11\n// 结果：11 = 5 + 5 + 1，共3枚硬币\n\n空间优化：可以用一维DP（外层遍历硬币，内层遍历金额）\n\n复杂度：时间O(n×amount)，空间O(amount)'
  },

  // --- 图算法 ---
  {
    id: 'w4-graph-1',
    week: 4,
    topic: '图算法',
    type: 'single',
    question: '以下哪个算法最适合查找图中两个节点之间的最短路径（边有权值非负）？',
    options: [
      'A. DFS（深度优先搜索）',
      'B. BFS（广度优先搜索）',
      'C. Dijkstra算法',
      'D. 并查集'
    ],
    correctAnswer: [2],
    answer: '答案：C\n\n各算法适用场景：\n\nA. DFS：找路径、拓扑排序，不适合最短路径\nB. BFS：无边权时求最短路径（每条边权值相同）\nC. Dijkstra：有权图（非负权）求单源最短路径 ✓\nD. 并查集：连通性判断/最小生成树，不适合最短路径\n\nDijkstra核心思想：\n1. 贪心：每次选择当前已知最短距离的节点\n2. 松弛：用这个节点更新其邻居的距离\n3. 直到目标节点被选中（或所有节点处理完）'
  },
  {
    id: 'w4-graph-2',
    week: 4,
    topic: '图算法',
    type: 'free',
    question: '请用BFS实现"腐烂的橘子"问题（LeetCode #994），给定一个grid，找出所有橘子腐烂所需的最少分钟数。',
    answer: '腐烂橘子BFS解法：\n\nfunction orangesRotting(grid) {\n  const m = grid.length, n = grid[0].length\n  const queue = []\n  let fresh = 0\n  \n  // 初始化：所有腐烂橘子入队，统计新鲜橘子\n  for (let i = 0; i < m; i++) {\n    for (let j = 0; j < n; j++) {\n      if (grid[i][j] === 2) queue.push([i, j, 0])  // [行, 列, 时间]\n      else if (grid[i][j] === 1) fresh++\n    }\n  }\n  \n  const dirs = [[0,1],[1,0],[-1,0],[0,-1]]\n  let time = 0\n  \n  while (queue.length) {\n    const [x, y, t] = queue.shift()\n    time = t  // 记录当前时间（最后出队的时间即最大时间）\n    \n    for (const [dx, dy] of dirs) {\n      const nx = x + dx, ny = y + dy\n      if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === 1) {\n        grid[nx][ny] = 2  // 腐烂\n        fresh--\n        queue.push([nx, ny, t + 1])\n      }\n    }\n  }\n  \n  return fresh === 0 ? time : -1\n}\n\n多源BFS：所有腐烂橘子同时作为起点，队列初始化时全部入队'
  },

  // --- Vue3 ---
  {
    id: 'w4-vue-1',
    week: 4,
    topic: 'Vue3响应式',
    type: 'single',
    question: 'Vue3的响应式系统使用哪个原生API实现？',
    options: [
      'A. Object.defineProperty',
      'B. Proxy',
      'C. getter/setter',
      'D. Object.observe'
    ],
    correctAnswer: [1],
    answer: '答案：B\n\nVue3使用Proxy替代了Vue2的Object.defineProperty：\n\nProxy的优势：\n1. 深层响应式：Proxy可以拦截对象任意属性的访问，无需逐层设置\n2. 支持数组：不需要像Vue2那样hack数组下标\n3. 对象新增/删除属性：Proxy可以拦截（Vue2需要用Vue.set）\n4. 性能更好：Proxy在JS引擎层面实现，开销更小\n\nVue2的问题：\n- Object.defineProperty无法监听新增属性\n- 需要defineProperty逐层设置，嵌套对象需要递归\n- 数组需要hack（重写7个数组方法）'
  },
  {
    id: 'w4-vue-2',
    week: 4,
    topic: 'Vue3响应式',
    type: 'free',
    question: '请解释Vue3中ref和reactive的区别，以及为什么要区分它们。',
    answer: 'ref vs reactive区别：\n\nref（基础类型 + 对象）：\n```typescript\nconst count = ref(0)\ncount.value++  // 需要.value访问\n// Vue自动解包：模板中{{ count }}不需要.value\n```\n\nreactive（仅对象，深度响应式）：\n```typescript\nconst state = reactive({ count: 0, user: { name: "Romeo" } })\nstate.count++  // 不需要.value\nstate.user.name = "Chen"  // 深层响应式\n```\n\n为什么要区分：\n\n1. ref需要区分\"值\"和\"引用\"：基础类型没有引用，所以需要包装成对象\n2. 模板自动解包：ref在模板中自动解包（因为ref本身是响应式对象）\n3. reactive使用Proxy：无法处理基础类型（Proxy只接受对象）\n4. ref可以接收reactive返回的响应式对象并自动解包\n\n最佳实践：\n- 基础类型用ref\n- 对象/数组用reactive\n- 组合函数返回值用ref（保持响应式）'
  },

  // ═══════════════════════════════════════════════
  // Week 5: AI工程（上）—— Prompt Engineering + RAG
  // ═══════════════════════════════════════════════
  
  // --- Prompt Engineering ---
  {
    id: 'w5-prompt-1',
    week: 5,
    topic: 'Prompt Engineering',
    type: 'single',
    question: 'Few-shot Prompting相比Zero-shot的优势是什么？',
    options: [
      'A. 不需要示例，速度更快',
      'B. 通过提供示例让模型学习模式，提升特定任务准确率',
      'C. 适用于所有类型的任务',
      'D. 可以处理更长的输入'
    ],
    correctAnswer: [1],
    answer: '答案：B\n\nFew-shot = 提供几个示例（Few），让模型从示例中学习模式\nZero-shot = 不提供示例，直接让模型执行任务\n\nFew-shot优势：\n1. 学习任务模式：通过示例让模型理解\"我想要什么格式/风格\"\n2. 减少幻觉：示例给了格式约束，降低随机发挥的风险\n3. 适合复杂格式/推理任务\n\n示例：\nZero-shot: \"把这句话翻译成中文：Hello\"\nFew-shot: \"天气很好 → The weather is nice. 我喜欢编程 → I love coding. 你好吗 → ?\"\n模型学会了这个\"翻译\"模式'
  },
  {
    id: 'w5-prompt-2',
    week: 5,
    topic: 'Prompt Engineering',
    type: 'free',
    question: '请解释Chain-of-Thought（CoT） prompting的原理，并说明它为什么能提升大模型的推理能力。',
    answer: 'Chain-of-Thought（CoT）原理：\n\n标准Prompt：直接给出答案\nCoT Prompt：让模型\"先思考，再回答\"\n\n示例对比：\n标准：\"小明有5个苹果，小红给了他3个，小明现在有多少苹果？\"\n标准答案：8个\n\nCoT：\"小明有5个苹果，小红给了他3个，小明现在有多少苹果？\\n思考：5+3=8\\n答案：8个\"\n\n为什么CoT有效：\n1. 显式推理过程：大模型的\"思维链\"被外化，更容易被验证\n2. 任务分解：复杂问题被拆成多个简单步骤，降低单步难度\n3. 错误定位：推理过程中可以发现哪一步出错\n4. 激活相关知识：让模型在推理过程中调用更多相关知识\n\n进阶：Zero-shot CoT（不需要示例）：\n\"请一步一步思考\" → 模型自动生成推理过程'
  },

  // --- RAG ---
  {
    id: 'w5-rag-1',
    week: 5,
    topic: 'RAG全流程',
    type: 'single',
    question: 'RAG（检索增强生成）的核心流程是？',
    options: [
      'A. 用户输入 → LLM直接生成 → 返回答案',
      'B. 用户输入 → Embedding → 向量检索 → LLM生成 → 返回答案',
      'C. 用户输入 → 关键词匹配 → LLM生成 → 返回答案',
      'D. 用户输入 → LLM回忆 → 返回答案'
    ],
    correctAnswer: [1],
    answer: '答案：B\n\nRAG三步流程：\n\n1. 索引（Indexing）：文档切分 → 每段Embedding → 存入向量数据库（Pinecone/Milvus等）\n\n2. 检索（Retrieval）：\n   用户问题 → 问题Embedding → 向量相似度搜索 → 取Top-K最相关文档\n\n3. 生成（Generation）：\n   把检索到的文档 + 用户问题 → 一起发给LLM → 生成答案\n\nRAG解决的问题：\n- LLM知识过时（可以补充最新知识）\n- LLM幻觉（答案有据可查）\n- LLM无法访问私有数据（本地知识库）'
  },
  {
    id: 'w5-rag-2',
    week: 5,
    topic: 'RAG优化',
    type: 'single',
    question: '在RAG系统中，Hybrid Search相比纯向量检索的优势是？',
    options: [
      'A. 速度更快',
      'B. 既能做语义相似度匹配，又能做关键词精确匹配',
      'C. 成本更低',
      'D. 不需要向量数据库'
    ],
    correctAnswer: [1],
    answer: '答案：B\n\nHybrid Search（混合检索）= 向量检索 + 关键词检索（BM25）\n\n向量检索：找\"语义相似\"的内容（理解意图）\n关键词检索：找\"包含关键词\"的内容（精确匹配）\n\n示例：用户问\"React性能优化\"\n- 向量检索可能找到：\"React渲染优化技巧\"\n- 关键词检索（BM25）可能找到：\"React + 性能\"的精确匹配\n- Hybrid：两者结合，不漏语义也不漏关键词\n\n为什么需要：\n- 向量检索对专有名词/缩写不敏感（\"LCP\"是什么？）\n- 关键词检索对语义理解差（\"怎么让网页更快\"→\"LCP优化\"）\n- 两者互补，提升检索准确率'
  },
  {
    id: 'w5-rag-3',
    week: 5,
    topic: 'RAG全流程',
    type: 'free',
    question: '请用LangChain.js + Vercel AI SDK实现一个简单的RAG问答系统，代码需要包含：文档索引、向量检索、流式输出。',
    answer: `RAG问答系统核心代码：

// 1. 安装依赖
// npm install ai @ai-sdk/openai langchain @langchain/pinecone @langchain/openai

import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { PineconeStore } from '@langchain/pinecone'
import { OpenAIEmbeddings } from '@langchain/openai'
import { pinecone } from '@/lib/pinecone'

// 核心API路由
async function POST(req) {
  const { messages } = await req.json()
  const userQuestion = messages.at(-1).content
  
  // Step1: Embedding + 检索
  const embeddings = new OpenAIEmbeddings({ 
    model: 'text-embedding-3-small' 
  })
  const index = pinecone.Index('knowledge-base')
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { 
    pineconeIndex: index 
  })
  const docs = await vectorStore.similaritySearch(userQuestion, 3)
  
  // Step2: 构建Prompt（加入检索到的文档）
  const context = docs.map(d => d.pageContent).join('\n\n')
  const prompt = \`根据以下知识库内容回答用户问题。

知识库：
\${context}

问题：\${userQuestion}

回答要求：只基于知识库内容，不要编造。\`
  
  // Step3: 流式生成
  const result = await streamText({
    model: openai('gpt-4o'),
    prompt,
  })
  
  return result.toDataStreamResponse()
}

关键点：
- text-embedding-3-small：中文支持好，便宜
- Top-K=3：控制输入Token数量
- 流式输出：用toDataStreamResponse()实时返回`,  },

  // ═══════════════════════════════════════════════
  // Week 6: AI工程（下）—— Agent + 浏览器与网络
  // ═══════════════════════════════════════════════
  
  // --- Function Calling + Agent ---
  {
    id: 'w6-fc-1',
    week: 6,
    topic: 'Function Calling',
    type: 'single',
    question: 'Function Calling的核心作用是什么？',
    options: [
      'A. 让大模型直接访问文件系统',
      'B. 让大模型在推理过程中调用外部工具（搜索/API/计算等）',
      'C. 让大模型能够生成代码',
      'D. 让大模型能够访问互联网'
    ],
    correctAnswer: [1],
    answer: '答案：B\n\nFunction Calling（工具调用）：\n\n本质：让大模型\"看到\"它可以调用的工具列表，由模型决定调用哪个工具。\n\n工作流程：\n1. 开发者定义工具（名称、描述、参数schema）\n2. 用户提问 → LLM判断是否需要工具\n3. LLM输出JSON {tool_name, args}（不执行，只输出）\n4. 程序执行工具，返回结果\n5. LLM基于结果生成最终答案\n\n示例：\n用户：\"北京天气如何？\"\nLLM输出：{tool: "weather", args: {city: "北京"}}\n程序执行weather("北京") → 返回{weather: "晴", temp: "25°C"}\nLLM基于结果：\"北京今天天气晴朗，气温25°C...\"'
  },
  {
    id: 'w6-fc-2',
    week: 6,
    topic: 'ReAct Agent',
    type: 'single',
    question: 'ReAct（Reasoning + Acting）Agent的核心循环是什么？',
    options: [
      'A. Thought → Action → Result → 结束',
      'B. Thought → Action → Observation → Thought → ... → Final Answer',
      'C. Action → Observation → Thought → Final Answer',
      'D. Thought → Observation → Action → Final Answer'
    ],
    correctAnswer: [1],
    answer: '答案：B\n\nReAct循环：\n\nThought（思考）：分析当前状态，决定下一步\nAction（行动）：执行工具（如search、calculate）\nObservation（观察）：获取行动结果\n→ 回到Thought，形成循环\n\n直到Thought认为任务完成 → Final Answer\n\n示例（查天气+计算）：\n用户：北京天气+转华氏度\n\nT: 需要先查北京天气\nA: weather(city="北京")\nO: 25°C\nT: 现在转换成华氏度\nA: calculate("25*9/5+32")\nO: 77°F\nT: 有了答案，可以回答了\nFinal: 北京今天25°C，即77°F'
  },
  {
    id: 'w6-fc-3',
    week: 6,
    topic: 'MCP协议',
    type: 'free',
    question: '请解释MCP（Model Context Protocol）与Function Calling的区别，以及MCP的优势。',
    answer: 'MCP vs Function Calling：\n\nFunction Calling：\n- 各AI厂商私有协议（OpenAI/Anthropic各不同）\n- 每次对接都需要单独实现\n- 适合：API调用类工具（搜索、天气等远程服务）\n\nMCP（Model Context Protocol）：\n- Anthropic提出的开放标准（类似USB-C）\n- 一次开发，任何支持MCP的AI都能用\n- 适合：本地工具（文件系统、Git、数据库等）\n\nMCP架构：\n┌─────────┐    ┌────────────┐    ┌─────────┐\n│ AI Model│ ←→ │ MCP Host   │ ←→ │ MCP     │\n│         │    │ (Claude)   │    │ Servers │\n└─────────┘    └────────────┘    └─────────┘\n                            ↓\n                      本地文件系统\n                      GitHub/Git\n                      Slack/数据库\n\nMCP Server示例（文件系统）：\n{\n  name: "filesystem\",\n  tools: [\n    { name: "read_file", params: ["path"] },\n    { name: "write_file", params: ["path", "content"] }\n  ]\n}\n\nMCP优势：标准化、可复用、本地工具集成能力强'
  },

  // --- 浏览器 ---
  {
    id: 'w6-browser-1',
    week: 6,
    topic: '浏览器渲染',
    type: 'single',
    question: '以下哪项CSS加载会阻塞页面渲染？',
    options: [
      'A. <link rel="stylesheet" href="style.css">',
      'B. <script src="app.js" defer></script>',
      'C. <script src="app.js" async></script>',
      'D. <script src="app.js"></script>（同步）'
    ],
    correctAnswer: [0, 3],
    answer: '答案：A和D\n\n渲染阻塞资源：\n\nA. <link rel="stylesheet">：CSS是渲染阻塞资源，浏览器必须等到CSSOM构建完成才能进入渲染树\nD. <script>同步：会阻塞HTML解析，浏览器停止解析HTML等JS执行完\n\n不阻塞渲染的资源：\nB. defer：HTML解析完再执行，不阻塞渲染\nC. async：下载完立即执行，不保证顺序，不阻塞HTML解析\n\n优化建议：\n- CSS放<head>，尽快加载\n- JS放<body>末尾，或使用defer/async\n- 非关键CSS用<link rel="preload" as="style">异步加载'
  },
  {
    id: 'w6-browser-2',
    week: 6,
    topic: '浏览器渲染',
    type: 'free',
    question: '请描述浏览器关键渲染路径（Critical Rendering Path）的完整流程，以及如何优化CRP以提升页面性能。',
    answer: '关键渲染路径六步：\n\n1. HTML解析：字节 → 字符 → Token → Node → DOM Tree\n2. CSS解析：CSS → CSSOM Tree\n3. Render Tree：DOM + CSSOM → Render Tree（只包含可见节点）\n4. Layout（Reflow）：计算每个节点的位置和大小\n5. Paint：把节点绘制到图层（像素填充）\n6. Composite：合并图层，上传到GPU\n\nCRP优化策略：\n\n1. 减少关键资源：\n   - 关键CSS内联（<style>），非关键CSS异步加载\n   - JS用defer/async，CSS放head\n\n2. 减少关键路径长度：\n   - 避免层层嵌套的CSS选择器（#id最快，div ul li a最慢）\n   - 减少DOM深度\n\n3. 减少回流量（Reflow）：\n   - 使用transform/opacity做动画（不触发Layout/Paint）\n   - 批量DOM操作，用display:none隐藏后修改\n\n4. 预加载关键资源：\n   <link rel="preload" as="image" href="hero.jpg">'
  },

  // ═══════════════════════════════════════════════
  // Week 7: 项目STAR + 系统设计
  // ═══════════════════════════════════════════════
  
  // --- STAR法则 ---
  {
    id: 'w7-star-1',
    week: 7,
    topic: 'STAR法则',
    type: 'single',
    question: '在STAR法则中，"S"（Situation）和"T"（Task）的核心区别是？',
    options: [
      'A. 没有区别，可以互换',
      'B. Situation是背景（当时环境），Task是你面临的具体任务/挑战',
      'C. Situation是你做的工作，Task是结果',
      'D. Situation是你犯的错误，Task是改正措施'
    ],
    correctAnswer: [1],
    answer: '答案：B\n\nSTAR法则：\n- S（Situation）：背景/场景 —— 当时的环境是什么？（项目背景、团队规模、时间紧迫等）\n- T（Task）：任务/挑战 —— 你在那个背景下具体要完成什么？（面临的困难、要解决的问题）\n- A（Action）：行动 —— 你具体做了什么？（技术方案、实施步骤）\n- R（Result）：结果 —— 最终带来了什么？（量化数据、影响）\n\n区别：\nS是\"大背景\"（项目/团队层面），T是\"你的任务\"（个人层面）\n\n示例：\nS：\"当时公司有5个独立前端应用，维护成本高\"（项目背景）\nT：\"我负责将5个应用整合到微前端架构\"（个人任务）'
  },
  {
    id: 'w7-star-2',
    week: 7,
    topic: 'STAR法则',
    type: 'free',
    question: '请用STAR法则描述你做过的一个前端性能优化项目，确保有量化的R（Result）。',
    answer: 'STAR法则示例 —— 性能优化项目：\n\nS（Situation）：\n\"产品首页LCP为4.2s，超过Google要求的2.5s，导致SEO排名下降，用户流失率增加。\"\n\nT（Task）：\n\"我负责分析性能瓶颈并优化，目标是将LCP降低到2.5s以内。\"\n\nA（Action）：\n\"1. 用Lighthouse + Performance工具定位：Hero图片未优化是主要问题\n2. 图片优化：WebP格式、CDN加速、<link rel=preload>\n3. 代码分割：React.lazy + Suspense，首屏JS减少60%\n4. SSR：用Next.js做服务端渲染，首屏更快呈现\n5. 缓存：Cache-Control + Service Worker离线缓存\"\n\nR（Result）：\n\"最终LCP从4.2s降低到1.8s，INP从280ms降到80ms，Lighthouse评分60→92，SEO流量增加30%，用户体验评分提升25%。\"\n\n⚠️ 注意：\n- R必须有数据！\"有改善\"不够\n- 数据要真实可查\n- 可以说\"我主导\"或\"我贡献了\"，不要夸大'
  },

  // --- 系统设计 ---
  {
    id: 'w7-sys-1',
    week: 7,
    topic: '系统设计',
    type: 'single',
    question: '系统设计四步法的正确顺序是？\n①详细设计 ②权衡取舍 ③需求分析 ④高层设计',
    options: [
      'A. ①②③④',
      'B. ③①②④',
      'C. ③①④②',
      'D. ③①④②'
    ],
    correctAnswer: [3],
    answer: '答案：D（③①④②）\n\n系统设计四步法：\n\n1. ③需求分析：明确系统要做什么，定义边界，收集功能需求\n2. ①高层设计：画出核心组件和它们之间的关系（如前端SDK → 数据上报 → 存储 → 查询）\n3. ④详细设计：每个组件的具体实现（用什么数据库、缓存策略、API设计）\n4. ②权衡取舍：在性能/成本/复杂度之间做trade-off决策\n\n面试评分标准：\n- 20%：理解需求，定义边界\n- 30%：高层架构合理\n- 30%：详细设计具体\n- 20%：权衡取舍'
  },
  {
    id: 'w7-sys-2',
    week: 7,
    topic: '系统设计',
    type: 'free',
    question: '请设计一个前端性能监控系统（前端错误监控 + Core Web Vitals），包括数据采集、上报策略、存储选型。',
    answer: '前端监控系统设计：\n\n▎需求分析\n要监控：JS错误、资源加载错误、API错误、Core Web Vitals（LCP/INP/CLS）、用户行为\n\n▎高层设计\n用户浏览器\n    ↓（Beacon API）\n数据上报层 → Kafka（消息队列）\n    ↓\n实时处理（Flink）→ 存储层\n    ↓                    ↓\n实时大屏（Druid）    原始数据（HBase）\n    ↓\n离线分析（Spark）→ 查询（ClickHouse）\n\n▎详细设计\n\nSDK采集：\n- 重写window.onerror + unhandledrejection\n- PerformanceObserver监听LCP/INP/CLS\n- 资源加载错误：performance.getEntriesByType("resource")\n\n上报策略：\n- Beacon API（页面离开时，navigator.sendBeacon）\n- requestIdleCallback（空闲时上报，不影响性能）\n- 采样率：错误100%采集，性能10%采样\n\n存储选型：\n- 错误原始数据：HBase（高写入，灵活schema）\n- 性能聚合数据：ClickHouse（OLAP，秒级查询）\n- 实时大屏：Druid（实时聚合）\n\n权衡：\n- SDK体积：控制在5KB内（gzip），避免影响页面性能\n- 数据量：性能数据采样10%，避免数据爆炸\n- 成本：采集端轻量化，存储计算在服务端'
  },

  // ═══════════════════════════════════════════════
  // Week 8: 模拟面试 + 简历 + 投递
  // ═══════════════════════════════════════════════
  
  // --- 简历 ---
  {
    id: 'w8-resume-1',
    week: 8,
    topic: '简历优化',
    type: 'single',
    question: '以下哪项不是ATS（简历筛选系统）友好的简历特征？',
    options: [
      'A. 单列布局，左对齐',
      'B. 包含目标岗位的关键词（如React、TypeScript、RAG）',
      'C. 使用表格和多列布局方便阅读',
      'D. 纯文本格式，字体统一（Arial/Georgia）'
    ],
    correctAnswer: [2],
    answer: '答案：C\n\nATS友好简历要求：\n- ✅ 单列布局（左对齐）：方便系统识别文本顺序\n- ✅ 包含关键词：系统根据关键词匹配简历\n- ✅ 纯文本/字体统一：避免解析错误\n- ❌ 表格和多列：ATS无法正确解析，可能导致信息丢失\n\n其他ATS要点：\n- PDF格式（Word可能被解析错乱）\n- 避免图片/图表（ATS无法读取）\n- 文件名规范：姓名-公司-岗位.pdf\n- 关键词尽量靠近描述开头'
  },
  {
    id: 'w8-resume-2',
    week: 8,
    topic: '简历优化',
    type: 'free',
    question: '请为一个3年前端开发者的简历写一个Summary（概述）部分，要求包含：技术栈、AI工程能力、职业方向。',
    answer: '简历Summary示例（ATS友好）：\n\nSUMMARY\n\n3年前端开发经验，擅长React/Vue/TypeScript，主攻AI工程能力（RAG/Agent开发），有字节跳动和抖音电商面试经历。\n\n技术栈：React, Next.js, Vue3, TypeScript, Vite, Webpack\nAI工程：LangChain.js, Vercel AI SDK, OpenAI API, Pinecone, RAG\n工程化：CI/CD, GitHub Actions, Vercel, 微前端（qiankun）\n\n追求技术深度（React Fiber、Vue3 Proxy响应式原理）与工程落地（性能优化、微前端架构）的平衡，对AI在前端领域的应用充满热情。\n\n投递方向：React/AI前端工程师\n\n⚠️ 注意：\n- Summary控制在3-5行\n- 包含关键词（ATS扫描）\n- 量化经验年限\n- 明确投递方向'
  },

  // --- 面试技巧 ---
  {
    id: 'w8-interview-1',
    week: 8,
    topic: '面试技巧',
    type: 'single',
    question: '在算法面试中，当拿到一道算法题时，第一步应该做什么？',
    options: [
      'A. 立刻开始写代码',
      'B. 先问清楚题目约束（数据规模、边界条件、时间空间限制）',
      'C. 告诉面试官这题太简单了',
      'D. 直接说出暴力解法然后写代码'
    ],
    correctAnswer: [1],
    answer: '答案：B\n\n算法面试正确流程：\n\n1. 【澄清】（最重要！）\n   - 问清楚数据范围（n有多大？数组有序吗？）\n   - 问边界条件（空数组？重复元素？）\n   - 问时间和空间复杂度要求\n   - 确认输入输出格式\n\n2. 【暴力解】先给一个简单解法（展示思考能力）\n   - 时间复杂度是多少？能否接受？\n   - 这是最优解吗？\n\n3. 【优化】找最优解\n   - 画图/举例子找规律\n   - 用数据结构优化（哈希表、栈、堆等）\n\n4. 【写代码】\n   - 代码简洁，变量命名清晰\n   - 写完自己检查边界情况\n\n5. 【验证】\n   - 用测试用例验证（正常case + 边界case）\n\n面试官评价的不是\"写出来\"，而是\"思考过程\"！'
  },
  {
    id: 'w8-interview-2',
    week: 8,
    topic: '面试技巧',
    type: 'free',
    question: '在项目讲解面试中，如果面试官问\"这个项目有什么难点？你是怎么解决的？\"，应该如何回答？',
    answer: '项目难点回答模板（STAR法则的变体）：\n\n回答结构：难点描述 → 你的思考 → 解决方案 → 结果\n\n示例回答：\n\n\"这个项目的难点有两个：\n\n难点1：检索准确率不够\n- 当时RAG检索的准确率只有60%，大量相关文档没有被召回\n- 我分析后发现原因是：纯向量检索对专有名词（如React、Vue）效果不好\n- 我加入了Hybrid Search（向量检索+BM25关键词检索）\n- 再加上Cohere Rerank做结果重排序\n- 最终准确率提升到85%\n\n难点2：LLM生成幻觉\n- 模型有时候会\"编造\"知识库里不存在的内容\n- 我在Prompt中加入约束：\"只基于知识库内容，不要编造，如果不知道说不知道\"\n- 同时加入了\"置信度检测\"，低置信度时返回\"未找到相关内容\"\n- 最终 hallucinations 率降低到<5%\"\n\n⚠️ 注意：\n- 难点要说真实的技术难点，不是\"时间紧任务重\"\n- 每个难点要有具体的数据结果\n- 展示的是分析问题和解决问题的能力'
  },
  {
    id: 'w8-interview-3',
    week: 8,
    topic: '自我介绍',
    type: 'free',
    question: '请准备一个2分钟的自我介绍（电梯演讲），要求包含：背景介绍、核心优势、AI项目亮点、投递方向。',
    answer: '2分钟自我介绍模板（电梯演讲）：\n\n\"我叫Romeo，3年前端开发经验。\n\n【背景】\n我最近在字节跳动做React中台系统开发，主导了性能优化项目（LCP 4.2s→1.8s）和AI知识库问答系统（RAG，准确率85%）。\n\n【核心优势】\n我擅长React/Vue/TypeScript，对React Fiber架构、Vue3 Proxy响应式原理有深入研究。同时我对AI工程能力（RAG/Agent开发）有实践经验，做过完整的AI项目（Next.js + Vercel AI SDK + Pinecone）。\n\n【AI项目亮点】\n我最近做的AI知识库问答系统，基于LangChain.js实现了RAG全流程，包括文档切分、Embedding、向量检索、生成。并且用Hybrid Search + Rerank做了优化，准确率达到85%。\n\n【职业方向】\n我目前在看React/AI前端方向的岗位，希望能加入一个有技术挑战的团队，持续深耕前端和AI的结合。\n\n【结束】\n以上就是我的自我介绍，您有什么想深入了解的？\"\n\n⚠️ 注意事项：\n- 控制在2分钟内（400-500字）\n- 有数据结果（4.2s→1.8s，85%）\n- 展示技术深度 + 工程落地能力\n- 主动结束，把话题交给面试官'
  }
]
