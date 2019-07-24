const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
        // 'style-loader', 
        {
          loader: MiniCssExtractPlugin.loader,
        },
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
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack4 plugins 篇',
      template: './src/index.html'
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, 
      { 
        // 不匹配目录，只匹配文件
        nodir: true,
      }),
    }),
    new OptimizeCssAssetsPlugin(),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    // 启用 gzip
    compress: true,
    open: true,
    port: 9000,
    hot: true,
    hotOnly: true,
  },
  // 出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}