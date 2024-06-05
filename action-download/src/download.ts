import { IDownloadOptions, IWthForDriveDownload } from '@beaver/types';
import { DownloaderHelper } from 'node-downloader-helper';
import * as os from 'os';
import * as stream from 'stream';

interface IDownload {
  url: string;
  filename: string;
  dir: string;
}

function getLogs(msg: string) {
  return msg + os.EOL;
}

function _download(
  params: IDownload,
  options?: IDownloadOptions,
): Promise<void> {
  const outStream = options?.outStream || <stream.Writable>process.stdout;
  const errStream = options?.errStream || <stream.Writable>process.stderr;
  let targetURL = params.url;

  const dl = new DownloaderHelper(targetURL, params.dir, {
    fileName: params.filename,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0',
    },
    override: {
      skip: true,
      skipSmaller: false,
    },
    resumeIfFileExists: true,
    removeOnStop: false,
    removeOnFail: false,
    retry: { maxRetries: 3, delay: 5000 },
  });

  outStream.write(
    getLogs(`Downloading ${targetURL} to ${params.dir}/${params.filename}`),
  );

  return new Promise((resolve, reject) => {
    dl.on('end', () => {
      outStream.write(getLogs('Download Complete!'));
      resolve();
    });

    dl.on('error', (e) => {
      errStream.write(getLogs(`Download Failed: ${e.message}`));
    });

    dl.on('progress.throttled', (stats) => {
      outStream.write(
        getLogs(
          `Download ${stats.progress.toFixed(0)}% ${stats.downloaded}/${stats.total}`,
        ),
      );
    });

    dl.on('skip', (stats) => {
      outStream.write(getLogs(`File already exists`));
      resolve();
    });

    dl.start().catch((e) => {
      errStream.write(getLogs(`Download Failed: ${e.message}`));
    });
  });
}

export async function run(
  params: IWthForDriveDownload,
  options?: IDownloadOptions,
) {
  if (params.url && params.path && params.path) {
    await _download(
      {
        url: params.url,
        filename: params.file,
        dir: params.path,
      },
      options,
    );
  }
}
