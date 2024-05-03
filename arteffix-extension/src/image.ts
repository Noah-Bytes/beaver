import { getBase64ImageFormat, getUrlExtension } from '@beaver/arteffix-utils';
import {IDragOptions, IWebsiteImage} from '@beaver/types';
// @ts-ignore
import * as isBase64 from 'is-base64';
import { Drag } from './drag';

export class Image extends Drag implements IWebsiteImage {
  constructor(options?: IDragOptions) {
    super('img', options);
  }

  getMeta(element: HTMLImageElement) {
    const srcText = element.src;

    let base64: string;
    let src: string | undefined;
    let ext: string;

    if (
      isBase64(srcText, {
        allowMime: true,
      })
    ) {
      base64 = srcText;
      ext = getBase64ImageFormat(srcText);
    } else {
      src = srcText;
      base64 = this.toBase64(element);
      ext = getUrlExtension(srcText);
    }

    return {
      width: element.width,
      height: element.height,
      title: this.getTitle(element),
      src,
      base64,
      ext,
    };
  }

  getTitle(element: HTMLImageElement) {
    return element.getAttribute('alt');
  }

  toBase64(element: HTMLImageElement) {
    // 创建一个 canvas 元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // 设置 canvas 的尺寸与图片尺寸一致
    canvas.width = element.width;
    canvas.height = element.height;

    // 在 canvas 上绘制图片
    ctx.drawImage(element, 0, 0);

    // 返回 Base64 字符串
    return canvas.toDataURL();
  }
}
