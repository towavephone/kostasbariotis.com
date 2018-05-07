---
title: Commit message和Change log规范化
date: 2017-12-16 00:48:34
path: /commit-message/
tags: Git, git规范化
---

## [commitizen](https://github.com/commitizen/cz-cli)：规范commit mesage的命令行工具

### 效果

![](./add-commit.png)

### 本地安装步骤

```bash
npm install --save-dev commitizen
// 如果全局安装过，强制覆盖加--force参数
./node_modules/.bin/commitizen init cz-conventional-changelog --save-dev --save-exact
```

### package.json

在package.json添加脚本运行，最好不要用commit，容易和husky插件冲突

```bash
// package.json
  ...
  "scripts": {
    "commit": "git-cz"
  }
```

可以添加markdown标签
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## [commitlint](https://github.com/marionebl/commitlint)：commit mesage lint工具

### 效果

![](/images/commitlint.svg)

### 本地安装步骤

```bash
# Install commitlint cli and angular config
# 这行命令在win10 shell上识别失败，需分开安装
# npm install --save-dev @commitlint/config-conventional
# npm install --save-dev @commitlint/cli
npm install --save-dev @commitlint/{config-conventional,cli}
# Configure commitlint to use angular config
# 这行命令在win10 shell终端执行时有问题，应该是加入了非法字符，建议最好手动新建文件
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

### package.json

在package.json添加脚本运行

```bash
{
  "scripts": {
    // 必须是commitmsg，别的hook不行
    "commitmsg": "commitlint -e $GIT_PARAMS"
  }
}
```

## [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)：生成Change.log工具（需满足规范）

### 效果

```bash
<a name="0.0.0"></a>
# 0.0.0 (2017-12-15)


### Features

* add acticle,change avatar,add time a few days ago ([36f29f8](https://github.com/towavephone/TowavePhoneBlog/commit/36f29f8))

```

### 本地安装步骤

```bash
npm install --save-dev conventional-changelog-cli
cd my-project
./node_modules/.bin/conventional-changelog -p angular -i CHANGELOG.md -s
```

加上-r 0参数覆盖以前记录，建议初次生成时加上

```bash
conventional-changelog -p angular -i CHANGELOG.md -s -r 0
```

### package.json

在package.json添加脚本运行

```bash
"changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0".
```

## 建议配置的package.json

```bash
"scripts": {
    "dev": "hexo s -p 80",
    "prod": "hexo clean && hexo g && gulp",
    "cm": "git-cz",
    "commitmsg": "commitlint -e $GIT_PARAMS",
    "prepush": "yarn prod && hexo d",
    "precommit": "yarn changelog && git add .",
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
  },
```