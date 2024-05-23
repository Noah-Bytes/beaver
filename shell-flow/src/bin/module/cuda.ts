import { isWin32 } from '@beaver/arteffix-utils';
import { ShellFlow } from '@beaver/shell-flow';
import { BinModule } from './bin-module';

export class Cuda extends BinModule {
  constructor(ctx: ShellFlow) {
    super('cuda', ctx);
  }

  override async install(): Promise<void> {
    if (isWin32) {
      await this.shell.run({
        message: 'conda install -y cudnn libzlib-wapi -c conda-forge',
      });

      await this.shell.run({
        message: 'conda install -y cuda -c nvidia/label/cuda-12.1.0',
      });
    } else {
      await this.shell.run({
        message: 'conda install -y cudnn -c conda-forge',
      });
      await this.shell.run({
        message: 'conda install -y cuda -c nvidia/label/cuda-12.1.0',
      });
    }
  }

  override async installed(): Promise<boolean> {
    const { bin } = this._ctx;

    const cudnn = await bin.checkIsInstalled('cudnn', 'conda');
    const cuda = await bin.checkIsInstalled('cuda', 'conda');

    if (isWin32) {
      const libzlib = await bin.checkIsInstalled('libzlib-wapi', 'conda');
      return cudnn && cuda && libzlib;
    }

    return cudnn && cuda;
  }

  override async uninstall(): Promise<void> {
    await this.shell.run({
      message: 'conda remove -y cudnn cuda',
    });
  }
}
