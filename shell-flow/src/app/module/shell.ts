import { ShellConda } from '@beaver/shell-conda';
import { ShellFlow } from '@beaver/shell-flow';
import { IShellAppRunParams } from '@beaver/types';

export class Shell {
  private readonly _ctx: ShellFlow;
  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
  }

  parseMessage(params: IShellAppRunParams): string | string[] {
    let message: string | string[] = '';

    if (params.messageFn) {
      const { systemInfo, options } = this._ctx;
      message = params.messageFn({
        platform: systemInfo.platform,
        gpu: systemInfo.GPU,
        mirror: !!options?.mirror,
      });
    } else if (params.message) {
      message = params.message;
    }

    return message;
  }

  /**
   * @param params
   */
  execute(params: IShellAppRunParams) {
    params.message = this.parseMessage(params);
    return new ShellConda({
      home: this._ctx.homeDir,
      path: params.path || params.cwd,
      envs: params.env,
      venv: params.venv,
      run: params.message,
    });
  }

  run(params: IShellAppRunParams) {
    params.message = this.parseMessage(params);
    return new ShellConda({
      home: this._ctx.homeDir,
      path: params.path || params.cwd,
      envs: params.env,
      venv: params.venv,
      run: params.message,
    });
  }
}
