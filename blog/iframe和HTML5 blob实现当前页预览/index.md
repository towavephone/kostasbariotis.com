---
title: iframe和HTML5 blob实现当前页预览
date: 2019-12-11 11:53:26
categories:
- 前端
tags: 前端, JS, JS知识点
path: /iframe-html5-blob-code-view/
---

# 实现方式

通常会新建一个另外的独立页面，专门用来接收传入的前端代码，通过新开窗口或者嵌入iframe页面的方式达到最终效果，其中可能会用到HTML5 postMessage等通信技术。

然而实际上，对于这个预览效果，如果代码是我们自己控制，而不是全权交给用户编辑的，是没有必要新建一个另外的预览页面，亦或者是在新窗口（新标签页）中浏览的。可以直接在当前页面构建一个文档上下文，实现更加方便快捷的预览。

# 核心原理

```js
// 1. 创建<iframe>元素
var iframe = document.createElement('iframe');
// 2. 将CSS，HTML字符串转换为Blob对象
var blob = new Blob([htmlCode], {
  'type': 'text/html'
});
// 3. 使用URL.createObjectURL()方法将Blob对象转换为URL对象并赋予我们创建的<iframe>元素
iframe.src = URL.createObjectURL(blob);
```

需要注意的是，当我们使用 new Blob() 对我们的字符数据进行转换的时候，一定要指定type为text/html，否则，HTML代码会被自动转移为安全的纯文本显示在`<iframe>`元素中。

# 兼容性

IE浏览器遗憾并不支持src直接是URL对象。

所以此技术只适用于对兼容性没有严格要求的一些项目。

# 结束语

其实很多效果，我们直接在结束当前页面的window上下文预览也没什么，但是有一些效果就不行，例如，预览针对响应式布局的media屏幕宽度查询下的效果，必须是真实的窗体宽度才会触发CSS查询语句的执行，此时，只能在`<iframe>`中预览，我们只要把`<iframe>`元素宽度设置到我们需要的大小就可以了，例如，需要预览类似如下CSS代码效果：

```css
@media screen and (max-width:480px) {
    img { max-width: 100%; }
}
```

只要设置`<iframe>`元素宽度为480像素就可以了。
