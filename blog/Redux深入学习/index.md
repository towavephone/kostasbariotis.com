---
title: Redux深入学习
path: /redux-deep-learn/
date: 2018-7-10 21:27:02
tags: 前端, React, Redux
---

# 异步 Action

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

```js
{ type: 'FETCH_POSTS' }
{ type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
{ type: 'FETCH_POSTS', status: 'success', response: { ... } }
```

又或者为它们定义不同的 type：

```js
{ type: 'FETCH_POSTS_REQUEST' }
{ type: 'FETCH_POSTS_FAILURE', error: 'Oops' }
{ type: 'FETCH_POSTS_SUCCESS', response: { ... } }
```

究竟使用带有标记位的同一个 action，还是多个 action type 呢，完全取决于你。这应该是你的团队共同达成的约定。使用多个 type 会降低犯错误的机率，但是如果你使用像 redux-actions 这类的辅助库来生成 action 创建函数和 reducer 的话，这就完全不是问题了

无论使用哪种约定，一定要在整个应用中保持统一，我们将使用不同的 type 来做

## 同步 Action 创建函数（Action Creator）

下面先定义几个同步的 action 类型 和 action 创建函数。比如，用户可以选择要显示的 subreddit

`action.js`

```js
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT';

export function selectSubreddit(subreddit) {
  return {
    type: SELECT_SUBREDDIT,
    subreddit
  };
}
```

也可以按 "刷新" 按钮来更新它

```js
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT';

export function invalidatesubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  };
}
```

这些是用户操作来控制的 action。也有另外一类 action，是由网络请求来控制。后面会介绍如何使用它们，现在，我们只是来定义它们

当需要获取指定 subreddit 的帖子的时候，需要 dispatch REQUEST_POSTS action

```js
export const REQUEST_POSTS = 'REQUEST_POSTS';

export function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  };
}
```

把 REQUEST_POSTS 和 SELECT_SUBREDDIT 或 INVALIDATE_SUBREDDIT 分开很重要。虽然它们的发生有先后顺序，但随着应用变得复杂，有些用户操作（比如，预加载最流行的 subreddit，或者一段时间后自动刷新过期数据）后需要马上请求数据。路由变化时也可能需要请求数据，所以一开始如果把请求数据和特定的 UI 事件耦合到一起是不明智的

最后，当收到请求响应时，我们会 dispatch RECEIVE_POSTS

```js
export const RECEIVE_POSTS = 'RECEIVE_POSTS';

export function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map((child) => child.data),
    receivedAt: Date.now()
  };
}
```

以上就是现在需要知道的所有内容。稍后会介绍如何把 dispatch action 与网络请求结合起来

### 错误处理须知

在实际应用中，网络请求失败时也需要 dispatch action。虽然在本教程中我们并不做错误处理，但是这个真实场景的案例会演示一种实现方案。

## 设计 state 结构

在功能开发前需要设计应用的 state 结构。在写异步代码的时候，需要考虑更多的 state，所以我们要仔细考虑一下

这部分内容通常让初学者感到迷惑，因为选择哪些信息才能清晰地描述异步应用的 state 并不直观，还有怎么用一个树来把这些信息组织起来

以最通用的案例来打头：列表。Web 应用经常需要展示一些内容的列表。比如，帖子的列表，朋友的列表。首先要明确应用要显示哪些列表。然后把它们分开储存在 state 中，这样你才能对它们分别做缓存并且在需要的时候再次请求更新数据

"Reddit 头条" 应用会长这个样子

```js
{
  selectedsubreddit: 'frontend',
  postsBySubreddit: {
    frontend: {
      isFetching: true,
      didInvalidate: false,
      items: []
    },
    reactjs: {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: 1439478405547,
      items: [
        {
          id: 42,
          title: 'Confusion about Flux and Relay'
        },
        {
          id: 500,
          title: 'Creating a Simple Application Using React JS and Flux Architecture'
        }
      ]
    }
  }
}
```

下面列出几个要点：

- 分开存储 subreddit 信息，是为了缓存所有 subreddit。当用户来回切换 subreddit 时，可以立即更新，同时在不需要的时候可以不请求数据。不要担心把所有帖子放到内存中（会浪费内存）：除非你需要处理成千上万条帖子，同时用户还很少关闭标签页，否则你不需要做任何清理

