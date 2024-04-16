import { ShellFlow } from '@beaver/shell-flow';
import { IShellAppRunParams } from '@beaver/types';
import { uuid } from '@beaver/utils';
import { IAppTypes } from '../../types/app-types';
import { IShellTypes } from '../../types/shell-types';

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

  async execute(params: IShellAppRunParams, ctx: IAppTypes) {
    params.message = this.parseMessage(params);
    const sh = this._ctx.shell.createShell(
      `app/shell/running/${uuid()}`,
      ctx.name,
    );
    sh.execute(params, {
      cwd: params.cwd,
      path: params.path,
      env: params.env,
    }).catch((e) => {
      console.error(e);
    });
    sh.onShellData((data) => {
      console.log(data);
    });

    return sh;
  }

  async run(params: IShellAppRunParams) {
    params.message = this.parseMessage(params);

    await this.shell.run(params, {
      cwd: params.cwd,
      path: params.path,
      env: params.env,
    });
  }

  async stop() {
    this.shell.kill();
  }
}
