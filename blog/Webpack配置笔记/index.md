---
title: webpack 配置笔记
date: 2019-4-18 13:35:17
categories:
- 前端
tags: 前端, 前端构建工具, webpack
path: /webpack-config-note/
---

# webpack4 配置一览

- 基于[react-boilerplate](https://github.com/react-boilerplate/react-boilerplate)
- 技术栈 antd + react + less
- 不断更新

## 前端的发展

### 模块化

模块化是指把一个复杂的系统分解到多个模块以方便编码。

### 挂载到变量

jQuery 库把它的API都放在了 `window.$` 下，在加载完 jQuery 后其他模块再通过 `window.$` 去使用 jQuery

- 命名空间冲突，两个库可能会使用同一个名称，例如 Zepto 也被放在 `window.$` 下；
- 无法合理地管理项目的依赖和版本；
- 无法方便地控制依赖的加载顺序。

### CommonJS

通过 require 方法来同步地加载依赖的其他模块

```js
// 导入
const moduleA = require('./moduleA');

// 导出
module.exports = moduleA.someFunc;
```

CommonJS 的优点在于：

- 代码可复用于 Node.js 环境下并运行，例如做同构应用；
- 通过 NPM 发布的很多第三方模块都采用了 CommonJS 规范。

缺点在于这样的代码无法直接运行在浏览器环境下，必须通过工具转换成标准的 ES5。

### AMD

采用异步的方式去加载依赖的模块

```js
define('module', ['dep'], function(dep) {
  return exports;
});

// 导入和使用
require(['module'], function(module) {
});
```

AMD 的优点在于：

- 可在不转换代码的情况下直接在浏览器中运行；
- 可异步加载依赖；
- 可并行加载多个依赖；
- 代码可运行在浏览器环境和 Node.js 环境下。

AMD 的缺点在于JavaScript 运行环境没有原生支持 AMD，需要先导入实现了 AMD 的库后才能正常使用。

### ES6 模块化

逐渐取代 CommonJS 和 AMD 规范

```js
// 导入
import { readFile } from 'fs';
import React from 'react';
// 导出
export function hello() {};
export default {
  // ...
};
```

它的缺点在于目前无法直接运行在大部分 JavaScript 运行环境下，必须通过工具转换成标准的 ES5 后才能正常运行。

## webpack 核心概念

源代码无法直接运行，必须通过转换后才可以正常运行。

- Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
- Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
- Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
- Output：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。

Webpack 启动后会从 Entry 里配置的 Module 开始递归解析 Entry 依赖的所有 Module。 每找到一个 Module， 就会根据配置的 Loader 去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。 这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 Chunk。最后 Webpack 会把所有 Chunk 转换成文件输出。 在整个流程中 Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。

## webpack.base.babel.js 

```js 
/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');

const fs = require('fs');
const lessToJs = require('less-vars-to-js');
const themer = lessToJs(
  fs.readFileSync(path.join(__dirname, '../../app/antd-theme/theme.less'), 'utf8')
);

const postcssGlobalImport = require('postcss-global-import');
const postcssImport = require('postcss-import');
const postcssCustomProperties = require('postcss-custom-properties');
const postcssCustomMedia = require('postcss-custom-media');
const postcssMediaMinmax = require('postcss-media-minmax');
const postcssCustomSelectors = require('postcss-custom-selectors');
const postcssCalc = require('postcss-calc');
const postcssNesting = require('postcss-nesting');
const postcssNested = require('postcss-nested');
const postcssColorFunction = require('postcss-color-function');
const pleeeaseFilters = require('pleeease-filters');
const pixrem = require('pixrem');
const postcssSelectorMatches = require('postcss-selector-matches');
const postcssSelectorNot = require('postcss-selector-not');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const autoprefixer = require('autoprefixer');
const globalJSON = require(path.resolve(process.cwd(), 'global.json'));

// 将 CSS 提取到单独的文件中，它为每个包含 CSS 的 JS 文件创建一个 CSS 文件，它支持 CSS 和 SourceMaps 的按需加载。
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (options) => ({
  // context: path.resolve(__dirname, 'app') // 默认 context 为根目录，影响相对路径所指向的真实文件
  entry: options.entry, // 必填，配置模块的入口
  mode: options.mode,
  optimization: options.optimization,
  output: Object.assign({ // Compile into js/build.js
    // 配置输出文件存放在本地的目录
    path: path.resolve(process.cwd(), 'build'),
    // 发布到线上的所有资源的 URL 前缀，string 类型
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: { // 配置如何处理模块。
    rules: [
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        // 尽可能的缩小命中范围，加快 Webpack 搜索速度
        include: [/app/, /unicorn/],
        // 排除 node_modules 目录下的文件
        // exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          // 一组 Loader 的执行顺序默认是从右到左执行，通过 enforce 选项可以让其中一个 Loader 的执行顺序放到最前或者最后。
          // 多线程加载耗时 loader
          'thread-loader',
          {
            loader: 'babel-loader',
            options: options.babelQuery,
            // enforce:'post' 的含义是把该 Loader 的执行顺序放到最后
            // enforce 的值还可以是 pre，代表把 Loader 的执行顺序放到最前面
          },
        ],
      },
      {
        test: /\.css/,
        include: [/app/, /unicorn/],
        use: [
          {
            // 大概是把 CSS 内容用 JavaScript 里的字符串存储起来 
            // 在网页执行 JavaScript 时通过 DOM 操作动态地往 HTML head 标签里插入 HTML style 标签。
            // 也许你认为这样做会导致JavaScript 文件变大并导致加载网页时间变长，如果想让 Webpack 单独输出 CSS 文件
            // webpack4 用 mini-css-extract-plugin, 之前的版本用 extract-text-webpack-plugin
            loader: options.cssDebug ? 'style-loader' : MiniCssExtractPlugin.loader,
            options: {
              // Stylesheet Limits in Internet Explorer
              // Internet Explorer 6 到 9 支持的最大样式表和规则数
              // https://blogs.msdn.microsoft.com/ieinternals/2011/05/14/stylesheet-limits-in-internet-explorer/
              singleton: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              // CSS Loader https://github.com/webpack/css-loader
              // 指定 css-loader 处理前最多可以经过的 loader 个数
              // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
              importLoaders: 1, 
              sourceMap: options.cssDebug,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: options.cssDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
              // CSS Nano http://cssnano.co/options/
              // minimize: !options.cssDebug, // v2 中会报错
              // discardComments: { removeAll: true }, // v2 中会报错
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                // Transfer @global-import rule by inlining content with :global CSS Modules scope
                // e.g. @global-import 'draft-js/dist/Draft.css'
                // https://github.com/scherebedov/postcss-global-import
                postcssGlobalImport(),
                // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
                // https://github.com/postcss/postcss-import
                postcssImport({ path: 'app' }),
                // W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
                // https://github.com/postcss/postcss-custom-properties
                postcssCustomProperties(),
                // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
                // https://github.com/postcss/postcss-custom-media
                postcssCustomMedia(),
                // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
                // https://github.com/postcss/postcss-media-minmax
                postcssMediaMinmax(),
                // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
                // https://github.com/postcss/postcss-custom-selectors
                postcssCustomSelectors(),
                // W3C calc() function, e.g. div { height: calc(100px - 2em); }
                // https://github.com/postcss/postcss-calc
                postcssCalc(),
                // Allows you to nest one style rule inside another
                // https://github.com/jonathantneal/postcss-nesting
                postcssNesting(),
                // Unwraps nested rules like how Sass does it
                // https://github.com/postcss/postcss-nested
                postcssNested(),
                // W3C color() function, e.g. div { background: color(red alpha(90%)); }
                // https://github.com/postcss/postcss-color-function
                postcssColorFunction(),
                // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
                // https://github.com/iamvdo/pleeease-filters
                pleeeaseFilters(),
                // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
                // https://github.com/robwierzbowski/node-pixrem
                pixrem(),
                // W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
                // https://github.com/postcss/postcss-selector-matches
                postcssSelectorMatches(),
                // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
                // https://github.com/postcss/postcss-selector-not
                postcssSelectorNot(),
                // Postcss flexbox bug fixer
                // https://github.com/luisrudge/postcss-flexbugs-fixes
                postcssFlexbugsFixes(),
                // Add vendor prefixes to CSS rules using values from caniuse.com
                // https://github.com/postcss/autoprefixer
                autoprefixer(/* package.json/browserslist */),
              ],
            },
          },
        ],
      },
      {
        // custom Ant Design theme
        test: /\.less$/,
        include: /node_modules/,
        use: [
          {
            loader: options.cssDebug ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            // options: {
            //   minimize: true,
            // },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer()],
            },
          },
          {
            // 每一个 Loader 都可以通过 URL querystring 的方式传入参数，也可以通过 options 传入
            // 还可以在源码中指定用什么 Loader 去处理文件
            // require('style-loader!css-loader?minimize!./main.css');
            // import '!file-loader?name=[name].[ext]!./manifest.json';
            loader: `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(themer)}}`,
          },
        ],
      },
      {
        test: /\.css/,
        include: /node_modules/,
        use: [
          {
            loader: options.cssDebug ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1, 
              sourceMap: options.cssDebug,
              // do not use css modules for original css in node_modules
              // 引入第三方库时不对其 hash 处理，防止样式不生效
              // 启用 CSS 模块规范，自动为每一个类生成一个哈希值，可以惟一标志这个类
              // :global 不对其类名进行转化，默认为 :local
              modules: false,
              // 生成 hash 时的格式
              localIdentName: options.cssDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
            },
          },
        ],
      },
      // 暂时屏蔽，对 IE 有影响
      // {
      //   test: /\.svg$/,
      //   use: [
      //     {
      //       loader: 'svg-url-loader',
      //       options: {
      //         // Inline files smaller than 10 kB
      //         limit: 10 * 1024,
      //         noquotes: true,
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.(eot|ttf|woff|woff2|mp3|xls|xlsx|csv|mp4|webm|json|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name() {
                return '[name]-[hash].[ext]';
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
            },
          },
          // {
          //   loader: 'image-webpack-loader',
          //   options: {
          //     mozjpeg: {
          //       enabled: false,
          //       // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
          //       // Try enabling it in your environment by switching the config to:
          //       // enabled: true,
          //       // progressive: true,
          //     },
          //     gifsicle: {
          //       interlaced: false,
          //     },
          //     optipng: {
          //       optimizationLevel: 7,
          //     },
          //     pngquant: {
          //       quality: '65-90',
          //       speed: 4,
          //     },
          //   },
          // },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
            options: {
              gfm: true,
              tables: true,
              // highlight: (code) => highlight.highlightAuto(code).value,
            },
          },
        ],
      }],
    // noParse: [ // 不用解析和处理的模块
    //   /special-library\.js$/  // 用正则匹配
    // ],
  },
  // externals: {
  //   // 把导入语句里的 jquery 替换成运行环境里的全局变量 jQuery
  //   jquery: 'jQuery'
  // }
  plugins: options.plugins.concat([ // 扩展 Webpack 功能，几乎让 Webpack 可以做任何构建相关的事情
    // new SimpleProgressWebpackPlugin(),

    new webpack.ProvidePlugin({
      // make fetch available, 和 externals 一样的效果
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
      $: 'jquery',
      jQuery: 'jquery',
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        GLOBAL: JSON.stringify(globalJSON || {}),
        SERVER: JSON.stringify(process.env.SERVER),
      },
    }),

    new CopyWebpackPlugin([
      'app/favicon.ico',
      'app/manifest.json',
    ].map((src) => ({ from: src, to: path.resolve(process.cwd(), 'build') }))),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].css',
    }),

    // only load locale we need
    // https://github.com/moment/moment/issues/2517#issuecomment-185836313
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh/), // eslint-disable-line
  ]),
  resolve: { // 配置 Webpack 如何寻找模块所对应的文件
    // 配置 Webpack 去哪些目录下寻找第三方模块，配置后可以简单的引入 import 'components'，等价于 import 'app/components'
    modules: ['app', 'node_modules'],
    // 通过别名来把原导入路径映射成一个新的导入路径，$ 符号来缩小范围到只命中以关键字结尾
    alias: {
      // zh-cn.js will import '../moment', since we are using jsnext:main, it will pack two copys of moment.
      moment$: path.resolve(process.cwd(), 'node_modules/moment/moment'),
      unicorn: path.resolve(process.cwd(), 'unicorn'),
      // 使用 alias 把导入 react 的语句换成直接使用单独完整的 react.production.min.js 文件，减少耗时的递归解析操作
      // 因为会影响 Tree-Shaking 去除无效代码，一般对整体性比较强的库采用本方法优化
      // 不适用一些工具类的库，如 lodash，导致输出代码中包含很多永远不会执行的代码
      react: path.resolve(process.cwd(), 'node_modules/react/cjs/react.production.min.js'),
      'react-dom$': path.resolve(process.cwd(), 'node_modules/react-dom/cjs/react-dom.production.min.js'),
      'react-dom/server$': path.resolve(process.cwd(), 'node_modules/react-dom/cjs/react-dom-server.browser.production.min.js'),
    },
    // 在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在
    extensions: [
      // 尽可能的减少后缀尝试的可能性
      '.js',
      // '.jsx',
      // '.react.js',
    ],
    // 会按照数组里的顺序去 package.json 文件里寻找，只会使用找到的第一个
    mainFields: [
      // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件，
      // 利于 Tree Shaking/Scope Hoisting
      // 剔除 JavaScript 中用不上的死代码 / 让 Webpack 打包出来的代码文件更小、运行的更快，合并声明性的代码
      'jsnext:main',
      // 'browser',
      'main', // 采用 ES5 语法的代码入口文件，尽量采用 main 字段作为入口文件描述字段，以减少搜索步骤
    ],
  },
  devtool: options.devtool,
  // 让 Webpack 构建出针对不同运行环境的代码
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
  // 输出文件性能检查配置
  // performance: { 
  //   hints: 'warning', // 有性能问题时输出警告
  //   hints: 'error', // 有性能问题时输出错误
  //   hints: false, // 关闭性能检查
  //   maxAssetSize: 200000, // 最大文件大小 (单位 bytes)
  //   maxEntrypointSize: 400000, // 最大入口文件大小 (单位 bytes)
  //   assetFilter: function(assetFilename) { // 过滤要检查的文件
  //     return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
  //   }
  // },
});
```

