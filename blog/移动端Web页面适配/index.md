---
title: 移动端Web页面适配
path: /mobile-page-adaptation/
tags: 前端, 移动端, 页面适配
date: 2020-6-24 22:50:32
---

移动端 web 页面的开发，由于手机屏幕尺寸、分辨率不同，或者需要考虑横竖屏问题，为了使得 web 页面在不同移动设备上具有相适应的展示效果，需要在开发过程中使用合理的适配方案来解决这个问题。

# 方案概述

## 静态布局 + initial-scale + 各个元素 px

早期网页设计采用静态布局，通过 `<meta>` 标签中的 `applicable-device` 应用设备标识识别移动设备，即 `<meta name='applicable-device' content='mobile'>`。

在 `<meta>` 标签中的 viewport 标签中设置 width，通过 js 动态修改标签的 initial-scale 使得页面等比缩放，刚好占满整个屏幕。一些文章中有提到静态布局中页面各个元素采用 px 为单位，这种方案实现简单，不存在兼容性问题，但用户体验很不友好。

## 流式布局 + 宽度百分比 + 高度 px

后面出现流式布局，使用百分比定义宽度，高度使用 px 固定，根据可视区域大小实时进行尺寸调整，通常使用 max-width/min-width 控制尺寸范围过大或者过小。

这种方案实现比较简单，但在大屏手机或横竖屏切换场景下可能会导致页面元素被拉伸变形，字体大小无法随屏幕大小发生变化。

## 弹性布局 + em/rem + px/百分比/em/rem

顺应不同页面字体大小展现问题，出现了弹性布局。这种布局方案下，包裹文字的元素的尺寸采用 em/rem 为单位，页面主要划分区域的尺寸依据情况使用 px、百分比或者 em/rem。如一些高校的网站 jlu，页面的主要划分区域使用 px 和百分比，包裹文字的元素和文字采用 em。

## 响应式布局 + 媒体查询 + 以上方案

上面的这几种方案下，页面元素的大小按照屏幕分辨率进行适配调整，但是整体布局不变，对于响应式 web 设计，网页布局会随着访问它的视口及设备的不同呈现不同的样式，在实现上可能会以上多种方案的结合，同时搭配媒体查询技术使用，使得一个页面在多个终端 (PC, mobile, pad) 呈现满意效果，如 mashable 。

# 基本概念

## 像素

### px (pixel)

像素，是屏幕上显示数据的最基本的点，表示相对大小。不同分辨率下相同长度的 px 元素显示会不一样，是因为像素点的个数相同情况下，不同分辨率下每个像素点对应的像素宽度不同。比如同样是 14px 大小的字，在 1366×768 显示屏下会显示的小，在 1024×768 显示屏下会相对大。也称为物理像素（设备像素），是分辨率的尺寸单位。

### pt (point)

印刷行业常用单位，能够使用测量设备测得的长度，等于 1/72 英寸。

### css 像素

在不同屏幕上，css 像素呈现的物理尺寸一致，但 css 像素对应的物理像素不同。标准的显示密度下，1 个 css 像素对应一个物理像素，缩放时 1 个 css 像素对应的物理像素会减增。是一种设备独立像素(device independent pixels: DIPs)

### PPI (pixel per inch)

像素密度，每英寸所拥有的像素数。值越高，显示画面细节越丰富。计算公式为：$\frac{\sqrt{(W^2+H^2)}}{S}$，其中 W 和 H 是分辨率的宽高，S 是屏幕尺寸。

### DPI (dot per inch)

打印设备每英寸印刷出来的点有多少个，值越高，图片越细腻。

### DPR (devicePixelRatio)

设备物理像素和设备独立像素比，即

$$DPR= \frac{\text{物理像素}}{\text{css像素}}$$

是指在理想布局宽度，使用多少个物理像素来渲染一个 css 像素。

js 中通过 window.devicePixelRatio 获取，css 中通过 -webkit-device-pixel-ratio, -webkit-min-device-pixel-ratio, -webkit-max-device-pixel-ratio 进行媒体查询。

## 视口

`<meta>` 标签中定义了一些元数据信息，通过设置 `<meta name="viewport">`，提供有关视口初始大小的信息，供移动设备 使用，属性值为

