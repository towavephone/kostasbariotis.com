---
title: CSS世界流、元素与基本尺寸
date: 2018-5-22 12:21:01
path: /CSS-world-flow-element-size/
tags: 前端, CSS
---
# 流、元素与基本尺寸

## 块级元素

块级元素具有换行特性，因此可以利用它配合clear属性清除浮动。

### list-item清除浮动

<iframe src="/examples/clearfix-listitem.html" width="400" height="100"></iframe>

`embed:clearfix-listitem.html`

清除浮动时不会使用list-item的原因：

1. 字符比较多
2. 会出现不需要的项目符号
3. IE浏览器不支持伪元素的display值为list-item

### list-item元素会出现项目符号原因

- 生成了一个附加的标记盒子，专门用来放圆点、数字这些项目符号的。
- IE浏览器下伪元素不支持的原因就是无法创建这个标记盒子。

### display:inline-table的盒子组成

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
    <iframe src="/examples/min-content.html" width="400" height="100"></iframe>

    `embed:min-content.html`
    当第一列空间不足时，文字能断就断，但中文是随便断的，英文单词不能断，于是第一列被无情的断掉。
4. 超出容器限制，例如内容很长的连续英文和数字，或内联元素被设置了white-space:nowrap，如以下实例
    <iframe src="/examples/over-container-limit.html" width="400" height="100"></iframe>

    `embed:over-container-limit.html`
    
其中，第一个是外部尺寸，其他都是内部尺寸。

#### 外部尺寸与流体特性

##### 正常流宽度

流动性：一种margin、border、padding、content自动分配水平空间的机制。

如下，这是一个对比演示，上下两个导航都有margin和padding，前者无width设置，完全借助流特性，后者宽度100%，流动性丢失，不会完全利用空间。

<iframe src="/examples/lose-flow.html" width="400" height="100"></iframe>

`embed:lose-flow.html`

##### 格式化宽度

- 仅出现在绝对定位模型中，也就是出现在绝对和固定定位的元素中，在默认情况下，绝对定位元素的宽度表现是包裹性的，宽度由内部尺寸决定。
- 对于非替换元素，当left/right或top/bottom对立方位的属性值同时存在的时候，元素的宽度表现为`格式化宽度`，其宽度大小相对于最近的具有定位特性（position不是static）的祖先元素计算。
- 格式化宽度具有完全的流动性。

#### 内部尺寸与流体特性

假如这个元素没有内容，宽度就是0，那就是应用的`内部尺寸`。

##### 包裹性

- 除了包裹，还有自适应性，它是区分后面两种尺寸表现很重要的一点
- 自适应性，指的是元素尺寸由内部元素决定，但永远小于包含块容器的尺寸（除非容器尺寸小于容器的首选最小宽度）

按钮会自动换行，表现包裹性的最好例子

<iframe src="/examples/button-wrap.html" width="400" height="100"></iframe>

`embed:button-wrap.html`

**包裹性对实际开发的用处**

页面中的内容是动态的，文字少的时候居中显示，超过一行的时候居左显示

<iframe src="/examples/text-wrap-center.html" width="400" height="100"></iframe>

`embed:text-wrap-center.html`

##### 首选最小宽度

- 元素最适合的最小宽度
- 东亚文字的最小宽度为每个汉字的宽度
- 西方文字的最小宽度由特定的连续的英文字符单元决定，并不是所有的英文字符都会组成连续单元，一般会终止于空格（普通空格）、短横线、问号以及其他非英文字符
- 如果想让英文字符和中文一样，每一个字符都用最小宽度单元，可以试试CSS中的word-break:break-all
- 类似图片这样的替换元素的最小宽度就是该元素内容本身的宽度

**首选最小宽度构建图形**

<iframe src="/examples/min-width-wrap.html" width="400" height="100"></iframe>

`embed:min-width-wrap.html`

##### 最大宽度

- 最大宽度就是元素可以有的最大宽度
- 如果内部没有块级元素或者块级元素没有设定宽度值，则最大宽度实际上是最大的连续内联盒子的宽度

**最大宽度的作用**

iScroll实现非常平滑的滚动效果，这样模拟水平滚动式只能使用最大宽度，这样滚动到底的时候才是真的到底。

<iframe src="/examples/scroll-view-to-right.html" width="400" height="100"></iframe>

