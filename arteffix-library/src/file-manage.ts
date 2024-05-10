import { MetaFileManage } from '@beaver/kernel';
import {
  IFileBaseMeta,
  IFileBaseMetaUpdate,
  IFileExtend,
  IFileManage,
  IFileOptions,
} from '@beaver/types';
import fg from 'fast-glob';
import fs from 'fs-extra';
import path from 'path';
import { FileBase } from './file-base';
import { FileDefault } from './file-default';

type IClazz<
  F extends FileBase<M, U>,
  M extends IFileBaseMeta,
  U extends IFileBaseMetaUpdate,
> = new (rootDir: string, options?: IFileOptions<M>) => F;

interface IClazzExtend<
  F extends FileBase<M, U>,
  M extends IFileBaseMeta,
  U extends IFileBaseMetaUpdate,
> extends IClazz<F, M, U> {
  fileTypes: string[];
}

export class FileManage<
    F extends FileBase<M, U>,
    M extends IFileBaseMeta,
    U extends IFileBaseMetaUpdate,
  >
  extends MetaFileManage<F, M, U>
  implements IFileManage<F, M, U>
{
  readonly extends: IClazzExtend<F, M, U>[] = [];

  constructor(rootDir: string) {
    super(rootDir, 'arteffix');
  }

  getFileExtend(ext: string): IClazzExtend<F, M, U> {
    for (let i = 0; i < this.extends.length; i++) {
      if ((this.extends[i].fileTypes || []).includes(ext)) {
        return this.extends[i];
      }
    }

    // @ts-ignore
    return FileDefault;
  }

  registerFile(fileClass: IClazzExtend<F, M, U>): void {
    this.extends.push(fileClass);
  }

  override async init(): Promise<void> {
    const paths = await fg([`*/${FileBase.META_NAME}`], {
      cwd: this.dir,
    });
    for (let filePath of paths) {
      try {
        const meta: M = await fs.readJson(this.absPath(filePath));

        const ext = meta.ext;

        const Clazz = this.getFileExtend(ext);

        const file = new Clazz(this.absPath(), {
          meta,
        });

        this.addFile(file);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async createFile(
    filePath: string,
    metaUpdate?: IFileBaseMetaUpdate,
  ): Promise<F> {
    const o = path.parse(filePath);
    const ext = o.ext.replace(/\./g, '').toLowerCase();
    const clazz = this.getFileExtend(ext);
    const file = new clazz(this.absPath(), {
      filePath,
      metaUpdate,
    });

    await file.copy();
    await file.createInit();

    return file;
  }

  async addFileByPath(
    filePath: string,
    metaUpdate?: IFileBaseMetaUpdate,
  ): Promise<IFileExtend<M, U>> {
    const file = await this.createFile(filePath, metaUpdate);
    this.addFile(file);
    return file;
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
