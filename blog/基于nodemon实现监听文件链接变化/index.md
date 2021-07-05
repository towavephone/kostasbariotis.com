---
title: 基于nodemon实现监听文件链接变化
path: /nodemon-monitor-link-changes/
date: 2021-1-5 10:02:54
tags: 后端, nodejs, nodemon, 预研
---

# 项目架构

公司项目分为以下几种架构：

1. 主项目-扩展项目：扩展项目前端独立，是以 npm 包的形式安装到主项目，后端可以独立编译，但不能独立运行，即后端与主项目共用一套，主项目需要对扩展项目编译出的后端代码进行监听来实现增量编译
2. 主项目-子项目：微前端架构，子项目前、后端独立可运行

# 需求背景

需要解决主项目-扩展项目架构下主项目的后端不能增量编译的问题

# 技术选型

| 选型 | 优点 | 缺点 |
| :-: | :-: | :-: |
| 直接在 node_modules 目录下开发 | 主项目已实现对 node_modules 下扩展项目的监听 | 每次 npm install 都要重新新建项目 |
| gulp 文件同步 | 有第三方插件 | 需要多运行一个文件同步脚本 |
| npm link | 不需要多运行一个脚本 | 需要每次手动重启主项目来让后端代码生效 |
| nodemon + npm link | 监听到扩展项目变化自动重启 | 每次 npm install 都要重新 npm link |

# 解决过程

## gulp 文件同步

核心逻辑：监听扩展项目编译出来的后端代码，发现改动时同步到 node_modules 下扩展项目的位置

./config.js

```js
module.exports = {
  //同步文件更改到指定目录
  syncTo: '../主项目/node_modules/扩展项目/extend'
};
```

./gulpfile.js

```js
const gulp = require('gulp');
const fileSync = require('gulp-file-sync');
const { syncTo } = require('./config');
const mkdirp = require('mkdirp');
const fs = require('fs');
const watch = require('gulp-watch');
const run = require('run-sequence');

gulp.task('sync', function() {
  try {
    let state = fs.statSync(syncTo);
    if (!state.isDirectory()) {
      mkdirp(syncTo);
    }
  } catch (e) {
    console.log(e);
    mkdirp(syncTo);
  }

  fileSync('extend', syncTo);
});

gulp.task('watch-extend', function() {
  watch(['./extend/**'], function() {
    run('sync');
  });
});

gulp.task('watch', ['watch-extend']);

gulp.task('default', ['sync', 'watch']);
```

## nodemon + npm link

1. 对扩展项目进行 npm link 操作，然后在主项目中 npm link 扩展项目，可以在主项目的 node_modules 下看到指向扩展项目的软链接
2. 主项目使用了 nodemon 来监听 node_modules 文件变化，鉴于每次重启主项目之后扩展项目的代码才会生效的问题，需要解决 nodemon 不能监听软链接下文件变化的问题

核心逻辑：

1. 在不影响 nodemon 脚本调用逻辑的情况下，在 nodemon.json 添加 `watchSymbolLink` 属性，明确监听软链接的文件位置
2. 利用 glob 三方库读取 watchSymbolLink 下的文件，当判断读到的文件是软链接文件时（isSymbolicLink），读取真实的文件路径（realpathSync）
3. 在监听原来文件的基础上，调用 nodemon 监听另外真实的文件路径

package.json

```json
{
  "scripts": {
    "dev:server": "node bin/nodemon.js --config nodemon.json ./bin/www"
  }
}
```

bin\nodemon.js

```js
const nodemon = require('nodemon');
const nodemonCli = require('nodemon/lib/cli');
const options = nodemonCli.parse(process.argv);
const glob = require('glob');
const fs = require('fs');
const lodash = require('lodash');
const path = require('path');

// "watchSymbolLink": [
//   {
//     "url": "node_modules/sugo-analytics-extend-*",
//     "path": "/extend/app/**/*"
//   },
// ],
// 或
// "watchSymbolLink": [
//    "node_modules/sugo-analytics-extend-*",
// ],
const { configFile, ...optionsRest } = options;

const nodemonJsonPath = path.join(process.cwd(), configFile);

const nodemonJson = require(nodemonJsonPath);

const { watch, watchSymbolLink = [], ...nodemonJsonRest } = nodemonJson;

const dirs = [];

watchSymbolLink.forEach((item) => {
  const { url, path: linkPath = '' } = lodash.isObject(item) ? item : { url: item };
  const paths = glob
    .sync(url)
    .filter((a) => fs.lstatSync(a).isSymbolicLink())
    .map((a) => path.join(fs.realpathSync(a), linkPath));
  dirs.push(...paths);
});

const opts = {
  ...optionsRest,
  ...nodemonJsonRest,
  watch: [...watch, ...dirs]
};

// console.log(opts)

nodemon(opts);

nodemon.on('quit', function() {
  process.exit();
});

const packageJsonPath = path.join(process.cwd(), 'package.json');

// checks for available update and returns an instance
const pkg = JSON.parse(fs.readFileSync(packageJsonPath));

if (pkg.version.indexOf('0.0.0') !== 0 && options.noUpdateNotifier !== true) {
  require('update-notifier')({ pkg }).notify();
}
```

nodemon.json

```json{12-17}
{
  "restartable": "rs",
  "ignore": [".git", "node_modules", "node_modules/**/node_modules"],
  "verbose": true,
  "execMap": {
    "js": "node --harmony"
  },
  "events": {
    "restart": "osascript -e 'display notification \"App restarted due to:\n'$FILENAME'\" with title \"nodemon\"'"
  },
  "watch": [
    "src/server",
    "src/common",
    "config.default.js",
    "node_modules/sugo-analytics-extend-*/extend/app/**/*",
    "config.js"
  ],
  "watchSymbolLink": [
    {
      "url": "node_modules/sugo-analytics-extend-*",
      "path": "extend/app/**/*"
    }
  ],
  "env": {
    "NODE_ENV": "development"
  },
  "delay": "1000",
  "ext": "js,json"
}
```
