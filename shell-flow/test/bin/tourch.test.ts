import { ShellFlow } from '../../src';
import { Torch } from '../../src/bin/module/torch';

jest.setTimeout(1000000);

describe('torch 测试', () => {
  const shellFlow = new ShellFlow('Beaver', {
    homeDir: '/Users/taibai/workspace/beaver/beaver',
    isMirror: true,
  });
  const torch = new Torch(shellFlow);

  it('torch 安装', async () => {
    await torch.install();
  });

  it('torch 是否安装', async () => {
    console.log(torch.installed());
  });

  it('torch 卸载', async () => {
    await torch.uninstall();
  });
});
