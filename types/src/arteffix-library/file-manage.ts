export interface IFileManage<T> {
  readonly fileGroup: Map<string, T[]>;
  readonly fileMap: Map<string, T>

  createFile: (file: T, groupName: string) => void;

  removeFile: (id: string, groupName: string) => Promise<void>;

  batchRemoveFIle: (ids: string[], groupName: string) => Promise<void>;

  getFiles: (groupName: string) => T[] | undefined;

  hasFile: (id: string) => boolean;

  getFile: (id: string) => T | undefined;
}
