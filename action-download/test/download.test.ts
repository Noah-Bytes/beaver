import * as process from 'process';
import { ActionDownload } from '../src';

jest.setTimeout(1000000);
describe('exec', () => {
  it('download file', async () => {
    const down = new ActionDownload({
      url: 'https://repo.anaconda.com/miniconda/Miniconda3-py310_24.4.0-0-MacOSX-x86_64.sh',
      file: 'index.sh',
      path: process.cwd(),
    });
    const code = await down.run();
  });
});
