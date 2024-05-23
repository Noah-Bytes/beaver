import { ShellFlow } from '@beaver/shell-flow';
import fs from 'fs';
import { BinModule } from './bin-module';

export class Puppeteer extends BinModule {
  constructor(ctx: ShellFlow) {
    super('puppeteer', ctx);
  }

  override async install() {
    const { bin, options } = this._ctx;
    const dir = bin.absPath('puppet');
    await fs.promises.mkdir(dir, { recursive: true });
    await this.shell.run(
      {
        message: `npm init -y`,
      },
      {
        path: dir,
        env: {
          PUPPETEER_CACHE_DIR: dir,
        },
      },
    );
    await this.shell.run(
      {
        message: `npm install puppeteer ${options?.isMirror ? '--registry=https://registry.npmmirror.com' : ''}`,
      },
      {
        path: dir,
        env: {
          PUPPETEER_CACHE_DIR: dir,
        },
      },
    );
  }

  override async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await bin.rm('puppet');
  }

  override installed(): boolean | Promise<boolean> {
    const { bin } = this._ctx;
    return (
      bin.exists('puppet') &&
      bin.exists('puppet', 'node_modules') &&
      bin.exists('puppet', 'chrome')
    );
  }
}
