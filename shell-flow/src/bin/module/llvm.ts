import { isDarwin } from '@beaver/arteffix-utils';
import { ShellFlow } from '@beaver/shell-flow';
import { BinModule } from './bin-module';

export class LLVM extends BinModule {
  constructor(ctx: ShellFlow) {
    super('llvm', ctx);
  }

  override async install(): Promise<void> {
    if (isDarwin) {
      await this.shell.run({
        message: 'brew install llvm',
      });
    } else {
      await this.shell.run({
        message: 'conda install -y -c conda-forge llvm',
      });
    }
  }

  override async installed(): Promise<boolean> {
    const { bin } = this._ctx;

    let groupName;

    if (isDarwin) {
      groupName = 'brew';
    } else {
      groupName = 'conda';
    }

    return await bin.checkIsInstalled('llvm', groupName);
  }

  override async uninstall(): Promise<void> {
    await this.shell.run({
      message: 'conda remove -y llvm',
    });
  }
}
