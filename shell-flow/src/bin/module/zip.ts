import { isWin32 } from '@beaver/arteffix-utils';
import { ShellFlow } from '@beaver/shell-flow';
import { BinModule } from './bin-module';

export class Zip extends BinModule {
  private readonly packageName: string;

  constructor(ctx: ShellFlow) {
    super('zip', ctx);
    this.packageName = isWin32 ? '7zip' : 'p7zip';
  }

  override async install(): Promise<void> {
    await this.shell.run({
      message: `conda install -y -c conda-forge ${this.packageName}`,
    });
  }

  override async installed(): Promise<boolean> {
    const { bin } = this._ctx;
    return await bin.checkIsInstalled(this.packageName, 'conda');
  }

  override async uninstall(): Promise<void> {
    await this.shell.run({
      message: `conda remove -y ${this.packageName}`,
    });
  }
}
