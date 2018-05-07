---
title: Git Hook用法（持续更新）
date: 2017-11-28 00:44:38
categories:
- 版本控制工具
path: /githook-usage/
tags: Git, githook
---
## 钩子定义

>Git可以定制一些钩子，这些钩子可以在特定的情况下被执行，分为Client端的钩子和Server端的钩子。Client端钩子被operation触发，比如commit，merge等，Server端钩子被网络动作触发，比如pushed commits。

## 钩子位置

>在.git/hooks/文件夹下。当你init一个仓库的时候，下边会有一些钩子的例子，以.sample结尾，需将.sample后缀去掉，改为可执行文件后才能执行，那么钩子什么时候被执行，Git预定义了触发时机：


## 客户端钩子触发动作

### pre-commit

>当执行commit动作时先执行此hook，可以用此hook做一些检查，比如代码风格检查，或者先跑测试。

### prepare-commit-msg

>当commit时需要输入message前会触发此hook，可以用此hook来定制自己的default message信息。

### commit-msg

>当用户输入commit的message后被触发，可以用此hook校验message的信息，比如是否符合规定，有没有cr等。

### post-commit

>当commit完成后被触发，可以用此hook发送notification等。

### pre-rebase

>rebase之前会被触发，可以用此hook来拒绝所有的已经push的commits进行rebase操作。

### post-merge

>当merge成功后，会触发此hook。

### pre-push 

>当push时，remote refs被更新，但是在所有的objects传输前被触发。

### pre-auto-gc

>当git gc --auto执行前被触发。在垃圾回收之前做一些验证或备份是挺不错的。

## 服务端钩子触发动作

### pre-receive

>当收到push动作之前会被执行。

### update

>也是收到push动作之前被执行，但是有可能被执行多次，每个branch一次。

### post-receive

>当push动作已经完成的时候会被触发，可以用此hook来push notification等，比如发邮件，通知持续构建服务器等。

## 跳过钩子

```bash
git push --no-verify //跳过githook执行
```
