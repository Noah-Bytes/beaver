/* eslint-disable */
export default {
  displayName: 'shell-flow',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/shell-flow',
  transformIgnorePatterns: ['node_modules/(?!(execa)/)'],
  moduleNameMapper: {
    '@beaver/arteffix-utils':
      '/Users/taibai/workspace/beaver/dist/arteffix-utils',
  },
};
