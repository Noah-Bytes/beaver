export function safeAccessSync(dir: string) {
  if (typeof window === 'undefined') {
    const fs = require('fs');
    try {
      fs.accessSync(dir, fs.constants.W_OK);
    } catch (e) {
      fs.chmodSync(dir, '0755');
    }
  }
}
