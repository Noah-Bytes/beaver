import { IMetaFile } from '../kernel';
import { IFileBaseMeta, IFileBaseMetaUpdate } from './file-meta';

export interface IFileExtend<
  M extends IFileBaseMeta,
  U extends IFileBaseMetaUpdate,
> extends IMetaFile<M, U> {

  save: (data: any) => Promise<void>;

  copy: () => Promise<void>;
}
