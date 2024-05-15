import { IDragOptions } from '@beaver/types';
import $ from 'jquery';
import { Image } from '../image';
import { Link } from '../link';
import { getFullUrl, getSrcSet, isHttpLink } from '../utils';
import { Website } from '../website';

export class DribbbleLink extends Link {
  constructor(options?: IDragOptions) {
    super(options);
  }

  override isTarget(): boolean {
    let result = false;
    $(this.dragElement!)
      .siblings('figure')
      .find('img')
      .each((index, element) => {
        result = true;
        return false;
      });

    if (result) {
      return true;
    }

    let target = this.dragElement!.querySelector('img, svg');
    return !!target;
  }

  override getOrigin(): string {
    const a = this.dragElement! as HTMLLinkElement;
    const href = a.getAttribute('href');
    if (href) {
      return getFullUrl(href);
    }

    return location.href;
  }

  override getRealUrl(url: string): string {
    if (isHttpLink(url)) {
      return url.split('?')[0];
    }
    return super.getRealUrl(url);
  }

  private findImg() {
    const dom = this.dragElement!.querySelector('img');
    if (dom) {
      return dom;
    }

    return $(this.dragElement!).siblings('figure').find('img')[0];
  }

  override getSrc(): string | undefined {
    const dom = this.findImg();
    if (dom) {
      return getSrcSet(dom) || dom.src;
    }
    return undefined;
  }

  override getTitle(): string | undefined {
    const dom = this.findImg();
    if (dom) {
      return dom.alt;
    }
    return undefined;
  }
}

export class DribbbleImage extends Image {
  constructor(options?: IDragOptions) {
    super(options);
  }

  override getOrigin(): string | undefined {
    const $a = $(this.dragElement!).parent().siblings('a');
    if ($a.length > 0) {
      const href = $a[0].getAttribute('href');
      if (href) {
        return getFullUrl(href);
      }
    }
    return super.getOrigin();
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
