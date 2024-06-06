import { IActionUse, IActionUseOptions, IStepWith } from '@beaver/types';
import * as process from 'process';
import * as stream from 'stream';
import { HOME } from './global';

export class ActionUse<T extends IStepWith> implements IActionUse<T> {
  home = HOME;
  with: T;
  errStream: stream.Writable;
  outStream: stream.Writable;

  constructor(params: T, options?: IActionUseOptions) {
    if (params.home) {
      this.home = params.home;
    }
    this.with = params;
    this.errStream = options?.errStream || <stream.Writable>process.stderr;
    this.outStream = options?.outStream || <stream.Writable>process.stdout;
  }

  run(): Promise<string> {
    return Promise.resolve('0');
  }
}

export class UseManage {
  private useMap: Map<string, ActionUse<IStepWith>> = new Map();

  constructor() {}

  register(name: string, use: ActionUse<IStepWith>) {
    if (this.useMap.has(name)) {
      console.warn(`${name} 已存在`);
      return;
    }
    this.useMap.set(name, use);
  }

  async run(name: string, params: any) {
    if (!this.useMap.has(name)) {
      throw new Error(`${name} does not exist`);
    }

    const Use = this.useMap.get(name);
    // @ts-ignore
    const process = new Use(params);
    await process.run();
  }
}
