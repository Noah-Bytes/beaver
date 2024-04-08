import * as http from 'http';
import * as https from 'https';
import type { RequestOptions } from 'https';

function interceptRequest(module: typeof http | typeof https): void {
  console.log('start node http intercepting ...');

  const originalRequest = module.request;

  // 重写请求方法
  // @ts-ignore
  module.request = function (
    options: string | RequestOptions | URL,
    callback?: (res: http.IncomingMessage) => void,
  ): http.ClientRequest {
    console.log(options);
    let opts: RequestOptions;

    if (typeof options === 'string' || options instanceof URL) {
      opts = new URL(typeof options === 'string' ? options : options.href);
    } else {
      opts = { ...options };
    }

    // 修改请求选项
    if (opts.hostname && opts.hostname === 'repo.anaconda.com') {
      console.log(`Original request to ${opts.hostname}, intercepting...`);
      opts.hostname = 'mirrors.tuna.tsinghua.edu.cn'; // 修改为加速镜像的域名
      opts.path = `/anaconda${opts.path}`;
    }

    // 调用原始的请求方法
    // @ts-ignore
    return originalRequest.call(this, opts, callback);
  };
}

export function NodeHttpInterceptor() {
  // 拦截http和https请求
  interceptRequest(http);
  interceptRequest(https);
}