`embed:scroll-view-to-right.html`

### width值作用的细节

- 内在盒子分为conten box、padding box、border box、margin box
- 除了margin box没有对应的CSS关键字，因为margin的背景永远是透明的，元素本身的尺寸并不会因为此属性变化
- width与height默认作用于content box上

**width与height设定作用于content box不合理的地方**

1. 流动性丢失，宽度作用在content box上，失去内外流动性
2. 与现实世界表现不一致的困扰，包含padding或border会让元素变大不符合常理

### CSS流体布局下的宽度分离原则

宽度分离指的是CSS中的width属性不与影响宽度的padding/border（有时候包括margin）属性并存，也就是不能出现以下组合

```css
.box{
    width:100px;
    border:1px border;
}
```

或者

```css
.box{
    width:100px;
    padding:20px;
}
```

应该分离，写成如下形式，width独占一层标签，padding、border、margin利用流动性在内部自适应呈现。

```css
.father{
    width:100px;
}

.son{
    margin:0 20px;
    padding:20px;
    border:1px solid;
}
```

**为何要宽度分离**

- width、padding、border混用的时候，任何修改都需要实时去计算现在的width有多大才能和之前占用的宽度表现一致
- 后面的宽度分离的实现，只需要添加规则就好，会自动计算

**可能的问题**

虽然宽度分离多了一层标签，但是如果不考虑替换元素，绝大多数布局都只需要一个最外层width设定就可以了，当然这需要很深的CSS积累才能做到。

### box-sizing

#### box-sizing的作用

可以改变width的作用细节，有3个值可取：content-box、padding-box、border-box

#### 为何box-sizing不支持margin-box

- margin-box不会改变元素尺寸
- margin-box会变成一个显式的盒子，意味着是非透明的背景，但margin的背景在规范中是透明的
- 使用场景需要，如果是IE10及以上的浏览器，可以试试flex布局；如果要兼容IE8及以上版本的可以使用宽度分离或特定场景下使用`格式化宽度`，不是强需求

#### 如何评价*{box-sizing:border-box}

- 易产生没必要的消耗，通配符*匹配的范围太大。
    1. 对于普通内联元素（非图片等替换元素），box-sizing无作用；
    2. search类型的搜索框，默认box-sizing就是border-box；
- 并不能解决所有问题。box-sizing不支持margin-box，只有当元素没有水平margin时候，box-sizing才能真正无计算，而宽度分离原则可以解决所有问题。

#### box-sizing发明的初衷

用在textarea和input的100%自适应父容器宽度上

**box-sizing:border-box用在textarea原因**

- textarea为替换元素，不论display是inline还是block，尺寸都由内部元素决定，对于非替换元素display为block时，则会具有流动性，宽度由外部尺寸决定
- 由上所述，textarea修改display也没用，只能通过width:100%来自适应，但这样设置光标会顶着边框，需要有border和padding的存在才有较好的体验
- 在没box-sizing的时代，类似于`宽度分离`，外面嵌套div模拟border、padding，textarea作为子元素，border、padding全部为0，然后宽度100%自适应于父级div
- 然而这种模拟也有局限性，无法使用focus高亮父级边框，因为CSS并无父选择器
- 最终box-sizing:border-box是最终完美解决方案

#### 推荐CSS重置

```css
input,textarea,img,video,object{
    box-sizing:border-box;
}
```

### height:auto

多个元素盒子高度相加就是最终高度值

### 关于height:100%

对于width属性，就算父元素width为auto，其百分比高度也是支持的；但是对于height属性，如果父元素height为auto，只要子元素在文档流中，其百分比值完全被忽略了。

#### 为何没有具体高度值的时候，height：100%会无效

- 规范中规定，如果包含块的高度没有显式指定，并且该元素不是绝对定位，则计算值为auto，auto与百分比不能计算。
- 与之相对应，宽度的解释却是：如果包含块的宽度取决于该元素的宽度，那么产生的布局在CSS2.1中是未定义的。因此，浏览器就按照包含块真实的计算值作为百分比计算的基数。

<iframe src="/examples/width-no-wrap-full.html" width="400" height="100"></iframe>

`embed:width-no-wrap-full.html`

#### 如何让元素支持height：100%效果

1. 设定显式高度值
2. 使用绝对定位，此时需要注意绝对定位宽高百分比计算是相对于padding-box，但非绝对定位元素则是相对于content-box计算的

