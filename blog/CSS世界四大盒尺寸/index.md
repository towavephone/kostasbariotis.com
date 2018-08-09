---
title: CSS世界四大盒尺寸
date: 2018-8-1 22:49:14
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

box-shadow以及outline属于前者，而这里的inline元素的padding层叠属于后者；区分方式很简单，如果父容器overflow:auto，层叠区域超出父容器的时候没有滚动条出现，则是纯视觉的；反之则会影响尺寸，影响布局

### 内联元素padding的应用

#### 增加可点击区域

在不影响当前布局的情况下，增加可点击区域的大小，为了在移动端更好的点击，增加垂直方向上的padding高度

#### 实现高度可控的分隔线

使用`|`高度会不可控，如果对视觉要求比较高，需要用CSS模拟

<iframe src="/examples/inline-padding-realize-pipe.html" width="400" height="100"></iframe>

`embed:inline-padding-realize-pipe.html`

#### 锚点定位时希望标题与页面顶部有距离

试试使用内联元素，块级元素设置padding-top:50px会影响布局，但是内联元素不会

假设这是原来的实现：

```html
<h3 id="hash">标题</h3>
<style>
h3 {
    line-height: 30px;
    font-size: 14px;
}
</style>
```

可以改为：

```html
<h3><span id="hash">标题</span></h3>
<style>
h3 {
    line-height: 30px;
    font-size: 14px;
}

h3>span {
    padding-top:58px;
}
</style>
```

如果h3设置了overflow:hidden，则IE浏览器会定位在h3标签位置

实际上，对于非替换元素的内联元素，不仅padding不会加入到行盒高度的计算，margin和border也是如此，但实际上在内联盒周围发生了渲染

## padding的百分比值

1. padding属性不支持负值，margin支持
2. 支持百分比值，无论在水平还是垂直方向都是相对于宽度计算的，与height等属性的计算规则不同

>可能要按照高度计算的话大多数情况为0，还不如按相对宽度计算，因为CSS默认的是水平流，计算值会一直有效

### 应用场景

#### 实现不同比例的矩形效果

```css
div{padding: 50%;} 
div{padding: 25% 50%;}
```

#### 小屏幕头图高度等比例缩小

```css
.box{
    padding: 10% 50%;
    position: relative;
}
.box>img{
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
}
```

实现了一个宽高比为5:1的比例固定的头图效果

以上百分比值是应用在具有块状特性的元素上的，如果是内联元素则表现为

- 同样对于宽度计算
- 默认的高度与宽度细节有差异
- padding会断行

### 内联元素的padding断行

```html
<style>
.box {
    border: 2px dashed #cd0000;
}
span {
    padding:50%;
    background-color: gray;
}
</style>
<div class="box">
    <span>内有文字若干</span>
</div>
```

![](./Snipaste_2018-08-02_22-49-19.png)

![](./Snipaste_2018-08-02_22-52-52.png)

效果如上图所示，诡异之处有：

1. 内字不见了
2. 有文字若居右显示
3. 背景区域非矩形，右下角缺了一块
4. 背景色宽度与外部容器宽度不一致

对于内联元素，其padding是会断行的，也就是padding区域是跟着内联盒模型中的行框盒子走的，上面的例子由于文字比较多，一行显示不了，于是干字换到下一行，于是原本的padding区域也跟着一起掉下来，根据后来居上的层叠规则，内字正好被覆盖，于是看不见了；同时，规则的矩形区域因为换行，也变成了五条边；至于宽度和外部容器盒子不一样宽，因为有6个字实际宽度是容器宽度和这6个字的总和，换行后的宽度和容器宽度一样的概率很小。

还有一种情况是假如是空的内联元素，里面没有任何文字，仅有一个span标签：

```html
<style>
.box {
    border: 2px dashed #cd0000;
}
span {
    padding:50%;
    background-color: gray;
}
</style>
<div class="box">
    <span />
</div>
```

![](./Snipaste_2018-08-02_23-14-57.png)

此时会发现宽高度不相等，原因是因为幽灵空白节点的显现

由于内联元素的高度完全受font-size大小控制，只要如下方法宽高即可一致

```css
span {
    padding: 50%;
    font-size: 0;
    background-color: gray;
}
```

## 标签元素内置的padding

1. ol、ul列表内置padding-left单位是px不是em，导致字体比较大时项目符号可能跑到ol、ul外面，当然用content计数器模拟是更好的选择
2. 很多表单元素都内置padding

