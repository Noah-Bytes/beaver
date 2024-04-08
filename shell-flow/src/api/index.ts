import * as fs from 'fs';
import * as path from 'path';
import { ShellFlow } from '@beaver/shell-flow';

export class Api {
  readonly dir: string;
  constructor(ctx: ShellFlow) {
    this.dir = ctx.absPath('api');
  }

  exists(p: string): boolean {
    try {
      fs.accessSync(p, fs.constants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  absPath(...arg: string[]): string {
    return path.resolve(this.dir, ...arg);
  }
}
