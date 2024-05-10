import { safeAccessSync } from '@beaver/arteffix-utils';
import { IMetaFile, IMetaFileMeta, IMetaFileMetaUpdate } from '@beaver/types';
import * as fs from 'fs-extra';
import * as path from 'path';
import { rimraf } from 'rimraf';

export class MetaFile<M extends IMetaFileMeta, U extends IMetaFileMetaUpdate>
  implements IMetaFile<M, U>
{
  static META_NAME = 'metadata.json';

  readonly dir: string;
  readonly rootDir: string;
  meta: M;

  static createId(): string {
    const timestamp = new Date().getTime(); // 获取当前时间的时间戳
    const randomPart = Math.random().toString(36).substring(2, 15); // 生成一个随机字符串
    return `${timestamp}_${randomPart.toUpperCase()}`; // 组合成一个唯一ID
  }

  constructor(rootDir: string, meta: M) {
    this.rootDir = rootDir;
    this.meta = meta;
    this.dir = path.resolve(this.rootDir, meta.id);
  }

  async init(): Promise<void> {
    await fs.ensureDir(this.absPath(), {
      mode: 0o2775,
    });

    if (!this.exists(MetaFile.META_NAME)) {
      await this.saveMetadata();
    }
  }

  absPath(...p: string[]): string {
    return path.resolve(this.dir, ...p);
  }

  exists(p: string): boolean {
    const path = this.absPath(...p);
    return fs.pathExistsSync(path);
  }

  createInit(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async getMeta(): Promise<M> {
    let m = this.meta;
    if (!m) {
      m = await this.readMetaData();
    }

    return {
      ...m,
      dir: this.dir,
    };
  }

  async readMetaData(): Promise<M> {
    safeAccessSync(this.absPath());
    this.meta = await fs.readJson(this.absPath(MetaFile.META_NAME));
    return this.meta;
  }

  async remove(): Promise<void> {
    await rimraf(this.dir);
  }

  async rename(name: string): Promise<void> {
    // 第一步修改 文件名称
    await fs.promises.rename(
      this.absPath(this.getFileName()),
      this.absPath(this.getFileName(name)),
    );
    this.meta.name = name;

    // 第二步 保存
    await this.saveMetadata();
  }

  async saveMetadata(): Promise<boolean> {
    await fs.writeJson(this.absPath(MetaFile.META_NAME), this.meta);
    return true;
  }

  async updateMeta(meta: U, updateTime = true): Promise<void> {
    if (meta.name) {
      await fs.promises.rename(
        this.absPath(this.getFileName()),
        this.absPath(this.getFileName(meta.name)),
      );
    }

    this.meta = {
      ...this.meta,
      ...meta,
    };
    if (updateTime) {
      // @ts-ignore
      this.meta['lastModified'] = Date.now();
    }
    await this.saveMetadata();
  }

  public getFileName(name?: string): string {
    return `${name ? name : this.meta.name}.${this.meta.ext}`;
  }
}
