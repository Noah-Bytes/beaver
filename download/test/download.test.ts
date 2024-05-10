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
    await dm.create('https://gd-filems.dancf.com/gaoding/cms/mcm79j/mcm79j/09622/aa4af2d0-81d9-486f-b4d5-c815c1ab3fb52140871.png?x-oss-process=image/resize,w_600,type_6/interlace,1/format,webp')
    console.log(await dm.getFileMetas());
  })

  it('图片下载', async () => {
    await dm.start('1714979615115_OEJ178ZCLA')
  })
});
