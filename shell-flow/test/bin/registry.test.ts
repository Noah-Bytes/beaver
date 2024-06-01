import { ShellFlow } from '../../src';

jest.setTimeout(100000);

function ansiRegex({onlyFirst = false} = {}) {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
  ].join('|');

  return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

const regex= ansiRegex()

jest
  .mock('shell-env', () => ({
    shellEnvSync: jest.fn(() => ({
      PATH: '/mock/path',
      HOME: '/mock/home',
    })),
  }))
  .mock('strip-ansi', () => {
    return (data: string) => {
      return data.replace(regex, '');
    };
  });

describe('registry 测试', () => {
  const shellFlow = new ShellFlow('Beaver', {
    isMirror: true,
    homeDir: 'D:\\我的智流.shell',
  });

  beforeAll(async () => {
    await shellFlow.init();
  });

  it('registry 是否安装', async () => {
    const result = await shellFlow.bin.checkIsInstalled('registry');
    console.log(result)
  });
});
