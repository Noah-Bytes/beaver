# action-exec

## 项目简介

**action-exec** 是 Beaver 项目中的执行相关功能模块，提供命令执行、进程管理等功能，支持多种执行方式和环境。

## 主要功能

- 支持多种执行方式
- 支持进程管理
- 支持执行状态监控
- 支持执行中断与重试

## 使用示例

```typescript
import { ExecAction } from '@beaver/action-exec';

const execAction = new ExecAction({
  command: 'ls -la',
  cwd: './',
});

// 执行命令
await execAction.run();

// 停止执行
await execAction.kill();
```

## Building

Run `nx build action-exec` to build the library.

## Running unit tests

Run `nx test action-exec` to execute the unit tests via [Jest](https://jestjs.io).
