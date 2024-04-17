import { IFileMetaUpdate } from '../../file';
import { IImageMeta } from '../../media/image';

export interface IImageWorkflowMeta extends IImageMeta {
  workflow: string;
  prompt: string;
}

export interface IImageWorkflowMetaUpdate extends IFileMetaUpdate {
  workflow: string;
  prompt: string;
}
