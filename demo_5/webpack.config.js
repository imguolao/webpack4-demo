const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');

module.exports = {
  entry: {
    main: './src/index.js'
  },

  module: {
    rules:[
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(css)?$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*.jsx`,
      { nodir: true }),
      // 白名单 具体描述：https://www.purgecss.com/whitelisting#patterns
      // html body 标签相关样式不会被去除
      whitelist: ['html', 'body'],
      // 命名带有 btn 的 class 不会被去除
      whitelistPatterns: [/btn/],
      // whitelistPatternsChildren: [/btn/]
    }),
    new CleanWebpackPlugin({})
  ],

  resolve: {
    extensions: ['.js', '.jsx']
  },

  output: {
    filename: '[name].[hash].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}