- 每个帖子的列表都需要使用 isFetching 来显示进度条，didInvalidate 来标记数据是否过期，lastUpdated 来存放数据最后更新时间，还有 items 存放列表信息本身。在实际应用中，你还需要存放 fetchedPageCount 和 nextPageUrl 这样分页相关的 state

### 嵌套内容须知

在这个示例中，接收到的列表和分页信息是存在一起的。但是，这种做法并不适用于有互相引用的嵌套内容的场景，或者用户可以编辑列表的场景。想像一下用户需要编辑一个接收到的帖子，但这个帖子在 state tree 的多个位置重复出现。这会让开发变得非常困难

如果你有嵌套内容，或者用户可以编辑接收到的内容，你需要把它们分开存放在 state 中，就像数据库中一样。在分页信息中，只使用它们的 ID 来引用。这可以让你始终保持数据更新。真实场景的案例中演示了这种做法，结合 normalizr 来把嵌套的 API 响应数据范式化，最终的 state 看起来是这样

```js
{
  selectedsubreddit: 'frontend',
  entities: {
    users: {
      2: {
        id: 2,
        name: 'Andrew'
      }
    },
    posts: {
      42: {
        id: 42,
        title: 'Confusion about Flux and Relay',
        author: 2
      },
      100: {
        id: 100,
        title: 'Creating a Simple Application Using React JS and Flux Architecture',
        author: 2
      }
    }
  },
  postsBySubreddit: {
    frontend: {
      isFetching: true,
      didInvalidate: false,
      items: []
    },
    reactjs: {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: 1439478405547,
      items: [ 42, 100 ]
    }
  }
}
```

在本教程中，我们不会对内容进行范式化，但是在一个复杂些的应用中你可能需要使用

## 处理 Action

在讲 dispatch action 与网络请求结合使用细节前，我们为上面定义的 action 开发一些 reducer

`Reducer 组合须知`

这里，我们假设你已经学习过 combineReducers() 并理解 reducer 组合，还有基础章节中的 拆分 Reducer。如果还没有，请先学习

`reducers.js`

```js
import { combineReducers } from 'redux';
import { SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT, REQUEST_POSTS, RECEIVE_POSTS } from '../actions';

function selectedsubreddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_SUBREDDIT:
      return action.subreddit;
    default:
      return state;
  }
}

function posts(
  state = {
    isFetching: false,
    didInvalidate: false,
    items: []
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      });
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

function postsBySubreddit(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.subreddit]: posts(state[action.subreddit], action)
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  postsBySubreddit,
  selectedsubreddit
});

export default rootReducer;
```

上面代码有两个有趣的点

- 使用 ES6 计算属性语法，使用 Object.assign() 来简洁高效地更新 state[action.subreddit]

```js
return Object.assign({}, state, {
  [action.subreddit]: posts(state[action.subreddit], action)
});
```

- 我们提取出 posts(state, action) 来管理指定帖子列表的 state。这就是 reducer 组合 ！我们还可以借此机会把 reducer 分拆成更小的 reducer，这种情况下，我们把对象内列表的更新代理到了 posts reducer 上。在真实场景的案例中甚至更进一步，里面介绍了如何做一个 reducer 工厂来生成参数化的分页 reducer

记住 reducer 只是函数而已，所以你可以尽情使用函数组合和高阶函数这些特性

## 异步 action 创建函数

最后，如何把之前定义的同步 action 创建函数和网络请求结合起来呢？标准的做法是使用 Redux Thunk 中间件。要引入 redux-thunk 这个专门的库才能使用。我们 后面 会介绍 middleware 大体上是如何工作的；目前，你只需要知道一个要点：通过使用指定的 middleware，action 创建函数除了返回 action 对象外还可以返回函数。这时，这个 action 创建函数就成为了 thunk

当 action 创建函数返回函数时，这个函数会被 Redux Thunk middleware 执行。这个函数并不需要保持纯净；它还可以带有副作用，包括执行异步 API 请求。这个函数还可以 dispatch action，就像 dispatch 前面定义的同步 action 一样

我们仍可以在 actions.js 里定义这些特殊的 thunk action 创建函数

`action.js`

