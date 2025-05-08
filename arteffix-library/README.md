# arteffix-library

## 项目简介

**arteffix-library** 是 Beaver 项目中的核心库模块，提供基础组件、类型定义、接口规范等功能，作为其他模块的基础依赖。

## 主要功能

- 提供基础组件
- 提供类型定义
- 提供接口规范
- 提供通用功能

## 使用示例

```typescript
import { BaseComponent, TypeDefinitions, InterfaceSpecs, CommonFeatures } from '@beaver/arteffix-library';

// 使用基础组件
class MyComponent extends BaseComponent {
  constructor() {
    super();
    this.initialize();
  }

  async initialize() {
    await this.setup();
  }
}

// 使用类型定义
const config: TypeDefinitions.Config = {
  name: 'example',
  version: '1.0.0',
};

// 使用接口规范
class MyService implements InterfaceSpecs.Service {
  async start(): Promise<void> {
    // 实现启动逻辑
  }

  async stop(): Promise<void> {
    // 实现停止逻辑
  }
}

// 使用通用功能
const logger = CommonFeatures.Logger.create('MyApp');
logger.info('Application started');
```

## Building

Run `nx build arteffix-library` to build the library.

## Running unit tests

Run `nx test arteffix-library` to execute the unit tests via [Jest](https://jestjs.io).
