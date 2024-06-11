import { ShellConda } from '@beaver/shell-conda';
import { ShellFlow } from '@beaver/shell-flow';
import { BinModule } from './bin-module';

export class Py extends BinModule {
  constructor(ctx: ShellFlow) {
    super('py', ctx);
  }

  override async install(): Promise<void> {
    const { bin, options } = this._ctx;
    await new ShellConda({
      home: this._ctx.homeDir,
      path: 'bin',
      run: `git clone https://github.com/pinokiocomputer/python py`,
    }).run();

    await new ShellConda({
      home: this._ctx.homeDir,
      path: 'bin/py',
      run: `pip install -r requirements.txt ${options?.mirror ? '-i https://pypi.mirrors.ustc.edu.cn/simple/' : ''}`,
    }).run();
  }

  override installed(): boolean | Promise<boolean> {
    const { bin } = this._ctx;
    if (this.isInstalled) {
      return true;
    }
    this.isInstalled = bin.exists('py');
    return this.isInstalled;
  }

  override async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await bin.rm('py');
  }
}
