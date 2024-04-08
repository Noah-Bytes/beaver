import { IBinModuleTypes } from '../types/bin-types';
import { IShellTypes } from '../types/shell-types';
import { isWin32 } from '@beaver/utils';
import { ShellFlow } from '@beaver/shell-flow';

export class Zip implements IBinModuleTypes {
  readonly shell: IShellTypes;

  private readonly _ctx: any;
  private readonly packageName: string;

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('zip');
    this.packageName = isWin32() ? '7zip' : 'p7zip';
  }

  async install(): Promise<void> {
    await this.shell.run({
      message: `conda install -y -c conda-forge ${this.packageName}`,
    });
  }

  installed(): boolean {
    const { bin } = this._ctx;
    if (bin.installed['conda']) {
      return bin.installed['conda'].includes(this.packageName);
    }

    return false;
  }

  async uninstall(): Promise<void> {
    await this.shell.run({
      message: `conda remove -y ${this.packageName}`,
    });
  }
}
