---
title: Webpack脚手架搭建笔记——记一次新项目搭建
date: 2019-10-10 21:46:40
categories:
  - 前端
tags: 前端, 前端构建工具, webpack, 预研
path: /webpack-template-new-project/
---

接上文[Webpack 升级优化——记一次产品端升级](/webpack-upgrade-about-product/)

最近需要开发一个新产品，此时需要一个新框架来承载新产品的开发，根据前端主管的建议，建议我在他已经开发出的新框架上进行改造，这里记录一下改造的关键点

# babel 编译兼容 IE

在 .babelrc 文件里加上标红代码，防止 ie 某些方法报错

```js{36}
{
  "env": {
    "production": {
      "only": [
        "src",
        "unicorn"
      ],
      "plugins": [
        "transform-react-remove-prop-types",
        "transform-react-constant-elements",
        "transform-react-inline-elements"
      ]
    },
  },
  "plugins": [
    [
      "import",
      {
        "libraryName": "antd",
        "libraryDirectory": "es",
        "style": true
      }
    ],
    "transform-decorators-legacy",
    "lodash"
  ],
  "presets": [
    [
      "latest",
      {
        "es2015": {
          "modules": false
        }
      }
    ],
    "es2015-ie",
    "react",
    "stage-0"
  ]
}
```

# 脚本运行颜色

在将 npm script 写成 nodejs 脚本时，脚本颜色是灰色，此时需要加上`--color`参数

```js{3}
const shelljs = require('shelljs');

shelljs.exec('cross-env NODE_ENV=development node boot/internals/scripts/analyze.js --color', {
  stdio: 'inherit'
});
```

# webpack 加速构建

在 webpack.base.babel.js 文件中添加 hard-source-webpack-plugin 插件，启用了之后构建速度由第二次的 30~40s 缩短到第二次的 3~5s 左右

```js
new HardSourceWebpackPlugin({
  // Either an absolute path or relative to webpack's options.context.
  cacheDirectory: path.resolve(process.cwd(), 'node_modules/.cache/hard-source/[confighash]'),
  // Either a string of object hash function given a webpack config.
  configHash(webpackConfig) {
    // node-object-hash on npm can be used to build this.
    return require('node-object-hash')({ sort: false }).hash({
      webpackConfig,
      globalVars,
    });
  },
  // Either false, a string, an object, or a project hashing function.
  environmentHash: {
    root: process.cwd(),
    directories: [],
    files: ['package-lock.json', 'yarn.lock'],
  },
  // An object.
  info: {
    // 'none' or 'test'.
    mode: 'none',
    // 'debug', 'log', 'info', 'warn', or 'error'.
    level: 'debug',
  },
  // Clean up large, old caches automatically.
  cachePrune: {
    // Caches younger than `maxAge` are not considered for deletion. They must
    // be at least this (default: 2 days) old in milliseconds.
    maxAge: 2 * 24 * 60 * 60 * 1000,
    // All caches together must be larger than `sizeThreshold` before any
    // caches will be deleted. Together they must be at least this
    // (default: 50 MB) big in bytes.
    sizeThreshold: 50 * 1024 * 1024,
  },
}),

// 这里会对 svg 生成造成影响，暂时关闭
// You can optionally exclude items that may not be working with HardSource
// or items with custom loaders while you are actively developing the
// loader.
// new HardSourceWebpackPlugin.ExcludeModulePlugin([
//   {
//     // HardSource works with mini-css-extract-plugin but due to how
//     // mini-css emits assets, assets are not emitted on repeated builds with
//     // mini-css and hard-source together. Ignoring the mini-css loader
//     // modules, but not the other css loader modules, excludes the modules
//     // that mini-css needs rebuilt to output assets every time.
//     test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
//   },
// ]),
```

# webpack 进度显示异常

在 npm run build 执行时 simple-progress-webpack-plugin 插件会不停的刷屏显示，造成不好的体验，所以暂时只把它写在 webpack.dev.babel.js 中

```js
new SimpleProgressWebpackPlugin({
  format: 'minimal',
}),
```

# lodash 插件优化异常

在开启 lodash-webpack-plugin 插件后，lodash.get 不能正常执行，加入 `paths: true` 即可

```js
// Deep property path support for methods like _.get, _.has, & _.set.
// lodash优化由592.53k到240k
new LodashModuleReplacementPlugin({
  paths: true,
}),
```

以上更新于`2019-9-17 20:43:04`

---

# react-loadable 优化

## withRef 方法报错

当 react-loadable 应用到组件为 function 类型，此时 withRef 方法会报错，因为 function 组件是没有 ref 的，此时要做下兼容处理

