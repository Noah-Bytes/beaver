import { getShellFlow } from './get-shell-flow';

describe('vs 测试', () => {
  const shellFlow = getShellFlow();

  beforeAll(async () => {
    await shellFlow.init();
  });

  it('vs 安装', async () => {
    const vs = shellFlow.bin.getModule('vs');
    if (vs) {
      await vs.install();
    }
  });

  it('vs 是否安装', async () => {
    const vs = shellFlow.bin.getModule('vs');
    if (vs) {
      const result = await vs.installed()
      console.log(result);
    }
  });

  it('vs 卸载', async () => {
    const vs = shellFlow.bin.getModule('vs');
    if (vs) {
      await vs.uninstall();
    }
  });
});
