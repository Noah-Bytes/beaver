import {
  IPublicPlugin,
  IPublicPluginConfig,
  IPublicPluginMeta,
} from '@beaver/types';

export interface IPluginRuntime {
  /**
   * 插件名称
   */
  name: string;
  /**
   * 插件元数据
   */
  metadata?: IPublicPluginMeta;

  fn: IPublicPluginConfig;

  isInit(): boolean;

  /**
   * 插件初始化
   */
  init(forceInit?: boolean): void | Promise<void>;

  /**
   * 销毁插件
   */
  destroy(): void | Promise<void>;

  toProxy(): any;
}

export interface IPluginManager {
  /**
   * 可以通过 plugin app 获取其他插件 export 导出的内容
   */
  [key: string]: any;

  register(
    plugin: IPublicPlugin,
    options?: IPluginRegisterOptions,
  ): Promise<void>;
  get(pluginName: string): IPluginRuntime | undefined;
  getAll(): IPluginRuntime[];
  has(pluginName: string): boolean;
  /**
   * 插件初始化
   */
  init(): void | Promise<void>;

  /**
   * 删除插件
   */
  delete(pluginName: string): boolean | Promise<boolean>;

  destroy(): Promise<void>;

  toProxy(): IPluginManager;
}

export interface IPluginRegisterOptions {
  /**
   * Will enable plugin registered with auto-initialization immediately
   * other than plugin-manager init all plugins at certain time.
   * It is helpful when plugin register is later than plugin-manager initialization.
   */
  autoInit?: boolean;
  /**
   * allow overriding existing plugin with same name when override === true
   */
  override?: boolean;
}
