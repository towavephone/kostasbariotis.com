---
title: javascript专题笔记
path: /javascript-subject-note/
date: 2020-6-12 16:46:23
tags: 前端, JS
---

# 跟着 underscore 学防抖

## 前言

在前端开发中会遇到一些频繁的事件触发，比如：

1. window 的 resize、scroll
2. mousedown、mousemove
3. keyup、keydown

为此，我们举个示例代码来了解事件如何频繁的触发：

我们写个 index.html 文件：

```html
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="IE=edge, chrome=1">
    <title>debounce</title>
    <style>
        #container {
            width: 100%;
            height: 200px;
            line-height: 200px;
            text-align: center;
            color: #fff;
            background-color: #444;
            font-size: 30px;
        }
    </style>
  </head>
  <body>
      <div id="container"></div>
      <script src="debounce.js"></script>
  </body>
</html>
```

debounce.js 文件的代码如下：

```js
var count = 1;
var container = document.getElementById('container');

function getUserAction() {
    container.innerHTML = count++;
};

container.onmousemove = getUserAction;
```

我们来看看效果：

![](debounce.gif)

从左边滑到右边就触发了 165 次 getUserAction 函数！

因为这个例子很简单，所以浏览器完全反应的过来，可是如果是复杂的回调函数或是 ajax 请求呢？假设 1 秒触发了 60 次，每个回调就必须在 1000 / 60 = 16.67ms 内完成，否则就会有卡顿出现。

为了解决这个问题，一般有两种解决方案：

1. debounce 防抖
2. throttle 节流

## 防抖

今天重点讲讲防抖的实现。

防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行

## 第一版

根据这段表述，我们可以写第一版的代码：

```js
// 第一版
function debounce(func, wait) {
    var timeout;
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(func, wait);
    }
}
```

如果我们要使用它，以最一开始的例子为例：

```js
container.onmousemove = debounce(getUserAction, 1000);
```

现在随你怎么移动，反正你移动完 1000ms 内不再触发，我才执行事件。看看使用效果：

![](debounce-1.gif)

顿时就从 165 次降成了 1 次!

## this

如果我们在 getUserAction 函数中 console.log(this)，在不使用 debounce 函数的时候，this 的值为：

```js
<div id="container"></div>
```

但是如果使用我们的 debounce 函数，this 就会指向 Window 对象！

所以我们需要将 this 指向正确的对象。

我们修改下代码：

```js
// 第二版
function debounce(func, wait) {
    var timeout;

    return function () {
        var context = this;

        clearTimeout(timeout)
        timeout = setTimeout(function(){
            func.apply(context)
        }, wait);
    }
}
```

## event 对象

JavaScript 在事件处理函数中会提供事件对象 event，我们修改下 getUserAction 函数：

```js
function getUserAction(e) {
    console.log(e);
    container.innerHTML = count++;
};
```

如果我们不使用 debouce 函数，这里会打印 MouseEvent 对象，如图所示：

![](2020-06-15-09-25-04.png)

但是在我们实现的 debounce 函数中，却只会打印 undefined!

所以我们再修改一下代码：

```js
// 第二版
function debounce(func, wait) {
    var timeout;

    return function () {
        var context = this;
        var args = arguments;

        clearTimeout(timeout)
        timeout = setTimeout(function(){
            func.apply(context, args)
        }, wait);
    }
}
```

到此为止，我们修复了两个小问题：

1. this 指向
2. event 对象

## 立刻执行

这个时候，代码已经很是完善了，但是为了让这个函数更加完善，我们接下来思考一个新的需求。

这个需求就是：

我不希望非要等到事件停止触发后才执行，我希望立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行。

想想这个需求也是很有道理的嘛，那我们加个 immediate 参数判断是否是立刻执行。

```js
// 第四版，immediate 代表停止触发 n 秒后立即执行
function debounce(func, wait, immediate) {

    var timeout;

    return function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            // 拿 click 事件为例，如果传递的 immediate 为 true, 那么连续点击过程中仅在第一次点击时执行，后面的点击会被 if (timeout) clearTimeout(timeout); 拦截，点击再多次都不会再次执行；当停止点击 wait 毫秒后，设置 timeout = null; 恢复初始时的状态，这次的第一次点击就不会被 if (timeout) clearTimeout(timeout); 拦截。所以这句必须要加，是比较关键的代码。
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
    }
}
```

