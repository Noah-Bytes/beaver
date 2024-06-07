import { ShellConda } from '@beaver/shell-conda';
import { ShellFlow } from '@beaver/shell-flow';
import { IShellAppRunParams } from '@beaver/types';

export class Shell {
  private readonly _ctx: ShellFlow;
  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
  }

  /**
   * @param params
   */
  execute(params: IShellAppRunParams) {
    return new ShellConda(
      {
        home: this._ctx.homeDir,
        path: params.path || params.cwd,
        envs: params.env,
        venv: params.venv,
        run: params.message,
      },
      {
        errStream: this._ctx.errStream,
        outStream: this._ctx.outStream,
      },
    );
  }

  run(params: IShellAppRunParams) {
    return new ShellConda(
      {
        home: this._ctx.homeDir,
        path: params.path || params.cwd,
        envs: params.env,
        venv: params.venv,
        run: params.message,
      },
      {
        errStream: this._ctx.errStream,
        outStream: this._ctx.outStream,
      },
    );
  }
}