- 所有浏览器input、textarea输入框内置padding
- 所有浏览器button按钮内置padding
- 部分浏览器select下拉内置padding
- 所有浏览器redio、checkbox单复选框无内置padding
- button按钮元素的padding最难控制
  1. 设置padding: 0不同浏览器下不同
  2. 按钮padding与高度计算不同浏览器下千差万别，这使得很少用原生的button

有一个可以保留良好的语义，同时UI效果兼容性效果好的实现小技巧，那就是label元素

```html
<button id="btn"></button> 
<label for="btn">按钮</label> 
<style>
button { 
    position: absolute; 
    clip: rect(0 0 0 0); 
} 
label { 
    display: inline-block; 
    line-height: 20px; 
    padding: 10px;
} 
</style>
```

## padding与图形绘制

padding 属性和 background-clip 属性配合，可以在有限的标签下实现一些 CSS 图形
绘制效果

### 不使用伪元素，仅一层标签实现大队长的“三道杠”分类图标效果

```css
.icon-menu {
    display: inline-block;
    width: 140px; 
    height: 10px;
    padding: 35px 0;
    border-top: 10px solid;
    border-bottom: 10px solid;
    background-color: currentColor;
    background-clip: content-box;
}
```

### 不使用伪元素，仅一层标签实现双层圆点效果

```css
.icon-dot {
    display: inline-block;
    width: 100px; 
    height: 100px;
    padding: 10px;
    border: 10px solid;
    border-radius: 50%;
    background-color: currentColor;
    background-clip: content-box;
}
```

![](./Snipaste_2018-08-08_20-21-04.png)

# 激进的 margin 属性

padding 性格温和，负责内间距；而 margin 则比较激进，负责外间距。虽然都是间距，
但是差别相当大，尤其是 margin，特异之处相当多。

## margin 与元素尺寸以及相关布局

### 元素尺寸的相关概念

- 元素尺寸: 对应 jQuery 中的 `$().width()` 和 `$().height()` 方法，包括 padding 和 border，也就是元素的border box的尺寸。在原生的DOM API中写作 offsetWidth 和 offsetHeight，所以，有时候也成为“元素偏移尺寸”。
- 元素内部尺寸：对应 jQuery 中的 `$().innerWidth()` 和 `$().innerHeight()` 方法，表示元素的内部区域尺寸，包括 padding 但不包括 border，也就是元素的 paddingbox 的尺寸。在原生的 DOM API 中写作 clientWidth 和 clientHeight，所以，有时候也称为“元素可视尺寸”。
- 元素外部尺寸：对应 jQuery 中的 `$().outerWidth(true)` 和 `$().outerHeight(true)` 方法，表示元素的外部尺寸，不仅包括 padding 和 border，还包括 margin，也就是元素的 margin box 的尺寸。没有相对应的原生的 DOM API

“外部尺寸”有个很不一样的特性，就是尺寸的大小有可能是负数。

### margin 与元素的内部尺寸

margin 同样可以改变元素的可视尺寸，但是和 padding 几乎是互补态势

对于 padding，元素设定了 width 或者保持“包裹性”的时候，会改变元素可视尺寸；但是对于 margin 则相反，元素设定了 width 值或者保持“包裹性”的时候，margin 对尺寸没有影响，只有元素是“充分利用可用空间”状态的时候，margin 才可以改变元素的可视尺寸

只要元素的尺寸表现符合“充分利用可用空间”，无论是垂直方向还是水平方向，都可以通过 margin 改变尺寸。

CSS 世界默认的流方向是水平方向，因此，对于普通流体元素，margin 只能改变元素水
平方向尺寸；但是，对于具有拉伸特性的绝对定位元素，则水平或垂直方向都可以，因为此时
的尺寸表现符合“充分利用可用空间”。

#### 如果图片左侧定位

```html
<style>
.box { overflow: hidden; }
.box > img { float: left; }
.box > p { margin-left: 140px; }
</style>
<div class="box">
    <img src="1.jpg">
    <p>文字内容...</p>
</div>
```

#### 如果图片右侧定位

```css
.box { overflow: hidden; }
.box > img { float: right; }
.box > p { margin-right: 140px; }
```

html文件标签的顺序与视觉表现上的不一致，这个可以借助margin负值实现

#### 如果图片右侧定位，同时顺序一致

```html
<style>
.box { overflow: hidden; }
.full { width: 100%; float: left; }
.box > img { 
    float: left; // 必须有这个属性，否则看不到元素
    margin-left: -128px; 
}
.full > p { margin-right: 140px; }
</style>
<div class="box">
    <div class="full">
        <p>文字内容...</p>
    </div>
    <img src="1.jpg">
</div>
```

#### margin 改变元素尺寸的特性来实现两端对齐布局效果

