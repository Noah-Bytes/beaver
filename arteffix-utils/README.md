# arteffix-utils

## 项目简介

**arteffix-utils** 是 Beaver 项目中的工具库模块，提供各种通用工具函数和辅助方法，支持字符串处理、日期操作、数据转换等功能。

## 主要功能

- 支持字符串处理
- 支持日期操作
- 支持数据转换
- 支持通用工具函数

## 使用示例

```typescript
import { StringUtils, DateUtils, DataUtils, CommonUtils } from '@beaver/arteffix-utils';

// 字符串处理
const str = StringUtils.format('Hello, {name}!', { name: 'World' });
const slug = StringUtils.toSlug('Hello World!');

// 日期操作
const date = DateUtils.parse('2024-03-20');
const formatted = DateUtils.format(date, 'YYYY-MM-DD');
const diff = DateUtils.diff(date, new Date(), 'days');

// 数据转换
const obj = DataUtils.parseJSON('{"name": "example"}');
const yaml = DataUtils.toYAML({ name: 'example' });

// 通用工具函数
const isEmail = CommonUtils.isEmail('test@example.com');
const debouncedFn = CommonUtils.debounce(() => {
  console.log('debounced');
}, 1000);
```

## Building

Run `nx build arteffix-utils` to build the library.

## Running unit tests

Run `nx test arteffix-utils` to execute the unit tests via [Jest](https://jestjs.io).
