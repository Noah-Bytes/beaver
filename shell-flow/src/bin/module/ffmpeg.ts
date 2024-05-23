import { ShellFlow } from '@beaver/shell-flow';
import { BinModule } from './bin-module';

export class Ffmpeg extends BinModule {
  constructor(ctx: ShellFlow) {
    super('ffmpeg', ctx);
  }

  override async install(): Promise<void> {
    await this.shell.run({
      message: 'conda install -y -c conda-forge ffmpeg',
    });
  }

  override async installed(): Promise<boolean> {
    const { bin } = this._ctx;
    return bin.checkIsInstalled('ffmpeg', 'conda');
  }

  override async uninstall(): Promise<void> {
    await this.shell.run({
      message: 'conda remove -y ffmpeg',
    });
  }
}
