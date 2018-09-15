---
title: CSS世界内联元素与流
date: 2018-8-27 17:13:27
path: /CSS-world-inline-element-flow/
tags: 前端, CSS, CSS世界
---

块级元素负责结构，内联元素接管内容，而 CSS 世界是面向图文混排，也就是内联元素设计的，由此可见，本章内容在整个 CSS 世界体系中占有非常重要的位置。

# 字母 x —— CSS 世界中隐匿的举足轻重的角色

## 字母 x 与 CSS 世界的基线

在各种内联相关模型中，凡是涉及垂直方向的排版或者对齐的，都离不开最基本的基线
（baseline）。例如，line-height 行高的定义就是两基线的间距，vertical-align 的默认
值就是基线，其他中线顶线一类的定义也离不开基线，基线甚至衍生出了很多其他基线概念（如
图 5-1 所示）。

![](2018-08-27-17-19-48.png)

字母 x 的下边缘（线）就是我们的基线。

![](2018-08-27-17-23-29.png)

## 字母 x 与 CSS 中的 x-height

CSS 中有一个概念叫作 x-height，指的是字母 x 的高度，术语描述就是基线和等分线（mean line）（也称作中线，midline）之间的距离。

![](2018-08-27-17-26-53.png)

- ascender height: 上行线高度。
- cap height: 大写字母高度。
- median: 中线。
- descender height: 下行线高度。

CSS 中有些属性值的定义就和这个 x-height 有关，最典型的代表就是 vertical-align:middle，这里的 middle 是中间的意思。注意，跟上面的 median（中线）不是一个意思。在 CSS 世界中，middle 指的是基线往上 1/2 x-height 高度。我们可以近似理解为字母 x 交叉点那个位置。

由此可见，vertical-align:middle 并不是绝对的垂直居中对齐，我们平常看到的 middle 效果只是一种近似效果，因为不同的字体在行内盒子中的位置是不一样的

## 字母 x 与 CSS 中的 ex

字母 x 衍生出了 x-height 概念，并在这个基础上深耕细作，进一步衍生出了 ex。注意，这里的 ex 是 CSS 中的一个尺寸单位。

ex 是 CSS 中的一个相对单位，指的是小写字母 x 的高度，没错，就是指 x-height。

虽然说 em、px 这类单位的主要作用是限定元素的尺寸，但是，由于字母 x 受字体等 CSS 属性影响大，不稳定，因此 ex 不太适合用来限定元素的尺寸

没错，ex 的价值就在其副业上 — 不受字体和字号影响的内联元素的垂直居中对齐效果。

内联元素默认是基线对齐的，而基线就是 x 的底部，而 1ex 就是一个 x 的高度。设想一下，假如图标高度就是 1ex，同时背景图片居中，岂不是图标和文字天然垂直居中，而且完全不受字体和字号的影响？因为 ex 就是一个相对于字体和字号的单位。

比如以下的文字后面跟着一个小三角形图标的效果

```css
.icon-arrow {
  display: inline-block;
  width: 20px;
  height: 1ex;
  background: url(arrow.png) no-repeat center;
}
```

<iframe src="/examples/code-editor.html?html=zhangxinxu%3Ci%20class%3D%22icon-arrow%22%3E%3C/i%3E%0A%0A%u5F20%u946B%u65ED%3Ci%20class%3D%22icon-arrow%22%3E%3C/i%3E&css=.icon-arrow%20%7B%0A%20%20%20%20display%3A%20inline-block%3B%0A%20%20%20%20width%3A%2020px%3B%0A%20%20%20%20height%3A%201ex%3B%0A%20%20%20%20background%3A%20url%28/images/5/arrow.png%29%20no-repeat%20center%3B%0A%7D" width="400" height="200"></iframe>

# 内联元素的基石 line-height

下文中所有的“行高”指的就是 line-height

## 内联元素的高度之本 — line-height

默认空`<div>`高度是 0，但是一旦里面写上几个文字，`<div>`高度就有了，请问这个高度由何而来，或者说是由哪个 CSS 属性决定的？

本质上是由 line-height 属性全权决定的，尽管某些场景确实与font-size 大小有关。

例如：

```html
<div class="test1">我的高度是？</div>
<style>
.test1 {
  font-size: 16px;
  line-height: 0;
  border: 1px solid #ccc;
  background: #eee;
}
</style>
```

和

```html
<div class="test2">我的高度是？</div>
<style>
.test1 {
  font-size: 0;
  line-height: 16px;
  border: 1px solid #ccc;
  background: #eee;
}
</style>
```

这两段代码的区别在于一个 line-height 行高为 0，一个 font-size 字号为 0。结果，第一段代码，最后元素的高度只剩下边框那么丁点儿，而后面一段代码，虽然文字小到都看不见了，但是 16px 的内部高度依然坚挺

![](2018-09-15-17-42-22.png)

对于非替换元素的纯内联元素，其可视高度完全由 line-height 决定，也就是什么 padding、border 属性对可视高度是没有任何影响的，这也是我们平常口中的“盒模型”约定俗成说的是块级元素的原因

因此，对于文本这样的纯内联元素，line-height 就是高度计算的基石，用专业说法就是指定了用来计算行框盒子高度的基础高度。比方说，line-height 设为 16px，则一行文字高度是 16px，两行就是 32px，三行就是 48px，所有浏览器渲染解析都是这个值，1 像素都不差

line-height 在替换元素，又或者是块级元素的作用：

行距 = line-height - font-size