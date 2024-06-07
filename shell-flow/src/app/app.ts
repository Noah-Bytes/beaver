import { safeAccessSync } from '@beaver/arteffix-utils';
import { MetaFile } from '@beaver/kernel';
import { ShellConda } from '@beaver/shell-conda';
import {
  IAppMeta,
  IAppMetaUpdate,
  IAppTypes,
  IStep,
  ShellFlow,
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
import { Directory } from '../directory';

export class App extends Directory<any> implements IAppTypes {
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
  static STEP_STATUS = {
    INIT: 0,
    SUCCESS: 1,
    ERROR: 2,
    SKIP: 3,
  };

  steps: IStep[] = [];

  readonly name: string;
  readonly git: string;
  private runner: ShellConda | undefined;

  private meta: IAppMeta | undefined;

  private readonly _ctx: ShellFlow;

  constructor(name: string, git: string, ctx: ShellFlow) {
    super(ctx.app.absPath(name));
    this._ctx = ctx;
    this.name = name;
    this.git = git;
  }

  readLog(name: string): Promise<string> {
    return fs.readFile(this.absPath(name + '.log'), 'utf8');
  }

  setSteps(runs: IShellAppRun[]) {
    this.meta!.steps = runs.map((run) => {
      run.params.message = this.parseMessage(run.params);
      delete run.params.messageFn;
      return {
        status: App.STEP_STATUS.INIT,
        run,
      };
    });
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
        steps: [],
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

  parseMessage(params: IShellAppRunParams): string | string[] {
    let message: string | string[] = '';

    if (params.messageFn) {
      const { systemInfo, options } = this._ctx;
      message = params.messageFn({
        platform: systemInfo.platform,
        gpu: systemInfo.GPU,
        mirror: !!options?.mirror,
      });
    } else if (params.message) {
      message = params.message;
    }

    return message;
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

  private async _runs() {
    for (let step of this.meta!.steps) {
      if (step.status !== App.STEP_STATUS.INIT) {
        continue;
      }

      const runParam = step.run;
      const method = this._method(runParam.method);
      if (method) {
        if (runParam.params.path) {
          runParam.params.path = this.absPath(runParam.params.path);
        }

        try {
          // TODO 这里目前只涉及 shell.execute shell.run shell模块的两种方法，其他模块，暂不涉及
          // 因为涉及到kill操作
          this.runner = await method({
            cwd: this.dir,
            git: this.git,
            ...runParam.params,
          });
          if (this.runner?.run) {
            await this.runner?.run();
          }
          step.status = App.STEP_STATUS.SUCCESS;
        } catch (e: any) {
          step.status = App.STEP_STATUS.ERROR;
          step.message = e.message;
        }
      } else {
        const msg = `method ${runParam.method} not found`;
        step.status = App.STEP_STATUS.ERROR;
        step.message = msg;
        throw new Error(msg);
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
          this.setSteps(sh.run);
          await this._runs();
        }

        await this.updateMeta({
          status: App.STATUS.INSTALLED,
        });
      } else {
        await this.updateMeta({
          status: App.STATUS.INSTALL_ERROR,
        });
      }
    } catch (e) {
      await this.updateMeta({
        status: App.STATUS.INSTALL_ERROR,
      });
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
          this.setSteps(sh.run);
          await this._runs();
        }

        await this.updateMeta({
          status: App.STATUS.INIT,
        });
      } else {
      }
    } catch (e) {
      console.log(e);
      throw new Error(`Failed to unInstall ${this.name}`);
    }
  }

  async start(): Promise<void> {
    const { start } = this.meta!;
    if (start) {
      await this.updateMeta({
        status: App.STATUS.STARTING,
      });
      const sh = (await this.load(start)) as IShellApp;

      if (sh.run) {
        this.setSteps(sh.run);
        await this._runs();
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
    await this.runner?.kill();
    await this.updateMeta({
      status: App.STATUS.STOPPED,
    });
  }

  async update(): Promise<void> {
    const { update } = this.meta!;

    if (update) {
      const sh = (await this.load(update)) as IShellApp;

      if (sh.run) {
        this.setSteps(sh.run);
        await this._runs();
      }
    } else {
      // 脚本不存在
      throw new Error('the start script does not exist');
    }
  }

  async retry(): Promise<void> {
    for (let i = 0; i < this.meta!.steps.length; i++) {
      if (this.meta!.steps[i].status === App.STEP_STATUS.ERROR) {
        this.meta!.steps[i].status = App.STEP_STATUS.INIT;
        break;
      }
    }
    await this._runs();
  }

  async jump(): Promise<void> {
    for (let i = 0; i < this.meta!.steps.length; i++) {
      if (this.meta!.steps[i].status === App.STEP_STATUS.ERROR) {
        this.meta!.steps[i].status = App.STEP_STATUS.SKIP;
        break;
      }
    }
    return Promise.resolve(undefined);
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
