import { ActionUse } from '@beaver/action-core';
import { exec, Runner } from '@beaver/action-exec';
import { ExecOptions, IDownloadOptions, IWithForShell } from '@beaver/types';
import * as path from 'path';

export class ActionShell extends ActionUse<IWithForShell> {
  private runner?: Runner;

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
    const result: string[] = [];
    if (Array.isArray(this.with.run)) {
      for (let i = 0; i < this.with.run.length; i++) {
        this.runner = exec(
          this.with.run[i],
          this.with.args || [],
          this.getOptions(),
        );
        const resp = await this.runner.exec();
        result.push(resp);
      }
      return result;
    }

    this.runner = exec(this.with.run, this.with.args || [], this.getOptions());
    return await this.runner.exec();
  }

  async kill(): Promise<void> {
    await this.runner?.kill();
  }
}
