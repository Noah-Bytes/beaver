# action-flow

## 项目简介

**action-flow** 是 Beaver 项目中的动作流程编排模块，提供动作流程定义、执行、监控等功能，支持多种动作类型和流程控制。

## 主要功能

- 支持动作流程定义
- 支持流程执行控制
- 支持流程状态监控
- 支持错误处理与重试

## 使用示例

```typescript
import { ActionFlow } from '@beaver/action-flow';

const actionFlow = new ActionFlow();

// 定义流程
const flow = actionFlow.define({
  name: 'deploy-flow',
  actions: [
    {
      name: 'build',
      type: 'shell',
      command: 'npm run build',
    },
    {
      name: 'test',
      type: 'shell',
      command: 'npm test',
      dependsOn: ['build'],
    },
    {
      name: 'deploy',
      type: 'shell',
      command: 'npm run deploy',
      dependsOn: ['test'],
      retry: {
        maxAttempts: 3,
        delay: 1000,
      },
    },
  ],
});

// 执行流程
await flow.run();

// 监控流程状态
flow.on('action:start', (action) => {
  console.log(`Action ${action.name} started`);
});

flow.on('action:end', (action) => {
  console.log(`Action ${action.name} completed`);
});

// 处理错误
flow.on('error', (error) => {
  console.error('Flow error:', error);
});

// 暂停流程
await flow.pause();

// 恢复流程
await flow.resume();

// 停止流程
await flow.stop();
```

## Building

Run `nx build action-flow` to build the library.

## Running unit tests

Run `nx test action-flow` to execute the unit tests via [Jest](https://jestjs.io).
