jest.setTimeout(1000000);
process.env['ARTEFFIX_MIRROR'] = 'true';
function ansiRegex({ onlyFirst = false } = {}) {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
  ].join('|');

  return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

const regex = ansiRegex();

jest
  .mock('shell-env', () => ({
    shellEnvSync: jest.fn(() => ({
      PATH: '/mock/path',
      HOME: '/mock/home',
    })),
  }))
  .mock('strip-ansi', () => {
    return (data: string) => {
      return data.replace(regex, '');
    };
  })
  .mock('tree-kill-promise', () => {
    return (data: string) => {
      return data.replace(regex, '');
    };
  });
