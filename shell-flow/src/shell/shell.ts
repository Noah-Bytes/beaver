import { IShellTypes } from '../types/shell-types';
import * as pty from 'node-pty';
import { createModuleEventBus, IEventBus, isWin32 } from '@beaver/utils';
import type { IPty } from 'node-pty';
import type { ConsolaInstance } from 'consola/dist/core';
import { consola } from 'consola';
import * as os from 'os';
import * as process from 'process';

export class Shell implements IShellTypes {
  private readonly _name: string;
  static END_FLAG = 'beaver';

  get name(): string {
    return this._name;
  }
  private readonly _terminal: string;
  private readonly _args: string[];
  private readonly _event_name_data;
  private readonly _event_name_exit;
  private ptyProcess: IPty | undefined;
  logger: ConsolaInstance;
  eventBus: IEventBus;

  get terminal(): string {
    return this._terminal;
  }

  get args(): string[] {
    return this._args;
  }

  constructor(name: string) {
    this._name = name;

    if (isWin32()) {
      this._terminal = 'powershell.exe';
      /**
       * 参数解释
       * --NoProfile 不加载用户的配置文件
       */
      this._args = ['-NoProfile'];
    } else {
      this._terminal = '/bin/bash';
      /**
       * 参数解释
       * --noprofile 启动shell时不读取用户的登录shell配置文件（如.bash_profile、.profile等）。
       * --norc 启动shell时不读取.bashrc文件。.bashrc是非登录shell的配置文件，通常包含命令别名、函数定义等。
       */
      this._args = ['--noprofile', '--norc'];
    }

    // 事件名称
    this._event_name_data = `shell:data:${name}`;
    this._event_name_exit = `shell:exit:${name}`;

    this.logger = consola.withTag(`shell:${name}`);
    this.eventBus = createModuleEventBus(`shell:event:${name}`);

    this.env = Object.assign({}, process.env);

    /**
     * 定义 Shell 提示符的外观
     */
    this.env['PS1'] = `<<${name} SHELL>>: `;

    /**
     * 最大路径长度
     */
    this.env['CMAKE_OBJECT_PATH_MAX'] = '1024';
  }

  env: {
    [key: string]: string | undefined;
  };

  private write(message: string): void {
    if (!this.ptyProcess) {
      throw new Error(`${this._name} not initialized`);
    }

    this.ptyProcess.write(message);
  }
  send(message: string, isExe = false) {
    if (message.includes(`echo ${Shell.END_FLAG}`)) {
      throw new Error('Cannot contain reserved system commands');
    }

    this.write(message);
    if (isExe) {
      this.write(` ${isWin32() ? '&' : '&&'} echo ${Shell.END_FLAG}`);
      this.write(os.EOL);
    }
  }
  clear(): void {
    // this.write(isWin32() ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
    this.ptyProcess?.clear();
  }
  init() {
    this.ptyProcess = pty.spawn(this._terminal, this.args, {
      name: this.name,
      cols: 100,
      rows: 30,
      cwd: process.cwd(),
      env: this.env,
    });

    this.ptyProcess.onData((data) => {
      const str = this.cleanTerminalOutput(data);
      this.logger.info(str);
      this.eventBus.emit(this._event_name_data, str);
    });

    this.ptyProcess.onExit((result) => {
      this.logger.log(`${this.name} shell exit`);
      this.eventBus.emit(this._event_name_exit, result);
    });
  }

  kill() {
    if (this.ptyProcess) {
      this.ptyProcess.kill();
      this.ptyProcess = undefined;
    }

    this.eventBus.removeAllListeners();

    this.logger.info(`${this.name} shell killed`);
  }

  onShellData(func: (data: string) => any) {
    this.eventBus.on(this._event_name_data, func);
    return () => {
      this.eventBus.off(this._event_name_data, func);
    };
  }

  onShellExit(func: (data: string) => any) {
    this.eventBus.on(this._event_name_exit, func);
    return () => {
      this.eventBus.off(this._event_name_exit, func);
    };
  }

  run(message: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.ptyProcess) {
        reject(new Error(`${this._name} not initialized`));
      }

      let result: string = '';
      const off = this.onShellData((data) => {
        result += data;

        const pattern = new RegExp(`^${Shell.END_FLAG}`, 'gm');

        if (pattern.test(result)) {
          off();
          this.clear();
          resolve(result);
        }
      });

      this.send(message, true);
    });
  }

  private cleanTerminalOutput(data: string) {
    const pattern = [
      '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
      '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-Za-z=><~]))',
    ].join('|');
    const regex = new RegExp(pattern, 'gi');
    return data.replace(regex, '');
  }
}
