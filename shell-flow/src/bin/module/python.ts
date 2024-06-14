import { ActionFs } from '@beaver/action-fs';
import { ShellFlow } from '@beaver/shell-flow';
import * as decompress from 'decompress';
import * as fs from 'fs';
import * as path from 'path';
import { BinModule } from './bin-module';

// @ts-ignore
const _decompress = decompress as unknown as typeof decompress.default;

interface PlatformUrls {
  [key: string]: {
    x64?: string;
    arm64?: string;
  };
}

export class Python extends BinModule {
  static URLS: PlatformUrls = {
    darwin: {
      x64: 'https://github.com/indygreg/python-build-standalone/releases/download/20220802/cpython-3.10.6%2B20220802-x86_64-apple-darwin-install_only.tar.gz',
      arm64:
        'https://github.com/indygreg/python-build-standalone/releases/download/20220802/cpython-3.10.6%2B20220802-aarch64-apple-darwin-install_only.tar.gz',
    },
    win32: {
      x64: 'https://github.com/indygreg/python-build-standalone/releases/download/20220802/cpython-3.10.6%2B20220802-x86_64-pc-windows-msvc-shared-install_only.tar.gz',
    },
    linux: {
      x64: 'https://github.com/indygreg/python-build-standalone/releases/download/20220802/cpython-3.10.6%2B20220802-x86_64-unknown-linux-gnu-install_only.tar.gz',
      arm64:
        'https://github.com/indygreg/python-build-standalone/releases/download/20220802/cpython-3.10.6%2B20220802-aarch64-unknown-linux-gnu-install_only.tar.gz',
    },
  };

  constructor(ctx: ShellFlow) {
    super('python', ctx);
  }

  override async install(): Promise<void> {
    const { systemInfo, bin, homeDir } = this._ctx;

    if (!Python.URLS[systemInfo.platform]) {
      throw new Error(
        `Current platform is not supported: ${systemInfo.platform}`,
      );
    }

    const url = Python.URLS[systemInfo.platform][systemInfo.arch];

    if (!url) {
      throw new Error(`Current platform is not supported: ${systemInfo.arch}`);
    }

    const fileName = path.basename(url);

    await fs.promises.mkdir(bin.dir, { recursive: true });
    await bin.download(url, fileName);

    const actionFs = new ActionFs({
      home: homeDir,
      type: 'decompress',
      file: fileName,
      path: 'bin',
      output: 'python',
      strip: 1,
    });
    await actionFs.run();

    await bin.rm(fileName);
  }

  override installed(): boolean {
    const { bin } = this._ctx;
    if (this.isInstalled) {
      return true;
    }
    this.isInstalled = bin.exists('python');
    return this.isInstalled;
  }

  override async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await bin.rm('python');
  }
}
