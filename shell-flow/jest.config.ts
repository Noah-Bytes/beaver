/* eslint-disable */
export default {
  displayName: 'shell-flow',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/shell-flow',
  transformIgnorePatterns: ['node_modules/(?!(execa)/)']
};
