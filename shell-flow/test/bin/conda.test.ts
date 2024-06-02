import { getShellFlow } from './get-shell-flow';

describe('conda 测试', () => {
  const shellFlow = getShellFlow();

  beforeAll(async () => {
    await shellFlow.init();
  });

  it('conda 安装', async () => {
    const conda = shellFlow.bin.getModule('conda');
    if (conda) {
      await conda.install();
    }
  });

  it('conda 是否安装', async () => {
    const conda = shellFlow.bin.getModule('conda');
    if (conda) {
      console.log(await conda.installed());
    }
  });

  it('conda 卸载', async () => {
    const conda = shellFlow.bin.getModule('conda');
    if (conda) {
      await conda.uninstall();
    }
  });

  it('conda set mirror', async () => {
    const conda = shellFlow.bin.getModule('conda');
    if (conda) {
      // @ts-ignore
      await conda.setMirror();
    }
  });
});
