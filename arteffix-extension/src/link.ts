import { IDragOptions, IWebsiteLink } from '@beaver/types';
import { Drag } from './drag';

export class Link extends Drag implements IWebsiteLink {
  constructor(options?: IDragOptions) {
    super('a', options);
  }

  hasBgImage(element: HTMLElement) {
    // 检查当前元素的背景图片
    const computedStyle = window.getComputedStyle(element);
    const backgroundImage = computedStyle.getPropertyValue('background-image');
    if (
      backgroundImage !== 'none' &&
      !backgroundImage.includes('gradient') &&
      !backgroundImage.includes('data:image')
    ) {
      this.currentDragElement = element;
      return true;
    }

    // 递归遍历子元素
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
      if (this.hasBgImage(children[i] as HTMLElement)) {
        return true;
      }
    }

    // 若当前元素及其子元素均不包含图片，则返回 false
    return false;
  }

  override isTarget(element: HTMLElement): boolean {
    let target = element.querySelector('img, svg');
    if (target !== null) {
      this.currentDragElement = target as HTMLElement;
      return true;
    }
    return this.hasBgImage(element);
  }
}
