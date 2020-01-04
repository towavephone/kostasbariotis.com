---
title: RxJS深入学习
path: /rxjs-deep-learn/
date: 2018-7-30 14:53:35
tags: 前端, RxJS
---

# 合并序列

合并序列也属于创建序列的一种，例如有这样的需求：进入某个页面后拿到了一个列表，然后需要对列表每一项发出一个http请求来获取对应的详细信息，这里我们把每个http请求作为一个序列，然后我们希望合并它们。

合并有很多种方式，例如N个请求按顺序串行发出（前一个结束再发下一个）；N个请求同时发出并且要求全部到达后合并为数组，触发一次回调；N个请求同时发出，对于每一个到达就触发一次回调。

如果不用RxJS，我们会比较难处理这么多情形，不仅实现麻烦，维护更麻烦，下面是使用RxJS对上述需求的解决方案：

```js
const ob1 = Observable.ajax('api/detail/1');
const ob2 = Observable.ajax('api/detail/2');
...
const obs = [ob1, ob2...];
// 分别创建对应的HTTP请求。
```

- N个请求按顺序串行发出（前一个结束再发下一个）

```js
Observable.concat(...obs).subscribe(detail => console.log('每个请求都触发回调'));
```

- N个请求同时并行发出，对于每一个到达就触发一次回调

```js
Observable.merge(...obs).subscribe(detail => console.log('每个请求都触发回调'));
```

- N个请求同时发出并且要求全部到达后合并为数组，触发一次回调

```js
Observable.forkJoin(...obs).subscribe(detailArray => console.log('触发一次回调'));
```

# 使用RxJS实现搜索功能

```js
var text = document.querySelector('#text');
var inputStream = Rx.Observable.fromEvent(text, 'keyup')
                    .debounceTime(250)
                    .pluck('target', 'value')
                    .switchMap(url => Http.get(url))
                    .subscribe(data => render(data));
```

# Subcription

Subscription是什么， 先上代码：

```js
var observable = Rx.Observable.interval(1000);
var subscription = observable.subscribe(x => console.log(x));

setTimeout(() => {
  subscription.unsubscribe();
}, 3100)
```

Rx.Observable.interval可以返回一个能够发射(返回)0， 1， 2， 3...， n数字的Observable， 返回的时间间隔这里是1000ms。 第二行中的变量就是subscription。 

subscription有一个unsubscribe方法, 这个方法可以让subscription订阅的observable发射的数据被observer忽略掉.通俗点说就是取消订阅

unsubscribe存在一个陷阱。 先看代码：

```js
var foo = Rx.Observable.create((observer) => {
  var i = 0
  setInterval(() => {
    observer.next(i++)
    console.log('hello')
  }, 1000)
})

const subcription = foo.subscribe((i) => console.log(i))
subcription.unsubscribe()
```

运行结果：

```js
hello
hello
hello
......
hello
```

unsubscribe只会让observer忽略掉observable发射的数据，但是setInterval依然会继续执行。 这看起来似乎是一个愚蠢的设计。 所以不建议这样写。

# Subject

Subject是一种能够发射数据给多个observer的Observable, 这让Subject看起来就好像是EventEmitter。 先上代码：

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
observerA: 1
observerB: 1
observerA: 2
observerB: 2
```

与Observable不同的是， Subject发射数据给多个observer。 其次， 定义subject的时候并没有传入callback， 这是因为subject自带next, complete, error等方法。从而可以发射数据给observer。 这和EventEmitter很类似。observer并不知道他subscribe的是Obervable还是Subject。 对observer来说是透明的。 而且Subject还有各种派生， 比如说：

## BehaviorSubject 

能够保留最近的数据，使得当有subscribe的时候，立马发射出去。看代码：

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
observerA: 0
observerA: 1
observerA: 2
observerB: 2
observerA: 3
observerB: 3
```

## ReplaySubject 

能够保留最近的一些数据， 使得当有subscribe的时候，将这些数据发射出去。看代码：

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
observerA: 1
observerA: 2
observerA: 3
observerA: 4
observerB: 2
observerB: 3
observerB: 4
observerA: 5
observerB: 5
```

第一行的声明表示ReplaySubject最大能够记录的数据的数量是3。

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
observerA: 5
observerB: 5
```

## subject作为observer

既然subject有next, error, complete三种方法，那subject就可以作为observer！看代码：

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
observerA: 1
observerB: 1
observerA: 2
observerB: 2
observerA: 3
observerB: 3
```

也就是说，observable.subscribe可以传入一个subject来订阅其消息。这就好像是Rxjs中的一颗语法糖，Rxjs有专门的实现。

## Multicasted Observables

Multicasted Observables 是一种借助Subject来将数据发射给多个observer的Observable

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

Rx.Observable.from能够逐一发射数组中的元素， 在multicasted.connect()调用之前的任何subscribe都不会导致source发射数据。multicasted.connect()相当于之前的observable.subscribe(subject)。因此不能将multicasted.connect()写在subscribe的前面。因为这会导致在执行multicasted.connect()的时候source发射数据， 但是subject又没保存数据， 导致两个subscribe无法接收到任何数据。

最好是第一个subscribe的时候能够得到当前已有的数据， 最后一个unsubscribe的时候就停止Observable的执行， 相当于Observable发射的数据都被忽略。

refCount就是能够返回这样的Observable的方法

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
