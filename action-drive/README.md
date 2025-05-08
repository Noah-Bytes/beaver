# action-drive

## 项目简介

**action-drive** 是 Beaver 项目中的驱动相关功能模块，提供设备驱动、硬件控制等功能，支持多种驱动类型和设备。

## 主要功能

- 支持多种驱动类型
- 支持设备控制
- 支持驱动状态监控
- 支持驱动中断与重试

## 使用示例

```typescript
import { DriveAction } from '@beaver/action-drive';

const driveAction = new DriveAction({
  deviceId: 'device-123',
  driverType: 'usb',
});

// 初始化驱动
await driveAction.init();

// 控制设备
await driveAction.control({ command: 'start' });

// 停止驱动
await driveAction.kill();
```

## Building

Run `nx build action-drive` to build the library.

## Running unit tests

Run `nx test action-drive` to execute the unit tests via [Jest](https://jestjs.io).
