---
title: Redux入门学习
path: /redux-introduce-learn/
date: 2018-06-12 14:09:04
tags: 前端, React, Redux
---

# 简介

Redux 是 JavaScript 状态容器，提供可预测化的状态管理

可以让你构建一致化的应用，运行于不同的环境（客户端、服务器、原生应用），并且易于测试。不仅于此，它还提供 超爽的开发体验，比如有一个时间旅行调试器可以编辑后实时预览

Redux 由 Flux 演变而来，但受 Elm 的启发，避开了 Flux 的复杂性。 不管你有没有使用过它们，只需几分钟就能上手 Redux

# 三大原则

## 单一数据源

整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中

## State是只读的

唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象

## 使用纯函数来执行修改

为了描述 action 如何改变 state tree，你需要编写 reducers

# Action

action是把数据从应用传到store的有效载荷，它是store数据的唯一来源，通过store.dispatch()将action传到store。

添加新todo任务的action是这样的

```js
const ADD_TODO='ADD_TODO'
{
    type:ADD_TODO,
    text:'Build my first Redux app'
}
```

多数情况下，type 会被定义成字符串常量。当应用规模越来越大时，建议使用单独的模块或文件来存放 action

```js
import { ADD_TODO, REMOVE_TODO } from '../actionTypes'
```

要尽量减少在`action`中传递的数据，比如以下例子就比把整个任务对象传过去要好

```js
{
  type: TOGGLE_TODO,
  index: 5
}
```

最后，再添加一个 action type 来表示当前的任务展示选项

```js
{
  type: SET_VISIBILITY_FILTER,
  filter: SHOW_COMPLETED
}
```

## Action创建函数

action创建函数就是生成action的方法，注意区别`action`和`action创建函数`

在redux的action创建函数只是简单返回一个action

```js
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```

这样将会使action创建函数更容易被移植和测试

在flux中，当调用action 创建函数时，一般会触发一个 dispatch，像这样

```js
function addTodoWithDispatch(text) {
  const action = {
    type: ADD_TODO,
    text
  }
  dispatch(action)
}
```

不同的是，Redux 中只需把 action 创建函数的结果传给 dispatch() 方法即可发起一次 dispatch 过程

```js
dispatch(addTodo(text))
dispatch(completeTodo(index))
```

或者创建一个被绑定的action创建函数来自动dispatch

```js
const boundAddTodo = text => dispatch(addTodo(text))
const boundCompleteTodo = index => dispatch(completeTodo(index))
```

然后直接调用

```js
boundAddTodo(text);
boundCompleteTodo(index);
```

store 里能直接通过 store.dispatch() 调用 dispatch() 方法，但是多数情况下你会使用 react-redux 提供的 connect() 帮助器来调用。bindActionCreators() 可以自动把多个 action 创建函数 绑定到 dispatch() 方法上

Action 创建函数也可以是异步非纯函数

完整代码

```js
/*
 * action 类型
 */

export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/*
 * 其它的常量
 */

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

/*
 * action 创建函数
 */

export function addTodo(text) {
  return { type: ADD_TODO, text }
}

export function toggleTodo(index) {
  return { type: TOGGLE_TODO, index }
}

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}
```

## Reducer

reducer指定了应用状态的变化如何响应actions并发送到store的

### 设计State结构

在redux应用中，所有的state都被保存在一个单一对象中。

以todo应用为例，需要保存两种不同的数据

- 当前选中的任务过滤条件
- 完整的任务列表

通常，还需要存放一些其他的数据，以及一些UI相关的state，尽量分开数据与UI的state

```js
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

>开发复杂的应用时，不可避免会有一些数据相互引用。建议你尽可能地把 state 范式化，不存在嵌套。把所有数据放到一个对象里，每个数据以 ID 为主键，不同实体或列表间通过 ID 相互引用数据。把应用的 state 想像成数据库。这种方法在 normalizr 文档里有详细阐述。例如，实际开发中，在 state 里同时存放 todosById: { id -> todo } 和 todos: array<id> 是比较好的方式，本文中为了保持示例简单没有这样处理

### Action处理

redux是一个纯函数，接收旧的state和action，返回新的state

```js
(previousState, action) => newState
```

注意，永远不要在reducer里做以下操作

- 修改传入参数
- 执行有副作用的操作，如API请求与路由跳转
- 调用非纯函数，如`Date.now()`或`Math.random()`

在以后的章节会介绍如何执行有副作用的操作，只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算

以指定 state 的初始状态作为开始。Redux 首次执行时，state 为 undefined，此时我们可借机设置并返回应用的初始 state

```js
import { VisibilityFilters } from './actions'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
};

function todoApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }

  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
  return state
}
```

这里的一个技巧是使用 ES6参数默认值来精简语法

```js
function todoApp(state = initialState, action) {
  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
  return state
}
```

现在可以处理SET_VISIBILITY_FILTER，需要做的只是改变 state 中的 visibilityFilter

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
```

注意

1. 不要修改 state。 使用 Object.assign() 新建了一个副本。不能这样使用 Object.assign(state, { visibilityFilter: action.filter })，因为它会改变第一个参数的值。你必须把第一个参数设置为空对象。你也可以开启对ES7提案对象展开运算符的支持, 从而使用 { ...state, ...newState } 达到相同的目的
2. 在 default 情况下返回旧的 state。遇到未知的 action 时，一定要返回旧的 state

**Object.assign 须知**

Object.assign() 是 ES6 特性，但多数浏览器并不支持。你要么使用 polyfill，Babel 插件，或者使用其它库如 _.assign() 提供的帮助方法

**switch 和样板代码须知**

switch 语句并不是严格意义上的样板代码。Flux 中真实的样板代码是概念性的：更新必须要发送、Store 必须要注册到 Dispatcher、Store 必须是对象（开发同构应用时变得非常复杂）。为了解决这些问题，Redux 放弃了 event emitters（事件发送器），转而使用纯 reducer

很不幸到现在为止，还有很多人存在一个误区：根据文档中是否使用 switch 来决定是否使用它。如果你不喜欢 switch，完全可以自定义一个 createReducer 函数来接收一个事件处理函数列表，参照"减少样板代码"

### 处理多个action

```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

// React component
class Counter extends Component {
  render() {
    const { value, onIncreaseClick } = this.props
    return (
      <div>
        <span>{value}</span>
        <button onClick={onIncreaseClick}>Increase</button>
      </div>
    )
  }
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncreaseClick: PropTypes.func.isRequired
}

// 这是一个 reducer，形式为 (state, action) => state 的纯函数。
// 描述了 action 如何把 state 转变成下一个 state。
function counter(state = { count: 0 }, action) {
  const count = state.count
  switch (action.type) {
    case 'increase':
      return { count: count + 1 }
    default:
      return state
  }
}

// Redux store存放应用状态
const store = createStore(counter)

// Map Redux state to component props
// 可以手动订阅更新，也可以事件绑定到视图层
function mapStateToProps(state) {
  return {
    value: state.count
  }
}

// Action
const increaseAction = { type: 'increase' }

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    // 改变内部 state 惟一方法是 dispatch 一个 action
    onIncreaseClick: () => dispatch(increaseAction)
  }
}

// Connected Component
const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```