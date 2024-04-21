import { PluginManager } from '../plugin/plugin-manager';
import type { IPluginManager } from '../types/plugin-types';

export class Beaver {
  pluginManager: IPluginManager;

  constructor() {
    this.pluginManager = new PluginManager();
  }
}
