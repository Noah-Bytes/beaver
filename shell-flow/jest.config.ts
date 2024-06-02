/* eslint-disable */
export default {
  displayName: 'shell-flow',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./test/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/shell-flow'
};
