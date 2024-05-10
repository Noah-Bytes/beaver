import { IMetaFileManage } from '../kernel';
import { IFileExtend } from './file-extend';
import { IFileBaseMeta, IFileBaseMetaUpdate } from './file-meta';

export interface IFileManage<
  F extends IFileExtend<M, U>,
  M extends IFileBaseMeta,
  U extends IFileBaseMetaUpdate,
> extends IMetaFileManage<F, M, U> {
  // 文件扩展列表
  readonly extends: any[];

  registerFile: (fileClass: any) => void;

  getFileExtend: (ext: string) => any;

  init: (rootDir: string) => Promise<void>;

  createFile: (filePath: string, metaUpdate?: IFileBaseMetaUpdate) => Promise<IFileExtend<M, U>>;

  /**
   * 本地文件
   * @param filePath
   */
  addFileByPath: (filePath: string, metaUpdate?: IFileBaseMetaUpdate) => Promise<IFileExtend<M, U>>;

  pushRecycleBin: (id: string) => Promise<M>;
}
