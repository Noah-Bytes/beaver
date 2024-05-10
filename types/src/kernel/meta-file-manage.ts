import { IMetaFile, IMetaFileMeta, IMetaFileMetaUpdate } from '@beaver/types';

export interface IMetaFileManage<
  F extends IMetaFile<M, U>,
  M extends IMetaFileMeta,
  U extends IMetaFileMetaUpdate,
> {
  readonly files: F[];
  readonly fileMap: Map<string, F>;

  readonly dir: string;

  init: (rootDir: string) => Promise<void>;

  addFile: (file: F) => void;

  removeFile: (id: string) => Promise<void>;

  batchRemoveFIle: (ids: string[]) => Promise<void>;

  getFiles: () => F[];

  getFileMetas: () => Promise<M[]>;

  getFilesByIds: (ids: string[]) => F[];

  getFileMetasByIds: (ids: string[]) => Promise<M[]>;

  hasFile: (id: string) => boolean;

  getFile: (id: string) => F | undefined;

  absPath: (...p: string[]) => string;
}