```js
import fetch from 'cross-fetch';

export const REQUEST_POSTS = 'REQUEST_POSTS';
function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  };
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS';
function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map((child) => child.data),
    receivedAt: Date.now()
  };
}

export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT';
export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  };
}

// 来看一下我们写的第一个 thunk action 创建函数！
// 虽然内部操作不同，你可以像其它 action 创建函数一样使用它：
// store.dispatch(fetchPosts('reactjs'))

export function fetchPosts(subreddit) {
  // Thunk middleware 知道如何处理函数。
  // 这里把 dispatch 方法通过参数的形式传给函数，
  // 以此来让它自己也能 dispatch action。

  return function(dispatch) {
    // 首次 dispatch：更新应用的 state 来通知
    // API 请求发起了。

    dispatch(requestPosts(subreddit));

    // thunk middleware 调用的函数可以有返回值，
    // 它会被当作 dispatch 方法的返回值传递。

    // 这个案例中，我们返回一个等待处理的 promise。
    // 这并不是 redux middleware 所必须的，但这对于我们而言很方便。

    return fetch(`http://www.subreddit.com/r/${subreddit}.json`)
      .then(
        (response) => response.json(),
        // 不要使用 catch，因为会捕获
        // 在 dispatch 和渲染中出现的任何错误，
        // 导致 'Unexpected batch number' 错误。
        // https://github.com/facebook/react/issues/6895
        (error) => console.log('An error occurred.', error)
      )
      .then((json) =>
        // 可以多次 dispatch！
        // 这里，使用 API 请求结果来更新应用的 state。

        dispatch(receivePosts(subreddit, json))
      );
  };
}
```

### fetch 使用须知

本示例使用了 fetch API。它是替代 XMLHttpRequest 用来发送网络请求的非常新的 API。由于目前大多数浏览器原生还不支持它，建议你使用 cross_fetch 库：

```js
// 每次使用 `fetch` 前都这样调用一下
import fetch from 'cross_fetch';
```

在底层，它在浏览器端使用 whatwg-fetch polyfill，在服务器端使用 node-fetch，所以如果当你把应用改成 同构 时，并不需要改变 API 请求。

注意，fetch polyfill 假设你已经使用了 Promise 的 polyfill。确保你使用 Promise polyfill 的一个最简单的办法是在所有应用代码前启用 Babel 的 ES6 polyfill：

```js
// 在应用中其它任何代码执行前调用一次
import 'babel-polyfill';
```

我们是如何在 dispatch 机制中引入 Redux Thunk middleware 的呢？我们使用了 applyMiddleware()，如下

`index.js`

```js
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { selectSubreddit, fetchPosts } from './actions';
import rootReducer from './reducers';

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // 允许我们 dispatch() 函数
    loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
  )
);

store.dispatch(selectSubreddit('reactjs'));
store.dispatch(fetchPosts('reactjs')).then(() => console.log(store.getState()));
```

thunk 的一个优点是它的结果可以再次被 dispatch

`actions.js`

```js
import fetch from 'cross-fetch';

export const REQUEST_POSTS = 'REQUEST_POSTS';
function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  };
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS';
function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map((child) => child.data),
    receivedAt: Date.now()
  };
}

export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT';
export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  };
}

function fetchPosts(subreddit) {
  return (dispatch) => {
    dispatch(requestPosts(subreddit));
    return fetch(`http://www.reddit.com/r/${subreddit}.json`)
      .then((response) => response.json())
      .then((json) => dispatch(receivePosts(subreddit, json)));
  };
}

function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit];
  if (!posts) {
    return true;
  } else if (posts.isFetching) {
    return false;
  } else {
    return posts.didInvalidate;
  }
}

