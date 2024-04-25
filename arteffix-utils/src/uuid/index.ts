export function uuid(prefix = 'beaver') {
  const timestamp = new Date().getTime(); // 获取当前时间的时间戳
  const randomPart = Math.random().toString(36).substring(2, 15); // 生成一个随机字符串
  return `${prefix}_${timestamp}_${randomPart}`; // 组合成一个唯一ID
}
