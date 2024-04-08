import { IBinModuleTypes, IBinTypes } from '../types/bin-types';
import { ShellFlow } from '../shell-flow';
import * as fs from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';
import { loader } from '../loader';
import { removeFilenameFromUrl } from '@beaver/utils';
import { Logger } from 'winston';
import * as wget from 'wget-improved';
import { createLogger } from '../logger';
import { DownloaderHelper } from 'node-downloader-helper';

export class Bin implements IBinTypes {
  private readonly _dir: string;
  private readonly _ctx: ShellFlow;
  readonly logger: Logger;
  private modules: IBinModuleTypes[] = [];
  private moduleMap: Map<string, IBinModuleTypes> = new Map();
  private readonly mirror: { [key: string]: string } = require('./mirror.json');
  installed: { [p: string]: string[] } = {};

  get dir(): string {
    return this._dir;
  }

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this._dir = ctx.absPath('bin');
    this.logger = createLogger(`bin`);
  }

  async init(): Promise<void> {
    await fs.promises.mkdir(this._dir, { recursive: true });

    // General purpose package managers like conda, conda needs to come at the end
    const modFiles = (await fs.promises.readdir(__dirname)).filter((file) => {
      return file.endsWith('.js') && file !== 'index.js' && file !== 'cmake.js';
    });

    const mods = [];

    for (let filename of modFiles) {
      const filePath = path.resolve(__dirname, filename);
      const mod = (await loader(filePath, this._ctx)).resolved;
      const name = path.basename(filename, '.js');
      mods.push({
        name,
        mod,
      });
    }

    this.removeAllModule();

    for (let mod of mods) {
      if (mod.mod?.init) {
        await mod.mod.init();
      }

      this.createModule(mod.name, mod.mod);
    }
  }

  download(url: string, dest: string): Promise<void> {
    if (this.exists(dest)) {
      this.logger.info('File already exists: ' + dest);
      return Promise.resolve();
    }

    const { options } = this._ctx;
    let targetURL = url;
    const urlWithOutFileName = removeFilenameFromUrl(targetURL);

    if (options?.isMirror && this.mirror[urlWithOutFileName]) {
      targetURL = targetURL.replace(
        urlWithOutFileName,
        this.mirror[urlWithOutFileName],
      );
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
    const urlWithOutFileName = removeFilenameFromUrl(targetURL);

    if (options?.isMirror && this.mirror[urlWithOutFileName]) {
      targetURL = targetURL.replace(
        urlWithOutFileName,
        this.mirror[urlWithOutFileName],
      );
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
    await fse.move(this.absPath(src), this.absPath(dest));
    this.logger.info(`mv success`);
  }

  exists(src: string): boolean {
    try {
      fs.accessSync(this.absPath(src), fs.constants.F_OK);
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
    return this.modules;
  }

  removeAllModule(): void {
    this.modules = [];
    this.moduleMap.clear();
  }

  removeModule(name: string): void {
    const mod = this.getModule(name);
    if (mod) {
      this.modules = this.modules.filter((s) => s !== mod);
      this.moduleMap.delete(name);
    }
  }

  createModule(name: string, instantiate: IBinModuleTypes): void {
    this.moduleMap.set(name, instantiate);
    this.modules.push(instantiate);
  }
}
