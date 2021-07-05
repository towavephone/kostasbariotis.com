---
title: HTMLUnknownElement与HTML5自定义元素
date: 2019-12-12 19:33:01
categories:
  - 前端
tags: 前端, DOM, DOM知识点
path: /htmlunknownelement-html5-custom-elements/
---

# HTMLUnknownElement 元素

在网页中，随便写一个标签，例如：

```html
<username>zhangxinxu</username>
```

这个`<username>`就是一个 HTMLUnknownElement 元素。

```js
document.querySelector('username') instanceof HTMLUnknownElement; // 返回值是true
```

在 HTML 规范中，HTMLUnknownElement 元素是一个被认可的合法的元素，CSS 可以无障碍使用，例如：

```css
username {
  text-transform: uppercase;
}
```

则实时效果如下（用户名大写）：

ZHANGXINXU

HTMLUnknownElement 继承 HTMLElement 中的方法，因此，基本上，常用的 HTML 方法都是可以畅快使用的，例如，文字变红色，可以直接：

```js
document.querySelector('username').style.color = 'red';
```

## 不同点

在 HTML 世界中，HTMLUnknownElement 和 HTMLDivElement，HTMLSpanElement 等等都是平级的，平起平坐，都是 HTMLElement 的子集。那其中有没有什么不一样的地方呢？

区别在于，规范中的一部分 HTML 元素自己带有一些特殊的属性或者方法，例如，表单元素 HTMLFormElement 元素有 reset()方法，novalidate 属性。然而，HTMLUnknownElement 自己是没有携带任何属性和方法。

这使其是一件好事，我们就可以为 HTMLUnknownElement 扩展非常私有的方法，而不用担心会影响其他元素。例如来说，默认所有 HTMLUnknownElement 元素的 display 计算值都是 inline，我们可以扩展了 block()方法使其块状化。

```js
HTMLUnknownElement.prototype.block = function() {
  this.style.display = 'block';
};
```

此时执行 document.querySelector('username').block()就可以让`<username>`元素块状化了。

基于原型扩展的方法，还不算太智能，要是可以针对不同标签类型进行扩展就更好了，以下方法就可以做到

# HTMLUnknownElement 与自定义元素（Custom Elements）

W3 规范中，对自定义元素的定义是中间必须要有短横线（就是键盘上的减号）连接，并且浏览器也是这么认为的，例如：

```js
document.createElement('username') instanceof HTMLUnknownElement; // 返回值是true
document.createElement('user-name') instanceof HTMLUnknownElement; // 返回值是false
```

从这一点看，HTMLUnknownElement 一定不是自定义元素，换句通俗的话解释就是“自定义元素不等于随便定义元素”。

# 自定义元素（Custom Elements）

## ES6 下的继承与自定义 HTML 元素类型

对于自定义元素，规范提供了一套各种 HTML 特性可继承可扩展的机制，通常使用套路如下：

1. ES6 class 继承；
2. customElements 定义元素；

先说说目前支持相对较好的匿名自定义元素（Autonomous custom elements），也就是继承自 HTMElement 的用法。

例如，我们实现一个基于 rows 属性多行打点效果的小组件。

注意，下面的演示代码基本上可以作为各类自定义元素（甚至 Web Components）使用的模板，很有用，例如，对于学习类似 Vue 的实时刷新很有帮助，对于学习 Shadow DOM 和 Web Components 也是非常好的案例。以后要实现类似功能，代码拷贝过去，修改修改即可！

```js
class HTMLEllElement extends HTMLElement {
  // 指定观察的属性，这样attributeChangedCallback才会起作用
  static get observedAttributes() {
    return ['rows'];
  }

  constructor() {
    // constructor中首先第一件事情就是调用 super
    // super指代了整个prototype或者__proto__指向的对象
    // 这一步免不了的
    super();
    // 创建shadow元素，实际上，从本例要实现的效果讲，
    // 直接元素上设置也可以，就是HTML丑了点，CSS要放在外部
    // 且目前火狐并不支持shadow dom可以不用，
    // 但一切为了学习，还是展现下现代web组件的实现方式
    var shadow = this.attachShadow({
      // open外部可访问（通过element.shadowRoot），closed则不能
      mode: 'open'
    });
    // 文本内容移动到shadow dom元素中
    var div = document.createElement('div');
    div.innerHTML = this.innerHTML;
    this.innerHTML = '';
    var style = document.createElement('style');
    shadow.appendChild(style);
    shadow.appendChild(div);
  }

  // 下面4个方法为常用生命周期
  connectedCallback() {
    console.log('自定义元素加入页面');
    // 执行渲染更新
    this._updateRendering();
  }

  disconnectedCallback() {
    // 本例子该生命周期未使用，占位示意
    console.log('自定义元素从页面移除');
  }

  adoptedCallback() {
    // 本例子该生命周期未使用，占位示意
    console.log('自定义元素转移到新页面');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('自定义元素属性发生变化');
    this._rows = newValue;
    // 执行渲染更新
    this._updateRendering();
  }

  // 设置直接get/set rows属性的方法
  get rows() {
    return this._rows;
  }

  set rows(v) {
    this.setAttribute('rows', v);
  }

  _updateRendering() {
    // 根据变化的属性，改变组件的UI
    var shadow = this.shadowRoot;
    var childNodes = shadow.childNodes;
    var rows = this._rows;
    for (var i = 0; i < childNodes.length; i++) {
      if (childNodes[i].nodeName === 'STYLE') {
        childNodes[i].textContent = `div {
          display: -webkit-box;
          -webkit-line-clamp: ${rows};
          -webkit-box-orient: vertical;
          overflow: hidden;
        }`;
      }
    }
  }
}
// 定义x-ell标签元素为多行打点元素
customElements.define('x-ell', HTMLEllElement);
```

