import { IWebsiteImageMeta } from './image';
import { IWebsiteSVGMeta } from './svg';

export interface IDragOptions {
  log?: boolean;
  onDragEnd?: () => void;
  onFirstDrag?: (
    position: [number, number],
    metaData: IWebsiteImageMeta | IWebsiteSVGMeta | undefined,
  ) => void;
}

export interface IDrag {
  dragoverX: number;
  dragoverY: number;
  targetSelector: string;
  dragElement?: HTMLElement;
  isTarget: () => boolean;
  initEvent: () => void;
  getMetaData: () => IWebsiteImageMeta | IWebsiteSVGMeta | undefined;
  initDocumentEvent: () => void;
}
