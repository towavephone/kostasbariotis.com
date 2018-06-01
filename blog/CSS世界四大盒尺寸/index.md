---
title: CSS世界四大盒尺寸
date: 2018-5-30 21:53:03
path: /CSS-world-four-kinds-of-box/
tags: 前端, CSS, CSS世界
---
# 深入理解content

## content与替换元素

### 替换元素

- 根据外在盒子是内联还是块级，元素分为内联元素和块级元素，而根据是否具有可替换内容，我们也可以把元素分为替换元素和非替换元素
- 通过修改某个属性值呈现的内容就可以被替换的元素称为替换元素，例如img、object、video、iframe或者表单元素textarea、input

#### 特性

1. 内容外观不受页面上CSS的影响，需要类似appearance属性或者浏览器暴露的一些样式接口
2. 有自己的尺寸，在没有明确规定尺寸的情况下，video、iframe、canvas默认尺寸是300*150，img默认为0，表单元素尺寸则和浏览器有关，无统一标准
3. 在很多CSS属性上有自己的一套表现规则，比如vertical-align在非替换元素里是基线（字符x的下边缘），而替换元素中被定义成下边缘

### 替换元素默认display值

| 元素             | chrome       | Firefox      | IE           |
| :--------------- | :----------- | :----------- | :----------- |
| img              | inline       | inline       | inline       |
| iframe           | inline       | inline       | inline       |
| video            | inline       | inline       | inline       |
| select           | inline-block | inline-block | inline-block |
| input            | inline-block | inline       | inline-block |
| range file input | inline-block | inline-block | inline-block |
| hidden input     | none         | none         | none         |
| button           | inline-block | inline-block | inline-block |
| textarea         | inline-block | inline       | inline-block |

其中可以发现IE和chrome基本一致，Firefox在替换元素的内联表现有自己的想法

### 替换元素的尺寸计算规则

1. 固有尺寸：替换元素原本的尺寸
2. HTML尺寸：HTML原生属性，包括img的width和height、input的size、textarea的cols和rows
3. CSS尺寸：width和height或者max-height/min-height和max-width/min-width设置的尺寸，对应盒尺寸的content-box

优先级：CSS尺寸>HTML尺寸>固有尺寸

#### 例外情况

```html
<img>
```

以上HTML表示一个没有替换内容也没有尺寸设定的裸露的img元素，各个浏览器下的尺寸不同，IE下是`28*30`，chrome下是`0*0`，Firefox下是0*22

这个即将被异步加载的图片为了布局稳健，往往会使用一张透明的图片占位，其实按照下面的不需要占位图也可以实现，注意img没有src属性，否则依然会请求，请求当前页面数据

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>clearfix</title>
    <style>
        img{
            visibility:hidden;
        }
        img[src]{
            visibility:visible;
        }
    </style>
</head>

<body>
    <img>
</body>

