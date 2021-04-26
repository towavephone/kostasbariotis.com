---
title: 微前端框架qiankun源码笔记
categories:
  - 前端
tags: 前端, 微前端
path: /qiankun-code-note/
date: 2021-4-26 18:36:06
---

# 定义

`微前端`是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将单页面前端应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。各个前端应用还可以独立开发、独立部署。同时，它们也可以在共享组件的同时进行并行开发——这些组件可以通过 NPM 或者 Git Tag、Git Submodule 来管理。

qiankun（乾坤） 就是一款由蚂蚁金服推出的比较成熟的微前端框架，基于 single-spa 进行二次开发，用于将 Web 应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。（见下图）

# 目的

1. js 沙箱：子应用之间互不影响
2. css 隔离：子应用之间样式互不影响，切换时加载与卸载
3. HTML Entry: Config Entry 的进阶版，简化开发者使用，但是把解析消耗留给了用户
4. Config Entry: 配置每个子应用的 js 和 css，包含内联的部分
5. 按需加载：切换页面才加载相应的 html、css、js
6. 公共依赖加载: 大部分公共的依赖加载
7. 预加载: 空闲时加载子应用资源，需要用户行为数据支持
8. 父子应用通讯: 子应用如何调用父应用方法，父应用如何下发状态
9. 子应用嵌套: 微前端如何嵌套微前端
10. 子应用并行: 多个微前端同时存在

# 核心

1. js 沙箱
2. css 样式隔离
3. 应用 html 入口接入
4. 应用通信
5. 应用路由

# 技术介绍

## js 沙箱

JS 沙箱简单点说就是，主应用有一套全局环境 window，子应用有一套私有的全局环境 fakeWindow，子应用所有操作都只在新的全局上下文中生效，这样的子应用好比被一个个箱子装起来与主应用隔离，因此主应用加载子应用便不会造成 JS 变量的相互污染、JS 副作用、CSS 样式被覆盖等，每个子应用的全局上下文都是独立的。

### 快照沙箱（snapshotSandbox）

快照沙箱就是在应用沙箱挂载和卸载的时候记录快照，在应用切换的时候依据快照恢复环境。

#### 实现

```js
// snapshotSandbox.ts
// 遍历对象key并将key传给回调函数执行
function iter(obj: object, callbackFn: (prop: any) => void) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      callbackFn(prop);
    }
  }
}

// 挂载快照沙箱
mountSnapshotSandbox() {
  // 记录当前快照
  this.windowSnapshot = {} as Window;
  iter(window, (prop) => {
    this.windowSnapshot[prop] = window[prop];
  });

  // 恢复之前的变更
  Object.keys(this.modifyPropsMap).forEach((p: any) => {
    window[p] = this.modifyPropsMap[p];
  });
}
// 卸载快照沙箱  
unmountSnapshotSandbox() {
  // 记录当前快照上改动的属性
  this.modifyPropsMap = {};

  iter(window, (prop) => {
    if (window[prop] !== this.windowSnapshot[prop]) {
      // 记录变更，恢复环境
      this.modifyPropsMap[prop] = window[prop];
      window[prop] = this.windowSnapshot[prop];
    }
  });
}

// 子应用A
mountSnapshotSandbox();
window.a = 123;
console.log('快照沙箱挂载后的a:', window.a); // 123
unmountSnapshotSandbox();
console.log('快照沙箱卸载后的a:', window.a); // undefined
mountSnapshotSandbox();
console.log('快照沙箱再次挂载后的a:', window.a); // 123
```

#### 优点

兼容几乎所有浏览器

#### 缺点

无法同时有多个运行时快照沙箱，否则在 window 上修改的记录会混乱，一个页面只能运行一个单实例微应用

### 代理沙箱（proxySandbox）

当有多个实例的时候，比如有 A、B 两个应用，A 应用就活在 A 应用的沙箱里面，B 应用就活在 B 应用的沙箱里面，A 和 B 无法互相干扰，这样的沙箱就是代理沙箱，这个沙箱的实现思路其实也是通过 ES6 的 proxy，通过代理特性实现的。

Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。简单来说就是，可以在对目标对象设置一层拦截。无论对目标对象进行什么操作，都要经过这层拦截

#### Proxy vs Object.defineProperty

Object.defineProperty 也能实现基本操作的拦截和自定义，那为什么用 Proxy 呢？因为 Proxy 能解决以下问题：

