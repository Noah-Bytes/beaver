# system-info

This library was generated with [Nx](https://nx.dev).

## 项目简介

**system-info** 是 Beaver 项目中的系统信息获取模块，提供系统状态监控、资源使用统计等功能，支持多种系统信息的采集和分析。

## 主要功能

- 支持系统状态监控
- 支持资源使用统计
- 支持性能指标采集
- 支持系统信息分析

## 使用示例

```typescript
import { SystemInfo } from '@beaver/system-info';

const systemInfo = new SystemInfo();

// 获取系统信息
const info = await systemInfo.getInfo();

// 获取CPU使用率
const cpuUsage = await systemInfo.getCpuUsage();

// 获取内存使用情况
const memoryUsage = await systemInfo.getMemoryUsage();

// 获取磁盘使用情况
const diskUsage = await systemInfo.getDiskUsage();

// 监控系统状态
systemInfo.monitor({
  interval: 1000,
  callback: (stats) => {
    console.log('System stats:', stats);
  },
});
```

## Building

Run `nx build system-info` to build the library.

## Running unit tests

Run `nx test system-info` to execute the unit tests via [Jest](https://jestjs.io).
