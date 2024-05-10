import $ from 'jquery';
import parse from 'srcset-parse';

/**
 * 获取base64图片的格式
 * @param base64Data
 */
export function getBase64ImageFormat(base64Data: string) {
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

/**
 * 获取url的扩展名
 * @param url
 */
export function getUrlExtension(url: string) {
  const u = new URL(url);
  const filename = u.pathname.substring(u.pathname.lastIndexOf('/') + 1);
  const extension = filename.substring(filename.lastIndexOf('.') + 1);
  return extension.toUpperCase();
}

/**
 * 获取picture元素中最大的图片
 * @param element
 */
export function getPictureMaxSource(element: HTMLPictureElement) {
  const $sources = $(element).find('source');

  const sortBy = {
    'image/gif': 1,
    'image/png': 2,
    'image/jpeg': 3,
    'image/jpg': 3,
    '': 4,
    undefined: 4,
  };

  if ($sources.length > 0) {
    return (
      $sources
        .filter((index, source) => source.media === '' || source.media === null)
        .toArray()
        // @ts-ignore
        .sort((a, b) => sortBy[a.type] - sortBy[b.type])
        .map((elem) => getImageDescBySize(elem.srcset))
    );
  }

  const $img = $(element).find('img');
  return $img
    .toArray()
    .filter((img) => img.dataset['srcset'] || img.srcset)
    .map((elem) => getImageDescBySize(elem.dataset['srcset'] || elem.srcset));
}

/**
 * 根据图片信息获取图片列表大小降序排列
 * @param srcset
 */
export function getImageDescBySize(srcset: string) {
  const candidate = parse(srcset);
  return candidate
    .sort((a, b) => {
      if (a.width && b.width) {
        return b.width - a.width;
      }

      if (a.density && b.density) {
        return b.density - a.density;
      }

      return -1;
    })
    .map((elem) => {
      if (
        elem.density ||
        (elem.density === undefined && elem.width === undefined)
      ) {
        const regex = /w_(\d+)/;
        const match = elem.url.match(regex);
        if (match) {
          elem.width = Number(match[1]);
          return elem;
        }
      }
      return elem;
    }) as {
    url: string;
    width: number;
    density?: number;
  }[];
}
