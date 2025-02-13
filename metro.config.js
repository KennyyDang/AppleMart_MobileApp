const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.resolver.alias = {
  ...config.resolver.alias,
  '@': path.resolve(projectRoot, 'src'),
  '@components': path.resolve(projectRoot, 'src/components'),
  '@hooks': path.resolve(projectRoot, 'src/hooks'),
  '@utils': path.resolve(projectRoot, 'src/utils'),
};

module.exports = config;
