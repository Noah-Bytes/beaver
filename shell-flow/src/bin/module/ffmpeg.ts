import { ShellFlow } from '@beaver/shell-flow';
import { BinModule } from './bin-module';
import {ShellConda} from "@beaver/shell-conda";

export class Ffmpeg extends BinModule {
  constructor(ctx: ShellFlow) {
    super('ffmpeg', ctx);
  }

  override async install(): Promise<void> {
    await new ShellConda({
      home: this._ctx.homeDir,
      run: 'conda install -y -c conda-forge ffmpeg',
    }).run();
  }

  override async installed(): Promise<boolean> {
    const { bin } = this._ctx;
    return bin.checkIsInstalled('ffmpeg', 'conda');
  }

  override async uninstall(): Promise<void> {
    await new ShellConda({
      home: this._ctx.homeDir,
      run: 'conda remove -y ffmpeg',
    }).run();
  }
}
