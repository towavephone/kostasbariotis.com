---
title: JS检测CSS属性浏览器是否支持
date: 2019-12-11 11:36:36
categories:
  - 前端
tags: 前端, JS, JS知识点
path: /js-css-supports-detect/
---

# 原生 CSS.supports 语法

返回布尔值 true 或者 false，用来检测是否支持某 CSS 属性。

实际开发的时候，需要使用到对 CSS 检测场景，往往都是针对低版本的 IE 浏览器，例如 IE9-IE11，低版本的 IE 浏览器并不支持浏览器原生支持的 CSS.supports()方法。

```js
// CSS.supports(propertyName, value);
// CSS.supports(supportCondition);
// propertyName
// 字符串。用来检测的CSS属性名。
// value
// 字符串。用来检测的CSS属性值。
// supportCondition
// 字符串。用来检测的CSS声明、表达式或者语法。
result = CSS.supports('filter', 'blur(5px)');
result = CSS.supports('filter: 5px'); // 错误语法，返回false
result = CSS.supports('--username: zhangxinxu');
result = CSS.supports('(--username: zhangxinxu)');
// 支持逻辑表达，注意括号是必须的，这里语法错误，返回false
result = CSS.supports('width: fit-content or width: -webkit-fit-content');
result = CSS.supports('(width: fit-content) or (width: -webkit-fit-content)');
```

# JS 赋值再取值的检测方法

当浏览器不支持某个 CSS 属性的时候，就算你强制设置，获取的计算值也不会是你设置的属性值

```js
document.head.style.filter = 'blur(5px)';
// 注意，这里为了兼容到IE9+用了getComputedStyle方法
result = window.getComputedStyle(document.head).filter == 'blur(5px)';
// 如果是带私有前缀，正则匹配关键部分
document.head.style.width = 'fit-content';
document.head.style.width = '-moz-fit-content';
result = /fit-content/.test(window.getComputedStyle(document.head).width);
```

## 注意点

getComputedStyle()方法返回的是计算值，很多时候和设置的属性值并不同。

例如设置行高为小数，在 IE 浏览器下返回就是 px 计算值。

又或者设置 background 属性值，结果返回的是 background 兄弟姐妹一大家子值：

```js
document.head.style.background = 'paint(abc)';
result = /paint/.test(window.getComputedStyle(document.head).background);
// result值是true
window.getComputedStyle(document.head).background;
// "rgba(0, 0, 0, 0) paint(abc) repeat scroll 0% 0% / auto padding-box border-box"
```

需要使用模糊匹配才行。

# 其他方法

同赋值取值法

```js
document.head.setAttribute('style', 'filter: blur(5px)');
result = !!document.head.style.filter;
```

# 总结

不考虑兼容性，对 CSS 的进行检测使用 CSS.supports()方法，要检测 IE 浏览器使用赋值取值法。