## webpack.dev.babel.js

```js
/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const logger = require('../../server/logger');
const cheerio = require('cheerio');
const pkg = require(path.resolve(process.cwd(), 'package.json'));
const dllPlugin = pkg.dllPlugin;

const plugins = [
  new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
  new HtmlWebpackPlugin({
    inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
    templateContent: templateContent(), // eslint-disable-line no-use-before-define
  }),
  new webpack.DefinePlugin({
    __APP__: JSON.stringify({}),
  }),
  new CircularDependencyPlugin({
    exclude: /a\.js|node_modules/, // exclude node_modules
    failOnError: false, // show a warning when there is a circular dependency
  }),
];

module.exports = require('./webpack.base.babel')({
  mode: 'development',
  // Add hot reloading in development
  // 如果 entry 是一个 string 或 array，就只会生成一个 Chunk，这时 Chunk 的名称是 main；
  entry: [
    'babel-polyfill',
    'eventsource-polyfill', // Necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true',
    path.join(process.cwd(), 'app/app.js'), // Start with js/app.js
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js', // 配置输出文件的名称，有多个 Chunk 要输出时采用 [name].js 的写法
    // 内置变量包括 id、name、hash、chunkhash
    // 其中 hash 和 chunkhash 的长度是可指定的，[hash:8] 代表取 8 位 Hash 值，默认是 20 位。

    // 注意 ExtractTextWebpackPlugin 插件是使用 contenthash 来代表哈希值而不是 chunkhash
    // 原因在于 ExtractTextWebpackPlugin 提取出来的内容是代码内容本身而不是由一组模块组成的 Chunk。
  
    // 配置无入口的 Chunk 在输出时的文件名称, 用于指定在运行过程中生成的 Chunk 在输出时的文件名称
    // 生成 Chunk 场景有在使用 CommonChunkPlugin、使用 import('path/to/module') 动态加载等时。
    // chunkFilename 支持和 filename 一致的内置变量
    chunkFilename: '[name].chunk.js',
  },

  optimization: {
    noEmitOnErrors: true, // 跳过报错阶段
    splitChunks: {
      chunks: 'all',
    },
  },

  // Add development plugins
  plugins: dependencyHandlers().concat(plugins), // eslint-disable-line no-use-before-define

  // Tell babel that we want to hot-reload
  babelQuery: {
    // require.resolve solves the issue of relative presets when dealing with
    // locally linked packages. This is an issue with babel and webpack.
    // See https://github.com/babel/babel-loader/issues/149 and
    // https://github.com/webpack/webpack/issues/1866
    presets: ['babel-preset-react-hmre'].map(require.resolve),
  },

  // Emit a source map for easier debugging
  // 配置 Webpack 如何生成 Source Map
  // eval：用 eval 语句包裹需要安装的模块；
  // source：生成独立的 Source Map 文件；
  // hidden: JavaScript 文件中指出 Source Map 文件所在，这样浏览器就不会自动加载 Source Map；
  // inline：把生成的 Source Map 转换成 base64 格式内嵌在 JavaScript 文件中；
  // cheap：生成的 Source Map 中不会包含列信息，这样计算量更小，输出的 Source Map 文件更小；同时 Loader 输出的 Source Map 不会被采用；
  // module：来自 Loader 的 Source Map 被简单处理成每行一个模块；

  //在开发环境下把 devtool 设置成 cheap-module-eval-source-map，因为生成这种 Source Map 的速度最快，能加速构建。由于在开发环境下不会做代码压缩，Source Map 中即使没有列信息也不会影响断点调试；
  // 在生产环境下把 devtool 设置成 hidden-source-map，意思是生成最详细的 Source Map，但不会把 Source Map 暴露出去。由于在生产环境下会做代码压缩，一个 JavaScript 文件只有一行，所以需要列信息。
  devtool: 'cheap-module-eval-source-map',

  performance: {
    hints: false,
  },

  cssDebug: true,
});

/**
 * Select which plugins to use to optimize the bundle's handling of
 * third party dependencies.
 *
 * If there is a dllPlugin key on the project's package.json, the
 * Webpack DLL Plugin will be used.  Otherwise the CommonsChunkPlugin
 * will be used.
 *
 */
function dependencyHandlers() {
  // Don't do anything during the DLL Build step
  if (process.env.BUILDING_DLL) { return []; }

  // If the package.json does not have a dllPlugin property, use the CommonsChunkPlugin
  if (!dllPlugin) {
    return [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        children: true,
        minChunks: 2,
        async: true,
      }),
    ];
  }

  const dllPath = path.resolve(process.cwd(), dllPlugin.path || 'node_modules/react-boilerplate-dlls');

  /**
   * If DLLs aren't explicitly defined, we assume all production dependencies listed in package.json
   * Reminder: You need to exclude any server side dependencies by listing them in dllConfig.exclude
   */
  if (!dllPlugin.dlls) {
    const manifestPath = path.resolve(dllPath, 'reactBoilerplateDeps.json');

    if (!fs.existsSync(manifestPath)) {
      logger.error('The DLL manifest is missing. Please run `npm run build:dll`');
      process.exit(0);
    }

    return [
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        // 描述动态链接库的文件内容
        manifest: require(manifestPath), // eslint-disable-line global-require
      }),
    ];
  }

  // If DLLs are explicitly defined, we automatically create a DLLReferencePlugin for each of them.
  const dllManifests = Object.keys(dllPlugin.dlls).map((name) => path.join(dllPath, `/${name}.json`));

  return dllManifests.map((manifestPath) => {
    if (!fs.existsSync(path)) {
      if (!fs.existsSync(manifestPath)) {
        logger.error(`The following Webpack DLL manifest is missing: ${path.basename(manifestPath)}`);
        logger.error(`Expected to find it in ${dllPath}`);
        logger.error('Please run: npm run build:dll');

        process.exit(0);
      }
    }

    return new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(manifestPath), // eslint-disable-line global-require
    });
  });
}

/**
 * We dynamically generate the HTML content in development so that the different
 * DLL Javascript files are loaded in script tags and available to our application.
 */
function templateContent() {
  const html = fs.readFileSync(
    path.resolve(process.cwd(), 'app/index.html')
  ).toString();

  if (!dllPlugin) { return html; }

  const doc = cheerio(html);
  const body = doc.find('body');
  const dllNames = !dllPlugin.dlls ? ['reactBoilerplateDeps'] : Object.keys(dllPlugin.dlls);

  dllNames.forEach((dllName) => body.append(`<script data-dll='true' src='/${dllName}.dll.js'></script>`));

  return doc.toString();
}
```

