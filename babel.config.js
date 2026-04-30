module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@app': './src/app',
            '@features': './src/features',
            '@providers': './src/providers',
            '@shared': './src/shared',
            '@assets': './assets',
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
