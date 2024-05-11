import { IDragOptions } from '@beaver/types';
import $ from 'jquery';
import { Link } from '../link';
import { Image } from '../image';
import { Website } from '../website';
import {options} from "prettier-plugin-tailwindcss";

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

export class DribbbleImage extends Image {
  constructor(options?: IDragOptions) {
    super(options);
  }

  override getOrigin(element: HTMLElement): string | undefined {
    return super.getOrigin(element);
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
