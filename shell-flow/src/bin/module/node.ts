import { IBinModuleTypes } from '../../types/bin-types';
import { ShellFlow } from '@beaver/shell-flow';
import { IShellTypes } from '../../types/shell-types';
import * as decompress from 'decompress';
import * as path from 'path';

// @ts-ignore
const _decompress = decompress as unknown as typeof decompress.default;

interface PlatformUrls {
  [key: string]: {
    x64?: string;
    arm64?: string;
  };
}

export class Node implements IBinModuleTypes {
  static URLS: PlatformUrls = {
    darwin: {
      x64: 'https://nodejs.org/dist/v18.16.0/node-v18.16.0-darwin-x64.tar.gz',
      arm64:
        'https://nodejs.org/dist/v18.16.0/node-v18.16.0-darwin-arm64.tar.gz',
    },
    win32: {
      x64: 'https://nodejs.org/dist/v18.16.0/node-v18.16.0-win-x64.zip',
    },
    linux: {
      x64: 'https://nodejs.org/dist/v18.16.0/node-v18.16.0-linux-x64.tar.gz',
      arm64:
        'https://nodejs.org/dist/v18.16.0/node-v18.16.0-linux-arm64.tar.gz',
    },
  };
  private readonly _ctx: ShellFlow;
  readonly shell: IShellTypes;

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('node');
  }

  async install(): Promise<void> {
    const { systemInfo, bin } = this._ctx;

    if (!Node.URLS[systemInfo.platform]) {
      throw new Error(
        `Current platform is not supported: ${systemInfo.platform}`,
      );
    }

    const url = Node.URLS[systemInfo.platform][systemInfo.arch];

    if (!url) {
      throw new Error(`Current platform is not supported: ${systemInfo.arch}`);
    }

    const fileName = path.basename(url);
    const downloadPath = bin.absPath(fileName);

    await bin.download(url, fileName);

    try {
      await _decompress(downloadPath, bin.absPath('node'), { strip: 1 });

      await bin.rm(fileName);
    } catch (e) {
      throw new Error(`Failed to decompress ${fileName}`);
    }
  }

  installed(): boolean | Promise<boolean> {
    const { bin } = this._ctx;
    return bin.exists('node');
  }

  async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await bin.rm('node');
  }
}
