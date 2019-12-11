---
title: CSS not伪类用法一览
date: 2019-12-11 22:34:10
categories:
- 前端
tags: 前端, CSS, CSS知识点
path: /css-not-pseudo-class/
---

# 优先级

如果对所有CSS伪类的优先级（也就是我们常说的选择器权重）进行分类，你会发现总共只有两个级别，0级和10级。

>0级指没有优先级，1级是标签选择器，10级是类选择器，属性选择器，100级是ID选择器。

伪类，伪类，既然带有“类”字，自然其优先级好类选择器一致。

但是，其中有个特殊，那就是逻辑伪类的优先级都是0。例如：:not()，:is()，:where()等。

逻辑伪类整个选择器语句的优先级是由括号里面内容决定的，不同的逻辑伪类规则不一样，其中:not()伪类的本身没有优先级，最终优先级是由括号里面的选择器决定的。

```css
:not(.disabled) {}    /* 优先级等同于.disabled选择器 */
:not(a) {}    /* 优先级等同于a选择器 */
```

# 复杂选择器的支持

:not()逻辑伪类出身很早，早到IE9浏览器都支持，不像现在的新出来的逻辑选择器，:not()伪类括号里面并不支持复杂的选择器（虽然新的规范已经让支持了，目前还没有浏览器跟进）。

```css
:not(.disabled, .read-only) {}    /* 无效，不支持 */
:not(.disabled), :not(.read-only) {}
:not(a.disabled) {}    /* 无效，不支持 */
:not(a):not(.disabled) {}
```

# 否定逻辑关系

## 连续否定的逻辑错误

如果我们想要匹配既不包含.disabled类名，又不包含.read-only类名的`<input>`元素，我们的选择器该如何书写，很多人会使用下面的CSS代码：

```css
input:not(.disabled),
input:not(.read-only) {}
```

逗号分隔的选择器，表示的是“或”的关系，而不是“与”的关系。因此input:not(.disabled), input:not(.read-only)表示的含义是：不包含.disabled类名的`<input>`元素，或者不包含.read-only类名的`<input>`元素。

最后导致的结果是.disabled类名和.read-only类名元素都会匹配。

例如：

```html
<!-- 均会匹配 -->
<input class="disabled">
<input class="read-only">
```

因为`<input class="disabled">`虽然不会匹配input:not(.disabled)，但是会匹配input:not(.read-only)，导致出现了不希望出现的匹配效果。

这里，正确的书写方法应该是：

```css
input:not(.disabled):not(.read-only) {}
```

## 全局否定的逻辑错误

例如我们希望除了`<article>`标签下的`<p>`元素的margin值都是0，我们代码该怎么写。

很多人会这样书写：

```css
:not(article) p {
    margin: 0;
}
```

看上去没有问题，实际上问题非常严重，:not(article) p实际语义是，如果`<p>`元素的祖先元素的标签名不是article，则margin值是0。

其中就包括这样的场景：

```html
<article>
    <section>
        <p>margin此时也是0！<p>
    </section>
</article>
```

此时，虽然`<p>`元素在`<article>`元素内，但是，由于同时也在`<section>`元素内，于是匹配了:not(article) p这个选择器，导致出现意料之外的样式表现。

正确的书写应该是：

```css
p {
    margin: 0;
}
article p {
    margin: 1em 0;
}
```

在这种场景下，:not伪类是无解的。

除非强制层级元素，也就是`<p>`元素是`<article>`的相邻子元素元素，此时我们可以使用下面CSS满足我们需求，不过限制很大，建议还是使用传统重置策略：

```css
:not(article) > p {
    margin: 0;
}
```
