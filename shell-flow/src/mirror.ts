const mirror: { [key: string]: string } = require('./mirror.json');

export function mirrorUrl(url: string): string {
  for (let mirrorKey in mirror) {
    if (url.includes(mirrorKey)) {
      return url.replaceAll(mirrorKey, mirror[mirrorKey]);
    }
  }

  return url;
}
