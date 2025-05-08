# action-git

## 项目简介

**action-git** 是 Beaver 项目中的 Git 相关功能模块，提供 Git 操作、版本控制等功能，支持多种 Git 命令和操作。

## 主要功能

- 支持多种 Git 命令
- 支持版本控制
- 支持分支管理
- 支持提交与推送

## 使用示例

```typescript
import { GitAction } from '@beaver/action-git';

const gitAction = new GitAction({
  repoPath: './repo',
});

// 克隆仓库
await gitAction.clone('https://github.com/example/repo.git');

// 提交更改
await gitAction.commit('feat: add new feature');

// 推送更改
await gitAction.push();
```

## Building

Run `nx build action-git` to build the library.

## Running unit tests

Run `nx test action-git` to execute the unit tests via [Jest](https://jestjs.io).
