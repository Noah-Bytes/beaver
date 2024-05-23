import { ShellFlow } from '@beaver/shell-flow';
import { BinModule } from './bin-module';

export class Py extends BinModule {
  constructor(ctx: ShellFlow) {
    super('py', ctx);
  }

  override async install(): Promise<void> {
    const { bin, options } = this._ctx;
    await this.shell.run(
      {
        message: 'git clone https://github.com/pinokiocomputer/python py',
      },
      {
        path: bin.dir,
      },
    );
    await this.shell.run(
      {
        message: `pip install -r requirements.txt ${options?.isMirror ? '-i https://pypi.mirrors.ustc.edu.cn/simple/' : ''}`,
      },
      {
        path: bin.absPath('py'),
      },
    );
  }

  override installed(): boolean | Promise<boolean> {
    const { bin } = this._ctx;
    return bin.exists('py');
  }

  override async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await bin.rm('py');
  }
}
