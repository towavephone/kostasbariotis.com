---
title: EventLoop详解
date: 2020-11-30 21:30:56
categories:
- 前端
tags: 前端, JS
path: /event-loop-deep-learn/
---

Take this little bit of JavaScript:

```js
console.log('script start');

setTimeout(function () {
  console.log('setTimeout');
}, 0);

Promise.resolve()
  .then(function () {
    console.log('promise1');
  })
  .then(function () {
    console.log('promise2');
  });

console.log('script end');
```

In what order should the logs appear?

The correct answer: script start, script end, promise1, promise2, setTimeout, but it's pretty wild out there in terms of browser support.

Microsoft Edge, Firefox 40, iOS Safari and desktop Safari 8.0.8 log setTimeout before promise1 and promise2 - although it appears to be a race condition. This is really weird, as Firefox 39 and Safari 8.0.7 get it consistently right.

// TODO https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
