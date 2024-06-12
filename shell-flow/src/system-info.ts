import os from 'os';
import systemInfo, { Systeminformation } from 'systeminformation';
import { ISystemInfoTypes } from './types';

export class SystemInfo implements ISystemInfoTypes {
  get platform(): 'win32' | 'linux' | 'darwin' {
    return this._platform;
  }
  get arch(): 'x64' | 'arm64' {
    return this._arch;
  }
  private readonly _platform: 'win32' | 'linux' | 'darwin';
  get os(): Systeminformation.OsData | undefined {
    return this._os;
  }
  get mem(): Systeminformation.MemData | undefined {
    return this._mem;
  }
  get cpu(): Systeminformation.CpuData | undefined {
    return this._cpu;
  }
  get system(): Systeminformation.SystemData | undefined {
    return this._system;
  }

  get graphics(): Systeminformation.GraphicsData | undefined {
    return this._graphics;
  }

  get GPU(): string | undefined {
    return this._GPU;
  }
  get GPUs(): string[] | undefined {
    return this._GPUs;
  }

  constructor() {
    this._platform = os.platform() as 'win32' | 'linux' | 'darwin';
    this._arch = os.arch() as 'x64' | 'arm64';
  }

  private readonly _arch: 'x64' | 'arm64';

  private _os: Systeminformation.OsData | undefined;
  private _shell: string | undefined;

  private _GPUs: string[] | undefined;
  private _GPU: string | undefined;
  private _graphics: Systeminformation.GraphicsData | undefined;
  private _system: Systeminformation.SystemData | undefined;
  private _cpu: Systeminformation.CpuData | undefined;
  private _mem: Systeminformation.MemData | undefined;

  async init(): Promise<void> {
    this._system = await systemInfo.system();
    await this.refresh();
  }

  async refresh(): Promise<void> {
    [this._graphics, this._cpu, this._mem, this._os, this._shell] =
      await Promise.all([
        systemInfo.graphics(),
        systemInfo.cpu(),
        systemInfo.mem(),
        systemInfo.osInfo(),
        systemInfo.shell(),
        this.gpu(),
      ]);
  }

  async gpu() {
    let gpus: string[];
    if (
      this.graphics &&
      this.graphics.controllers &&
      this.graphics.controllers.length > 0
    ) {
      gpus = this.graphics.controllers.map((x) => {
        return x.vendor.toLowerCase();
      });
    } else {
      gpus = [];
    }

    let is_nvidia = gpus.find((gpu) => /nvidia/i.test(gpu));
    let is_amd = gpus.find((gpu) => /(amd|advanced micro devices)/i.test(gpu));
    let is_apple = gpus.find((gpu) => /apple/i.test(gpu));

    let gpu: string;
    if (is_nvidia) {
      gpu = 'nvidia';
    } else if (is_amd) {
      gpu = 'amd';
    } else if (is_apple) {
      gpu = 'apple';
    } else if (gpus.length > 0) {
      gpu = gpus[0];
    } else {
      gpu = 'none';
    }

    this._GPUs = gpus;
    this._GPU = gpu;
  }
}
