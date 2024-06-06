import * as modules from './bin/module';

export class Module<T> {
  private moduleList: T[] = [];
  private moduleMap: Map<string, T> = new Map();

  constructor() {}
  async initModule(): Promise<void> {
    for (let modulesKey in modules) {
      // @ts-ignore
      const mod = modules[modulesKey];
      if (this.getModule(modulesKey.toLowerCase())) {
      } else if (typeof mod === 'function') {
        // @ts-ignore
        const m = new mod(this._ctx);
        if (m?.init) {
          await m.init();
        }
        this.createModule(modulesKey.toLowerCase(), m);
      }
    }
  }

  getModule(name: string) {
    return this.moduleMap.get(name);
  }

  getModules(): T[] {
    return this.moduleList;
  }

  hasModule(name: string): boolean {
    return this.moduleMap.has(name);
  }

  removeAllModule(): void {
    this.moduleList = [];
    this.moduleMap.clear();
  }

  removeModule(name: string): void {
    const mod = this.getModule(name);
    if (mod) {
      this.moduleList = this.moduleList.filter((s) => s !== mod);
      this.moduleMap.delete(name);
    }
  }

  createModule(name: string, instantiate: T): void {
    this.moduleMap.set(name, instantiate);
    this.moduleList.push(instantiate);
  }
}
