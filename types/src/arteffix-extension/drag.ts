export interface IDragOptions {
  onDragEnd?: () => void;
  onFirstDrag?: (
    position: [number, number],
    dragElement: HTMLElement,
    dragTargetElement?: HTMLElement,
  ) => void;
}

export interface IDrag {
  dragoverX: number;
  dragoverY: number;
  targetSelector: string;
  currentDragElement?: HTMLElement;
  isTarget: (element: HTMLElement) => boolean;
  initEvent: () => void;
  initDocumentEvent: () => void;
}
