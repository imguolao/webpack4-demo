# webpack4 babel 篇

[demo 代码点此](<https://github.com/imguolao/webpack4-demo>)，如果对 babel 不熟，可以看一下[babel 7 简单指北](<https://github.com/imguolao/webpack4-demo/blob/master/babel7/babel_7.md>)。

webpack 使用 babel 来打包使用 es6 及以上语法的 js 文件是非常方便的，可以通过配置，将 es6 转化为 es5.

## start

---

准备个空文件，执行如下命令：

```powershell
npm init -y
npm i -D webpack webpack-cli
npm i -D babel-loader @babel/core
```

然后创建一个 dist 文件夹，创建一个 html 文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>webpack4 babel 篇</title>
<body>
  <div id="root"></div>
<script type="text/javascript" src="bundle.js"></script></body>
</html>
```

根目录下创建 webpack.config.js，配置 webpack:

```js
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
```

为了转化 es6 代码，要安装 babel 插件:

```powershell
npm i -D @babel/preset-env @babel/polyfill
```

然后在根目录下创建 babel 配置文件 .babelrc:

```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "targets": {
          "browsers": ["last 2 versions", "ie >= 10"]
        }
      }
    ]
  ]
}
```

然后在根目录下创建 index.js:

```js
const add = (x, y) => {
  return new Promise((resolve, reject) => {
    resolve( x + y);
  });
}

add(1, 2).then(res => console.log(res));
```

## 打包

---

终端执行打包：

```powershell
npx webpack
```

打开 dist 目录下的 bundle.js，可以看见代码已经转为 es5，搜索 promise，会发现加上了 promise 的 polyfill：

```js
// bundle.js

...
var add = function add(x, y) {
  return new Promise(function (resolve, reject) {
    resolve(x + y);
  });
};

add(1, 2).then(function (res) {
  return console.log(res);
});
...
```

访问 index.html，console 也打印正常。

##  防止全局污染

---

如果是写第三方库或者框架，使用 polyfill 可能会造成全局污染，所以可以使用 @babel/plugin-transform-runtime 防止全局污染。

安装：

```pow
npm i -D @babel/plugin-transform-runtime
npm i -S @babel/runtime @babel/runtime-corejs2
```

修改 babel 配置：

```
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 2,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}
```

打包即可。

## 备注

---

这个主要是 babel 的配置。