这段文字如果超过 2 行，就会自动在末尾打点

```html
<style>
  x-ell {
    display: block;
  }
</style>
<x-ell rows="2">对于现代浏览器，例如webkit内核的浏...组合如下。</x-ell>
```

如果想要 3 行打点，也非常简单，直接设置 rows 为 3 即可。我们可以直接手动修改：

```html
<x-ell rows="3"></x-ell>
```

也可以直接一行 JS 直接修改属性：

```js
document.querySelector('x-ell').rows = '3';
```

rows 属性的表现就好像`<textarea>`元素的 rows 属性一样，修改后直接触发了元素本身 UI 的变化，而且是实时的。这就是自定义元素，自己定义一个元素，可以和原生元素一样的行为和特性。

然而兼容性问题不容忽视，如果只考虑 ES6 继承特性，Firefox，Safari 等浏览器也是可以用的，也就是移动端冒进下也是可以使用的。但是自定义元素注册，以及 Shadow DOM 等特性目前就 Chrome，Android 以及 UC 等浏览器支持，因此，只能用在一些内部产品（如中后台管理系统、内部工具）上。Firefox 目前想要支持可以开启实验功能，about:config，然后设置 dom.webcomponents.customelements.enabled 为 true，以及 dom.webcomponents.shadowdom.enabled 为 true。

# 自定义元素与 HTML import 引入

自定义元素还可以在 HTML 模块中使用，目前仅 Chrome 支持。

大致套路这样的：

1. HTML 模块注册与构建自定义元素；
2. 母页面引入模块；
3. 母页面自定义标签自动组件呈现；

例如下面 HTML：

```html
<link rel="import" href="module.html" /> <zxx-info />
```

此时`<zxx-info>`这个元素在页面上呈现出来的效果就是自定义元素

那这个 module.html 究竟做了什么事情呢？就是自定义`<zxx-info>`这个元素。

```html
<template id="tpl">
  <style>
    .scope {
      contain: content;
    }

    .scope > img {
      float: left;
      margin-right: 10px;
    }

    .scope > p {
      margin: 0;
      overflow: hidden;
    }
  </style>
  <div class="scope">
    <img src="zxx.jpg" />
    <p>帅哥一枚！</p>
  </div>
</template>
<script>
  // 定义<zxx-info>
  class HTMLZxxInfoElement extends HTMLElement {
    constructor() {
      super();
      // 内部显示信息
      this.innerHTML = document.currentScript.ownerDocument.querySelector('#tpl').innerHTML;
    }
  }
  // 注册
  customElements.define('zxx-info', HTMLZxxInfoElement);
</script>
```

两部分，一部分模板，一部分自定义元素定义和注册。都是 Web Components 中的概念。

# 即将支持的定制内置元素（Customized built-in elements）

上面自定义元素我们都是继承于 HTMLElement，实际上，HTMLElement 还有非常非常多的内置子集元素，例如上面提到的 HTMLDivElement，HTMLSpanElement，HTMLFormElement 元素等，每一种类型标签几乎都对应一种内置元素。

所谓“定制内置元素”，指的就是我们的自定义元素继承自这些内置元素。

```js
class HTMLCustomFormElement extends HTMLFormElement {
  /* 略 */
}
customElements.define('custom-form', HTMLCustomFormElement);
```

此时，元素`<custom-form>`就有了原生`<form>`的各种属性和方法，例如直接可以使用 reset()方法重置内部表单元素的值。

## 应用

在 HTML 标准中，`<form>`元素是不能相互嵌套的，这就导致一个问题，当我们需要局部重置表单内的某些属性值的时候，就不能使用 reset()方法，因为会误伤其他可能已经输入的值。

例如表单中有很多输入信息，外加一个图片上传。需求是图片选择即上传完毕，此时需要在图片 Ajax 上传完毕后重置 file 类型 input 的值，IE 下值重置不像 Chrome，可以直接设置 value 为空，最佳做法直接`<form>`元素的 reset()方法，此时，我们就可以在 file 类型 input 外面包一层`<custom-form>`标签，这样，HTML 解析时候既没有嵌套问题，又可以使用 reset()方法对表单元素进行重置。
