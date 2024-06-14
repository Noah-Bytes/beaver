import * as fs from 'fs-extra';
import * as path from 'path';
import { Module } from './module';

export class Directory<T> extends Module<T> {
  dir: string;

  constructor(dir: string) {
    super();
    this.dir = dir;
  }

  absPath(...p: string[]): string {
    return path.resolve(this.dir, ...p);
  }

  exists(...p: string[]): boolean {
    try {
      fs.accessSync(this.absPath(...p), fs.constants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }
}
