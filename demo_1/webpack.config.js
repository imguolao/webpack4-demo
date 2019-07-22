const path = require('path');

module.exports = {
  // mode: 'production',
  mode: 'development',
  // 入口
  // entry: './src/index.js',
  entry: {
    main: './src/index.js',
  },
  module: {
    rules: [{
      // 打包图片
      test: /\.(jpg|png|gif)$/,
      use: {
        // loader: 'file-loader',
        loader: 'url-loader',
        options: {
          name: '[name]_[hash].[ext]',
          outputPath: 'images/',
          limit: 8192,
        },
      },
    },
    {
      // 打包 css、less
      test: /\.(css|less)$/,
      use: [
        'style-loader', 
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            // css 模块化
            // modules: true,
          }
        },
        'less-loader',
        'postcss-loader',
      ],
    },
    {
      // 打包字体文件
      test: /\.(eot|ttf|svg|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          outputPath: 'font/',
        }
      },
    }],
  },
  // 出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}