export function fetchPostsIfNeeded(subreddit) {
  // 注意这个函数也接收了 getState() 方法
  // 它让你选择接下来 dispatch 什么。

  // 当缓存的值是可用时，
  // 减少网络请求很有用。

  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      // 在 thunk 里 dispatch 另一个 thunk！
      return dispatch(fetchPosts(subreddit));
    } else {
      // 告诉调用代码不需要再等待。
      return Promise.resolve();
    }
  };
}
```

这可以让我们逐步开发复杂的异步控制流，同时保持代码整洁如初

`index.js`

```js
store.dispatch(fetchPostsIfNeeded('reactjs')).then(() => console.log(store.getState()));
```

服务端渲染须知

异步 action 创建函数对于做服务端渲染非常方便。你可以创建一个 store，dispatch 一个异步 action 创建函数，这个 action 创建函数又 dispatch 另一个异步 action 创建函数来为应用的一整块请求数据，同时在 Promise 完成和结束时才 render 界面。然后在 render 前，store 里就已经存在了需要用的 state

Thunk middleware 并不是 Redux 处理异步 action 的唯一方式：

- 你可以使用 redux-promise 或者 redux-promise-middleware 来 dispatch Promise 来替代函数。
- 你可以使用 redux-observable 来 dispatch Observable。
- 你可以使用 redux-saga 中间件来创建更加复杂的异步 action。
- 你可以使用 redux-pack 中间件 dispatch 基于 Promise 的异步 Action。
- 你甚至可以写一个自定义的 middleware 来描述 API 请求，就像这个真实场景的案例中的做法一样。

你也可以先尝试一些不同做法，选择喜欢的，并使用下去，不论有没有使用到 middleware 都行

## 连接到 UI

Dispatch 同步 action 与异步 action 间并没有区别，所以就不展开讨论细节了

# 异步数据流

默认情况下，createStore() 所创建的 Redux store 没有使用 middleware，所以只支持 同步数据流

你可以使用 applyMiddleware() 来增强 createStore()。虽然这不是必须的，但是它可以帮助你用简便的方式来描述异步的 action

像 redux-thunk 或 redux-promise 这样支持异步的 middleware 都包装了 store 的 dispatch() 方法，以此来让你 dispatch 一些除了 action 以外的其他内容，例如：函数或者 Promise。你所使用的任何 middleware 都可以以自己的方式解析你 dispatch 的任何内容，并继续传递 actions 给下一个 middleware。比如，支持 Promise 的 middleware 能够拦截 Promise，然后为每个 Promise 异步地 dispatch 一对 begin/end actions

当 middleware 链中的最后一个 middleware 开始 dispatch action 时，这个 action 必须是一个普通对象。这是 同步式的 Redux 数据流 开始的地方（译注：这里应该是指，你可以使用任意多异步的 middleware 去做你想做的事情，但是需要使用普通对象作为最后一个被 dispatch 的 action ，来将处理流程带回同步方式）

# Middleware

我们已经在异步 Action 一节的示例中看到了一些 middleware 的使用。如果你使用过 Express 或者 Koa 等服务端框架, 那么应该对 middleware 的概念不会陌生。 在这类框架中，middleware 是指可以被嵌入在框架接收请求到产生响应过程之中的代码。例如，Express 或者 Koa 的 middleware 可以完成添加 CORS headers、记录日志、内容压缩等工作。middleware 最优秀的特性就是可以被链式组合。你可以在一个项目中使用多个独立的第三方 middleware。

相对于 Express 或者 Koa 的 middleware，Redux middleware 被用于解决不同的问题，但其中的概念是类似的。它提供的是位于 action 被发起之后，到达 reducer 之前的扩展点。 你可以利用 Redux middleware 来进行日志记录、创建崩溃报告、调用异步接口或者路由等等。

这个章节分为两个部分，前面是帮助你理解相关概念的深度介绍，而后半部分则通过一些实例来体现 middleware 的强大能力。对文章前后内容进行结合通读，会帮助你更好的理解枯燥的概念，并从中获得启发。

## 理解 Middleware

正因为 middleware 可以完成包括异步 API 调用在内的各种事情，了解它的演化过程是一件相当重要的事。我们将以记录日志和创建崩溃报告为例，引导你体会从分析问题到通过构建 middleware 解决问题的思维过程。

### 问题: 记录日志

使用 Redux 的一个益处就是它让 state 的变化过程变的可预知和透明。每当一个 action 发起完成后，新的 state 就会被计算并保存下来。State 不能被自身修改，只能由特定的 action 引起变化。

试想一下，当我们的应用中每一个 action 被发起以及每次新的 state 被计算完成时都将它们记录下来，岂不是很好？当程序出现问题时，我们可以通过查阅日志找出是哪个 action 导致了 state 不正确。

![](./BjGBlES.png)

### 尝试 #1: 手动记录

最直接的解决方案就是在每次调用 store.dispatch(action) 前后手动记录被发起的 action 和新的 state。这称不上一个真正的解决方案，仅仅是我们理解这个问题的第一步。

> 注意如果你使用 react-redux 或者类似的绑定库，最好不要直接在你的组件中操作 store 的实例。在接下来的内容中，仅仅是假设你会通过 store 显式地向下传递。

假设，你在创建一个 Todo 时这样调用：

```js
store.dispatch(addTodo('Use Redux'));
```

为了记录这个 action 以及产生的新的 state，你可以通过这种方式记录日志：

```js
let action = addTodo('Use Redux');

