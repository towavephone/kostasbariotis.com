---
title: Redux-Saga入门学习
path: /redux-saga-introduce-learn/
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
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import Api from '...';

// worker Saga : 将在 USER_FETCH_REQUESTED action 被 dispatch 时调用
function* fetchUser(action) {
  try {
    const user = yield call(Api.fetchUser, action.payload.userId);
    yield put({ type: 'USER_FETCH_SUCCEEDED', user: user });
  } catch (e) {
    yield put({ type: 'USER_FETCH_FAILED', message: e.message });
  }
}

/*
  在每个 `USER_FETCH_REQUESTED` action 被 dispatch 时调用 fetchUser
  允许并发（译注：即同时处理多个相同的 action）
*/
function* mySaga() {
  yield takeEvery('USER_FETCH_REQUESTED', fetchUser);
}

/*
  也可以使用 takeLatest

  不允许并发，dispatch 一个 `USER_FETCH_REQUESTED` action 时，
  如果在这之前已经有一个 `USER_FETCH_REQUESTED` action 在处理中，
  那么处理中的 action 会被取消，只会执行当前的
*/
function* mySaga() {
  yield takeLatest('USER_FETCH_REQUESTED', fetchUser);
}

export default mySaga;
```

为了能跑起 Saga，我们需要使用 redux-saga 中间件将 Saga 与 Redux Store 建立连接。

`main.js`

```js
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducers';
import mySaga from './sagas';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

// then run the saga
sagaMiddleware.run(mySaga);

// render the application
```

# 介绍

## 初级教程

### Hello，Sagas！

接下来将创建我们的第一个 Saga。按照传统，我们将编写一个 Sagas 版本的 'Hello, world'。

创建一个 sagas.js 的文件，然后添加以下代码片段：

```js
export function* helloSaga() {
  console.log('Hello Sagas!');
}
```

为了运行我们的 Saga，我们需要：

- 创建一个 Saga middleware 和要运行的 Sagas（目前我们只有一个 helloSaga）
- 将这个 Saga middleware 连接至 Redux store

我们修改一下 main.js：

```js
// ...
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

//...
import { helloSaga } from './sagas';

const store = createStore(reducer, applyMiddleware(createSagaMiddleware(helloSaga)));

// rest unchanged
```

首先我们引入 ./sagas 模块中的 Saga。然后使用 redux-saga 模块的 createSagaMiddleware 工厂函数来创建一个 Saga middleware。

运行 helloSaga 之前，我们必须使用 applyMiddleware 将 middleware 连接至 Store。然后使用 sagaMiddleware.run(helloSaga) 运行 Saga。

到目前为止，我们的 Saga 并没做什么特别的事情。它只是打印了一条消息，然后退出。

### 发起异步调用

现在我们来添加一些更接近原始计数器例子的东西。为了演示异步调用，我们将添加另外一个按钮，用于在点击 1 秒后增加计数。

首先，我们需要在 UI 组件上添加一个额外的按钮和一个回调 onIncrementAsync。

```js
const Counter = ({ value, onIncrement, onDecrement, onIncrementAsync }) => (
  <div>
    <button onClick={onIncrementAsync}>Increment after 1 second</button>{' '}
    <button onClick={onIncrement}>Increment</button> <button onClick={onDecrement}>Decrement</button>
    <hr />
    <div>Clicked: {value} times</div>
  </div>
);
```

接下来我们需要将组件的 onIncrementAsync 与 Store action 连接起来。

修改 main.js 模块：

```js
function render() {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => action('INCREMENT')}
      onDecrement={() => action('DECREMENT')}
      onIncrementAsync={() => action('INCREMENT_ASYNC')}
    />,
    document.getElementById('root')
  );
}
```

注意，与 redux-thunk 不同，上面组件 dispatch 的是一个 plain Object 的 action。

现在我们将介绍另一种执行异步调用的 Saga。我们的用例如下：

> 我们需要在每个 INCREMENT_ASYNC action 启动一个做以下事情的任务：等待 1 秒，然后增加计数

添加以下代码到 sagas.js 模块：

```js
import { delay } from 'redux-saga';
import { put, takeEvery } from 'redux-saga/effects';

// ...

// Our worker Saga: 将执行异步的 increment 任务
export function* incrementAsync() {
  yield delay(1000);
  yield put({ type: 'INCREMENT' });
}

// Our watcher Saga: 在每个 INCREMENT_ASYNC action spawn 一个新的 incrementAsync 任务
export function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}
```

我们引入了一个工具函数 delay，这个函数返回一个延迟 1 秒再 resolve 的 Promise 我们将使用这个函数去 block(阻塞) Generator。

Sagas 被实现为 Generator functions，它会 yield 对象到 redux-saga middleware。 被 yield 的对象都是一类指令，指令可被 middleware 解释执行。当 middleware 取得一个 yield 后的 Promise，middleware 会暂停 Saga，直到 Promise 完成。 在上面的例子中，incrementAsync 这个 Saga 会暂停直到 delay 返回的 Promise 被 resolve，这个 Promise 将在 1 秒后 resolve。

put 就是我们称作 Effect 的一个例子。Effects 是一些简单 Javascript 对象，包含了要被 middleware 执行的指令。 当 middleware 拿到一个被 Saga yield 的 Effect，它会暂停 Saga，直到 Effect 执行完成，然后 Saga 会再次被恢复。

总结一下，incrementAsync Saga 通过 delay(1000) 延迟了 1 秒钟，然后 dispatch 一个叫 INCREMENT 的 action。

接下来，我们创建了另一个 Saga watchIncrementAsync。我们用了一个 redux-saga 提供的辅助函数 takeEvery，用于监听所有的 INCREMENT_ASYNC action，并在 action 被匹配时执行 incrementAsync 任务。

现在我们有了 2 个 Sagas，我们需要同时启动它们。为了做到这一点，我们将添加一个 rootSaga，负责启动其他的 Sagas。在同样的 sagas.js 文件中，重构文件如下：

```js
import { delay } from 'redux-saga';
import { put, takeEvery, all } from 'redux-saga/effects';

