export function isSystemPath(link: string) {
  // 正则表达式检查链接是否以文件系统路径开头（例如 / 或 C:\）
  const systemPathRegex = /^(\/|[A-Z]:\\)/i;
  return systemPathRegex.test(link);
}
