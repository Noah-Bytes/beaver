# action-shell

## 项目简介

**action-shell** 是 Beaver 项目中的 Shell 命令执行模块，提供命令行操作、进程管理等功能，支持多种 Shell 命令和进程控制。

## 主要功能

- 支持多种 Shell 命令执行
- 支持进程管理
- 支持命令输出捕获
- 支持环境变量管理

## 使用示例

```typescript
import { ShellAction } from '@beaver/action-shell';

const shellAction = new ShellAction({
  cwd: './project',
});

// 执行命令
const result = await shellAction.execute('ls -la');

// 捕获输出
const { stdout, stderr } = await shellAction.capture('npm install');

// 设置环境变量
await shellAction.setEnv('NODE_ENV', 'production');

// 执行带环境变量的命令
await shellAction.execute('npm run build', {
  env: {
    NODE_ENV: 'production',
  },
});
```

## Building

Run `nx build action-shell` to build the library.

## Running unit tests

Run `nx test action-shell` to execute the unit tests via [Jest](https://jestjs.io).
