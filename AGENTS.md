# OpenRomeo 开发规则

## 开发工作流

每次代码改动后，必须按照以下顺序执行：

### 1. 单元测试 (Unit Tests)
```bash
npm run test:run
```
- 所有测试必须通过才能继续
- 如果有测试失败，修复代码后再继续

### 2. 构建验证 (Build)
```bash
npm run build
```
- 确保 TypeScript 编译无错误
- 确保 Vite 构建成功

### 3. 提交代码 (Git Commit)
```bash
git add .
git commit -m "描述本次改动"
```

### 4. 推送到远端 (Push to Remote)
```bash
git push origin main
```

### 5. 部署到 Vercel
```bash
vercel --prod
```

## 测试文件位置

- **单元测试**: `src/test/**/*.test.ts`
- **E2E 测试**: `e2e/**/*.spec.ts`
- **测试覆盖率报告**: `coverage/` (由 Vitest 生成)

## 运行测试命令

```bash
# 单元测试
npm run test:run

# 单元测试 (watch 模式)
npm run test

# E2E 测试
npm run test:e2e

# 带 UI 的 E2E 测试
npm run test:e2e:ui
```

## 测试覆盖率

每次 PR 或重要改动后，检查测试覆盖率：
```bash
npx vitest run --coverage
```

## Lint 检查

```bash
npm run lint  # 如果配置了 lint
```

## 构建产物

构建产物位于 `dist/` 目录，部署到 Vercel 时自动使用。
