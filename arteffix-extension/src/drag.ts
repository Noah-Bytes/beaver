import { IDrag, IDragOptions } from '@beaver/types';
import * as $ from 'jquery';

export class Drag implements IDrag {
  dragoverX: number = 0;
  dragoverY: number = 0;
  targetSelector: string;
  currentDragElement?: HTMLElement;
  private options?: IDragOptions;

  constructor(selector: string, options?: IDragOptions) {
    this.targetSelector = selector;
    this.initEvent();
    this.options = options;
  }

  isTarget(element: HTMLElement): boolean {
    this.currentDragElement = element;
    return true;
  }

  initEvent() {
    $(document).on('dragstart', this.targetSelector, (e) => {
      if (this.isTarget(e.target)) {
        this.initDocumentEvent();

        this.dragoverX = e.originalEvent?.clientX || 0;
        this.dragoverY = e.originalEvent?.clientY || 0;

        setTimeout(() => {
          this.options?.onFirstDrag?.(
            [this.dragoverX, this.dragoverY],
            e.target,
            this.currentDragElement,
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
