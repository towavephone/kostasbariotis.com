---
title: CSS世界读书笔记
date: 2018-5-18 21:33:29
path: /CSS-world-note/
tags: 前端, CSS
---
# 概述

## 流的概念
 
- CSS 世界的诞生就是为图文信息展示服务的。
- 流影响整个 CSS 世界。
- table 有着自己的世界。

## CSS3

1. 布局更为丰富
    - 移动端的崛起催生了CSS媒体查询以及响应式特性，如图片元素的 srcset 属性、 CSS 的 object-fit 属性。
    - 弹性盒子布局。
    - 格栅布局。
2. 视觉表现长足进步
    - 圆角、阴影和渐变。
    - transform 变换。
    - filter 滤镜和混合模式。
    - animation 动画。

# 专业术语

```css
.class {
    height: 99px;
    color: transparent;
}
```

## 属性

height、color代表属性

## 值

99px代表值

## 关键字

transparent，还有常见的 solid、inherit（泛关键字）

## 变量

currentColor

## 长度单位

px、em、s、ms，注意 2% 中的 % 不是长度单位，是一个完整的值。

细分下来，长度单位分为相对长度单位与绝对长度单位。

### 相对长度单位

- 相对字体长度单位，如em、ex，还有 CSS3 中的 rem 和 ch（字符 0 的宽度）。
- 相对视区长度单位，如vh、vw、vmin 和 vmax。

### 绝对长度单位

px，还有pt、cm、mm、pc。

## 功能符

值以函数的形式指定，表示颜色（rgb、hsls）、背景图片地址（url）、元素属性值、计算（calc）和过渡效果等。

## 属性值

属性冒号后面的所有内容统一称为属性值。

## 声明

属性名+属性值

## 声明块

花括号包裹的一系列声明

## 规则或规则集

选择器+声明块

## 选择器

选择器是用来瞄准目标元素的东西。

- 类选择器
- ID选择器
- 属性选择器
- 伪类选择器
- 伪元素选择器

## 关系选择器

- 后代选择器，空格连接，所有后代
- 相邻后代选择器，>连接，直接后代
- 兄弟选择器，~连接，当前元素后的兄弟元素
- 相邻兄弟选择器，+连接，当前元素相邻的兄弟元素

## @规则

@media、@font-face、@page、@support

## 未定义行为

规范顾及不到的细致末节的实现

# 流、元素与基本尺寸

<iframe src="/examples/clearfix-listitem.html" width="400" height="100"></iframe>

`embed:clearfix-listitem.html`

## 块级元素

块级元素具有换行特性，因此可以利用它配合clear属性清除浮动。

清除浮动时不会使用list-item的原因：

1. 字符比较多
2. 会出现不需要的项目符号
3. IE浏览器不支持伪元素的display值为list-item

### 为什么list-item元素会出现项目符号

- 生成了一个附加的标记盒子，专门用来放圆点、数字这些项目符号的。
- IE浏览器下伪元素不支持的原因就是无法创建这个标记盒子。

### display:inline-table的盒子是怎样组成的

<iframe src="/examples/inline-table.html" width="400" height="100"></iframe>

`embed:inline-table.html`

外面是内联盒子，里面是table盒子。

### width/height作用在哪个盒子上

是内在盒子，也就是容器盒子。

## width/height作用的具体细节

### width:auto

有以下4种宽度表现

1. 充分利用可用空间，如`<div>`、`<p>`这些元素的宽度默认100%于父级容器，叫fill-available
2. 收缩与包裹，典型代表就是浮动、绝对定位、inline-block或table元素，叫fit-content
3. 收缩到最小，最容易出现在table-layout为auto的表格中，叫min-content，如以下实例
4. 超出容器限制，例如内容很长的连续英文和数字，或内联元素被设置了white-space:nowrap，如以下实例

<iframe src="/examples/min-content.html" width="400" height="100"></iframe>

`embed:min-content.html`

<iframe src="/examples/over-container-limit.html" width="400" height="100"></iframe>

`embed:over-container-limit.html`

其中，第一个是外部尺寸，其他都是内部尺寸。

### 外部尺寸与流体特性

#### 正常流宽度

一种margin、border、padding、content自动分配水平空间的机制。

如下，这是一个对比演示，上下两个导航都有margin和padding，前者无width设置，完全借助流特性，后者宽度100%，流动性丢失，不会完全利用空间。

<iframe src="/examples/lose-flow.html" width="400" height="100"></iframe>

`embed:lose-flow.html`

#### 格式化宽度

仅出现在绝对定位中

