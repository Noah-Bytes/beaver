import { IDragOptions, IWebsiteSvg, IWebsiteSVGMeta } from '@beaver/types';
import { Drag } from './drag';

export class Svg extends Drag implements IWebsiteSvg {
  constructor(options?: IDragOptions) {
    super('svg', options);
  }
  getMeta(element: SVGSVGElement): IWebsiteSVGMeta {
    return {
      title: '',
      ext: 'SVG',
      width: element.width.baseVal.value,
      height: element.height.baseVal.value,
      svg: element.outerHTML,
    };
  }
}
