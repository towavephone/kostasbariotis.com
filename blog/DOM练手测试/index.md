---
title: DOM练手测试
date: 2019-12-26 12:10:17
categories:
- 前端
tags: 前端, DOM
path: /dom-practice-test/
---

# DOM测试一

![](2019-07-22-16-30-47.png)

## 具体实现

### 我的解答

```js
// 第一题
document.getElementsByTagName('a')
// 第二题
document.querySelectorAll('a[href]')
// 第三题
// 1)
[...document.querySelectorAll('a[href^="javascript:"]')].forEach((item) => {
  item.setAttribute('role', 'button');
})
// 2)
[...document.querySelectorAll('a[href]')].forEach((item) => {
    if(item.getAttribute('href') !== location.host) {
        item.setAttribute('target', '_blank');
        item.setAttribute('rel', 'external nofollow noopener');
    }
})
// 3)
[...document.querySelectorAll('a[href^="#"]')].forEach((item) => {
    item.setAttribute('rel', 'internal');
})
```

### 最佳解答

```js
// 第一题
document.getElementsByTagName('a')
// 第二题
// 链接元素与 a 的区别
document.querySelectorAll(':link')
// 第三题
// 1)
[].slice.call(document.querySelectorAll(':link')).forEach((item) => {
  if (item.href.startsWith('javascript:')) {
    item.setAttribute('role', 'button');
  }
  if (item.host === location.host) {
    item.setAttribute('target', '_blank');
    // 包含，不是设置
    item.relList.add('external', 'nofollow', 'noopener');
  }
  // 这里不能用 item.href，会带有 http
  if (item.getAttribute('href').startsWith('#')) {
    item.setAttribute('rel', 'internal');
  }
})
```

## 实现要点