<iframe src="/examples/absolute-percent.html" width="400" height="100"></iframe>

`embed:absolute-percent.html`

**评价**

显式高度中规中矩，绝对定位方法脱离文档流，仅在某些场景有用，如下例

<iframe src="/examples/image-pre-next.html" width="400" height="100"></iframe>

`embed:image-pre-next.html`

## min-width/max-width和min-height/max-height

### 为流体而生的min-width/max-width

适配自适应布局或流体布局

**公众号图片运用**

- height:auto是必须的，否则原始图片有设定height的话，max-width生效的时候图片就会被水平压缩，保证宽度不超出的同时使图片保持原来的比例
- 可能会有体验上的问题，加载图片时高度会从0变成计算高度，导致页面有瀑布式的下落

```css
img{
    max-height:100%;
    height:auto!important;
}
```

### 初始值

width/height初始值是auto，而max-width/max-height初始值为none，文档中min-width/min-height初始值为0，但是浏览器中初始值为auto

#### max-width初始值是none的原因

子元素width超过父元素时，如果父元素未设置max-width，即默认max-width为auto时，此时max-height计算值为父元素width，导致子元素显示不完整。

### 优先级

#### 超越!important

max-width会覆盖width，比!important更高的优先级

<iframe src="/examples/max-width-over-important.html" width="400" height="100"></iframe>

`embed:max-width-over-important.html`

#### 超越最大

当min-width大于max-width时，min-width会覆盖max-width

### 任意高度元素的展开收起动画技术

场景：元素展开收起时有明显高度滑动效果，传统实现可以使用jquery的slideUp()/slideDown()方法，但是移动端有CSS3动画，所以移动端的js框架都是没有动画模块的，需要用CSS来实现动画。

<iframe src="/examples/slide-up-down-height.html" width="400" height="100"></iframe>

`embed:slide-up-down-height.html`

从0到auto是无法计算的，正如height:100%无法和auto计算一样，所以没有动画效果。

<iframe src="/examples/slide-up-down-max-height.html" width="400" height="100"></iframe>

`embed:slide-up-down-max-height.html`

建议max-height使用足够安全的最小值，这样即使收起有延迟，也会因为时间很短，不会影响体验。

## 内联元素

### 哪些是内联元素

1. 从定义看：内联元素的内联特指外在盒子，和display:inline的元素不是一个概念
2. 从表现看：可以和文字在一行显示，注意浮动元素不是内联元素，比如当后面文字足够多的时候，文字并不是在浮动元素的下面，而是继续在后面，说明文字和浮动元素不在一行，也说明了浮动元素会生成块盒子，就是BFC

### 内联盒模型

1. 内容区域：一种围绕文字看不见的盒子，其大小仅受字符本身特性控制，本质上是一个字符盒子，也就是文本选中的区域
    ```html{2}
    <p>
        这是一行普通的文字，这里有个<em>em</em>标签
    </p>
    ```
2. 内联盒子：元素的外在盒子，决定元素是内联还是块级。又分为内联盒子和匿名内联盒子，如span、a、em等内联盒子，只是文字就属于匿名内联盒子。
    ```html{2,3,4}
    <p>
        这是一行普通的文字，这里有个
        <em>em</em>
        标签
    </p>
    ```
3. 行框盒子：每一行就是一个行框盒子，是由一个个内联盒子组成的
    ```html{2}
    <p>
        这是一行普通的文字，这里有个<em>em</em>标签
    </p>
    ```
4. 包含盒子（包含块）：<p>标签就是一个包含盒子，此盒子由一个个行框盒子组成
    ```html{1}
    <p>这是一行普通的文字，这里有个<em>em</em>标签</p>
    ```

### 幽灵空白节点

>在HTML5中，内联元素的所有解析和渲染表现就好像每个行框盒子前面有一个空白结点一样。
该节点永远透明，不占据任何宽度，看不见也无法通过脚本获取，就好像幽灵一样。
但又好像确实存在，表现如文本节点一样

如下例：

<iframe src="/examples/prove-inline-blank-node.html" width="400" height="100"></iframe>

`embed:prove-inline-blank-node.html`

<span>元素前面有一个宽度为0的空白字符，具有该元素的字体和行高属性的0宽度的内联盒