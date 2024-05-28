import { uuid } from '@beaver/arteffix-utils';
import {
  IFolder,
  IFolderImpl,
  IFolderMeta,
  IFolderMetaCreate,
  IFolderMetaUpdate,
} from '@beaver/types';
import { FileJson } from './file-json';

export class Folder extends FileJson<IFolder> implements IFolderImpl {
  constructor(rootDir: string) {
    super(rootDir, 'tag.json', {
      root: {
        id: 'root',
        children: [],
        name: 'root',
        createTime: 0,
        updTime: 0,
      },
    });
  }

  async add(
    folder: IFolderMetaCreate,
    parentId?: string,
  ): Promise<IFolderMeta> {
    const now = Date.now();
    const id = uuid('D');
    const data = {
      createTime: now,
      description: folder.description,
      icon: folder.icon,
      id: id,
      name: folder.name,
      updTime: now,
      password: folder.password,
      children: [],
    };

    if (parentId && this.json[parentId]) {
      this.json[parentId].children.push(id);
    } else {
      this.json['root'].children.push(id);
    }

    this.json[id] = data;

    await this.save();
    return data;
  }

  async remove(folderId: string, parentId?: string): Promise<void> {
    let pId = parentId;
    if (!pId) {
      pId = 'root';
    }

    if (this.json[pId]) {
      if (this.json[folderId]) {
        this.json[folderId].children.forEach((id) => {
          delete this.json[id];
        });
        delete this.json[folderId];
      }

      this.json[pId].children = this.json[pId].children.filter(
        (id) => id !== folderId,
      );

      await this.save();
    }
  }

  async update(folderId: string, update: IFolderMetaUpdate): Promise<void> {
    this.json[folderId] = {
      ...this.json[folderId],
      ...update,
    };
    await this.save();
  }
}