|     属性      |        属性值        |                描述                |
| :-----------: | :------------------: | :--------------------------------: |
|     width     | 数值 / device-width  |              视口宽度              |
|    height     | 数值 / device-height |              视口高度              |
| initial-scale |      0.0 ~ 10.0      |  设备宽度与视口大小之间的缩放比率  |
| maximum-scale |      0.0 ~ 10.0      |             缩放最大值             |
| minimum-scale |      0.0 ~ 10.0      |             缩放最小值             |
| user-scalable |        布尔值        | 默认 yes，为 no 时用户不能缩放网页 |

移动端涉及布局视口（Layout Viewport）、视觉视口（Visual ViewPort）和理想视口（Ideal ViewPort）。

- 布局视口是指用视口元标签（viewport meta）来进行布局视口设置，css 布局是相对于布局视口计算
- 视觉视口是指用户当前看到的区域
- 理想视口是屏幕分辨率的值，通过设置 `<meta name="viewport" content="width=device-width，initial-scale=1.0">` 实现

## 手机屏幕特性

与移动端 web 页面适配有关的手机屏幕特性包括

### 像素分辨率

硬件所支持的，屏幕每行的像素`*`每列的像素点数，单位是`px`。

### 逻辑分辨率

设备独立的，软件可以达到的，个人理解是使得软件/页面在不同屏幕上显示出来的效果一致。

### 倍率

像素分辨率除以逻辑分辨率等于倍率，如 @3x 表示分辨率的 3 倍。一个已知物理像素大小的元素，如果在普通屏中其设备像素等于 css 像素，但在一些高清屏中，如 Retina 显示屏，一个 css 像素对应 2 或 3 个设备像素，这时显示出来的元素会变小。为了让元素如期待显示，需要传入原始设计稿尺寸 × 倍率的设计稿，根据 DPR 的定义，这样加载后能够达到同样的效果。

### 尺寸

手机屏幕对角线长度换算成英寸的大小

# 适配方案

## 百分比方案

### 原理

|           属性           |                                       设置参考                                       |
| :----------------------: | :----------------------------------------------------------------------------------: |
|       height/width       |   基于子元素的直接父元素，width 相对于父元素的 width，height 相对于父元素的 height   |
| top/bottom 和 left/right |                   相对于直接非 static 定位的父元素的 height/width                    |
|      padding/margin      | 不论是垂直方向或者是水平方向，都相对于直接父亲元素的 width，与父元素的 height 无关。 |
|      border-radius       |                                   相对于自身的宽度                                   |

### 实现过程

使用百分比定义宽度，高度用 px 固定，根据可视区域实时尺寸进行调整，尽可能适应各种分辨率，通常使用 max-width/min-width 控制尺寸范围过大或者过小。下表是子元素不同属性设置百分比的依据

### 优点

原理简单，不存在兼容性问题

### 缺点

- 如果屏幕尺度跨度太大，相对设计稿过大或者过小的屏幕不能正常显示，在大屏手机或横竖屏切换场景下可能会导致页面元素被拉伸变形，字体大小无法随屏幕大小发生变化。
- 设置盒模型的不同属性时，其百分比设置的参考元素不唯一，容易使布局问题变得复杂。

## rem 方案

### 原理

rem 是相对长度单位，rem 方案中的样式设计为相对于根元素 font-size 计算值的倍数。根据屏幕宽度设置 html 标签的 font-size，在布局时使用 rem 单位布局，达到自适应的目的，是弹性布局的一种实现方式。

### 实现过程

首先获取文档根元素和设备 dpr，设置 rem，在 html 文档加载和解析完成后调整 body 字体大小； 在页面缩放/回退/前进的时候，获取元素的内部宽度 (不包括垂直滚动条，边框和外边距)，重新调整 rem 大小。

用 css 处理器或 npm 包将页面 css 样式中的 px 自动转换成 rem。在整个 flexible 适配方案中，文本使用 px 作为单位，使用 `[data-dpr]` 属性来区分不同 dpr 下的文本字号。由于手机浏览器对字体显示最小是 8px，因此对于小尺寸文字需要采用 px 为单位，防止通过 rem 转化后出现显示问题。手机淘宝中的字体使用 px 为单位，腾讯新闻中的字体使用 rem 为单位。

