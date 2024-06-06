import { ActionUse } from '@beaver/action-core';
import { exec } from '@beaver/action-exec';
import { ExecOptions, IDownloadOptions, IWithForShell } from '@beaver/types';
import * as path from 'path';

export class ActionShell extends ActionUse<IWithForShell> {
  constructor(params: IWithForShell, options?: IDownloadOptions) {
    super(params, options);
  }

  private getOptions(): ExecOptions {
    return {
      cwd: this.with?.path
        ? path.resolve(this.home, this.with.path)
        : this.home,
      outStream: this.outStream,
      errStream: this.errStream,
      windowsVerbatimArguments: true,
    };
  }

  override async run() {
    if (Array.isArray(this.with.run)) {
      for (let i = 0; i < this.with.run.length; i++) {
        await exec(this.with.run[i], [], this.getOptions());
      }
      return '0';
    }

    return await exec(this.with.run, [], this.getOptions());
  }
}
