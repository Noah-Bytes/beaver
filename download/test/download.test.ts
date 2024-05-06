import { DownloadManage } from '../src';

describe('空间测试', () => {
  const dm = new DownloadManage({
    appName: 'arteffix',
  });
  beforeAll(async () => {
    await dm.init();
  });

  it('获取图片列表', async () => {
    console.log(await dm.getFileMetas());
  });
});
