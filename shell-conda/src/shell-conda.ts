import { ActionUse, mirror } from '@beaver/action-core';
import { exec } from '@beaver/action-exec';
import { exists } from '@beaver/action-io';
import { isDarwin, isWin32 } from '@beaver/arteffix-utils';
import { platform } from '@beaver/system-info';
import {
  ExecOptions,
  IActionShellCondaOptions,
  IKey,
  IWithForShellConda,
} from '@beaver/types';
import * as path from 'path';
import * as process from 'process';
// import { shellEnvSync } from 'shell-env';

export function shellPathSync() {
  // const { PATH } = shellEnvSync();
  // return PATH;
  return {};
}

/**
 * 环境变量设置，ARTEFFIX_HOME，ARTEFFIX_MIRROR
 */
export class ShellConda extends ActionUse<IWithForShellConda> {
  private readonly env: Record<string, string>;
  private readonly _terminal: string;
  private readonly _args: string[];
  private minicondaDir: string;

  static PATHS = {
    darwin: [
      'miniconda/etc/profile.d',
      'miniconda/bin',
      'miniconda/condabin',
      'miniconda/lib',
      'miniconda/Library/bin',
      'miniconda/pkgs',
      'miniconda',

      'homebrew/bin',
      'homebrew/Cellar',
    ],
    win32: [
      'miniconda/etc/profile.d',
      'miniconda/bin',
      'miniconda/Scripts',
      'miniconda/condabin',
      'miniconda/lib',
      'miniconda/Library/bin',
      'miniconda/pkgs',
      'miniconda',

      'homebrew/bin',
      'homebrew/Cellar',
    ],
    linux: [
      'miniconda/etc/profile.d',
      'miniconda/bin',
      'miniconda/condabin',
      'miniconda/lib',
      'miniconda/Library/bin',
      'miniconda/pkgs',
      'miniconda',

      'homebrew/bin',
      'homebrew/Cellar',
    ],
  };

  constructor(params: IWithForShellConda, options?: IActionShellCondaOptions) {
    super(params, options);
    this.with = params;
    this.minicondaDir = path.resolve(this.home, 'bin', 'miniconda');
    if (isWin32) {
      this._terminal = 'cmd.exe';
      /**
       * 参数解释
       * --NoProfile 不加载用户的配置文件
       */
      this._args = ['/D'];
    } else {
      this._terminal = '/bin/bash';
      /**
       * 参数解释
       * --noprofile 启动shell时不读取用户的登录shell配置文件（如.bash_profile、.profile等）。
       * --norc 启动shell时不读取.bashrc文件。.bashrc是非登录shell的配置文件，通常包含命令别名、函数定义等。
       */
      this._args = ['--noprofile', '--norc'];
    }

    this.env = this.parseEnv({
      ...this.getDefaultEnv(),
      ...(params.envs || {}),
    });
  }