console.log('dispatching', action);
store.dispatch(action);
console.log('next state', store.getState());
```

虽然这样做达到了想要的效果，但是你并不想每次都这么干。

### 尝试 #2: 封装 Dispatch

你可以将上面的操作抽取成一个函数：

```js
function dispatchAndLog(store, action) {
  console.log('dispatching', action);
  store.dispatch(action);
  console.log('next state', store.getState());
}
```

然后用它替换 store.dispatch():

```js
dispatchAndLog(store, addTodo('Use Redux'));
```

你可以选择到此为止，但是每次都要导入一个外部方法总归还是不太方便。

### 尝试 #3: Monkeypatching Dispatch

如果我们直接替换 store 实例中的 dispatch 函数会怎么样呢？Redux store 只是一个包含一些方法的普通对象，同时我们使用的是 JavaScript，因此我们可以这样实现 dispatch 的 monkeypatch：

```js
let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};
```

这离我们想要的已经非常接近了！无论我们在哪里发起 action，保证都会被记录。Monkeypatching 令人感觉还是不太舒服，不过利用它我们做到了我们想要的。

### 问题: 崩溃报告

如果我们想对 dispatch 附加超过一个的变换，又会怎么样呢？

我脑海中出现的另一个常用的变换就是在生产过程中报告 JavaScript 的错误。全局的 window.onerror 并不可靠，因为它在一些旧的浏览器中无法提供错误堆栈，而这是排查错误所需的至关重要信息。

试想当发起一个 action 的结果是一个异常时，我们将包含调用堆栈，引起错误的 action 以及当前的 state 等错误信息通通发到类似于 Sentry 这样的报告服务中，不是很好吗？这样我们可以更容易地在开发环境中重现这个错误。

然而，将日志记录和崩溃报告分离是很重要的。理想情况下，我们希望他们是两个不同的模块，也可能在不同的包中。否则我们无法构建一个由这些工具组成的生态系统。（提示：我们正在慢慢了解 middleware 的本质到底是什么！）

如果按照我们的想法，日志记录和崩溃报告属于不同的模块，他们看起来应该像这样：

```js
function patchStoreToAddLogging(store) {
  let next = store.dispatch;
  store.dispatch = function dispatchAndLog(action) {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result;
  };
}

function patchStoreToAddCrashReporting(store) {
  let next = store.dispatch;
  store.dispatch = function dispatchAndReportErrors(action) {
    try {
      return next(action);
    } catch (err) {
      console.error('捕获一个异常!', err);
      Raven.captureException(err, {
        extra: {
          action,
          state: store.getState()
        }
      });
      throw err;
    }
  };
}
```

如果这些功能以不同的模块发布，我们可以在 store 中像这样使用它们：

```js
patchStoreToAddLogging(store);
patchStoreToAddCrashReporting(store);
```

尽管如此，这种方式看起来还是不是够令人满意。

### 尝试 #4: 隐藏 Monkeypatching

Monkeypatching 本质上是一种 hack。“将任意的方法替换成你想要的”，此时的 API 会是什么样的呢？现在，让我们来看看这种替换的本质。 在之前，我们用自己的函数替换掉了 store.dispatch。如果我们不这样做，而是在函数中返回新的 dispatch 呢？

```js
function logger(store) {
  let next = store.dispatch;

  // 我们之前的做法:
  // store.dispatch = function dispatchAndLog(action) {

  return function dispatchAndLog(action) {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result;
  };
}
```

我们可以在 Redux 内部提供一个可以将实际的 monkeypatching 应用到 store.dispatch 中的辅助方法：

```js
function applyMiddlewareByMonkeypatching(store, middlewares) {
  middlewares = middlewares.slice();
  middlewares.reverse();

  // 在每一个 middleware 中变换 dispatch 方法。
  middlewares.forEach((middleware) => (store.dispatch = middleware(store)));
}
```

然后像这样应用多个 middleware：

```js
applyMiddlewareByMonkeypatching(store, [logger, crashReporter]);
```

尽管我们做了很多，实现方式依旧是 monkeypatching。因为我们仅仅是将它隐藏在我们的框架内部，并没有改变这个事实。

### 尝试 #5: 移除 Monkeypatching

为什么我们要替换原来的 dispatch 呢？当然，这样我们就可以在后面直接调用它，但是还有另一个原因：就是每一个 middleware 都可以操作（或者直接调用）前一个 middleware 包装过的 store.dispatch：

```js
function logger(store) {
  // 这里的 next 必须指向前一个 middleware 返回的函数：
  let next = store.dispatch;

  return function dispatchAndLog(action) {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result;
  };
}
```

将 middleware 串连起来的必要性是显而易见的。

如果 applyMiddlewareByMonkeypatching 方法中没有在第一个 middleware 执行时立即替换掉 store.dispatch，那么 store.dispatch 将会一直指向原始的 dispatch 方法。也就是说，第二个 middleware 依旧会作用在原始的 dispatch 方法。

但是，还有另一种方式来实现这种链式调用的效果。可以让 middleware 以方法参数的形式接收一个 next() 方法，而不是通过 store 的实例去获取。

```js
function logger(store) {
  return function wrapDispatchToAddLogging(next) {
    return function dispatchAndLog(action) {
      console.log('dispatching', action);
      let result = next(action);
      console.log('next state', store.getState());
      return result;
    };
  };
}
```

现在是“我们该更进一步”的时刻了，所以可能会多花一点时间来让它变的更为合理一些。这些串联函数很吓人。ES6 的箭头函数可以使其 柯里化 ，从而看起来更舒服一些:

```js
const logger = (store) => (next) => (action) => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

