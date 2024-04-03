import type { IPluginManager } from '../types/plugin-types';
import { PluginManager } from '../plugin/plugin-manager';

export class Beaver {
  pluginManager: IPluginManager;

  constructor() {
    this.pluginManager = new PluginManager();
  }
}
