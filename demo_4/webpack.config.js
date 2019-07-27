const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './index.js',
  },
  module: {
    rules: [{
      test: /\.js/,
      use: [{
        loader: 'babel-loader', 
        options: {
          "babelrc": false,
          "plugins": [
            "dynamic-import-webpack"
          ]
        }
      }]
    }]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          // filename: 'vendors.js',
        },
        default: {
          minChunks: 1,
          priority: -20,
          reuseExistingChunk: true,
          // filename: 'common.js',
        }
      }
    }
  },
  // 出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}