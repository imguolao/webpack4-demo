const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './index.js',
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader",
      },
    ],
  },
  devtool: 'source-map',
  // 出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}