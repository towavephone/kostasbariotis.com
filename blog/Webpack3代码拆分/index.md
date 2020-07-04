---
title: Webpack3代码拆分
date: 2017-12-13 14:50:16
categories:
- 前端
tags: 前端, 前端构建工具, webpack
path: /webpack-code-split/
---

翻译转载：[Webpack 3, Dynamic Imports, Code Splitting, and Long Term Caching… Made Easy.](https://blog.cloudboost.io/webpack-3-dynamic-imports-code-splitting-and-long-term-caching-made-easy-1892981e0ae7)
在与Webpack 1.x升级到3.x（比我想承认的更长的时间）后，突然点击了一下。看到揭开的奥秘：
<div align="center"><iframe src="https://giphy.com/embed/xUOxeX2W00FmKjNsUo" width="480" height="222" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/code-splitting-dynamic-imports-webpack-3-xUOxeX2W00FmKjNsUo">via GIPHY</a></p></div>
演示一个简单的应用程序动态加载多个路线。请注意编辑“页面2”后的200响应，而未更改的文件则为304。

TL：DR 示例应用程序回购

```js
// webpack.config.js
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const APP_DIR = path.resolve(__dirname, './src');
const MODULES_DIR = path.resolve(__dirname, './node_modules');

const package = require('./package.json');

module.exports = {
  devServer: {
    historyApiFallback: true
  },
  entry: {
    app: APP_DIR +'/index.js',
    vendor: Object.keys(package.dependencies)
  },
  output: {
    publicPath: '/',
    chunkFilename: '[name].[chunkhash].js',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [ APP_DIR, MODULES_DIR ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include : APP_DIR,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Caching and Code Splitting',
      template: APP_DIR + '/index.html'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name:'vendor',
      filename: 'vendor.[chunkhash].js'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name:'manifest'
    })

  ]
};
```

```javaScript
// .babelrc
{
  "presets": [
    "react",
    ["env", {
      "targets": {
        "browsers": ["last 2 versions"]
      }
    }],
    "stage-0"
  ],
  "comments": true
}
```

```js
{
  "name": "webpack-cs-ltc",
  "version": "1.0.0",
  "description": "A simple boilerplate for Webpack 3, dynamic imports, code splitting, and long term caching.",
  "main": "index.js",
  "scripts": {
    "start": "webpack --config webpack.config.js",
    "dev-server": "webpack-dev-server",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Geoff Miller",
  "license": "MIT",
  "dependencies": {
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "react-loadable": "^5.3.1",
    "react-router-dom": "^4.2.2"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-preset-env": "^1.6.1",
    "babel-preset-react": "^6.24.1",
    "babel-preset-stage-0": "^6.24.1",
    "html-webpack-plugin": "^2.30.1",
    "webpack": "^3.10.0",
    "webpack-dev-server": "^2.9.7"
  }
}
```

让我们通过这些配置文件，并揭秘发生了什么事情。

我总是从文件开始查看新的代码库的package.json。这使我能够在代码中看到它们之前了解依赖关系。

```js
// package.json  
"dependencies": {
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "react-loadable": "^5.3.1", <-- dynamic imports for react
    "react-router-dom": "^4.2.2"
  },
```

在我们的应用程序中，react-loadable将完成所有繁重的动态导入工作。这是一个小包装，减少样板和增加一些方便的功能。所以，而不是必须为每个动态导入执行此操作：

```js
class MyComponent extends React.Component {
  state = {
    Bar: null
  };

  componentWillMount() {
    import('./components/Bar').then(Bar => {
      this.setState({ Bar });
    });
  }

  render() {
    let {Bar} = this.state;
    if (!Bar) {
      return <div>Loading...</div>;
    } else {
      return <Bar/>;
    };
  }
}
```

我们现在可以做到：

```js
import Loadable from 'react-loadable';

const LoadableBar = Loadable({
  loader: () => import('./components/Bar'),
  loading() {
    return <div>Loading...</div>
  }
});

class MyComponent extends React.Component {
  render() {
    return <LoadableBar/>;
  }
}
```

好的，到devDependencies：

```js
// package.json
"devDependencies": {
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-preset-env": "^1.6.1",
    "babel-preset-react": "^6.24.1",
    "babel-preset-stage-0": "^6.24.1", <-- needed for dynamic import
    "html-webpack-plugin": "^2.30.1",
    "webpack": "^3.10.0",
    "webpack-dev-server": "^2.9.7"
  }
```

这里唯一不同寻常的软件包是babel-preset-stage-0。动态导入是第三阶段的建议。如果你想你可以使用babel-preset-stage-3，但babel-preset-stage-0将包括所有的阶段1，阶段2和阶段3。根据需要将其配置为您的代码库/喜好，你需要的是动态导入功能的阶段3。

```js
// .babelrc
{
  "presets": [
    "react",
    ["env", {
      "targets": {
        "browsers": ["last 2 versions"]
      }
    }],
    "stage-0" <-- no big surprise here
  ],
  "comments": true
}
```

确保包含stage-0在你的babel预设中。有些事情要注意，有几个动态的输入插件webpack/babel在那。在这个用例中你不需要使用Webpack 3（前端只有react）。如果我错了希望有人能纠正我。
请注意"comments": true设置。这将帮助我们使用Webpack的神奇评论来命名我们的动态导入文件。

```js
// webpack.config.js
...  
entry: {
    app: APP_DIR +'/index.js',
    vendor: Object.keys(package.dependencies)
},
output: {
    publicPath: '/',
    chunkFilename: '[name].[chunkhash].js',
    filename: '[name].[chunkhash].js'
  },
...
plugins: [
    ...
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name:'vendor',
      filename: 'vendor.[chunkhash].js'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name:'manifest'
    })
  ]
...
```

这就是“普通”React webpack安装程序之外所需要的。这里有一些关于这个配置的更多细节。
定义您的输入分割点。在我们的例子中，我们需要一个app.x.js和一个vendor.x.js文件：

```js
entry: {
  app: APP_DIR +'/index.js',
  vendor: Object.keys(package.dependencies)
},
```

[chunkhash]在输出中使用您的文件名hash：

```js
output: {
  publicPath: '/',
  chunkFilename: '[name].[chunkhash].js',
  filename: '[name].[chunkhash].js'
},
```

在插件中，使用：

```js
new webpack.HashedModuleIdsPlugin()
```

那么你的CommonsChunkPlugin需要再次chunkhash：

```js
new webpack.optimize.CommonsChunkPlugin({
  name:'vendor',
  filename: 'vendor.[chunkhash].js'
}),
```

最后，但一个容易忽略的细节：

```js
new webpack.optimize.CommonsChunkPlugin({
  name:'manifest'
})
```

深入了解为什么清单文件在这里很重要。随意跳到React代码的下一节。
没有manifest chunk块，Webpack将产生这些文件：

```js
pageOne.58e60ef81ba97426a00d.js 679 bytes              
   home.b65cb7fd922ea7126e95.js 671 bytes        
    app.3c3fcb4d6bcba55f3bb7.js 3.44 kB            
vendor.da901bd61614a0e9f2fe.js 1.25 MB       
                     index.html 397 bytes  
```

你可能会想：“太棒了，它正在工作！” 你去做你的事情，改变home组件，Webpack建立你的文件，然后你会伤心的。

```js
  home.5a5f308381fc5670d102.js  674 bytes <--new hash expected
vendor.c509e728faa4374eee45.js  1.25 MB <--new hash not expected
                    index.html  397 bytes
```

是什么导致了？你没有给你的package.json改变/添加任何东西 。Webpack文档简要地解释了这里发生了什么。这是非常高的水平，但我想知道什么是实际上改变的代码，以保证生成一个新的哈希vendors.x.js文件。

如果你看看里面的生成，vendor.x.js你会看到：

```js
/******/   script.src = __webpack_require__.p + "" + ({"0":"pageOne","1":"home","2":"app"}[chunkId]||chunkId) + "." + {"0":"58e60ef81ba97426a00d","1":"5a5f308381fc5670d102","2":"3c3fcb4d6bcba55f3bb7"}[chunkId] + ".js";
```

啊哈！这是所有我们的[chunkhash]价值观。因为我们改变了home组件，所以生成了一个新的散列，并将其添加到“webpack样板文件”中，然后将其反转到我们的vendor.x.js文件中。不完全是我们想要发生的，看到我们的vendor文件不会经常更改，通常是我们构建的最大的文件。
让我们用一个webpack manifest文件运行相同的练习。

```js
pageOne.58e60ef81ba97426a00d.js 679 bytes 
    home.5a5f308381fc5670d102.js 674 bytes 
  vendor.db2436c7653388db768a.js 1.24 MB 
     app.8e527bb7a890edfc1ef3.js 3.44 kB 
manifest.2b89533b2a3dea66348d.js 5.96 kB
```

改变 home

```js
    home.b65cb7fd922ea7126e95.js  671 bytes
manifest.c4a2e5b1ff1dcfbe35ae.js    5.96 kB
```

🎉只有一个home组件和manifest产生新的散列 。
让我们看看manifest文件里面：

```js
/******/   script.src = __webpack_require__.p + "" + ({"0":"pageOne","1":"home","2":"vendor","3":"app"}[chunkId]||chunkId) + "." + {"0":"58e60ef81ba97426a00d","1":"b65cb7fd922ea7126e95","2":"db2436c7653388db768a","3":"8e527bb7a890edfc1ef3"}[chunkId] + ".js";
```

现在我们在manifest中的[chunkhash]值正与我们的vendor文件混淆起来。在你的vendor文件中搜索这个代码，你会发现它已经消失了。感觉不错。
最后是React代码。这可能是最酷的部分。我可以看到如此多的反应可加载的潜力。
正常导入看起来像：

```js
import Home from './home'
```

所有我们必须做的，以获得正确的动态导入：

```js
import Loadable from 'react-loadable'
import Loading from './loading'
const Home = Loadable({
  loader: () => import('./home' /* webpackChunkName: 'home' */),
  loading: Loading, <-- a "loading" comp required by react-loadable
})
```

这里的所有都是它的。用react-loadable方式包装导入，并使用新的import()语法。注意到Webpack中的评论/* webpackChunkName: 'your_component_name' */ 。无需指定0.db2436c7653388db768a.js的文件名。
