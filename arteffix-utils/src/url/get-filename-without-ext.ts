export function getFileNameWithoutExt(filePath: string) {
  // 使用正则表达式提取文件名部分
  const parts = filePath.split('/');
  const fileName = parts[parts.length - 1];
  // 去除扩展名
  return fileName.split('.').slice(0, -1).join('.');
}
