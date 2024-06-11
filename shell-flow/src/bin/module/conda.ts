import { ActionFs } from '@beaver/action-fs';
import { isWin32 } from '@beaver/arteffix-utils';
import { ShellConda } from '@beaver/shell-conda';
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
    const { systemInfo, bin, homeDir, outStream, errStream } = this._ctx;

    outStream.write('start install conda');
    if (this.installed()) {
      outStream.write('conda is installed');
      return;
    }

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
      throw new Error(`not exists: ${installUrl}`);
    }
    const installer = Conda.INSTALLER[systemInfo.platform];
    await bin.download(installUrl, installer);

    // 2. run the script
    const installPath = path.resolve(bin.dir, 'miniconda');
    const cmd = isWin32
      ? `start /wait ${installer} /InstallationType=JustMe /RegisterPython=0 /S /D=${installPath}`
      : `/bin/bash ${installer} -b -p ${installPath}`;

    await this.runNotConda(cmd);

    await this.setMirror();

    await this.run([
      // 使得每次创建新环境时，都会自动安装Python 3.10
      'conda config --add create_default_packages python=3.10',
      // 从Conda Forge频道安装pip、brotli和brotlipy这三个包
      'conda install -y -c conda-forge pip brotli brotlipy',
    ]);

    if (isWin32) {
      const actionFs = new ActionFs({
        home: homeDir,
        type: 'copy',
        from: 'python.exe',
        to: 'python3.exe',
        path: 'bin/miniconda',
      });
      await actionFs.run();
    }
    // 3. remove the installer
    await bin.rm(installer);
  }

  async setMirror() {
    const { options } = this._ctx;
    // setting mirror
    if (!!options?.mirror) {
      await this.run([
        'conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/',
        'conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/',
        'conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/bioconda/',
        'conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/menpo/',
        'conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/',
        'conda config --set show_channel_urls yes',
      ]);
    }
  }

  override installed(): boolean {
    const { bin, systemInfo } = this._ctx;

    if (this.isInstalled) {
      return true;
    }

    // @ts-ignore
    for (let p of Conda.PATHS[systemInfo.platform]) {
      if (bin.exists(p)) {
        this.isInstalled = true;
        break;
      }
    }
    return this.isInstalled;
  }

  override async uninstall() {
    const { bin } = this._ctx;
    await bin.rm(path.resolve(bin.dir, 'miniconda'));
  }

  async clean() {
    await new ShellConda({
      home: this._ctx.homeDir,
      run: `conda clean --all -y`,
    }).run();
  }
}
