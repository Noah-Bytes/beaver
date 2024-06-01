import { IShellTypes } from '@beaver/shell-flow';
import { IKey, IShellAppRequires } from '@beaver/types';
import { WriteStream } from 'fs';
import fs from 'fs-extra';
import { DownloaderHelper } from 'node-downloader-helper';
import path from 'path';
import wget from 'wget-improved';
import { Logger } from 'winston';
import { createLogger } from '../logger';
import { ShellFlow } from '../shell-flow';
import { IBinModuleTypes, IBinTypes } from '../types/bin-types';
import * as modules from './module';

export class Bin implements IBinTypes {
  private readonly _dir: string;
  private readonly _ctx: ShellFlow;
  readonly logger: Logger;
  private logStream: WriteStream | undefined;
  private moduleList: IBinModuleTypes[] = [];
  private moduleMap: Map<string, IBinModuleTypes> = new Map();
  private _installed = {
    conda: new Set<string>(),
    brew: new Set<string>(),
    pip: new Set<string>(),
  };
  readonly shell: IShellTypes;

  get dir(): string {
    return this._dir;
  }

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this._dir = ctx.absPath('bin');
    this.logger = createLogger(`bin`);
    this.shell = ctx.shell.createShell('bin');
  }

  readLog(): Promise<string> {
    return fs.readFile(this.absPath('bin.log'), 'utf8');
  }

  async init(): Promise<void> {
    await fs.promises.mkdir(this._dir, { recursive: true });

    this.removeAllModule();

    this.logStream = fs.createWriteStream(this.absPath('bin.log'), {
      flags: 'a',
    });
    this.shell.onShellData((data) => {
      this.logStream?.write(data);
    });

    for (let modulesKey in modules) {
      // @ts-ignore
      const mod = modules[modulesKey];
      if (this.getModule(modulesKey.toLowerCase())) {
      } else if (typeof mod === 'function') {
        this.logger.info(`开始初始化 ${modulesKey}`);
        // @ts-ignore
        const m = new mod(this._ctx);
        if (m?.init) {
          await m.init();
        }
        this.createModule(modulesKey.toLowerCase(), m);
      }
    }

    await this.checkInstalled();
  }

  writeLog(data: string) {
    this.logStream?.write(data);
  }

  download(url: string, dest: string): Promise<void> {
    if (this.exists(dest)) {
      this.logger.info('File already exists: ' + dest);
      return Promise.resolve();
    }

    const { options } = this._ctx;
    let targetURL = url;

    if (options?.isMirror) {
      targetURL = this._ctx.mirrorUrl(targetURL);
      this.logger.info('Using mirror: ' + targetURL);
    }

    const dl = new DownloaderHelper(targetURL, this._dir, {
      fileName: dest,
      override: true,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0',
      },
    });
    return new Promise((resolve, reject) => {
      dl.on('end', () => {
        this.logger.info('Download Complete!');
        resolve();
      });

      dl.on('error', (e) => {
        this.logger.error(`event: Download Failed: ${e.message}`);
      });

      dl.on('progress.throttled', (stats) => {
        this.logger.info(
          `Download ${stats.progress} ${stats.downloaded}/${stats.total}`,
        );
      });

      this.logger.info(`Downloading ${targetURL} to ${this._dir}/${dest}`);
      dl.start().catch((e) => {
        this.logger.error(`start: Download Failed: ${e.message}`);
        reject(e);
      });
    });
  }

  wget(url: string, dest: string): Promise<void> {
    if (this.exists(dest)) {
      this.logger.info('File already exists: ' + dest);
      return Promise.resolve();
    }

    const { options } = this._ctx;
    let targetURL = url;

    if (options?.isMirror) {
      targetURL = this._ctx.mirrorUrl(targetURL);
      this.logger.info('Using mirror: ' + targetURL);
    }

    return new Promise((resolve, reject) => {
      let download = wget.download(targetURL, dest);
      download.on('error', (err) => {
        this.logger.error(`start: Download Failed: ${err.message}`);
        reject(err);
      });
      download.on('end', () => {
        this.logger.info('Download Complete!');
        resolve();
      });
      download.on('progress', (progress) => {
        this.logger.info(`Download ${progress}`);
      });
    });
  }

  async rm(src: string): Promise<void> {
    this.logger.info(`rm ${src}`);
    await fs.promises.rm(this.absPath(src), {
      recursive: true,
    });
    this.logger.info(`rm success`);
  }

  async mv(src: string, dest: string): Promise<void> {
    this.logger.info(`mv ${src} ${dest}`);
    await fs.move(this.absPath(src), this.absPath(dest));
    this.logger.info(`mv success`);
  }

  exists(...p: string[]): boolean {
    try {
      fs.accessSync(this.absPath(...p), fs.constants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  absPath(...p: string[]): string {
    return path.resolve(this._dir, ...p);
  }

  getModule(name: string) {
    return this.moduleMap.get(name);
  }

  getModules(): IBinModuleTypes[] {
    return this.moduleList;
  }

  hasModule(name: string): boolean {
    return this.moduleMap.has(name);
  }

  removeAllModule(): void {
    this.moduleList = [];
    this.moduleMap.clear();
  }

  removeModule(name: string): void {
    const mod = this.getModule(name);
    if (mod) {
      this.moduleList = this.moduleList.filter((s) => s !== mod);
      this.moduleMap.delete(name);
    }
  }

  createModule(name: string, instantiate: IBinModuleTypes): void {
    this.moduleMap.set(name, instantiate);
    this.moduleList.push(instantiate);
  }

  async checkInstalled(): Promise<void> {
    const existsConda = this.exists('miniconda');

    // 检测 conda 已安装
    const conda = new Set<string>();

    if (existsConda) {
      const result = await this.shell.run({
        message: 'conda list',
      });

      const lines = result.split(/[\r\n]+/);
      let start;
      for (let line of lines) {
        if (start) {
          let chunks = line.split(/\s+/).filter((x) => x);
          if (chunks.length > 1) {
            conda.add(chunks[0]);
          }
        } else {
          if (/name.*version.*build.*channel/i.test(line)) {
            start = true;
          }
        }
      }
    }

    this._installed.conda = conda;

    // 检查pip已安装
    const pip = new Set<string>();

    if (existsConda) {
      const result = await this.shell.run({
        message: 'pip list',
      });

      const lines = result.split(/[\r\n]+/);
      let start;
      for (let line of lines) {
        if (start) {
          let chunks = line.split(/\s+/).filter((x) => x);
          if (chunks.length > 1) {
            pip.add(chunks[0]);
          }
        } else {
          if (/-------.*/i.test(line)) {
            start = true;
          }
        }
      }
    }

    this._installed.pip = pip;

    if (['darwin', 'linux'].includes(this._ctx.systemInfo.platform)) {
      let brew: string[] = [];
      if (this.exists('homebrew')) {
        const result = await this.shell.run({
          message: 'brew list -1',
        });

        const lines = result.split(/[\r\n]+/);
        let start, end;
        for (let line of lines) {
          if (start) {
            if (/^\s*$/.test(line)) {
              end = true;
            } else {
              if (!end) {
                let chunks = line.split(/\s+/).filter((x) => x);
                brew = brew.concat(chunks);
              }
            }
          } else {
            if (/==>/.test(line)) {
              start = true;
            }
          }
        }
      }

      this._installed.brew = new Set(brew);
    }
  }

  private async _isInstalled(
    name: string,
    type?: string | undefined,
  ): Promise<boolean> {
    switch (type) {
      case 'conda':
        this.logger.info(
          `检测 ${type}:${name} 安装状态: ${this._installed.conda.has(name)}`,
        );
        return this._installed.conda.has(name);
      case 'pip':
        this.logger.info(
          `检测 ${type}:${name} 安装状态: ${this._installed.pip.has(name)}`,
        );
        return this._installed.pip.has(name);
      case 'brew':
        this.logger.info(
          `检测 ${type}:${name} 安装状态: ${this._installed.brew.has(name)}`,
        );
        return this._installed.brew.has(name);
      default:
        if (this.hasModule(name)) {
          try {
            const isInstalled = await this.getModule(name)?.installed();
            this.logger.info(
              `检测 ${name} 安装状态: ${!!isInstalled}`,
            );
            return !!isInstalled;
          } catch {
            return false
          }
        }
        return false;
    }
  }

  private _isMatch(current: string, value?: string | string[]) {
    return (
      !value ||
      value === current ||
      (Array.isArray(value) && value.includes(current))
    );
  }

  async install(list: IShellAppRequires[]): Promise<void> {
    const { systemInfo } = this._ctx;
    const _list = list.filter(
      (elem) =>
        this._isMatch(systemInfo.platform, elem.platform) &&
        this._isMatch(systemInfo.arch, elem.arch) &&
        this._isMatch(systemInfo.GPU!, elem.gpu),
    );
    await fs.truncate(this.absPath('bin.log'), 0);
    for (let { name, args, type } of _list) {
      if (await this.checkIsInstalled(name, type)) {
        this.logger.info(`已安装 ${name}`);
        continue;
      }

      const _name: string[] = Array.isArray(name) ? name : [name];

      if (type) {
        let cmd;
        switch (type) {
          case 'conda':
            await this.getModule('conda')?.install();
            cmd = `conda install -y ${args} ${_name.join(' ')}`;
            break;
          case 'pip':
            cmd = `pip install ${args} ${_name.join(' ')}`;
            break;
          case 'brew':
            await this.getModule('brew')?.install();
            cmd = `brew install ${args} ${_name.join(' ')}`;
            break;
        }

        if (cmd) {
          await this.shell.run({
            message: cmd,
          });
        }
      } else {
        for (let n of _name) {
          if (this.hasModule(n)) {
            await this.getModule(n)?.install();
          }
        }
      }
    }

    await this.checkInstalled();
  }

  async checkIsInstalled(
    name: string | string[],
    type?: string | undefined,
  ): Promise<boolean> {
    if (Array.isArray(name)) {
      for (let n of name) {
        let installed = await this._isInstalled(n, type);
        if (!installed) return false;
      }
      return true;
    }

    return this._isInstalled(name, type);
  }

  private _mergeEnv(
    existing: IKey<string | string[]>,
    merge: IKey<string | string[]>,
  ) {
    // merge 'merge' into 'existing'
    for (let key in merge) {
      if (Array.isArray(merge[key])) {
        if (typeof existing[key] === 'undefined') {
          existing[key] = merge[key];
        } else {
          // if the env value is an array, it should be PREPENDED to the existing, in order to override
          if (existing[key]) {
            // @ts-ignore
            existing[key] = merge[key].concat(existing[key]);
          } else {
            existing[key] = merge[key];
          }
        }
      } else {
        existing[key] = merge[key];
      }
    }
    return existing;
  }

  envs(env?: IKey<string | string[]>): IKey<string | string[]> {
    const envs = this.moduleList
      .map((elem) => {
        if (elem.env) {
          return elem.env();
        }
        return undefined;
      })
      .filter((x) => !!x);

    // 2. Merge module envs
    let e: IKey<string | string[]> = {};
    for (let env of envs) {
      if (env) {
        e = this._mergeEnv(e, env);
      }
    }

    // 3. Merge override_envs
    if (env) {
      e = this._mergeEnv(e, env);
    }

    return e;
  }
}
