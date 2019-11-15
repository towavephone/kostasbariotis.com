---
title: 移动端适配汇总
path: /mobile-adaptation-summary/
date: 2019-11-15 10:29:38
tags: 前端, 移动端, 兼容性
---

# IOS fix 定位不准

现象：在有输入框的情况下尽量不要用 fixed 定位，用 absolute，否则在 IOS 下会出现很多问题，比如输入法收起时 fixed 定位的元素其实还在未收起的地方，会造成在输入法收起时输入框不能点击

解决方案：当然在用 absolute 的时候，需要注意 body、html 的定位（设置为relative或者不设），放在 body 的下面等等问题

# 微信下 IOS13 输入法不恢复到原来的位置

现象：在 IOS13 系统下，点击输入框弹出输入法，再收起输入法时会发现输入法回去了，整个页面留下输入法的空白，上下滑动一下布局恢复正常

解决方案：在微信端的输入法键盘收起时滑动一下页面

```js
let currentPosition;
const speed = 1;// 页面滚动距离
const timer = setInterval(() => {
  currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
  currentPosition -= speed;
  window.scrollTo(0, currentPosition);// 页面向上滚动
  currentPosition += speed; // speed变量
  window.scrollTo(0, currentPosition);// 页面向下滚动
  clearInterval(timer);
}, 1);
```

# 移动端输入法收起时布局不恢复

现象：移动端网站打开输入法后再收起输入法，此时还会保持在打开输入法时的布局

解决方案：在输入法键盘收起时将窗口置为初始位置

```js
setTimeout(() => {
  if (document.body) {
    document.body.scrollTop = 0;
  }
}, 100);
```

# IOS 第三方输入法会遮挡（不完美）

现象：IOS 第三方输入法比如搜狗，打开输入法时工具栏会遮挡输入框

解决方案：在输入法键盘打开时，强制滚动到输入框的焦点，此方案在移动端浏览器会造成布局的错乱

```js
// 会造成移动端bug，暂时不用
const timer = setInterval(function () {
  element.scrollIntoView(true);
  clearInterval(timer);
}, 100);
```

持续更新。。。

