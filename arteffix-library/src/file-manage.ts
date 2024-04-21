import {
  IFileManage,
  IFileMeta,
  IFileMetaUpdate,
  IImageMeta,
  IImageWorkflowMeta,
} from '@beaver/types';
import { findIndex } from '@technically/lodash';
import * as fg from 'fast-glob';
import * as path from 'path';
import { Workflow } from './creativity';
import { File } from './file';
import { Image } from './media';

export type IFile = Workflow | Image | File<IFileMeta, IFileMetaUpdate>;
export type FileMeta = IImageWorkflowMeta | IImageMeta | IFileMeta;

export class FileManage implements IFileManage<IFile, FileMeta> {
  readonly files: IFile[] = [];
  readonly fileMap: Map<string, IFile> = new Map();
  readonly dir: string;

  constructor(rootDir: string) {
    this.dir = path.resolve(rootDir, 'arteffix');
  }

  async init(): Promise<void> {
    const paths = await fg([`*/${File.META_NAME}`], {
      cwd: this.dir,
    });
    for (let path of paths) {
      const meta: FileMeta = require(this.absPath(path));

      let file: IFile | undefined;

      // 后续扩展后缀
      switch (meta.type) {
        case File.TYPE.workflow:
          file = new Workflow(this.absPath(), meta as IImageWorkflowMeta);
          break;
        case File.TYPE.image:
          file = new Image(this.absPath(), meta as IImageMeta);
          break;
        default:
          file = new File(this.absPath(), meta);
          break;
      }

      if (file) {
        this.createFile(file);
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

  createFile(file: IFile): void {
    this.files.push(file);
    this.fileMap.set(file.meta.id, file);
  }

  getFiles(): IFile[] | undefined {
    return this.files;
  }

  getFileMetas(): FileMeta[] {
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

  getFile(id: string): IFile | undefined {
    return this.fileMap.get(id);
  }

  absPath(...p: string[]): string {
    return path.resolve(this.dir, ...p);
  }
}
