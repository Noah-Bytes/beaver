import { ShellFlow } from '@beaver/shell-flow';
import { IBinModuleTypes } from '../../types/bin-types';
import { IShellTypes } from '../../types/shell-types';

export class Ffmpeg implements IBinModuleTypes {
  private readonly _ctx: ShellFlow;
  readonly shell: IShellTypes;

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('ffmpeg');
  }

  async install(): Promise<void> {
    await this.shell.run({
      message: 'conda install -y -c conda-forge ffmpeg',
    });
  }

  async installed(): Promise<boolean> {
    const { bin } = this._ctx;
    return bin.checkIsInstalled('ffmpeg', 'conda');
  }

  async uninstall(): Promise<void> {
    await this.shell.run({
      message: 'conda remove -y ffmpeg',
    });
  }
}
