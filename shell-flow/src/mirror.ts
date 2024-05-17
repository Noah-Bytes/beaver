import fs from 'fs-extra';

export function mirrorUrl(url: string): string {
  const mirror = fs.readJsonSync('./mirror.json');
  for (let mirrorKey in mirror) {
    if (url.includes(mirrorKey)) {
      return url.replace(new RegExp(mirrorKey, 'gm'), mirror[mirrorKey]);
    }
  }

  return url;
}
