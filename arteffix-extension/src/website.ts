import {
  IDragOptions,
  IWebsite,
  IWebsiteImageMeta,
  IWebsiteMeta,
  IWebsiteSelectorMeta,
  IWebsiteSVGMeta,
} from '@beaver/types';
import { Image } from './image';
import { Link } from './link';
import { Svg } from './svg';

export class Website implements IWebsite {
  readonly metaSelector = {
    description: 'meta[name="description"]',
    keywords: 'meta[name="keywords"]',
    picture: 'meta[property="og:image"]',
    favicon: 'link[rel="icon"]',
  };
  image?: Image;
  svg?: Svg;
  link?: Link;
  readonly meta: IWebsiteMeta;
  options?: IDragOptions;

  constructor() {
    const selectorMeta = this._getSelectorMeta();
    this.meta = {
      url: location.href,
      title: document.title,
      ...selectorMeta,
    };
  }

  init(options?: IDragOptions) {
    this.options = options;
    this.initImage();
    this.initSvg();
    this.initLink();
  }

  initImage() {
    this.image = new Image(this.options);
  }

  initSvg() {
    this.svg = new Svg(this.options);
  }

  initLink() {
    this.link = new Link(this.options);
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
        this.svg && result.push(Svg.getMeta(e));
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
        this.image && result.push(Image.getMeta(e));
      }
    }
    return result;
  }
}
