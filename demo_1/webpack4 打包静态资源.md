# webpack4 打包静态资源

[demo 代码点此](<>)，开始之前，先做点准备工作。

## 准备工作

准备一个空文件夹，然后执行下列命令：

```po
npm init -y
npm i -D webpack webpack-cli
```

然后创建一个 dist 目录，并在里面创建一个 indedx.html：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>webpack4 loader 打包静态资源</title>
</head>
<body>
  <div id="root"></div>

  <!-- 这里引入待会将要打包好的 JS 文件 -->
  <script src="./bundle.js"></script>
</body>
</html>
```

接着创建一个 src 目录，在里面创建一个 lib 文件夹，创建一个 until.js:

```js
// until.js

export function $ (id) {
  return document.getElementById(id);
}

export function add (x, y) {
  return x + y;
}
```

再创建 components 文件夹，再写入几个 js:

```js
// Content.js
import { $ } from '../lib/until';

export default function Content () {
  let content = document.createElement('div');
  content.innerText = 'content';
  $('root').appendChild(content);
}

// Footer.js
import { $ } from '../lib/until';

export default function Footer () {
  let footer = document.createElement('div');
  footer.innerText = 'footer';
  $('root').appendChild(footer);
}

// Header.js
import { $ } from '../lib/until';

export default function Header () {
  let header = document.createElement('div');
  header.innerText = 'header';
  $('root').appendChild(header);
}
```

在 src 下创建 index.js：

```js
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import { $ } from './lib/until';

Header();
Content();
Footer();
```

## 配置 webpack

在根目录下，创建 webpack.config.js:

```js
const path = require('path');

module.exports = {
  // mode: 'production',
  mode: 'development',
  // 入口
  // entry: './src/index.js',
  entry: {
    main: './src/index.js',
  },
  // 出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

然后在 package.json 中的 scripts 中加入：

```json
"scripts": {
  ...
+  "bundle": "webpack"
},
```

在终端运行`npm run bundle`执行打包，然后访问 `/dist/index.html`即可。

## 打包图片

执行下列命令：

```powershell
npm i -D url-loader
```

然后在 src 下创建 assets/images/ 文件夹，然后放入一张图片即可：

```
/src/assets/images/webpack.jpg
```

然后修改 webpack.config.js:

```js
const path = require('path');

module.exports = {
  // mode: 'production',
  mode: 'development',
  // 入口
  // entry: './src/index.js',
  entry: {
    main: './src/index.js',
  },
+  module: {
+    rules: [{
+      // 打包图片
+      test: /\.(jpg|png|gif)$/,
+      use: {
+        // loader: 'file-loader',
+        loader: 'url-loader',
+        options: {
+          name: '[name]_[hash].[ext]',
+          outputPath: 'images/',
+          limit: 8192,
+        },
+      },
+    },
+  },
  // 出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

再修改 index.js:

```js
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
+ import webpack from './assets/images/webpack.jpg';
import { $ } from './lib/until';

Header();
Content();
Footer();

+ let root = $('root');
+ let img = new Image();
+ img.src = webpack;
+ img.id = 'img';
+ root.appendChild(img);
```

执行打包即可。

## 打包css、less、scss

这里仅配置 less，安装 loader：

```powershell
npm i -D less less-loader css-loader style-loader postcss-loader
```

在 src 下创建 index.less：

```less
// index.less
body {
  background-color: #ffffff;
}

#img {
  transform: translate(50px, 0);
}
```

然后修改 webpack.config.js:

```js
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
+    {
+      // 打包 css、less
+      test: /\.(css|less)$/,
+      use: [
+        'style-loader', 
+        {
+          loader: 'css-loader',
+          options: {
+            importLoaders: 2,
+          }
+        },
+        'less-loader',
+        'postcss-loader',
+      ],
+    }],
  },
  // 出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

再修改 index.js:

```js
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import webpack from './assets/images/webpack.jpg';
import { $ } from './lib/until';
+ import './index.less';

Header();
Content();
Footer();

let root = $('root');
let img = new Image();
img.src = webpack;
img.id = 'img';
root.appendChild(img);
```

安装 autoprefixer 为 css 自动添加浏览器前缀：

```powershell
npm i -D autoprefixer
```

然后在根目录创建 postcss.config.js：

```js
module.exports = {
  plugins: {
    'autoprefixer': {
      overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8"
      ]
    },
  }
}
```

接着打包即可。

## 打包字体文件

安装 loader:

```powershell
npm i -D file-loader
```

修改 webpack.config.js:

```js
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
+      // 打包字体文件
+      test: /\.(eot|ttf|svg|woff|woff2)$/,
+      use: {
+        loader: 'file-loader',
+        options: {
+          outputPath: 'font/',
+        }
+      },
+    }],
  },
  // 出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

然后创建文件夹 /src/assets/font/，在里面放一下字体文件，我放的是图标的字体文件。

```
// 这些是我放入的字体文件
iconfont.eot
iconfont.svg
iconfont.ttf
iconfont.woff
iconfont.woff2
```

修改 index.js:

```js
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import webpack from './assets/images/webpack.jpg';
import { $ } from './lib/until';
import './index.less';

Header();
Content();
Footer();

let root = $('root');
let img = new Image();
img.src = webpack;
img.id = 'img';
root.appendChild(img);

+ let div = document.createElement('div');
+ div.classList.add('iconfont', 'icon-chenggong');
+ root.appendChild(div);
```

再修改 index.less:

```less
body {
  background-color: #ffffff;
}

#img {
  transform: translate(50px, 0);
}

+ @font-face {font-family: "iconfont";
+   src: url('./assets/font/iconfont.eot?t=1563786008234');
+   src: url('./assets/font/iconfont.eot?t=1563786008234#iefix') format('embedded-opentype'),
+   url('data:application/x-font-woff2;charset=utf-8;base64,') format('woff2'),
+   url('./assets/font/iconfont.woff?t=1563786008234') format('woff'),
+   url('./assets/font/iconfont.ttf?t=1563786008234') format('truetype'), 
+   url('./assets/font/iconfont.svg?t=1563786008234#iconfont') format('svg');
+ }
+ 
+ .iconfont {
+   font-family: "iconfont" !important;
+   font-size: 16px;
+   font-style: normal;
+   -webkit-font-smoothing: antialiased;
+   -moz-osx-font-smoothing: grayscale;
+ }
+ 
+ .icon-chenggong:before {
+   content: "\e873";
+ }
```

打包即可，访问网页可以看见图标。

## 备注

具体可查看 [webpack4 官网](<https://webpack.js.org/guides/asset-management/>)。