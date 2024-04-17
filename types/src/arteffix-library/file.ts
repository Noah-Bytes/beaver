export interface IFileMeta {
  /**
   * uuid
   */
  id: string;

  /**
   * stat.name
   * 文件名
   */
  name: string;

  /**
   * stats.size
   * 文件有多少个字节
   */
  size: number;

  /**
   * stats.birthtimeMs
   * 文件创建时间的时间戳
   */
  btime: number;

  /**
   * stat.mtimeMs
   * 最后一次修改文件时的时间戳
   */
  mtime: number;

  /**
   * stat.atime
   * 最近一次被访问
   */
  atime: number;

  /**
   * 文件后缀名
   */
  ext: string;

  /**
   * tag
   */
  tags: any[];

  /**
   * 在哪些文件夹
   */
  folders: string[];

  /**
   * 是否删除
   */
  isDeleted: boolean;

  /**
   * 来源地址
   */
  url?: string;

  /**
   * 备注
   */
  annotation?: string;

  /**
   * 添加时间
   */
  modificationTime: number;

  /**
   * 尺寸：高
   */
  height: number;

  /**
   * 尺寸：宽
   */
  width: number;

  /**
   * 最后一次修改时间
   */
  lastModified?: number;

  /**
   * 评分
   */
  star?: number;

  type: string;
}

export interface IFileMetaUpdate {
  /**
   * stat.name
   * 文件名
   */
  name?: string;

  /**
   * tag
   */
  tags?: any[];

  /**
   * 在哪些文件夹
   */
  folders: string[];

  /**
   * 来源地址
   */
  url?: string;

  /**
   * 备注
   */
  annotation?: string;

  /**
   * 评分
   */
  star?: number;
}

export interface IFile<T, U> {
  readonly meta: T;
  readonly dir: string;

  /**
   * 元信息保存
   */
  saveMetadata: () => Promise<boolean>;

  /**
   * 读取元信息
   */
  readMetaData: () => T;

  /**
   * 修改文件名
   */
  rename: (name: string) => Promise<void>;
  updateMeta: (meta: U) => Promise<void>;

  absPath: (...p: string[]) => string;

  getFileName: () => string;

  remove: () => Promise<void>;
}
