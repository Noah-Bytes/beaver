import type { IPublicPluginConfig, IPublicPluginMeta } from '@beaver/types';
import { consola } from 'consola';
import type { ConsolaInstance } from 'consola/dist/core';
import type { IPluginRuntime } from '../types';

export class PluginRuntime implements IPluginRuntime {
  private _initHad: boolean = false;
  private readonly pluginName: string;
  logger: ConsolaInstance;

  get initHad(): boolean {
    return this._initHad;
  }

  metadata?: IPublicPluginMeta;
  fn: IPublicPluginConfig;

  get name() {
    return this.pluginName;
  }

  constructor(
    pluginName: string,
    metadata: IPublicPluginMeta,
    fn: IPublicPluginConfig,
  ) {
    this.pluginName = pluginName;
    this.metadata = metadata;
    this.fn = fn;
    this.logger = consola.withTag(`plugin:${pluginName}`);
  }

  isInit(): boolean {
    return this._initHad;
  }
  async init(forceInit?: boolean): Promise<void> {
    if (this._initHad && !forceInit) return;
    this.logger.log('method init called');
    await this.fn.init?.call(undefined);
    this._initHad = true;
  }
  async destroy(): Promise<void> {
    if (!this._initHad) return;
    this.logger.log('method destroy called');
    await this.fn?.destroy?.call(undefined);
    this._initHad = false;
  }

  toProxy() {
    const exports = this.fn.exports?.();
    return new Proxy(this, {
      get(target, prop, receiver) {
        if ({}.hasOwnProperty.call(exports, prop)) {
          return exports?.[prop as string];
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }
}
