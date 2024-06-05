import { safeAccessSync } from '@beaver/arteffix-utils';
import { MetaFile } from '@beaver/kernel';
import {
  IAppMeta,
  IAppMetaUpdate,
  IAppTypes,
  ShellFlow,
  createLogger,
  loader,
  requireImage,
} from '@beaver/shell-flow';
import {
  IShellApp,
  IShellAppMeta,
  IShellAppRun,
  IShellAppRunParams,
} from '@beaver/types';
import fs from 'fs-extra';
import git, { ReadCommitResult } from 'isomorphic-git';
import * as pty from 'node-pty';
import path from 'path';
import { Logger } from 'winston';
import { Shell } from '../shell/shell';

type IPty = pty.IPty;

export class App implements IAppTypes {
  static STATUS = {
    INIT: 0,
    INSTALLED: 1,
    INSTALLING: 2,
    STARTING: 3,
    STARTED: 4,
    STOPPING: 5,
    STOPPED: 6,
    INSTALL_ERROR: 7,
    START_ERROR: 8,
  };

  readonly name: string;
  readonly git: string;

  private meta: IAppMeta | undefined;
  private readonly dir: string;

  private readonly _ctx: ShellFlow;
  private readonly logger: Logger;
  private shell: Shell;

  constructor(name: string, git: string, ctx: ShellFlow) {
    const { app } = ctx;
    this.dir = app.absPath(name);
    this._ctx = ctx;
    this.name = name;
    this.git = git;
    this.logger = createLogger(`app:${name}`);
    this.shell = new Shell(`app/${this.name}`, 'app', ctx);

    ['start', 'install', 'update'].forEach((elem) => {
      const outputStream = fs.createWriteStream(this.absPath(elem + '.log'), {
        flags: 'a',
      });
      ctx.eventBus.on([name, elem].join(':'), function (data) {
        outputStream.write(data);
      });
    });
  }

  readLog(name: string): Promise<string> {
    return fs.readFile(this.absPath(name + '.log'), 'utf8');
  }

  async init() {
    if (this.meta) {
      throw new Error(`${this.name} is already initialized.`);
    }

    if (!this.exists(MetaFile.META_NAME)) {
      const appInfo = (await this.load('beaver.js')) as IShellAppMeta;
      if (appInfo.icon) {
        appInfo.icon =
          `data:image/*;base64,` +
          (await requireImage(`${this.dir}/${appInfo.icon}`));
      }

      // @ts-ignore
      this.meta = {
        ...appInfo,
        name: this.name,
        git: this.git,
        status: App.STATUS.INIT,
      };

      await this.saveMetadata();
    } else {
      await this.getMeta();
    }
  }

  async getMeta(): Promise<IAppMeta> {
    let m = this.meta;
    if (!m) {
      m = await this.readMetaData();
    }

    this.meta = m;

    if (m) {
      return {
        ...m,
        dir: this.dir,
      };
    }

    throw new Error('meta not');
  }

  absPath(...arg: string[]): string {
    return path.resolve(this.dir, ...arg);
  }

  exists(...p: string[]): boolean {
    const path = this.absPath(...p);
    return fs.pathExistsSync(path);
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
    if (!this.meta) {
      throw new Error(`${this.name} is not initialized`);
    }

    await this.updateMeta({
      status: App.STATUS.INSTALLING,
    });

    const { bin } = this._ctx;
    const { install } = this.meta;

    try {
      if (install) {
        const sh = (await this.load(install)) as IShellApp;

        if (sh.requires) {
          await bin.install(sh.requires);
        }

        if (sh.run) {
          await this._runs(sh.run);
        }

        await this.updateMeta({
          status: App.STATUS.INSTALLED,
        });
      } else {
        await this.updateMeta({
          status: App.STATUS.INSTALL_ERROR,
        });
        // 安装脚本不存在
        this.logger.warn('the installation script does not exist');
      }
    } catch (e) {
      await this.updateMeta({
        status: App.STATUS.INSTALL_ERROR,
      });
      this.logger.error(e);
      throw new Error(`Failed to install ${this.name}`);
    }
  }

  async unInstall(): Promise<void> {
    if (!this.meta) {
      throw new Error(`${this.name} is not initialized`);
    }

    await this.stop();

    const { unInstall } = this.meta!;

    try {
      if (unInstall) {
        const sh = (await this.load(unInstall)) as IShellApp;
        if (sh.run) {
          await this.stop();
          await this._runs(sh.run);
        }

        await this.updateMeta({
          status: App.STATUS.INIT,
        });
      } else {
        // 安装脚本不存在
        this.logger.warn('the installation script does not exist');
      }
    } catch (e) {
      this.logger.error(e);
      throw new Error(`Failed to install ${this.name}`);
    }
  }

  parseMessage(params: IShellAppRunParams): string | string[] {
    let message: string | string[] = '';

    if (params.messageFn) {
      const { systemInfo, options } = this._ctx;
      message = params.messageFn({
        platform: systemInfo.platform,
        gpu: systemInfo.GPU,
        mirror: options?.isMirror,
      });
    } else if (params.message) {
      message = params.message;
    }

    return message;
  }

  async start(): Promise<void> {
    const { start } = this.meta!;
    if (start) {
      await this.updateMeta({
        status: App.STATUS.STARTING,
      });
      const sh = (await this.load(start)) as IShellApp;

      if (sh.run) {
        for (let runParam of sh.run) {
          runParam.params.message = this.parseMessage(runParam.params);
          if (runParam.params.path) {
            runParam.params.path = this.absPath(runParam.params.path);
          }

          await this.shell.execute(runParam.params, {
            cwd: this.dir,
            path: runParam.params.path,
            env: runParam.params.env,
          });
        }
      }

      await this.updateMeta({
        status: App.STATUS.STARTED,
      });
    } else {
      await this.updateMeta({
        status: App.STATUS.START_ERROR,
      });
      // 脚本不存在
      throw new Error('the start script does not exist');
    }
  }

  async stop(): Promise<void> {
    const { shell } = this._ctx;
    await this.updateMeta({
      status: App.STATUS.STOPPED,
    });
    shell.removeAllShell(this.name);
    this.shell.getPty().kill();
    await fs.truncate(this.absPath('start.log'), 0);
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

  logs(): Promise<ReadCommitResult[]> {
    return git.log({
      fs,
      dir: this.absPath('app'),
      depth: 50,
    });
  }

  async saveMetadata(): Promise<boolean> {
    await fs.writeJson(this.absPath(MetaFile.META_NAME), this.meta);
    return true;
  }

  async readMetaData(): Promise<IAppMeta | undefined> {
    safeAccessSync(this.absPath());
    try {
      this.meta = await fs.readJson(this.absPath(MetaFile.META_NAME));
    } catch (e) {
      await fs.rm(this.absPath(MetaFile.META_NAME));
      await this.init();
    }
    return this.meta;
  }

  async updateMeta(meta: IAppMetaUpdate): Promise<void> {
    if (!this.meta) {
      throw new Error(`${this.name} not initialized`);
    }
    this.meta = {
      ...this.meta,
      ...meta,
      lastModified: Date.now(),
    };
    await this.saveMetadata();
  }
}
