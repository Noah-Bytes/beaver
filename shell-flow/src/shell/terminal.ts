import type { IPtyForkOptions, IWindowsPtyForkOptions } from 'node-pty';
import * as pty from 'node-pty';

type IPty = pty.IPty;

export class Terminal {
  private ptyProcess: IPty;

  constructor(
    file: string,
    args: string[] | string,
    options: IPtyForkOptions | IWindowsPtyForkOptions,
  ) {
    this.ptyProcess = pty.spawn(file, args, options);
  }

  write(data: string) {
    this.ptyProcess.write(data);
  }

  onData(callback: (res: string) => void) {
    this.ptyProcess.onData(callback);
  }

  kill() {
    this.ptyProcess.kill();
  }

  pause() {
    this.ptyProcess.pause();
  }
}
