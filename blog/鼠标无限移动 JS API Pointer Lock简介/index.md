---
title: 鼠标无限移动 JS API Pointer Lock简介
date: 2019-12-21 15:57:19
categories:
  - 前端
tags: 前端, JS, JS知识点
path: /js-api-pointer-lock/
---

# 简介

Pointer Lock API 可以让你的鼠标无限移动，脱离浏览器窗体的限制！

# API

- 3 个属性  
  Document.pointerLockElement  
  Document.onpointerlockchange  
  Document.onpointerlockerror
- 2 个方法  
  Element.requestPointerLock()  
  Document.exitPointerLock()
- 2 个事件  
  pointerlockchange  
  pointerlockerror

其中，2 个事件和其中 2 个属性是一一对应的，因此，我们实际上需要了解的知识点是下面这些： Document.pointerLockElement，以及 Element.requestPointerLock()，Document.exitPointerLock()以及 pointerlockchange 和 pointerlockerror 事件。

## Document.pointerLockElement

指当前页面触发鼠标无限滚动的元素，通常使用语法为：

```js
var element = document.pointerLockElement;
```

返回的是一个 DOM 元素对象，如果当前页面是非鼠标锁定状态，则返回值是 null。

## Element.requestPointerLock()

可以让页面进入鼠标锁定状态（鼠标直接消失），鼠标无限滚动，坐标无限变化。通常使用语法为：

```js
var element.requestPointerLock();
```

## Document.exitPointerLock()

让页面从鼠标锁定状态退出，通常使用语法为：

```j
document.exitPointerLock();
```

浏览器默认支持按下 ESC 键退出鼠标锁定状态，但是用户有时候更习惯于点击取消等，此时就可以使用 document.exitPointerLock()进行设置。

## pointerlockchange 事件

当页面鼠标锁定状态改变的时候触发。例如：

```js
document.addEventListener(
  'pointerlockchange',
  function() {
    // ...
  },
  false
);
```

## pointerlockerror 事件

当页面鼠标锁定失败的时候触发。例如当你试图同时锁定同一个页面的多个`<iframe>`时候，就会触发这个出错事件。

## 应用

<iframe src="/examples/js-api-pointer-lock/demo.html" width="400" height="100"></iframe>

`embed:js-api-pointer-lock/demo.html`

原理大致如下：

点击图片，执行 eleImage.requestPointerLock()让页面进入鼠标锁定状态，此时会触发 pointerlockchange 事件，于是，给页面绑定鼠标移动改变图片旋转的方法，为了避免重复绑定，我们借助 document.pointerLockElement 判断页面的锁定状态。最后，为了方便取消页面的锁定状态，我们在页面上绑定了点击事件，通过 document.exitPointerLock()取消页面的锁定状态。

需要说明的：

event.movementX 和 event.movementY 表示每次 mousemove 事件触发时候，距离上次移动的水平和垂直位置大小，而不是具体的某个坐标值。因此，需要和初始坐标不断的累加确定当前移动位置。

# 兼容性

最后说下 Pointer Lock API 的兼容性。

由于 Pointer Lock API 是与鼠标相关的 API，因此所有移动端都不支持，因为没有必要支持。

对于桌面浏览器，Chrome，Firefox 以及 Edge 浏览器都是支持的，并且现在使用可以不加私有前缀，直接走起。IE 并不支持，但这并不妨碍我们进行增强使用 Pointer Lock API。
