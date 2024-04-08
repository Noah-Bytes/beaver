import type { IBinModuleTypes } from '../types/bin-types';
import { IShellTypes } from '../types/shell-types';
import { ShellFlow } from '@beaver/shell-flow';
import * as path from 'path';
import * as decompress from 'decompress';
import * as fs from 'fs';

interface PlatformUrls {
  [key: string]: {
    x64?: string;
    arm64?: string;
  };
}

export class Python implements IBinModuleTypes {
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

  private readonly _ctx: ShellFlow;
  readonly shell: IShellTypes;

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('python');
  }

  async install(): Promise<void> {
    const { systemInfo, bin } = this._ctx;

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
    const downloadPath = bin.absPath(fileName);

    await fs.promises.mkdir(bin.dir, { recursive: true });
    await bin.download(url, fileName);

    try {
      const pythonPath = bin.absPath('python');
      bin.logger.info(`decompressing to ${pythonPath}`);
      await decompress(downloadPath, pythonPath, { strip: 1 });

      bin.logger.info(`remove the compressed file ${downloadPath}`);
      await fs.promises.rm(downloadPath);
    } catch (e) {
      bin.logger.error(e);
    }
  }

  installed(): boolean {
    const { bin } = this._ctx;
    return bin.exists('python');
  }

  async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await bin.rm('python');
    bin.logger.info('remove python');
  }
}
