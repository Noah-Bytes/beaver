import { IDragOptions, IWebsiteSvg, IWebsiteSVGMeta } from '@beaver/types';
import { Drag } from './drag';

export class Svg extends Drag implements IWebsiteSvg {
  constructor(options?: IDragOptions) {
    super('svg', options);
  }

  override getMetaData(): IWebsiteSVGMeta {
    // @ts-ignore
    const dom = this.dragElement! as SVGSVGElement;
    return {
      title: '',
      ext: 'svg',
      width: dom.width.baseVal.value,
      height: dom.height.baseVal.value,
      svg: dom.outerHTML,
    };
  }
}
