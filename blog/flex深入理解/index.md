---
title: flex深入理解
date: 2019-12-23 11:02:19
categories:
  - 前端
tags: 前端, CSS, CSS知识点
path: /css-flex-deep/
---

# 语法

```css
flex: none | auto | [ < 'flex-grow' > < 'flex-shrink' >? || < 'flex-basis' > ];
```

# 语法解构

CSS 语法中的特殊符号的含义绝大多数就是正则表达式中的含义，例如单管道符|，方括号[]，问号？，个数范围花括号{}等。具体说明：

首先是单管道符|。表示或者。也就是这个符号前后的属性值都是支持的。因此，下面这些语法都是支持的：

```css
flex: auto;
flex: none;
flex: [ < 'flex-grow' > < 'flex-shrink' >? || < 'flex-basis' > ];
```

接下来是[ ... ]这一部分。其中方括号`[]`表示范围。也就是支持的属性值在这个范围内。我们先把方括号`[]`内其他特殊字符去除，可以得到下面的语法：

```css
flex: auto;
flex: none;
flex: [ < 'flex-grow' > < 'flex-shrink' > < 'flex-basis' > ];
```

这就是说，flex 属性值支持空格分隔的 3 个值，因此，下面的语法都是支持的。

```css
flex: auto;
flex: none;
/* 3个值 */
flex: 1 1 100px;
```

然后我们再看方括号[]内的其他字符，例如问号?，表示 0 个或 1 个。也就是 flex-shrink 属性可有可无。因此，flex 属性值也可以是 2 个值。因此，下面的语法都是支持的。

```css
flex: auto;
flex: none;
/* 2个值 */
flex: 1 100px;
/* 3个值 */
flex: 1 1 100px;
```

然后我们再看双管道符||，也是独立的意思。表示前后可以分开独立合法使用。也就是 flex: flex-grow flex-shrink 和 flex-basis 都是合法的。于是我们又多了 2 种合法的写法：

```css
flex: auto;
flex: none;
/* 1个值，flex-grow */
flex: 1;
/* 1个值，flex-basis */
flex: 100px;
/* 2个值，flex-grow和flex-basis */
flex: 1 100px;
/* 2个值，flex-grow和flex-shrink */
flex: 1 1;
/* 3个值 */
flex: 1 1 100px;
```

# 关键字属性值

## initial

初始值。flex:initial 等同于设置"flex: 0 1 auto"。可以理解为 flex 属性的默认值。

## auto

flex:auto 等同于设置"flex: 1 1 auto"。

## none

flex:none 等同于设置"flex: 0 0 auto"。

# flex 分配规则

## flex-grow

flex-grow 指定了容器剩余空间多余时候的分配规则，默认值是 0，多余空间不分配。

## flex-shrink

flex-grow 指定了容器剩余空间不足时候的分配规则，默认值是 1，空间不足要分配。

## flex-basis

flex-basis 则是指定了固定的分配数量，默认值是 auto。如会忽略设置的同时设置 width 或者 height 属性。

# 应用

```
范张，范鑫和范旭每人100万固定家产，范帅和范哥则20万保底家产。如果范闲归西那天家产还有富余，范帅和范哥按照3:2比例分配；如果没有剩余财产，则范张，范鑫和范旭三位兄长按照2:1:1的比例给两人匀20万保底家产。
```

<iframe src="/examples/css-flex-deep/demo.html" width="400" height="100"></iframe>

`embed:css-flex-deep/demo.html`
