import fs from 'fs';
import os from 'os';
import path from 'path';
import process from 'process';
import stream from 'stream';
import { AppManager } from './app';
import { Bin } from './bin';
import { SystemInfo } from './system-info';
import { IShellFlowOptionsTypes, IShellFlowTypes } from './types';

export class ShellFlow implements IShellFlowTypes {
  static CACHE_FOLDERS = [
    'HF_HOME',
    'TORCH_HOME',
    'HOMEBREW_CACHE',
    'XDG_CACHE_HOME',
    'PIP_CACHE_DIR',
    'PIP_TMPDIR',
    'TMPDIR',
    'TEMP',
    'TMP',
    'XDG_DATA_HOME',
    'XDG_CONFIG_HOME',
    'XDG_STATE_HOME',
    'GRADIO_TEMP_DIR',
  ];
  bin: Bin;
  app: AppManager;
  homeDir: string;
  readonly appName: string;
  readonly systemInfo: SystemInfo;
  readonly options?: IShellFlowOptionsTypes;
  readonly errStream;
  readonly outStream;
  private _init: boolean = false;
  private readonly mirror: Record<string, string>;

  constructor(appName: string, options?: IShellFlowOptionsTypes) {
    this.homeDir = options?.homeDir || os.homedir();
    this.appName = appName;
    this.options = options;
    this.mirror = options?.mirror || {};
    this.systemInfo = new SystemInfo();

    this.bin = new Bin(this);
    this.app = new AppManager(this);

    this.errStream = options?.errStream || <stream.Writable>process.stderr;
    this.outStream = options?.outStream || <stream.Writable>process.stdout;
  }

  async changeHomeDir(dir: string) {}

  async initCacheDir() {
    try {
      // 文件目录初始化
      if (this.homeDir) {
        await fs.promises.mkdir(this.homeDir, { recursive: true });
        for (let folder of ShellFlow.CACHE_FOLDERS) {
          await fs.promises.mkdir(path.resolve(this.homeDir, 'cache', folder), {
            recursive: true,
          });
        }
      }
    } catch (e) {
      this.errStream.write('cache dir initialization failed');
    }
  }

  async init(): Promise<void> {
    if (this._init) {
      throw new Error('shell-flow already initialized');
    }

    await this.systemInfo.init();

    await this.initCacheDir();

    await this.bin.init();
    this.outStream.write('bin initialization success');

    await this.app.init();
    this.outStream.write('app initialization success');

    this._init = true;
  }

  destroy(): Promise<void> {
    this.outStream.write('shellFlow destroy!');
    return Promise.resolve(undefined);
  }

  absPath(...arg: string[]): string {
    if (this.homeDir) {
      return path.resolve(this.homeDir, ...arg);
    }
    throw new Error('homeDir is not set');
  }

  mirrorUrl(url: string): string {
    for (let mirrorKey in this.mirror) {
      if (url.includes(mirrorKey)) {
        return url.replace(new RegExp(mirrorKey, 'gm'), this.mirror[mirrorKey]);
      }
    }

    return url;
  }
}