- 删除或者增加对象属性无法监听到
- 数组的变化无法监听到（vue2 正是使用的 Object.defineProperty 劫持属性，watch 中无法检测数组改变）

#### 实现

```js
// proxySandbox.ts
function CreateProxySandbox(fakeWindow = {}) {
  const _this = this;
  _this.proxy = new Proxy(fakeWindow, {
    set(target, p, value) {
      if (_this.sandboxRunning) {
        target[p] = value;
      }

      return true;
    },
    get(target, p) {
      if (_this.sandboxRunning) {
        return target[p];
      }
      return undefined;
    },
  });

  _this.mountProxySandbox = () => {
    _this.sandboxRunning = true;
  }

  _this.unmountProxySandbox = () => {
    _this.sandboxRunning = false;
  }
}

const proxyA = new CreateProxySandbox({});
const proxyB = new CreateProxySandbox({});

proxyA.mountProxySandbox();
proxyB.mountProxySandbox();

(function(window) {
  window.a = 'this is a';
  console.log('代理沙箱 a:', window.a); // this is a
})(proxyA.proxy);

(function(window) {
  window.b = 'this is b';
  console.log('代理沙箱 b:', window.b); // this is b
})(proxyB.proxy);

proxyA.unmountProxySandbox();
proxyB.unmountProxySandbox();

(function(window) {
  console.log('代理沙箱 a:', window.a); // undefined
})(proxyA.proxy);

(function(window) {
  console.log('代理沙箱 b:', window.b); // undefined
})(proxyB.proxy);
```

#### 优点

- 可同时运行多个沙箱
- 不会污染 window 环境

#### 缺点

- 不兼容 ie
- 在全局作用域上通过 var 或 function 声明的变量和函数无法被代理沙箱劫持，因为代理对象 Proxy 只能识别在该对象上存在的属性，通过 var 或 function 声明声明的变量是开辟了新的地址，自然无法被 Proxy 劫持，比如

  ```js
  const proxy1 = new CreateProxySandbox({});
  proxy1.mountProxySandbox();
  (function(window) {
    var a = 'this is proxySandbox1';
    function b() {};
    console.log('代理沙箱1挂载后的a, b:', window.a, window.b); // undefined undefined
  })(proxy1.proxy)

  proxy1.unmountProxySandbox();
  (function(window) {
    console.log('代理沙箱1卸载后的a, b:', window.a, window.b); // undefined undefined
  })(proxy1.proxy)
  ```

  一种解决方案是不用 var 和 function 声明全局变量和全局函数，比如

  ```js
  var a = 1; // 失效
  a = 1; // 有效
  window.a = 1; // 有效

  function b() {} // 失效
  b = () => {} // 有效
  window.b = () => {} // 有效
  ```

## css 样式隔离

### 简介

页面中有多个微应用时，要确保 A 应用的样式不会影响 B 应用的样式，就需要对应用的样式采取隔离。

### 动态样式表（Dynamic Stylesheet）

对应的 style 标签样式表切换

### 工程化手段（BEM、CSS Modules、CSS in JS）

通过一系列约束和编译时生成不同类名、JS 中处理 CSS 生成不同类名来解决隔离问题

### Shadow DOM

Shadow DOM 允许将隐藏的 DOM 树附加到常规的 DOM 树中——它以 shadow root 节点为起始根节点，在这个根节点的下方，可以是任意元素，和普通的 DOM 元素一样，隐藏的 DOM 样式和其余 DOM 是完全隔离的，类似于 iframe 的样式隔离效果。

> 移动端框架 Ionic 的组件样式隔离就是采用的 Shadow DOM 方案，保证相同组件的样式不会冲突。

#### 实现

```html
<!DOCTYPE html>
<html lang="en">
  <body data-qiankun-A>
    <h5>样式隔离：</h5>
    <p class="title">一行文字</p>

    <script src="scopedCSS.js"></script>
    <script src="index.js"></script>
  </body>
</html>
```

```js
// index.js
var bodyNode = document.getElementsByTagName('body')[0];
openShadow(bodyNode);
```

```js
// scopedCss.js
function openShadow(domNode) {
  var shadow = domNode.attachShadow({ mode: 'open' });
  shadow.innerHTML = domNode.innerHTML;
  domNode.innerHTML = "";
}
```

#### 优点

完全隔离 CSS 样式

#### 缺点

在使用一些弹窗组件的时候（弹窗很多情况下都是默认添加到了 document.body）这个时候它就跳过了阴影边界，跑到了主应用里面，样式就丢了