const crashReporter = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception!', err);
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    });
    throw err;
  }
};
```

这正是 Redux middleware 的样子。

Middleware 接收了一个 next() 的 dispatch 函数，并返回一个 dispatch 函数，返回的函数会被作为下一个 middleware 的 next()，以此类推。由于 store 中类似 getState() 的方法依旧非常有用，我们将 store 作为顶层的参数，使得它可以在所有 middleware 中被使用。

### 尝试 #6: “单纯”地使用 Middleware

我们可以写一个 applyMiddleware() 方法替换掉原来的 applyMiddlewareByMonkeypatching()。在新的 applyMiddleware() 中，我们取得最终完整的被包装过的 dispatch() 函数，并返回一个 store 的副本：

```js
// 警告：这只是一种“单纯”的实现方式！
// 这 *并不是* Redux 的 API.

function applyMiddleware(store, middlewares) {
  middlewares = middlewares.slice();
  middlewares.reverse();

  let dispatch = store.dispatch;
  middlewares.forEach((middleware) => (dispatch = middleware(store)(dispatch)));

  return Object.assign({}, store, { dispatch });
}
```

这与 Redux 中 applyMiddleware() 的实现已经很接近了，但是有三个重要的不同之处：

- 它只暴露一个 store API 的子集给 middleware：dispatch(action) 和 getState()。
- 它用了一个非常巧妙的方式，以确保如果你在 middleware 中调用的是 store.dispatch(action) 而不是 next(action)，那么这个操作会再次遍历包含当前 middleware 在内的整个 middleware 链。这对异步的 middleware 非常有用，正如我们在之前的章节中提到的。
- 为了保证你只能应用 middleware 一次，它作用在 createStore() 上而不是 store 本身。因此它的签名不是 (store, middlewares) => store， 而是 (...middlewares) => (createStore) => createStore。

由于在使用之前需要先应用方法到 createStore() 之上有些麻烦，createStore() 也接受将希望被应用的函数作为最后一个可选参数传入。

### 最终的方法

这是我们刚刚所写的 middleware：

```js
const logger = (store) => (next) => (action) => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

const crashReporter = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception!', err);
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    });
    throw err;
  }
};
```

然后是将它们引用到 Redux store 中：

```js
import { createStore, combineReducers, applyMiddleware } from 'redux';

let todoApp = combineReducers(reducers);
let store = createStore(
  todoApp,
  // applyMiddleware() 告诉 createStore() 如何处理中间件
  applyMiddleware(logger, crashReporter)
);
```

就是这样！现在任何被发送到 store 的 action 都会经过 logger 和 crashReporter：

```js
// 将经过 logger 和 crashReporter 两个 middleware！
store.dispatch(addTodo('Use Redux'));
```

### 7 个示例

```js
/**
 * 记录所有被发起的 action 以及产生的新的 state。
 */
