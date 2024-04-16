import { ShellFlow } from '@beaver/shell-flow';
import { isWin32 } from '@beaver/utils';
import { IBinModuleTypes } from '../../types/bin-types';
import { IShellTypes } from '../../types/shell-types';

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

  async installed(): Promise<boolean> {
    const { bin } = this._ctx;

    const cudnn = await bin.checkIsInstalled('cudnn', 'conda');
    const cuda = await bin.checkIsInstalled('cuda', 'conda');

    if (isWin32()) {
      const libzlib = await bin.checkIsInstalled('libzlib-wapi', 'conda');
      return cudnn && cuda && libzlib;
    }

    return cudnn && cuda;
  }

  async uninstall(): Promise<void> {
    await this.shell.run({
      message: 'conda remove -y cudnn cuda',
    });
  }
}