</html>
```

对于Firefox浏览器，src缺省的img不是替换元素，而是普通的内联元素，此时设置宽高会无效，需要给img设置display:inline-block属性，推荐在CSS重置时提前设置

证明图片的固有尺寸无法改变，可以看到图片依然是200*200不改变

<iframe src="/examples/image-fix-size.html" width="400" height="100"></iframe>

`embed:image-fix-size.html`

通过object-fit可以改变content替换内容的适配方式，img默认适配方式是填充（fill），这就是为什么设定图片height和width会影响图片的尺寸，上例的非替换元素::before尺寸表现和object-fit:none类似，图片尺寸不受CSS控制

### 替换元素和非替换元素转换

#### src

Firefox下的`<img>`、chrome下`<img alt="任意值">`是一个普通的内联标签，成为了非替换元素；

基于伪元素的图片内容生成技术

1. 不能有src属性（证明观点的关键所在）
2. 不能使用content属性生成图片（针对chrome）
3. 需要有alt属性并有值（针对chrome）
4. Firefox下::before伪元素的content值会被无视，::after无此问题，应该与Firefox自己占用了有关

<iframe src="/examples/image-alt-show.html" width="400" height="100"></iframe>

`embed:image-alt-show.html`

#### content

img可以用content属性来生成图片

hover实现另一张图片

<iframe src="/examples/image-hover-content.html" width="400" height="100"></iframe>

`embed:image-hover-content.html`

网站名称和标志图片使用背景图，在不改变html的情况下（为了SEO）改变背景图

<iframe src="/examples/h1-content-image.html" width="400" height="100"></iframe>

`embed:h1-content-image.html`

上述的文字虽然被替换了，但在移动端Retina清晰度不足，导致图片模糊，应尽量采用svg图片

### content与替换元素关系剖析

content属性生成的对象称为"匿名替换元素"，也就是生成的替换元素

表现的特征为：

1. content生成的文本是无法选中、无法复制的、无法SEO，仅用来生成一些无关紧要的内容，如装饰性图形或序号之类
2. :empty伪类忽略content生成的内容
3. content动态生成值无法获取

<iframe src="/examples/content-empty-class.html" width="400" height="100"></iframe>

`embed:content-empty-class.html`

```css
/* 动态生成值 */
.total::after{
    content:counter(icecream);
}
```

## content内容生成技术

IE浏览器仅支持单冒号的伪元素，为了兼容性，下面内容全部使用单冒号

### content辅助元素生成

#### 清除浮动带来的影响

```css
.clear:after{
    content:'';
    display:table;/*或者是block*/
    clear:both;
}
```

#### 辅助实现两端对齐以及垂直居中、上边缘、下边缘对齐效果

<iframe src="/examples/content-auto-divide.html" width="400" height="100"></iframe>

`embed:content-auto-divide.html`

:before用于实现底对齐，:after伪元素用于辅助实现两端对齐

### content字符内容生成

#### 生成专用图标

<iframe src="/examples/content-font-face.html" width="400" height="100"></iframe>

`embed:content-font-face.html`

#### 插入换行实现某些布局或效果

```css
:after{
    /* LF字符，指代换行，还有CR指代回车 */
    content:'\A';
    white-space:pre;
}
```

#### 实现正在加载中

<iframe src="/examples/content-LF-loading.html" width="400" height="100"></iframe>

`embed:content-LF-loading.html`

1. 为什么使用dot这个元素
    - dot是自定义的一个标签元素，除了简约，语义化明显之外，更重要的是方便向下兼容，IE8不认识此标签，因此会只显示默认的3个点，对CSS代码完全忽略
2. 为什么使用::before，不用::after
    - 伪元素使用before同时display设置block，是为了在高版本浏览器下原来的3个点推到最下面，不会影响content的3行内容显示，如果使用after很难实现
3. 为什么3个点在第一行
    - 第3个点在第一行的目的在于兼容IE9浏览器，因为IE9浏览器认识dot以及before，但是不支持animation属性，所以为了IE9能正常显示，把3个点放在第一行
4. white-space为何使用的是pre-wrap
    - 效果相同，不必深究，后面会介绍

### content图片生成

直接用url功能符生成图片，虽然支持png、jpg、ico、svg以及base64，但生成的图片的宽高无法改变图片的固有尺寸，此时更多的是用background-image模拟，类似这样

```css
div:before{
    content:'';
    background:url(1.jpg);
}
```

content生成图片的意义在于base64位图片，由于它内联在CSS文件中，因此直接出现，没有尺寸为0的状态，同时无须设置display:block，不会出现页面加载的晃动情况

<iframe src="/examples/content-image-base64.html" width="400" height="100"></iframe>

`embed:content-image-base64.html`

### content 开启闭合符号生成

```css
.ask:before{
    content:'提问："';
}
.answer:before{
    content:'回答："';
}
.ask:after,.answer:after{
    content:'"';
}
```

相当于

```css
.ask{
    quotes:'提问："' '"';
}
.answer{
    quotes:'回答: "' '"';
}
.ask:before,.answer:before{
    content:open-quote;
}
.ask:after,.answer:after{
    content:close-quote;
}
```

### content attr 属性值内容生成

前面alt属性显示图片描述信息的例子，还有可以生成自定义的HTML属性

```css
.icon:before{
    content:attr(data-title);
}
```

### 深入理解content计数器

#### counter-reset

计数器重置，默认是0，可以是负数，可以多个技术器同时命名，空格分隔，还可以设置为none或inherit

```css
/* 显示23 */
.xxx{
    有两个计数器分别是wangxiaoer初始值为2，wangxiaosan初始值为3
    counter-reset:wangxiaoer 2 wangxiaosan 3;
}
```

#### counter-increment

计数器递增，值为counter-reset的1个或多个关键字，后面跟数字，表示每次递增的值，省略时默认为1

普照规则：普照源唯一（counter-reset），每普照一次（counter-increment）一次，普照源增加一次计数值

```css
/*显示3，不是2，counter-increment默认值起作用，父类普照一次*/
.counter{
    counter-reset:wangxiaoer 2;
    counter-increment:wangxiaoer;
}
.counter:before{
    content:counter(wangxiaoer);
}
```

```css
/* 显示4，父类普照1，子类普照1次 */
.counter{
    counter-reset:wangxiaoer 2;
    counter-increment:wangxiaoer;
}
.counter:before{
    content:counter(wangxiaoer);
    counter-increment:wangxiaoer;
}
```

```css
/* 显示34，子类分别普照一次，累加 */
.counter{
    counter-reset:wangxiaoer 2;
}
.counter:before,.counter:after{
    content:counter(wangxiaoer);
    counter-increment:wangxiaoer;
}
```

```css
/* 显示31 */
.counter{
    counter-reset:wangxiaoer 2 wangxiaosan 3;
    counter-increment: wangxiaoer wangxiaosan -2;
}
.counter:before{
    content:counter(wangxiaoer);
}
.counter:after{
    content:counter(wangxiaosan);
}
```

#### counter()/counters()

- counter(name,style)，style有许多值，可以支持英文字母或罗马数字（lower-roman）
- 一个content可以有多个counter方法
- counters(name,string,style)嵌套计数专用，比如子序号1.1、1.2、1.3，见打开的文章目录，就是应用此技术
- 显示cotent计数值的DOM元素一定要在counter-increment后面，否则没有计数效果

<iframe src="/examples/content-counters-catalog.html" width="400" height="100"></iframe>

`embed:content-counters-catalog.html`

### content 内容生成的混合特性

各种content内容生成可以混合在一起使用

```css
a:after{
    content:"(" attr(href) ")";
}
q:before{
    content:open-quote url(1.jpg);
}
.counter:before{
    content: counters(wangxiaoer, '-') '. '; 
}
```

# 温和的padding属性

## padding与元素尺寸

### padding与box-sizing

因为CSS默认的box-sizing是content-box，所以使用padding会增加元素尺寸，不推荐使用全局重置box-sizing:border-box方法，尽量使用之前提到的无宽度以及宽度分离的准则实现

如果设置了box-sizing:border-box，元素尺寸还是可能会变化，如果padding足够大，那么width也无能为力

```css
.box{
    width:80px;
    padding:20 60px;
    box-sizing:border-box;
}
```

则此时的width会无效，最终宽度还是120px，满足`首选最小宽度`原则

### padding在内联元素中垂直方向上的影响

上述的尺寸表现是对于具有块状特性的元素而言的，对于内联元素padding在水平和垂直方向同样会影响到布局，只不过内联元素垂直方向上的表现完全受line-height和vertical-align的影响，视觉感受上padding没有起作用，见下例说明一切

<iframe src="/examples/padding-inline-vertical.html" width="400" height="100"></iframe>

`embed:padding-inline-vertical.html`

上面只是垂直方向上发生了层叠，对上下元素的布局没有影响，类似的还有relative元素的定位、盒阴影box-shadow以及outline等

### 层叠的分类

层叠分为两类

1. 纯视觉层叠，不影响外部尺寸
2. 会影响外部尺寸

box-shadow以及outline属于前者，而这里的inline-padding属于后者；区分方式很简单，如果父容器overflow:auto，层叠区域超出父容器的时候没有滚动条出现，则是纯视觉的；反之则会影响尺寸，影响布局

### 内联元素padding的应用

#### 增加可点击区域

在不影响当前布局的情况下，增加可点击区域的大小，为了在移动端更好的点击，增加垂直方向上的padding高度

#### 实现高度可控的分隔线

使用`|`高度会不可控，如果对视觉要求比较高，需要用CSS模拟

