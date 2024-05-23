import {
  createLogger,
  loader,
  requireImage,
  ShellFlow,
} from '@beaver/shell-flow';
import { IShellApp, IShellAppMeta, IShellAppRun } from '@beaver/types';
import fs from 'fs';
import git, { ReadCommitResult } from 'isomorphic-git';
import path from 'path';
import { Logger } from 'winston';
import { IAppMeta, IAppTypes } from '../types/app-types';

export class App implements IAppTypes {
  static STATUS = {
    INIT: 0,
    INSTALLED: 1,
    INSTALLING: 2,
    STARTING: 3,
    STARTED: 4,
    STOPPING: 5,
    STOPPED: 6,
    ERROR: 7,
  };

  readonly name: string;
  readonly git: string;

  private meta: IShellAppMeta | undefined;
  private readonly dir: string;
  status: number = App.STATUS.INIT;
  private _init: boolean = false;

  private readonly _ctx: ShellFlow;
  private readonly logger: Logger;

  constructor(name: string, git: string, ctx: ShellFlow) {
    const { app } = ctx;
    this.dir = app.absPath(name);
    this._ctx = ctx;
    this.name = name;
    this.git = git;
    this.logger = createLogger(`app:${name}`);
    ctx.eventBus.on([name, 'start'].join(':'), function (data: string) {
      ctx.options?.start?.(name, data);
    });
    ctx.eventBus.on([name, 'install'].join(':'), function (data: string) {
      ctx.options?.install?.(name, data);
    });
    ctx.eventBus.on([name, 'update'].join(':'), function (data: string) {
      ctx.options?.update?.(name, data);
    });
  }

  isInit() {
    return this._init;
  }

  async init() {
    if (this.isInit()) {
      throw new Error(`${this.name} is already initialized.`);
    }

    const appInfo = (await this.load('beaver.js')) as IShellAppMeta;

    if (appInfo.icon) {
      appInfo.icon =
        `data:image/*;base64,` +
        (await requireImage(`${this.dir}/${appInfo.icon}`));
    }

    if (appInfo.isInstalled && appInfo.isInstalled(this)) {
      this.status = App.STATUS.INSTALLED;
    }

    this.meta = appInfo;
    this._init = true;
  }

  getMeta(): IAppMeta {
    if (!this.isInit()) {
      throw new Error(`${this.name} not initialized`);
    }

    return {
      name: this.name,
      title: this.meta?.title,
      description: this.meta?.description,
      icon: this.meta?.icon,
      status: this.status,
      git: this.git,
      dir: this.dir,
    };
  }

  absPath(...arg: string[]): string {
    return path.resolve(this.dir, ...arg);
  }

  exists(...p: string[]): boolean {
    try {
      fs.accessSync(this.absPath(...p), fs.constants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  async load(filename: string): Promise<any> {
    const { systemInfo } = this._ctx;
    const p = this.absPath(filename);
    const m: any = (await loader(p)).resolved;
    if (m) {
      if (m.constructor.name === 'AsyncFunction') {
        return await m({
          platform: systemInfo.platform,
          arch: systemInfo.arch,
        });
      } else if (m.constructor.name === 'Function') {
        return m({ platform: systemInfo.platform, arch: systemInfo.arch });
      }
    }
    return m;
  }

  private _method(method: string) {
    const chunks = method.split('.');
    if (chunks[0] === 'beaver') {
      let m: any = this._ctx;
      let mPath = chunks.slice(1, -1);
      let mMethod = chunks[chunks.length - 1];

      for (let i = 0; i < mPath.length; i++) {
        m = m[mPath[i]];
      }

      method = m[mMethod].bind(m);
      return method;
    }

    const { app } = this._ctx;

    if (chunks.length === 2) {
      let name = chunks[0];
      const m = app.getModule(name);
      if (m) {
        return m[chunks[1]].bind(m);
      }
    }
  }

  private async _runs(runParams: IShellAppRun[]) {
    for (let runParam of runParams) {
      const method = this._method(runParam.method);
      if (method) {
        if (runParam.params.path) {
          runParam.params.path = this.absPath(runParam.params.path);
        }

        await method(
          {
            cwd: this.dir,
            git: this.git,
            ...runParam.params,
          },
          this,
        );
      } else {
        throw new Error(`method ${runParam.method} not found`);
      }
    }
  }

  async install() {
    if (!this.isInit()) {
      throw new Error(`${this.name} is not initialized`);
    }

    this.status = App.STATUS.INSTALLING;

    const { bin } = this._ctx;
    const { install } = this.meta!;

    try {
      if (install) {
        const sh = (await this.load(install)) as IShellApp;

        if (sh.requires) {
          await bin.install(sh.requires);
        }

        if (sh.run) {
          await this._runs(sh.run);
        }

        this.status = App.STATUS.INSTALLED;
      } else {
        this.status = App.STATUS.INIT;
        // 安装脚本不存在
        this.logger.warn('the installation script does not exist');
      }
    } catch (e) {
      this.status = App.STATUS.INIT;
      this.logger.error(e);
      throw new Error(`Failed to install ${this.name}`);
    }
  }

  async unInstall(): Promise<void> {
    if (!this.isInit()) {
      throw new Error(`${this.name} is not initialized`);
    }

    await this.stop();

    const oldStatus = this.status;

    this.status = App.STATUS.INIT;
    const { unInstall } = this.meta!;

    try {
      if (unInstall) {
        const sh = (await this.load(unInstall)) as IShellApp;
        if (sh.run) {
          await this._runs(sh.run);
        }

        this.status = App.STATUS.INSTALLED;
      } else {
        this.status = oldStatus;
        // 安装脚本不存在
        this.logger.warn('the installation script does not exist');
      }
    } catch (e) {
      this.status = oldStatus;
      this.logger.error(e);
      throw new Error(`Failed to install ${this.name}`);
    }
  }

  async start(): Promise<void> {
    const oldStatus = this.status;

    this.status = App.STATUS.STARTING;

    const { start } = this.meta!;

    if (start) {
      const sh = (await this.load(start)) as IShellApp;

      if (sh.run) {
        await this._runs(sh.run);
      }

      this.status = App.STATUS.STARTED;
    } else {
      this.status = oldStatus;
      // 脚本不存在
      throw new Error('the start script does not exist');
    }
  }

  async stop(): Promise<void> {
    const { shell } = this._ctx;
    this.status = App.STATUS.STOPPED;
    shell.removeAllShell(this.name);
  }

  async update(): Promise<void> {
    const { update } = this.meta!;

    if (update) {
      const sh = (await this.load(update)) as IShellApp;

      if (sh.run) {
        await this._runs(sh.run);
      }
    } else {
      // 脚本不存在
      throw new Error('the start script does not exist');
    }
  }

  async logs(): Promise<ReadCommitResult[]> {
    let commits = await git.log({
      fs,
      dir: this.absPath('app'),
      depth: 50,
    });

    return commits;
  }
}