function* incrementAsync() {
  yield delay(1000);
  yield put({ type: 'INCREMENT' });
}

function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([helloSaga(), watchIncrementAsync()]);
}
```

这个 Saga yield 了一个数组，值是调用 helloSaga 和 watchIncrementAsync 两个 Saga 的结果。意思是说这两个 Generators 将会同时启动。 现在我们只需要在 main.js 的 root Saga 中调用 sagaMiddleware.run。

```js
// ...
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()
const store = ...
sagaMiddleware.run(rootSaga)

// ...
```

# 基础概念

## 使用 Saga 辅助函数

redux-saga 提供了一些辅助函数，包装了一些内部方法，用来在一些特定的 action 被发起到 Store 时派生任务。

这些辅助函数构建在低阶 API 之上。我们将会在高级概念一章看到这些函数是如何实现的。

第一个函数 takeEvery ，是最常见的，它提供了类似 redux-thunk 的行为。

让我们通过常见的 AJAX 例子来演示一下。每次点击 Fetch 按钮时，我们发起一个 FETCH_REQUESTED 的 action。 我们想通过启动一个从服务器获取一些数据的任务，来处理这个 action。

首先我们创建一个将执行异步 action 的任务：

```js
import { call, put } from 'redux-saga/effects';

export function* fetchData(action) {
  try {
    const data = yield call(Api.fetchUser, action.payload.url);
    yield put({ type: 'FETCH_SUCCEEDED', data });
  } catch (error) {
    yield put({ type: 'FETCH_FAILED', error });
  }
}
```

然后在每次 FETCH_REQUESTED action 被发起时启动上面的任务。

```js
import { takeEvery } from 'redux-saga';

function* watchFetchData() {
  yield* takeEvery('FETCH_REQUESTED', fetchData);
}
```

在上面的例子中，takeEvery 允许多个 fetchData 实例同时启动。在某个特定时刻，尽管之前还有一个或多个 fetchData 尚未结束，我们还是可以启动一个新的 fetchData 任务。

如果我们只想得到最新那个请求的响应（例如，始终显示最新版本的数据）。我们可以使用 takeLatest 辅助函数。

```js
import { takeLatest } from 'redux-saga';

function* watchFetchData() {
  yield* takeLatest('FETCH_REQUESTED', fetchData);
}
```

和 takeEvery 不同，在任何时刻 takeLatest 只允许一个 fetchData 任务在执行。并且这个任务是最后被启动的那个。 如果已经有一个任务在执行的时候启动另一个 fetchData ，那之前的这个任务会被自动取消。

如果你有多个 Saga 监视不同的 action ，你可以用内置辅助函数创建很多观察者，就像用了 fork 来派生他们 （之后我们会讲到 fork ，现在就把它当作一个允许我们在后台启动多个 saga 的 Effect ）。

举个例子：

```js
import { takeEvery } from 'redux-saga/effects'

// FETCH_USERS
function* fetchUsers(action) { ... }

// CREATE_USER
function* createUser(action) { ... }

// 同时使用它们
export default function* rootSaga() {
  yield takeEvery('FETCH_USERS', fetchUsers)
  yield takeEvery('CREATE_USER', createUser)
}
```

## 声明式 Effects

在 redux-saga 的世界里，Sagas 都用 Generator 函数实现。我们从 Generator 里 yield 纯 JavaScript 对象以表达 Saga 逻辑。 我们称呼那些对象为 Effect，Effect 是一个简单的对象，这个对象包含了一些给 middleware 解释执行的信息。 你可以把 Effect 看作是发送给 middleware 的指令以执行某些操作（调用某些异步函数，发起一个 action 到 store，等等）。

你可以使用 redux-saga/effects 包里提供的函数来创建 Effect。

这一部分和接下来的部分，我们将介绍一些基础的 Effect。并见识到这些 Effect 概念是如何让 Sagas 很容易地被测试的。

Sagas 可以多种形式 yield Effect。最简单的方式是 yield 一个 Promise。

举个例子，假设我们有一个监听 PRODUCTS_REQUESTED action 的 Saga。每次匹配到 action，它会启动一个从服务器上获取产品列表的任务。

```js
import { takeEvery } from 'redux-saga/effects';
import Api from './path/to/api';

function* watchFetchProducts() {
  yield takeEvery('PRODUCTS_REQUESTED', fetchProducts);
}

function* fetchProducts() {
  const products = yield Api.fetch('/products');
  console.log(products);
}
```

在上面的例子中，我们在 Generator 中直接调用了 Api.fetch（在 Generator 函数中，yield 右边的任何表达式都会被求值，结果会被 yield 给调用者）。

Api.fetch('/products') 触发了一个 AJAX 请求并返回一个 Promise，Promise 会 resolve 请求的响应， 这个 AJAX 请求将立即执行。看起来简单又地道，但...
