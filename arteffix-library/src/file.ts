import { IFile, IFileMeta, IFileMetaUpdate } from '@beaver/types';
import * as fs from 'fs';
import { rimraf } from 'rimraf';
import * as path from 'path';

export class File<T extends IFileMeta, U extends IFileMetaUpdate>
  implements IFile<T, U>
{
  static TYPE = {
    workflow: 'workflow',
    image: 'image',
  }
  static META_NAME = 'metadata.json';
  meta: T;
  readonly dir: string;
  readonly rootDir: string;

  constructor(rootDir: string, meta: T) {
    this.rootDir = rootDir;
    this.dir = path.resolve(this.rootDir, meta.id);
    this.meta = meta;
  }

  async saveMetadata() {
    await fs.promises.writeFile(
      this.absPath(File.META_NAME),
      JSON.stringify(this.meta),
    );
    return true;
  }

  readMetaData() {
    this.meta = require(this.absPath(File.META_NAME));
    return this.meta;
  }

  getMeta(): T {
    if (this.meta) {
      return this.meta;
    }
    return this.readMetaData();
  }

  async rename(name: string) {
    // 第一步修改 文件名称
    await fs.promises.rename(
      this.absPath(this.getFileName()),
      this.absPath(this.getFileName(name)),
    );
    this.meta.name = name;

    // 第二步 保存
    await this.saveMetadata();
  }

  async updateMeta(meta: U) {
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
    await this.saveMetadata();
  }

  absPath(...p: string[]): string {
    return path.resolve(this.dir, ...p);
  }

  exists(...p: string[]): boolean {
    try {
      fs.accessSync(this.absPath(...p), fs.constants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  getFileName(name?: string): string {
    return `${name ? name : this.meta.name}.${this.meta.ext}`;
  }

  async remove(): Promise<void> {
    await rimraf(this.dir);
  }

  async save(data: any) {
    if (this.exists()) {
      // 更新
    } else {
      await fs.promises.mkdir(this.absPath(this.dir));
      await this.saveMetadata();
      await fs.promises.writeFile(this.absPath(this.getFileName()), data);
    }
  }
}
