## babel 7

对于 babel 7，[babel 的官网](<https://babeljs.io/>)已经介绍得非常详细了，但有时感觉文档和实际使用总是差那么一点东西。

### 主要包

---

先来看一下主要的包，babel 7 对于包进行了一些简化。

- [@babel/cli](<https://babeljs.io/docs/en/babel-cli>): 用于执行相应命令

- [@babel/core](<https://babeljs.io/docs/en/babel-core>): 核心包，将 js 代码分析成 AST

- [@babel/preset-env](<https://babeljs.io/docs/en/babel-preset-env>): 包含 es6+  的语法转换规则，如箭头函数、const 等

- [@babel/polyfill](<https://babeljs.io/docs/en/babel-polyfill>): es6 内置对象和函数的垫片，如 Promise、Array.from 等

- [@babel/plugin-transform-runtime](<https://babeljs.io/docs/en/babel-plugin-transform-runtime>): 防止 polyfill 污染全局变量

- [@babel/runtime](<https://babeljs.io/docs/en/babel-runtime>): 与 @babel/plugin-transform-runtime 配套使用

### 安装 babel 7

---

```powershell
npm init -y
npm i -S @babel/cli @babel/core
```

安装完之后，可以看见 package.json 下有 babel 的信息。

```json
{
  "name": "babel_7",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@babel/cli": "^7.4.3",
    "@babel/core": "^7.4.3"
  }
}
```

新建一个 src 目录，并在目录下创建一个 index.js：

```javascript
// src/index.js
const sum = (a, b) => a + b
```

接着新建 dist 目录，存放打包文件，然后执行命令：

```powershell
npx babel src/index.js -d dist/
```

可以在 dist 下看见转换后的 index.js，但内容一模一样，因为 @babel/core 只复制把代码转换为 AST，然后 babel 又把 AST 转为代码，中间并没有做任何处理。

#### @babel/cli 的一些命令

```
转码结果输出到标准输出
npx babel example.js
 
转码结果写入一个文件
--out-file 或 -o 参数指定输出文件
npx babel example.js --out-file compiled.js
或者
npx babel example.js -o compiled.js
 
整个目录转码
--out-dir 或 -d 参数指定输出目录
npx babel src --out-dir lib
或者
npx babel src -d lib
 
-s 参数生成 source map 文件
npx babel src -d lib -s
```

### 配置

---

babel 7 提供了 3 种通过文件进行配置的方式。

1. `babel.config.js`

   适用场景：以编程的方式创建配置文件，希望编译 `node_modules` 目录下的模块

   ```javascript
   module.exports = function (api) {
     api.cache(true);
   
     const presets = [ ... ];
     const plugins = [ ... ];
   
     return {
       presets,
       plugins
     };
   }
   ```

2. `.babelrc`

   适用场景：简单的静态配置

   ```json
   {
     "presets": [...],
     "plugins": [...]
   }
   ```

   也可以将上面的配置移到 package.json 中：

   ```json
   {
     "name": "my-package",
     "version": "1.0.0",
     "babel": {
       "presets": [ ... ],
       "plugins": [ ... ],
     }
   }
   ```

3. `.babelrc.js`

   适用场景和 babel.config.js 类似

   ```javascript
   const presets = [ ... ];
   const plugins = [ ... ];
   module.exports = { presets, plugins };
   ```

   还可以调用 Node.js 的任何 API，例如基于进程环境进行动态配置：

   ```javascript
   const presets = [ ... ];
   const plugins = [ ... ];
   
   if (process.env["ENV"] === "prod") {
     plugins.push(...);
   }
   
   module.exports = { presets, plugins };
   ```

### @babel/polyfill、@babel/preset-env

---

```powershell
npm i -S @babel/polyfill
npm i -D @babel/preset-env
```

安装完之后，在根目录下创建 .babelrc 文件，进行一些简单配置:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "entry"
      }
    ]
  ]
}
```

再将 src/index.js 改一下：

```javascript
// src/index.js
import "@babel/polyfill"

let list = new Set()
list.set(0, 'hhh')

const sum = (a, b) => a + b
```

然后运行转换命令：

```powershell
 npx babel src/index.js -d dist/
```

然后会发现 dist/index.js 中 es6+ 的语法转换为了 es5，而且还添加了一堆`require(...)`，这些都是 polyfill，但没用到的一些东西也依然打包进来了，对于这种情况，babel 7 提供了`useBuiltIns`。

#### useBuiltIns

**useBuiltIns: "usage", "entry", "false"。默认为 false。**

- usage: 在每个文件中使用 polyfill 时，为 polyfill 添加特定导入，babel 利用捆绑器只加载一次相同的polyfill。

- entry: 使用 entry 属性，必须在项目入口处引入一次 @babel/polyfill。然后 babel 在做代码转换的时候，会把

  ```javascript
  import @babel/polyfill
  ```

  转成

  ```javascript
  require("core-js/modules/es6.array.copy-within");
  require("core-js/modules/es6.array.every");
  require("core-js/modules/es6.array.fill");
  // more
  ```

- false: 不引入 polyfill

将  .babelrc 下的`useBuiltIns`改为`usage`，再执行转换命令，就会发现 polyfill 变成了按需导入。

#### targets

babel 7 还提供了`targets`，这个配置主要用于指定需要支持的环境，一般是指浏览器版本。（ targets 还可以指定 node、android、ios、electron 等其他环境）

设置了 targets，babel 在转换前，会先检查 targets 指定的环境已经支持了哪些新语法和 API，然后就不再转换或者不引入已经支持的内容。

配置 targets，依然是修改 .babelrc 文件：

```json
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

### @babel/plugin-transform-runtime、@babel/runtime

---

使用 @babel/polyfill 会对全局对象进行污染，所以可以使用 @babel/plugin-transform-runtime 和@babel/runtime 防止这种现象。

@babel/plugin-transform-runtime 会在你需要的地方自动引入你使用到的新方法。

```powershell
npm i -D @babel/plugin-transform-runtime
npm i -S @babel/runtime
```

安装完毕之后依然是修改 .babelrc 文件：

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["last 2 versions", "ie >= 10"]
        }
      }
    ]
  ],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

然后修改一下 src/index.js：

```js
// src/index.js

class Person {
  constructor (name) {
    this.name = name
  }
}
```

然后用命令进行转换，会发现转换结果和使用 @babel/polyfill 是有一点不一样的。

**注意：** 如果使用 @babel/runtime 的话，一些类的实例方法如：`foobar.includes("foo")`将无法工作。因为它必须在原生对象的原型链上进行修改。

#### 区别

看了上面的做法，你可能会觉得困惑，为什么要一起使用 @babel/plugin-transform-runtime、@babel/runtime 呢，为什么不能单独使用一个？

其实是因为 babel 转换时，@babel/plugin-transform-runtime 这个插件会自动引入使用到的新方法，而引入的这些 polyfill 包是在 @babel/runtime 里面的，所以 @babel/runtime 需要安装在 dependency（生产环境）下，@babel/plugin-transform-runtime 则安装在 devDependency（开发环境）下。

#### 使用哪一个？

至于是使用 @babel/polyfill，还是 @babel/runtime，我也不太清楚，网上的说法大致都是：

一般库或工具中使用 @babel/runtime，因为它可以避免全局的污染。如果是项目中可以直接使用 @babel/polyfill。

其实就是看使用场景吧，毕竟各有利弊。