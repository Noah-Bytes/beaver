import { EventBus } from '@beaver/arteffix-utils';
import EventEmitter from 'events';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { Logger } from 'winston';
import { AppManager } from './app';
import { Bin } from './bin';
import { createLogger } from './logger';
import { ShellManager } from './shell/shell-manager';
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
  shell: ShellManager;
  eventBus: EventBus = new EventBus(new EventEmitter(), 'shell-flow');
  readonly appName: string;
  homeDir: string;
  readonly systemInfo: SystemInfo;
  readonly logger: Logger;
  readonly options?: IShellFlowOptionsTypes;
  private _init: boolean = false;
  private readonly mirror: Record<string, string>;

  constructor(appName: string, options?: IShellFlowOptionsTypes) {
    this.homeDir = options?.homeDir || os.homedir();
    this.appName = appName;
    this.options = options;
    this.mirror = options?.mirror || {};

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

    this.logger.info('开始初始化 bin');
    await this.bin.init();
    this.logger.info('开始初始化 app');
    await this.app.init();

    this._init = true;
  }

  destroy(): Promise<void> {
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
