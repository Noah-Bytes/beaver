import * as pty from 'node-pty';
import os from 'os';

type IPty = pty.IPty;

export class Terminal {
  private platform = os.platform();
  private shell = this.platform === 'win32' ? 'cmd.exe' : 'bash';
  private ptyProcess: IPty;

  constructor() {
    this.ptyProcess = pty.spawn(this.shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
    });
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
}
