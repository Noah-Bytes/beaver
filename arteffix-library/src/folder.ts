import { uuid } from '@beaver/arteffix-utils';
import {
  IFolder,
  IFolderImpl,
  IFolderMeta,
  IFolderMetaCreate,
  IFolderMetaCreateOptions,
  IFolderMetaUpdate,
} from '@beaver/types';
import { FileJson } from './file-json';

export class Folder extends FileJson<IFolder> implements IFolderImpl {
  constructor(rootDir: string) {
    super(rootDir, 'folder.json', {
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
    options?: IFolderMetaCreateOptions,
  ): Promise<IFolderMeta> {
    const now = Date.now();
    const id = uuid('D');
    const data = {
      createTime: now,
      id: id,
      updTime: now,
      children: [],
      ...folder,
    };

    if (options) {
      let parentId = options.parentId;
      if (!parentId) {
        parentId = 'root';
      }

      if (options.currentId) {
        const index = this.json[parentId].children.indexOf(options.currentId);
        if (index > -1) {
          this.json[parentId].children.splice(index + 1, 0, id);
        } else {
          this.json[parentId].children.push(id);
        }
      } else {
        this.json[parentId].children.push(id);
      }
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

  async update(
    folderId: string,
    update: IFolderMetaUpdate,
  ): Promise<IFolderMeta> {
    this.json[folderId] = {
      ...this.json[folderId],
      ...update,
      updTime: Date.now(),
    };
    await this.save();
    return this.json[folderId];
  }

  async toggleExpand(folderId: string, expand: boolean, self = false) {
    const that = this;
    function run(ids: string[]) {
      for (let i = 0; i < ids.length; i++) {
        that.json[ids[i]].isExpanded = expand;
        run(that.json[ids[i]].children);
      }
    }

    if (self) {
      this.json[folderId].isExpanded = expand;
    }
    run(this.json[folderId].children);

    await this.save();
  }
}
