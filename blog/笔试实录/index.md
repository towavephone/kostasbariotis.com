---
title: 笔试实录
categories:
  - 面试
path: /written-examination-record/
tags: 面试, 笔试
date: 2021-4-14 23:22:33
draft: true
---

# 联通产业交互

## this

写出执行结果

```js
(function() {
  var obj = {
    fun1: () => {
      console.log(this);
    },
    fun2: function() {
      console.log(this);
    },
    fun3() {
      console.log(this);
    }
  }

  obj.fun1();
  obj.fun2();
  obj.fun3();
})();
```

```js
window // 箭头函数的 this 根据外层作用域绑定
obj // 隐式绑定，this 指向对象
obj // 同上，不同写法而已
```

## 作用域

```js
(function() {
  var a = "";
  console.log(a);
  console.log(b);
  {
    var b = a = "123";
    let c = b;
  }
  console.log(c);
})();
```

```js
""
undefined
ReferenceError
```

## 异步

```js
async function async1() {
  console.log("1");
  await async2();
  console.log("2");
}
async function async2() {
  console.log("3");
}
console.log("4")
setTimeout(function() {
  console.log("5")
}, 0)
async1();
new Promise(function(resolve) {
  console.log("6")
  resolve()
}).then(function() {
  console.log("7")
})
console.log("8")
```

```js
4
1
3
6
8
2
7
5
```

## 闭包

```js
var count = 10;
function add() {
  var count = 0;
  return function() {
    count += 1;
    console.log(count);
  }
}
var s = add()
s();
s();
```

```js
1
2
```
