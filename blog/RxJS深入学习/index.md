---
title: RxJS深入学习
path: /rxjs-deep-learn/
date: 2018-7-30 14:53:35
tags: 前端, RxJS
---

# 合并序列

合并序列也属于创建序列的一种，例如有这样的需求：进入某个页面后拿到了一个列表，然后需要对列表每一项发出一个 http 请求来获取对应的详细信息，这里我们把每个 http 请求作为一个序列，然后我们希望合并它们。

合并有很多种方式，例如 N 个请求按顺序串行发出（前一个结束再发下一个）；N 个请求同时发出并且要求全部到达后合并为数组，触发一次回调；N 个请求同时发出，对于每一个到达就触发一次回调。

如果不用 RxJS，我们会比较难处理这么多情形，不仅实现麻烦，维护更麻烦，下面是使用 RxJS 对上述需求的解决方案：

```js
const ob1 = Observable.ajax('api/detail/1');
const ob2 = Observable.ajax('api/detail/2');
...
const obs = [ob1, ob2...];
// 分别创建对应的HTTP请求。
```

- N 个请求按顺序串行发出（前一个结束再发下一个）

```js
Observable.concat(...obs).subscribe((detail) => console.log('每个请求都触发回调'));
```

- N 个请求同时并行发出，对于每一个到达就触发一次回调

```js
Observable.merge(...obs).subscribe((detail) => console.log('每个请求都触发回调'));
```

- N 个请求同时发出并且要求全部到达后合并为数组，触发一次回调

```js
Observable.forkJoin(...obs).subscribe((detailArray) => console.log('触发一次回调'));
```

# 使用 RxJS 实现搜索功能

```js
var text = document.querySelector('#text');
var inputStream = Rx.Observable.fromEvent(text, 'keyup')
  .debounceTime(250)
  .pluck('target', 'value')
  .switchMap((url) => Http.get(url))
  .subscribe((data) => render(data));
```

# Subcription

Subscription 是什么， 先上代码：

```js
var observable = Rx.Observable.interval(1000);
var subscription = observable.subscribe((x) => console.log(x));

setTimeout(() => {
  subscription.unsubscribe();
}, 3100);
```

Rx.Observable.interval 可以返回一个能够发射(返回)0， 1， 2， 3...， n 数字的 Observable， 返回的时间间隔这里是 1000ms。 第二行中的变量就是 subscription。

subscription 有一个 unsubscribe 方法, 这个方法可以让 subscription 订阅的 observable 发射的数据被 observer 忽略掉.通俗点说就是取消订阅

unsubscribe 存在一个陷阱。 先看代码：

```js
var foo = Rx.Observable.create((observer) => {
  var i = 0;
  setInterval(() => {
    observer.next(i++);
    console.log('hello');
  }, 1000);
});

const subcription = foo.subscribe((i) => console.log(i));
subcription.unsubscribe();
```

运行结果：

```js
hello
hello
hello
......
hello
```

unsubscribe 只会让 observer 忽略掉 observable 发射的数据，但是 setInterval 依然会继续执行。 这看起来似乎是一个愚蠢的设计。 所以不建议这样写。

# Subject

Subject 是一种能够发射数据给多个 observer 的 Observable, 这让 Subject 看起来就好像是 EventEmitter。 先上代码：

```js
var subject = new Rx.Subject();

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});
subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

subject.next(1);
subject.next(2);
```

运行结果：

```js
observerA: 1;
observerB: 1;
observerA: 2;
observerB: 2;
```

与 Observable 不同的是， Subject 发射数据给多个 observer。 其次， 定义 subject 的时候并没有传入 callback， 这是因为 subject 自带 next, complete, error 等方法。从而可以发射数据给 observer。 这和 EventEmitter 很类似。observer 并不知道他 subscribe 的是 Obervable 还是 Subject。 对 observer 来说是透明的。 而且 Subject 还有各种派生， 比如说：

