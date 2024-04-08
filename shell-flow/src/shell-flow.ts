import {
  IShellFlowOptionsTypes,
  IShellFlowTypes,
} from './types/shell-flow-types';
import { Bin } from './bin';
import { SystemInfo } from './system-info';
import { ShellManager } from './shell/shell-manager';
import { Api } from './api';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from 'winston';
import { createLogger } from './logger';

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
  api: Api;
  shell: ShellManager;
  readonly appName: string;
  readonly homeDir: string;
  readonly systemInfo: SystemInfo;
  readonly logger: Logger;
  readonly options?: IShellFlowOptionsTypes;

  constructor(
    appName: string,
    homeDir: string,
    options?: IShellFlowOptionsTypes,
  ) {
    this.homeDir = homeDir;
    this.appName = appName;
    this.options = options;

    this.logger = createLogger('shell-flow');

    this.systemInfo = new SystemInfo();
    this.shell = new ShellManager(this);
    this.bin = new Bin(this);
    this.api = new Api(this);
  }

  async changeHomeDir(dir: string) {}

  async init(): Promise<void> {
    await this.systemInfo.init();
    await this.bin.init();
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
  }

  absPath(...arg: string[]): string {
    return path.resolve(this.homeDir, ...arg);
  }
}
