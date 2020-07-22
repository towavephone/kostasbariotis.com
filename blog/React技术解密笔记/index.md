---
title: React技术解密笔记
date: 2020-7-22 19:59:15
path: /react-technology-notes/
tags: 前端, React
---

# 背景

## React 理念

我们可以从官网看到 React 的理念：

> 我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。

那么该如何理解快速响应？可以从两个角度来看：

- 速度快
- 响应自然

React 是如何实现这两点的呢？

### 理解“速度快”

每当聊到一款前端框架，拉出来比比渲染速度成了老生常谈。

我们经常用“前端三大框架”指 React、Vue 和 Angular。相比于使用模版语言的 Vue、Angular，使用原生 js（JSX 仅仅是 js 的语法糖）开发 UI 的 React 在语法层面有更多灵活性。

然而，高灵活性意味着高不确定性。考虑如下 Vue 模版语句：

```html
<template>
    <ul>
        <li>0</li>
        <li>{{ name }}</li>
        <li>2</li>
        <li>3</li>
    </ul>
</template>
```

当编译时，由于模版语法的约束，Vue 可以明确知道在 li 中，只有 name 是变量，这可以提供一些优化线索。

而在 React 中，以上代码可以写成如下 JSX：

```js
function App({name}) {
    const children = [];
    for (let i = 0; i < 4; i++) {
        children.push(<li>{i === 1 ? name : i}</li>)
    }
    return <ul>{children}</ul>
}
```

由于语法的灵活，在编译时无法区分可能变化的部分。所以在运行时，React 需要遍历每个 li，判断其数据是否更新。

基于以上原因，相比于 Vue、Angular，缺少编译时优化手段的 React 为了速度快需要在运行时做出更多努力。

比如

- 使用 PureComponent 或 React.memo 构建组件
- 使用 shouldComponentUpdate 生命周期钩子
- 渲染列表时使用 key
- 使用 useCallback 和 useMemo 缓存函数和变量

由开发者来显式的告诉 React 哪些组件不需要重复计算、可以复用。

在后面源码的学习中，我们会看到这些优化手段是如何起作用的。比如经过优化后，React 会通过 bailoutOnAlreadyFinishedWork 方法跳过一些本次更新不需要处理的任务。

### 理解“响应自然”

该如何理解“响应自然”？ React 给出的答案是将人机交互研究的结果整合到真实的 UI 中。

设想以下场景：

![](searchbox.gif)

有一个地址搜索框，在输入字符时会实时显示地址匹配结果。

当用户输入过快时可能输入变得不是那么流畅，这是由于下拉列表的更新会阻塞线程，我们一般是通过 debounce 或 throttle 来减少输入内容时触发回调的次数来解决这个问题。

但这只是治标不治本，只要组件的更新操作是同步的，那么当更新开始直到渲染完毕前，组件中总会有一定数量的工作占用线程，浏览器没有空闲时间绘制 UI，造成卡顿。

让我们从“响应自然”的角度考虑：当输入字符时，用户是否在意下拉框能在一瞬间就更新？

事实是：并不在意。

如果我们能稍稍延迟下拉框更新的时间，为浏览器留出时间渲染 UI，让输入不卡顿。这样的体验是更自然的。

为了实现这个目标，需要将同步的更新变为可中断的异步更新。

在浏览器每一帧的时间中，预留一些时间给 JS 线程，React 利用这部分时间更新组件（可以看到，在源码中，预留的初始时间是 5ms）。

当预留的时间不够用时，React 将线程控制权交还给浏览器使其有时间渲染 UI，React 则等待下一帧时间到来继续被中断的工作。

### 总结

通过以上内容，我们可以看到，React 为了践行“构建快速响应的大型 Web 应用程序”理念做出的努力。

这其中有些优化手段可以在现有架构上增加，而有些（如：异步可中断更新）只能重构整个架构实现。

最后再让我们看看，Dan 回答网友关于 React 发展方向的提问：

![](2020-07-15-21-10-39.png)

![](2020-07-15-21-10-43.png)

相比于新增 feature，React 更在意底层抽象的表现力。结合理念，相信你已经明白这意味着什么了。

## 老的 React 架构

在上一节中我们了解了 React 的理念，简单概括就是速度快，响应自然。

React 从 v15 升级到 v16 后重构了整个架构。本节我们聊聊 v15，看看他为什么不能满足速度快，响应自然的理念，以至于被重构。

### React15 架构

React15 架构可以分为两层：

- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

#### Reconciler（协调器）

我们知道，在 React 中可以通过 this.setState、this.forceUpdate、ReactDOM.render 等 API 触发更新。

每当有更新发生时，Reconciler 会做如下工作：

- 调用函数组件或 class 组件的 render 方法，将返回的 JSX 转化为虚拟 DOM
- 将虚拟 DOM 和上次更新时的虚拟 DOM 对比
- 通过对比找出本次更新中变化的虚拟 DOM
- 通知 Renderer 将变化的虚拟 DOM 渲染到页面上

#### Renderer（渲染器）

由于 React 支持跨平台，所以不同平台有不同的 Renderer，我们前端最熟悉的是负责在浏览器环境渲染的 Renderer —— ReactDOM。