再来看看使用效果：

![](debounce-4.gif)

## 返回值

此时注意一点，就是 getUserAction 函数可能是有返回值的，所以我们也要返回函数的执行结果，但是当 immediate 为 false 的时候，因为使用了 setTimeout ，我们将 func.apply(context, args) 的返回值赋给变量，最后再 return 的时候，值将会一直是 undefined，所以我们只在 immediate 为 true 的时候返回函数的执行结果。

```js
// 第五版
function debounce(func, wait, immediate) {

    var timeout, result;

    return function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
        return result;
    }
}
```

## 取消

最后我们再思考一个小需求，我希望能取消 debounce 函数，比如说我 debounce 的时间间隔是 10 秒钟，immediate 为 true，这样的话，我只有等 10 秒后才能重新触发事件，现在我希望有一个按钮，点击后，取消防抖，这样我再去触发，就可以又立刻执行啦，是不是很开心？

为了这个需求，我们写最后一版的代码：

```js
// 第六版
function debounce(func, wait, immediate) {

    var timeout, result;

    var debounced = function () {
        var context = this;
        var args = arguments;

        if (timeout) {
          clearTimeout(timeout);
        }
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        } else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
        return result;
    };

    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
}
```

那么该如何使用这个 cancel 函数呢？依然是以上面的 demo 为例：

```js
var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
    container.innerHTML = count++;
};

var setUseAction = debounce(getUserAction, 10000, true);

container.onmousemove = setUseAction;

document.getElementById("button").addEventListener('click', function(){
    setUseAction.cancel();
})
```

演示效果如下：

![](debounce-cancel.gif)

至此我们已经完整实现了一个 underscore 中的 debounce 函数，恭喜，撒花！

# 节流

节流的原理很简单：

如果你持续触发事件，每隔一段时间，只执行一次事件。

根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所不同。
我们用 leading 代表首次是否执行，trailing 代表结束后是否再执行一次。

关于节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。

## 使用时间戳

让我们来看第一种方法：使用时间戳，当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳(最一开始值设为 0 )，如果大于设置的时间周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。

看了这个表述，是不是感觉已经可以写出代码了…… 让我们来写第一版的代码：

```js
// 第一版
function throttle(func, wait) {
    var previous = 0; 

    return function() {
        var now = +new Date();
        var context = this;
        var args = arguments;
        if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
        }
    }
}
```

例子依然是用讲 debounce 中的例子，如果你要使用：

```js
container.onmousemove = throttle(getUserAction, 1000);
```

效果演示如下：

![](throttle1.gif)

我们可以看到：当鼠标移入的时候，事件立刻执行，每过 1s 会执行一次，如果在 4.2s 停止触发，以后不会再执行事件。

## 使用定时器

接下来，我们讲讲第二种实现方式，使用定时器。

当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。

```js
// 第一版
function throttle(func, wait) {
    var timer; 

    return function() {
        var context = this;
        var args = arguments;
        if (!timer) {
          timer = setTimeout(function() {
            func.apply(context, args);
            timer = null;
          }, wait);
        }
    }
}
```

为了让效果更加明显，我们设置 wait 的时间为 3s，效果演示如下：

![](throttle2.gif)

我们可以看到：当鼠标移入的时候，事件不会立刻执行，晃了 3s 后终于执行了一次，此后每 3s 执行一次，当数字显示为 3 的时候，立刻移出鼠标，相当于大约 9.2s 的时候停止触发，但是依然会在第 12s 的时候执行一次事件。

所以比较两个方法：

1. 第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行
2. 第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件

## 双剑合璧

那我们想要一个什么样的呢？

有人就说了：我想要一个有头有尾的！就是鼠标移入能立刻执行，停止触发的时候还能再执行一次！

所以我们综合两者的优势，然后双剑合璧，写一版代码：

```js
// 第三版
function throttle(func, wait) {
    var timeout, context, args;
    var previous = 0;

    var later = function() {
        previous = +new Date();
        timeout = null;
        func.apply(context, args);
    };

    var throttled = function() {
        var now = +new Date();
        // 下次触发 func 剩余的时间
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
         // 如果没有剩余的时间了或者你改了系统时间
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
        } else if (!timeout) {
            timeout = setTimeout(later, remaining);
        }
    };

    return throttled;
}
```

