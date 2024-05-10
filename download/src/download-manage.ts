import { MetaFile, MetaFileManage } from '@beaver/kernel';
import {
  IDownload,
  IDownloadCreateOptions,
  IDownloadManage,
  IDownloadMeta,
  IMetaFileMetaUpdate,
} from '@beaver/types';
import fg from 'fast-glob';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { Download } from './download';

export interface IDownloadManageOptions {
  appName: string;
  tmpDir?: string;
}

export class DownloadManage
  extends MetaFileManage<IDownload, IDownloadMeta, IMetaFileMetaUpdate>
  implements IDownloadManage
{
  constructor(options: IDownloadManageOptions) {
    super(options.tmpDir || os.tmpdir(), options.appName);
  }

  async create(
    url: string,
    options?: IDownloadCreateOptions,
  ): Promise<IDownload> {
    let name: string, ext: string;
    if (options) {
      name = options.name;
      ext = options.ext;
    } else {
      const u = new URL(url);
      const p = path.parse(u.pathname);
      name = p.name;
      ext = p.ext.replace('.', '');
    }

    const file = new Download(this.absPath(), {
      meta: {
        id: MetaFile.createId(),
        url,
        createTime: Date.now(),
        name: [name, ext.toLowerCase()].join('.'),
        ext: ext.toUpperCase(),
      },
    });
    await file.init();
    this.addFile(file);

    return file;
  }

  async init(): Promise<void> {
    const paths = await fg([`*/${MetaFile.META_NAME}`], {
      cwd: this.dir,
    });
    for (let filePath of paths) {
      try {
        const meta: IDownloadMeta = await fs.readJson(this.absPath(filePath));
        const file = new Download(this.absPath(), {
          meta,
        });

        this.addFile(file);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async delete(id: string): Promise<void> {
    const file = this.getFile(id);
    if (!file) {
      throw new Error('File not found');
    }

    await file.remove();
  }

  async deleteAll(): Promise<void> {
    const files = this.getFiles();
    for (let file of files) {
      await file.remove();
    }
  }

  async deleteWithIds(ids: string[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      await this.delete(ids[i]);
    }
  }

  pause(id: string): Promise<boolean> {
    const file = this.getFile(id);
    if (!file) {
      throw new Error('File not found');
    }

    return file.pause();
  }

  async pauseAll(): Promise<{ [key: string]: boolean }> {
    const files = this.getFiles();
    const result: { [key: string]: boolean } = {};
    for (let i = 0; i < files.length; i++) {
      result[files[i].meta.id] = await files[i].pause();
    }

    return result;
  }

  async pauseWithIds(ids: string[]): Promise<{ [key: string]: boolean }> {
    const result: { [key: string]: boolean } = {};
    for (let i = 0; i < ids.length; i++) {
      result[ids[i]] = await this.pause(ids[i]);
    }
    return result;
  }

  resume(id: string): Promise<boolean> {
    const file = this.getFile(id);
    if (!file) {
      throw new Error('File not found');
    }

    return file.resume();
  }

  async resumeAll(): Promise<{ [key: string]: boolean }> {
    const files = this.getFiles();
    const result: { [key: string]: boolean } = {};
    for (let i = 0; i < files.length; i++) {
      result[files[i].meta.id] = await files[i].resume();
    }

    return result;
  }

  async resumeWithIds(ids: string[]): Promise<{ [key: string]: boolean }> {
    const result: { [key: string]: boolean } = {};
    for (let i = 0; i < ids.length; i++) {
      result[ids[i]] = await this.resume(ids[i]);
    }
    return result;
  }

  start(id: string): Promise<boolean> {
    const file = this.getFile(id);
    if (!file) {
      throw new Error('File not found');
    }

    return file.start();
  }

  async startAll(): Promise<{ [key: string]: boolean }> {
    const files = this.getFiles();
    const result: { [key: string]: boolean } = {};
    for (let i = 0; i < files.length; i++) {
      result[files[i].meta.id] = await files[i].start();
    }

    return result;
  }

  async startWithIds(ids: string[]): Promise<{ [key: string]: boolean }> {
    const result: { [key: string]: boolean } = {};
    for (let i = 0; i < ids.length; i++) {
      result[ids[i]] = await this.start(ids[i]);
    }
    return result;
  }

  stop(id: string): Promise<boolean> {
    const file = this.getFile(id);
    if (!file) {
      throw new Error('File not found');
    }

    return file.stop();
  }

  async stopAll(): Promise<{ [key: string]: boolean }> {
    const files = this.getFiles();
    const result: { [key: string]: boolean } = {};
    for (let i = 0; i < files.length; i++) {
      result[files[i].meta.id] = await files[i].stop();
    }

    return result;
  }

  async stopWithIds(ids: string[]): Promise<{ [key: string]: boolean }> {
    const result: { [key: string]: boolean } = {};
    for (let i = 0; i < ids.length; i++) {
      result[ids[i]] = await this.stop(ids[i]);
    }
    return result;
  }
}
