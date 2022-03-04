// const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  entry: {
    ui: './src/resources/js/ui.ts'
  },
  output: {
    filename: '[name].js'
  },
  devtool: mode === 'production' ? 'nosources-cheap-source-map' : 'eval',
  module: {
    rules: [
      // {
      //   test: path.resolve(__dirname, './src/resources/js/ui.js'),
      //   loader: 'expose-loader',
      //   options: {
      //     exposes: {
      //       globalName: 'SKY',
      //       override: true
      //     }
      //   }
      // },
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  optimization: {
    minimizer:
      mode === 'production'
        ? [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true
                },
                output: {
                  comments: false
                }
              }
            })
          ]
        : []
  }
};
