import { IBinModuleTypes, IShellTypes, ShellFlow } from '@beaver/shell-flow';

export class BinModule implements IBinModuleTypes {
  readonly _ctx: ShellFlow;
  readonly dependencies: string[] = [];
  readonly shell: IShellTypes;

  constructor(name: string, ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('aria2');
    this.shell.onShellData(function (data: string) {
      ctx.options?.requirement?.(data);
    });
  }

  install(): Promise<void> {
    return Promise.resolve(undefined);
  }

  installed(): boolean | Promise<boolean> {
    return false;
  }

  uninstall(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