```js
(function(win, lib) {
  var doc = win.document; // 当前文档对象
  var docEl = doc.documentElement; // 文档对象根元素的只读属性
  var metaEl = doc.querySelector('meta[name="viewport"]');
  var flexibleEl = doc.querySelector('meta[name="flexible"]');
  var dpr = 0;
  var scale = 0;
  var tid;
  var flexible = lib.flexible || (lib.flexible = {});

  if (metaEl) {
    // 当 meta 中 viewport 的标签设置了 scale 时，将根据 scale 手动设置 dpr
    console.warn('将根据已有的 meta 标签来设置缩放比例');
    var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
    if (match) {
      scale = parseFloat(match[1]);
      dpr = parseInt(1 / scale);
    }
  } else if (flexibleEl) {
    // 当 meta 中 flexible 的标签存在时，据此设置 dpr
    var content = flexibleEl.getAttribute('content');
    if (content) {
      var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
      var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
      if (initialDpr) {
        dpr = parseFloat(initialDpr[1]);
        scale = parseFloat((1 / dpr).toFixed(2));
      }
      if (maximumDpr) {
        dpr = parseFloat(maximumDpr[1]);
        scale = parseFloat((1 / dpr).toFixed(2));
      }
    }
  }

  if (!dpr && !scale) {
    // 根据 js 获取到的 devicePixelRatio 设置 dpr 及 scale，scale 是 dpr 的倒数
    var isAndroid = win.navigator.appVersion.match(/android/gi);
    var isIPhone = win.navigator.appVersion.match(/iphone/gi);
    var devicePixelRatio = win.devicePixelRatio;
    if (isIPhone) {
      // iOS 下，对于 2 和 3 的屏，分别用 2 和 3 倍方案
      if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
        dpr = 3;
      } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
        dpr = 2;
      } else {
        dpr = 1;
      }
    } else {
      // 其他设备下，仍旧使用 1 倍的方案
      dpr = 1;
    }
    scale = 1 / dpr;
  }

  // 文本字号不建议使用 rem，flexible 适配方案中，文本使用 px 作为单位，使用 [data-dpr] 属性来区分不同 dpr 下的文本字号
  docEl.setAttribute('data-dpr', dpr);

  if (!metaEl) {
    // 添加 meta 标签，设置 name 为 viewport，content 根据 scale 设置缩放比(默认、最大、最小缩放比)
    metaEl = doc.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    metaEl.setAttribute(
      'content',
      'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no'
    );
    if (docEl.firstElementChild) {
      docEl.firstElementChild.appendChild(metaEl);
    } else {
      var wrap = doc.createElement('div');
      wrap.appendChild(metaEl);
      doc.write(wrap.innerHTML);
    }
  }

  function refreshRem() {
    // 更新 rem 值
    var width = docEl.getBoundingClientRect().width;
    if (width / dpr > 540) {
      width = 540 * dpr;
    }
    // 将当前视口宽度 width 10 等分
    var rem = width / 10; // 1rem = viewWidth / 10
    docEl.style.fontSize = rem + 'px';
    flexible.rem = win.rem = rem;
  }

  // resize 与 pageshow 延时 300ms 触发 refreshRem(), 使用防抖函数，防止事件被高频触发可能引起性能问题
  win.addEventListener(
    'resize',
    function() {
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 300);
    },
    false
  );
  win.addEventListener(
    'pageshow',
    function(e) {
      // 当一条会话历史记录被执行的时候触发事件，包括后退/前进按钮，同时会在 onload 页面触发后初始化页面时触发
      if (e.persisted) {
        // 表示网页是否来自缓存
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
      }
    },
    false
  );

  // 在 html 文档加载和解析完成后设置 body 元素字体大小
  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = 12 * dpr + 'px';
  } else {
    doc.addEventListener(
      'DOMContentLoaded',
      function(e) {
        doc.body.style.fontSize = 12 * dpr + 'px';
      },
      false
    );
  }
  // 浏览器有最小字体限制，css 在 pc 上 font-size 是 12px (移动端最小是 8px), 也就是 css 像素是 12，其 DPR 为 1，在移动端 dpr 有可能为 2 和 3，为了保证字体不变小，需要用 12 * dpr 进行换算。

  refreshRem();

  //实现 rem 与 px 相互转换
  flexible.dpr = win.dpr = dpr;
  flexible.refreshRem = refreshRem;
  flexible.rem2px = function(d) {
    var val = parseFloat(d) * this.rem;
    if (typeof d === 'string' && d.match(/rem$/)) {
      val += 'px';
    }
    return val;
  };
  flexible.px2rem = function(d) {
    var val = parseFloat(d) / this.rem;
    if (typeof d === 'string' && d.match(/px$/)) {
      val += 'rem';
    }
    return val;
  };
})(window, window['lib'] || (window['lib'] = {}));
```

