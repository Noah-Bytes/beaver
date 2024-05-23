import { isWin32 } from '@beaver/arteffix-utils';
import { ShellFlow } from '@beaver/shell-flow';
import { BinModule } from './bin-module';

export class Aria2 extends BinModule {
  static DOWNLOAD_URL =
    'https://github.com/aria2/aria2/releases/download/release-1.36.0/aria2-1.36.0-win-64bit-build1.zip';

  override readonly dependencies: string[] = ['zip'];

  constructor(ctx: ShellFlow) {
    super('aria2', ctx);
  }

  override async install(): Promise<void> {
    if (isWin32) {
      const { bin } = this._ctx;
      const dest = 'aria2-1.36.0-win-64bit-build1.zip';
      await bin.download(Aria2.DOWNLOAD_URL, dest);
      await this.shell.run({
        message: `7z x ${dest} -o aria2`,
      });
    } else {
      await this.shell.run({
        message: 'conda install -y -c conda-forge aria2',
      });
    }
  }

  override async installed(): Promise<boolean> {
    const { bin } = this._ctx;
    if (isWin32) {
      return bin.exists('aria2');
    }

    return await bin.checkIsInstalled('aria2', 'brew');
  }

  override async uninstall(): Promise<void> {
    if (isWin32) {
      const { bin } = this._ctx;
      await bin.rm('aria2');
    }
    await this.shell.run({
      message: 'brew remove aria2',
    });
  }

  env(): { [p: string]: any } | undefined {
    if (isWin32) {
      return {
        PATH: [this._ctx.bin.absPath('aria2')],
      };
    }

    return undefined;
  }
}
