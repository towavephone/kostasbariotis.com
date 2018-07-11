---
title: Redux-Saga入门学习
path: /redux-introduce-learn/
date: 2018-7-11 14:47:00
tags: 前端, Redux, Redux-Saga
---
# 自述

redux-saga 是一个用于管理应用程序 Side Effect（副作用，例如异步获取数据，访问浏览器缓存等）的 library，它的目标是让副作用管理更容易，执行更高效，测试更简单，在处理故障时更容易。

可以想像为，一个 saga 就像是应用程序中一个单独的线程，它独自负责处理副作用。 redux-saga 是一个 redux 中间件，意味着这个线程可以通过正常的 redux action 从主应用程序启动，暂停和取消，它能访问完整的 redux state，也可以 dispatch redux action。

redux-saga 使用了 ES6 的 Generator 功能，让异步的流程更易于读取，写入和测试。（如果你还不熟悉的话，这里有一些介绍性的链接） 通过这样的方式，这些异步的流程看起来就像是标准同步的 Javascript 代码。（有点像 async/await，但 Generator 还有一些更棒而且我们也需要的功能）。

你可能已经用了 redux-thunk 来处理数据的读取。不同于 redux thunk，你不会再遇到回调地狱了，你可以很容易地测试异步流程并保持你的 action 是干净的。

## 使用示例

假设我们有一个 UI 界面，在单击按钮时从远程服务器获取一些用户数据（为简单起见，我们只列出 action 触发代码）。

```js
class UserComponent extends React.Component {
  ...
  onSomeButtonClicked() {
    const { userId, dispatch } = this.props
    dispatch({type: 'USER_FETCH_REQUESTED', payload: {userId}})
  }
  ...
}
```

这个组件 dispatch 一个 plain Object 的 action 到 Store。我们将创建一个 Saga 来监听所有的 USER_FETCH_REQUESTED action，并触发一个 API 调用获取用户数据。

`sagas.js`

```js
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import Api from '...'

// worker Saga : 将在 USER_FETCH_REQUESTED action 被 dispatch 时调用
function* fetchUser(action) {
   try {
      const user = yield call(Api.fetchUser, action.payload.userId);
      yield put({type: "USER_FETCH_SUCCEEDED", user: user});
   } catch (e) {
      yield put({type: "USER_FETCH_FAILED", message: e.message});
   }
}

/*
  在每个 `USER_FETCH_REQUESTED` action 被 dispatch 时调用 fetchUser
  允许并发（译注：即同时处理多个相同的 action）
*/
function* mySaga() {
  yield takeEvery("USER_FETCH_REQUESTED", fetchUser);
}

/*
  也可以使用 takeLatest

  不允许并发，dispatch 一个 `USER_FETCH_REQUESTED` action 时，
  如果在这之前已经有一个 `USER_FETCH_REQUESTED` action 在处理中，
  那么处理中的 action 会被取消，只会执行当前的
*/
function* mySaga() {
  yield takeLatest("USER_FETCH_REQUESTED", fetchUser);
}

export default mySaga;
```

为了能跑起 Saga，我们需要使用 redux-saga 中间件将 Saga 与 Redux Store 建立连接。

`main.js`

```js
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducer from './reducers'
import mySaga from './sagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
// mount it on the Store
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

// then run the saga
sagaMiddleware.run(mySaga)

// render the application
```

# 介绍

## 初级教程

## Saga概念背景

# 基础概念
