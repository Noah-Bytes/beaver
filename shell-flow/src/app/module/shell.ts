import { ShellConda } from '@beaver/shell-conda';
import { IAppTypes, IShellTypes, ShellFlow } from '@beaver/shell-flow';
import { IShellAppRunParams } from '@beaver/types';

export class Shell {
  private readonly shell: IShellTypes;
  private readonly _ctx: ShellFlow;
  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('app/shell');
  }

  parseMessage(params: IShellAppRunParams): string | string[] {
    let message: string | string[] = '';

    if (params.messageFn) {
      const { systemInfo, options } = this._ctx;
      message = params.messageFn({
        platform: systemInfo.platform,
        gpu: systemInfo.GPU,
        mirror: options?.isMirror,
      });
    } else if (params.message) {
      message = params.message;
    }

    return message;
  }

  /**
   * @deprecated
   * @param params
   * @param ctx
   */
  async execute(params: IShellAppRunParams, ctx: IAppTypes) {
    params.message = this.parseMessage(params);
    console.log(params);
    const shellConda = new ShellConda({
      home: this._ctx.homeDir,
      path: params.path || params.cwd,
      envs: params.env,
      venv: params.venv,
      run: params.message,
    });
    await shellConda.run();
  }

  async run(params: IShellAppRunParams) {
    params.message = this.parseMessage(params);
    const shellConda = new ShellConda({
      home: this._ctx.homeDir,
      path: params.path || params.cwd,
      envs: params.env,
      venv: params.venv,
      run: params.message,
    });
    await shellConda.run();
  }

  async stop() {
    this.shell.kill();
  }
}
