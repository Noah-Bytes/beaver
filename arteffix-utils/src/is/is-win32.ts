let isWin32 = false;
let isDarwin = false;

if (typeof window === 'undefined') {
  // 在 Node.js 环境中
  const os = require('os');
  isWin32 = os.platform() === 'win32';
  isDarwin = os.platform() === 'darwin';
}

export { isDarwin, isWin32 };
