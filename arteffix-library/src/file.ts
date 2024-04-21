import { IFile, IFileMeta, IFileMetaUpdate } from '@beaver/types';
import * as fs from 'fs-extra';
import * as path from 'path';
import { rimraf } from 'rimraf';

export class File<T extends IFileMeta, U extends IFileMetaUpdate>
  implements IFile<T, U>
{
  static TYPE = {
    workflow: 'workflow',
    image: 'image',
  };
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
    await fs.writeJson(this.absPath(File.META_NAME), this.meta);
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
      lastModified: Date.now(),
    };
    await this.saveMetadata();
  }

  absPath(...p: string[]): string {
    return path.resolve(this.dir, ...p);
  }

  exists(...p: string[]): boolean {
    const path = this.absPath(...p);
    return fs.pathExistsSync(path);
  }

  getFileName(name?: string): string {
    return `${name ? name : this.meta.name}.${this.meta.ext}`;
  }

  async remove(): Promise<void> {
    await rimraf(this.dir);
  }

  async save(data: any) {
    await fs.ensureDir(this.absPath(), 0o755);

    if (!this.exists(File.META_NAME)) {
      await this.saveMetadata();
    }

    const filePath = this.absPath(this.getFileName());

    if (!this.exists(filePath)) {
      await fs.promises.writeFile(filePath, data);
    }
  }

  async copy(path: string) {
    await fs.ensureDir(this.absPath(), 0o755);

    if (!this.exists(File.META_NAME)) {
      await this.saveMetadata();
    }

    const filePath = this.absPath(this.getFileName());

    if (!this.exists(filePath)) {
      await fs.copyFile(path, filePath);
    }
  }
}
