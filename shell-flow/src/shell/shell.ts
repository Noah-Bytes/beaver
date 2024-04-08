import {
  IShellRunOptions,
  IShellRunParams,
  IShellTypes,
} from '../types/shell-types';
import * as pty from 'node-pty';
import { createModuleEventBus, IEventBus, isWin32 } from '@beaver/utils';
import type { IPty } from 'node-pty';
import * as sudoPrompt from 'sudo-prompt';
import * as os from 'os';
import * as process from 'process';
import * as fs from 'fs';
import * as path from 'path';
import { createLogger } from '@beaver/shell-flow';
import { Logger } from 'winston';
import { IShellFlowTypes } from '../types/shell-flow-types';
import { mirrorUrl } from '../mirror';
import { shellEnvSync } from 'shell-env';

export class Shell implements IShellTypes {
  private readonly _name: string;
  static END_FLAG = '; echo $?';

  get name(): string {
    return this._name;
  }
  private readonly _terminal: string;
  private readonly _args: string[];
  private readonly _event_name_data;
  private readonly _event_name_exit;
  private ptyProcess: IPty | undefined;
  private readonly logger: Logger;
  private readonly _ctx: IShellFlowTypes;
  private readonly mirror: {
    [key: string]: string;
  } = require('../mirror.json');
  eventBus: IEventBus;

  get terminal(): string {
    return this._terminal;
  }

  get args(): string[] {
    return this._args;
  }

  constructor(name: string, ctx: IShellFlowTypes) {
    this._name = name;
    this._ctx = ctx;

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

    this.logger = createLogger(`shell:${name}`);
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

    /**
     * well known cache
     */
    this.env['HF_HOME'] = path.resolve(ctx.homeDir, 'cache', 'HF_HOME');
    this.env['TORCH_HOME'] = path.resolve(ctx.homeDir, 'cache', 'TORCH_HOME');
    this.env['HOMEBREW_CACHE'] = path.resolve(
      ctx.homeDir,
      'cache',
      'HOMEBREW_CACHE',
    );
    this.env['XDG_CACHE_HOME'] = path.resolve(
      ctx.homeDir,
      'cache',
      'XDG_CACHE_HOME',
    );
    this.env['PIP_CACHE_DIR'] = path.resolve(
      ctx.homeDir,
      'cache',
      'PIP_CACHE_DIR',
    );
    this.env['PIP_TMPDIR'] = path.resolve(ctx.homeDir, 'cache', 'PIP_TMPDIR');
    this.env['TMPDIR'] = path.resolve(ctx.homeDir, 'cache', 'TMPDIR');
    this.env['TEMP'] = path.resolve(ctx.homeDir, 'cache', 'TEMP');
    this.env['TMP'] = path.resolve(ctx.homeDir, 'cache', 'TMP');
    this.env['XDG_DATA_HOME'] = path.resolve(
      ctx.homeDir,
      'cache',
      'XDG_DATA_HOME',
    );
    this.env['XDG_CONFIG_HOME'] = path.resolve(
      ctx.homeDir,
      'cache',
      'XDG_CONFIG_HOME',
    );
    this.env['XDG_STATE_HOME'] = path.resolve(
      ctx.homeDir,
      'cache',
      'XDG_STATE_HOME',
    );
    this.env['GRADIO_TEMP_DIR'] = path.resolve(
      ctx.homeDir,
      'cache',
      'GRADIO_TEMP_DIR',
    );
    this.env['PIP_CONFIG_FILE'] = path.resolve(ctx.homeDir, 'pipconfig');
  }

  env: {
    [key: string]: string | undefined;
  };

