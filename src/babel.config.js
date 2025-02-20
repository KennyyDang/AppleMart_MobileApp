module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              '@': './src',
              '@components': './src/components',
              '@hooks': './src/hooks',
              '@utils': './src/utils',
            },
          },
        ],
      ],
    };
  };
  