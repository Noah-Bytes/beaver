import { ErrorStats } from 'node-downloader-helper';
import { IMetaFile, IMetaFileMeta, IMetaFileMetaUpdate } from '../kernel';

export interface IDownloadMeta extends IMetaFileMeta {
  url: string;
  size?: number;
  status?: string;
  mime?: string;
  endTime?: number;
  downloadedSize?: number;
  downloadError?: ErrorStats;
  createTime: number;
  progress?: number;
  speed?: number;
}

export interface IDownloadMetaUpdate extends IMetaFileMetaUpdate {
  status?: string;
  downloadedSize?: number;
  progress?: number;
  mime?: string;
  endTime?: number;
  downloadError?: ErrorStats;
  speed?: number;
}

export interface IDownload
  extends IMetaFile<IDownloadMeta, IDownloadMetaUpdate> {
  start: () => Promise<boolean>;
  stop: () => Promise<boolean>;
  pause: () => Promise<boolean>;
  resume: () => Promise<boolean>;
}
