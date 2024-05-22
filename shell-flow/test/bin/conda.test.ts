import { ShellFlow } from '../../src';
import { Conda } from '../../src/bin/module/conda';

jest.setTimeout(1000000);

describe('conda 测试', () => {
  const shellFlow = new ShellFlow('Beaver', {
    isMirror: true,
    homeDir: '/Users/taibai/Documents/我的智流.shell',
  });
  const conda = new Conda(shellFlow);

  beforeAll(async () => {
    await shellFlow.init();
  });

  it('conda 安装', async () => {
    await conda.install();
  });

  it('conda 是否安装', async () => {
    console.log(shellFlow)
    console.log(conda.installed());
  });

  it('conda 卸载', async () => {
    await conda.uninstall();
  });
});
