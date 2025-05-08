# interceptor

## 项目简介

**interceptor** 是 Beaver 项目中的拦截器模块，提供请求拦截、响应处理、错误捕获等功能，支持多种拦截器类型和自定义处理逻辑。

## 主要功能

- 支持请求拦截
- 支持响应处理
- 支持错误捕获
- 支持自定义处理逻辑

## 使用示例

```typescript
import { Interceptor } from '@beaver/interceptor';

const interceptor = new Interceptor();

// 注册请求拦截器
interceptor.registerRequestInterceptor({
  name: 'auth',
  handler: async (request) => {
    // 添加认证信息
    request.headers['Authorization'] = 'Bearer token';
    return request;
  },
});

// 注册响应拦截器
interceptor.registerResponseInterceptor({
  name: 'error',
  handler: async (response) => {
    if (response.status >= 400) {
      // 处理错误响应
      throw new Error('Request failed');
    }
    return response;
  },
});

// 注册错误拦截器
interceptor.registerErrorInterceptor({
  name: 'logger',
  handler: async (error) => {
    // 记录错误信息
    console.error('Error:', error);
    throw error;
  },
});

// 使用拦截器
const client = new HttpClient({
  interceptors: [interceptor],
});

// 发送请求
const response = await client.get('https://api.example.com/data');
```

## Building

Run `nx build interceptor` to build the library.

## Running unit tests

Run `nx test interceptor` to execute the unit tests via [Jest](https://jestjs.io).
