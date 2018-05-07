---
title: 前端面试题HTML部分
categories:
  - 面试
tags: 面试, HTML
path: /front-end-interview-html/
date: 2018-04-05 18:24:54
---
## DOCTYPE有什么用？

### 版本一

在HTML中 doctype 有两个主要目的。

- 对文档进行有效性验证:
  它告诉用户代理和校验器这个文档是按照什么DTD 写的。这个动作是被动的，每次页面加载时，浏览器并不会下载DTD 并检查合法性，只有当手动校验页面时才启用。
- 决定浏览器的呈现模式:
    对于实际操作，通知浏览器读取文档时用哪种解析算法。如果没有写，则浏览器则根据自身的规则对代码进行解析，可能会严重影响HTML 排版布局。浏览器有三种方式解析HTML文档。
    - 非怪异（标准）模式
    - 怪异模式
    - 部分怪异（近乎标准）模式



### 版本二

1. <!doctype>声明必须处于HTML文档的头部，在`<html>`标签之前，HTML5中不区分大小写
2. <!doctype>声明不是一个HTML标签，是一个用于告诉浏览器当前HTMl版本的指令
3. 现代浏览器的html布局引擎通过检查doctype决定使用兼容模式还是标准模式对文档进行渲染，一些浏览器有一个接近标准模型
4. 在HTML4.01中<!doctype>声明指向一个DTD，由于HTML4.01基于SGML，所以DTD指定了标记规则以保证浏览器正确渲染内容
5. HTML5不基于SGML，所以不用指定DTD

**常见doctype：**

1. `HTML4.01 strict`：不允许使用表现性、废弃元素（如font）以及frameset。声明：<!DOCTYPE HTML PUBLIC "`-//W3C//DTD HTML 4.01//EN`" "`http://www.w3.org/TR/html4/strict.dtd`">
2. `HTML4.01 Transitional`：允许使用表现性、废弃元素（如font），不允许使用frameset。声明：<!DOCTYPE HTML PUBLIC "`-//W3C//DTD HTML 4.01 Transitional//EN`" "`http://www.w3.org/TR/html4/loose.dtd`">
3. `HTML4.01 Frameset`：允许表现性元素，废弃元素以及frameset。声明：<!DOCTYPE HTML PUBLIC "`-//W3C//DTD HTML 4.01 Frameset//EN`" "`http://www.w3.org/TR/html4/frameset.dtd`">
4. `XHTML1.0 Strict`：不使用允许表现性、废弃元素以及frameset。文档必须是结构良好的XML文档。声明：<!DOCTYPE html PUBLIC "`-//W3C//DTD XHTML 1.0 Strict//EN`" "`http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd`">
5. `XHTML1.0 Transitional`：允许使用表现性、废弃元素，不允许frameset，文档必须是结构良好的XMl文档。声明： <!DOCTYPE html PUBLIC "`-//W3C//DTD XHTML 1.0 Transitional//EN`" "`http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd`">
6. `XHTML 1.0 Frameset`：允许使用表现性、废弃元素以及frameset，文档必须是结构良好的XML文档。声明：<!DOCTYPE html PUBLIC "`-//W3C//DTD XHTML 1.0 Frameset//EN`" "`http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd`">
7. `HTML 5`: <!doctype html>

## 如何提供包含多种语言内容的页面？

这个问题有点问得含糊其辞，我认为这是在询问最常见的情况：如何提供包含多种语言内容的页面，并保证页面内容语言的一致性。

当客户端向服务器发送 HTTP 请求时，通常会发送有关语言首选项的信息，比如使用Accept-Language请求头。如果替换语言存在，服务器可以利用该信息返回与之相匹配的 HTML 文档。返回的 HTML 文档还应在`<html>`标签中声明lang属性，比如`<html lang="en">...</html>`

在后台中，HTML 将包含i18n占位符和待以替换的内容，这些按照不同语言，以 YML 或 JSON 格式存储。然后，服务器将动态生成指定语言内容的 HTML 页面。整个过程通常需要借助后台框架实现。

## 在设计开发多语言网站时，需要留心哪些事情？

- 在HTML中使用lang属性。
- 引导用户切换到自己的母语——让用户能够轻松地切换到自己的国家或语言，而不用麻烦。
- 在图片中展示文本会阻碍网站规模增长——把文本放在图片中展示，仍然是一种非常流行的方式。这样做可以在所有终端上，都能显示出美观的非系统字体。然而，为了翻译图片中的文本，需要为每种语言单独创建对应的图片，这种做法很容易在图片数量不断增长的过程中失控。
- 限制词语或句子的长度——网页内容在使用其他语言表述时，文字长度会发生变化。设计时，需要警惕文字长度溢出布局的问题，最好不要使用受文字长度影响较大的设计。比如标题、标签、按钮的设计，往往很受文字长度影响，这些设计中的文字与正文或评论部分不同，一般不可以自由换行。
- 注意颜色的使用——颜色在不同的语言和文化中，意义和感受是不同的。设计时应该使用恰当的颜色。
- 日期和货币的格式化——日期在不同的国家和地区，会以不同的方式显示。比如美国的日期格式是`May 31, 2012`，而在欧洲部分地区，日期格式是`31 May 2012`。
- 不要使用连接的翻译字符串——不要做类似这样的事情，比如“今天的日期是”+具体日期。这样做可能会打乱其他语言的语序。替代方案是，为每种语言编写带变量替换的模版字符串。
- 注意语言阅读的方向——在英语中，文字是从左向右阅读的；而在传统日语中，文字是从右向左阅读的。

