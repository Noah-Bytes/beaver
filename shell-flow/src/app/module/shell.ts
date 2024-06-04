import { uuid } from '@beaver/arteffix-utils';
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

    const sh = this._ctx.shell.createShell(
      `app/shell/running/${uuid()}`,
      ctx.name,
    );
    await sh.execute(params, {
      cwd: params.cwd,
      path: params.path,
      env: params.env,
    });

    const that = this;

    sh.getPty().onData((data) => {
      if (params.on) {
        params.on.forEach((elem) => {
          that._ctx.eventBus.emit(elem.event, data);
        });
      }
    });
  }

  async run(params: IShellAppRunParams) {
    params.message = this.parseMessage(params);

    const result = await this.shell.run(params, {
      cwd: params.cwd,
      path: params.path,
      env: params.env,
    });

    if (params.on) {
      params.on.forEach((elem) => {
        this._ctx.eventBus.emit(elem.event, result);
      });
    }
  }

  async stop() {
    this.shell.kill();
  }
}
