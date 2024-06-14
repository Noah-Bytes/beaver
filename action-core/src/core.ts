import { ExecutionTime } from '@beaver/arteffix-utils';
import { IFlowOptionsTypes, IStepWith } from '@beaver/types';
import * as stream from 'stream';
import { ActionRunManage } from './action-run';
import { ActionUse, UseManage } from './action-use';

export class Core {
  use: UseManage;
  private runs: ActionRunManage;
  options?: IFlowOptionsTypes;

  constructor(appName: string, options: IFlowOptionsTypes) {
    this.options = options;
    this.use = new UseManage(this);
    this.runs = new ActionRunManage(this);

    this.options.errStream =
      options?.errStream || <stream.Writable>process.stderr;
    this.options.outStream =
      options?.outStream || <stream.Writable>process.stdout;

    // preset
    // this.register('actions/git', ActionGit);
    // this.register('action/shell-conda', ShellConda);
    // this.register('action/shell', ActionShell);
    // this.register('action/drive', ActionDrive);
    // this.register('action/download', ActionDownload);
    // this.register('action/fs', ActionFs);
  }

  register(name: string, use: typeof ActionUse<IStepWith>) {
    this.use.register(name, use);
  }

  async run(yaml: string, name?: string) {
    ExecutionTime.getInstance().start('环境安装');
    const _name = await this.runs.create(yaml, name);
    await this.runs.start(_name);
    ExecutionTime.getInstance().end();
    return _name;
  }

  async stop(name?: string) {
    await this.runs.stop(name);
  }

  async retry(name?: string) {
    await this.runs.retry(name);
  }

  async jump(name?: string) {
    await this.runs.jump(name);
  }

  getRun(name: string) {
    return this.runs.get(name);
  }
}
