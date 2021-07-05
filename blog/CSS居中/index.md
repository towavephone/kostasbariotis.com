---
title: CSS居中设置
path: /css-center/
date: 2017-11-20 23:01:05
tags: 前端, CSS, 居中
---

# 水平居中设置-行内元素

> - 如果被设置元素为文本、图片等行内元素时，水平居中是通过给父元素设置 <code>text-align:center</code> 来实现的。

# 水平居中设置-定宽块状元素

> - 满足定宽和块状两个条件的元素是可以通过设置<code>左右 margin</code>值为<code>auto</code>来实现居中的。

# 水平居中总结-不定宽块状元素方法

> - 加入 <code>table</code> 标签

```css
 {
  display: table;
  margin: 0 auto;
}
```

> - 改变块级元素的<code>display</code>为<code>inline</code>类型（设置为<code>行内元素</code>显示），然后使用<code>text-align:center</code>来实现居中效果
> - 通过给父元素设置<code>float</code>，然后给父元素设置<code>position:relative</code>和<code>left:50%</code>，子元素设置 <code>position:relative</code>和<code>left: -50%</code>来实现水平居中。

# 垂直居中-父元素高度确定的单行文本

> - 通过设置父元素的<code>height</code>和<code>line-height</code>高度一致来实现的。(<code>height</code>: 该元素的高度，<code>line-height</code>: 顾名思义，行高（行间距），指在文本中，行与行之间的基线间的距离 )。

# 垂直居中-父元素高度确定的多行文本

> - 使用插入<code>table</code>(包括<code>tbody、tr、td</code>)标签，同时设置 <code>vertical-align：middle</code>。
> - 或者采用以下样式

```css
 {
  display: table-cell;
  vertical-align: middle;
}
```

# 隐性改变 display 类型

> - <code>position : absolute </code>
> - <code>float : left 或 float:right </code>
> - 只要<code>html</code>代码中出现以上两句之一，元素的<code>display</code>显示类型就会自动变为以 <code>display:inline-block</code>（块状元素）的方式显示，当然就可以设置元素的 <code>width</code> 和 <code>height</code> 了，且默认宽度不占满父元素。
