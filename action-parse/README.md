# action-parse

## 项目简介

**action-parse** 是 Beaver 项目中的解析功能模块，提供数据解析、格式转换等功能，支持多种数据格式和解析方式。

## 主要功能

- 支持多种数据格式解析
- 支持格式转换
- 支持数据验证
- 支持自定义解析规则

## 使用示例

```typescript
import { ParseAction } from '@beaver/action-parse';

const parseAction = new ParseAction({
  format: 'json',
});

// 解析数据
const data = await parseAction.parse('{"name": "example"}');

// 验证数据
const isValid = await parseAction.validate(data, {
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
  },
});

// 转换格式
const yamlData = await parseAction.convert(data, {
  format: 'yaml',
});
```

## Building

Run `nx build action-parse` to build the library.

## Running unit tests

Run `nx test action-parse` to execute the unit tests via [Jest](https://jestjs.io).
