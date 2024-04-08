import { IShellManagerTypes } from '../types/shell-manager-types';
import { IShellRunParams, IShellTypes } from '../types/shell-types';
import { Shell } from './shell';
import { IShellFlowTypes } from '../types/shell-flow-types';

export class ShellManager implements IShellManagerTypes {
  private _shells: IShellTypes[] = [];
  private readonly _shellMap: Map<string, IShellTypes> = new Map();
  private readonly _ctx: IShellFlowTypes;

  constructor(ctx: IShellFlowTypes) {
    this._ctx = ctx;
  }

  createShell(name: string): IShellTypes {
    const shell = new Shell(name, this._ctx);
    this._shells.push(shell);
    this._shellMap.set(name, shell);
    return shell;
  }

  getShell(name: string): IShellTypes | undefined {
    return this._shellMap.get(name);
  }

  getShells(): IShellTypes[] {
    return this._shells;
  }

  removeAllShell(): void {
    for (const shell of this._shells) {
      shell.kill();
    }

    this._shells = [];
    this._shellMap.clear();
  }

  removeShell(name: string): void {
    const shell = this._shellMap.get(name);
    if (shell) {
      shell.kill();
      this._shells = this._shells.filter((s) => s !== shell);
      this._shellMap.delete(name);
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
