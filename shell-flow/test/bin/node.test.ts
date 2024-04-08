import { ShellFlow } from '../../src';
import { Node } from '../../src/bin/node';

jest.setTimeout(1000000);

describe('node 测试', () => {
  const shellFlow = new ShellFlow(
    'Beaver',
    '/Users/taibai/workspace/beaver/beaver',
    {
      isMirror: true,
    },
  );
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
