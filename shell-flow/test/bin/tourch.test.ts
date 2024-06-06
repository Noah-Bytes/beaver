import { spawn } from 'child_process';
import { getShellFlow } from './get-shell-flow';

jest.setTimeout(1000000);

describe('torch 测试', () => {
  const shellFlow = getShellFlow();

  beforeAll(async () => {
    await shellFlow.init();
  });

  it('torch 安装', async () => {
    const torch = shellFlow.bin.getModule('torch');
    if (torch) {
      await torch.install();
    }
  });

  it('torch 是否安装', async () => {
    const torch = shellFlow.bin.getModule('torch');
    if (torch) {
      const result = await torch.installed();
      console.log(result);
    }
  });

  it('torch 卸载', async () => {
    const torch = shellFlow.bin.getModule('torch');
    if (torch) {
      await torch.uninstall();
    }
  });
});