### 优点

兼容性好

- ios: 6.1 系统以上都支持
- android: 2.1 系统以上都支持
- 大部分主流浏览器都支持
- 相较于之前的静态布局和百分比方案，页面不会因为伸缩发生变形，自适应效果更佳。

### 缺点

- 不是纯 css 移动适配方案，需要引入 js 脚本，在头部内嵌一段 js 脚本，监听分辨率的变化来动态改变根元素的字体大小，css 样式和 js 代码有一定耦合性，并且必须将改变 font-size 的代码放在 css 样式之前。
- 小数像素问题，浏览器渲染最小的单位是像素，元素根据屏幕宽度自适应，通过 rem 计算后可能会出现小数像素，浏览器会对这部分小数四舍五入，按照整数渲染。浏览器在渲染时所做的摄入处理只是应用在元素的尺寸渲染上，其真实占据的空间依旧是原始大小。也就是说如果一个元素尺寸是 0.625px，那么其渲染尺寸应该是 1px，空出的 0.375px 空间由其临近的元素填充；同样道理，如果一个元素尺寸是 0.375px，其渲染尺寸就应该是 0，但是其会占据临近元素 0.375px 的空间。会导致：缩放到低于 1px 的元素时隐时现（解决办法：指定最小转换像素，对于比较小的像素，不转换为 rem 或 vw）；两个同样宽度的元素因为各自周围的元素宽度不同，导致两元素相差 1px；宽高相同的正方形，长宽不等了；border-radius: 50% 画的圆不圆。
- Android 浏览器下 line-height 垂直居中偏离的问题。常用的垂直居中方式就是使用 line-height，这种方法在 Android 设备下并不能完全居中。
- cursor: pointer 元素点击背景变色的问题，对添加了 cursor:pointer 属性的元素，在移动端点击时，背景会高亮。为元素添加 tag-highlight-color: transparent 属性可以隐藏背景高亮。

## vh/vw 方案

### 原理

视口是浏览器中用于呈现网页的区域，移动端的视口通常指的是布局视口

- vw: 1vw 等于视口宽度的 1%
- vh: 1vh 等于视口高度的 1%
- vmin: 选取 vw 和 vh 中最小的那个
- vmax: 选取 vw 和 vh 中最大的那个

### 实现过程

使用 css 预处理器把设计稿尺寸转换为 vw 单位，包括文本，布局高宽，间距等，使得这些元素能够随视口大小自适应调整。以 1080px 设计稿为基准，转化的计算表示为

```scss
// 以1080px作为设计稿基准
$vw_base: 1080 @function vw($px) {
  @return ($px / 1080) * 100vw;
}
```

### 优点

- 纯 css 移动端适配方案，不存在脚本依赖问题
- 相对于 rem 以根元素字体大小的倍数定义元素大小，逻辑清晰简单，视口单位依赖于视口的尺寸 `1vw ＝ 1/100 viewport width`，根据视口尺寸的百分比来定义元素宽度

### 缺点

存在一些兼容性问题，Android 4.4 以下不支持

## rem + vw/vh 方案

### 原理

vw/vh 方案能够实现宽度和高度的自适应，并且逻辑清晰，由于其被支持得较晚，所以存在一定的兼容性问题。将 vw/vh 方案与 rem 方案相结合，给根元素设置随视口变化的 vw 单位，可以通过 postcss-plugin-vwtorem 将其转换

### 实现过程

对于 1080px 宽的设计稿，设置默认根字号的大小为 100px，那么设计稿中 1px 对应的是 100vw/1080 = 0.0925926vw，并且 1rem = 100px，也就可以得到 1rem = 9.256926vw

同时可以使用媒体查询限制根元素的最大最小值，实现对页面的最大最小宽度限制，对用户的视觉体验更好。

### 适用场景

rem 弹性布局方式作为移动端 web 页面适配方法，后期从 rem 过渡到 vw ，只需要通过改变根元素大小的计算方式，不需要其他处理。vw 将会成为一种更好的适配方式，目前由于兼容性的原因得不到广泛应用。rem+vw/vh 不存在 vw/vh 的兼容性问题，可以成为由 rem 向 vw/vh 转变的一种过渡方案。

## 基于媒体查询的响应式设计

