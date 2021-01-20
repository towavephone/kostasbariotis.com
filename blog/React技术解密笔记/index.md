---
title: React技术解密笔记——理念篇
date: 2021-1-20 10:51:32
path: /react-technology-notes/
tags: 前端, React, 高级前端
---

# React 理念

## React 理念

我们可以从官网看到 React 的理念：

> 我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。

可见，关键是实现快速响应。那么制约快速响应的因素是什么呢？

我们日常使用 App，浏览网页时，有两类场景会制约快速响应：

- 当遇到大计算量的操作或者设备性能不足使页面掉帧，导致卡顿。
- 发送网络请求后，由于需要等待数据返回才能进一步操作导致不能快速响应。

这两类场景可以概括为：

- CPU 的瓶颈
- IO 的瓶颈

React 是如何解决这两个瓶颈的呢？

### CPU 的瓶颈

当项目变得庞大、组件数量繁多时，就容易遇到 CPU 的瓶颈。

考虑如下 Demo，我们向视图中渲染 3000 个 li：

```jsx
function App() {
  const len = 3000;
  return (
    <ul>
      {Array(len).fill(0).map((_, i) => <li>{i}</li>)}
    </ul>
  );
}

const rootEl = document.querySelector("#root");
ReactDOM.render(<App/>, rootEl);  
```

主流浏览器刷新频率为 60Hz，即每 （1000ms / 60Hz）16.6ms 浏览器刷新一次。

我们知道，JS 可以操作 DOM，GUI 渲染线程与 JS 线程是互斥的。所以 JS 脚本执行和浏览器布局、绘制不能同时执行。

在每 16.6ms 时间内，需要完成如下工作：

```
JS 脚本执行 -----  样式布局 ----- 样式绘制
```

当 JS 执行时间过长，超出了 16.6ms，这次刷新就没有时间执行样式布局和样式绘制了。

在 Demo 中，由于组件数量繁多（3000个），JS 脚本执行时间过长，页面掉帧，造成卡顿。

可以从打印的执行堆栈图看到，JS 执行时间为 73.65ms，远远多于一帧的时间。

![](res/2021-01-20-11-08-03.png)

如何解决这个问题呢？

答案是：在浏览器每一帧的时间中，预留一些时间给 JS 线程，React 利用这部分时间更新组件（可以看到，在源码中，预留的初始时间是 5ms）。

当预留的时间不够用时，React 将线程控制权交还给浏览器使其有时间渲染 UI，React 则等待下一帧时间到来继续被中断的工作。

> 这种将长任务分拆到每一帧中，像蚂蚁搬家一样一次执行一小段任务的操作，被称为时间切片（time slice）

接下来我们开启 Concurrent Mode（后续章节会讲到，当前你只需了解开启后会启用时间切片）：

```js
// 通过使用ReactDOM.unstable_createRoot开启Concurrent Mode
// ReactDOM.render(<App/>, rootEl);  
ReactDOM.unstable_createRoot(rootEl).render(<App/>);
```

此时我们的长任务被拆分到每一帧不同的 task 中，JS 脚本执行时间大体在 5ms 左右，这样浏览器就有剩余时间执行样式布局和样式绘制，减少掉帧的可能性。

![](res/2021-01-20-11-16-52.png)

所以，解决 CPU 瓶颈的关键是实现时间切片，而时间切片的关键是：将同步的更新变为可中断的异步更新。

### IO 的瓶颈

网络延迟是前端开发者无法解决的。如何在网络延迟客观存在的情况下，减少用户对网络延迟的感知？

React 给出的答案是将人机交互研究的结果整合到真实的 UI 中。

这里我们以业界人机交互最顶尖的苹果举例，在 IOS 系统中：

点击“设置”面板中的“通用”，进入“通用”界面：

<a target="_blank" href="./res/legacy-move.gif">通用</a>

作为对比，再点击“设置”面板中的“Siri与搜索”，进入“Siri与搜索”界面：

<a target="_blank" href="./res/concurrent-move.gif">Siri与搜索</a>

你能感受到两者体验上的区别么？

事实上，点击“通用”后的交互是同步的，直接显示后续界面。而点击“Siri与搜索”后的交互是异步的，需要等待请求返回后再显示后续界面。但从用户感知来看，这两者的区别微乎其微。