  static exists(absPath: string): boolean {
    try {
      fs.accessSync(absPath, fs.constants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  private write(message: string): void {
    if (!this.ptyProcess) {
      throw new Error(`${this._name} not initialized`);
    }

    this.ptyProcess.write(message);
  }
  send(message: string, isRun = false) {
    if (message.includes(`; echo $?`)) {
      throw new Error('Cannot contain reserved system commands');
    }

    this.write(message);
    if (isRun) {
      this.write(Shell.END_FLAG);
      this.write(os.EOL);
    }
  }
  clear(): void {
    this.ptyProcess?.clear();
  }
  init(options?: IShellRunOptions): void {
    this.ptyProcess = pty.spawn(this._terminal, this.args, {
      name: this.name,
      cols: options?.cols || 100,
      rows: options?.rows || 30,
      cwd: options?.path || process.cwd(),
      env: {
        ...this.env,
        ...this.parseEnv(options?.env),
      },
    });

    this.ptyProcess.onData((data) => {
      this.eventBus.emit(this._event_name_data, data);
    });

    this.ptyProcess.onExit((result) => {
      this.logger.info(`${this.name} shell exit`);
      this.eventBus.emit(this._event_name_exit, result);
    });
  }

  isInit(): boolean {
    return !!this.ptyProcess;
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

  async run(
    params: IShellRunParams,
    options?: IShellRunOptions,
  ): Promise<string> {
    if (!this.isInit()) {
      this.init(options);
    }

    params = await this.activate(params);
    let msg = this.buildCmd(params);
    msg = mirrorUrl(msg);

    this.logger.info(msg);

    if (options?.sudo) {
      await fs.promises.mkdir(this.env['TEMP']!, { recursive: true });
      return new Promise((resolve, reject) => {
        this.logger.info(`sudo ${msg}`);

        let oldEnv = {
          ...process.env,
        };
        sudoPrompt.exec(
          msg,
          {
            name: this._ctx.appName,
          },
          (error, stdout, stderr) => {
            if (error) {
              reject(error);
            } else if (stderr) {
              reject(stderr);
            } else {
              resolve(stdout as string);
            }
          },
        );

        // Immediately revert env back to original
        Object.keys(process.env).forEach((key) => {
          if (!(key in oldEnv)) {
            delete process.env[key];
          }
        });
        Object.assign(process.env, oldEnv);
      });
    }

    return new Promise((resolve, reject) => {
      let stream: string = '';
      const off = this.onShellData((data) => {
        stream += data;

        const reg = /^(\d+)$/m;

        const match = stream.match(reg); // 假设退出状态是输出的最后一部分

        if (match && match.length > 0) {
          const exitStatus = parseInt(match[1], 10);
          off();
          this.clear();

          const result = stream
            .replace(reg, '')
            // TODO 多余标记没有清除
            .replaceAll(Shell.END_FLAG, '');

          if (exitStatus === 0) {
            this.kill();
            resolve(result);
          } else {
            this.kill();
            reject(new Error(result));
          }
        }
      });

      this.send(msg, true);
    });
  }

  private buildCmd(params: IShellRunParams) {
    if (typeof params.message === 'string') {
      return params.message;
    }

    if (Array.isArray(params.message)) {
      let delimiter = ' && ';
      return params.message
        .filter((m) => {
          return m && !/^\s+$/.test(m);
        })
        .join(delimiter);
    }

    return '';
  }

  private async activate(params: IShellRunParams) {
    let condaPath: string | undefined,
      condaName: string | undefined,
      condaPython = 'python=3.10',
      condaArgs: string | undefined;

    if (params?.conda) {
      if (typeof params.conda === 'string') {
        condaPath = params.conda;
      } else if (params.conda.skip) {
        condaArgs = params.conda.args;
      } else {
        condaArgs = params.conda.args;
        condaPath = params.conda.path;
        condaName = params.conda.name;
        condaPython = params.conda.python || condaPython;
      }
    } else {
      condaName = 'base';
    }

    // 2. condaActivation
    let condaActivation: string[] = [];
    if (condaPath) {
      const envPath = path.resolve(params?.path || '', condaPath);
      const envExists = Shell.exists(envPath);

      if (envExists) {
        condaActivation = [
          isWin32() ? 'conda_hook' : `eval "$(conda shell.bash hook)"`,
          `conda deactivate`,
          `conda deactivate`,
          `conda deactivate`,
          `conda activate ${envPath}`,
        ];
      } else {
        condaActivation = [
          isWin32() ? 'conda_hook' : `eval "$(conda shell.bash hook)"`,
          `conda create -y -p ${envPath} ${condaPython} ${condaArgs ? condaArgs : ''}`,
          `conda deactivate`,
          `conda deactivate`,
          `conda deactivate`,
          `conda activate ${envPath}`,
        ];
      }
    } else if (condaName) {
      if (condaName === 'base') {
        condaActivation = [
          isWin32() ? 'conda_hook' : `eval "$(conda shell.bash hook)"`,
          `conda deactivate`,
          `conda deactivate`,
          `conda deactivate`,
          `conda activate ${condaName}`,
        ];
      } else {
        let envs_path = path.resolve(
          this._ctx.homeDir,
          'bin',
          'miniconda/envs',
        );
        let env_path = path.resolve(envs_path, condaName);
        let env_exists = Shell.exists(env_path);
        if (env_exists) {
          condaActivation = [
            isWin32() ? 'conda_hook' : `eval "$(conda shell.bash hook)"`,
            `conda deactivate`,
            `conda deactivate`,
            `conda deactivate`,
            `conda activate ${condaName}`,
          ];
        } else {
          condaActivation = [
            isWin32() ? 'conda_hook' : `eval "$(conda shell.bash hook)"`,
            `conda create -y -n ${condaName} ${condaPython} ${condaArgs ? condaArgs : ''}`,
            `conda deactivate`,
            `conda deactivate`,
            `conda deactivate`,
            `conda activate ${condaName}`,
          ];
        }
      }
    } else {
      // no conda name or conda path => means don't activate any env
      condaActivation = [];
    }

    this.env['CONDA_AUTO_ACTIVATE_BASE'] = 'false';
    this.env['PYTHONNOUSERSITE'] = '1';

    // 2. venv
    let venvActivation: string[] = [];
    if (params.venv && params.path) {
      let env_path = path.resolve(params.path, params.venv);
      let activate_path = isWin32()
        ? path.resolve(env_path, 'Scripts', 'activate')
        : path.resolve(env_path, 'bin', 'activate');
      let env_exists = Shell.exists(env_path);
      if (env_exists) {
        venvActivation = [
          isWin32()
            ? `${activate_path} ${env_path}`
            : `source ${activate_path} ${env_path}`,
        ];
      } else {
        venvActivation = [
          `python -m venv ${env_path}`,
          isWin32()
            ? `${activate_path} ${env_path}`
            : `source ${activate_path} ${env_path}`,
        ];
      }
    } else {
      venvActivation = [];
    }

    // 3. construct params.message
    params.message = condaActivation
      .concat(venvActivation)
      .concat(params.message);
    return params;
  }

  private parseEnv(env?: { [key: string]: string }): { [key: string]: string } {
    if (!env) {
      return {};
    }

    let PATH_KEY;
    if (env['Path']) {
      PATH_KEY = 'Path';
    } else if (env['PATH']) {
      PATH_KEY = 'PATH';
    }

    const result: { [key: string]: string } = {};

    if (isWin32()) {
      // ignore
    } else if (PATH_KEY) {
      result[PATH_KEY] =
        // shellEnvSync()['PATH'] ||
        [
          './node_modules/.bin',
          '/.nodebrew/current/bin',
          '/usr/local/bin',
          this.env[PATH_KEY],
        ].join(':');
    }

    for (let envKey in env) {
      const val = env[envKey];

      if (envKey.toLowerCase() === 'path' && PATH_KEY) {
        // "path" is a special case => merge with process.env.PATH
        if (env['path'] && Array.isArray(env['path'])) {
          result[PATH_KEY] =
            `${env['path'].join(path.delimiter)}${path.delimiter}${result[PATH_KEY]}`;
        }
        if (env['PATH'] && Array.isArray(env['PATH'])) {
          result[PATH_KEY] =
            `${env['PATH'].join(path.delimiter)}${path.delimiter}${result[PATH_KEY]}`;
        }
        if (env['Path'] && Array.isArray(env['Path'])) {
          result[PATH_KEY] =
            `${env['Path'].join(path.delimiter)}${path.delimiter}${result[PATH_KEY]}`;
        }
      } else if (Array.isArray(val)) {
        if (env[envKey]) {
          result[envKey] =
            `${val.join(path.delimiter)}${path.delimiter}${env[envKey]}`;
        } else {
          result[envKey] = `${val.join(path.delimiter)}`;
        }
      } else {
        // for the rest of attributes, simply set the values
        result[envKey] = env[envKey];
      }
    }

    for (let key in result) {
      if (
        !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) &&
        key !== 'ProgramFiles(x86)'
      ) {
        delete result[key];
      }
      if (/[\r\n]/.test(result[key])) {
        delete result[key];
      }
    }

    return result;
  }
}
