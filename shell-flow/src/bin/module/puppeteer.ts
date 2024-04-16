import { IBinModuleTypes } from '../../types/bin-types';
import { ShellFlow } from '@beaver/shell-flow';
import { IShellTypes } from '../../types/shell-types';
import * as fs from 'fs';

export class Puppeteer implements IBinModuleTypes {
  private readonly _ctx: ShellFlow;
  readonly shell: IShellTypes;

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('puppeteer');
  }

  async install() {
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

  async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await bin.rm('puppet');
  }

  installed(): boolean | Promise<boolean> {
    const { bin } = this._ctx;
    return (
      bin.exists('puppet') &&
      bin.exists('puppet', 'node_modules') &&
      bin.exists('puppet', 'chrome')
    );
  }
}