这里的窍门在于：点击“Siri与搜索”后，先在当前页面停留了一小段时间，这一小段时间被用来请求数据。

当“这一小段时间”足够短时，用户是无感知的。如果请求时间超过一个范围，再显示 loading 的效果。

试想如果我们一点击“Siri与搜索”就显示 loading 效果，即使数据请求时间很短，loading 效果一闪而过。用户也是可以感知到的。

为此，React 实现了 Suspense 功能及配套的 hook——useDeferredValue。

而在源码内部，为了支持这些特性，同样需要将同步的更新变为可中断的异步更新。

### 总结

通过以上内容，我们可以看到，React 为了践行“构建快速响应的大型 Web 应用程序”理念做出的努力。

其中的关键是解决 CPU 的瓶颈与 IO 的瓶颈。而落实到实现上，则需要将同步的更新变为可中断的异步更新。

## 老的 React 架构

React 从 v15 升级到 v16 后重构了整个架构。本节我们聊聊 v15，看看他为什么不能满足快速响应的理念，以至于被重构。

### React15 架构

React15 架构可以分为两层：

- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

#### Reconciler（协调器）

我们知道，在 React 中可以通过 this.setState、this.forceUpdate、ReactDOM.render 等 API 触发更新。

每当有更新发生时，Reconciler 会做如下工作：

- 调用函数组件、或 class 组件的 render 方法，将返回的 JSX 转化为虚拟 DOM
- 将虚拟 DOM 和上次更新时的虚拟 DOM 对比
- 通过对比找出本次更新中变化的虚拟 DOM
- 通知 Renderer 将变化的虚拟 DOM 渲染到页面上

#### Renderer（渲染器）

由于 React 支持跨平台，所以不同平台有不同的 Renderer。我们前端最熟悉的是负责在浏览器环境渲染的 Renderer —— ReactDOM。

除此之外，还有：

- ReactNative 渲染器，渲染 App 原生组件
- ReactTest 渲染器，渲染出纯 Js 对象用于测试
- ReactArt 渲染器，渲染到 Canvas, SVG 或 VML (IE8)

在每次更新发生时，Renderer 接到 Reconciler 通知，将变化的组件渲染在当前宿主环境。

### React15 架构的缺点

在 Reconciler 中，mount 的组件会调用 mountComponent，update 的组件会调用 updateComponent。这两个方法都会递归更新子组件。

#### 递归更新的缺点

由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了 16ms，用户交互就会卡顿。

在上一节中，我们已经提出了解决办法——用可中断的异步更新代替同步的更新。那么 React15 的架构支持异步更新么？让我们看一个例子：

我用红色标注了更新的步骤。

![](res/2021-01-20-13-39-51.png)

我们可以看到，Reconciler 和 Renderer 是交替工作的，当第一个 li 在页面上已经变化后，第二个 li 再进入 Reconciler。

由于整个过程都是同步的，所以在用户看来所有 DOM 是同时更新的。

接下来，让我们模拟一下，如果中途中断更新会怎么样？

> 注意  
> 以下是我们模拟中断的情况，实际上React15并不会中断进行中的更新

![](res/2021-01-20-13-41-12.png)

当第一个 li 完成更新时中断更新，即步骤 3 完成后中断更新，此时后面的步骤都还未执行。

用户本来期望 123 变为 246。实际却看见更新不完全的 DOM！（即223）

基于这个原因，React 决定重写整个架构。

## 新的 React 架构

### React16 架构

React16 架构可以分为三层：

- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入 Reconciler
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

可以看到，相较于 React15，React16 中新增了 Scheduler（调度器），让我们来了解下他。

#### Scheduler（调度器）

既然我们以浏览器是否有剩余时间作为任务中断的标准，那么我们需要一种机制，当浏览器有剩余时间时通知我们。

其实部分浏览器已经实现了这个 API，这就是 requestIdleCallback。但是由于以下因素，React 放弃使用：

- 浏览器兼容性
- 触发频率不稳定，受很多因素影响。比如当我们的浏览器切换 tab 后，之前 tab 注册的 requestIdleCallback 触发的频率会变得很低

