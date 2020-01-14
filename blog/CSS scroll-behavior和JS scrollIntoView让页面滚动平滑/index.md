---
title: CSS scroll-behavior和JS scrollIntoView让页面滚动平滑
date: 2020-1-14 10:55:12
path: /css-js-scroll-smooth/
tags: 前端, CSS, CSS知识点
---

假设页面中有下面这一段HTML：

```html
<a href="#" rel="internal">返回顶部</a>
```

点击“返回顶部”这个文字链接的时候，页面就会“唰”地瞬间定位到浏览器顶部。

浏览器已经开始支持原生平滑滚动定位，CSS scroll-behavior属性和JS scrollIntoView()方法都可以。

# CSS scroll-behavior与平滑滚动

scroll-behavior:smooth写在滚动容器元素上，可以让容器（非鼠标手势触发）的滚动变得平滑。

语法

```css
scroll-behavior: auto;
scroll-behavior: smooth;
```

初始值是'auto'。

凡是需要滚动的地方都加一句scroll-behavior:smooth就好了！

举个例子，在PC浏览器中，网页默认滚动是在`<html>`标签上的，移动端大多数在`<body>`标签上，于是，我加上这么一句：

```css
html,
body {
  scroll-behavior:smooth;
}
```

# JS scrollIntoView与平滑滚动

DOM元素的scrollIntoView()方法是一个IE6浏览器也支持的原生JS API，可以让元素进入视区，通过触发滚动容器的定位实现。

随着Chrome和Firefox浏览器开始支持CSS scroll-behavior属性，顺便对scrollIntoView()方法进行了升级，使支持更多参数，其中一个参数就是可以使滚动平滑。

语法如下：

```js
target.scrollIntoView({
  behavior: "smooth"
});
```

我们随便打开一个有链接的页面，把首个链接滚动到屏幕外，然后控制台输入类似下面代码，我们就可以看到页面平滑滚动定位了：

```js
document.links[0].scrollIntoView({
  behavior: "smooth"
});
```

## 其他

- scrollIntoView()升级后的方法，除了支持'behavior'，还有'block'和'inline'等参数，有兴趣可以参阅MDN相关文档。
- 如果我们的网页已经通过CSS设置了scroll-behavior:smooth 声明，则我们直接执行target.scrollIntoView()方法就会有平滑滚动，无需再额外设置behavior参数。
    ```js
    document.forms[0].scrollIntoView();
    ```

# JS平滑滚动向下兼容处理

JS实现平滑滚动并不难，jQuery中animate()方法：

```js
scrollContainer.animate({
  scrollTop: 0
});
```

或者使用requestAnimationFrame API这类原生JS也能实现。例如下面这个我速写的个方法：

```js
/**
 @description 页面垂直平滑滚动到指定滚动高度
 @author zhangxinxu(.com)
*/
var scrollSmoothTo = function (position) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      return setTimeout(callback, 17);
    };
  }
  // 当前滚动高度
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  // 滚动step方法
  var step = function () {
      // 距离目标滚动距离
      var distance = position - scrollTop;
      // 目标滚动位置
      scrollTop = scrollTop + distance / 5;
      if (Math.abs(distance) < 1) {
        window.scrollTo(0, position);
      } else {
        window.scrollTo(0, scrollTop);
        requestAnimationFrame(step);
      }
  };
  step();
};
```

使用的是缓动动画JS小算法，滚动先快后慢。

使用如下，例如我们希望网页平滑滚动到顶部，直接：

```js
scrollSmoothTo(0);
```

难的是如何支持平滑滚动的浏览器原生处理，不支持的浏览器还是使用老的JS方法处理。

```js
if (typeof window.getComputedStyle(document.body).scrollBehavior == 'undefined') {
   // 传统的JS平滑滚动处理代码...
}
```
