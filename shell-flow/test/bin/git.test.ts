import { getShellFlow } from './get-shell-flow';
import {afterEach} from "node:test";

describe('git 测试', () => {
  const shellFlow = getShellFlow();

  beforeAll(async () => {
    await shellFlow.init();
  });

  afterEach(async () => {
    await shellFlow.destroy();
  })

  it('git 安装', async () => {
    const git = shellFlow.bin.getModule('git');
    if (git) {
      await git.install();
    }
  });

  it('git 是否安装', async () => {
    const git = shellFlow.bin.getModule('git');
    if (git) {
      const result = await git.installed()
      console.log(result);
    }
  });

  it('git 卸载', async () => {
    const git = shellFlow.bin.getModule('git');
    if (git) {
      await git.uninstall();
    }
  });
});
