export interface FilePlugin<T> {

  /**
   * 复制文件
   * @param filePath
   */
  copy(filePath: string): Promise<T>;

  /**
   * 保存远程
   * @param data
   */
  save: (data: any) => Promise<void>;
}
