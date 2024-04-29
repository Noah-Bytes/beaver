import { safeAccessSync } from '@beaver/arteffix-utils';
import { IFileBaseMeta, IFileBaseMetaUpdate, IFileExtend } from '@beaver/types';
import fs from 'fs-extra';
import path from 'path';
import { rimraf } from 'rimraf';

export class FileBase<M extends IFileBaseMeta, U extends IFileBaseMetaUpdate>
  implements IFileExtend<M, U>
{
  static META_NAME = 'metadata.json';
  static createId(): string {
    const timestamp = new Date().getTime(); // 获取当前时间的时间戳
    const randomPart = Math.random().toString(36).substring(2, 15); // 生成一个随机字符串
    return `${timestamp}_${randomPart.toUpperCase()}`; // 组合成一个唯一ID
  }

  meta: M;
  readonly dir: string;
  readonly rootDir: string;

  constructor(rootDir: string, meta: M) {
    this.rootDir = rootDir;
    this.meta = meta;
    this.dir = path.resolve(this.rootDir, meta.id);
  }

  createInit(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async saveMetadata() {
    await fs.writeJson(this.absPath(FileBase.META_NAME), this.meta);
    return true;
  }

  async readMetaData() {
    safeAccessSync(this.absPath());
    this.meta = await fs.readJson(this.absPath(FileBase.META_NAME));
    return this.meta;
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

  public async updateMeta(meta: U) {
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

  public absPath(...p: string[]): string {
    return path.resolve(this.dir, ...p);
  }

  exists(...p: string[]): boolean {
    const path = this.absPath(...p);
    return fs.pathExistsSync(path);
  }

  public getFileName(name?: string): string {
    return `${name ? name : this.meta.name}.${this.meta.ext}`;
  }

  async remove(): Promise<void> {
    await rimraf(this.dir);
  }

  async save(data: any) {
    await fs.ensureDir(this.absPath(), 0o755);

    if (!this.exists(FileBase.META_NAME)) {
      await this.saveMetadata();
    }

    const filePath = this.absPath(this.getFileName());

    if (!this.exists(filePath)) {
      await fs.promises.writeFile(filePath, data, {
        mode: '0755',
      });
    }
  }

  async copy() {
    await fs.ensureDir(this.absPath(), {
      mode: 0o2775,
    });

    if (!this.exists(FileBase.META_NAME)) {
      await this.saveMetadata();
    }

    const filePath = this.absPath(this.getFileName());

    if (!this.exists(filePath)) {
      await fs.copyFile(this.meta.url!, filePath);
    }
  }
}
