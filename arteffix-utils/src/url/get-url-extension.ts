export function getUrlExtension(url: string) {
  const u = new URL(url);
  const filename = u.pathname.substring(u.pathname.lastIndexOf('/') + 1);
  const extension = filename.substring(filename.lastIndexOf('.') + 1);
  return extension.toUpperCase();
}
