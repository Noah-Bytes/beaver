# shell-conda

This library was generated with [Nx](https://nx.dev).

## 项目简介

**shell-conda** 是 Beaver 项目中的 Conda 环境管理模块，提供 Conda 环境创建、包管理等功能，支持多种 Conda 命令和环境配置。

## 主要功能

- 支持 Conda 环境管理
- 支持包安装与更新
- 支持环境配置
- 支持依赖管理

## 使用示例

```typescript
import { CondaShell } from '@beaver/shell-conda';

const condaShell = new CondaShell({
  envName: 'myenv',
});

// 创建环境
await condaShell.create({
  python: '3.9',
  packages: ['numpy', 'pandas'],
});

// 安装包
await condaShell.install('scipy');

// 更新环境
await condaShell.update();

// 导出环境
await condaShell.export('environment.yml');
```

## Building

Run `nx build shell-conda` to build the library.

## Running unit tests

Run `nx test shell-conda` to execute the unit tests via [Jest](https://jestjs.io).
