import { IFile, IFileMeta, IFileMetaUpdate } from '@beaver/types';
import * as fs from 'fs';
import { rimraf } from 'rimraf';
import * as path from 'path';

export class File<T extends IFileMeta, U extends IFileMetaUpdate>
  implements IFile<T, U>
{
  static META_NAME = 'metadata.json';
  meta: T;
  readonly dir: string;

  constructor(dir: string, meta?: T) {
    this.dir = dir;
    this.meta = meta || this.readMetaData();
  }

  async saveMetadata() {
    await fs.promises.writeFile(
      this.absPath(File.META_NAME),
      JSON.stringify(this.meta),
    );
    return true;
  }

  readMetaData() {
    return require(this.absPath(File.META_NAME));
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

  getFileName(name?: string): string {
    return `${name ? name : this.meta.name}.${this.meta.ext}`;
  }

  async remove(): Promise<void> {
    await rimraf(this.dir);
  }
}