1. 获取所有a元素，两种方法：document.getElementsByTagName('a') 所有浏览器都支持，还有document.querySeletorAll('a')，IE8+。
2. 答案是：document.links或者document.querySelectorAll(':link')都是可以的。链接元素和`<a>`元素的区别：首先没有href属性的`<a>`元素不是链接元素，其次链接元素还包括`<area>`元素（带href）。`document.querySelectorAll('[href]')`的问题在于，普通元素设置href属性也能获取。
3. NodeList直接forEach IE浏览器不支持，Chrome、Firefox也是最近几年才支持。需要转换成数组，使用[].slice.call(links)，IE9+支持的。ES6 `[...aLink]`，Arrar.from((links)转数组（其实没必要，因为支持ES6也就支持NodeList直接forEach）。如有要兼容IE8，那就是for循环。
4. startsWith可以关注下，字符串前匹配。
5. 链接地址和当前地址栏地址host匹配，eleLink.host == location.host。链接元素天然自带：host（包括端口）, hostname, hash等属性，和location对象一样。不要使用hostname有bug，端口不一也会匹配，例如：`<a href="//www.xxxx.com:80">`和URL //www.xxxx.com:90 会认为是一个域下，实际上不是的。
6. rel属性值包含。就是不覆盖原来设置的rel属性值。需要用到relList，需要注意的是多个rel属性值赋值需要使用relList的add方法，而不是直接等于。直接等于不是赋值多个，而是一个，例如：element.relList = ['external', 'nofollow', 'noopener']，最后结果是`<a href rel="external,nofollow,noopener">`是不合法的，应该空格分隔。正确用法（出题本意）：link.relList.add('external', 'nofollow', 'noopener')。relList和classList API细节都是一样的，只不过一个针对class属性，一个是rel属性。
7. link.href.indexOf('#') > -1有bug，例如 href="//otherdomain.com#xxxx"，还有一种/^#/.test(link.href)也是有bug的，因为href属性通过DOM对象直接获取是带有域名的，需要匹配getAttribute获取的href属性值，也就是这里可以/^#/.test(link.getAttribute('href'))

# DOM测试二

![](2019-07-23-09-42-56.png)

## 具体实现

### 我的解答

```js
//第一题
const div = document.createElement('div');
div.style.width = '300px';
div.style.height = '150px';
document.body.appendChild(div);
//第二题
div.style.background = 'linear-gradient(to bottom right, red, blue);';
//第三题
let start = null;
requestAnimationFrame((timestamp) => {
  if (!start) {
    start = timestamp;
  }
  let progress = timestamp - start;
  if (progress > 1000) {
    return;
  }
  div.style.background = 'linear-gradient(to bottom right, red, blue);';
  div.style.background = 'linear-gradient(to bottom right, blue, red);';
})
```

### 最佳解答

<iframe src="/examples/dom-practice/2-1.html" width="400" height="100"></iframe>

`embed:dom-practice/2-1.html`

## 实现要点

1. 通常我们使用JS给DOM元素设置style样式的时候，不通过改变style属性值，因为容器覆盖以前的样式，然后.style.xxx这样的方式不会有性能问题，即使有很多行，因为浏览器它会自动合并成一次解析。
2. to bottom right，这样无论宽高比例是多少都没有问题。没有to就是从右下方开始。
3. CSS渐变本质上是backgroundImage，是无法transition或者animation的，但可以使用JS。seasonley的方法就是大多数人实现的合集，非常感谢。但是非常遗憾，虽然花了很多功夫，但是对于复杂色值，其颜色变化可能并不是最舒服的那种，可能就像早期的Safari色值变化，而且如果有Alpha透明度变化，就很困难了。
4. XboxYan的方法比较接近：我们可以借助animation或者transition本身的颜色变化来赋值，实现更简单，更准确，更接近原生的backgroundImage色值变化效果。我写的小demo：https://output.jsbin.com/hojesabawe
5. 颜色转换的技巧。任意颜色转换为RGB(A)色值，给DOM元素赋值，然后使用getComputedStyle()获取。举个例子，请把色值skyblue转换成RGB色值，div.style.color = 'skyblue'; getComputedStyle(div).color -> RGB色值，所有浏览器都是这样的，包括IE。

# DOM测试三

![](2019-07-24-16-50-00.png)

## 具体实现

### 我的解答

<iframe src="/examples/dom-practice/3-1.html" width="400" height="100"></iframe>

`embed:dom-practice/3-1.html`

### 最佳解答

<iframe src="/examples/dom-practice/3-2.html" width="400" height="100"></iframe>

`embed:dom-practice/3-2.html`

## 实现要点

1. 直接快速滑动是不应该选中的，在手机端，会和滚动交互冲突。
2. 移动端长按网页会弹出默认菜单，取消方法：https://codepen.io/wingmeng/pen/PvymKN
3. wingmeng的碰撞检测没有问题。
4. createDocumentFragment片段创建提高性能，requestAnimationFrame提高绘制性能，缓存box位置，resize的时候无需重新获取，提高性能。Seasonley是一个比较关注性能的伙伴。
5. 三人行，必有我师。longclick的检测，我们以前全部都使用setTimeout，XboxYan使用了一个transition检测，配合transitionend回调。这种方法很巧妙，也有一个优点，我们无需clearTimeout这样的操作，浏览器帮我执行了取消检测。也不是完全完美，移动端还需要多多检测下。
6. 移动和PC可以统一使用方法，不同设备下mousedown/touchstart, mousemove/touchmove, mouseup/touchend，通过判断处理。判断是否是移动设备直接：'ontouchstart' in document.body 。同时document.addEventListener('mouseup', handleup);document.addEventListener('touchend', handleup);这样是有问题的，因为会重复触发handleup。
7. 碰撞检测比较好理解的算法。A盒子最左边比B最左边小，或A盒子最右边比B最右边大，或上小，下大，再整体取非。

# DOM测试四

![](2019-08-02-10-13-17.png)

## 具体实现

### 我的解答

```js
//第一题
document.querySelector('#loginForm');
//第二题
e.preventDefault();
//第三题
[].slice.call(document.querySelectorAll('#loginForm input')).map((item) => item.value)
//第四题
//通过登录按钮disabled实现
//第五题
[].slice.call(document.querySelectorAll('#loginForm input')).concat(document.querySelector('input[name=from]')).map((item) => item.value)
```

## 实现要点

```js
//第一题
document.getElementById('loginForm'); // 方法1：经典的 id 选择器
document.querySelector('#loginForm'); // 方法2：万能的 querySelector
document.forms.loginForm; // 方法3：表单原生方法，还可以写作：document.forms['loginForm']
loginForm; // 方法4：标签的 id 可以直接当变量来用
//第二题
loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
  // 其他操作...
});
//第三题
new FormData(loginForm) // IE10+
//第四题
setAttribute('disabled', '')或者loginForm.querySelector('[type="submit"]').disabled = true;
//第五题
<input name="from" type="hidden" form="loginForm"> // IE10+
```

# DOM测试五

![](2019-08-23-16-22-21.png)

## 具体实现

### 我的解答

```js
//第一题
const element = document.querySelector('textarea')
//第二题
element.rows = 5;
//第三题
element.clientHeight
//第四题
//第五题
```

### 最佳解答

```js
//第一题
const element = document.querySelector('textarea')
//第二题
element.rows = 5;
//第三题
// 用 clientHeight  获取会包含 padding，所以用下面方法获取计算样式来得到高度
const { height } = window.getComputedStyle(myTextarea);
console.log(height);  // Chrome: 75px, FF: 112px
//第四题
// textarea 默认的 lineHeight 值为 normal，此时是无法计算的，而且每个浏览器解析出的 normal 数值存在差异，另外它的值还和字体有关。详情
// 所以想要实现题目中的要求的话，有个大前提就是必须通过 CSS Reset 的方式对 textarea 的行高进行预定义，我这里采用了 Normalize.css 中的相关样式：
// textarea {line-height: 1.15;}
// 然后就可以正常获取行高进行后续计算了：
const { lineHeight } = window.getComputedStyle(myTextarea);
myTextarea.style.height = parseFloat(lineHeight) * myTextarea.rows + 'px';
//第五题
document.addEventListener('DOMNodeInserted', function(event) {
  var elm = event.target;
  if (elm.nodeName.toLowerCase() === 'textarea') {
    var lineHt = window.getComputedStyle(elm).lineHeight;
    elm.style.height = parseFloat(lineHt) * elm.rows + 'px';
  }
});
```

## 实现要点

1. document.querySelector;
2. myTextarea.rows = 5;
3. window.getComputedStyle(myTextarea).height
4. IE下textarea的高度不是行高决定的，而是font-size和font-family。
5. DOMNodeInserted(DOM level 3, IE9+)以及MutationObserver(DOM level 4 IE11+)。前者不是异步的，所以如果有大量的DOM变化和事件处理，性能影响会很明显，MutationObserver则是异步的，先观察，然后一次性处理。
   ```js
   document.addEventListener('DOMNodeInserted', function(event) {
   if (event.target.nodeName.toLowerCase() === 'textarea') {
      //...
   }
   });
   ```

# DOM测试六

![](2019-09-30-17-36-11.png)

## 具体实现

### 我的解答

```js
// 第一题
const dialog = document.createElement('dialog');
document.body.appendChild(dialog);
// 第二题
dialog.open = "fff";
// 第三题
const button = document.createElement('button');
button.onclick = function() {
  dialog.close();
}
dialog.appendChild(button);
// 第四题
// 第五题
```

### 最佳解答

```js
// 第一题
const dialog = document.createElement('dialog');
document.body.appendChild(dialog);
// 第二题
// 方法1：
dialog.open = true;  // 或其他为“真值”的基本类型，如 1，"abc" 等
// 方法2：
dialog.show();
// 方法3：
dialog.showModal();
// 第三题
const btn = document.createElement('button');
btn.innerText = 'close';
btn.addEventListener('click', () => {
  // 方法1：
  dialog.open = false;  // 或其他“非真”的基本类型，如 0、null 等
  // 方法2：
  dialog.close();
});
dialog.appendChild(btn);
// 第四题
// 用 showModal 方法即可让打开的 dialog 自带遮罩，在 CSS 里可通过 ::backdrop 设置遮罩层样式
dialog.showModal();
// 第五题
// 思路：如果是 showModal() 方法打开的 dialog，则其覆盖层级默认是置顶的；而通过 show() 方法或 open 属性打开的 dialog，其覆盖层级遵循“后来居上”原则，所以需要手动调整其 z-index 值来使其覆盖层级置顶。
(function(dialogElm) {
  if (!dialogElm) return;

  const proto = dialogElm.prototype;
  const oldShow = proto.show;
  const dialogBaseLevel = 100;  // 对话框弹层的基准层级（根据项目zIndex规范合理设置）
  const getMaxZIndex = () => {
    const dialogs = document.querySelectorAll('dialog[open]');
    const maxZIndex = Math.max.apply(null, [...dialogs].map(it =>
      it.style.zIndex || Number(window.getComputedStyle(it).zIndex) || dialogBaseLevel
    ));

    return maxZIndex;
  };
  const setMaxZIndex = el => el.style.zIndex = getMaxZIndex() + 1;

  // 重写 show 方法
  proto.show = function() {
    setMaxZIndex(this);
    oldShow.call(this);
  };

  // "劫持" open 属性
  Object.defineProperty(proto, 'open', {
    set: function(value) {
      const isOpen = Boolean(isNaN(value) ? value : Number(value));
      this[isOpen ? 'show' : 'close']();
    }
  });
})(window.HTMLDialogElement);
```

## 实现要点

1. createElement的时候，里面的标签名称是不区分大小写的。appendChild这里也可以使用append这个API，新API，IE不支持，如果是HTML字符串，会自动转义为安全的纯本文。
2. 如果直接.open，则根据值是否 == true/false判断是否弹框显示；如果是setAttribute方法，则任意字符串和值。
3. `<dialog>`关闭使用.close()方法。
4. dialog.showModal()自带本透明蒙层。如果我们想要修改透明度，可以使用::backdrop伪元素进行设置。
5. showModal 时后弹框层级就是最高，其他元素设置再高的z-index值都无效。但是show()显示的就不一样了，我们需要动态计算处理，原理：遍历所有dialog再把最大的zindex加1。

# DOM测试七

![](2019-11-26-19-54-57.png)

## 具体实现

### 我的解答

```js
// 第一题
document.querySelector('#list').addEventListener('click', function(e) {
  if (e.target.tagName === 'LI') {
    [].slice.apply(document.querySelectorAll('#list li')).forEach(function(item) {
      item.classList.remove('selected');
    })
    document.querySelector('#input').value = e.target.innerText;
    e.target.classList.add('selected');
  }
});
// 第二题
document.addEventListener('keydown', function(e) {
   var li = [].slice.apply(document.querySelectorAll('#list li'));
   var selectedIndex = 0;
   li.forEach(function(item, index) {
     if ([].slice.apply(item.classList).indexOf('selected') !== -1) {
       item.classList.remove('selected');
       selectedIndex = index + 1;
     }
   })
   if (e && e.keyCode === 38) {
     const index = (selectedIndex - 1) % (li.length + 1);
     let realIndex = index;
     if (index === -1 || index === 0) {
       realIndex = li.length;
     }
     document.querySelector('#list li:nth-child('+ realIndex + ')').click();
   }
   if (e && e.keyCode === 40) {
     console.log(selectedIndex);
     const index = (selectedIndex + 1) % (li.length + 1);
     const realIndex = index === 0 ? 1 : index;
     document.querySelector('#list li:nth-child('+ realIndex + ')').click();
}
});
```

## 实现要点

1. 点击事件绑定在 #list 列表容器上是更合适的，两点原因：
   1. 开销更小；
   2. 更健壮，不要担心里面 li 列表的动态变化（包括刷新更新）。
2. 判断索引是否匹配再进行样式控制是符合人类逻辑的直觉认知的一种方式（因为现实世界重复做一件事情的成本是很高的），但是在程序代码里面并不是最好的实现。逻辑更清晰的实现：选中 .selected 元素并移除（不管是不是点击元素自身），点击元素添加.selected。牺牲不值一提的执行成本，降低逻辑复杂度。意义在于，执行成本是计算机的，逻辑复杂度是给人看的。最终目的都是人更轻松，计算机累一点。
3. 键盘事件在实际开发时候，由于这种列表，都是使用 keydown 事件，不是 keyup。
4. 事件建议绑定在 `<input>` 元素上，全局上下键绑定是会有问题，会和浏览器上下键微调页面滚动高度冲突。
5. input.setAttribute('autocomplete', 'off'); 然后设置 event.preventDefault();
6. event.key 对比 event.keyCode，如果不考虑兼容 IE8 这样的老 IE 浏览器，推荐使用 event.key，键盘是千奇百怪的，操作系统也是多样的，event.keyCode 值会有较大出入（常规键都是一样的），使用 event.key 更保险一点（虽然也不是完全 100% 兼容），也更好记忆。

# DOM测试八

![](2019-12-26-09-59-00.png)

## 具体实现

### 我的解答

```js
// 第一题
function telTrim(strTel) {
    return strTel.match(/[0-9]/g).length === 11 && strTel.replace(/[-\s]/g, '') || strTel;
}
telTrim('132-0803-3621');
telTrim('132-0803-3621@qq.com');
// 第二题
document.querySelector('#form')
document.querySelector('#input')
// 第三题
// 第四题
// 第五题
document.querySelector('#form').addEventListener('submit', function (e) {
  e && e.preventDefault();
  var input = document.querySelector('#input');
  var value = input.value;
  input.value = telTrim(value);
})
```

### 最佳解答

```js
// 第一题
function telTrim(strTel) {
    return strTel.match(/[0-9]/g).length === 11 && strTel.replace(/[-\s]/g, '') || strTel;
}
telTrim('132-0803-3621');
telTrim('132-0803-3621@qq.com');
// 第二题
document.querySelector('#form');
document.querySelector('#input');
// 第三题
// 方法一
document.querySelector('#input').addEventListener('input', function(e) {
  if (e.inputType === "insertFromDrop") {
    e.target.value = telTrim(e.target.value);
  }
});
// 方法二
document.querySelector('#input').addEventListener('drop', function(e) {
  if (e.target.value.length !== 0) {
    return;
  }
  e.preventDefault();
  var text = e.dataTransfer.getData('text');
  e.target.value = telTrim(text);
});
// 方法三
var dragText = '';
window.addEventListener("dragstart", function (event) {
  //copy from https://www.zhangxinxu.com/study/201104/get-selection-text.html
  var userSelection, text;
  if (window.getSelection) {
    //现代浏览器
    userSelection = window.getSelection();
  } else if (document.selection) {
    //IE浏览器 考虑到Opera，应该放在后面
    userSelection = document.selection.createRange();
  }
  if (!(text = userSelection.text)) {
    text = userSelection;
  }
  dragText = text.toString();
});
input.addEventListener("drop", function (e) {
  e.preventDefault();
  this.value = telTrim(dragText);
});
// 第四题
// 方法一
document.querySelector('#input').addEventListener('input', function(e){
  if (e.inputType === 'insertFromPaste') {
    e.target.value = telTrim(e.target.value);
  }
});
// 方法二
// 获取剪贴板数据方法
function getClipboardText(event) {
  var clipboardData = event.clipboardData || window.clipboardData;
  return clipboardData.getData("text");
}
document.querySelector('#input').addEventListener('paste', function(e) {
  e.preventDefault();
  // 默认原始输入框为空
  var txt = getClipboardText(e);
  // console.log(txt);
  var newTxt = telTrim(txt);
  document.execCommand('insertText', false, newTxt);
});
// 第五题
document.querySelector('#form').addEventListener('submit', (e) => {
  e && e.preventDefault();
  var input = document.querySelector('#input');
  var value = input.value;
  input.value = telTrim(value);
})
```

## 实现要点

1. dataTransfer.getData替换是没问题的，但是需要判断，字符为空，有值的时候不应该直接替换（例如livetune的实现）。
2. 插值的处理，拖进来的东西，直接就是替换好的，同时又不会替换之前的值。1. 有人通过获取框选位置，进行替换拼接。2. 是使用document.execCommand插入（ylfeng250粘贴那里）。3. 我认为比较好的实现，直接改变拖拽数据或者粘贴数据，在'dragstart'事件中（dataTransfer.setData以及clipboardData.setData）。
3. 有人使用了定时器，但是体验并不好，会闪一下。
4. 还有一种更容易理解的简单方法，也是看了大家的回答才知道一个新特性，InputEvent.inputType，值包括insertText, deleteContentBackward, insertFromPaste, insertFromDrop以及 formatBold。但是IE并不支持，慎用。可参考ziven27实现。
5. 最后一题，先preventDefault，再过滤，再提交。在表单提交中，写在最后的return true是没有意义的。
6. event.clipboardData || window.clipboardData是比较好的书写，可以兼容IE浏览器。
