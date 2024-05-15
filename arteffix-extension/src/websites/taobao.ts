import { IDragOptions } from '@beaver/types';
import { Link } from '../link';
import { Website } from '../website';

export class TaoBaoLink extends Link {
  constructor(options?: IDragOptions) {
    super(options);
  }

  override getTitle(): string | undefined {
    let target = this.dragElement!.querySelector('.info-wrapper-title-text');

    if (!target) {
      target = this.dragElement!.querySelector('.Title--title--jCOPvpf');
    }

    if (target) {
      return target.textContent || undefined;
    }

    return super.getTitle();
  }

  override getSrc(): string | undefined {
    let target = this.dragElement!.querySelector('.img-wrapper');

    if (target) {
      const computedStyle = window.getComputedStyle(target);
      const backgroundImage =
        computedStyle.getPropertyValue('background-image');
      return backgroundImage.replace(/url\(['"]?/, '').replace(/['"]?\)/, '');
    }

    return super.getSrc();
  }

  override isTarget(): boolean {
    const target = this.dragElement!.querySelector('.img-wrapper');
    if (target) {
      // 检查当前元素的背景图片
      const computedStyle = window.getComputedStyle(target);
      const backgroundImage =
        computedStyle.getPropertyValue('background-image');
      return (
        backgroundImage !== 'none' &&
        !backgroundImage.includes('gradient') &&
        !backgroundImage.includes('data:image')
      );
    }

    return super.isTarget();
  }
}

export class TaoBao extends Website {
  constructor() {
    super();
  }

  override initLink() {
    this.link = new TaoBaoLink(this.options);
  }
}