const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.groupEnd(action.type);
  return result;
};

/**
 * 在 state 更新完成和 listener 被通知之后发送崩溃报告。
 */
const crashReporter = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception!', err);
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    });
    throw err;
  }
};

/**
 * 用 { meta: { delay: N } } 来让 action 延迟 N 毫秒。
 * 在这个案例中，让 `dispatch` 返回一个取消 timeout 的函数。
 */
const timeoutScheduler = (store) => (next) => (action) => {
  if (!action.meta || !action.meta.delay) {
    return next(action);
  }

  let timeoutId = setTimeout(() => next(action), action.meta.delay);

  return function cancel() {
    clearTimeout(timeoutId);
  };
};

/**
 * 通过 { meta: { raf: true } } 让 action 在一个 rAF 循环帧中被发起。
 * 在这个案例中，让 `dispatch` 返回一个从队列中移除该 action 的函数。
 */
const rafScheduler = (store) => (next) => {
  let queuedActions = [];
  let frame = null;

  function loop() {
    frame = null;
    try {
      if (queuedActions.length) {
        next(queuedActions.shift());
      }
    } finally {
      maybeRaf();
    }
  }

  function maybeRaf() {
    if (queuedActions.length && !frame) {
      frame = requestAnimationFrame(loop);
    }
  }

  return (action) => {
    if (!action.meta || !action.meta.raf) {
      return next(action);
    }

    queuedActions.push(action);
    maybeRaf();

    return function cancel() {
      queuedActions = queuedActions.filter((a) => a !== action);
    };
  };
};

/**
 * 使你除了 action 之外还可以发起 promise。
 * 如果这个 promise 被 resolved，他的结果将被作为 action 发起。
 * 这个 promise 会被 `dispatch` 返回，因此调用者可以处理 rejection。
 */
const vanillaPromise = (store) => (next) => (action) => {
  if (typeof action.then !== 'function') {
    return next(action);
  }

  return Promise.resolve(action).then(store.dispatch);
};

/**
 * 让你可以发起带有一个 { promise } 属性的特殊 action。
 *
 * 这个 middleware 会在开始时发起一个 action，并在这个 `promise` resolve 时发起另一个成功（或失败）的 action。
 *
 * 为了方便起见，`dispatch` 会返回这个 promise 让调用者可以等待。
 */
const readyStatePromise = (store) => (next) => (action) => {
  if (!action.promise) {
    return next(action);
  }

  function makeAction(ready, data) {
    let newAction = Object.assign({}, action, { ready }, data);
    delete newAction.promise;
    return newAction;
  }

  next(makeAction(false));
  return action.promise.then(
    (result) => next(makeAction(true, { result })),
    (error) => next(makeAction(true, { error }))
  );
};

/**
 * 让你可以发起一个函数来替代 action。
 * 这个函数接收 `dispatch` 和 `getState` 作为参数。
 *
 * 对于（根据 `getState()` 的情况）提前退出，或者异步控制流（ `dispatch()` 一些其他东西）来说，这非常有用。
 *
 * `dispatch` 会返回被发起函数的返回值。
 */
const thunk = (store) => (next) => (action) =>
  typeof action === 'function' ? action(store.dispatch, store.getState) : next(action);