## 什么是data-属性？

### 版本一

在 JavaScript 框架变得流行之前，前端开发者经常使用data-属性，把额外数据存储在 DOM 自身中。当时没有其他 Hack 手段（比如使用非标准属性或 DOM 上额外属性）。这样做是为了将自定义数据存储到页面或应用中，对此没有其他更适当的属性或元素。

而现在，不鼓励使用data-属性。原因之一是，用户可以通过在浏览器中利用检查元素，轻松地修改属性值，借此修改数据。数据模型最好存储在 JavaScript 本身中，并利用框架提供的数据绑定，使之与 DOM 保持更新。

### 版本二

data- 为前端开发者提供自定义的属性，这些属性集可以通过对象的 dataset 属性获取，不支持该属性的浏览器可以通过 getAttribute 方法获取:

```html
<div data-author="david" data-time="2011-06-20" data-comment-num="10">...</div>

div.dataset.commentNum; // 10
```

需要注意的是，data- 之后的以连字符分割的多个单词组成的属性，获取的时候使用驼峰风格。并不是所有的浏览器都支持 .dataset 属性，测试的浏览器中只有 Chrome 和 Opera 支持。

即：当没有合适的属性和元素时，自定义的 data 属性是能够存储页面或 App 的私有的自定义数据。

## 将 HTML5 看作成开放的网络平台，什么是 HTML5 的基本构件（building block）？

### 版本一

- 连接 - 提供新的方式与服务器通信。
- 离线和存储 - 允许网页在本地存储数据并有效地离线运行。
- 多媒体 - 在 Open Web 中，视频和音频被视为一等公民（first-class citizens）。
- 2D/3D 图形和特效 - 提供更多种演示选项。
- 性能和集成 - 提供更快的访问速度和性能更好的计算机硬件。
- 设备访问 - 允许使用各种输入、输出设备。
- 外观 - 可以开发丰富的主题。

### 版本二

开放网络平台（Open Web Platform）是一些开放的（免版权）技术的集合，这些技术激活了互联网。使用开放网络平台时，每个人都有权实现 Web 上的一个组件，而不用向任何人索取许可和证书。

将 HTML5 看做开放网络平台，那它的构建模块有哪些？我想，所谓构建模块，指的应该是开放网络平台这个技术集合中的技术。

- HTML
- DOM
- CSS
- SVG
- MathML
- Web APIs
    - Canvas WebGL
    - Audio
    - Web Storage
    - File, File System
    - History, contentEditable, Drag & Drop, HTML Editing Commands
    - Web Sockets
    - Web Workers
    - Server-Send Events
    - XMLHttpRequest
    - Geolocation, Device Orientation
    - DOM Events, Touch Events, Progress Events
    - Custom application development
    - Clipboard and events
    - Web Notifications, Web Messaging
    - Offine Web Applications
    - Media Capture API
    - Timing control for script-based animations, Page Visibility, Navigation + Timing, Resource Timing
    - Selectors
    - DOM Traversal, DOM XPath, Element Traversal
    - EcmaScript / JavaScript
    - HTTP
    - URI
    - Media Accessibility Checklist

## 请描述cookie、sessionStorage和localStorage的区别。

上面提到的技术名词，都是在客户端以键值对存储的存储机制，并且只能将值存储为字符串。

- Cookie
    - 每个域名存储量比较小（各浏览器不同，大致4K）
    - 所有域名的存储量有限制（各浏览器不同，大致4K）
    - 有个数限制（各浏览器不同）
    - 会随请求发送到服务器
- LocalStorage
    - 永久存储
    - 单个域名存储量比较大（推荐5MB，各浏览器不同）
    - 总体数量无限制
- SessionStorage
    - 只在 Session 内有效
    - 存储量更大（推荐没有限制，但是实际上各浏览器也不同）

