# action-download

## 项目简介

**action-download** 是 Beaver 项目中的下载相关功能模块，提供文件下载、资源获取等功能，支持多种下载方式和格式。

## 主要功能

- 支持多种下载方式
- 支持多种文件格式
- 支持下载进度监控
- 支持下载中断与重试

## 使用示例

```typescript
import { DownloadAction } from '@beaver/action-download';

const downloadAction = new DownloadAction({
  url: 'https://example.com/file.zip',
  outputPath: './downloads',
});

// 开始下载
await downloadAction.run();

// 停止下载
await downloadAction.kill();
```

## Building

Run `nx build action-download` to build the library.

## Running unit tests

Run `nx test action-download` to execute the unit tests via [Jest](https://jestjs.io).
