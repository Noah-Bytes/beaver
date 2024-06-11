import { ShellFlow } from '@beaver/shell-flow';
import decompress from 'decompress';
import { BinModule } from './bin-module';

// @ts-ignore
const _decompress = decompress as unknown as typeof decompress.default;

export class Brew extends BinModule {
  static DOWNLOAD_URL =
    'https://github.com/cocktailpeanut/bin/releases/download/homebrew/homebrew.zip';

  constructor(ctx: ShellFlow) {
    super('brew', ctx);
  }

  override async install(): Promise<void> {
    const { bin } = this._ctx;
    const fileName = 'homebrew.zip';

    await bin.download(Brew.DOWNLOAD_URL, fileName);

    try {
      await _decompress(bin.absPath(fileName), bin.dir, { strip: 1 });
      await this.run('xcode-select --install');
      await this.run('brew install gettext --force-bottle');

      await bin.rm(fileName);
    } catch (e) {
      throw new Error(`Failed to decompress ${fileName}`);
    }
  }

  override installed(): boolean {
    const { bin } = this._ctx;

    if (this.isInstalled) {
      return true;
    }

    this.isInstalled = bin.exists('homebrew');

    return this.isInstalled;
  }

  override async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await bin.rm('homebrew');
  }
}
