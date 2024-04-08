import { IBinModuleTypes } from '../types/bin-types';
import { ShellFlow } from '@beaver/shell-flow';
import { IShellTypes } from '../types/shell-types';
import * as decompress from 'decompress';
import * as path from 'path';
import { isDarwin } from '@beaver/utils';

export class LLVM implements IBinModuleTypes {
  private readonly _ctx: ShellFlow;
  readonly shell: IShellTypes;

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('node');
  }

  async install(): Promise<void> {
    if (isDarwin()) {
      await this.shell.run({
        message: 'brew install llvm',
      });
    } else {
      await this.shell.run({
        message: 'conda install -y -c conda-forge llvm',
      });
    }
  }

  installed(): boolean | Promise<boolean> {
    const { bin } = this._ctx;

    let groupName;

    if (isDarwin()) {
      groupName = 'brew';
    } else {
      groupName = 'conda';
    }

    if (bin.installed[groupName]) {
      return bin.installed[groupName].includes('llvm');
    }

    return false;
  }

  async uninstall(): Promise<void> {
    await this.shell.run({
      message: 'conda remove -y llvm',
    });
  }
}
