import { ShellFlow } from '../../src';
import {Git} from "../../src/bin/module/git";

jest.setTimeout(1000000);

describe('git 测试', () => {
  const shellFlow = new ShellFlow(
    'Beaver',
    '/Users/taibai/workspace/beaver/beaver',
    {
      isMirror: true,
    },
  );
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