### 运行时转换样式（runtime css transformer）

动态运行时地去改变 CSS，比如 A 应用的一个样式 `p.title`，转换后会变成 `div[data-qiankun-A] p.title`，`div[data-qiankun-A]` 是微应用最外层的容器节点，故保证 A 应用的样式只有在 `div[data-qiankun-A]` 下生效。

#### 实现

```html
<!-- index.html -->
<html lang="en">
  <head>
    <style>
      p.title {
        font-size: 20px;
      }
    </style>
  </head>
  <body data-qiankun-A>
    <p class="title">一行文字</p>
    
    <script src="scopedCSS.js"></script>
    <script>
      var styleNode = document.getElementsByTagName('style')[0];
      scopeCss(styleNode, 'body[data-qiankun-A]');
    </script>
  </body>
</html>
```

```js
// scopedCSS.js
function scopeCss(styleNode, prefix) {
  const css = ruleStyle(styleNode.sheet.cssRules[0], prefix);
  styleNode.textContent = css;
}

function ruleStyle(rule, prefix) {
  const rootSelectorRE = /((?:[^\w\-.#]|^)(body|html|:root))/gm;

  let { cssText } = rule;

  // 绑定选择器, a,span,p,div { ... }
  cssText = cssText.replace(/^[\s\S]+{/, (selectors) =>
    selectors.replace(/(^|,\n?)([^,]+)/g, (item, p, s) => {
      // 绑定 div,body,span { ... }
      if (rootSelectorRE.test(item)) {
        return item.replace(rootSelectorRE, (m) => {
          // 不要丢失有效字符 如 body,html or *:not(:root)
          const whitePrevChars = [',', '('];

          if (m && whitePrevChars.includes(m[0])) {
            return `${m[0]}${prefix}`;
          }

          // 用前缀替换根选择器
          return prefix;
        });
      }

      return `${p}${prefix} ${s.replace(/^ */, '')}`;
    }),
  );

  return cssText;
}
```

#### 优点

- 支持大部分样式隔离需求
- 解决了 Shadow DOM 方案导致的丢失根节点问题

#### 缺点

运行时重新加载样式，会有一定性能损耗

## 清除 js 副作用

### 简介

子应用在沙箱中使用 window.addEventListener、setInterval 这些 需异步监听的全局 api 时，要确保子应用在移除时也要移除对应的监听事件，否则会对其他应用造成副作用。

### 实现

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <h5>清除window副作用：</h5>
    <button onclick="mountSandbox()">挂载沙箱并开启副作用</button>
    <button onclick="unmountSandbox(true)">卸载沙箱并关闭副作用</button>
    <button onclick="unmountSandbox()">普通卸载沙箱</button>

    <script src="proxySandbox.js"></script>
    <script src="patchSideEffects.js"></script>
    <script src="index.js"></script>
  </body>
</html>
```

```js
// patchSideEffects.js
const rawAddEventListener = window.addEventListener;
const rawRemoveEventListener = window.removeEventListener;

const rawWindowInterval = window.setInterval;
const rawWindowClearInterval = window.clearInterval;

function patch(global) {
  const listenerMap = new Map();
  let intervals = [];

  global.addEventListener = (type, listener, options) => {
    const listeners = listenerMap.get(type) || [];
    listenerMap.set(type, [...listeners, listener]);
    return rawAddEventListener.call(window, type, listener, options);
  };

  global.removeEventListener = (type, listener, options) => {
    const storedTypeListeners = listenerMap.get(type);
    if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
      storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
    }
    return rawRemoveEventListener.call(window, type, listener, options);
  };

  global.clearInterval = (intervalId) => {
    intervals = intervals.filter((id) => id !== intervalId);
    return rawWindowClearInterval(intervalId);
  };

  global.setInterval = (handler, timeout, ...args) => {
    const intervalId = rawWindowInterval(handler, timeout, ...args);
    intervals = [...intervals, intervalId];
    return intervalId;
  };

  return function free() {
    listenerMap.forEach((listeners, type) =>
      [...listeners].forEach((listener) => global.removeEventListener(type, listener)),
    );
    global.addEventListener = rawAddEventListener;
    global.removeEventListener = rawRemoveEventListener;

    intervals.forEach((id) => global.clearInterval(id));
    global.setInterval = rawWindowInterval;
    global.clearInterval = rawWindowClearInterval;
  };
}

function patchSideEffects(global) {
  return patch(global);
}
```