基于以上原因，React 实现了功能更完备的 requestIdleCallbackpolyfill，这就是 Scheduler。除了在空闲时触发回调的功能外，Scheduler 还提供了多种调度优先级供任务设置。

> Scheduler 是独立于 React 的库

#### Reconciler（协调器）

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

在 React16 中，Reconciler 与 Renderer 不再是交替工作。当 Scheduler 将任务交给 Reconciler 后，Reconciler 会为变化的虚拟 DOM 打上代表增/删/更新的标记，类似这样：

```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

> 全部的标记见[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js)

整个 Scheduler 与 Reconciler 的工作都在内存中进行。只有当所有组件都完成 Reconciler 的工作，才会统一交给 Renderer。

> 你可以在[这里](https://zh-hans.reactjs.org/docs/codebase-overview.html#fiber-reconciler)看到 React 官方对 React16 新 Reconciler 的解释

#### Renderer（渲染器）

Renderer 根据 Reconciler 为虚拟 DOM 打的标记，同步执行对应的 DOM 操作。

所以，对于我们在上一节使用过的 Demo

在 React16 架构中整个更新流程为：

![](res/2021-01-20-14-11-01.png)

其中红框中的步骤随时可能由于以下原因被中断：

- 有其他更高优任务需要先更新
- 当前帧没有剩余时间

由于红框中的工作都在内存中进行，不会更新页面上的 DOM，所以即使反复中断，用户也不会看见更新不完全的 DOM（即上一节演示的情况）。

> 由于 Scheduler 和 Reconciler 都是平台无关的，所以 React 为他们单独发了一个包 react-Reconciler。你可以用这个包自己实现一个 ReactDOM，具体见参考资料

### 总结

通过本节我们知道了 React16 采用新的 Reconciler。

Reconciler 内部采用了 Fiber 的架构。

Fiber 是什么？他和 Reconciler 或者说和 React 之间是什么关系？我们会在接下来三节解答。

## Fiber 架构的心智模型

React 核心团队成员 Sebastian Markbåge（React Hooks的发明者）曾说：我们在 React 中做的就是践行代数效应（Algebraic Effects）。

那么，代数效应是什么呢？他和 React 有什么关系呢。

### 什么是代数效应

代数效应是函数式编程中的一个概念，用于将副作用从函数调用中分离。

接下来我们用虚构的语法来解释。

假设我们有一个函数 getTotalPicNum，传入 2 个用户名称后，分别查找该用户在平台保存的图片数量，最后将图片数量相加后返回。

```js
function getTotalPicNum(user1, user2) {
  const num1 = getPicNum(user1);
  const num2 = getPicNum(user2);

  return picNum1 + picNum2;
}
```

在 getTotalPicNum 中，我们不关注 getPicNum 的实现，只在乎“获取到两个数字后将他们相加的结果返回”这一过程。

接下来我们来实现 getPicNum。

"用户在平台保存的图片数量"是保存在服务器中的。所以，为了获取该值，我们需要发起异步请求。

为了尽量保持 getTotalPicNum 的调用方式不变，我们首先想到了使用 async await

```js
async function getTotalPicNum(user1, user2) {
  const num1 = await getPicNum(user1);
  const num2 = await getPicNum(user2);

  return picNum1 + picNum2;
}
```

但是，async await 是有传染性的 —— 当一个函数变为 async 后，这意味着调用他的函数也需要是 async，这破坏了 getTotalPicNum 的同步特性。

有没有什么办法能保持 getTotalPicNum 保持现有调用方式不变的情况下实现异步请求呢？

没有。不过我们可以虚构一个。

我们虚构一个类似 try...catch 的语法 —— try...handle 与两个操作符 perform、resume。

```js
function getPicNum(name) {
  const picNum = perform name;
  return picNum;
}

