import { ActionFs } from '@beaver/action-fs';
import { isWin32 } from '@beaver/arteffix-utils';
import { ShellConda } from '@beaver/shell-conda';
import { ShellFlow } from '@beaver/shell-flow';
import { BinModule } from './bin-module';

export class Git extends BinModule {
  static GIT_CONFIG = 'gitconfig';
  override readonly dependencies: string[] = ['conda'];

  constructor(ctx: ShellFlow) {
    super('git', ctx);
  }

  override async install(): Promise<void> {
    await this.run('conda install -y -c conda-forge git git-lfs');

    if (isWin32) {
      const actionFs = new ActionFs({
        home: this._ctx.homeDir,
        type: 'outputFile',
        file: Git.GIT_CONFIG,
        content: `[core]
  longpaths = true
[http]
  postBuffer = 524288000
`,
      });
      await actionFs.run();
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
    await new ShellConda({
      home: this._ctx.homeDir,
      run: 'conda remove -y git git-lfs',
    }).run();
    this.isInstalled = false;
  }
}