  private getDefaultEnv() {
    const env = Object.assign({}, process.env) as Record<
      string,
      string | string[]
    >;

    // 用于指定 Python 模块搜索路径的环境变量。当你使用 Python 运行脚本或程序时，解释器会在 PYTHONPATH 中指定的路径下搜索模块，以便找到并加载对应的模块。
    if (env['PYTHONPATH']) {
      delete env['PYTHONPATH'];
    }

    // CMake 构建系统中的一个环境变量，用于指定用于执行构建命令的程序。
    if (env['CMAKE_MAKE_PROGRAM']) {
      delete env['CMAKE_MAKE_PROGRAM'];
    }

    //  CMake 的环境变量，用于指定生成项目的工程文件的生成器
    if (env['CMAKE_GENERATOR']) {
      delete env['CMAKE_GENERATOR'];
    }

    // 设置 CMake 构建过程中对象文件路径的最大长度，以避免文件路径过长的问题。
    env['CMAKE_OBJECT_PATH_MAX'] = '1024';

    // 用于控制 Conda 是否在终端启动时自动激活 base 环境
    env['CONDA_AUTO_ACTIVATE_BASE'] = 'true';
    // 环境变量允许你控制 Python 解释器是否搜索和加载用户级 site-packages 目录中的模块。通过启用或禁用该环境变量，你可以灵活控制 Python 的模块搜索路径，以满足特定的需求或应用场景。
    env['PYTHONNOUSERSITE'] = '1';

    if (process.env['ARTEFFIX_MIRROR']) {
      // 指定 pip 的主索引 URL，这里设置为清华大学的 PyPI 镜像。
      env['PIP_INDEX_URL'] = 'https://pypi.tuna.tsinghua.edu.cn/simple';
      // 指定 pip 的额外索引 URL，这里设置为阿里云的 PyPI 镜像。
      env['PIP_EXTRA_INDEX_URL'] = 'https://mirrors.aliyun.com/pypi/simple';
    }

    const OVERRIDE_ENV_NAME = [
      // 用于存储 Hugging Face 相关数据的缓存目录。
      'HF_HOME',
      // 用于存储 PyTorch 相关数据的缓存目录。
      'TORCH_HOME',
      // 用于存储 Homebrew 相关数据的缓存目录。
      'HOMEBREW_CACHE',

      // 通用的缓存目录，遵循 XDG Base Directory 规范。
      'XDG_CACHE_HOME',
      // 用户配置文件的存储目录，遵循 XDG Base Directory 规范。
      'XDG_CONFIG_HOME',
      // 用户数据文件的存储目录，遵循 XDG Base Directory 规范。
      'XDG_DATA_HOME',
      // 用户状态文件的存储目录，遵循 XDG Base Directory 规范。
      'XDG_STATE_HOME',

      // pip 的缓存目录，用于存储下载的包
      'PIP_CACHE_DIR',
      // pip 的配置文件路径，用于指定 pip 的配置文件位置
      'PIP_CONFIG_FILE',
      // pip 的临时目录，用于临时文件
      'PIP_TMPDIR',

      // 系统临时目录，用于通用的临时文件存储。
      'TMPDIR',
      'TEMP',
      'TMP',

      // Gradio 的临时目录，用于存储临时数据。
      'GRADIO_TEMP_DIR',
    ];

    OVERRIDE_ENV_NAME.forEach((name) => {
      env[name] = path.resolve(this.home, 'cache', name);
    });

    const binPath = path.join(this.home, 'bin');

    env['CONDA_PREFIX'] = this.minicondaDir;
    env['PYTHON'] = path.resolve(this.minicondaDir, 'python');
    env['PATH'] = ShellConda.PATHS[platform].map((p) =>
      path.resolve(binPath, p),
    );

    Object.assign(env, {
      HOMEBREW_PREFIX: path.join(binPath, 'homebrew'),
      HOMEBREW_CELLAR: path.join(binPath, 'homebrew', 'Cellar'),
      HOMEBREW_REPOSITORY: path.join(binPath, 'homebrew'),
      HOMEBREW_CACHE: path.join(binPath, 'homebrew', 'cache'),
    });

    if (isWin32) {
      Object.assign(env, {
        CONDA_BAT: path.join(this.minicondaDir, 'condabin/conda.bat'),
        CONDA_EXE: path.join(this.minicondaDir, 'Scripts/conda.exe'),
        CONDA_PYTHON_EXE: path.join(this.minicondaDir, 'Scripts/python'),
      });
    }

    if (isDarwin) {
      Object.assign(env, {
        TCL_LIBRARY: path.join(this.minicondaDir, 'lib/tcl8.6'),
        TK_LIBRARY: path.join(this.minicondaDir, 'lib/tk8.6'),
      });
    }
    return env;
  }