响应式设计使得一个网站同时适配多种设备和多个屏幕，让网站的布局和功能随用户的使用环境（屏幕大小、输出方式、设备/浏览器能力而变化），使其视觉合理，交互方式符合习惯。如使得内容区块可伸缩与自由排布，边距适应页面尺寸，图片适应比例变化，能够自动隐藏/部分显示内容，能自动折叠导航和菜单。

### 原理

主要实现是通过媒体查询，通过给不同分辨率的设备编写不同的样式实现响应式布局，用于解决不同设备不同分辨率之间兼容问题，一般是指 PC、平板、手机设备之间较大的分辨率差异。

### 实现过程

实现上不局限于具体的方案，通常结合了流式布局 + 弹性布局方案。比如给小屏幕手机设置@2x 图，为大屏手机设置@3x 图

```css
@media only screen and (min-width: 375px) {
  /* 样式1 */
}
@media only screen and (min-width: 750px) {
  /* 样式2 */
}
```

### 优点

能够使网页在不同设备、不同分辨率屏幕上呈现合理布局，不仅仅是样式伸缩变换

### 缺点

- 要匹配足够多的设备与屏幕，一个 web 页面需要多个设计方案，工作量比较大
- 通过媒体查询技术需要设置一定量的断点，到达某个断点前后的页面发生显著变化，用户体验不太友好

# 其他通用问题

## 1 像素问题

是指设置边框为 1px css 像素，在普通屏幕下 1px，高清屏幕 (dpr 为 2)下 2px 的情况。是由于不同移动设备的 dpr 不同，导致 1px css 像素，转换成物理像素后显示不一样。

### 设置 scale 为 1/dpr

css 中涉及 1 像素的地方仍然使用 px 作为单位，设置 `<meta>` 标签中 `initial-scale=1/dpr` ，将整个页面缩小 dpr 倍，对于页面采用 rem 方案的情况，将页面的根字体再放大 dpr 倍，这个时候就能够在不改变页面其他布局的情况下，保持边框的 css 像素为 1px。

### transform 的 scale 属性

transform 的 scale 属性允许对元素进行缩放，其中 scaleY(y) 通过设置 Y 轴的值来定义缩放转换，并结合伪元素使用，通过 transform-origin: 50% 0% 修改元素变换的中心点实现。针对横着的边框线用 scaleY(y)，针对竖着的边框线要用 scaleX(x)，针对一圈的边框线用 scale()，并且需要注意转移元素变换中心点。

```css
/* 针对竖着的边框线 */
.className::before {
  /* 其他样式 */
  transform-origin: 50% 0%;
}

/* dpr 为 2 时 */
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .className::before {
    transform: scaleY(0.5);
  }
}

/* dpr 为 3 时 */
@media only screen and (-webkit-min-device-pixel-ratio: 3) {
  .className::before {
    transform: scaleY(0.33);
  }
}
```

### border-image 属性

使用 border-image，在元素的边框上设置一个一半透明一半显示的图片，也可以使用 CSS3 渐变填充

## 对图片的处理

- 加载网页时，平均 60% 以上的流量来自加载图片。
- 指定图像宽度时使用相对单位，防止意外溢出视口，如 width: 50%，将图片宽度设置为包含元素宽度的 50%。因为 css 允许内容溢出容器，需要使用 max-width: 100% 来保证图像及其他内容不会溢出。
- 使用 img 元素的 alt 属性提供描述，描述有助于提高网站的可访问性，能提供语境给屏幕阅读器及其他辅助性技术。
- 维护自适应页面中图片宽高比固定比较常用的方法是使用 padding 设置。
- 对于不同 dpr 以及不同分辨率/尺寸的屏幕，为了避免资源浪费和等待时间延长，需要针对不同的屏幕使用合适的图片，加载的图片分为通过标签引入的图片和背景图片。

### srcset 和 sizes

对于 `<img>` 引入的图片，如果想要图片适应不同像素密度的屏幕，并且屏幕上显示图片的实际尺寸相同，使用 srcset 属性用来指定多张图像。它的值是一个逗号分隔的字符串，每个部分都是一张图像的 URL，后面接一个空格，后接是像素密度描述符。浏览器根据当前设备的像素密度，选择需要加载的图像。如果 srcset 属性都不满足条件，那么就加载 src 属性指定的默认图像。

```html
<img srcset="foo-320w.jpg, foo-480w.jpg 1.5x, foo-640w.jpg 2x" src="foo-640w.jpg" />
<!--srcset属性给出了三个图像URL，适应三种不同的像素密度， 后面的像素密度描述符，格式是像素密度倍数 + 字母x。1x表示单倍像素密度，可以省略。-->
```

