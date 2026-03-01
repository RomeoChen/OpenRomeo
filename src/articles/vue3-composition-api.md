# Vue3 Composition API 最佳实践

Vue3 的 Composition API 带来了更灵活的代码组织方式。

## 为什么使用 Composition API

1. **更好的类型推导**
2. **更好的代码复用**
3. **更清晰的逻辑组织**

## 示例代码

```typescript
import { ref, computed, onMounted } from 'vue'

export function useCounter() {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  onMounted(() => {
    console.log('Counter mounted!')
  })
  
  return { count, doubled, increment }
}
```

## 总结

Composition API 让 Vue 组件更加简洁和可维护。