  private parseEnv(env?: IKey<string | string[]>): IKey<string> {
    const _env = Object.assign({}, process.env) as Record<string, string>;

    let PATH_KEY: string | undefined;
    if (_env['Path']) {
      PATH_KEY = 'Path';
    } else if (_env['PATH']) {
      PATH_KEY = 'PATH';
    }

    const result: Record<string, string> = {};

    if (isWin32) {
      // ignore
    } else if (PATH_KEY) {
      // @ts-ignore
      result[PATH_KEY] =
        shellPathSync() ||
        [
          './node_modules/.bin',
          '/.nodebrew/current/bin',
          '/usr/local/bin',
          _env[PATH_KEY],
        ].join(':');
    }

    if (env) {
      for (let envKey in env) {
        const val = env[envKey];

        if (envKey.toLowerCase() === 'path' && PATH_KEY) {
          // "path" is a special case => merge with process.env.PATH
          if (env['path'] && Array.isArray(env['path'])) {
            result[PATH_KEY] =
              `${env['path'].join(path.delimiter)}${path.delimiter}${_env[PATH_KEY]}`;
          }
          if (env['PATH'] && Array.isArray(env['PATH'])) {
            result[PATH_KEY] =
              `${env['PATH'].join(path.delimiter)}${path.delimiter}${_env[PATH_KEY]}`;
          }
          if (env['Path'] && Array.isArray(env['Path'])) {
            result[PATH_KEY] =
              `${env['Path'].join(path.delimiter)}${path.delimiter}${_env[PATH_KEY]}`;
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
          result[envKey] = val;
        }
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

  private async initEnv(env = 'base') {
    let condaPython = 'python=3.10',
      // TODO 预留后续扩展
      condaArgs: string | undefined;

    if (env !== 'base') {
      const envPath = path.resolve(this.home, 'bin', 'miniconda/envs', env);
      const result = await exists(envPath);
      if (!result) {
        await exec(
          [
            isWin32 ? 'conda_hook' : `eval "$(conda shell.bash hook)"`,
            `conda create -y -n ${env} ${condaPython} ${condaArgs ? condaArgs : ''}`,
          ].join(' && '),
          this._args,
          this.getOptions(),
        );
      }
    }
  }

  private async getVenv(params: { venv?: string; path?: string }) {
    if (!(params.venv && params.path)) {
      return [];
    }

    const envPath = path.resolve(this.home, params.path, params.venv);
    const activatePath = isWin32
      ? path.resolve(envPath, 'Scripts', 'activate')
      : path.resolve(envPath, 'bin', 'activate');
    const result = await exists(envPath);

    const commands: string[] = [];

    if (!result) {
      commands.push(`python -m venv ${envPath}`);
    }

    commands.push(
      isWin32
        ? `${activatePath} ${envPath}`
        : `source ${activatePath} ${envPath}`,
    );

    return commands;
  }

  private buildCmd(commands: string[]) {
    let delimiter = ' && ';
    return commands
      .filter((m) => {
        return m && !/^\s+$/.test(m);
      })
      .join(delimiter);
  }

  private getOptions(): ExecOptions {
    return {
      env: this.env,
      cwd: this.with?.path
        ? path.resolve(this.home, this.with.path)
        : this.home,
      outStream: this.outStream,
      errStream: this.errStream,
      windowsVerbatimArguments: true,
    };
  }

  override async run(): Promise<string> {
    // step1. check and create conda env
    await this.initEnv(this.with.env);

    // step2. get python venv

    const pyCommands = await this.getVenv({
      venv: this.with.venv,
      path: this.with.path,
    });

    // step3. create command
    let commands = [
      isWin32 ? 'conda_hook' : `eval "$(conda shell.bash hook)"`,
      `conda deactivate`,
      `conda deactivate`,
      `conda deactivate`,
      `conda activate ${this.with.env || 'base'}`,
    ].concat(pyCommands);

    if (Array.isArray(this.with.run)) {
      commands = commands.concat(this.with.run);
    } else {
      commands = commands.concat([this.with.run]);
    }
    let command = this.buildCmd(commands);

    // step4. check mirror
    command = mirror(command);

    // step5. run
    return await exec(command, [], this.getOptions());
  }
}
