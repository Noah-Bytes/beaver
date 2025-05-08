# shell-flow

## 项目简介

**shell-flow** 是 Beaver 项目中的 Shell 流程编排模块，提供 Shell 命令流程编排、任务调度等功能，支持多种流程定义和执行方式。

## 主要功能

- 支持 Shell 命令流程编排
- 支持任务调度
- 支持流程监控
- 支持错误处理

## 使用示例

```typescript
import { ShellFlow } from '@beaver/shell-flow';

const shellFlow = new ShellFlow();

// 定义流程
const flow = shellFlow.define({
  name: 'build-flow',
  steps: [
    {
      name: 'install-deps',
      command: 'npm install',
    },
    {
      name: 'build',
      command: 'npm run build',
      dependsOn: ['install-deps'],
    },
    {
      name: 'test',
      command: 'npm test',
      dependsOn: ['build'],
    },
  ],
});

// 执行流程
await flow.run();

// 监控流程状态
flow.on('step:start', (step) => {
  console.log(`Step ${step.name} started`);
});

flow.on('step:end', (step) => {
  console.log(`Step ${step.name} completed`);
});

// 处理错误
flow.on('error', (error) => {
  console.error('Flow error:', error);
});
```

## Building

Run `nx build shell-flow` to build the library.

## Running unit tests

Run `nx test shell-flow` to execute the unit tests via [Jest](https://jestjs.io).