## webpack.dll.babel.js

```js
/**
 * WEBPACK DLL GENERATOR
 *
 * This profile is used to cache webpack's module
 * contexts for external library and framework type
 * dependencies which will usually not change often enough
 * to warrant building them from scratch every time we use
 * the webpack process.
 */

const { join } = require('path');
const defaults = require('lodash/defaultsDeep');
const webpack = require('webpack');
const pkg = require(join(process.cwd(), 'package.json'));
const dllPlugin = require('../config').dllPlugin;

if (!pkg.dllPlugin) { process.exit(0); }

const dllConfig = defaults(pkg.dllPlugin, dllPlugin.defaults);
const outputPath = join(process.cwd(), dllConfig.path);

module.exports = require('./webpack.base.babel')({
  mode: 'development',
  context: process.cwd(),
  entry: dllConfig.dlls ? dllConfig.dlls : dllPlugin.entry(pkg),
  devtool: 'eval',
  output: {
    filename: '[name].dll.js', // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称
    path: outputPath,
    library: '[name]', // 存放动态链接库的全局变量名称，例如对应 react 来说就是 _dll_react
  },
  plugins: [
    new webpack.DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 [name].json 文件 中 name 字段的值
      // 在 webpack.dev.babel.js 文件中 DllReferencePlugin 会去 [name].json 文件读取 name 字段的值
      // 把值的内容作为在从全局变量中获取动态链接库中内容时的全局变量名
      name: '[name]',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: join(outputPath, '[name].json') }), // eslint-disable-line no-new
  ],
  performance: {
    hints: false,
  },
});
```

