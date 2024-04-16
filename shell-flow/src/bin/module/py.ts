import { ShellFlow } from '@beaver/shell-flow';
import { IBinModuleTypes } from '../../types/bin-types';
import { IShellTypes } from '../../types/shell-types';

export class Py implements IBinModuleTypes {
  private readonly _ctx: ShellFlow;
  readonly shell: IShellTypes;

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('py');
  }

  async install(): Promise<void> {
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

  installed(): boolean | Promise<boolean> {
    const { bin } = this._ctx;
    return bin.exists('py');
  }

  async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await bin.rm('py');
  }
}
