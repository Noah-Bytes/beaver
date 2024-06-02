import { getShellFlow } from './get-shell-flow';

describe('registry 测试', () => {
  const shellFlow = getShellFlow();

  beforeAll(async () => {
    await shellFlow.init();
  });

  it('registry 是否安装', async () => {
    const result = await shellFlow.bin.checkIsInstalled('registry');
    console.log(result);
  });

  it('registry 安装', async () => {
    const registry = shellFlow.bin.getModule('registry');
    if (registry) {
      await registry.install();
    }
  });
});
