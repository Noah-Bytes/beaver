import { IFileBaseMeta, IFileBaseMetaUpdate } from './file-meta';

export interface IFileExtend<
  M extends IFileBaseMeta,
  U extends IFileBaseMetaUpdate,
> {
  /**
   * 文件存储根目录
   */
  readonly rootDir: string;

  readonly dir: string;

  meta: M;

  createInit: () => Promise<void>;

  save: (data: any) => Promise<void>;

  copy: () => Promise<void>;

  /**
   * 元信息保存
   */
  saveMetadata: () => Promise<boolean>;

  /**
   * 读取元信息
   */
  readMetaData: () => M;

  getMeta: () => M;
  /**
   * 修改文件名
   */
  rename: (name: string) => Promise<void>;
  updateMeta: (meta: U) => Promise<void>;

  absPath: (...p: string[]) => string;

  /**
   * 当前文件夹中是否存在
   * @param p
   */
  exists: (...p: string[]) => boolean;

  getFileName: () => string;

  remove: () => Promise<void>;
}
