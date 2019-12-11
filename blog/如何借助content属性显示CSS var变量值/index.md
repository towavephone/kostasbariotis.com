---
title: 如何借助content属性显示CSS var变量值
date: 2019-12-11 22:53:34
categories:
- 前端
tags: 前端, CSS, CSS知识点
path: /content-css-var/
---

# 变量作为字符动态呈现

CSS var变量（CSS自定义属性）很好用，然后，有时候，需要这些变量能够同时作为字符在页面中呈现，我们想到的是使用::before/::after伪元素配合content属性，但是，把CSS变量直接作为content属性值是没有任何效果的。

```css
/* 无效 */
.bar::before {
    content: var(--percent);
}
```

# 借助CSS计数器呈现CSS var变量值

```css
/* 有效 */
.bar::before {
    counter-reset: progress var(--percent);
    content: counter(progress);
}
```

也就是虽然content属性本身不支持变量，但是counter-reset属性后面的计数器初始值是支持的

# 实际应用案例展示

例如我们需要实现一个进度条效果，已经加载完成了部分的宽度百分比值和进度值是一样的，最好可以通过一个变量控制，这样会大大简化我们的实现。

此时，CSS var变量非常适合使用。

```html
<label>图片1：</label>
<div class="bar" style="--percent: 60;"></div>
<label>图片2：</label>
<div class="bar" style="--percent: 40;"></div>
<label>图片3：</label>
<div class="bar" style="--percent: 20;"></div>
```

关键是CSS，这里就应用了这里的CSS变量值呈现技巧，见下面代码红色高亮部分：

```css
.bar {
    height: 20px; width: 300px;
    background-color: #f5f5f5;
}
.bar::before {
    display: block;
    counter-reset: progress var(--percent);
    content: counter(progress) '%\2002';
    width: calc(1% * var(--percent));
    color: #fff;
    background-color: #2486ff;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
}
```
