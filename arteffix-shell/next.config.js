//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const withNextJsObfuscator = require('nextjs-obfuscator')(
  {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.75,
    stringArrayEncoding: ['base64'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 4,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
  },
  {
    enabled: 'detect',
    patterns: ['./**/*.(js|jsx|ts|tsx)'],
    obfuscateFiles: {
      buildManifest: true,
      ssgManifest: true,
      webpack: true,
      additionalModules: [
        '@beaver/shell-flow',
        '@beaver/utils',
        '@beaver/types',
      ]
    },
    log: false,
  },
);
const { constants } = require('os');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to app SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    config.module.rules.push({
      test: /\.node$/,
      use: [
        {
          loader: 'node-loader',
          options: {
            // @ts-ignore
            flags: constants.dlopen.RTLD_NOW,
          },
        },
      ],
    });
    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withNextJsObfuscator,
];

module.exports = composePlugins(...plugins)(withNextJsObfuscator(nextConfig));
