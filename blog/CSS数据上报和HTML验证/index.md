---
title: CSS数据上报和HTML验证
date: 2019-12-16 22:55:12
categories:
- 前端
tags: 前端, CSS, CSS知识点
path: /css-data-report-html-validate/
---

# 纯CSS实现数据上报

举个例子，要跟踪并统计某个按钮的点击事件：

```css
.button-1:active::after {
  content: url(./pixel.gif?action=click&id=button1);
  display: none;
}
.button-2:active::after {
  content: url(./pixel.gif?action=click&id=button2);
  display: none;
}
```

此时，当我们点击按钮的时候，相关行为数据就会上报给服务器，这种上报，就算把JS禁掉也无法阻止。

点击页面的两个按钮，可以看到发出了如下的请求：

![](2019-12-16-22-57-12.png)

当然，我们可以统计的不仅仅是单击行为，hover行为，focus行为都可以统计，当然，还有很多其他方面的。例如：

## 不支持CSS3浏览器比例统计

```css
.any-element {
  background: url(./pixel.gif?css=2);
  background-image: url(./pixel.gif?css=3), none;
}
```

例如，我的Chrome发出的图片请求地址就是：

![](2019-12-16-22-58-08.png)

类似的，我们可以检测支持其他一些CSS属性的比例，要比单纯看浏览器的占比要精准的多。因为同样是Chrome浏览器，不同用户版本可能不一样，要想准确知道某些CSS新特性支持情况，这种CSS上报方法要更准确。

可以使用@supports规则。

```css
.any-element {
  background: url(./pixel.gif?grid=0);
}
@supports (display: grid) {
  .any-element {
    background: url(./pixel.gif?grid=1);
  }
}
```

## retina屏幕占比统计

要么上报0，要么上报1，最后可以知道retina屏幕的比例。

```css
.any-element {
  background: url(./pixel.gif?retina=0);
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .any-element {
    background: url(./pixel.gif?retina=1);
  }
}
```
