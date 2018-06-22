---
title: Redux深入学习
path: /redux-deep-learn/
date: 2018-6-22 23:22:49
tags: 前端, React, Redux
---
# 异步Action

在 基础教程 中，我们创建了一个简单的 todo 应用。它只有同步操作。每当 dispatch action 时，state 会被立即更新

## Action

当调用异步 API 时，有两个非常关键的时刻：发起请求的时刻，和接收到响应的时刻（也可能是超时）

这两个时刻都可能会更改应用的 state；为此，你需要 dispatch 普通的同步 action。一般情况下，每个 API 请求都需要 dispatch 至少三种 action

- 一种通知 reducer 请求开始的 action

对于这种 action，reducer 可能会切换一下 state 中的 isFetching 标记。以此来告诉 UI 来显示加载界面。

- 一种通知 reducer 请求成功的 action

对于这种 action，reducer 可能会把接收到的新数据合并到 state 中，并重置 isFetching。UI 则会隐藏加载界面，并显示接收到的数据。

- 一种通知 reducer 请求失败的 action

对于这种 action，reducer 可能会重置 isFetching。另外，有些 reducer 会保存这些失败信息，并在 UI 里显示出来

为了区分这三种 action，可能在 action 里添加一个专门的 status 字段作为标记位

```json
{ type: 'FETCH_POSTS' }
{ type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
{ type: 'FETCH_POSTS', status: 'success', response: { ... } }
```

又或者为它们定义不同的 type：

```json
{ type: 'FETCH_POSTS_REQUEST' }
{ type: 'FETCH_POSTS_FAILURE', error: 'Oops' }
{ type: 'FETCH_POSTS_SUCCESS', response: { ... } }
```

究竟使用带有标记位的同一个 action，还是多个 action type 呢，完全取决于你。这应该是你的团队共同达成的约定。使用多个 type 会降低犯错误的机率，但是如果你使用像 redux-actions 这类的辅助库来生成 action 创建函数和 reducer 的话，这就完全不是问题了

无论使用哪种约定，一定要在整个应用中保持统一，我们将使用不同的 type 来做

## 同步 Action 创建函数（Action Creator）

下面先定义几个同步的 action 类型 和 action 创建函数。比如，用户可以选择要显示的 subreddit