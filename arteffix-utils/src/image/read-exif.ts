import { extract, parse } from './stable-diffusion-image-metadata';
export async function readExif(filePath: string) {
  if (typeof window === 'undefined') {
    let tags = await require('exifreader').load(filePath);
    if (tags['UserComment']) {
      const [parameters, isParameters] = extract(tags);
      const metadata = parse(parameters);
      // @ts-ignore
      tags['webui'] = metadata;
    }

    return tags;
  }
  return undefined;
}
