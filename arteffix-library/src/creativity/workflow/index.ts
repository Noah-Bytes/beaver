import { IImageWorkflowMeta, IImageWorkflowMetaUpdate } from '@beaver/types';
import { File } from '../../file';

export class Workflow extends File<
  IImageWorkflowMeta,
  IImageWorkflowMetaUpdate
> {
  constructor(dir: string, meta: IImageWorkflowMeta) {
    if (!meta.type) {
      meta.type = File.TYPE.workflow;
    }
    super(dir, meta);
  }
}