## BehaviorSubject

能够保留最近的数据，使得当有 subscribe 的时候，立马发射出去。看代码：

```js
var subject = new Rx.BehaviorSubject(0); // 0 is the initial value

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});

subject.next(1);
subject.next(2);

subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

subject.next(3);
```

运行结果：

```js
observerA: 0;
observerA: 1;
observerA: 2;
observerB: 2;
observerA: 3;
observerB: 3;
```

## ReplaySubject

能够保留最近的一些数据， 使得当有 subscribe 的时候，将这些数据发射出去。看代码：

```js
var subject = new Rx.ReplaySubject(3);

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

subject.next(5);
```

运行结果：

```js
observerA: 1;
observerA: 2;
observerA: 3;
observerA: 4;
observerB: 2;
observerB: 3;
observerB: 4;
observerA: 5;
observerB: 5;
```

第一行的声明表示 ReplaySubject 最大能够记录的数据的数量是 3。

## AsyncSubject

只会发射结束前的一个数据

```js
var subject = new Rx.AsyncSubject();

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

subject.next(5);
subject.complete();
```

运行结果：

```js
observerA: 5;
observerB: 5;
```

## subject 作为 observer

既然 subject 有 next, error, complete 三种方法，那 subject 就可以作为 observer！看代码：

```js
var subject = new Rx.Subject();

subject.subscribe({
  next: (v) => console.log('observerA: ' + v)
});
subject.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

var observable = Rx.Observable.from([1, 2, 3]);

observable.subscribe(subject);
```

输出结果：

```js
observerA: 1;
observerB: 1;
observerA: 2;
observerB: 2;
observerA: 3;
observerB: 3;
```

也就是说，observable.subscribe 可以传入一个 subject 来订阅其消息。这就好像是 Rxjs 中的一颗语法糖，Rxjs 有专门的实现。

## Multicasted Observables

Multicasted Observables 是一种借助 Subject 来将数据发射给多个 observer 的 Observable

```js
var source = Rx.Observable.from([1, 2, 3]);
var subject = new Rx.Subject();
var multicasted = source.multicast(subject);

multicasted.subscribe({
  next: (v) => console.log('observerA: ' + v)
});
multicasted.subscribe({
  next: (v) => console.log('observerB: ' + v)
});

multicasted.connect();
```

Rx.Observable.from 能够逐一发射数组中的元素， 在 multicasted.connect()调用之前的任何 subscribe 都不会导致 source 发射数据。multicasted.connect()相当于之前的 observable.subscribe(subject)。因此不能将 multicasted.connect()写在 subscribe 的前面。因为这会导致在执行 multicasted.connect()的时候 source 发射数据， 但是 subject 又没保存数据， 导致两个 subscribe 无法接收到任何数据。

最好是第一个 subscribe 的时候能够得到当前已有的数据， 最后一个 unsubscribe 的时候就停止 Observable 的执行， 相当于 Observable 发射的数据都被忽略。

refCount 就是能够返回这样的 Observable 的方法

```js
var source = Rx.Observable.interval(500);
var subject = new Rx.Subject();
var refCounted = source.multicast(subject).refCount();
var subscription1, subscription2, subscriptionConnect;

console.log('observerA subscribed');
subscription1 = refCounted.subscribe({
  next: (v) => console.log('observerA: ' + v)
});

setTimeout(() => {
  console.log('observerB subscribed');
  subscription2 = refCounted.subscribe({
    next: (v) => console.log('observerB: ' + v)
  });
}, 600);

setTimeout(() => {
  console.log('observerA unsubscribed');
  subscription1.unsubscribe();
}, 1200);

setTimeout(() => {
  console.log('observerB unsubscribed');
  subscription2.unsubscribe();
}, 2000);
```

输出结果：

```js
observerA subscribed
observerA: 0
observerB subscribed
observerA: 1
observerB: 1
observerA unsubscribed
observerB: 2
observerB unsubscribed
```