|                                                    | `cookie`                                           | `localStorage` | `sessionStorage` |
| -------------------------------------------------- | -------------------------------------------------- | -------------- | ---------------- |
| 由谁初始化                                         | 客户端或服务器，服务器可以使用`Set-Cookie`请求头。 | 客户端         | 客户端           |
| 过期时间                                           | 手动设置                                           | 永不过期       | 当前页面关闭时   |
| 在当前浏览器会话（browser sessions）中是否保持不变 | 取决于是否设置了过期时间                           | 是             | 否               |
| 是否随着每个 HTTP 请求发送给服务器                 | 是，Cookies 会通过`Cookie`请求头，自动发送给服务器 | 否             | 否               |
| 容量（每个域名）                                   | 4kb                                                | 5MB            | 5MB              |
| 访问权限                                           | 任意窗口                                           | 任意窗口       | 当前页面窗口     |

## 请描述`script`、`script async`和`script defer`的区别

- `<script>` - HTML 解析中断，脚本被提取并立即执行。执行结束后，HTML 解析继续。
- `<script async>` - 脚本的提取、执行的过程与 HTML 解析过程并行，脚本执行完毕可能在 HTML 解析完毕之前。当脚本与页面上其他脚本独立时，可以使用 `async`，比如用作页面统计分析。
- `<script defer>` - 脚本仅提取过程与 HTML 解析过程并行，脚本的执行将在 HTML 解析完毕后进行。如果有多个含defer的脚本，脚本的执行顺序将按照在 `document` 中出现的位置，从上到下顺序执行。

注意：没有src属性的脚本，async和defer属性会被忽略。

## 为什么最好把 `CSS` 的 `link` 标签放在 `head` 之间？为什么最好把 `JS` 的 `script` 标签恰好放在 `body` 之前，有例外情况吗？

### 把 `link` 放在 `head` 中

把 `<link>` 标签放在 `<head></head>` 之间是规范要求的内容。此外，这种做法可以让页面逐步呈现，提高了用户体验。将样式表放在文档底部附近，会使许多浏览器（包括 `Internet Explorer`）不能逐步呈现页面。一些浏览器会阻止渲染，以避免在页面样式发生变化时，重新绘制页面中的元素。这种做法可以防止呈现给用户空白的页面或没有样式的内容。

### 把 `script` 标签恰好放在 `body` 之前

脚本在下载和执行期间会阻止 HTML 解析。把 `<script>` 标签放在底部，保证 `HTML` 首先完成解析，将页面尽早呈现给用户。

例外情况是当你的脚本里包含 `document.write()` 时。但是现在，`document.write()` 不推荐使用。同时，将 `<script>` 标签放在底部，意味着浏览器不能开始下载脚本，直到整个文档 `（document）` 被解析。也许，对此比较好的做法是， `<script>` 使用 `defer`  属性，放在 `<head>` 中。

## 什么是渐进式渲染（progressive rendering）？

渐进式渲染是用于提高网页性能（尤其是提高用户感知的加载速度），以尽快呈现页面的技术。

在以前互联网带宽较小的时期，这种技术更为普遍。如今，移动终端的盛行，而移动网络往往不稳定，渐进式渲染在现代前端开发中仍然有用武之地。

一些举例：

