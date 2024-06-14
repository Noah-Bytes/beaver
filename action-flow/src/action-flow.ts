import { Core } from '@beaver/action-core';
import { ShellConda } from '@beaver/shell-conda';
import { IShellFlowOptionsTypes } from '@beaver/shell-flow';
import * as path from 'path';
import { AppManager } from './app/app-manager';

export class ActionFlow {
  core: Core;
  app: AppManager;
  options: IShellFlowOptionsTypes;

  constructor(appName: string, options: IShellFlowOptionsTypes) {
    this.options = options;
    this.core = new Core(appName, options);
    this.app = new AppManager(this);
  }

  async init() {
    await this.app.init();
  }

  absPath(...arg: string[]): string {
    if (this.options.homeDir) {
      return path.resolve(this.options.homeDir, ...arg);
    }
    throw new Error('homeDir is not set');
  }

  async destroy() {}

  condaEnvironment() {
    const conda = new ShellConda({
      home: this.options.homeDir,
      run: 'conda list',
    });

    return conda.isInstall();
  }
}
