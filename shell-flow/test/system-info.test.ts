import { SystemInfo } from '../src/system-info';

describe('system-info 系统信息', () => {
  let systemInfo: SystemInfo = new SystemInfo();
  beforeAll(async () => {
    await systemInfo.init();
  });

  it('获取系统信息', () => {
    const info = systemInfo?.system;
    expect(info).toBeDefined();
    expect(info?.manufacturer).toBeDefined();
    expect(info?.model).toBeDefined();
    expect(info?.serial).toBeDefined();
    expect(info?.uuid).toBeDefined();
  });

  it('获取CPU信息', () => {
    const info = systemInfo?.cpu;
    console.log(info);
  });

  it('获取内存信息', () => {
    const info = systemInfo?.mem;
    console.log(info);
  });

  it('获得GPU', () => {
    const info = systemInfo?.GPU;
    console.log(info);
  });
});
