---
title: HTML5 file API加canvas实现图片前端JS压缩并上传
date: 2020-1-16 11:56:48
categories:
  - 前端
tags: 前端, JS, JS知识点
path: /html5-canvas-image-compress-upload/
---

# 图片上传前端压缩的现实意义

对于大尺寸图片的上传，在前端进行压缩除了省流量外，最大的意义是极大的提高了用户体验。

这种体验包括两方面：

1. 由于上传图片尺寸比较小，因此上传速度会比较快，交互会更加流畅，同时大大降低了网络异常导致上传失败风险。
2. 最最重要的体验改进点：省略了图片的再加工成本。很多网站的图片上传功能都会对图片的大小进行限制，尤其是头像上传，限制 5M 或者 2M 以内是非常常见的。然后现在的数码设备拍摄功能都非常出众，一张原始图片超过 2M 几乎是标配，此时如果用户想把手机或相机中的某个得意图片上传作为自己的头像，就会遇到因为图片大小限制而不能上传的窘境，不得不对图片进行再处理，而这种体验其实非常不好的。如果可以在前端进行压缩，则理论上对图片尺寸的限制是没有必要的。

# 图片前端 JS 压缩并上传功能体验

<iframe src="/examples/html5-canvas-image-compress-upload/js-compress-image-before-upload.html" width="400" height="200"></iframe>

`embed:html5-canvas-image-compress-upload/js-compress-image-before-upload.html`

# 加 canvas 实现图片前端 JS 压缩

要想使用 JS 实现图片的压缩效果，原理其实很简单，核心 API 就是使用 canvas 的 drawImage()方法，见 [使用 canvas 在前端实现图片水印合成](/canvas-picture-watermark-synthesis/)

## 如何把系统中图片呈现在浏览器中？

HTML5 file API 可以让图片在上传之前直接在浏览器中显示，通常使用 FileReader 方法，代码示意如下：

```js
var reader = new FileReader(),
  img = new Image();
// 读文件成功的回调
reader.onload = function(e) {
  // e.target.result就是图片的base64地址信息
  img.src = e.target.result;
};
eleFile.addEventListener('change', function(event) {
  reader.readAsDataURL(event.target.files[0]);
});
```

于是，包含图片信息的 context.drawImage()方法中的 img 图片就有了。

## 如何把 canvas 画布转换成 img 图像

canvas 天然提供了 2 个转图片的方法，一个是：

### canvas.toDataURL()方法

语法如下：

```js
canvas.toDataURL(mimeType, qualityArgument);
```

可以把图片转换成 base64 格式信息，纯字符的图片表示法。

其中：

mimeType 表示 canvas 导出来的 base64 图片的类型，默认是 png 格式，也即是默认值是'image/png'，我们也可以指定为 jpg 格式'image/jpeg'或者 webp 等格式。file 对象中的 file.type 就是文件的 mimeType 类型，在转换时候正好可以直接拿来用（如果有 file 对象）。

qualityArgument 表示导出的图片质量，只要导出为 jpg 和 webp 格式的时候此参数才有效果，默认值是 0.92，是一个比较合理的图片质量输出参数，通常情况下，我们无需再设定。

### canvas.toBlob()方法

语法如下：

```js
canvas.toBlob(callback, mimeType, qualityArgument);
```

可以把 canvas 转换成 Blob 文件，通常用在文件上传中，因为是二进制的，对后端更加友好。

和 toDataURL()方法相比，toBlob()方法是异步的，因此多了个 callback 参数，这个 callback 回调方法默认的第一个参数就是转换好的 blob 文件信息，本文 demo 的文件上传就是将 canvas 图片转换成二进制的 blob 文件，然后再 ajax 上传的，代码如下：

```js
// canvas转为blob并上传
canvas.toBlob(function(blob) {
  // 图片ajax上传
  var xhr = new XMLHttpRequest();
  // 开始上传
  xhr.open('POST', 'upload.php', true);
  xhr.send(blob);
});
```

于是，经过“图片 →canvas 压缩 → 图片”三步曲，我们完成了图片前端压缩并上传的功能。
