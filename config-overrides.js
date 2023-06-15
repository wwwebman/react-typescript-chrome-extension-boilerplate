const path = require('path');
const { override } = require('customize-cra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pagesNames = ['Background', 'Content', 'Panel'];
const CHROME_EXTENSION_OUTPUT_FOLDER = 'build';

const withExtensionConfig = (config) => {

  /**
   * Overwrites a configuration for index.html.
   */
  config.plugins[0] = new HtmlWebpackPlugin({
    ...config.plugins[0].userOptions,
    cache: false,
    chunks: ['main'],
    filename: 'index.html',
    template: path.join(__dirname, 'src',  'Popup', 'index.html'),
  });

  return {
    ...config,
    entry: {
      main: [path.join(__dirname, 'src',  'Popup', 'index.tsx')],
      ...pagesNames.reduce(
        (acc, name) => ({
          ...acc,
          [name.toLowerCase()]: path.join(__dirname, 'src',  name, 'index.tsx'),
        }),
        {},
      ),
    },
    optimization: {
      ...config.optimization,
      runtimeChunk: false,
      splitChunks: false,
    },
    output: {
      ...config.output,
      chunkFilename: '[name].js',
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, CHROME_EXTENSION_OUTPUT_FOLDER),
    },
    plugins: [
      ...config.plugins,
      new webpack.ProgressPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            force: true,
            from: path.join(__dirname, 'src',  'manifest.json'),
            to: path.join(__dirname, CHROME_EXTENSION_OUTPUT_FOLDER),
            transform(content) {
              return Buffer.from(
                JSON.stringify({
                  version: process.env.npm_package_version,
                  ...JSON.parse(content.toString()),
                }),
              );
            },
          },
        ],
      }),
      ...pagesNames
        .filter((name) => !['Content', 'Background'].includes(name))
        .map(
          (name) =>
            new HtmlWebpackPlugin({
              cache: false,
              chunks: [name.toLowerCase()],
              filename: `${name.toLowerCase()}.html`,
              template: path.join(__dirname, 'src',  name, 'index.html'),
            }),
        ),
    ],
  };
};

module.exports = {
  webpack: override((config) => {
    return withExtensionConfig(config);
  })
};
