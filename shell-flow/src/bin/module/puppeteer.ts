import { ShellConda } from '@beaver/shell-conda';
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
    await new ShellConda({
      home: this._ctx.homeDir,
      envs: {
        PUPPETEER_CACHE_DIR: dir,
      },
      path: 'bin/puppet',
      run: 'npm init -y',
    }).run();

    await new ShellConda({
      home: this._ctx.homeDir,
      envs: {
        PUPPETEER_CACHE_DIR: dir,
      },
      path: 'bin/puppet',
      run: `npm install puppeteer ${options?.mirror ? '--registry=https://registry.npmmirror.com' : ''}`,
    }).run();
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
