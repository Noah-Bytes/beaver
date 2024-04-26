import ExifReader from 'exifreader';
import { extract, parse } from './stable-diffusion-image-metadata';
export async function readExif(filePath: string) {
  let tags = await ExifReader.load(filePath);
  if (tags['UserComment']) {
    const [parameters, isParameters] = extract(tags);
    const metadata = parse(parameters);
    // @ts-ignore
    tags['webui'] = metadata;
  }

  return tags;
}
