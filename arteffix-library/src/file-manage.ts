import { IFileManage, IImageMeta, IImageWorkflowMeta } from '@beaver/types';
import { findIndex } from '@technically/lodash';
import * as fg from 'fast-glob';
import * as path from 'path';
import { Workflow } from './creativity';
import { File } from './file';
import { Image } from './media';

export type IFile = Workflow | Image;
export type FileMeta = IImageWorkflowMeta | IImageMeta;

export class FileManage implements IFileManage<IFile, FileMeta> {
  readonly fileGroup: Map<string, IFile[]> = new Map();
  readonly fileMap: Map<string, IFile> = new Map();
  readonly rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  async init(): Promise<void> {
    const paths = await fg([`**/${File.META_NAME}`], {
      cwd: this.rootDir,
    });
    for (let path in paths) {
      const arr = path.split('/');
      if (arr.length !== 2) {
        continue;
      }

      const meta: FileMeta = require(path);

      let file: IFile | undefined;

      // 后续扩展后缀
      switch (meta.type) {
        case File.TYPE.workflow:
          file = new Workflow(
            this.absPath(meta.type),
            meta as IImageWorkflowMeta,
          );
          break;
        case File.TYPE.image:
          file = new Image(this.absPath(meta.type), meta as IImageMeta);
          break;
      }

      if (file) {
        this.createFile(file, meta.type);
      }
    }
  }

  async batchRemoveFIle(ids: string[], groupName: string): Promise<void> {
    for (let id of ids) {
      if (this.hasFile(id)) {
        await this.removeFile(id, groupName);
      }
    }
  }

  createFile(file: IFile, groupName: string): void {
    if (this.fileGroup.has(groupName)) {
      this.fileGroup.get(groupName)!.push(file);
    } else {
      this.fileGroup.set(groupName, [file]);
    }

    this.fileMap.set(file.meta.id, file);
  }

  getFiles(groupName: string): IFile[] | undefined {
    return this.fileGroup.get(groupName);
  }

  getFileMetas(groupName: string): FileMeta[] {
    const files = this.getFiles(groupName);
    if (files) {
      return files.map((file) => file.getMeta());
    }
    return [];
  }

  async removeFile(id: string, groupName: string): Promise<void> {
    if (!this.hasFile(id)) {
      return;
    }
    const file = this.getFile(id)!;

    await file.remove();
    this.fileMap.delete(id);

    const files = this.fileGroup.get(groupName);

    if (!files) {
      return;
    }

    const index = findIndex(files, (elem) => elem.meta.id === id);

    if (index > -1) {
      files.slice(index, 1);
    }
  }

  hasFile(id: string): boolean {
    return this.fileMap.has(id);
  }

  getFile(id: string): IFile | undefined {
    return this.fileMap.get(id);
  }

  absPath(...p: string[]): string {
    return path.resolve(this.rootDir, ...p);
  }
}
