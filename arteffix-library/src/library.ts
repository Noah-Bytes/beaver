import {ILibrary, ILibraryMeta} from '@beaver/types';

export class Library implements ILibrary {
  readonly version: string = '0.0.1';
  readonly rootDir: string;
  meta: ILibraryMeta | undefined;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  async init() {

  }
}
