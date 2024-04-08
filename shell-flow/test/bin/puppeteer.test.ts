import { ShellFlow } from '../../src';
import { Puppeteer } from '../../src/bin/puppeteer';

jest.setTimeout(1000000);

describe('puppeteer 测试', () => {
  const shellFlow = new ShellFlow(
    'Beaver',
    '/Users/taibai/workspace/beaver/beaver',
    {
      isMirror: true,
    },
  );
  const puppeteer = new Puppeteer(shellFlow);

  it('puppeteer 安装', async () => {
    await puppeteer.install();
  });

  it('puppeteer 是否安装', async () => {
    console.log(puppeteer.installed());
  });

  it('puppeteer 卸载', async () => {
    await puppeteer.uninstall();
  });
});
