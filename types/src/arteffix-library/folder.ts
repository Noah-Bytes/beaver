import { IFileJson } from './file-json';

export interface IFolderPassword {
  password: string;
  tip?: string;
}

export interface IIcon {
  html: string;
  color: string;
}

export interface IFolderMeta {
  id: string;
  name: string;
  createTime: number;
  updTime: number;
  icon?: IIcon;
  children: string[];
  password?: IFolderPassword;
  description?: string;
}

export type IFolderMetaUpdate = Partial<
  Pick<IFolderMeta, 'name' | 'icon' | 'description' | 'children' | 'password'>
>;

export type IFolderMetaCreate = Pick<IFolderMeta, 'name'> & IFolderMetaUpdate;

export type IFolder = Record<string, IFolderMeta>;

export interface IFolderImpl extends IFileJson<IFolder> {
  add: (folder: IFolderMetaCreate, parentId?: string) => Promise<IFolderMeta>;
  update: (folderId: string, tag: IFolderMetaUpdate) => Promise<void>;
  remove: (folderId: string, parentId?: string) => Promise<void>;
}
