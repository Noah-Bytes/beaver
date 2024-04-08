import { IBinModuleTypes } from '../types/bin-types';
import { IShellTypes } from '../types/shell-types';
import { ShellFlow } from '@beaver/shell-flow';

export class Ffmpeg implements IBinModuleTypes {
  private readonly _ctx: ShellFlow;
  readonly shell: IShellTypes;

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('ffmpeg');
  }

  async install(): Promise<void> {
    await this.shell.run('conda install -y -c conda-forge ffmpeg');
  }

  installed(): boolean {
    const { bin } = this._ctx;
    if (bin.installed['conda']) {
      return bin.installed['conda'].includes('ffmpeg');
    }
    return false;
  }

  async uninstall(): Promise<void> {
    await this.shell.run('conda remove -y ffmpeg');
  }
}
