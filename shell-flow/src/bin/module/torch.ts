import type { IShellTypes } from '@beaver/shell-flow';
import { IBinModuleTypes, ShellFlow } from '@beaver/shell-flow';

export class Torch implements IBinModuleTypes {
  readonly dependencies: string[] = ['conda'];
  private readonly _ctx: ShellFlow;
  readonly shell: IShellTypes;

  constructor(ctx: ShellFlow) {
    this._ctx = ctx;
    this.shell = ctx.shell.createShell('torch');
  }

  async install(): Promise<void> {
    const { options } = this._ctx;
    const {
      systemInfo: { platform, GPUs },
    } = this._ctx;
    let cmd;

    switch (platform) {
      case 'darwin':
        cmd = 'pip3 install torch torchvision torchaudio';
        break;
      case 'win32':
        if (GPUs?.includes('nvidia')) {
          cmd =
            'pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118';
        } else if (
          GPUs?.includes('amd') ||
          GPUs?.includes('advanced micro devices')
        ) {
          cmd = 'pip3 install torch torchvision torchaudio';
        } else {
          cmd = 'pip3 install torch torchvision torchaudio';
        }
        break;
      case 'linux':
        if (GPUs?.includes('nvidia')) {
          cmd =
            'pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118';
        } else if (
          GPUs?.includes('amd') ||
          GPUs?.includes('advanced micro devices')
        ) {
          cmd =
            'pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.4.2';
        } else {
          cmd =
            'pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu';
        }
        break;
    }
    await this.shell.run({
      message: options?.isMirror
        ? `${cmd} -i https://pypi.mirrors.ustc.edu.cn/simple/`
        : cmd,
    });
  }

  async installed(): Promise<boolean> {
    const { bin } = this._ctx;
    if (bin.hasModule('conda')) {
      return !!bin.getModule('conda')?.exists?.('torch*');
    }

    return false;
  }

  async uninstall(): Promise<void> {
    await this.shell.run({
      message: 'pip3 uninstall torch torchvision torchaudio',
    });
  }
}