除此之外，还有：

- ReactNative 渲染器，渲染 App 原生组件
- ReactTest 渲染器，渲染出纯 Js 对象用于测试
- ReactArt 渲染器，渲染到 Canvas, SVG 或 VML (IE8)

在每次更新发生时，Renderer 接到 Reconciler 通知，将变化的组件渲染在当前宿主环境。

### React15 架构的缺点

在 Reconciler 中，mount 的组件会调用 mountComponent，update 的组件会调用 updateComponent，这两个方法都会递归更新子组件

#### 递归更新的缺点

主流的浏览器刷新频率为 60Hz，即每 （1000ms / 60Hz）16.6ms 浏览器刷新一次。我们知道，JS 可以操作 DOM，GUI 渲染线程与 JS 线程是互斥的。所以 JS 脚本执行和浏览器布局、绘制不能同时执行。

在每 16.6ms 时间内，需要完成如下工作：

```
JS 脚本执行 -----  样式布局 ----- 样式绘制
```

当 JS 执行时间过长，超出了 16.6ms，这次刷新就没有时间执行样式布局和样式绘制了。

对于用户在输入框输入内容这个行为来说，就体现为按下了键盘按键但是页面上不实时显示输入。

对于 React 的更新来说，由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了 16ms，用户交互就会卡顿。

在上一节中，我们已经提出了解决办法——用可中断的异步更新代替同步的更新。那么 React15 的架构支持异步更新么？

> 乘法小Demo  
初始化时 state.count = 1，每次点击按钮 state.count++  
列表中 3 个元素的值分别为 1，2，3 乘以 state.count 的结果

我用红色标注了更新的步骤。

![](2020-07-22-19-29-48.png)

我们可以看到，Reconciler 和 Renderer 是交替工作的，当第一个 li 在页面上已经变化后，第二个 li 再进入 Reconciler。

由于整个过程都是同步的，所以在用户看来所有 DOM 是同时更新的。

让我们看看在 React15 架构中如果中途中断更新会怎么样？

![](2020-07-22-19-32-49.png)

当第一个 li 完成更新时中断更新，即步骤 3 完成后中断更新，此时后面的步骤都还未执行。

用户本来期望 123 变为 246。实际却看见更新不完全的 DOM！（即 223）

基于这个原因，React 决定重写整个架构。

## 新的 React 架构

上一节我们聊到 React15 架构不能支撑异步更新以至于需要重构。那么这一节我们来学习重构后的 React16 是如何支持异步更新的。

### React16 架构

React16 架构可以分为三层：

- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入 Reconciler
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

可以看到，相较于 React15，React16 中新增了 Scheduler（调度器），让我们来了解下他。

### Scheduler（调度器）

既然我们以浏览器是否有剩余时间作为任务中断的标准，那么我们需要一种机制，当浏览器有剩余时间时通知我们。

其实部分浏览器已经实现了这个 API，这就是 requestIdleCallback。但是由于以下因素，React 放弃使用：

- 浏览器兼容性
- 触发频率不稳定，受很多因素影响。比如当我们的浏览器切换 tab 后，之前 tab 注册的 requestIdleCallback 触发的频率会变得很低

基于以上原因，React实现了功能更完备的requestIdleCallbackpolyfill，这就是Scheduler。除了在空闲时触发回调的功能外，Scheduler还提供了多种调度优先级供任务设置。

> Schduler 是独立于 React 的库

### Reconciler（协调器）

我们知道，在 React15 中 Reconciler 是递归处理虚拟 DOM 的。让我们看看 React16 的 Reconciler。

我们可以看见，更新工作从递归变成了可以中断的循环过程。每次循环都会调用 shouldYield 判断当前是否有剩余时间。

```js
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

那么 React16 是如何解决中断更新时 DOM 渲染不完全的问题呢？

在 React16 中，Reconciler 与 Renderer 不再是交替工作，当 Scheduler 将任务交给 Reconciler 后，Reconciler 会为变化的虚拟 DOM 打上代表增/删/更新的标记，类似这样：

```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

整个 Scheduler 与 Reconciler 的工作都在内存中进行，只有当所有组件都完成 Reconciler 的工作，才会统一交给 Renderer。

### Renderer（渲染器）

Renderer 根据 Reconciler 为虚拟 DOM 打的标记，同步执行对应的 DOM 操作。

所以，对于我们在上一节使用过的 Demo

在 React16 架构中整个更新流程为：

![](2020-07-22-19-56-05.png)

其中红框中的步骤随时可能由于以下原因被中断：

- 有其他更高优任务需要先更新
- 当前帧没有剩余时间

由于红框中的工作都在内存中进行，不会更新页面上的 DOM，所以即使反复中断，React15 中的问题 (用户看见更新不完全的 DOM) 也不会出现。

> 事实上，由于 Scheduler 和 Reconciler 都是平台无关的，所以 React 为他们单独发了一个包 [react-reconciler](https://www.npmjs.com/package/react-reconciler)。你可以用这个包自己实现一个 ReactDOM，具体见参考资料
