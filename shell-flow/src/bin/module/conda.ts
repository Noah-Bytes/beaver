import { isDarwin, isWin32 } from '@beaver/arteffix-utils';
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import { ShellFlow } from '../../shell-flow';
import { BinModule } from './bin-module';

interface PlatformUrls {
  [key: string]: {
    x64?: string;
    arm64?: string;
  };
}

/**
 * conda是一款软件管理软件，相当于windows里面的应用商店。miniconda和anaconda中都包含了conda
 * miniconda windows 64位安装包大小为51.4 Mb，只包含了conda、python、和一些必备的软件工具
 * anaconda windows 64位安装包大小为462 Mb，是miniconda的扩展，包含了数据科学和机器学习要用到的很多软件
 */
export class Conda extends BinModule {
  static URLS: PlatformUrls = {
    darwin: {
      x64: 'https://repo.anaconda.com/miniconda/Miniconda3-py310_24.4.0-0-MacOSX-x86_64.sh',
      arm64:
        'https://repo.anaconda.com/miniconda/Miniconda3-py310_24.4.0-0-MacOSX-arm64.sh',
    },
    win32: {
      x64: 'https://repo.anaconda.com/miniconda/Miniconda3-py310_24.4.0-0-Windows-x86_64.exe',
    },
    linux: {
      x64: 'https://repo.anaconda.com/miniconda/Miniconda3-py310_24.4.0-0-Linux-x86_64.sh',
      arm64:
        'https://repo.anaconda.com/miniconda/Miniconda3-py310_24.4.0-0-Linux-aarch64.sh',
    },
  };
  static INSTALLER = {
    darwin: 'installer.sh',
    win32: 'installer.exe',
    linux: 'installer.sh',
  };

  static PATHS = {
    darwin: [
      'miniconda/etc/profile.d',
      'miniconda/bin',
      'miniconda/condabin',
      'miniconda/lib',
      'miniconda/Library/bin',
      'miniconda/pkgs',
      'miniconda',
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
    ],
    linux: [
      'miniconda/etc/profile.d',
      'miniconda/bin',
      'miniconda/condabin',
      'miniconda/lib',
      'miniconda/Library/bin',
      'miniconda/pkgs',
      'miniconda',
    ],
  };

  constructor(ctx: ShellFlow) {
    super('conda', ctx);
  }

  env() {
    const { bin, systemInfo } = this._ctx;
    const baseDir = path.resolve(bin.dir, 'miniconda');
    const base = {
      CONDA_PREFIX: baseDir,
      PYTHON: path.join(baseDir, 'python'),
      PATH: Conda.PATHS[systemInfo.platform].map((p) =>
        path.resolve(bin.dir, p),
      ),
    };

    if (isWin32) {
      Object.assign(base, {
        CONDA_BAT: path.join(baseDir, 'condabin/conda.bat'),
        CONDA_EXE: path.join(baseDir, 'Scripts/conda.exe'),
        CONDA_PYTHON_EXE: path.join(baseDir, 'Scripts/python'),
      });
    }

    if (isDarwin) {
      Object.assign(base, {
        TCL_LIBRARY: path.join(baseDir, 'lib/tcl8.6'),
        TK_LIBRARY: path.join(baseDir, 'lib/tk8.6'),
      });
    }

    return base;
  }

  async exists(pattern: string): Promise<boolean> {
    const { systemInfo, bin } = this._ctx;

    const pathList = Conda.PATHS[systemInfo.platform];
    for (let p of pathList) {
      const found = await glob(pattern, {
        cwd: path.resolve(bin.dir, p),
      });
      if (found && found.length > 0) {
        return true;
      }
    }

    return false;
  }

  override async install(): Promise<void> {
    if (this.installed()) {
      return;
    }
    const { systemInfo, bin, options } = this._ctx;

    if (!Conda.URLS[systemInfo.platform]) {
      throw new Error(
        `Current platform is not supported: ${systemInfo.platform}`,
      );
    }

    if (!Conda.URLS[systemInfo.platform][systemInfo.arch]) {
      throw new Error(`Current platform is not supported: ${systemInfo.arch}`);
    }

    // 1. download
    const installUrl = Conda.URLS[systemInfo.platform][systemInfo.arch];
    if (!installUrl) {
      bin.logger.error(`not exists: ${installUrl}`);
      throw new Error(`not exists: ${installUrl}`);
    }
    const installer = Conda.INSTALLER[systemInfo.platform];

    bin.logger.info(`Download: ${installUrl}`);
    await bin.download(installUrl, installer);

    bin.logger.info(`Running ${installer}`);

    // 2. run the script
    const installPath = path.resolve(bin.dir, 'miniconda');
    const cmd = isWin32
      ? `start /wait ${installer} /InstallationType=JustMe /Regi sterPython=0 /S /D=${installPath}`
      : `bash ${installer} -b -p ${installPath}`;

    bin.logger.info(cmd);

    await this.shell.run(
      {
        message: cmd,
        conda: {
          skip: true,
        },
      },
      {
        path: bin.dir,
      },
    );

    await this.setMirror();

    bin.logger.info('start set config create_default_packages');

    await this.shell.run({
      message: [
        // 使得每次创建新环境时，都会自动安装Python 3.10
        'conda config --add create_default_packages python=3.10',
        // 从Conda Forge频道安装pip、brotli和brotlipy这三个包
        'conda install -y -c conda-forge pip brotli brotlipy',
      ],
    });

    if (isWin32) {
      bin.logger.info('python.exe to python3.exe');
      await fs.promises.copyFile(
        path.resolve(bin.dir, 'miniconda', 'python.exe'),
        path.resolve(bin.dir, 'miniconda', 'python3.exe'),
      );
    }

    bin.logger.info('conda installed');

    // 3. remove the installer
    await bin.rm(installer);
  }

  async setMirror() {
    const { bin, options } = this._ctx;
    // setting mirror
    if (options?.isMirror) {
      bin.logger.info('start set config mirror');
      const resp = await this.shell.run({
        message: [
          'conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/',
          'conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/',
          'conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/bioconda/',
          'conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/menpo/',
          'conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/',
          'conda config --set show_channel_urls yes',
        ],
      });
    }
  }

  override installed(): boolean {
    const { bin, systemInfo } = this._ctx;
    // @ts-ignore
    for (let p of Conda.PATHS[systemInfo.platform]) {
      if (bin.exists(p)) return true;
    }
    return false;
  }

  onstart(): string[] {
    if (isWin32) {
      return ['conda_hook'];
    }

    return ['eval "$(conda shell.bash hook)"'];
  }

  override async uninstall() {
    const { bin } = this._ctx;
    await bin.rm(path.resolve(bin.dir, 'miniconda'));
  }

  async clean() {
    await this.shell.run({
      message: 'conda clean --all -y',
    });
  }

}
