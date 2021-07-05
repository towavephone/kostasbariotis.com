---
title: JS前端创建html或json文件并浏览器导出下载
date: 2019-12-15 19:55:53
categories:
  - 前端
tags: 前端, JS, JS知识点
path: /js-text-string-download-as-html-json-file/
---

# HTML 与文件下载

如果希望在前端侧直接触发某些资源的下载，最方便快捷的方法就是使用 HTML5 原生的 download 属性，例如：

```html
<a href="large.jpg" download>下载</a>
```

但显然，如果纯粹利用 HTML 属性来实现文件的下载（而不是浏览器打开或浏览），对于动态内容，就无能为力。

例如，我们对页面进行分享的时候，希望分享图片是页面内容的实时截图，此时，这个图片就是动态的，纯 HTML 显然是无法满足我们的需求的，借助 JS 和其它一些 HTML5 特性，例如，将页面元素转换到 canvas 上，然后再转成图片进行下载。

但本文要介绍的下载不是图片的下载，而是文本信息的下载，所需要使用的 HTML 特性不是 canvas，而是其它。

# 借助 HTML5 Blob 实现文本信息文件下载

原理其实很简单，我们可以将文本或者 JS 字符串信息借助 Blob 转换成二进制，然后，作为`<a>`元素的 href 属性，配合 download 属性，实现下载。

代码也比较简单，如下示意（兼容 Chrome 和 Firefox）：

```js
var funDownload = function(content, filename) {
  // 创建隐藏的可下载链接
  var eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  var blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};
```

其中，content 指需要下载的文本或字符串内容，filename 指下载到系统中的文件名称。

# 借助 Base64 实现任意文件下载

对于非文本文件，也是可以直接 JS 触发下载的，例如，如果我们想下载一张图片，可以把这张图片转换成 base64 格式，然后下载。

代码示意：

```js
var funDownload = function(domImg, filename) {
  // 创建隐藏的可下载链接
  var eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  // 图片转base64地址
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var width = domImg.naturalWidth;
  var height = domImg.naturalHeight;
  context.drawImage(domImg, 0, 0);
  // 如果是PNG图片，则canvas.toDataURL('image/png')
  eleLink.href = canvas.toDataURL('image/jpeg');
  // 触发点击，这里为了兼容Firefox加了appendChild方法
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};
```

# 总结

不止是.html 文件，.txt, .json 等只要内容是文本的文件，都是可以利用这种小技巧实现下载的。

在 Chrome 浏览器下，模拟点击创建的`<a>`元素即使不 append 到页面中，也是可以触发下载的，但是在 Firefox 浏览器中却不行，因此，上面的 funDownload()方法有一个 appendChild 和 removeChild 的处理，就是为了兼容 Firefox 浏览器。

当然，有时对 canvas 图片进行 toDataURL 操作时，会存在跨域问题的报错，具体见[解决 canvas 图片 getImageData,toDataURL 跨域问题](/crossorigin-canvas-getimagedata-cors/)
