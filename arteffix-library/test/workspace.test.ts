import { Workspace } from '../src';

describe('空间测试', () => {
  const wk = new Workspace('/Users/taibai/Documents/我的空间.arteffix');
  beforeAll(async () => {
    await wk.init();
  });

  it('获取图片列表', async () => {
    console.log(await wk.file.getFileMetas());
  });
});
