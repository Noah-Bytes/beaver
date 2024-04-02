import { IPublicPluginMeta } from './plugin-meta';
import { IPublicPluginCreator } from './plugin-creater';

export interface IPublicPlugin extends IPublicPluginCreator {
  pluginName: string;
  metadata?: IPublicPluginMeta;
}
