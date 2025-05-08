# arteffix-ai

## 项目简介

**arteffix-ai** 是 Beaver 项目中的 AI 终端模块，提供基于 Next.js 的 Web 终端界面，集成 xterm.js 实现终端模拟，支持实时命令交互、终端适配等功能。

## 主要功能

- 提供 Web 终端界面
- 支持实时命令交互
- 支持终端适配
- 支持终端搜索
- 支持 Web 链接识别

## 使用示例

```typescript
// 在组件中使用终端
import Terminal from '@beaver/arteffix-ai/components/terminal';

function App() {
  return (
    <div className="terminal-container">
      <Terminal />
    </div>
  );
}
```

## 开发指南

1. 安装依赖

   ```bash
   npm install
   ```

2. 启动开发服务器

   ```bash
   npm run dev
   ```

3. 构建生产版本

   ```bash
   npm run build
   ```

4. 运行测试
   ```bash
   npm run test
   ```

## 技术栈

- Next.js
- TypeScript
- React
- xterm.js
- Socket.IO

## 目录结构

- `app/` - 应用源代码目录
  - `components/` - React 组件
    - `terminal/` - 终端组件
      - `index.tsx` - 终端主组件
      - `addon.ts` - 终端插件配置
  - `api/` - API 路由
  - `socket.ts` - Socket 配置
- `public/` - 静态资源目录
- `.next/` - Next.js 构建输出目录

## 终端功能

- 自适应终端大小（FitAddon）
- 终端内容搜索（SearchAddon）
- 终端内容序列化（SerializeAddon）
- Unicode 11 支持（Unicode11Addon）
- Web 链接识别（WebLinksAddon）

## 依赖项

```json
{
  "dependencies": {
    "@xterm/xterm": "^5.x",
    "@xterm/addon-fit": "^0.8.x",
    "@xterm/addon-search": "^0.12.x",
    "@xterm/addon-serialize": "^0.9.x",
    "@xterm/addon-unicode11": "^0.7.x",
    "@xterm/addon-web-links": "^0.9.x"
  }
}
```
