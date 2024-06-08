import { IPublicPlugin, IPublicPluginMeta } from '@beaver/types';
import {
  IPluginManager,
  IPluginRegisterOptions,
  IPluginRuntime,
} from '../types';
import { PluginRuntime } from './plugin';

export class PluginManager implements IPluginManager {
  private plugins: IPluginRuntime[] = [];
  private pluginMap: Map<string, IPluginRuntime> = new Map();

  get size() {
    return this.pluginMap.size;
  }

  get(pluginName: string): IPluginRuntime | undefined {
    return this.pluginMap.get(pluginName);
  }
  getAll(): IPluginRuntime[] {
    return this.plugins;
  }
  has(pluginName: string): boolean {
    return this.pluginMap.has(pluginName);
  }
  async init(): Promise<void> {
    const graph = this.buildDependencyGraph(this.plugins);
    const sortedPluginIds = this.topologicalSort(graph);

    if (sortedPluginIds === null) {
      console.error('Cannot load plugins due to a cyclic dependency.');
      return;
    }

    for (let pluginName of sortedPluginIds) {
      try {
        await this.get(pluginName)!.init();
      } catch (e) /* istanbul ignore next */ {
        console.error(
          `Failed to init plugin:${pluginName}, it maybe affect those plugins which depend on this.`,
        );
        console.error(e);
      }
    }
  }

  /**
   * 删除插件
   * @param pluginName
   */
  async delete(pluginName: string): Promise<boolean> {
    if (!this.has(pluginName)) {
      return true;
    }

    try {
      await this.get(pluginName)!.destroy();
      this.plugins = this.plugins.filter(
        (plugin) => plugin.name !== pluginName,
      );
      this.pluginMap.delete(pluginName);
      return true;
    } catch (e) {
      console.error(`Failed to destroy plugin ${pluginName}.`, e);
      throw new Error(`Failed to destroy plugin ${pluginName}.`);
    }
  }

  async register(
    plugin: IPublicPlugin,
    options?: IPluginRegisterOptions,
  ): Promise<void> {
    let { pluginName, metadata = {} } = plugin;

    const allowOverride = options?.override === true;

    if (this.has(pluginName)) {
      if (!allowOverride) {
        throw new Error(`Plugin with name ${pluginName} exists`);
      } else {
        console.log(
          'plugin override, originalPlugin with name ',
          pluginName,
          ' will be destroyed.',
        );
        await this.delete(pluginName);
      }
    }

    // 上下文
    const ctx = {
      project: {},
      setters: {},
      material: {},
      hotkey: {},
      plugins: {},
      skeleton: {},
      logger: {},
      config: {},
      event: {},
      preference: {},
    };

    const fn = plugin(ctx);

    const pluginRuntime = new PluginRuntime(pluginName, metadata, fn);

    /**
     * 自动初始化
     */
    if (options?.autoInit) {
      if (!this.checkDependencies(metadata)) {
        throw new Error(
          `Dependencies for plugin ${pluginName} are not satisfied.`,
        );
      }
      await pluginRuntime.init();
    }

    this.plugins.push(pluginRuntime);
    this.pluginMap.set(pluginName, pluginRuntime);
    console.log(
      `plugin registered with pluginName: ${pluginName}, config: `,
      options,
      'metadata:',
      metadata,
    );
  }

  /**
   * 插件销毁
   */
  async destroy(): Promise<void> {
    for (const plugin of this.plugins) {
      await this.delete(plugin.name);
    }
    this.plugins = [];
    this.pluginMap.clear();
  }

  toProxy() {
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (target.pluginMap.has(prop as string)) {
          return target.pluginMap.get(prop as string)?.toProxy();
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  private checkDependencies(metadata: IPublicPluginMeta): boolean {
    if (!metadata.dependencies) return true;

    return metadata.dependencies.every((depId) => {
      const depMetadata = this.pluginMap.get(depId);
      if (depMetadata) {
        return true;
      }

      console.log(`${depId} not exist`);
      return false;
    });
  }

  private buildDependencyGraph(
    plugins: IPluginRuntime[],
  ): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    plugins.forEach((plugin) => {
      graph.set(plugin.name, plugin.metadata?.dependencies || []);
    });
    return graph;
  }

  private topologicalSort(graph: Map<string, string[]>): string[] | null {
    const sorted: string[] = [];
    const visited: Set<string> = new Set();
    let hasCycle = false;

    function visit(node: string, ancestors: Set<string>) {
      if (ancestors.has(node)) {
        hasCycle = true; // 发现环
        return;
      }

      if (!visited.has(node)) {
        visited.add(node);
        ancestors.add(node);
        const dependencies = graph.get(node) || [];
        dependencies.forEach((dep) => visit(dep, new Set(ancestors)));
        ancestors.delete(node);
        sorted.unshift(node); // 将节点添加到排序结果的开头
      }
    }

    graph.forEach((_, node) => {
      if (!visited.has(node)) {
        visit(node, new Set());
      }
    });

    return hasCycle ? null : sorted;
  }
}
