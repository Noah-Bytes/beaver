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
  options?: IDragOptions;

  constructor() {}

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

  getMeta(): IWebsiteMeta {
    const selectorMeta = this._getSelectorMeta();
    return {
      url: location.href,
      title: document.title,
      ...selectorMeta,
    };
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
          });
        }
      }
    }

    return result;
  }

  getSvgMetas(): IWebsiteSVGMeta[] {
    const elementsByTagName = document.getElementsByTagName('svg');

    const result: IWebsiteSVGMeta[] = [];

    // 去重
    const has: { [key: string]: boolean } = {};

    for (let i = 0; i < elementsByTagName.length; i++) {
      const e = elementsByTagName[i];
      if (e.width.baseVal.value > 5 && e.height.baseVal.value > 5) {
        const info = Svg.getMeta(e);
        if (!has[info.svg]) {
          has[info.svg] = true;
          result.push(info);
        }
      }
    }

    return result;
  }

  getImageMetas(): IWebsiteImageMeta[] {
    const result: IWebsiteImageMeta[] = [];
    const elements = Website.getAllTagName<HTMLImageElement>('img');
    // 去重
    const has: { [key: string]: boolean } = {};

    for (let i = 0; i < elements.length; i++) {
      const e = elements[i];
      if (e.width > 5 && e.height > 5 && !!e.src) {
        const info = Image.getMeta(e);
        // @ts-ignore
        if (!has[info.src || info.base64]) {
          result.push({
            ...info,
            // @ts-ignore
            elem: e,
          });
        }
      }
    }
    return result;
  }

  /**
   * 获取页面所有指定标签的元素
   * @param tagName 标签名，支持大小写
   * @param root
   */
  static getAllTagName<T>(
    tagName: string,
    root: HTMLElement | ShadowRoot = document.body,
  ) {
    const images: T[] = [];
    function traverse(node: HTMLElement) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // 检查当前节点是否为图片
        if (node.tagName === tagName.toUpperCase()) {
          images.push(node as T);
        }

        // 检查当前节点是否有 Shadow DOM
        if (node.shadowRoot) {
          // 从 Shadow DOM 中获取图片
          const imagesInShadow: T[] = Website.getAllTagName<T>(
            tagName,
            node.shadowRoot,
          );
          images.push(...imagesInShadow);
        }

        // 遍历当前节点的子节点
        node.childNodes.forEach((child) => {
          traverse(child as HTMLElement);
        });
      }
    }

    // @ts-ignore
    traverse(root);
    return images;
  }
}
