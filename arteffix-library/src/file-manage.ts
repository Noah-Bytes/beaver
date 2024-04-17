import { IFileManage } from '@beaver/types';
import { findIndex } from '@technically/lodash';
import { Workflow } from './creativity';
import { Image } from './media';

type File = Workflow | Image;

export class FileManage implements IFileManage<File> {
  readonly fileGroup: Map<string, File[]> = new Map();
  readonly fileMap: Map<string, File> = new Map();

  constructor() {}

  async batchRemoveFIle(ids: string[], groupName: string): Promise<void> {
    for (let id of ids) {
      if (this.hasFile(id)) {
        const file = this.getFile(id)!;
      }
    }
    return Promise.resolve(undefined);
  }

  createFile(file: File, groupName: string): void {
    if (this.fileGroup.has(groupName)) {
      this.fileGroup.get(groupName)!.push(file);
    } else {
      this.fileGroup.set(groupName, [file])
    }

    this.fileMap.set(file.meta.id, file);
  }

  getFiles(groupName: string): File[] | undefined {
    return this.fileGroup.get(groupName);
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

  getFile(id: string): File | undefined {
    return this.fileMap.get(id);
  }
}
