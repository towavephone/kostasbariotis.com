---
title: HTML5中的download属性
date: 2019-12-15 19:36:41
categories:
  - 前端
tags: 前端, DOM, DOM知识点
path: /html-download-attribute/
---

# 简介

首先看下面这种截图：

![](2019-12-15-19-38-16.png)

如果我们想实现点击上面的下载按钮下载一张图片，你会如何实现？

我们可能会想到一个最简单的方法，就是直接按钮 a 标签链接一张图片，类似下面这样：

```html
<a href="large.jpg">下载</a>
```

但是，想法虽好，实际效果却不是我们想要的，因为浏览器可以直接浏览图片，因此，我们点击下面的“下载”链接，并是不下载图片，而是在新窗口直接浏览图片。

于是，基本上，目前的实现都是放弃 HTML 策略，而是使用，例如 php 这样的后端语言，通过告知浏览器 header 信息，来实现下载。

```js
header('Content-type: image/jpeg');
header("Content-Disposition: attachment; filename='download.jpg'");
```

然而，这种前后端都要操心的方式神烦，现在都流行前后端分离，还搅在一起太累了，感觉不会再爱了。

那有没有什么只需要前端动动指头就能实现下载的方式呢？有，就是本文要介绍的 download 属性。

例如，我们希望点击“下载”链接下载图片而不是浏览，直接增加一个 download 属性就可以：

```html
<a href="large.jpg" download>下载</a>
```

结果在 Chrome 浏览器下（FireFox 浏览器因为跨域限制无效）：

![](2019-12-15-19-41-40.png)

不仅如此，我们还可以指定下载图片的文件名：

```js
<a href='index_logo.gif' download='_5332_.gif'>
  下载
</a>
```

如果后缀名一样，我们还可以缺省，直接文件名：

```js
<a href='index_logo.gif' download='_5332_'>
  下载
</a>
```

![](2019-12-15-19-48-37.png)

# 浏览器兼容性和跨域策略

![](2019-12-15-19-49-10.png)

然而，caniuse 展示的兼容性不是很准确，主要表现在跨域策略的处理上，由于我手上没有 IE13，所以，只能对比 Chrome 浏览器和 FireFox 浏览器：

如果需要下载的资源是跨域的，包括跨子域，在 Chrome 浏览器下，使用 download 属性是可以下载的，但是，并不能重置下载的文件的命名；而 FireFox 浏览器下，则 download 属性是无效的，也就是 FireFox 浏览器无论如何都不支持跨域资源的 download 属性下载。

而如果资源是同域名的，则两个浏览器都是畅通无阻的下载，不会出现下载变浏览的情况。

![](2019-12-15-19-50-48.png)

## 是否支持 download 属性的监测

要监测当前浏览器是否支持 download 属性，一行 JS 代码就可以了，如下：

```js
var isSupportDownload = 'download' in document.createElement('a');
```

# 总结

除了图片资源，我们还可以是 PDF 资源，或者 txt 资源等等。尤其 Chrome 等浏览器可以直接打开 PDF 文件，使得此文件格式需要 download 处理的场景越来越普遍。

此 HTML 属性虽然非常实用和方便，但是兼容性制约了我们的大规模应用。

同时考虑到很多时候，需要进行一些下载的统计，纯前端的方式想要保存下载量数据，还是有些吃紧，需要跟开发的同学配合才行，还不如使用传统方法。

所以，download 属性的未来前景在哪里？当下是否可以直接加入到实际项目？还需要我们一起好好想想。其实使用 JS 实现 download 属性的 polyfill 并不难，但是，考虑到为何不所有浏览器都使用 polyfill 的方法，又觉得为了技术而技术是不太妥当的。

如果是需要用 JS 触发下载，见下一篇文章[使用 JS 让文本字符串作为 html 或 JSON 文件下载](/js-text-string-download-as-html-json-file/)