效果演示如下：

![](throttle3.gif)

我们可以看到：鼠标移入，事件立刻执行，晃了 3s，事件再一次执行，当数字变成 3 的时候，也就是 6s 后，我们立刻移出鼠标，停止触发事件，9s 的时候，依然会再执行一次事件。

## 优化

但是我有时也希望无头有尾，或者有头无尾，这个咋办？

那我们设置个 options 作为第三个参数，然后根据传的值判断到底哪种效果，我们约定:

leading：false 表示禁用第一次执行
trailing: false 表示禁用停止触发的回调

我们来改一下代码：

```js
// 第四版
function throttle(func, wait, options) {
    var timeout, context, args;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
        // 这个作用？
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        func.apply(context, args);
        if (!timeout) {
          context = args = null;
        }
    };

    var throttled = function() {
        var now = new Date().getTime();
        if (!previous && options.leading === false) {
          previous = now;
        }
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            // 因为 setTimeOut 有误差，所以有可能到时间了定时器还没有执行，就会进入时间戳判断逻辑，所以要把定时器删掉
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
            if (!timeout) {
              context = args = null;
            }
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
    };
    return throttled;
}
```

## 取消

在 debounce 的实现中，我们加了一个 cancel 方法，throttle 我们也加个 cancel 方法：

```js
throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
}
```

## 注意

我们要注意 underscore 的实现中有这样一个问题：

那就是 leading：false 和 trailing: false 不能同时设置。

如果同时设置的话，比如当你将鼠标移出的时候，因为 trailing 设置为 false，停止触发的时候不会设置定时器，所以只要再过了设置的时间，再移入的话，就会立刻执行，就违反了 leading: false，bug 就出来了，所以，这个 throttle 只有三种用法：

```js
container.onmousemove = throttle(getUserAction, 1000);
container.onmousemove = throttle(getUserAction, 1000, {
    leading: false
});
container.onmousemove = throttle(getUserAction, 1000, {
    trailing: false
});
```

# 数组去重

## 双层循环

```js
var array = [1, 1, '1', '1'];

function unique(array) {
    // res用来存储结果
    var res = [];
    for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
        for (var j = 0, resLen = res.length; j < resLen; j++ ) {
            // 相等说明可能有重复值
            if (array[i] === res[j]) {
                break;
            }
        }
        // 如果 array[i] 是唯一的，那么执行完循环，j 等于resLen
        if (j === resLen) {
            res.push(array[i]);
        }
    }
    return res;
}

console.log(unique(array)); // [1, "1"]
```

在这个方法中，我们使用循环嵌套，最外层循环 array，里面循环 res，如果 `array[i]` 的值跟 `res[j]` 的值相等，就跳出循环，如果都不等于，说明元素是唯一的，这时候 j 的值就会等于 res 的长度，根据这个特点进行判断，将值添加进 res。

看起来很简单吧，之所以要讲一讲这个方法，是因为——————兼容性好！

## indexOf

我们可以用 indexOf 简化内层的循环：

```js
var array = [1, 1, '1'];

function unique(array) {
    var res = [];
    for (var i = 0, len = array.length; i < len; i++) {
        var current = array[i];
        if (res.indexOf(current) === -1) {
            res.push(current);
        }
    }
    return res;
}

console.log(unique(array));
```

## 排序后去重

试想我们先将要去重的数组使用 sort 方法排序后，相同的值就会被排在一起，然后我们就可以只判断当前元素与上一个元素是否相同，相同就说明重复，不相同就添加进 res，让我们写个 demo：

```js
var array = [1, 1, '1'];

function unique(array) {
    var res = [];
    var sortedArray = array.concat().sort();
    var seen;
    for (var i = 0, len = sortedArray.length; i < len; i++) {
        // 如果是第一个元素或者相邻的元素不相同
        if (!i || seen !== sortedArray[i]) {
            res.push(sortedArray[i])
        }
        seen = sortedArray[i];
    }
    return res;
}

console.log(unique(array));
```

如果我们对一个已经排好序的数组去重，这种方法效率肯定高于使用 indexOf。

## unique API

