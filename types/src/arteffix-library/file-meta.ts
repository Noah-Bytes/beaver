import { Folder } from './workspace';

export interface IFileBaseMeta {
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
  tags: string[];

  /**
   * 在哪些文件夹
   */
  folders: Pick<Folder, 'id' | 'name'>[];

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
   * 最后一次修改时间
   */
  lastModified?: number;

  /**
   * 评分
   */
  star?: number;

  // 路径动态填入，不会写入文件
  dir?: string;
}

export interface IFileBaseMetaUpdate {
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
  folders?: Pick<Folder, 'id' | 'name'>[];

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

  /**
   * 删除标记
   */
  isDeleted?: boolean;
}

export type IFileOptions<T> = {
  filePath?: string;
  meta?: T;
};
