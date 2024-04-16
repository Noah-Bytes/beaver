import { ShellFlow } from '@beaver/shell-flow';
import { IShellManagerTypes } from '../types/shell-manager-types';
import { IShellRunParams, IShellTypes } from '../types/shell-types';
import { Shell } from './shell';

export class ShellManager implements IShellManagerTypes {
  private readonly _shellMap: Map<string, IShellTypes> = new Map();
  private readonly _groupMap: Map<string, IShellTypes[]> = new Map();
  private readonly _ctx: ShellFlow;
  private readonly _defaultGroupName = 'default';

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this._groupMap.set(this._defaultGroupName, []);
  }

  createShell(
    name: string,
    groupName: string = this._defaultGroupName,
  ): IShellTypes {
    if (this._shellMap.has(name)) {
      throw new Error(`${name} shell had`);
    }

    const shell = new Shell(name, groupName, this._ctx);
    this._shellMap.set(name, shell);

    if (!this._groupMap.has(groupName)) {
      this._groupMap.set(groupName, []);
    }
    this._groupMap.get(groupName)?.push(shell);

    return shell;
  }

  getShell(name: string): IShellTypes | undefined {
    return this._shellMap.get(name);
  }

  getShells(groupName: string = this._defaultGroupName): IShellTypes[] {
    return this._groupMap.get(groupName) || [];
  }

  getMates() {
    const mates = [];
    for (let [key, shell] of this._shellMap) {
      mates.push(shell.getMeta());
    }

    return mates;
  }

  removeAllShell(groupName: string = this._defaultGroupName): void {
    const shells = this._groupMap.get(groupName);
    if (shells) {
      for (const shell of shells) {
        shell.kill();
        this._shellMap.delete(shell.name);
      }
      this._groupMap.set(groupName, []);
    }
  }

  removeShell(name: string): void {
    let shell = this._shellMap.get(name);
    if (shell) {
      shell.kill();
      const shells = this._groupMap.get(shell.groupName) || [];
      const index = shells.indexOf(shell);
      if (index !== -1) {
        shells.splice(index, 1);
      }
      this._shellMap.delete(name);
      shell = undefined;
    }
  }

  pauseAllShell(groupName: string = this._defaultGroupName): void {
    for (let shell of this._groupMap.get(groupName) || []) {
      shell.pause();
    }
  }

  pauseShell(name: string): void {
    let shell = this.getShell(name);
    if (shell) {
      shell.pause();
    }
  }

  resumeAllShell(groupName: string = this._defaultGroupName): void {
    for (let shell of this._groupMap.get(groupName) || []) {
      shell.resume();
    }
  }

  resumeShell(name: string): void {
    let shell = this.getShell(name);
    if (shell) {
      shell.resume();
    }
  }

  async run(name: string, params: IShellRunParams): Promise<string> {
    let shell = this.getShell(name);

    if (!shell) {
      throw new Error(`${name} shell not init`);
    }

    if (!shell?.isInit()) {
      shell.init();
    }

    return await shell.run(params);
  }
}
