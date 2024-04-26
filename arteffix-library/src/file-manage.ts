import {
  IFileBaseMeta,
  IFileBaseMetaUpdate,
  IFileExtend,
  IFileManage,
  IFileOptions,
} from '@beaver/types';
import { findIndex } from '@technically/lodash';
import fg from 'fast-glob';
import path from 'path';
import { FileBase } from './file-base';
import { FileDefault } from './file-default';

type IClazz<M extends IFileBaseMeta, U extends IFileBaseMetaUpdate> = new (
  rootDir: string,
  options?: IFileOptions<M>,
) => IFileExtend<M, U> & { filesTypes: string[] };

interface IClazzExtend<M extends IFileBaseMeta, U extends IFileBaseMetaUpdate>
  extends IClazz<M, U> {
  fileTypes: string[];
}

export class FileManage<M extends IFileBaseMeta, U extends IFileBaseMetaUpdate>
  implements IFileManage<M, U>
{
  readonly files: IFileExtend<M, U>[] = [];
  readonly fileMap: Map<string, IFileExtend<M, U>> = new Map();
  readonly dir: string;
  readonly extends: IClazzExtend<M, U>[] = [];

  constructor(rootDir: string) {
    this.dir = path.resolve(rootDir, 'arteffix');
  }

  getFileExtend(ext: string): IClazzExtend<M, U> {
    for (let i = 0; i < this.extends.length; i++) {
      if ((this.extends[i].fileTypes || []).includes(ext)) {
        return this.extends[i];
      }
    }

    // @ts-ignore
    return FileDefault;
  }

  registerFile(fileClass: IClazzExtend<M, U>): void {
    this.extends.push(fileClass);
  }

  async init(): Promise<void> {
    const paths = await fg([`*/${FileBase.META_NAME}`], {
      cwd: this.dir,
    });
    for (let filePath of paths) {
      try {
        const meta: M = require(this.absPath(filePath));

        const ext = meta.ext;

        const clazz = this.getFileExtend(ext);

        const file = new clazz(this.absPath(), {
          meta,
        });

        this.addFile(file);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async batchRemoveFIle(ids: string[]): Promise<void> {
    for (let id of ids) {
      if (this.hasFile(id)) {
        await this.removeFile(id);
      }
    }
  }

  async createFile(filePath: string): Promise<IFileExtend<M, U>> {
    const o = path.parse(filePath);
    const ext = o.ext.replace(/\./g, '').toLowerCase();
    const clazz = this.getFileExtend(ext);
    const file = new clazz(this.absPath(), {
      filePath,
    });

    await file.copy();
    await file.createInit();

    return file;
  }

  addFile(file: IFileExtend<M, U>): void {
    this.files.push(file);
    this.fileMap.set(file.meta.id, file);
  }

  async addFileByPath(filePath: string): Promise<IFileExtend<M, U>> {
    const file = await this.createFile(filePath);
    this.addFile(file);
    return file;
  }

  getFiles(): IFileExtend<M, U>[] | undefined {
    return this.files;
  }

  getFileMetas(): M[] {
    const files = this.getFiles();
    if (files) {
      return files.map((file) => file.getMeta());
    }
    return [];
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

  hasFile(id: string): boolean {
    return this.fileMap.has(id);
  }

  getFile(id: string): IFileExtend<M, U> | undefined {
    return this.fileMap.get(id);
  }

  absPath(...p: string[]): string {
    return path.resolve(this.dir, ...p);
  }

  async pushRecycleBin(id: string): Promise<M> {
    if (!this.hasFile(id)) {
      throw new Error('file not found');
    }

    const file = this.getFile(id)!;

    await file.updateMeta({
      isDeleted: true,
    } as U);

    return file.getMeta();
  }
}