try {
  getTotalPicNum('kaSong', 'xiaoMing');
} handle (who) {
  switch (who) {
    case 'kaSong':
      resume with 230;
    case 'xiaoMing':
      resume with 122;
    default:
      resume with 0;
  }
}
```

当执行到 getTotalPicNum 内部的 getPicNum 方法时，会执行 perform name。

此时函数调用栈会从 getPicNum 方法内跳出，被最近一个 try...handle 捕获。类似 throw Error 后被最近一个 try...catch 捕获。

类似 throw Error 后 Error 会作为 catch 的参数，perform name 后 name 会作为 handle 的参数。

与 try...catch 最大的不同在于：当 Error 被 catch 捕获后，之前的调用栈就销毁了。而 handle 执行 resume 后会回到之前 perform 的调用栈。

对于 `case 'kaSong'`，执行完 `resume with 230;` 后调用栈会回到 getPicNum，此时 `picNum === 230`

> 注意  
> 再次申明，try...handle 的语法是虚构的，只是为了演示代数效应的思想。

总结一下：代数效应能够将副作用（例子中为请求图片数量）从函数逻辑中分离，使函数关注点保持纯粹。

并且，从例子中可以看出，`perform resume` 不需要区分同步异步。

### 代数效应在 React 中的应用

那么代数效应与 React 有什么关系呢？最明显的例子就是 Hooks。

对于类似 useState、useReducer、useRef 这样的 Hook，我们不需要关注 FunctionComponent 的 state 在 Hook 中是如何保存的，React 会为我们处理。

我们只需要假设 useState 返回的是我们想要的 state，并编写业务逻辑就行。

```jsx
function App() {
  const [num, updateNum] = useState(0);
  
  return (
    <button onClick={() => updateNum(num => num + 1)}>{num}</button>  
  )
}
```

如果这个例子还不够明显，可以看看官方的 [Suspense Demo](https://codesandbox.io/s/frosty-hermann-bztrp?file=/src/index.js:152-160)

在 Demo 中 ProfileDetails 用于展示用户名称。而用户名称是异步请求的。

但是 Demo 中完全是同步的写法。

```jsx
function ProfileDetails() {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}
```

### 代数效应与 Generator

从 React15 到 React16，协调器（Reconciler）重构的一大目的是：将老的同步更新的架构变为异步可中断更新。

异步可中断更新可以理解为：更新在执行过程中可能会被打断（浏览器时间分片用尽或有更高优任务插队），当可以继续执行时恢复之前执行的中间状态。

这就是代数效应中 try...handle 的作用。

其实，浏览器原生就支持类似的实现，这就是 Generator。

但是 Generator 的一些缺陷使 React 团队放弃了他：

- 类似 async，Generator 也是传染性的，使用了 Generator 则上下文的其他函数也需要作出改变。这样心智负担比较重。
- Generator 执行的中间状态是上下文关联的。

考虑如下例子：

```js
function* doWork(A, B, C) {
  var x = doExpensiveWorkA(A);
  yield;
  var y = x + doExpensiveWorkB(B);
  yield;
  var z = y + doExpensiveWorkC(C);
  return z;
}
```

每当浏览器有空闲时间都会依次执行其中一个 doExpensiveWork，当时间用尽则会中断，当再次恢复时会从中断位置继续执行。

只考虑“单一优先级任务的中断与继续”情况下 Generator 可以很好的实现异步可中断更新。

但是当我们考虑“高优先级任务插队”的情况，如果此时已经完成 doExpensiveWorkA 与 doExpensiveWorkB 计算出 x 与 y。

此时 B 组件接收到一个高优更新，由于 Generator 执行的中间状态是上下文关联的，所以计算 y 时无法复用之前已经计算出的 x，需要重新计算。

如果通过全局变量保存之前执行的中间状态，又会引入新的复杂度。

> 更详细的解释可以参考[这个issue](https://github.com/facebook/react/issues/7942#issuecomment-254987818)

基于这些原因，React 没有采用 Generator 实现协调器。

### 代数效应与Fiber

Fiber 并不是计算机术语中的新名词，他的中文翻译叫做纤程，与进程（Process）、线程（Thread）、协程（Coroutine）同为程序执行过程。

在很多文章中将纤程理解为协程的一种实现。在 JS 中，协程的实现便是 Generator。

所以，我们可以将纤程(Fiber)、协程(Generator)理解为代数效应思想在 JS 中的体现。

React Fiber 可以理解为：

React 内部实现的一套状态更新机制。支持任务不同优先级，可中断与恢复，并且恢复后可以复用之前的中间状态。

其中每个任务更新单元为 React Element 对应的 Fiber 节点。
