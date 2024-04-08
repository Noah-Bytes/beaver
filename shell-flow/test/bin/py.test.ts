import { ShellFlow } from '../../src';
import { Py } from '../../src/bin/py';

jest.setTimeout(1000000);

describe('zip 测试', () => {
  const shellFlow = new ShellFlow(
    'Beaver',
    '/Users/taibai/workspace/beaver/beaver',
    {
      isMirror: true,
    },
  );
  const py = new Py(shellFlow);

  it('py 安装', async () => {
    await py.install();
  });

  it('py 是否安装', async () => {
    console.log(py.installed());
  });

  it('py 卸载', async () => {
    await py.uninstall();
  });
});
