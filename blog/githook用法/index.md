---
title: Git Hook用法（持续更新）
date: 2017-11-28 00:44:38
categories:
  - 版本控制工具
path: /githook-usage/
tags: Git, githook
---

## 钩子定义

> Git 可以定制一些钩子，这些钩子可以在特定的情况下被执行，分为 Client 端的钩子和 Server 端的钩子。Client 端钩子被 operation 触发，比如 commit，merge 等，Server 端钩子被网络动作触发，比如 pushed commits。

## 钩子位置

> 在.git/hooks/文件夹下。当你 init 一个仓库的时候，下边会有一些钩子的例子，以.sample 结尾，需将.sample 后缀去掉，改为可执行文件后才能执行，那么钩子什么时候被执行，Git 预定义了触发时机：

## 客户端钩子触发动作

### pre-commit

> 当执行 commit 动作时先执行此 hook，可以用此 hook 做一些检查，比如代码风格检查，或者先跑测试。

### prepare-commit-msg

> 当 commit 时需要输入 message 前会触发此 hook，可以用此 hook 来定制自己的 default message 信息。

### commit-msg

> 当用户输入 commit 的 message 后被触发，可以用此 hook 校验 message 的信息，比如是否符合规定，有没有 cr 等。

### post-commit

> 当 commit 完成后被触发，可以用此 hook 发送 notification 等。

### pre-rebase

> rebase 之前会被触发，可以用此 hook 来拒绝所有的已经 push 的 commits 进行 rebase 操作。

### post-merge

> 当 merge 成功后，会触发此 hook。

### pre-push

> 当 push 时，remote refs 被更新，但是在所有的 objects 传输前被触发。

### pre-auto-gc

> 当 git gc --auto 执行前被触发。在垃圾回收之前做一些验证或备份是挺不错的。

## 服务端钩子触发动作

### pre-receive

> 当收到 push 动作之前会被执行。

### update

> 也是收到 push 动作之前被执行，但是有可能被执行多次，每个 branch 一次。

### post-receive

> 当 push 动作已经完成的时候会被触发，可以用此 hook 来 push notification 等，比如发邮件，通知持续构建服务器等。

## 跳过钩子

```bash
git push --no-verify //跳过githook执行
```
