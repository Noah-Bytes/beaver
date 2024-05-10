import {
  IMetaFile,
  IMetaFileManage,
  IMetaFileMeta,
  IMetaFileMetaUpdate,
} from '@beaver/types';
import { findIndex } from 'lodash';
import * as path from 'path';

export class MetaFileManage<
  F extends IMetaFile<M, U>,
  M extends IMetaFileMeta,
  U extends IMetaFileMetaUpdate,
> implements IMetaFileManage<F, M, U>
{
  readonly dir: string;
  readonly fileMap: Map<string, F> = new Map();
  readonly files: F[] = [];

  constructor(rootDir: string, appName: string) {
    this.dir = path.resolve(rootDir, appName);
  }

  absPath(...p: string[]): string {
    return path.resolve(this.dir, ...p);
  }

  addFile(file: F): void {
    this.files.push(file);
    this.fileMap.set(file.meta.id, file);
  }

  async batchRemoveFIle(ids: string[]): Promise<void> {
    for (let id of ids) {
      if (this.hasFile(id)) {
        await this.removeFile(id);
      }
    }
  }

  getFile(id: string): F | undefined {
    return this.fileMap.get(id);
  }

  async getFileMetas(): Promise<M[]> {
    const files = this.getFiles();
    if (files) {
      const result = [];
      for (let i = 0; i < files.length; i++) {
        const meta = await files[i].getMeta();
        result.push(meta);
      }
      return result;
    }
    return [];
  }

  async getFileMetasByIds(ids: string[]): Promise<M[]> {
    const result: M[] = [];
    for (let i = 0; i < ids.length; i++) {
      const file = this.getFile(ids[i]);
      if (file) {
        result.push(await file.getMeta());
      }
    }
    return result;
  }

  getFilesByIds(ids: string[]): F[] {
    const result: F[] = [];
    for (let i = 0; i < ids.length; i++) {
      const file = this.getFile(ids[i]);
      if (file) {
        result.push(file);
      }
    }
    return result;
  }

  getFiles(): F[] {
    return this.files;
  }

  hasFile(id: string): boolean {
    return this.fileMap.has(id);
  }

  async removeFile(id: string): Promise<void> {
    if (!this.hasFile(id)) {
      return;
    }
    const file = this.getFile(id)!;

    await file.remove();
    this.fileMap.delete(id);

    const index = findIndex(this.files, (elem) => elem.meta.id === id);

    if (index > -1) {
      this.files.slice(index, 1);
    }
  }

  init(rootDir: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}
