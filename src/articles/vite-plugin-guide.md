# Vite 插件开发指南

Vite 的插件系统非常强大，让我来介绍如何开发一个 Vite 插件。

## 插件基础结构

```typescript
export function myPlugin() {
  return {
    name: 'my-plugin',
    transform(code, id) {
      if (id.endsWith('.js')) {
        return {
          code: code.replace(/foo/g, 'bar'),
          map: null
        }
      }
    }
  }
}
```

## 常用钩子

- `resolveId` - 解析模块 ID
- `load` - 加载模块内容
- `transform` - 转换代码
- `buildStart` - 构建开始时调用

Happy coding!
