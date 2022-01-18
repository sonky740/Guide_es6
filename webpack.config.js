const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  entry: {
    ui: './src/resources/js/ui.js'
  },
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
