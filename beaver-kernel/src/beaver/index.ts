import { PluginManager } from '../plugin';
import type { IPluginManager } from '../types';

export class Beaver {
  pluginManager: IPluginManager;

  constructor() {
    this.pluginManager = new PluginManager();
  }
}
