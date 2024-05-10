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

  it('图片创建', async () => {
    const dl = await dm.create(
      'https://img2.baidu.com/it/u=3227619927,365499885&fm=253&fmt=auto&app=120&f=JPEG?w=938&h=500',
      {
        name: '测试',
        ext: 'webp',
      },
    );
    console.log(dm.absPath());
    await dl.start();
    console.log(await dm.getFileMetas());
  });

  it('图片下载', async () => {
    await dm.start('1715335989481_D5XZAEQVXCC');
  });
});
