import { IDragOptions, IWebsiteImage, IWebsiteImageMeta } from '@beaver/types';
// @ts-ignore
import * as isBase64 from 'is-base64';
import { Drag } from './drag';

function getBase64ImageFormat(base64Data: string) {
  // 解析 base64 编码的数据，提取图像数据部分
  const base64Parts = base64Data.split(';base64,');
  const imageType = base64Parts[0].split(':')[1];
  const imageData = Buffer.from(base64Parts[1], 'base64');

  // 图像格式检测字典，存储不同格式的标识和对应的格式名
  const imageFormats = {
    '89504E47': 'PNG',
    '47494638': 'GIF',
    FFD8FFDB: 'JPEG',
    FFD8FFE0: 'JPEG',
    FFD8FFE1: 'JPEG',
  };

  // 获取数据的前几个字节
  const firstBytes = imageData.toString('hex', 0, 4).toUpperCase();

  // 检查前几个字节是否匹配已知的图像格式标识
  for (const signature in imageFormats) {
    if (firstBytes.startsWith(signature)) {
      // @ts-ignore
      return imageFormats[signature];
    }
  }

  // 如果无法识别，则返回未知格式
  return 'UNKNOWN';
}

function getUrlExtension(url: string) {
  const u = new URL(url);
  const filename = u.pathname.substring(u.pathname.lastIndexOf('/') + 1);
  const extension = filename.substring(filename.lastIndexOf('.') + 1);
  return extension.toUpperCase();
}

export class Image extends Drag implements IWebsiteImage {
  constructor(options?: IDragOptions) {
    super('img', options);
  }

  static getMeta(element: HTMLImageElement): IWebsiteImageMeta {
    const srcText = element.src;

    let base64: string | undefined;
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
      ext = getUrlExtension(srcText);
    }

    return {
      width: element.width,
      height: element.height,
      title: element.getAttribute('alt'),
      src,
      base64,
      ext,
    };
  }
}