图片懒加载——页面上的图片不会一次性全部加载。当用户滚动页面到图片部分时，JavaScript 将加载并显示图像。
确定显示内容的优先级（分层次渲染）——为了尽快将页面呈现给用户，页面只包含基本的最少量的 CSS、脚本和内容，然后可以使用延迟加载脚本或监听DOMContentLoaded/load事件加载其他资源和内容。
异步加载 HTML 片段——当页面通过后台渲染时，把 HTML 拆分，通过异步请求，分块发送给浏览器。更多相关细节可以在[这里](http://www.ebaytechblog.com/2014/12/08/async-fragments-rediscovering-progressive-html-rendering-with-marko/)找到。

## 为什么在 `img` 标签中使用 `srcset` 属性？请描述浏览器遇到该属性后的处理过程。

因为需要设计响应式图片。我们可以使用两个新的属性 `srcset` 和 `sizes` 来提供更多额外的资源图像和提示，帮助浏览器选择正确的一个资源。

srcset 定义了我们允许浏览器选择的图像集，以及每个图像的大小。

sizes 定义了一组媒体条件（例如屏幕宽度）并且指明当某些媒体条件为真时，什么样的图片尺寸是最佳选择。

所以，有了这些属性，浏览器会：

1. 查看设备宽度
2. 检查 sizes 列表中哪个媒体条件是第一个为真
3. 查看给予该媒体查询的槽大小
4. 加载 srcset 列表中引用的最接近所选的槽大小的图像

## 你有过使用不同模版语言的经历吗？

有过，比如 Pug （以前叫 Jade）、 ERB、 Slim、 Handlebars、 Jinja、 Liquid 等等。在我看来，这些模版语言大多是相似的，都提供了用于展示数据的内容替换和过滤器的功能。大部分模版引擎都支持自定义过滤器，以展示自定义格式的内容。

## 浏览器标准模式和怪异模式之间的区别是什么？

在 `标准模式(Standards Mode)` 页面按照 `HTML` 与 `CSS` 的定义渲染，而在 `怪异模式(Quirks Mode)` 就是浏览器为了兼容很早之前针对旧版本浏览器设计、并未严格遵循 `W3C` 标准的网页而产生的一种页面渲染模式。浏览器基于页面中文件类型描述的存在以决定采用哪种渲染模式；如果存在一个完整的 `DOCTYPE` 则浏览器将会采用标准模式，而如果它缺失则浏览器将会采用怪异模式。

强烈建议阅读加深理解：[怪异模式（Quirks Mode）对 HTML 页面的影响](http://www.ibm.com/developerworks/cn/web/1310_shatao_quirks/)，这里列下浏览器标准模式和怪异模式的区别：

1. 盒模型：
  在怪异模式下，盒模型为 IE 盒模型而非标准模式下的 W3C 盒模型：在 IE 盒模型中， box width = content width + padding left + padding right + border left + border right， box height = content height + padding top + padding bottom + border top + border bottom。 而在 W3C 标准的盒模型中，box 的大小就是 content 的大小。
2. 图片元素的垂直对齐方式:
  对于 inline 元素和 table-cell 元素，在 IE Standards Mode 下 vertical-align 属性默认取值为 baseline 。而当 inline 元素的内容只有图片时，如 table 的单元格 table-cell 。在 IE Quirks Mode 下，table 单元格中的图片的 vertical-align 属性默认为 bottom，因此在图片底部会有几像素的空间。
3. `<table>`元素中的字体:
  CSS 中，描述 font 的属性有 font-family，font-size，font-style，font-weigh, 上述属性都是可以继承的。而在 IE Quirks Mode 下，对于 table 元素，字体的某些属性将不会从 body 或其他封闭元素继承到 table 中，特别是 font-size 属性。
4. 内联元素的尺寸:
  在 IE Standards Mode 下，non-replaced inline 元素无法自定义大小，而在 IE Quirks Mode 下，定义这些元素的 width 和 height 属性，能够影响该元素显示的大小尺寸。
5. 元素的百分比高度:
    - CSS 中对于元素的百分比高度规定如下，百分比为元素包含块的高度，不可为负值。如果包含块的高度没有显式给出，该值等同于`auto`（即取决于内容的高度）。所以百分比的高度必须在父元素有声明高度时使用。
    - 当一个元素使用百分比高度时，在 IE Standards Mode 下，高度取决于内容的变化，而在 Quirks Mode 下，百分比高度则被正确应用。
6. 元素溢出的处理：
  在 IE Standard Mode 下，overflow 取默认值 visible，即溢出可见，这种情况下，溢出内容不会被裁剪，呈现在元素框外。而在 Quirks Mode 下，该溢出被当做扩展 box 来对待，即元素的大小由其内容决定，溢出不会被裁剪，元素框自动调整，包含溢出内容。

## 使用 XHTML 的局限有哪些？如果页面使用 `application/xhtml+xml` 会有什么问题吗？

xhtml 语法要求严格，必须有 head、body 每个 dom 必须要闭合。空标签也必须闭合。例如 `<img />`, `<br/>`, `<input/>` 等。另外要在属性值上使用双引号。一旦遇到错误，立刻停止解析，并显示错误信息。 如果页面使用 `application/xhtml+xml`，一些老的浏览器会不兼容。

## 请描述一下 GET 和 POST 的区别?

区别如下：

- get 向指定的资源请求数据,请求的数据会附在 URL 之后,就是把数据放置在请求行（request line）中），以 ? 分割 URL 和传输数据，多个参数用 & 连接；
- post 向指定的资源提交要被处理的数据。get 方法，查询请求是在 url 中显示的，有长度限制，get 方法是安全幂等的。而 post 方法请求是封装在 http 消息包体中

|类型|get|post|
|:---:|:---:|:---:|
|后退/刷新|无害|请求重新提交|
|书签|可做书签|不可做|
|缓存|可被缓存|不能被缓存|
|历史|保留在浏览器记录里|不保留|
|对数据长度限制|限制（2048字符）|不限制|
|安全性|url中暴露数据|相对安全|
|可见性|url中可见|不可见|

总结：

- 对于 get 来说，是向服务器端请求数据，其请求在 url 中可见，其长度有限制（2048字符），个体方法是安全幂等，这里的安全是指用于获取信息而非修改信息，幂等是指每次请求得到的结果都一样。
- 对于 post 来说，是向服务器端提交数据，每次刷新或者后退都会重新提交，post 请求的数据封装在 http 请求的首部里。

## 前端需要注意哪些SEO

1. 合理的 title、description、keywords：搜索对着三项的权重逐个减小，title 值强调重点即可，重要关键词出现不要超过2次，而且要靠前，不同页面 title 要有所不同；description 把页面内容高度概括，长度合适，不可过分堆砌关键词，不同页面 description 有所不同；keywords 列举出重要关键词即可
2. 语义化的 HTML 代码，符合 W3C 规范：语义化代码让搜索引擎容易理解网页
3. 重要内容 HTML 代码放在最前：搜索引擎抓取 HTML 顺序是从上到下，有的搜索引擎对抓取长度有限制，保证重要内容一定会被抓取
4. 重要内容不要用 js 输出：爬虫不会执行 js 获取内容
5. 少用 iframe：搜索引擎不会抓取 iframe 中的内容
6. 非装饰性图片必须加 alt
7. 提高网站速度：网站速度是搜索引擎排序的一个重要指标

## web开发中会话跟踪的方法有哪些

1. cookie
    使用账号密码无密码登录网站，提交购物支付
2. session
3. url重写
    1. 客户端禁止使用Cookie使用，encodeURL防止账号密码泄露
    2. 比如把 `http://blog.csdn.net/ default.aspx ?name=simonlv&password=11111` 变成为 `http://blog.csdn.net/simonlv/` 或者  `http://blog.csdn.net/default.aspx;name=%$#%@$&password=$#@$#@`
4. 隐藏表单域
    当第一张页面提交后，服务器端作出响应返回第二张页面，此页面中用隐藏域记录了来自登陆时的用户名
5. ip地址

## `img` 的 `title` 和 `alt` 有什么区别

1. title 是 [global attributes](http://www.w3.org/TR/html-markup/global-attributes.html#common.attrs.core) 之一，用于为元素提供附加的 advisory information。通常当鼠标滑动到元素上的时候显示。
2. alt 是 `<img>` 的特有属性，是图片内容的等价描述，用于图片无法加载时显示、读屏器阅读图片。可提图片高可访问性，除了纯装饰图片外都必须设置有意义的值，搜索引擎会重点分析。

## HTML全局属性(global attribute)有哪些

参考资料：[MDN: html global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes) 或者 [W3C HTML global-attributes](http://www.w3.org/TR/html-markup/global-attributes.html#common.attrs.core)

- `accesskey`:设置快捷键，提供快速访问元素如 aaa 在 windows 下的 firefox 中按 alt + shift + a 可激活元素
- `class`:为元素设置类标识，多个类名用空格分开， CSS 和 javascript 可通过 class 属性获取元素
- `contenteditable`: 指定元素内容是否可编辑
- `contextmenu`: 自定义鼠标右键弹出菜单内容
- `data-*`: 为元素增加自定义属性
- `dir`: 设置元素文本方向
- `draggable`: 设置元素是否可拖拽
- `dropzone`: 设置元素拖放类型： copy, move, link
- `hidden`: 表示一个元素是否与文档。样式上会导致元素不显示，但是不能用这个属性实现样式效果
- `id`: 元素 id，文档内唯一
- `lang`: 元素内容的的语言
- `spellcheck`: 是否启动拼写和语法检查
- `style`: 行内 css 样式
- `tabindex`: 设置元素可以获得焦点，通过 tab 可以导航
- `title`: 元素相关的建议信息
- `translate`: 元素和子孙节点内容是否需要本地化

## 什么是web语义化,有什么好处

web 语义化是指通过 HTML 标记表示页面包含的信息，包含了 HTML 标签的语义化和 css 命名的语义化。HTML 标签的语义化是指：通过使用包含语义的标签（如h1-h6）恰当地表示文档结构 css 命名的语义化是指：为 html 标签添加有意义的 class，id 补充未表达的语义，如 Microformat 通过添加符合规则的 class 描述信息。

为什么需要语义化：

- 去掉样式后页面呈现清晰的结构
- 盲人使用读屏器更好地阅读
- 搜索引擎更好地理解页面，有利于收录
- 便于团队项目的可持续运作及维护

## HTTP method

1. 一台服务器要与 HTTP1.1 兼容，只要为资源实现 GET 和 HEAD 方法即可
2. GET 是最常用的方法，通常用于请求服务器发送某个资源。
3. HEAD 与 GET 类似，但服务器在响应中值返回首部，不返回实体的主体部分
4. PUT 让服务器用请求的主体部分来创建一个由所请求的 URL 命名的新文档，或者，如果那个 URL 已经存在的话，就用这个主体替代它
5. POST 起初是用来向服务器输入数据的。实际上，通常会用它来支持 HTML 的表单。表单中填好的数据通常会被送给服务器，然后由服务器将其发送到要去的地方。
6. TRACE 会在目的服务器端发起一个环回诊断，最后一站的服务器会弹回一个 TRACE 响应并在响应主体中携带它收到的原始请求报文。TRACE 方法主要用于诊断，用于验证请求是否如愿穿过了请求/响应链。
7. OPTIONS 方法请求 web 服务器告知其支持的各种功能。可以查询服务器支持哪些方法或者对某些特殊资源支持哪些方法。
8. DELETE 请求服务器删除 URL 指定的资源

## 从浏览器地址栏输入url到显示页面的步骤(以HTTP为例)

1. 在浏览器地址栏输入 URL
2. 浏览器查看缓存，如果请求资源在缓存中并且新鲜，跳转到转码步骤
    1. 如果资源未缓存，发起新请求
    2. 如果已缓存，检验是否足够新鲜，足够新鲜直接提供给客户端，否则与服务器进行验证
    3. 检验新鲜通常有两个 HTTP 头进行控制 Expires 和 Cache-Control
      - HTTP1.0 提供 Expires，值为一个绝对时间表示缓存新鲜日期
      - HTTP1.1 增加了 Cache-Control: max-age=，值为以秒为单位的最大新鲜时间
3. 浏览器解析 URL 获取协议，主机，端口，path
4. 浏览器组装一个 HTTP（ GET ） 请求报文
5. 浏览器获取主机 IP 地址，过程如下：
    1. 浏览器缓存
    2. 本机缓存
    3. hosts 文件
    4. 路由器缓存
    5. ISP DNS 缓存
    6. DNS 递归查询（可能存在负载均衡导致每次 IP 不一样）
6. 打开一个 socket 与目标 IP 地址，端口建立 TCP 链接，三次握手如下：
    1. 客户端发送一个 TCP 的 SYN=1，Seq=X 的包到服务器端口
    2. 服务器发回 SYN=1，ACK=X+1，Seq=Y 的响应包
    3. 客户端发送 ACK=Y+1，Seq=Z
7. TCP 链接建立后发送 HTTP 请求
8. 服务器接受请求并解析，将请求转发到服务程序，如虚拟主机使用 HTTP Host 头部判断请求的服务程序
9. 服务器检查 HTTP 请求头是否包含缓存验证信息。如果验证缓存新鲜，返回304等对应状态码
10. 处理程序读取完整请求并准备 HTTP 响应，可能需要查询数据库等操作
11. 服务器将响应报文通过 TCP 连接发送回浏览器
12. 浏览器接收 HTTP 响应，然后根据情况选择关闭 TCP 连接或者保留重用，关闭 TCP 连接的四次握手如下：
    1. 主动方发送 Fin=1，ACK=Z，Seq= X 报文
    2. 被动方发送 ACK=X+1，Seq=Z 报文
    3. 被动方发送 Fin=1，ACK=X，Seq=Y 报文
    4. 主动方发送 ACK=Y，Seq=X 报文
13. 浏览器检查响应状态码：是否为1XX，3XX，4XX，5XX，这些情况处理与2XX不同
14. 如果资源可缓存，进行缓存
15. 对响应进行解码（例如 gzip 压缩）
16. 根据资源类型决定如何处理（假设资源为 HTML 文档）
17. 解析 HTML 文档，构造 DOM 树，下载资源，构造 CSSOM 树，执行 js 脚本，这些操作没有严格的先后顺序，以下分别解释
18. 构建 DOM 树：
    1. Tokenizing：根据 HTML 规范将字符流解析为标记
    2. Lexing：词法分析将标记转换为对象并定义属性和规则
    3. DOM construction：根据 HTML 标记关系将对象组成 DOM 树
19. 解析过程中遇到图片、样式表、js 文件，启动下载
20. 构建 CSSOM 树：
    1. Tokenizing：字符流转换为标记流
    2. Node：根据标记创建节点
    3. CSSOM：节点创建 CSSOM 树
21. 根据 DOM 树和 CSSOM 树构建渲染树:
    1. 从 DOM 树的根节点遍历所有可见节点，不可见节点包括：
        1. script,meta 这样本身不可见的标签。
        2. 被 css 隐藏的节点，如 display:none
    2. 对每一个可见节点，找到恰当的 CSSOM 规则并应用
    3. 发布可视节点的内容和计算样式
22. js 解析如下：
    1. 浏览器创建 Document 对象并解析 HTML，将解析到的元素和文本节点添加到文档中，此时 document.readyState 为 loading
    2. HTML 解析器遇到没有 async 和 defer 的 script 时，将他们添加到文档中，然后执行行内或外部脚本。这些脚本会同步执行，并且在脚本下载和执行时解析器会暂停，这样就可以用 document.write() 把文本插入到输入流中。同步脚本经常简单定义函数和注册事件处理程序，他们可以遍历和操作 script 和他们之前的文档内容
    3. 当解析器遇到设置了 async 属性的 script 时，开始下载脚本并继续解析文档。脚本会在它下载完成后尽快执行，但是解析器不会停下来等它下载。异步脚本禁止使用 document.write()，它们可以访问自己 script 和之前的文档元素
    4. 当文档完成解析，document.readyState 变成 interactive
    5. 所有 defer 脚本会按照在文档出现的顺序执行，延迟脚本能访问完整文档树，禁止使用 document.write()
    6. 浏览器在 Document 对象上触发 DOMContentLoaded 事件
    7. 此时文档完全解析完成，浏览器可能还在等待如图片等内容加载，等这些内容完成载入并且所有异步脚本完成载入和执行，document.readyState 变为 complete ,window 触发 load 事件
23. 显示页面（ HTML 解析过程中会逐步显示页面）

## HTTP request报文结构是怎样的

[rfc2616](http://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html)中进行了定义：

1. 首行是 Request-Line 包括：请求方法，请求 URI，协议版本，CRLF
2. 首行之后是若干行请求头，包括 general-header，request-header 或者 entity-header，每个一行以 CRLF 结束
3. 请求头和消息实体之间有一个 CRLF 分隔
4. 根据实际请求需要可能包含一个消息实体 

一个请求报文例子如下：

```html
GET /Protocols/rfc2616/rfc2616-sec5.html HTTP/1.1
Host: www.w3.org
Connection: keep-alive
Cache-Control: max-age=0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36
Referer: https://www.google.com.hk/
Accept-Encoding: gzip,deflate,sdch
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6
Cookie: authorstyle=yes
If-None-Match: "2cc8-3e3073913b100"
If-Modified-Since: Wed, 01 Sep 2004 13:24:52 GMT

name=qiu&age=25
```

## 如何进行网站性能优化

[雅虎Best Practices for Speeding Up Your Web Site:](https://developer.yahoo.com/performance/rules.html)
[前端性能优化最佳实践](/2018/01/05/前端性能优化/)

- content方面
    1. 减少HTTP请求：合并文件、CSS精灵、Inline Image
    2. 减少DNS查询：DNS查询完成之前浏览器不能从这个主机下载任何任何文件。方法：DNS缓存、将资源分布到恰当数量的主机名，平衡并行下载和DNS查询
    3. 避免重定向：多余的中间访问
    4. 使Ajax可缓存
    5. 非必须组件延迟加载
    6. 未来所需组件预加载
    7. 减少DOM元素数量
    8. 将资源放到不同的域下：浏览器同时从一个域下载资源的数目有限，增加域可以提高并行下载量
    9. 减少iframe数量
    10. 不要404

- Server方面
    1. 使用CDN
    2. 添加Expires或者Cache-Control响应头
    3. 对组件使用Gzip压缩
    4. 配置ETag
    5. Flush Buffer Early
    6. Ajax使用GET进行请求
    7. 避免空src的img标签

- Cookie方面
    1. 减小cookie大小
    2. 引入资源的域名不要包含cookie

- css方面
    1. 将样式表放到页面顶部
    2. 不使用CSS表达式
    3. 不使用@import
    4. 不使用IE的Filter

- Javascript方面
    1. 将脚本放到页面底部
    2. 将javascript和css从外部引入
    3. 压缩javascript和css
    4. 删除不需要的脚本
    5. 减少DOM访问
    6. 合理设计事件监听器

- 图片方面
    1. 优化图片：根据实际颜色需要选择色深、压缩
    2. 优化css精灵
    3. 不要在HTML中拉伸图片
    4. 保证favicon.ico小并且可缓存

- 移动方面
    1. 保证组件小于25k
    2. Pack Components into a Multipart Document

## 什么是渐进增强

渐进增强是指在web设计时强调可访问性、语义化HTML标签、外部样式表和脚本。保证所有人都能访问页面的基本内容和功能同时为高级浏览器和高带宽用户提供更好的用户体验。核心原则如下:

- 所有浏览器都必须能访问基本内容
- 所有浏览器都必须能使用基本功能
- 所有内容都包含在语义化标签中
- 通过外部CSS提供增强的布局
- 通过非侵入式、外部javascript提供增强功能
- end-user web browser preferences are respected

## HTTP状态码及其含义

参考[RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)

- 1XX：信息状态码
    - **100 Continue**：客户端应当继续发送请求。这个临时响应是用来通知客户端它的部分请求已经被服务器接收，且仍未被拒绝。客户端应当继续发送请求的剩余部分，或者如果请求已经完成，忽略这个响应。服务器必须在请求完成后向客户端发送一个最终响应。
    - **101 Switching Protocols**：服务器已经理解客户端的请求，并将通过Upgrade消息头通知客户端采用不同的协议来完成这个请求。在发送完这个响应最后的空行后，服务器将会切换到Upgrade消息头中定义的那些协议。
- 2XX：成功状态码
    - **200 OK**：请求成功，请求所希望的响应头或数据体将随此响应返回
    - **201 Created**
    - **202 Accepted**
    - **203 Non-Authoritative Information**
    - **204 No Content**
    - **205 Reset Content**
    - **206 Partial Content**
- 3XX：重定向
    - **300 Multiple Choices**
    - **301 Moved Permanently**
    - **302 Found**
    - **303 See Other**
    - **304 Not Modified**
    - **305 Use Proxy**
    - **306 （unused）**
    - **307 Temporary Redirect**
- 4XX：客户端错误
    - **400 Bad Request**
    - **401 Unauthorized**
    - **402 Payment Required**
    - **403 Forbidden**
    - **404 Not Found**
    - **405 Method Not Allowed**
    - **406 Not Acceptable**
    - **407 Proxy Authentication Required**
    - **408 Request Timeout**
    - **409 Conflict**
    - **410 Gone**
    - **411 Length Required**
    - **412 Precondition Failed**
    - **413 Request Entity Too Large**
    - **414 Request-URI Too Long**
    - **415 Unsupported Media Type**
    - **416 Requested Range Not Satisfiable**
    - **417 Expectation Failed**
- 5XX: 服务器错误
    - **500 Internal Server Error**
    - **501 Not Implemented**
    - **502 Bad Gateway**
    - **503 Service Unavailable**
    - **504 Gateway Timeout**
    - **505 HTTP Version Not Supported**

## `keygen`是正确的HTML5标签吗？

`<keygen>` 标签规定用于表单的密钥对生成器字段。当提交表单时，私钥存储在本地，公钥发送到服务器。是HTML5 标签。

## `bdo` 标签是否可以改变文本方向？

`<bdo>`标签覆盖默认的文本方向。

```html
<bdo dir="rtl">Here is some text</bdo>
```

实现效果：<bdo dir="rtl">Here is some text</bdo>

## 下列HTML代码是否正确？

```html
<figure>
    <img src="myimage.jpg" alt="My image">
    <figcaption>
        <p>This is my self portrait.</p>
    </figcaption>
</figure>
```

正确`<figure>`标签规定独立的流内容（图像、图表、照片、代码等等）。figure 元素的内容应该与主内容相关，但如果被删除，则不应对文档流产生影响。使用`<figcaption>`元素为figure添加标题（caption）。

## 哪种情况下应该使用small标签？当你想在h1标题后创建副标题？还是当在footer里面增加版权信息？

small标签一般使用场景是在版权信息和法律文本里使用，也可以在标题里使用标注附加信息（bootstrap中可见），但不可以用来创建副标题。

>The HTML Small Element (`<small>`) makes the text font size one size smaller (for example, from large to medium, or from small to x-small) down to the browser's minimum font size. In HTML5, this element is repurposed to represent side-comments and small print, including copyright and legal text, independent of its styled presentation.

## 在一个结构良好的web网页里，多个h1标签会不利于SEO吗？

不影响。

>According to Matt Cutts (lead of Google's webspam team and the de facto expert on these things), using multiple `<h1>` tags is fine, as long as you're not abusing it (like sticking your whole page in an `<h1>` and using CSS to style it back to normal size). That would likely have no effect, and might trigger a penalty, as it looks spammy.

>If you have multiple headings and it would be natural to use multiple `<h1>`'s, then go for it.

摘自：<http://www.quora.com/Does-using-multiple-h1-tags-on-a-page-affect-search-engine-rankings>

## 如果你有一个搜索结果页面，你想高亮搜索的关键词。什么HTML 标签可以使用?

`<mark>`标签表现高亮文本。

>The HTML `<mark>` Element represents highlighted text, i.e., a run of text marked for reference purpose, due to its relevance in a particular context. For example it can be used in a page showing search results to highlight every instance of the searched for word.

## 下列代码中scope 属性是做什么的？

```html
<article>
    <h1>Hello World</h1>
    <style scoped>
        p {
            color: #FF0;
        }
    </style>
    <p>This is my text</p>
</article>

<article>
    <h1>This is awesome</h1>
    <p>I am some other text</p>
</article>
```

scoped 属性是一个布尔属性。如果使用该属性，则样式仅仅应用到 style 元素的父元素及其子元素。

## HTML5 支持块级超链接吗？例如：

```html
<article>
    <a href="#">
        <h1>Hello</h1>
        <p>I am some text</p>
    </a>
</article>
```

支持，HTML5中`<a>`元素表现为一个超链接，支持任何行内元素和块级元素。

## 当下列的HTML代码加载时会触发新的HTTP请求吗？

```html
<img src="mypic.jpg" style="visibility: hidden" alt="My picture">
```

会。

## 当下列的HTML代码加载时会触发新的HTTP请求吗？

```html
<div style="display: none;">
    <img src="mypic.jpg" alt="My photo">
</div>
```

会。

## main1.css一定会在alert('Hello world')被加载和编译吗?

```html
<head>
    <link href="main1.css" rel="stylesheet">
    <script>
        alert('Hello World');
    </script>
</head>
```

会。

## 在main2.css获取前main1一定必须被下载解析吗？

```html
<head>
    <link href="main1.css" rel="stylesheet">
    <link href="main2.css" rel="stylesheet">
</head>
```

不一定。

## 在Paragraph 1加载后main2.css才会被加载编译吗？

```html
<head>
    <link href="main1.css" rel="stylesheet">
</head>
<body>
    <p>Paragraph 1</p>
    <p>Paragraph 2</p>
    <link href="main2.css" rel="stylesheet">
</body>
```

是。