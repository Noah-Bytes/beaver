import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Logger } from 'winston';
import { AppManager } from './app';
import { Bin } from './bin';
import { createLogger } from './logger';
import { ShellManager } from './shell/shell-manager';
import { SystemInfo } from './system-info';
import {
  IShellFlowOptionsTypes,
  IShellFlowTypes,
} from './types/shell-flow-types';

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
  shell: ShellManager;
  readonly appName: string;
  homeDir: string;
  readonly systemInfo: SystemInfo;
  readonly logger: Logger;
  readonly options?: IShellFlowOptionsTypes;
  private _init: boolean = false;

  constructor(appName: string, options?: IShellFlowOptionsTypes) {
    this.homeDir = options?.homeDir || os.homedir();
    this.appName = appName;
    this.options = options;

    this.logger = createLogger('shell-flow');
    this.systemInfo = new SystemInfo();

    this.shell = new ShellManager(this);
    this.bin = new Bin(this);
    this.app = new AppManager(this);
  }

  async changeHomeDir(dir: string) {}

  async init(): Promise<void> {
    if (this._init) {
      throw new Error('shell-flow already initialized');
    }

    await this.systemInfo.init();
    await this.bin.init();
    await this.app.init();

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
      this.logger.error(`initialization failed`);
      this.logger.error(e);
    }

    this._init = true;
  }

  absPath(...arg: string[]): string {
    if (this.homeDir) {
      return path.resolve(this.homeDir, ...arg);
    }
    throw new Error('homeDir is not set');
  }
}
