# webpack4 plugins 篇

[demo 代码点此](<https://github.com/imguolao/webpack4-demo>)，篇幅有限，仅介绍几个常用的。

## start

---

什么是 plugins ?

> While loaders are used to transform certain types of modules, plugins can be leveraged to perform a wider range of tasks like bundle optimization, asset management and injection of environment variables.
>
> plugins 可用于执行范围更广的任务，如打包优化，资源管理和重新定义环境中的变量。

## [HtmlWebpackPlugin](<https://github.com/jantimon/html-webpack-plugin#configuration>)

---

该插件将为你生成一个 HTML5 文件， 并帮你引入 webpack 打包好的 js 等文件.

安装：

```powershell
npm i -D html-webpack-plugin
```

在 webpack.config.js 中配置：

```js
const path = require('path');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // mode: 'production',
  mode: 'development',
  // 入口
  // entry: './src/index.js',
  entry: {
    main: './src/index.js',
  },
  module: {...},
+  plugins: [
+    new HtmlWebpackPlugin({
+      title: 'webpack4 plugins 篇',
+      template: './src/index.html'
+    }),
+  ],
  // 出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

然后在 src 目录下创建 index.html 作为模板：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

## [CleanWebpackPlugin](<https://github.com/johnagan/clean-webpack-plugin>)

---

用于删除/清除构建文件夹的 webpack 插件，其实就是打包前先把 dist 文件夹清空。

依然是安装：

```powershell
npm i -D clean-webpack-plugin
```

然后配置：

```js
// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
+ const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
  },
  module: {...},
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack4 plugins 篇',
      template: './src/index.html'
    }),
+    new CleanWebpackPlugin(),
  ],
  // 出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

## [HotModuleReplacementPlugin](<https://webpack.js.org/api/hot-module-replacement/>)

---

模块热替换插件，即 HMR，webpack4 自带插件，无需安装，在开发者模式下配合`devServer`使用。 

**注意: 永远不要在生产环境(production)下启用 HMR**

安装 webpack-dev-server：

```powershell
npm i -D webpack-dev-server
```

配置：

```js
// webpack.config.js

...
+ const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
  },
  module: {...},
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack4 plugins 篇',
      template: './src/index.html'
    }),
    new CleanWebpackPlugin(),
+   new webpack.HotModuleReplacementPlugin(),
  ],
+  devServer: {
+    contentBase: path.resolve(__dirname, "dist"),
+    // 启用 gzip
+    compress: true,
+		 open: true,
+    port: 9000,
+    hot: true,
+    hotOnly: true,
+  },
  // 出口
  output: {...},
}
```

然后在 package.josn 中的 script 里配置命令，方便实用。

```json
// package.json
...
"scripts": {
+ "start": "webpack-dev-server",
  "bundle": "webpack"
},
...
```

然后跑命令：

```powershell
npm start
```

接着修改 index.less，切回浏览器，你会发现 css 效果已经改了。

可以试试修改 js 模块看看效果，修改 index.js：

```js
// index.js
// 在最后面加上这段代码

...
+ if (module.hot) {
+   module.hot.accept('./components/Header', () => {
+     Header();
+   })
+ }
```

然后重新启动 webpack-dev-server，再修改 Header.js：

```js
// Header.js

...
header.innerText = '修改后的header';
...
```

再切回浏览器，你会发现新增了一个修改过的 Header。

## [miniCssExtractPlugin](<https://github.com/webpack-contrib/extract-text-webpack-plugin>)

---

mini-css-extract-plugin 将CSS提取到单独的文件中，类似功能的有 extract-text-webpack-plugin(已废弃)，两者相比，mini-css-extract-plugin 的优点：

- 异步加载
- 没有重复的编译（性能）
- 更容易使用
- 特定于CSS

安装：

```powershell
npm i -D mini-css-extract-plugin
```

然后配置：

```js
// webpack.config.js

...
+ const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {...},
  module: {
    rules: [
    ...
    {
      // 打包 css、less
      test: /\.(css|less)$/,
      use: [
        // 这里一定要加
 +       {
 +         loader: MiniCssExtractPlugin.loader,
 +       },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
          }
        },
        'less-loader',
        'postcss-loader',
      ],
    }],
  },
  plugins: [
    ...
+    new MiniCssExtractPlugin({
+      filename: 'css/[name].css',
+     chunkFilename: 'css/[id].css',
+    }),
  ],
  devServer: {...},
  // 出口
  output: {...},
}
```

接着执行`npm run bundle`打包，你会发现 css 都打包起来了。

## [PurgecssPlugin](<https://github.com/FullHuman/purgecss-webpack-plugin>)

---

可以去除未使用的 css，一般与 glob、glob-all 配合使用。

安装：

```powershell
npm i -D purgecss-webpack-plugin glob
```

配置：

```js
// webpack.config.js

...
+ const glob = require('glob');
+ const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {...},
  module: {...},
  plugins: [
    ...
+    new PurgecssPlugin({
+      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, 
+      { 
+        // 不匹配目录，只匹配文件
+        nodir: true,
+      }),
+    }),
  ],
  devServer: {...},
  // 出口
  output: {...},
}
```

## [optimizeCssAssetsWebpackPlugin](<https://github.com/NMFR/optimize-css-assets-webpack-plugin>)

---

在 production 下打包，js 文件是会自动压缩的，但 css 不会，所以使用 optimize-css-assets-webpack-plugin 进行压缩 css。

安装：

```powershell
npm i -D optimize-css-assets-webpack-plugin
```

配置：

```js
// webpack.config.js

...
+ const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {...},
  module: {...},
  plugins: [
    ...
+   new OptimizeCssAssetsPlugin(),
  ],
  devServer: {...},
  // 出口
  output: {...},
}
```

打包后，你会发现 css 文件都压缩好了。

## 备注

---

篇幅有限，所以就不多 bb 了。