列表块两端对齐，一行显示 3 个，中间有 2 个 20 像素的间隙

假如我们使用浮动来实现：

```css
li {
    float: left;
    width: 100px;
    margin-right: 20px;
}
```

![](./Snipaste_2018-08-08_21-33-38.png)

最右侧永远有个 20 像素的间隙, 无法完美实现两端对齐

解决办法：

- 不考虑 IE8，我们可以使用 CSS3 的 nth-of-type 选择器：

```css
li:nth-of-type(3n) {
    margin-right: 0;
}
```

- 考虑IE8，给父容器添加 margin 属性，增加容器的可用宽度来实现

```css
ul {
    margin-right: -20px;
}
ul > li {
    float: left;
    width: 100px;
    margin-right: 20px;
}
```

此时`<ul>`的宽度就相当于 100%+20px，于是，第 3n 的`<li>`标签的 margin-right:20px 就多了 20 像素的使用空间，正好列表的右边缘就是父级`<ul>`容器 100% 宽度位置，两端对齐效果就此实现了

![](./Snipaste_2018-08-08_21-43-25.png)

### margin 与元素的外部尺寸

对于普通块状元素，在默认的水平流下，margin 只能改变左右方向的内部尺寸，垂直方向则无法改变。如果我们使用 writing-mode 改变流向为垂直流，则水平方向内部尺寸无法改变，垂直方向可以改变。这是由 margin:auto 的计算规则决定的。

对于外部尺寸，margin 属性的影响则更为广泛，只要元素具有块状特性，无论有没有设置 width/height，无论是水平方向还是垂直方向，即使发生了 margin 合并，margin 对外部尺寸都着着实实发生了影响

#### margin-bottom 外部尺寸实现滚动容器的底部留白

padding也有兼容性问题，如果容器可以滚动，在 IE 和 Firefox 浏览器下是会忽略 padding-bottom 值的，Chrome 等浏览器则不会。也就是说，在 IE 和 Firefox 浏览器下：

```html
<div style="height:100px; padding:50px 0;">
    <img src="0.jpg" height="300">
</div>
```

本质区别在于：Chrome 浏览器是子元素超过 content box 尺寸触发滚动条显示，而 IE 和 Firefox 浏览器是超过 padding box 尺寸触发滚动条显示

可以借助 margin 的外部尺寸特性来实现底部留白，只能使用子元素的 margin-bottom 来实现滚动容器的底部留白

```html
<div style="height:200px;">
    <img height="300" style="margin:50px 0;">
</div>
```

#### margin 外部尺寸实现等高布局

使用margin负值实现：

```css
.column-box {
    overflow: hidden;
}
.column-left,
.column-right {
    margin-bottom: -9999px;
    padding-bottom: 9999px;
}
```

为什么可以等高的原因:

垂直方向 margin 无法改变元素的内部尺寸，但却能改变外部尺寸，这里我们设置了 margin-bottom:-9999px 意味着元素的外部尺寸在垂直方向上小了 9999px。默认情况下，垂直方向块级元素上下距离是0，一旦 margin-bottom:-9999px 就意味着后面所有元素和上面元素的空间距离变成了-9999px，也就是后面元素都往上移动了 9999px。此时，通过神来一笔padding-bottom:9999px 增加元素高度，这正负一抵消，对布局层并无影响，但却带来了我们需要的东西 — 视觉层多了 9999px 高度的可使用的背景色。但是，9999px 太大了，所以需要配合父级 overflow:hidden 把多出来的色块背景隐藏掉，于是实现了视觉上的等高布局效果。

不足之处：

1. 如果需要有子元素定位到容器之外，父级的 overflow:hidden 是一个棘手的限制
2. 当触发锚点定位或者使用DOM.scrollIntoview()方法的时候，可能就会出现奇怪的定位问题

使用 border 和 table-cell 实现等高布局的优缺点：

前者优势在于兼容性好，没有锚点定位的隐患，不足之处在于最多 3 栏，且由于 border 不支持百分比宽度，因此只能实现至少一侧定宽的布局；table-cell 的优点是天然等高，不足在于 IE8 及以上版本浏览器才支持，所以，如果项目无须兼容 IE6、IE7，则推荐使用 table-cell 实现等高布局

上述margin对尺寸的影响是针对具有块状特性的元素而言的，对于纯内联元素则不适用。和 padding 不同，内联元素垂直方向的 margin 是没有任何影响的，既不会影响外部尺寸，也不会影响内部尺寸，对于水平方向，由于内联元素宽度表现为“包裹性”，也不会影响内部尺寸。

## margin 的百分比值