## webpack.prod.babel.js

```js
// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = require('./webpack.base.babel')({
  mode: 'production',
  // In production, we skip all hot-reloading stuff
  // 如果 entry 是一个 object，就可能会出现多个 Chunk，这时 Chunk 的名称是 object 键值对里键的名称。
  entry: {
    main: ['babel-polyfill', 'raf/polyfill', path.join(process.cwd(), 'app/app.js')],
    draft: [
      'draft-js', 'draft-js-plugins-editor', 'draft-js-mention-plugin', 'draft-convert',
    ],
    'react-player': [
      'react-player',
    ],
  },
  babelOptions: {
    // babel-loader 的参数，用于缓存 babel 编译结果加快重新编译速度
    cacheDirectory: true,
  },
  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    // 根据文件内容 hash 值生成文件名称，用于浏览器长时间缓存文件
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        // 多嵌套了一层
        uglifyOptions: {
          mangle: true,
          compress: {
            // 在 UglifyJs 删除没有用到的代码时不输出警告
            warnings: false,
            // 删除所有的 `console` 语句，可以兼容 ie 浏览器
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true,
          },
          output: {
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
    // Scope Hoisting
    // 分析出模块之间的依赖关系，尽可能的把打散的模块合并到一个函数中去，但前提是不能造成代码冗余。
    // 因此只有那些被引用了一次的模块才能被合并。
    concatenateModules: true,
    splitChunks: { // splitChunks、runtimeChunk 代替 webpack1~3 原有的 commonsChunkPlugin 的方法
      // 这里设置 initial 时首页为 777k，跳转到任务中心 204k
      // 未升级前首页为 739k，跳转到任务中心 201k
      // 设置为 all 时，首页为 1.1M，跳转到任务中心 18.7k
      // chunks: 'initial', // 可填 async, initial, all. 顾名思义，async 针对异步加载的 chunk 做切割，initial 针对初始 chunk，all 针对所有 chunk
      // minSize: 30000, // 切割完要生成的新 chunk 要>30kb，否则不生成新 chunk
      // minChunks: 2, // 共享该 module 的最小 chunk 数
      // maxAsyncRequests: 2, // 最多有 5 个异步加载请求该 module
      // maxInitialRequests: 5, // 初始化的时候最多有 4 个请求该 module
      // automaticNameDelimiter: '-', // 名字中间的间隔符
      // name: true, // chunk 的名字，如果设成 true，会根据被提取的 chunk 自动生成
      // 优化原则：保持最大重用性，首页提取 node_modules 所有的公共库导致加载时间较长
      // 后续加载很快
      cacheGroups: {
        default: false,
        // vendors: false,
        draft: {
          test: 'draft',
          name: 'draft',
          chunks: 'async',
          priority: 3, // 该配置项是设置处理的优先级，数值越大越优先处理
        },
        'react-player': {
          test: 'react-player',
          name: 'react-player',
          chunks: 'async',
          priority: 2, // 该配置项是设置处理的优先级，数值越大越优先处理
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 1, // 该配置项是设置处理的优先级，数值越大越优先处理
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: -1,
          chunks: 'all',
          reuseExistingChunk: true, // 这个配置允许我们使用已经存在的代码块
        },
        // polyfill: {
        //   test: 'polyfill', // 用来决定提取哪些 module，可以接受字符串，正则表达式，或者函数，函数的一个参数为 module，第二个参数为引用这个 module 的 chunk(数组)
        //   name: 'polyfill',
        //   // reuseExistingChunk // 当 module 未变时，是否可以使用之前的 chunk
        // },
        // vendor: {
        //   test: 'vendor',
        //   name: 'vendor',
        // },
        // styles: {
        //   name: 'styles',
        //   test: /\.css$/,
        //   chunks: 'all',
        // },
        // styles: {
        //   name: 'styles',
        //   test: /\.css$/,
        //   chunks: 'all',
        //   enforce: true,
        //   priority: 20,
        // },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
  },

  plugins: [
    new LodashModuleReplacementPlugin(), // lodash 优化由 592.53k 到 240k
    // 实现 chunkhash 的稳定化
    new webpack.HashedModuleIdsPlugin(),
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
  ],

  performance: {
    assetFilter: (assetFilename) => !(/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)),
  },
});
```

---

以上更新于 2019-2-13 19:47:27

# webpack 配置全局变量

## 项目背景

个性化项目标题、图标，可以对编译后的文件改动，以达到无需编译即可改变标题或图标的效果

## 解决思路

主要是在 `index.html` 文件中注入全局变量

## 解决步骤

1. 在 `index.html` 中注入全局变量

```html
<script>
  document.write("<s"+"cript type='text/javascript' src='/config.js?"+Math.random().toString(36).substr(2)+"'></scr"+"ipt>");
</script>
```

2. 在 `app.js` 中注入此文件，编译时 `webpack` 会拷贝文件到 `build` 目录下

```js
import '!file-loader?name=[name].[ext]!./config.js';
```

或在 `webpack.base.config.js` 中添加如下代码达到相同效果

```js
new CopyWebpackPlugin([
  'app/config.js',
].map((src) => ({ from: src, to: path.resolve(process.cwd(), 'build') }))),
```

3. 在 `config.js` 中添加全局变量

```js
window.RUNTIME_CONSTANTS = {
  title: '百度',
};
```

4. 愉快使用全局变量
