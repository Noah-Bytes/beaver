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
      'https://cdn.dribbble.com/userupload/14365145/file/original-f4d6b483ec7dd49c62158048cd6b7c8e.jpg?resize=1200x900&vertical=center',
    );
    console.log(dm.absPath());
    await dl.start();
    console.log(await dm.getFileMetas());
  });

  it('图片下载', async () => {
    await dm.start('1715335989481_D5XZAEQVXCC');
  });
});
