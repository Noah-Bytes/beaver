import { MetaFile } from '@beaver/kernel';
import { IDownload, IDownloadMeta, IDownloadMetaUpdate } from '@beaver/types';
import { DH_STATES, DownloaderHelper } from 'node-downloader-helper';

export interface IDownloadOptions {
  meta: IDownloadMeta;
}

export class Download
  extends MetaFile<IDownloadMeta, IDownloadMetaUpdate>
  implements IDownload
{
  private dl?: DownloaderHelper;

  constructor(rootDir: string, options: IDownloadOptions) {
    super(rootDir, options.meta);
  }

  initHelper() {
    if (this.dl) {
      return;
    }
    this.dl = new DownloaderHelper(this.meta.url, this.dir, {
      fileName: this.getFileName(),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });

    this.dl.on('end', async (stats) => {
      await this.updateMeta({
        status: stats.incomplete ? DH_STATES.FAILED : DH_STATES.FINISHED,
        downloadedSize: stats.onDiskSize,
        endTime: Date.now(),
      });
    });

    this.dl.on('error', async (error) => {
      await this.updateMeta({
        status: DH_STATES.FAILED,
        endTime: Date.now(),
        downloadError: error,
      });
    });

    this.dl.on('start', async () => {
      await this.updateMeta({
        status: DH_STATES.DOWNLOADING,
      });
    });

    this.dl.on('pause', async () => {
      await this.updateMeta({
        status: DH_STATES.PAUSED,
      });
    });

    this.dl.on('progress.throttled', async (stats) => {
      await this.updateMeta({
        status: DH_STATES.DOWNLOADING,
        downloadedSize: stats.downloaded,
        progress: stats.progress,
        speed: stats.speed,
      });
    });
  }

  pause(): Promise<boolean> {
    this.initHelper();
    return this.dl.pause();
  }

  resume(): Promise<boolean> {
    this.initHelper();
    return this.dl.resume();
  }

  start(): Promise<boolean> {
    this.initHelper();
    return this.dl.start();
  }

  stop(): Promise<boolean> {
    this.initHelper();
    return this.dl.stop();
  }
}
