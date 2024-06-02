export function omit(obj: Record<string, any>, keysToOmit: string) {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    if (!keysToOmit.includes(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
