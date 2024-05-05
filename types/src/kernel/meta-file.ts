export interface IMetaFileMeta {
  id: string;
  name: string;
  ext: string;

  // 路径动态填入，不会写入文件
  dir?: string;
}

export interface IMetaFileMetaUpdate {
  name?: string;
}

export interface IMetaFile<
  M extends IMetaFileMeta,
  U extends IMetaFileMetaUpdate,
> {
  /**
   * 文件存储根目录
   */
  readonly rootDir: string;

  readonly dir: string;

  meta: M;

  createInit: () => Promise<void>;

  saveMetadata: () => Promise<boolean>;
  updateMeta: (meta: U) => Promise<void>;
  readMetaData: () => Promise<M>;

  getMeta: () => Promise<M>;
  /**
   * 修改文件名
   */
  rename: (name: string) => Promise<void>;

  absPath: (...p: string[]) => string;

  /**
   * 当前文件夹中是否存在
   * @param p
   */
  exists: (...p: string[]) => boolean;

  getFileName: (name?: string) => string;

  remove: () => Promise<void>;
}
