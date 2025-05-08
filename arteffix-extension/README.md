# arteffix-extension

## 项目简介

**arteffix-extension** 是 Beaver 项目中的浏览器扩展模块，提供浏览器扩展功能，支持与 Web 界面的集成，实现跨平台的功能扩展。

## 主要功能

- 提供浏览器扩展
- 支持与 Web 界面集成
- 支持跨平台功能
- 支持扩展配置

## 使用示例

```typescript
import { Extension } from '@beaver/arteffix-extension';

const extension = new Extension({
  name: 'arteffix-extension',
  version: '1.0.0',
});

// 初始化扩展
await extension.initialize();

// 注册功能
extension.registerFeature('myFeature', {
  execute: async () => {
    // 实现功能逻辑
  },
});

// 监听消息
extension.onMessage('action', async (message) => {
  // 处理消息
});

// 发送消息到 Web 界面
await extension.sendMessage('web', {
  type: 'notification',
  data: { message: 'Hello from extension!' },
});
```

## 开发指南

1. 安装依赖

   ```bash
   npm install
   ```

2. 构建扩展

   ```bash
   npm run build
   ```

3. 运行测试

   ```bash
   npm run test
   ```

4. 打包扩展
   ```bash
   npm run package
   ```

## 技术栈

- TypeScript
- Chrome Extension API
- Jest
- Webpack

## 目录结构

- `src/` - 源代码目录
  - `background/` - 后台脚本
  - `content/` - 内容脚本
  - `popup/` - 弹出窗口
  - `utils/` - 工具函数
- `test/` - 测试文件目录
- `dist/` - 构建输出目录

## Building

Run `nx build arteffix-extension` to build the library.

## Running unit tests

Run `nx test arteffix-extension` to execute the unit tests via [Jest](https://jestjs.io).
