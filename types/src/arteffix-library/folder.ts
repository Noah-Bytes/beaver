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
  isExpanded?: boolean;
  isRenaming?: boolean;
  children: string[];
  password?: IFolderPassword;
  description?: string;
}

export type IFolderMetaUpdate = Partial<
  Pick<
    IFolderMeta,
    | 'name'
    | 'icon'
    | 'description'
    | 'children'
    | 'password'
    | 'isExpanded'
    | 'isRenaming'
  >
>;

export type IFolderMetaCreate = Pick<IFolderMeta, 'name'> & IFolderMetaUpdate;

export type IFolderMetaCreateOptions = {
  parentId?: string;
  currentId?: string;
};

export type IFolder = Record<string, IFolderMeta>;

export interface IFolderImpl extends IFileJson<IFolder> {
  add: (
    folder: IFolderMetaCreate,
    options?: IFolderMetaCreateOptions,
  ) => Promise<IFolderMeta>;
  update: (folderId: string, folder: IFolderMetaUpdate) => Promise<IFolderMeta>;
  remove: (folderId: string, parentId?: string) => Promise<void>;
  toggleExpand: (
    folderId: string,
    expand: boolean,
    self?: boolean,
  ) => Promise<void>;
}
