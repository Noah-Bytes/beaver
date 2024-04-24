import {
  IFileBaseMeta,
  IFileBaseMetaUpdate,
  IFileOptions,
} from '@beaver/types';
import * as fs from 'fs-extra';
import * as path from 'path';
import { FileBase } from './file-base';

export interface IFileDefaultMeta extends IFileBaseMeta {}
export interface IFileDefaultMetaUpdate extends IFileBaseMetaUpdate {}

export class FileDefault extends FileBase<
  IFileDefaultMeta,
  IFileDefaultMetaUpdate
> {
  constructor(rootDir: string, options?: IFileOptions<IFileBaseMeta>) {
    let meta;
    if (options?.meta) {
      meta = options.meta;
    } else {
      const filePath = options?.filePath!;
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        throw new Error('not support directory');
      }

      const o = path.parse(filePath);
      const ext = o.ext.replace(/\./g, '').toLowerCase();

      meta = {
        id: FileBase.createId(),
        name: o.name,
        size: stat.size,
        btime: stat.birthtimeMs,
        mtime: stat.mtimeMs,
        atime: stat.atimeMs,
        ext,
        tags: [],
        folders: [],
        isDeleted: false,
        url: filePath,
        modificationTime: Date.now(),
        lastModified: Date.now(),
      };
    }
    super(rootDir, meta);
  }
}
