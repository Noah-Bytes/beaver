import { isDarwin } from '@beaver/arteffix-utils';
import { ShellConda } from '@beaver/shell-conda';
import { ShellFlow } from '@beaver/shell-flow';
import { BinModule } from './bin-module';

export class LLVM extends BinModule {
  constructor(ctx: ShellFlow) {
    super('llvm', ctx);
  }

  override async install(): Promise<void> {
    if (isDarwin) {
      await new ShellConda({
        home: this._ctx.homeDir,
        run: 'brew install llvm',
      }).run();
    } else {
      await new ShellConda({
        home: this._ctx.homeDir,
        run: 'conda install -y -c conda-forge llvm',
      }).run();
    }
  }

  override async installed(): Promise<boolean> {
    const { bin } = this._ctx;

    if (this.isInstalled) {
      return true;
    }

    let groupName;

    if (isDarwin) {
      groupName = 'brew';
    } else {
      groupName = 'conda';
    }

    this.isInstalled = await bin.checkIsInstalled('llvm', groupName);

    return this.isInstalled;
  }

  override async uninstall(): Promise<void> {
    await new ShellConda({
      home: this._ctx.homeDir,
      run: 'conda remove -y llvm',
    }).run();
    this.isInstalled = false;
  }
}
