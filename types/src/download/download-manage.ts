import { IMetaFileManage } from '@beaver/types';
import { IDownload, IDownloadMeta, IDownloadMetaUpdate } from './download';

export interface IDownloadManage
  extends IMetaFileManage<IDownload, IDownloadMeta, IDownloadMetaUpdate> {
  start(id: string): Promise<boolean>;
  stop(id: string): Promise<boolean>;
  resume(id: string): Promise<boolean>;
  pause(id: string): Promise<boolean>;

  startWithIds(ids: string[]): Promise<{ [key: string]: boolean }>;
  stopWithIds(ids: string[]): Promise<{ [key: string]: boolean }>;
  resumeWithIds(ids: string[]): Promise<{ [key: string]: boolean }>;
  pauseWithIds(ids: string[]): Promise<{ [key: string]: boolean }>;

  startAll(): Promise<{ [key: string]: boolean }>;
  stopAll(): Promise<{ [key: string]: boolean }>;
  resumeAll(): Promise<{ [key: string]: boolean }>;
  pauseAll(): Promise<{[key: string]: boolean}>;

  delete(id: string): Promise<void>;
  deleteWithIds(ids: string[]): Promise<void>;
  deleteAll(): Promise<void>;
}
