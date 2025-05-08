# arteffix-web

## 项目简介

**arteffix-web** 是 Beaver 项目中的 Web 前端模块，提供基于 Next.js 的现代化 Web 界面，用于管理和监控整个系统，支持插件管理、流程监控等功能。

## 主要功能

- 提供现代化 Web 界面
- 支持插件管理
- 支持流程监控
- 支持系统配置

## 使用示例

```typescript
// 启动开发服务器
npm run dev

// 构建生产版本
npm run build

// 运行测试
npm run test
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
- Tailwind CSS

## 目录结构

- `src/` - 源代码目录
  - `components/` - React 组件
  - `pages/` - 页面组件
  - `styles/` - 样式文件
  - `utils/` - 工具函数
- `public/` - 静态资源目录
- `.next/` - Next.js 构建输出目录

## 页面说明

- `/` - 首页
- `/plugins` - 插件管理
- `/flows` - 流程监控
- `/settings` - 系统设置
