import { ActionUse } from '@beaver/action-core';
import { ShellConda } from '@beaver/shell-conda';
import { IWithForGit } from '@beaver/types';
import * as fs from 'fs-extra';
import * as path from 'path';

export class ActionGit extends ActionUse<IWithForGit> {
  private shell?: ShellConda;

  async run(): Promise<string | string[]> {
    await fs.ensureDir(path.resolve(this.home, this.with.path || ''));

    this.shell = new ShellConda({
      home: this.home,
      run: `git ${this.with.type} ${this.with.url} ${this.with.dir}`,
      path: this.with.path,
    });
    return await this.shell.run();
  }

  async kill() {
    await this.shell?.kill();
  }
}