知道了这两种方法后，我们可以去尝试写一个名为 unique 的工具函数，我们根据一个参数 isSorted 判断传入的数组是否是已排序的，如果为 true，我们就判断相邻元素是否相同，如果为 false，我们就使用 indexOf 进行判断

```js
var array1 = [1, 2, '1', 2, 1];
var array2 = [1, 1, '1', 2, 2];

// 第一版
function unique(array, isSorted) {
    var res = [];
    var seen = [];

    for (var i = 0, len = array.length; i < len; i++) {
        var value = array[i];
        if (isSorted) {
            if (!i || seen !== value) {
                res.push(value)
            }
            seen = value;
        }
        else if (res.indexOf(value) === -1) {
            res.push(value);
        }        
    }
    return res;
}

console.log(unique(array1)); // [1, 2, "1"]
console.log(unique(array2, true)); // [1, "1", 2]
```

## 优化

尽管 unqique 已经可以试下去重功能，但是为了让这个 API 更加强大，我们来考虑一个需求：

新需求：字母的大小写视为一致，比如'a'和'A'，保留一个就可以了！

虽然我们可以先处理数组中的所有数据，比如将所有的字母转成小写，然后再传入unique函数，但是有没有方法可以省掉处理数组的这一遍循环，直接就在去重的循环中做呢？让我们去完成这个需求：

```js
var array3 = [1, 1, 'a', 'A', 2, 2];

// 第二版
// iteratee 英文释义：迭代 重复
function unique(array, isSorted, iteratee) {
    var res = [];
    var seen = [];

    for (var i = 0, len = array.length; i < len; i++) {
        var value = array[i];
        var computed = iteratee ? iteratee(value, i, array) : value;
        if (isSorted) {
            if (!i || seen !== computed) {
                res.push(value)
            }
            seen = computed;
        } else if (iteratee) {
            if (seen.indexOf(computed) === -1) {
                seen.push(computed);
                res.push(value);
            }
        } else if (res.indexOf(value) === -1) {
            res.push(value);
        }        
    }
    return res;
}

console.log(unique(array3, false, function(item){
    return typeof item == 'string' ? item.toLowerCase() : item
})); // [1, "a", 2]
```

在这一版也是最后一版的实现中，函数传递三个参数：

array：表示要去重的数组，必填

isSorted：表示函数传入的数组是否已排过序，如果为 true，将会采用更快的方法进行去重

iteratee：传入一个函数，可以对每个元素进行重新的计算，然后根据处理的结果进行去重

至此，我们已经仿照着 underscore 的思路写了一个 unique 函数，具体可以查看 Github。

## filter

ES5 提供了 filter 方法，我们可以用来简化外层循环：

比如使用 indexOf 的方法：

```js
var array = [1, 2, 1, 1, '1'];

function unique(array) {
    var res = array.filter(function(item, index, array){
        return array.indexOf(item) === index;
    })
    return res;
}

console.log(unique(array));
```

排序去重的方法：

```js
var array = [1, 2, 1, 1, '1'];

function unique(array) {
    return array.concat().sort().filter(function(item, index, array) {
        return !index || item !== array[index - 1]
    })
}

console.log(unique(array));
```

## Object 键值对

去重的方法众多，尽管我们已经跟着 underscore 写了一个 unqiue API，但是让我们看看其他的方法拓展下视野：

这种方法是利用一个空的 Object 对象，我们把数组的值存成 Object 的 key 值，比如 `Object[value1]` = true，在判断另一个值的时候，如果 `Object[value2]` 存在的话，就说明该值是重复的。示例代码如下：

```js
var array = [1, 2, 1, 1, '1'];

function unique(array) {
    var obj = {};
    return array.filter(function(item, index, array) {
        return obj.hasOwnProperty(item) ? false : (obj[item] = true)
    })
}

console.log(unique(array)); // [1, 2]
```

我们可以发现，是有问题的，因为 1 和 '1' 是不同的，但是这种方法会判断为同一个值，这是因为对象的键值只能是字符串，所以我们可以使用 typeof item + item 拼成字符串作为 key 值来避免这个问题：

```js
var array = [1, 2, 1, 1, '1'];

function unique(array) {
    var obj = {};
    return array.filter(function(item, index, array) {
        return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
    })
}

console.log(unique(array)); // [1, 2, "1"]
```

