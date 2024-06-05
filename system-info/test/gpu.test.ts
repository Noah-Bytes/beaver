import { getGpuInfo } from '../src';

describe('gpu test', () => {
  it('gpu info', async () => {
    const result = await getGpuInfo();
    console.log(result);
  });
});
