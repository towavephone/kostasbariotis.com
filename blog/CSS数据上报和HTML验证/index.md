---
title: CSS数据上报和HTML验证
date: 2019-12-16 22:55:12
categories:
- 前端
tags: 前端, CSS, CSS知识点
path: /css-data-report-html-validate/
---

# 纯CSS实现数据上报

举个例子，要跟踪并统计某个按钮的点击事件：

```css
.button-1:active::after {
  content: url(./pixel.gif?action=click&id=button1);
  display: none;
}
.button-2:active::after {
  content: url(./pixel.gif?action=click&id=button2);
  display: none;
}
```

此时，当我们点击按钮的时候，相关行为数据就会上报给服务器，这种上报，就算把JS禁掉也无法阻止。

点击页面的两个按钮，可以看到发出了如下的请求：

![](2019-12-16-22-57-12.png)

当然，我们可以统计的不仅仅是单击行为，hover行为，focus行为都可以统计，当然，还有很多其他方面的。例如：

## 不支持CSS3浏览器比例统计

```css
.any-element {
  background: url(./pixel.gif?css=2);
  background-image: url(./pixel.gif?css=3), none;
}
```

例如，我的Chrome发出的图片请求地址就是：

![](2019-12-16-22-58-08.png)

类似的，我们可以检测支持其他一些CSS属性的比例，要比单纯看浏览器的占比要精准的多。因为同样是Chrome浏览器，不同用户版本可能不一样，要想准确知道某些CSS新特性支持情况，这种CSS上报方法要更准确。

可以使用@supports规则。

```css
.any-element {
  background: url(./pixel.gif?grid=0);
}

@supports (display: grid) {
  .any-element {
    background: url(./pixel.gif?grid=1);
  }
}
```

## retina屏幕占比统计

要么上报0，要么上报1，最后可以知道retina屏幕的比例。

```css
.any-element {
  background: url(./pixel.gif?retina=0);
}

@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .any-element {
    background: url(./pixel.gif?retina=1);
  }
}
```

例如，我家里的window普通显示屏：

![](2019-12-17-01-15-29.png)

类似的，可以检测宽屏设备比例等。

## 是否支持某字体

例如，用户是否电脑是否安装了思源黑体：

```css
@font-face {
  font-family: anyFontName;
  src: url(../image/pixel.gif?font=unmatch&id=s_h_s);
}

.element-with-text {
  font-family: 'Source Han Sans CN', 'anyFontName';
}
```

这个要看font请求，如果你的浏览器没有安装思源黑体，则会尝试加载anyFontName这个字体，于是发起了请求，如下图所示：

![](2019-12-17-01-16-50.png)

如果安装，则没有上报。

我们还可以借助浏览器原生行为简化我们上报成本，比方说表单验证出错，用来统计用户注册或者其他重要表单操作的成功率。

```css
.track:invalid {
  background: url(./pixel.gif?action=regist&status=invalid);
}

.track:valid {
  background: url(./pixel.gif?action=regist&status=valid);
}
```

每当表单提交的时候，我们给form元素添加类名.track，此时，其会自动上报表单是否填写完全成功，:invalid和:valid都是标准的原生的CSS伪类选择器，我们无需自己写验证逻辑。

JS如下：

```js
forms.addEventListener('submit', function (event) {
  event.preventDefault();
  // 上报成功与否
  this.classList.add('track');
  // 这个是不影响原生表单的提交行为，实际开发多走Ajax
  if (this.reportValidity()) {
      this.submit();
  }
  setTimeout(function () {
      this.classList.remove('track');
  }.bind(this), 0);    
});
```

HTML这里也需要novalidate属性配合下：

```html
<form novalidate></form>
```

不过，这种方法有个缺陷，无论成功与失败，只能上报一次。

表单的reportValidity()方法虽然很省力，但是会呼起浏览器原生的提示，过不了设计师那一关的，因此，恩，大家high一下即可。

# 纯CSS实现HTML验证与提示

再说说另外一个纯CSS应该，那就是进行HTML验证，并且直接在页面上输出来。

举个简单例子，图片如果空alt属性，则高亮这个图片：

```css
img[alt=""] { 
  outline: 2px solid red; 
}
```

又或者_blank链接的rel属性没有加noopener和noreferrer。

```css
a[target="_blank"]:not([rel="noopener noreferrer"]) {
  outline: 2px solid red;
}
```

然后配合伪元素在页面上显示提示的文字：

```css
script[src]:not([async]) {
  display: block;
}
script[src]:not([async])::after {
  content: '试试给带有[src="…"]的<script>元素添加[async]属性';
}
```

然后，就有清闲的有志之士还专门搞了个通过CSS验证检测HTML合法性的CSS库，名为construct.css，项目地址为：https://github.com/t7/construct.css

这里有个demo，有兴趣的可以进去瞅瞅。

使用很简单，你的项目引入这个CSS，那些使用有问题的HTML就会标记并提示，类似下面截图：

![](2019-12-17-01-24-23.png)

# 应用

本文提到的两个CSS的新奇应用，怎么说呢，有点像手工耿哥的的各种手工作品，很有新意，很有特色，可惜，并不实用。

比方说一开始的数据上报，局限很大，很多行为你无法统计；另外维护非常不方便，把一大堆URL地址塞到CSS中，回头要是改个什么东西，很啰嗦的。CSS是偏前前端的玩具，而数据上报偏后的前端更合适，实际开发肯定不会这么玩的，人力资源利用完全没有最大化嘛。

还有那个HTML验证，这年头，还有谁关心HTML语义，结构啥的嘛，小程序，Vue这种HTML结构都是自定义的，和标准越走越远了，没有市场，就没有价值。而且里面很多验证，有些想得太多，空div为什么就不能存在呢？我就想不通了。

因此看来，本文介绍的这两个CSS应用，只适合远观，不适合亵玩。