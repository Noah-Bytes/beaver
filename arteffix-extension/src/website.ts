import {
  IDragOptions,
  IWebsite,
  IWebsiteImageMeta,
  IWebsiteMeta,
  IWebsiteSelectorMeta,
  IWebsiteSVGMeta,
} from '@beaver/types';
import { Image } from './image';
import { Svg } from './svg';
import {Link} from "./link";

export class Website implements IWebsite {
  readonly metaSelector = {
    description: 'meta[name="description"]',
    keywords: 'meta[name="keywords"]',
    picture: 'meta[property="og:image"]',
    favicon: 'link[rel="icon"]',
  };
  readonly image: Image;
  readonly svg: Svg;
  readonly link: Link;
  readonly meta: IWebsiteMeta;

  constructor(options?: IDragOptions) {
    const selectorMeta = this._getSelectorMeta();
    this.meta = {
      url: location.href,
      title: document.title,
      ...selectorMeta,
    };
    this.image = new Image(options);
    this.svg = new Svg(options);
    this.link = new Link(options);
  }

  private _getSelectorMeta() {
    const result: IWebsiteSelectorMeta = {
      description: '',
      keywords: '',
      favicon: '',
      picture: '',
    };
    const keys = Object.keys(this.metaSelector);
    for (const key of keys) {
      const element = document.querySelector(
        this.metaSelector[key as keyof IWebsiteSelectorMeta],
      );
      if (element) {
        result[key as keyof IWebsiteSelectorMeta] =
          element instanceof HTMLMetaElement
            ? element.content
            : element instanceof HTMLLinkElement
              ? element.href
              : '';
      }
    }
    return result;
  }

  /**
   * 获取页面所有bg图片
   */
  getBgImageMetas(): IWebsiteImageMeta[] {
    const arr = document.querySelectorAll('body, body *');

    const result: IWebsiteImageMeta[] = [];

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      const computedStyle = window.getComputedStyle(element);
      const bkImg = computedStyle.getPropertyValue('background-image');

      if (
        bkImg &&
        bkImg !== 'none' &&
        !bkImg.includes('gradient') &&
        !bkImg.includes('data:image')
      ) {
        const url = bkImg.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
        const { width, height } = element.getBoundingClientRect();

        if (width > 5 && height > 5) {
          result.push({
            src: url,
            width,
            height,
          });
        }
      }
    }

    return result;
  }

  getSvgMetas(): IWebsiteSVGMeta[] {
    const elementsByTagName = document.getElementsByTagName('svg');

    const result: IWebsiteSVGMeta[] = [];

    for (let i = 0; i < elementsByTagName.length; i++) {
      const e = elementsByTagName[i];
      if (e.width.baseVal.value > 5 && e.height.baseVal.value > 5) {
        result.push(this.svg.getMeta(e));
      }
    }

    return result;
  }

  getImageMetas(): IWebsiteImageMeta[] {
    const result: IWebsiteImageMeta[] = [];
    const elements = document.getElementsByTagName('img');
    for (let i = 0; i < elements.length; i++) {
      const e = elements[i];
      if (e.width > 5 && e.height > 5) {
        result.push(this.image.getMeta(e));
      }
    }
    return result;
  }
}
