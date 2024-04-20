export interface IFileManage<T, U> {
  readonly files: T[];
  readonly fileMap: Map<string, T>;
  readonly rootDir: string;

  init: (rootDir: string) => Promise<void>;

  createFile: (file: T) => void;

  removeFile: (id: string) => Promise<void>;

  batchRemoveFIle: (ids: string[]) => Promise<void>;

  getFiles: () => T[] | undefined;

  getFileMetas: () => U[];

  hasFile: (id: string) => boolean;

  getFile: (id: string) => T | undefined;

  absPath: (...p: string[]) => string;
}
