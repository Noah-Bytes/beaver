export function removeFilenameFromUrl(urlString: string): string {
  // 创建一个URL对象
  const url = new URL(urlString);

  // 获取路径名
  let pathname = url.pathname;

  // 检查路径是否以文件名结尾（即是否有扩展名）
  if (pathname.includes('.')) {
    // 移除最后一个斜杠之后的部分（即文件名）
    pathname = pathname.substring(0, pathname.lastIndexOf('/'));
  }

  // 构建并返回没有文件名的URL
  return url.origin + pathname;
}
