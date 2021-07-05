---
title: 使用canvas在前端实现图片水印合成
date: 2020-1-16 11:11:39
categories:
  - 前端
tags: 前端, JS, JS知识点
path: /canvas-picture-watermark-synthesis/
---

图片合成最常见的需求有验证码图片，亦或者图片加水印等，这种实现一般都是后端实现的。

随着 HTML5 发展和现代浏览器的占比越来越高，我们其实也可以在前端直接进行图片的合成。优点在于，响应更快，体验更好；如果是和文字进行合成，我们可以利用客户端字体，视觉展现效果更丰富；同时展示和合成全部都是前端完成，因此更利于维护。

这里通过举个例子，演示如何在前端实现多个图片合成的效果，主要是借助 HTML5 canvas 相关技术。

# 使用 canvas 在前端实现图片水印合成

如果仅仅是普通的合成，例如一个底图和一个 PNG 水印图片合成，直接使用 canvas 的 drawImage()方法即可，语法如下：

```js
context.drawImage(img, x, y);
context.drawImage(img, x, y, width, height);
context.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
```

各个参数示意为：

| 参数    | 描述                                                                                      |
| :------ | :---------------------------------------------------------------------------------------- |
| img     | 用来被绘制的图像、画布或视频。                                                            |
| sx      | 可选。img 被绘制区域的起始左上 x 坐标。                                                   |
| sy      | 可选。img 被绘制区域的起始左上 y 坐标。                                                   |
| swidth  | 可选。img 被绘制区域的宽度（如果没有后面的 width 或 height 参数，则可以伸展或缩小图像）。 |
| sheight | 可选。img 被绘制区域的高度（如果没有后面的 width 或 height 参数，则可以伸展或缩小图像）。 |
| x       | 画布上放置 img 的起始 x 坐标。                                                            |
| y       | 画布上放置 img 的起始 y 坐标。                                                            |
| width   | 可选。画布上放置 img 提供的宽度（可能会有图片剪裁效果）。                                 |
| height  | 可选。画布上放置 img 提供的高度（可能会有图片剪裁效果）。                                 |

而 PNG 水印图片的合成，直接连续在使用 drawImage()把对应的图片绘制到 canvas 画布上就可以，原理就是这么简单。

<iframe src="/examples/canvas-picture-watermark-synthesis/js-canvas-image-watermark-synthesis.html" width="400" height="200"></iframe>

`embed:canvas-picture-watermark-synthesis/js-canvas-image-watermark-synthesis.html`

# 使用 canvas 实现更为复杂的图片合成

具有透明背景的水印图片合成是 canvas 图片合成中最基本最简单的，如果遇到更为复杂的合成，例如各取 50%透明度进行合成，或者经典的 mix-blend-mode 混合模式的，此时可能就需要借助算法来实现了。

原理为，使用 HTML5 canvas getImageData()方法获取图片完整的像素点信息，通过混合算法，对多个图片的像素信息进行合成，合并，重计算，最后把新的图片像素信息通过 putImageData()方法重新绘制到画布上，从而实现更为复杂的图片合成效果。

其中，getImageData()方法返回 ImageData 对象，该对象拷贝了画布指定矩形的像素数据。

ImageData 中有个 data 属性，这个属性是个巨大的数组，而这个数组每四个值为一组，分别对应图片中的每个像素的 RGBA 值，值范围如下：

R – 红色 (0-255) G – 绿色 (0-255) B – 蓝色 (0-255) A – alpha 通道 (0-255; 0 是透明的，255 是完全可见的)

只要对这些数字进行重新处理，再 putImageData()重新放到画布上，图像的效果就会发生变化。
