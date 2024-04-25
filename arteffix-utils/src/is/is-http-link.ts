export function isHttpLink(link: string) {
  // 正则表达式检查链接是否以 http:// 或 https:// 开头
  const httpRegex = /^(http|https):\/\//;
  return httpRegex.test(link);
}
