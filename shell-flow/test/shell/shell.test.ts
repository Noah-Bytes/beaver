import { Shell } from '../../src/shell/shell';
import { ShellFlow } from '../../src';

describe('终端测试', () => {
  const shellFlow = new ShellFlow(
    'Beaver',
    '/Users/taibai/workspace/beaver/beaver',
    {
      isMirror: true,
    },
  );

  const shell = new Shell('test', shellFlow);
  const shell1 = new Shell('并发', shellFlow);
  const sync = new Shell('同步', shellFlow);

  jest.setTimeout(20000);

  beforeAll(() => {
    shell.init();
    shell1.init();
    sync.init();
  });

  it('控制台输入', () => {
    shell.send('ls', false);
    shell.send(' -lh', true);
    shell.send('pwd', true);
  });

  it('控制台并发', async () => {
    shell.send('pwd', true);

    shell1.send('ls', false);
    shell1.send(' -lh', true);
    shell1.send('pwd', true);
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
