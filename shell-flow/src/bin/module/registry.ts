import { isWin32 } from '@beaver/arteffix-utils';
import type { IShellTypes } from '@beaver/shell-flow';
import { IBinModuleTypes, ShellFlow } from '@beaver/shell-flow';

export class Registry implements IBinModuleTypes {
  readonly description =
    'Look for a dialog requesting admin permission and approve it to proceed. This will allow long paths on your machine, which is required for installing certain python packages.';
  private readonly _ctx: ShellFlow;
  readonly shell: IShellTypes;

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('registry');
  }

  async installed() {
    if (!isWin32()) {
      return false;
    }

    let result = await this.shell.run({
      message:
        'reg query HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem /v LongPathsEnabled',
    });
    let matches = /(LongPathsEnabled.+)[\r\n]+/.exec(result);

    if (!(matches && matches.length > 0)) {
      return false;
    }

    let chunks = matches[1].split(/\s+/);

    if (chunks.length === 3) {
      return Number(chunks[2]) === 1;
    }

    return false;
  }
  async install() {
    // 1. Set registry to allow long paths
    await this.shell.run(
      {
        message:
          'reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1 /f',
      },
      {
        sudo: true,
      },
    );
  }

  async uninstall() {
    await this.shell.run(
      {
        message:
          'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 0 /f',
      },
      {
        sudo: true,
      },
    );
  }
}
