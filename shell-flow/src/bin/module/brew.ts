import decompress from 'decompress';
import { IBinModuleTypes } from '@beaver/shell-flow';

// @ts-ignore
const _decompress = decompress as unknown as typeof decompress.default;

export class Brew implements IBinModuleTypes {
  static DOWNLOAD_URL =
    'https://github.com/cocktailpeanut/bin/releases/download/homebrew/homebrew.zip';

  private readonly _ctx: any;
  readonly shell: any;

  constructor(ctx: any) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('brew');
  }

  async install(): Promise<void> {
    const { bin } = this._ctx;
    const fileName = 'homebrew.zip';

    await bin.download(Brew.DOWNLOAD_URL, fileName);

    try {
      await _decompress(bin.absPath(fileName), bin.dir, { strip: 1 });

      await this.shell.run({
        message: 'xcode-select --install',
      });

      await this.shell.run({
        message: 'brew install gettext --force-bottle',
      });

      await bin.rm(fileName);
    } catch (e) {
      throw new Error(`Failed to decompress ${fileName}`);
    }
  }

  installed(): boolean {
    const { bin } = this._ctx;

    return bin.exists('homebrew');
  }

  async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await bin.rm('homebrew');
  }

  env(): { [p: string]: any } | undefined {
    const { bin } = this._ctx;
    return {
      PATH: ['homebrew/bin', 'homebrew/Cellar'].map((p) => {
        return bin.absPath(p);
      }),
      HOMEBREW_PREFIX: bin.absPath('homebrew'),
      HOMEBREW_CELLAR: bin.absPath('homebrew', 'Cellar'),
      HOMEBREW_REPOSITORY: bin.absPath('homebrew'),
      HOMEBREW_CACHE: bin.absPath('homebrew', 'cache'),
    };
  }
}