如果想要针对不同屏幕，使用不同分辨率版本和尺寸的图片，使用属性 srcset 和 sizes 。srcset 定义了允许浏览器选择的图像集，以及每个图像的大小（使用 w 单位）。sizes 定义了一组媒体条件（例如屏幕宽度），指明当某些媒体条件为真时，什么样的图片尺寸是最佳选择。

```html
<img
  srcset="elva-fairy-320w.jpg 320w, elva-fairy-480w.jpg 480w, elva-fairy-800w.jpg 800w"
  sizes="(max-width: 320px) 280px,
         (max-width: 480px) 440px,
         800px"
  src="elva-fairy-800w.jpg"
  alt="Elva dressed as a fairy"
/>
```

浏览器的查询过程：

- 查看设备宽度；
- 检查 sizes 列表中哪个媒体条件是第一个为真；
- 查看给予该媒体查询的槽大小；
- 加载 srcset 列表中引用的最接近所选的槽大小的图像

### 异步加载

`<img>` 引入的图片，使用 js 自带的异步加载图片。根据不同的 dpr，加载不同分辨率的图片。

```html
<img id="img" data-src1x="xxx@1x.jpg" data-src2x="xxx@2x.jpg" data-src3x="xxx@3x.jpg" />
```

```js
var dpr = window.devicePixelRatio;
if (dpr > 3) {
  dpr = 3;
}

var imgSrc = $('#img').data('src' + dpr + 'x');
var img = new Image();
img.src = imgSrc;
img.onload = function(imgObj) {
  $('#img')
    .remove()
    .prepend(imgObj); //替换img对象
};
```

### picture

为不同的视口提供不同的图片，使用 `<picture>` 标签。`<picture>` 是 html5 中定义的一个容器标签，内部使用 `<source>` 和 `<image>`，浏览器会匹配 `<source>` 的 type,media,srcset 等属性，找到最适合当前布局/视口宽度/设备像素密度的图像进行加载。这里的 `<img>` 标签是浏览器不支持 picture 元素，或者支持 picture 但没有合适的媒体定义时的后备，不能省略。

```html
<picture>
  <source media="(min-width: 30px)" srcset="cat-vertical.jpg" />
  <source media="(min-width: 60px)" srcset="cat-horizontal.jpg" />
  <img src="cat.jpg" alt="cat" />
</picture>
```

### Image-set

对于背景图片，使用 image-set 根据用户设备的分辨率匹配合适的图像，同时要考虑兼容性问题。

```css
.css {
  background-image: url(1x.png); /*不支持image-set的情况下显示*/
  background: -image-set(
    url(1x.png) 1x,
    /* 支持image-set的浏览器的[普通屏幕]下 */ url(2x.png) 2x,
    /* 支持image-set的浏览器的[2倍Retina屏幕] */ url(3x.png) 3x /* 支持image-set的浏览器的[3倍Retina屏幕] */
  );
}
```

### media query

对于背景图片，使用媒体查询自动切换不同分辨率的版本

```css
/* 普通显示屏(设备像素比例小于等于1)使用1倍的图 */
.css {
  background-image: url(img_1x.png);
}

/* 高清显示屏(设备像素比例大于等于2)使用2倍图  */
@media only screen and (min-device-pixel-ratio: 2) {
  .css {
    background-image: url(img_2x.png);
  }
}

/* 高清显示屏(设备像素比例大于等于3)使用3倍图  */
@media only screen and (min-device-pixel-ratio: 3) {
  .css {
    background-image: url(img_3x.png);
  }
}
```

# 总结

对于上述的各种移动端 web 页面自适应方案来说，都存在着一些优势和不足。对于国内的一些互联网站，通过查看网页源代码发现，它可能不是某一种方案的单独使用，而是几种方案的结合。

一个页面上，元素的宽度设置上有百分比，也有 rem，字体的样式中有 rem，有 em，也有固定大小的 px；在屏幕宽度过大时不再缩放，也会用到媒体查询，并且响应式设计更多地可能是针对不同设备间的自适应。

对于移动端 web 页面的自适应方案来说，现在用的比较多的是 rem，逐渐向 vw/vh 发展，而 rem+vw/vh 则是作为 vw/vh 向后兼容的一种过渡。