// 你可以使用以上全部的 middleware！（当然，这不意味着你必须全都使用。）
let todoApp = combineReducers(reducers);
let store = createStore(
  todoApp,
  applyMiddleware(rafScheduler, timeoutScheduler, thunk, vanillaPromise, readyStatePromise, logger, crashReporter)
);
```

# 搭配 React Router

现在你想在你的 Redux 应用中使用路由功能，可以搭配使用 React Router 来实现。 Redux 和 React Router 将分别成为你数据和 URL 的事实来源（the source of truth）。 在大多数情况下， 最好 将他们分开，除非你需要时光旅行和回放 action 来触发 URL 改变。

## 安装 React Router

可以使用 npm 来安装 React Router。本教程基于 react-router@^2.7.0 。

`npm install --save react-router`

## 配置后备(fallback) URL

在集成 React Router 之前，我们需要配置一下我们的开发服务器。 显然，我们的开发服务器无法感知配置在 React Router 中的 route。 比如：你想访问并刷新 /todos，由于是一个单页面应用，你的开发服务器需要生成并返回 index.html。 这里，我们将演示如何在流行的开发服务器上启用这项功能。

> 使用 Create React App 须知如果你是使用 Create React App （你可以点击这里了解更多，译者注）工具来生成项目，会自动为你配置好后备(fallback) URL。

## 配置 Express

如果你使用的是 Express 来返回你的 index.html 页面，可以增加以下代码到你的项目中：

```js
app.get('/*', (req, res) => {
  res.sendfile(path.join(__dirname, 'index.html'));
});
```

## 配置 WebpackDevServer

如果你正在使用 WebpackDevServer 来返回你的 index.html 页面， 你可以增加如下配置到 webpack.config.dev.js：

```json
devServer: {
  historyApiFallback: true,
}
```

## 连接 React Router 和 Redux 应用

在这一章，我们将使用 Todos 作为例子。我们建议你在阅读本章的时候，先将仓库克隆下来。

首先，我们需要从 React Router 中导入 `<Router />` 和 `<Route />`。代码如下：

```js
import { Router, Route, browserHistory } from 'react-router';
```

在 React 应用中，通常你会用 `<Router />` 包裹 `<Route />`。 如此，当 URL 变化的时候，`<Router />` 将会匹配到指定的路由，然后渲染路由绑定的组件。 `<Route />` 用来显式地把路由映射到应用的组件结构上。 用 path 指定 URL，用 component 指定路由命中 URL 后需要渲染的那个组件。

```js
const Root = () => (
  <Router>
    <Route path='/' component={App} />
  </Router>
);
```

另外，在我们的 Redux 应用中，我们仍将使用 <Provider />。 <Provider /> 是由 React Redux 提供的高阶组件，用来让你将 Redux 绑定到 React （详见 搭配 React）。

然后，我们从 React Redux 导入 <Provider />：

```js
import { Provider } from 'react-redux';
```

我们将用 <Provider /> 包裹 <Router />，以便于路由处理器可以访问 store（暂时未找到相关中文翻译，译者注）。

```js
const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Route path='/' component={App} />
    </Router>
  </Provider>
);
```

现在，如果 URL 匹配到 '/'，将会渲染 `<App />` 组件。此外，我们将在 '/' 后面增加参数 (:filter), 当我们尝试从 URL 中读取参数 (:filter)，需要以下代码：

```js
<Route path='/(:filter)' component={App} />
```

也许你想将 '#' 从 URL 中移除（例如：http://localhost:3000/#/?_k=4sbb0i）。 你需要从 React Router 导入 browserHistory 来实现：

```js
import { Router, Route, browserHistory } from 'react-router';
```

然后将它传给 <Router /> 来移除 URL 中的 '#'：

```js
<Router history={browserHistory}>
  <Route path='/(:filter)' component={App} />
</Router>
```

只要你不需要兼容古老的浏览器，比如 IE9，你都可以使用 browserHistory。

`components/Root.js`

```js
import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/(:filter)' component={App} />
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
```

## 通过 React Router 导航

React Router 提供了 `<Link />` 来实现导航功能。 下面将举例演示。现在，修改我们的容器组件 `<FilterLink />` ，这样我们就可以使用 `<FilterLink />` 来改变 URL。你可以通过 activeStyle 属性来指定激活状态的样式。

`containers/FilterLink.js`

```js
import React from 'react';
import { Link } from 'react-router';

const FilterLink = ({ filter, children }) => (
  <Link
    to={filter === 'all' ? '' : filter}
    activeStyle={{
      textDecoration: 'none',
      color: 'black'
    }}
  >
    {children}
  </Link>
);

export default FilterLink;
```

`components/Footer.js`

```js
import React from 'react';
import FilterLink from '../containers/FilterLink';

const Footer = () => (
  <p>
    Show: <FilterLink filter='all'>All</FilterLink>
    {', '}
    <FilterLink filter='active'>Active</FilterLink>
    {', '}
    <FilterLink filter='completed'>Completed</FilterLink>
  </p>
);

export default Footer;
```

这时，如果你点击 <FilterLink />，你将看到你的 URL 在 '/complete'，'/active'，'/' 间切换。 甚至还支持浏览的回退功能，可以从历史记录中找到之前的 URL 并回退。
