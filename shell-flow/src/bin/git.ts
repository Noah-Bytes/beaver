import { IBinModuleTypes } from '../types/bin-types';
import { IShellTypes } from '../types/shell-types';
import { ShellFlow } from '@beaver/shell-flow';
import { isWin32 } from '@beaver/utils';
import * as fs from 'fs';
import * as path from 'path';

export class Git implements IBinModuleTypes {
  static GIT_CONFIG = '.gitconfig';
  private readonly _ctx: ShellFlow;
  readonly shell: IShellTypes;
  readonly dependencies: string[] = ['conda'];

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('git');
  }

  env() {
    if (isWin32()) {
      const { homeDir } = this._ctx;
      return {
        GIT_CONFIG_GLOBAL: path.resolve(homeDir, Git.GIT_CONFIG),
      };
    }

    return undefined;
  }

  async install(): Promise<void> {
    await this.shell.run({
      message: 'conda install -y -c conda-forge git git-lfs',
    });

    if (isWin32()) {
      const { homeDir, api, absPath } = this._ctx;
      const gitConfigPath = absPath(Git.GIT_CONFIG);
      if (!api.exists(gitConfigPath)) {
        await fs.promises.copyFile(
          path.resolve(__dirname, '..', 'gitconfig_template'),
          gitConfigPath,
        );
      }
    }
  }

  installed(): boolean {
    const { bin } = this._ctx;

    if (bin.installed['conda']) {
      return bin.installed['conda'].includes('git');
    }

    return false;
  }

  async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await this.shell.run({
      message: 'conda remove -y git git-lfs',
    });
  }
}
