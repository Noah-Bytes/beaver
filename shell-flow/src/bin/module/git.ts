import { isWin32 } from '@beaver/arteffix-utils';
import { ShellFlow } from '@beaver/shell-flow';
import fs from 'fs';
import path from 'path';
import { BinModule } from './bin-module';

export class Git extends BinModule {
  static GIT_CONFIG = '.gitconfig';
  override readonly dependencies: string[] = ['conda'];

  constructor(ctx: ShellFlow) {
    super('git', ctx);
  }

  env() {
    if (isWin32) {
      const { homeDir } = this._ctx;
      return {
        GIT_CONFIG_GLOBAL: path.resolve(homeDir, Git.GIT_CONFIG),
      };
    }

    return undefined;
  }

  override async install(): Promise<void> {
    await this.shell.run({
      message: 'conda install -y -c conda-forge git git-lfs',
    });

    if (isWin32) {
      const { homeDir, app, absPath } = this._ctx;
      const gitConfigPath = absPath(Git.GIT_CONFIG);
      if (!app.exists(gitConfigPath)) {
        await fs.promises.copyFile(
          path.resolve(__dirname, '..', 'gitconfig_template'),
          gitConfigPath,
        );
      }
    }
  }

  override async installed(): Promise<boolean> {
    const { bin } = this._ctx;

    return await bin.checkIsInstalled('git', 'conda');
  }

  override async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await this.shell.run({
      message: 'conda remove -y git git-lfs',
    });
  }
}
