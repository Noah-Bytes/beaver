import { IActionUse, IActionUseOptions, IStepWith } from '@beaver/types';
import * as process from 'process';
import * as stream from 'stream';
import { Core } from './core';
import { HOME } from './global';

export class ActionUse<T extends IStepWith> implements IActionUse<T> {
  home = HOME;
  with: T;
  errStream: stream.Writable;
  outStream: stream.Writable;
  silent?: boolean;

  constructor(params: T, options?: IActionUseOptions) {
    if (params.home) {
      this.home = params.home;
    }
    this.with = params;
    this.silent = options?.silent;
    this.errStream = options?.errStream || <stream.Writable>process.stderr;
    this.outStream = options?.outStream || <stream.Writable>process.stdout;
  }

  run(): Promise<string | string[]> {
    return Promise.resolve('0');
  }

  kill(): Promise<void> {
    return Promise.resolve(undefined);
  }
}

export class UseManage {
  private useMap: Map<string, typeof ActionUse<IStepWith>> = new Map();
  private _ctx: Core;

  constructor(ctx: Core) {
    this._ctx = ctx;
  }

  register(name: string, use: typeof ActionUse<IStepWith>) {
    if (this.useMap.has(name)) {
      console.warn(`${name} 已存在`);
      return;
    }
    this.useMap.set(name, use);
  }

  run(name: string, params: any) {
    if (!this.useMap.has(name)) {
      throw new Error(`${name} does not exist`);
    }

    const Use = this.useMap.get(name);
    return new Use(
      {
        home: this._ctx.options.homeDir,
        ...params,
      },
      {
        errStream: this._ctx.options.errStream,
        outStream: this._ctx.options.outStream,
      },
    );
  }
}
