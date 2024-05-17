import { ShellFlow } from '../../src';
import { Node } from '../../src/bin/module/node';

jest.setTimeout(1000000);

describe('node 测试', () => {
  const shellFlow = new ShellFlow('Beaver', {
    isMirror: true,
    homeDir: '/Users/taibai/workspace/beaver/beaver',
  });
  const node = new Node(shellFlow);

  it('node 安装', async () => {
    await node.install();
  });

  it('node 是否安装', async () => {
    console.log(node.installed());
  });

  it('node 卸载', async () => {
    await node.uninstall();
  });
});
