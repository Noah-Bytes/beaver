import { ShellFlow } from '../../src';
import {Zip} from "../../src/bin/zip";

jest.setTimeout(1000000);

describe('zip 测试', () => {
  const shellFlow = new ShellFlow(
    'Beaver',
    '/Users/taibai/workspace/beaver/beaver',
    {
      isMirror: true,
    },
  );
  const zip = new Zip(shellFlow);

  it('zip 安装', async () => {
    await zip.install();
  });

  it('zip 是否安装', async () => {
    console.log(zip.installed());
  })

  it('zip 卸载', async () => {
    await zip.uninstall();
  })
});