然而，即便如此，我们依然无法正确区分出两个对象，比如 {value: 1} 和 {value: 2}，因为 typeof item + item 的结果都会是 object[object Object]，不过我们可以使用 JSON.stringify 将对象序列化：

```js
var array = [{value: 1}, {value: 1}, {value: 2}];

function unique(array) {
    var obj = {};
    return array.filter(function(item, index, array) {
        console.log(typeof item + JSON.stringify(item));
        return obj.hasOwnProperty(typeof item + JSON.stringify(item)) ? false : (obj[typeof item + JSON.stringify(item)] = true)
    })
}

console.log(unique(array)); // [{value: 1}, {value: 2}]
```

## ES6

随着 ES6 的到来，去重的方法又有了进展，比如我们可以使用 Set 和 Map 数据结构，以 Set 为例，ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

是不是感觉就像是为去重而准备的？让我们来写一版：

```js
var array = [1, 2, 1, 1, '1'];

function unique(array) {
   return Array.from(new Set(array));
}

console.log(unique(array)); // [1, 2, "1"]
```

甚至可以再简化下：

```js
function unique(array) {
    return [...new Set(array)];
}
```

还可以再简化下：

```js
var unique = (a) => [...new Set(a)]
```

此外，如果用 Map 的话：

```js
function unique (arr) {
    const seen = new Map()
    return arr.filter((a) => !seen.has(a) && seen.set(a, 1))
}
```

## JavaScript 的进化

我们可以看到，去重方法从原始的 14 行代码到 ES6 的 1 行代码，其实也说明了 JavaScript 这门语言在不停的进步，相信以后的开发也会越来越高效。

## 特殊类型比较

去重的方法就到此结束了，然而要去重的元素类型可能是多种多样，除了例子中简单的 1 和 '1' 之外，其实还有 null、undefined、NaN、对象等，那么对于这些元素，之前的这些方法的去重结果又是怎样呢？

在此之前，先让我们先看几个例子：

```js
var str1 = '1';
var str2 = new String('1');

console.log(str1 == str2); // true
console.log(str1 === str2); // false

console.log(null == null); // true
console.log(null === null); // true

console.log(undefined == undefined); // true
console.log(undefined === undefined); // true

console.log(NaN == NaN); // false
console.log(NaN === NaN); // false

console.log(/a/ == /a/); // false
console.log(/a/ === /a/); // false

console.log({} == {}); // false
console.log({} === {}); // false
```

那么，对于这样一个数组

```js
var array = [1, 1, '1', '1', null, null, undefined, undefined, new String('1'), new String('1'), /a/, /a/, NaN, NaN];
```

以上各种方法去重的结果到底是什么样的呢？

我特地整理了一个列表，我们重点关注下对象和 NaN 的去重情况：

|方法 | 结果 | 说明
|:--:|:--:|:--:|
|for循环|[1, "1", null, undefined, String, String, /a/, /a/, NaN, NaN]|对象和 NaN 不去重|
|indexOf|[1, "1", null, undefined, String, String, /a/, /a/, NaN, NaN]|对象和 NaN 不去重|
|sort|	[/a/, /a/, "1", 1, String, 1, String, NaN, NaN, null, undefined]|对象和 NaN 不去重 数字 1 也不去重|
|filter + indexOf|[1, "1", null, undefined, String, String, /a/, /a/]|对象不去重 NaN 会被忽略掉|
|filter + sort|[/a/, /a/, "1", 1, String, 1, String, NaN, NaN, null, undefined]|对象和 NaN 不去重 数字 1 不去重|
|优化后的键值对方法|[1, "1", null, undefined, String, /a/, NaN]|全部去重|
|Set|[1, "1", null, undefined, String, String, /a/, /a/, NaN]|对象不去重、NaN 去重|

想了解为什么会出现以上的结果，看两个 demo 便能明白：

```js
// demo1
var arr = [1, 2, NaN];
arr.indexOf(NaN); // -1
```

indexOf 底层还是使用 === 进行判断，因为 NaN === NaN 的结果为 false，所以使用 indexOf 查找不到 NaN 元素

```js
// demo2
function unique(array) {
   return Array.from(new Set(array));
}
console.log(unique([NaN, NaN])) // [NaN]
```

Set 认为尽管 NaN === NaN 为 false，但是这两个元素是重复的。
