export interface IFileManage<T, U> {
  readonly fileGroup: Map<string, T[]>;
  readonly fileMap: Map<string, T>;
  readonly rootDir: string;

  init: (rootDir: string) => Promise<void>;

  createFile: (file: T, groupName: string) => void;

  removeFile: (id: string, groupName: string) => Promise<void>;

  batchRemoveFIle: (ids: string[], groupName: string) => Promise<void>;

  getFiles: (groupName: string) => T[] | undefined;

  getFileMetas: (groupName: string) => U[];

  hasFile: (id: string) => boolean;

  getFile: (id: string) => T | undefined;

  absPath: (...p: string[]) => string;
}
