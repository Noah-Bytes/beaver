import { safeAccessSync } from '@beaver/arteffix-utils';
import { MetaFile } from '@beaver/kernel';
import {
  IAppMeta,
  IAppMetaUpdate,
  IAppTypes,
  requireImage,
} from '@beaver/shell-flow';
import { IShellAppMeta } from '@beaver/types';
import * as fs from 'fs-extra';
import git, { ReadCommitResult } from 'isomorphic-git';
import { ActionFlow } from '../action-flow';
import { Directory } from '../directory';

export class App extends Directory implements IAppTypes {
  readonly name: string;
  readonly git: string;

  private meta: IAppMeta | undefined;

  private readonly _ctx: ActionFlow;

  constructor(name: string, git: string, ctx: ActionFlow) {
    super(ctx.app.absPath(name));
    this._ctx = ctx;
    this.name = name;
    this.git = git;
  }

  async init() {
    if (this.meta) {
      throw new Error(`${this.name} is already initialized.`);
    }

    if (!this.exists(MetaFile.META_NAME)) {
      const appInfo = (await fs.readJson(
        this.absPath('beaver.json'),
      )) as IShellAppMeta;
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

  async install() {
    if (!this.meta) {
      throw new Error(`${this.name} is not initialized`);
    }
    const { install } = this.meta;
    const context = fs.readFileSync(this.absPath(install), 'utf8');

    try {
      const name = await this._ctx.core.run(context, this.name);
      this.meta.action = this._ctx.core.getRun(name);
    } catch (e) {
      console.log(e);
    }
  }

  async unInstall(): Promise<void> {
    if (!this.meta) {
      throw new Error(`${this.name} is not initialized`);
    }
    const { unInstall } = this.meta;
    const context = fs.readFileSync(this.absPath(unInstall), 'utf8');

    try {
      const name = await this._ctx.core.run(context, this.name);
      this.meta.action = this._ctx.core.getRun(name);
    } catch (e) {
      console.log(e);
    }
  }

  async start(): Promise<void> {
    if (!this.meta) {
      throw new Error(`${this.name} is not initialized`);
    }
    const { start } = this.meta;
    const context = fs.readFileSync(this.absPath(start), 'utf8');

    try {
      const name = await this._ctx.core.run(context, this.name);
      this.meta.action = this._ctx.core.getRun(name);
    } catch (e) {
      console.log(e);
    }
  }

  async stop(): Promise<void> {
    await this._ctx.core.stop(this.name);
  }

  async jump(): Promise<void> {
    await this._ctx.core.jump(this.name);
  }

  async retry(): Promise<void> {
    await this._ctx.core.retry(this.name);
  }

  async update(): Promise<void> {
    if (!this.meta) {
      throw new Error(`${this.name} is not initialized`);
    }
    const { update } = this.meta;
    const context = fs.readFileSync(this.absPath(update), 'utf8');

    try {
      const name = await this._ctx.core.run(context);
      this.meta.action = this._ctx.core.getRun(name);
    } catch (e) {
      console.log(e);
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
