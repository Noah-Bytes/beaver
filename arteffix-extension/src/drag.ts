import {
  IDrag,
  IDragOptions,
  IWebsiteImageMeta,
  IWebsiteSVGMeta,
} from '@beaver/types';
import { consola } from 'consola';
import $ from 'jquery';

export class Drag implements IDrag {
  private log = false;
  dragoverX: number = 0;
  dragoverY: number = 0;
  targetSelector: string;
  dragElement?: HTMLElement;
  private options?: IDragOptions;

  constructor(selector: string, options?: IDragOptions) {
    this.targetSelector = selector;
    this.initEvent();
    this.options = options;
    this.log = !!options?.log;
  }

  isTarget(): boolean {
    return true;
  }

  getMetaData(): IWebsiteImageMeta | IWebsiteSVGMeta | undefined {
    return undefined;
  }

  initEvent() {
    $(document).on('dragstart', this.targetSelector, (e) => {
      this.log && consola.info('dragstart', e.target);
      this.dragElement = e.target;
      if (this.isTarget()) {
        this.initDocumentEvent();

        this.dragoverX = e.originalEvent?.clientX || 0;
        this.dragoverY = e.originalEvent?.clientY || 0;

        setTimeout(() => {
          this.options?.onFirstDrag?.(
            [this.dragoverX, this.dragoverY],
            this.getMetaData(),
          );
        }, 100);

        $(e.target)
          .off('dragend')
          .on('dragend', () => {
            this.options?.onDragEnd?.();
            $(document).off('dragover, dragleave');
          });
      }
    });
  }

  initDocumentEvent() {
    let leaveAutoClose: any;
    $(document)
      .off('dragover')
      .on('dragover', (e) => {
        e.preventDefault();
        if (leaveAutoClose) {
          clearTimeout(leaveAutoClose);
          leaveAutoClose = null;
        }
        this.dragoverX = e.originalEvent?.clientX || 0;
        this.dragoverY = e.originalEvent?.clientY || 0;
      })
      .off('dragleave')
      .on('dragleave', () => {
        if (leaveAutoClose) {
          clearTimeout(leaveAutoClose);
        }
        leaveAutoClose = setTimeout(() => {
          this.options?.onDragEnd?.();
          $(document).off('dragover, dragleave');
        }, 2000);
      });
  }
}
