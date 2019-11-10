# webpack 4 不完全使用手册

---

以下内容是我在学习使用 webpack 4 时，记录下来的一些笔记和做法，抽空汇集了一下。

对于 webpack 4，其实[官网](<https://webpack.js.org/>)已经介绍得很详细了，但很多时候我还是靠着网络搜索才慢慢掌握一些用法，希望这里的笔记能帮到你。

## babel 7

在使用 webpack 之前，可以了解一下 babel 7。

1. [babel 7 简单指北](<https://www.cnblogs.com/guolao/p/10753795.html>)

## webpack 4

1. [打包静态资源](<https://www.cnblogs.com/guolao/p/11227646.html>)
2. [plugins 篇](<https://www.cnblogs.com/guolao/p/11239756.html>)
3. [babel 篇](<https://www.cnblogs.com/guolao/p/11244758.html>)
3. [code splitting 篇](<https://www.cnblogs.com/guolao/p/11256275.html>)
5. [css modules]( https://www.cnblogs.com/guolao/p/11830098.html )

## 问题

1.  **[purgecss-webpack-plugin](https://github.com/FullHuman/purgecss-webpack-plugin)** 清除第三方库样式 
- 解决办法可以查看[purgecss-webpack-plugin/issues/25]( https://github.com/FullHuman/purgecss-webpack-plugin/issues/25 )
   
- 或者查看 [demo_5]( https://github.com/imguolao/webpack4-demo/tree/master/demo_5 ) 下的 [webpack]( https://github.com/imguolao/webpack4-demo/blob/master/demo_5/webpack.config.js ) 配置

