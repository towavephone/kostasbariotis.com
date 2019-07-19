---
title: 防抖节流的区别与实现
date: 2019-7-19 11:31:28
categories:
- 前端
tags: 前端, 防抖, 节流
path: /debounce-throttle-difference-realize/
---

防抖动是将多次执行变为最后一次执行，节流是将多次执行变成每隔一段时间执行。

# 防抖

触发高频事件后 n 秒内函数只会执行一次，如果 n 秒内高频事件再次被触发，则重新计算时间

## 思路：

每次触发事件时都取消之前的延时调用方法

```js
function debounce(fn) {
  let timeout = null; // 创建一个标记用来存放定时器的返回值
  return function () {
    clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
    // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, 500);
  };
}

function sayHi() {
  console.log('防抖成功');
}

var inp = document.getElementById('inp');
inp.addEventListener('input', debounce(sayHi)); // 防抖
```


# 节流

高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率

## 思路：

每次触发事件时都判断当前是否有等待执行的延时函数

```js
function throttle(fn) {
  let canRun = true; // 通过闭包保存一个标记
  return function () {
    if (!canRun) return; // 在函数开头判断标记是否为 true，不为 true 则 return
      canRun = false; // 立即设置为 false
      setTimeout(() => { // 将外部传入的函数的执行放在 setTimeout 中
        fn.apply(this, arguments);
        // 最后在 setTimeout 执行完毕后再把标记设置为 true(关键) 表示可以执行下一次循环了
        // 当定时器没有执行的时候标记永远是 false，在开头被 return 掉
        canRun = true;
      }, 500);
  };
}

function sayHi(e) {
  console.log(e.target.innerWidth, e.target.innerHeight);
}

window.addEventListener('resize', throttle(sayHi));
```

