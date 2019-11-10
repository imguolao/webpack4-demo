# webpack4 css modules

[demo 代码点此]( https://github.com/imguolao/webpack4-demo/tree/master/demo_6 )，webpack4 中通过 [css-loader]( https://www.npmjs.com/package/css-loader ) 开启 css 模块化, 开始前先做点准备工作。

**不了解 css 模块化的，可以前往查看[github_css_modules]( https://github.com/css-modules/css-modules ).**

## 准备工作

安装 webpack：

```powershell
npm init -y
npm i -D webpack webpack-cli css-loader
```

创建 webpack.config.js 进行配置：

```js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js'
  },
  module: {
    rules: [
      // 不在 node_modules 中的 css，开启 css modules
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              /* 以前版本是通过 true 开启，相关配置接着写
              	modules: true
              	localIdentName: '[name]__[local]--[hash:base64:5]'
             	*/
              // 现在是给 modules 一个 options 对象开启
              modules: {
                // 重新生成的 css 类名
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          }
        ]
      },
       // 在 node_modules 中的 css，不开启
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    })
  ],
  output: {
    filename: '[name].[hash].bundle.js',
    path: path.resolve(__dirname, './dist')
  }
}
```

更多 css-loader 的配置建议前往 [github_css-loader]( https://github.com/webpack-contrib/css-loader ) 查看，因为版本更新后，配置可能会有变。

## 编写 css

配置完 webpack，写 css 时要使用相关语法，因为是通过 webpack 打包时进行编译，重新生成新的 css 类名来防止全局变量名污染的。

**注意： css  modules 只针对类、Id选择器生效，不会对标签选择器进行模块化。 **

```css
/* 全局样式 */
:global(.header) {
  color: #696969;
  background-color: #fff;
}

:global .main {
  color: #363636;
  background-color: #fff;
}

/* less 等预处理语言可以这样写 */
/* :global {
  .footer {
    color: #303030;
    background-color: #fff;
  }
} */


/* 局部样式 */
:local(.header) {
  color: red;
  background-color: #c2b1b1;
}

:local(.main) {
  color: yellow;
  background-color: rgb(136, 96, 96);
}

:local(.footer) {
  color: blue;
  background-color: #929292;
}
```

编译后的 css 代码：

```css
/* 全局样式 */
.header {
  color: #696969;
  background-color: #fff;
}

.main {
  color: #363636;
  background-color: #fff;
}

/* less 等预处理语言可以这样写 */
/* :global {
  .footer {
    color: #303030;
    background-color: #fff;
  }
} */


/* 局部样式 */
.index__header--1JD7j {
  color: red;
  background-color: #c2b1b1;
}

.index__main--1j9-Y {
  color: yellow;
  background-color: rgb(136, 96, 96);
}

.index__footer--gJKjp {
  color: blue;
  background-color: #929292;
}
```

## 使用

因为 css 类名是重新编译后的，所以使用时不能直接使用原 css 类名，要通过 import 语法使用。

```js
import styles from './index.css';

export const Header = () => {
  return `
    <h1 class=${styles.header}>header</h1>
  `
}
```

在 html 里面是这样的：

```html
<h1 class="index__header--1JD7j">header</h1>
```