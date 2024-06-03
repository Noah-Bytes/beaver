import { isWin32 } from '@beaver/arteffix-utils';
import { ShellFlow } from '@beaver/shell-flow';
import fs from 'fs-extra';
import path from 'path';
import { BinModule } from './bin-module';

export class Git extends BinModule {
  static GIT_CONFIG = 'gitconfig';
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
      const { app } = this._ctx;
      const gitConfigPath = this._ctx.absPath(Git.GIT_CONFIG);
      if (!app.exists(gitConfigPath)) {
        await fs.outputFile(
          gitConfigPath,
          `[core]
  longpaths = true
[http]
  postBuffer = 524288000
`,
        );
      }
    }
  }

  override async installed(): Promise<boolean> {
    const { bin } = this._ctx;

    if (this.isInstalled) {
      return true;
    }

    this.isInstalled = await bin.checkIsInstalled('git', 'conda');

    return this.isInstalled;
  }

  override async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await this.shell.run({
      message: 'conda remove -y git git-lfs',
    });
    this.isInstalled = false;
  }
}
