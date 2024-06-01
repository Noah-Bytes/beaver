import { ShellFlow } from '../../src';

jest
  .mock('shell-env', () => ({
    shellEnvSync: jest.fn(() => ({
      PATH: '/mock/path',
      HOME: '/mock/home',
    })),
  }))
  .mock('strip-ansi', () => {
    return (data: string) => {
      return data;
    };
  });

describe('registry 测试', () => {
  const shellFlow = new ShellFlow('Beaver', {
    isMirror: true,
    homeDir: '/Users/taibai/Documents/我的智流.shell',
  });

  beforeAll(async () => {
    await shellFlow.init();
  });

  it('registry 是否安装', async () => {
  });
});
