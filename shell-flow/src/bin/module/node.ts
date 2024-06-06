import { ActionFs } from '@beaver/action-fs';
import { ShellFlow } from '@beaver/shell-flow';
import decompress from 'decompress';
import path from 'path';
import { BinModule } from './bin-module';

// @ts-ignore
const _decompress = decompress as unknown as typeof decompress.default;

interface PlatformUrls {
  [key: string]: {
    x64?: string;
    arm64?: string;
  };
}

export class Node extends BinModule {
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

  constructor(ctx: ShellFlow) {
    super('node', ctx);
  }

  override async install(): Promise<void> {
    const { systemInfo, bin, homeDir } = this._ctx;

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
    await bin.download(url, fileName);

    const actionFs = new ActionFs({
      home: homeDir,
      type: 'decompress',
      file: fileName,
      path: 'bin',
      output: 'node',
      strip: 1,
    });
    await actionFs.run();
    await bin.rm(fileName);
  }

  override installed(): boolean | Promise<boolean> {
    const { bin } = this._ctx;
    return bin.exists('node');
  }

  override async uninstall(): Promise<void> {
    const { bin } = this._ctx;
    await bin.rm('node');
  }
}
