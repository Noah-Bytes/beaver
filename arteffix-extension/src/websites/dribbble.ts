import { Website } from '@beaver/arteffix-extension';
import { IDragOptions } from '@beaver/types';
import * as $ from 'jquery';
import { Link } from '../link';

export class DribbbleLink extends Link {
  constructor(options?: IDragOptions) {
    super(options);
  }

  override isTarget(element: HTMLElement): boolean {
    let result = false;
    $(element)
      .siblings('figure')
      .find('img')
      .each((index, element) => {
        this.currentDragElement = element as HTMLElement;
        result = true;
        return false;
      });

    if (result) {
      return true;
    }

    let target = element.querySelector('img, svg');
    if (target !== null) {
      this.currentDragElement = target as HTMLElement;
      return true;
    }
    return this.hasBgImage(element);
  }
}

export class Dribbble extends Website {
  constructor() {
    super();
  }

  override initLink() {
    this.link = new DribbbleLink(this.options);
  }
}