```js{22-28,30}
import React from 'react';
import Loadable from 'react-loadable';

const LoaderCache = new Map();
export default function loadComponent(loader, options) {
  let component = LoaderCache.get(loader);
  if (!component) {
    component = Loadable({
      loader,
      loading: (props) => {
        if (props.error) {
          // eslint-disable-line
          if (window.location.host.indexOf('-dev') >= 0 && window.TURKEY && window.TURKEY.getProperty('serverUpdate')) {
            window.TURKEY.run('serverUpdate');
          }
          console.error('[chunk loader]', props.error); // eslint-disable-line
        }
        return <div />;
      },
      render: (loaded, props) => {
        const Component = loaded.default;
        const { withRef, ...rest } = props; // eslint-disable-line
        const { isPureReactComponent, isReactComponent } = Component.prototype;
        let refProps = null;
        if (isPureReactComponent || isReactComponent) {
          refProps = {
            ref: (r) => {
              withRef && withRef(r);
            }
          };
        }
        return <Component {...refProps} {...rest} />;
      },
      ...options
    });
    LoaderCache.set(loader, component);
    // component.preload();
  }
  return component;
}
```

## 阻止 setState

因为组件卸载时继续网络请求会导致 setState 报错，因为采用的是 promise 方法，不能取消请求，所以需要在卸载时将 setState 置空，以下分别针对页面、组件级别将其置空

### 页面级别

```js{29-39}
/* eslint-disable no-param-reassign */
import React from 'react';
import Loadable from 'react-loadable';

const LoaderCache = new Map();
export default function loadComponent(loader, options) {
  let component = LoaderCache.get(loader);
  if (!component) {
    component = Loadable({
      loader,
      loading: (props) => {
        if (props.error) {
          // eslint-disable-line
          if (window.location.host.indexOf('-dev') >= 0 && window.TURKEY && window.TURKEY.getProperty('serverUpdate')) {
            window.TURKEY.run('serverUpdate');
          }
          console.error('[chunk loader]', props.error); // eslint-disable-line
        }
        return <div />;
      },
      render: (loaded, props) => {
        const Component = loaded.default;
        const { withRef, ...rest } = props; // eslint-disable-line
        let refProps = null;
        // 只有 PureReactComponent 和 ReactComponent 才有生命周期，注意在 react-hook 的情况下 Component.prototype 为空
        if (Component.prototype && (Component.prototype.isPureReactComponent || Component.prototype.isReactComponent)) {
          refProps = {
            ref: (r) => {
              withRef && withRef(r);
              if (!r) {
                return;
              }
              const cb = r.componentWillUnmount;
              r.componentWillUnmount = () => {
                r.setState = () => {
                  // eslint-disable-next-line no-useless-return
                  return;
                };
                cb && cb.call(r);
              };
            }
          };
        }
        return <Component {...refProps} {...rest} />;
      },
      ...options
    });
    LoaderCache.set(loader, component);
    // component.preload();
  }
  return component;
}
```

### 组件级别

src\runtime\preventSetState.js

```js
import React from 'react';

export default function preventSetState(WrappedComponent) {
  return class Hoc extends React.PureComponent {
    componentWillUnmount = () => {
      this.wrappedComponent.setState = () => {
        // eslint-disable-next-line no-useless-return
        return;
      };
    };

    render() {
      return (
        <WrappedComponent
          ref={(r) => {
            this.wrappedComponent = r;
          }}
          {...this.props}
        />
      );
    }
  };
}
```

调用时

```js
import preventSetState from 'runtime/preventSetState';

@preventSetState
export default class Component extends React.PureComponent {}
```

或者

```js
import preventSetState from 'runtime/preventSetState';

class Component extends React.PureComponent {}

export default preventSetState(Component);
```

待拓展的功能：react-hook 替换 mobx、HTML 内实现 Loading 态或者骨架屏、动态 polyfill、编译到 ES2015+（提高运行效率）、LazyLoad、三方库 external 化

# 重置报错状态

单个组件报错时不影响其他页面的加载

```js{11-16}
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

class ErrorBoundary extends Component {
  state = {
    hasError: false
  };

  componentWillReceiveProps() {
    // 重置未报错状态
    this.setState({
      hasError: false
    });
  }

  componentDidCatch(error) {
    this.setState({
      hasError: true
    });

    console.error(error);
    if (window.__bl) {
      window.__bl.error(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.error}>
          <div className={styles.title}>抱歉，页面出错了！</div>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
};

export default ErrorBoundary;
```

# stylelint 无效

package.json

```bash
"lint:css": "stylelint src/**/*.css"
```

当在苹果电脑上运行以上命令时，没有任何效果，即使 css 格式错误也直接通过，同时提交代码前的报错信息也没有颜色，需要做下特殊处理

```bash
"lint:css": "stylelint \"src/**/*.css\" --color" # src/**/*.css 双引号转义为了兼容苹果，--color 是为了执行 pre-commit 钩子即提交代码前也能让错误的信息有颜色
"lint": "npm run lint:js && npm run lint:css",
"pre-commit": "lint",
```
