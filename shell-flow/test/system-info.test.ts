import { SystemInfo } from '../src';

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
    expect(info).toBeDefined;
  });

  it('获取内存信息', () => {
    const info = systemInfo?.mem;
    expect(info).toBeDefined;
  });

  it('获得GPU', () => {
    const info = systemInfo?.GPU;
    expect(info).toBeDefined;
  });
});
