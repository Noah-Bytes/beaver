import { ActionShell } from '@beaver/action-shell';
import { ShellConda } from '@beaver/shell-conda';
import { IBinModuleTypes, ShellFlow } from '@beaver/shell-flow';

export class BinModule implements IBinModuleTypes {
  readonly _ctx: ShellFlow;
  isInstalled = false;
  readonly dependencies: string[] = [];

  constructor(name: string, ctx: ShellFlow) {
    this._ctx = ctx;
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

  run(command: string | string[]) {
    const { homeDir, errStream, outStream } = this._ctx;
    const shellConda = new ShellConda(
      {
        home: homeDir,
        run: command,
      },
      {
        errStream,
        outStream,
      },
    );
    return shellConda.run();
  }

  runNotConda(command: string | string[], path?: string): Promise<string> {
    const { homeDir, errStream, outStream } = this._ctx;
    const shellConda = new ActionShell(
      {
        home: homeDir,
        run: command,
        path,
      },
      {
        errStream,
        outStream,
      },
    );
    return shellConda.run();
  }
}
