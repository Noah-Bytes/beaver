import { IDragOptions } from '@beaver/types';
import $ from 'jquery';
import { Image } from '../image';
import { Link } from '../link';
import { getFullUrl, isHttpLink } from '../utils';
import { Website } from '../website';

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
    const $a = $(element).parent().siblings('a');
    if ($a.length > 0) {
      const href = $a[0].getAttribute('href');
      if (href) {
        return getFullUrl(href);
      }
    }
    return super.getOrigin(element);
  }

  override getRealUrl(url: string): string {
    if (isHttpLink(url)) {
      return url.split('?')[0];
    }
    return super.getRealUrl(url);
  }
}

export class Dribbble extends Website {
  constructor() {
    super();
  }

  override initLink() {
    this.link = new DribbbleLink(this.options);
  }

  override initImage() {
    this.image = new DribbbleImage(this.options);
  }
}
