import { IFileExtend } from './file-extend';
import { IFileBaseMeta, IFileBaseMetaUpdate } from './file-meta';

export interface IFileManage<
  M extends IFileBaseMeta,
  U extends IFileBaseMetaUpdate,
> {
  readonly files: IFileExtend<M, U>[];
  readonly fileMap: Map<string, IFileExtend<M, U>>;

  // 文件扩展列表
  readonly extends: any[];

  readonly dir: string;

  registerFile: (fileClass: any) => void;

  getFileExtend: (ext: string) => any;

  init: (rootDir: string) => Promise<void>;

  createFile: (filePath: string) => Promise<IFileExtend<M, U>>;

  addFile: (file: IFileExtend<M, U>) => void;

  addFileByPath: (filePath: string) => Promise<IFileExtend<M, U>>;

  removeFile: (id: string) => Promise<void>;

  batchRemoveFIle: (ids: string[]) => Promise<void>;

  getFiles: () => IFileExtend<M, U>[] | undefined;

  getFileMetas: () => M[];

  hasFile: (id: string) => boolean;

  getFile: (id: string) => IFileExtend<M, U> | undefined;

  absPath: (...p: string[]) => string;

  pushRecycleBin: (id: string) => Promise<M>
}
