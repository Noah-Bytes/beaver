# action-core

## 项目简介

**action-core** 是 Beaver 项目中的流程自动化与任务编排基础库，支持自定义 action 注册、流程运行、任务中断与重试等功能，适合自动化脚本和 CI/CD 场景。

## 主要功能

- 支持自定义 action 注册
- 流程运行与任务编排
- 任务中断与重试
- 支持多种 shell 命令的编排与执行

## 使用示例

```typescript
import { Core } from '@beaver/action-core';

const core = new Core('appName', {
  /* options */
});

// 注册自定义 action
core.register('action-name', ActionUse);

// 运行流程
await core.run(yaml, 'flow-name');

// 停止流程
await core.stop('flow-name');

// 重试流程
await core.retry('flow-name');

// 跳转流程
await core.jump('flow-name');

// 获取流程
const flow = core.getRun('flow-name');
```

## Building

Run `nx build action-core` to build the library.

## Running unit tests

Run `nx test action-core` to execute the unit tests via [Jest](https://jestjs.io).
