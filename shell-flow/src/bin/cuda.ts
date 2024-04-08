import { IBinModuleTypes } from '../types/bin-types';
import { ShellFlow } from '@beaver/shell-flow';
import { IShellTypes } from '../types/shell-types';
import { isWin32 } from '@beaver/utils';

export class Cuda implements IBinModuleTypes {
  private readonly _ctx: ShellFlow;
  readonly shell: IShellTypes;

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('cuda');
  }

  async install(): Promise<void> {
    if (isWin32()) {
      await this.shell.run({
        message: 'conda install -y cudnn libzlib-wapi -c conda-forge',
      });

      await this.shell.run({
        message: 'conda install -y cuda -c nvidia/label/cuda-12.1.0',
      });
    } else {
      await this.shell.run({
        message: 'conda install -y cudnn -c conda-forge',
      });
      await this.shell.run({
        message: 'conda install -y cuda -c nvidia/label/cuda-12.1.0',
      });
    }
  }

  installed(): boolean {
    const { bin } = this._ctx;

    if (bin.installed['conda']) {
      const cudnn = bin.installed['conda'].includes('cudnn');
      const cuda = bin.installed['conda'].includes('cuda');

      if (isWin32()) {
        const libzlib = bin.installed['conda'].includes('libzlib-wapi');
        return cudnn && cuda && libzlib;
      }

      return cudnn && cuda;
    }

    return false;
  }

  async uninstall(): Promise<void> {
    await this.shell.run({
      message: 'conda remove -y cudnn cuda',
    });
  }
}
