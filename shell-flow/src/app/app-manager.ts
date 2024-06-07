import { ShellConda } from '@beaver/shell-conda';
import { ShellFlow } from '@beaver/shell-flow';
import fs from 'fs';
import git from 'isomorphic-git';
import path from 'path';
import { Module } from '../module';
import { App } from './app';
import * as modules from './module';

export class AppManager extends Module<any> {
  private readonly apps: App[] = [];
  private readonly appMap: Map<string, App> = new Map();

  private readonly _ctx: ShellFlow;

  private _init: boolean = false;

  readonly dir: string;
  constructor(ctx: ShellFlow) {
    super();
    this.dir = ctx.absPath('apps');
    this._ctx = ctx;
  }

  async init() {
    if (this.isInit()) {
    } else {
      this._init = true;
      await fs.promises.mkdir(this.dir, { recursive: true });
      let files = await fs.promises.readdir(this.dir, { withFileTypes: true });
      for (let file of files) {
        if (file.isDirectory()) {
          let gitRemote = await git.getConfig({
            fs,
            dir: this.absPath(file.name),
            path: 'remote.origin.url',
          });
          await this.createApp(file.name, gitRemote);
        }
      }

      this.removeAllModule();

      await this.initModule(modules);
    }
  }

  isInit() {
    return this._init;
  }

  async getApps() {
    await this.init();
    return this.apps;
  }

  async getApp(name: string) {
    await this.init();
    return this.appMap.get(name);
  }

  exists(p: string): boolean {
    try {
      fs.accessSync(p, fs.constants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  absPath(...arg: string[]): string {
    return path.resolve(this.dir, ...arg);
  }

  async createApp(name: string, git: string) {
    let app = new App(name, git, this._ctx);
    await app.init();
    this.apps.push(app);
    this.appMap.set(name, app);
  }

  async install(name: string) {
    const app = await this.getApp(name);
    if (app) {
      await app.install();
    }
  }

  async update(name: string) {
    const app = await this.getApp(name);
    if (app) {
      await app.update();
    }
  }

  async unInstall(name: string) {
    const app = await this.getApp(name);
    if (app) {
      await app.unInstall();
    }
  }

  async start(name: string) {
    const app = await this.getApp(name);
    if (app) {
      await app.start();
    }
  }

  async stop(name: string) {
    const app = await this.getApp(name);
    if (app) {
      await app.stop();
    }
  }

  async clone(
    remoteUrl: string,
    options?: {
      branch?: string;
    },
  ) {
    const name = path.basename(remoteUrl);
    if (this.exists(name)) {
      throw new Error(`${name} app already exists`);
    }

    let cmd;
    if (options?.branch) {
      cmd = `git clone -b ${options.branch} ${remoteUrl} ${name}`;
    } else {
      cmd = `git clone ${remoteUrl} ${name}`;
    }

    const shellConda = new ShellConda({
      home: this._ctx.homeDir,
      path: 'apps',
      run: cmd,
    });

    await shellConda.run();

    return await this.createApp(name, remoteUrl);
  }
}
