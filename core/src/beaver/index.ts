import type { IPluginManager } from '../types/plugin-types';
import { PluginManager } from '../plugin/plugin-manager';

export class Beaver {
  plugin: IPluginManager;

  constructor() {
    this.plugin = new PluginManager();
  }
}
