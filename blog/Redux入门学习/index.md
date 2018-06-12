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

# 原则

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