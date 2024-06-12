import { Systeminformation } from 'systeminformation';

export interface ISystemInfoTypes {
  /**
   * 平台
   */
  platform: 'win32' | 'linux' | 'darwin';

  /**
   * 电脑位数
   */
  arch: 'x64' | 'arm64';

  /**
   * 显卡信息
   */
  graphics: Systeminformation.GraphicsData | undefined;

  /**
   * 系统信息
   */
  system: Systeminformation.SystemData | undefined;

  /**
   * CPU信息
   */
  cpu: Systeminformation.CpuData | undefined;

  /**
   * 操作系统信息
   */
  os: Systeminformation.OsData | undefined;

  /**
   * 内存信息
   */
  mem: Systeminformation.MemData | undefined;

  GPUs: string[] | undefined;
  GPU: string | undefined;

  init(): Promise<void>;

  refresh(): Promise<void>;
}
