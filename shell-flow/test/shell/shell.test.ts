import { ShellFlow } from '../../src/';
import { Shell } from '../../src/shell/shell';

describe('终端测试', () => {
  const shellFlow = new ShellFlow('Beaver', {
    isMirror: true,
    homeDir: '/Users/taibai/Documents/我的智流.shell',
  });

  const shell = new Shell('test', 'test', shellFlow);
  const shell1 = new Shell('并发', 'test', shellFlow);
  const sync = new Shell('同步', 'test', shellFlow);

  jest.setTimeout(20000);

  beforeAll(async () => {
    await shellFlow.init();
    shell.init();
    shell1.init();
    sync.init();
  });

  it('控制台输入', () => {
    shell.send('ls', {
      isRun: false,
    });
    shell.send(' -lh', {
      isRun: true,
    });
    shell.send('pwd', {
      isRun: true,
    });
  });

  it('控制台并发', async () => {
    shell.send('pwd', {
      isRun: true,
    });

    shell1.send('ls', {
      isRun: false,
    });
    shell1.send(' -lh', {
      isRun: true,
    });
    shell1.send('pwd', {
      isRun: true,
    });
  });

  it('同步执行', async () => {
    let result = await sync.run({
      message: 'ls -lh',
    });
    console.log(result);
    result = await sync.run({
      message: 'ls -lh',
    });
    console.log(result);
    result = await sync.run({
      message: 'ls -lh',
    });
    console.log(result);
    result = await sync.run({
      message: 'ping -c 20 www.baidu.com',
    });
    console.log(result);

    try {
      result = await sync.run({
        message: 'paing -c 20 www.baidu.com',
      });
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  });
});
