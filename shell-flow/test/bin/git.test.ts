import { ShellFlow } from '../../src';
import { Git } from '../../src/bin/module/git';

jest.setTimeout(1000000);

describe('git 测试', () => {
  const shellFlow = new ShellFlow('Beaver', {
    isMirror: true,
    homeDir: '/Users/taibai/workspace/beaver/beaver',
  });
  const git = new Git(shellFlow);

  it('git 安装', async () => {
    await git.install();
  });

  it('git 是否安装', async () => {
    console.log(git.installed());
  });

  it('git 卸载', async () => {
    await git.uninstall();
  });
});
