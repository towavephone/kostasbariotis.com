---
title: html与body的一些特性
date: 2019-12-31 11:07:41
categories:
  - 前端
tags: 前端, CSS, CSS知识点
path: /html-body-some-feature/
---

# 背景色

一般情况下，我们 css 控制的最高节点就是 body，例如设置：

```css
body {
  background: #069;
}
```

body 作为一个根节点起作用了，`<html>`标签未被激活，body 担当类似于根节点的节点，其 background 背景色被浏览器俘获，浏览器界面背景色为 background 的背景色

```css
body {
  background: #069;
  margin: 100px;
  border: 30px solid #093;
}
```

按照对一般标签的理解，100 像素的外边距应该不含有背景色的，然而显示的结果是（Firefox 下表现与此类似）：

![](2019-12-31-11-12-34.png)

一旦设置了`<html>`节点的 background 背景色之后，`<body>`的背景色将失效。例如下面的简短代码：

```css
html {
  background: #999;
}

body {
  background: #069;
  margin: 100px;
  border: 30px solid #093;
}
```

![](2019-12-31-11-13-45.png)

此时的`<html>`标签最顶级，背景色被浏览器获取，成为浏览器的背景色。

# margin 支持

IE6 浏览器下 html 对 margin 不敏感不支持，Firefox 浏览器下 html 标签支持 margin 外边距

# 滚动条

```css
html {
  overflow-y: scroll;
}
```

可以让 IE 和 Firefox（包括 chrome）浏览器默认产生滚动条的滚动槽了。

# background 的 fixed 固定定位

Firefox 是支持 background:fixed 定位的，IE6 只能说是半支持，就是背景图片固定的效果似乎只在根结点起作用。举个很简单的例子：

```css
body {
  background: url(../image/404.png) no-repeat fixed center center;
}

div {
  height: 2000px;
}
```

```html
<body>
  <div></div>
</body>
```

其结果是无论 IE6 还是火狐浏览器下，背景图片都是固定的死死的，不错。但是，一旦`<html>`标签带着 background 属性掺和进来，事情就要发生转变了。问题代码：

```css
html {
  background: white;
}

body {
  background: url(../image/404.png) no-repeat fixed center center;
}

div {
  height: 2000px;
}
```

结果 IE6 下，背景不固定了，只看到背景图片随着滚动条上下移动而移动，IE11 下背景图片随着滚动条上下而抖动。

要解决这个问题呢，也是有办法的，就是将 fixed 属性值转移到 html 标签上就可以了。即：

```css
html {
  background: white url(../image/404.png) no-repeat fixed center center;
}

div {
  height: 2000px;
}
```

# height:100%

要想高度百分比起作用，一般来说，要满足两个条件：其一，父标签有高度可寻，就是向上遍历父标签要找到一个定值高度（body，html 另外讨论），如果中途有个 height 为 auto 或是没有设置 height 属性，则高度百分比不起作用；其二，标签本身的属性，如果 inline 属性的标签，如果没有浮动，zoom，或是绝对定位之类属性是不支持百分比高度的，block 或 inline-block 属性可以说是高度百分比起作用的前提条件之一吧。

而这里要讲的是关于 body 和 html 的高度百分比显示的。

默认状态下，`<body>`不是高度 100%显示的，不要看`<body>`定义 background 属性好像`<body>`就是满屏显示的，正如上面所推断的，此背景已非`<body>`之背景。用下面这个一测便知。

```css
body {
  background: #039;
  border: 50px solid #c00;
}
```

看边框范围是否高度 100%显示，答案是否定的。见下图（截自 IE6，Firefox 浏览器下表现一致）：

![](2019-12-31-11-53-12.png)

要想让 Firefox 浏览器也支持`<body>`的 height:100%是简单的，就是设置`<html>`标签 height:100%，一旦设置了 height:100%则无论哪个浏览器下`<body>`都支持 height:100%了，而`<body>`内部的容器也可以支持 height:100%了。

透明层无论滚动与否都满屏显示，其实就是对`<html>`和`<body>`标签做一番手脚，两者高度 100%显示，同时溢出隐藏（overflow:hidden），然后用一个`<div>`高度 100%显示，溢出滚动。而这个透明层就使用绝对定位且与这个`<div>`平级，高宽 100%显示，就可以使得无论怎么滚动这个透明覆盖层都是满屏显示的。这其实也就解决 IE6 下浮动层固定定位的经典方法。

# body overflow

单纯如下 body overflow 是无法隐藏高度不足一屏的元素的，例如：

```css
body {
  height: 30px;
  overflow: hidden;
}
body > div {
  height: 300px;
  background-color: #cd0000;
}
```

此时 body 的子元素 div 依然保持 300px 高度的显示，如果想要隐藏，需要设置 html 的 overflow:hidden。

并不是说 body overflow 无效，而是 body 天然的 overflow 计算容器是一屏高度，因此，如果 div 高度很高，例如 3000px：

```css
body > div {
  height: 3000px;
  background-color: #cd0000;
}
```

大家可以看到 body 的子元素 div 也就显示了屏幕的高度。
