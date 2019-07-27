# webpack4 code splitting

[demo 代码点此](<https://github.com/imguolao/webpack4-demo>)，webpack4 进行 code splitting 使用 [split-chunks-plugin](<https://webpack.js.org/plugins/split-chunks-plugin/>), 开始前先做点准备工作。

## start

---

安装：

```powershell
npm i -D webpack webpack-cli
npm i -S lodash
```

创建 webpack.config.js 进行配置：

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './index.js',
  },
  optimization: {
    // code splitting settings
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          // 仅将 node_modules 下的代码打包进 vendors.js
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          filename: 'vendors.js',
        },
      },
    },
  },
  // 出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

创建 index.js ：

```js
// 引入 lodas
import _ from 'lodash';

console.log(_.chunk(['a', 'b', 'c', 'd'], 2));
```

打包终端执行 `npx webpack`进行打包，打开 dist 目录，可以看见 bundle.js 和 vendors.js，引入的 lodash 被打包到 vendors 中。

## 公共模块

---

如果 index.js 引入了公共模块，则可以将此模块进行打包。

修改配置：

```js
// webpack.config.js

const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './index.js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      // 代码文件大于 0kb 就进行打包
+     minSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          filename: 'vendors.js',
        },
+       default: {
+         // 公共模块仅引用 1 次也打包进 common.js
+         minChunks: 1,
+         priority: -20,
+         reuseExistingChunk: true,
+         filename: 'common.js',
+       }
      }
    }
  },
  // 出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

然后创建一个 math.js:

```js
// math.js

export default function add (x, y) {
  return x + y;
}
```

接着修改 index.js:

```js
// inddex.js

import add  from './math';
console.log(add(1, 2));
```

执行`npx webpack`进行打包，打开 dist 目录，可以看见 math.js 被打包进 common.js 中了。

## 异步代码

---

打包异步代码需要使用 `import(...)`语法，所以需要配置一下 babel。

安装：

```powershell
npm i -D babel-loader @babel/core babel-plugin-dynamic-import-webpack
```

配置一下 webpack.config.js：

```js
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
  },,
  output: {...},
}
```

修改 index.js:

```js
// index.js

async function getComponent() {
  const { default: _ } = await import('lodash');
  const element = document.createElement('div');
  element.innerHTML = _.join(['hello', 'world'], '-');
  return element;
}

getComponent().then(element => {
  document.body.appendChild(element);
})
```

执行打包，可以看见 import(...) 异步加载的 lodash 被打包成 0.bundle.js。