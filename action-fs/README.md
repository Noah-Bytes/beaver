# action-fs

## 项目简介

**action-fs** 是 Beaver 项目中的文件系统相关功能模块，提供文件操作、目录管理等功能，支持多种文件系统和操作。

## 主要功能

- 支持多种文件系统
- 支持文件操作
- 支持目录管理
- 支持文件状态监控

## 使用示例

```typescript
import { FsAction } from '@beaver/action-fs';

const fsAction = new FsAction({
  path: './files',
});

// 创建目录
await fsAction.mkdir();

// 读取文件
const content = await fsAction.readFile('example.txt');

// 写入文件
await fsAction.writeFile('example.txt', 'Hello, World!');
```

## Building

Run `nx build action-fs` to build the library.

## Running unit tests

Run `nx test action-fs` to execute the unit tests via [Jest](https://jestjs.io).
