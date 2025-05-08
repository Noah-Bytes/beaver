# action-io

## 项目简介

**action-io** 是 Beaver 项目中的输入输出功能模块，提供数据输入输出、流处理等功能，支持多种数据格式和流处理方式。

## 主要功能

- 支持多种数据格式
- 支持流处理
- 支持数据转换
- 支持数据验证

## 使用示例

```typescript
import { IoAction } from '@beaver/action-io';

const ioAction = new IoAction({
  format: 'json',
});

// 读取数据
const data = await ioAction.read('./data.json');

// 转换数据
const transformedData = await ioAction.transform(data, {
  format: 'yaml',
});

// 写入数据
await ioAction.write('./output.yaml', transformedData);
```

## Building

Run `nx build action-io` to build the library.

## Running unit tests

Run `nx test action-io` to execute the unit tests via [Jest](https://jestjs.io).
