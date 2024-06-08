import type { IPublicPluginConfig, IPublicPluginMeta } from '@beaver/types';
import type { IPluginRuntime } from '../types';

export class PluginRuntime implements IPluginRuntime {
  private _initHad: boolean = false;
  private readonly pluginName: string;

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
  }

  isInit(): boolean {
    return this._initHad;
  }
  async init(forceInit?: boolean): Promise<void> {
    if (this._initHad && !forceInit) return;
    await this.fn.init?.call(undefined);
    this._initHad = true;
  }
  async destroy(): Promise<void> {
    if (!this._initHad) return;
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
