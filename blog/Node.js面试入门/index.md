---
title: Node.js面试入门
path: /nodejs-interview-introduce-learn/
date: 2020-11-28 11:19:13
tags: 后端, nodejs
---

# JS 基础问题

## 简述

与前端 Js 不同, 后端方面除了SSR/爬虫之外很少会接触 DOM, 所以关于 DOM 方面的各种知识基本不会讨论.浏览器端除了图形业务外很少碰到内存问题, 但是后端几乎是直面服务器内存的, 更加偏向内存方面, 对于一些更基础的问题也会更加关注.

## 类型判断

看 [lodash](https://github.com/lodash/lodash)

## 作用域

看 《你不知道的js》

## 引用传递

> js 中什么类型是引用传递, 什么类型是值传递? 如何将值类型的变量以引用的方式传递?

简单点说, 对象是引用传递, 基础类型是值传递, 通过将基础类型包装 (boxing) 可以以引用的方式传递.

引用传递和值传递是一个非常简单的问题, 也是理解 JavaScript 中的内存方面问题的一个基础. 如果不了解引用可能很难去看很多问题.

面试写代码的话, 可以通过 `如何编写一个 json 对象的拷贝函数` 等类似的问题来考察对引用的了解. 不过笔者偶尔会有恶趣味, 喜欢先问应聘者对于 == 的 === 的区别的了解. 然后再问 `[1]` == `[1]` 是 true 还是 false. 如果基础不好的同学可能会被自己对于 == 和 === 的结论影响然后得出错误的结论.

对于技术好的, 希望能直接反驳这个问题本身是有问题的, 比如讲清楚 JavaScript 中没有引用传递只是传递引用. 参见 Is JavaScript a pass-by-reference or pass-by-value language?. 虽然说是复杂版, 但是这些知识对于 3 年经验的同学真的应该是很简单的问题了.

另外如果简历中有写 C++, 则必问 `指针与引用的区别`.

## 内存释放

> JavaScript 中不同类型以及不同环境下变量的内存都是何时释放?

引用类型是在没有引用之后, 通过 v8 的 GC 自动回收, 值类型如果是处于闭包的情况下, 要等闭包没有引用才会被 GC 回收, 非闭包的情况下等待 v8 的新生代 (new space) 切换的时候回收.

与前端 Js 不同, 2年以上经验的 Node.js 一定要开始注意内存了, 不说对 v8 的 GC 有多了解, 基础的内存释放一定有概念了, 并且要开始注意内存泄漏的问题了.

你需要了解哪些操作一定会导致内存泄漏, 或者可以崩掉内存. 比如如下代码能否爆掉 V8 的内存?

```js
let arr = [];
while(true)
  arr.push(1);
```

然后上述代码与下方的情况有什么区别?

```js
let arr = [];
while(true)
  arr.push();
```

如果 push 的是 Buffer 情况又会有什么区别?

```js
let arr = [];
while(true)
  arr.push(new Buffer(1000));
```

思考完之后可以尝试找找别的情况如何爆掉 V8 的内存. 以及来聊聊内存泄漏?

```js
function out() {
  const bigData = new Buffer(100);
  inner = function () {
    void bigData;
  }
}
```

闭包会引用到父级函数中的变量，如果闭包未释放，就会导致内存泄漏。上面例子是 inner 直接挂在了 root 上，从而导致内存泄漏（bigData 不会释放）。详见 [如何分析 Node.js 中的内存泄漏](https://zhuanlan.zhihu.com/p/25736931)

对于一些高水平的同学, 要求能清楚的了解 V8 内存 GC 的机制, 懂得内存快照等 (之后会在调试/优化的小结中讨论) 了. 比如 V8 中不同类型的数据存储的位置, 在内存释放的时候不同区域的不同策略等等.

## ES6 新特性

看阮一峰的 [ECMAScript 6 入门](http://es6.ruanyifeng.com/)

比较简单的会问 let 与 var 的区别, 以及 `箭头函数` 与 `function` 的区别等等.

深入的话, es6 有太多细节可以深入了. 比如结合 `引用` 的知识点来询问 const 方面的知识. 结合 `{}` 的使用与缺点来谈 Set, Map 等. 比如私有化的问题与 symbol 等等.

其他像是闭包是什么? 这种问烂了问题已经感觉没必要问了, 取而代之的是询问闭包应用的场景更加合理. 比如说, 如果回答者通常使用闭包实现数据的私有, 那么可以接着问 es6 的一些新特性 (例如 class, symbol) 能否实现私有, 如果能的话那为什么要用闭包? 亦或者是什么闭包中的数据/私有化的数据的内存什么时候释放? 等等.

`...` 的使用上, 如何实现一个数组的去重 (使用 Set 可以加分).

> const 定义的 Array 中间元素能否被修改? 如果可以, 那 const 修饰对象有什么意义?

其中的值可以被修改. 意义上, 主要保护引用不被修改 (如用 Map 等接口对引用的变化很敏感, 使用 const 保护引用始终如一是有意义的), 也适合用在 immutable 的场景.

# 模块

## 常见问题

> 如何在不重启 node 进程的情况下热更新一个 js/json 文件? 这个问题本身是否有问题?

可以清除掉 require.cache 的缓存重新 require(xxx), 视具体情况还可以用 VM 模块重新执行.

当然这个问题可能是典型的 X-Y Problem, 使用 js 实现热更新很容易碰到 v8 优化之后各地拿到缓存的引用导致热更新 js 没意义. 当然热更新 json 还是可以简单一点比如用读取文件的方式来热更新, 但是这样也不如从 redis 之类的数据库中读取比较合理.

## 简述

其他还有很多内容也是属于很 '基础' 的 Node.js 问题 (例如异步/线程等等), 但是由于归类的问题并没有放在这个分类中. 所以这里只简单讲几个之后没归类的基础问题.

## 模块机制

node 的基础中毫无疑问的应该是有关于模块机制的方面的, 也即 require 这个内置功能的一些原理的问题.

关于模块互相引用之类的, 不了解的推荐先好好读读官方文档.

其实官方文档已经说得很清楚了, 每个 node 进程只有一个 VM 的上下文, 不会跟浏览器相差多少, 模块机制在文档中也描述的非常清楚了:

```js
function require(...) {
  var module = { exports: {} };
  ((module, exports) => {
    // Your module code here. In this example, define a function.
    function some_func() {};
    exports = some_func;
    // At this point, exports is no longer a shortcut to module.exports, and
    // this module will still export an empty default object.
    module.exports = some_func;
    // At this point, the module will now export some_func, instead of the
    // default object.
  })(module, module.exports);
  return module.exports;
}
```

> 如果 a.js require 了 b.js, 那么在 b 中定义全局变量 t = 111 能否在 a 中直接打印出来?

每个 .js 能独立一个环境只是因为 node 帮你在外层包了一圈自执行, 所以你使用 t = 111 定义全局变量在其他地方当然能拿到. 情况如下:

```js
// b.js
(function (exports, require, module, __filename, __dirname) {
  t = 111;
})();

// a.js
(function (exports, require, module, __filename, __dirname) {
  // ...
  console.log(t); // 111
})();
```

> a.js 和 b.js 两个文件互相 require 是否会死循环? 双方是否能导出变量? 如何从设计上避免这种问题?

不会, 先执行的导出其未完成的副本, 通过导出工厂函数让对方从函数去拿比较好避免. 模块在导出的只是 var module = { exports: {...} }; 中的 exports, 以从 a.js 启动为例, a.js 还没执行完会返回一个 a.js 的 exports 对象的未完成的副本给 b.js 模块。 然后 b.js 完成加载，并将 exports 对象提供给 a.js 模块。

另外还有非常基础和常见的问题, 比如 module.exports 和 exports 的区别这里也能一并解决了 exports 只是 module.exports 的一个引用. 

再晋级一点, 众所周知, node 的模块机制是基于 CommonJS 规范的. 对于从前端转 node 的同学, 如果面试官想问的难一点会考查关于 CommonJS 的一些问题. 比如比较 AMD（提前执行、依赖前置）, CMD（延迟执行、依赖就近）, CommonJS 三者的区别, 包括询问关于 node 中 require 的实现原理等.

> node 中 require 的实现原理

require 命令是 CommonJS 规范之中，用来加载其他模块的命令。它其实不是一个全局命令，而是指向当前模块的 module.require 命令，而后者又调用 Node 的内部命令 Module._load。

```js
Module._load = function(request, parent, isMain) {
  // 1. 检查 Module._cache，是否缓存之中有指定模块
  // 2. 如果缓存之中没有，就创建一个新的 Module 实例
  // 3. 将它保存到缓存
  // 4. 使用 module.load() 加载指定的模块文件，
  //    读取文件内容之后，使用 module.compile() 执行文件代码
  // 5. 如果加载/解析过程报错，就从缓存删除该模块
  // 6. 返回该模块的 module.exports
};
```

上面的第 4 步，采用 module.compile() 执行指定模块的脚本，逻辑如下。

```js
Module.prototype._compile = function(content, filename) {
  // 1. 生成一个 require 函数，指向 module.require
  // 2. 加载其他辅助方法到 require
  // 3. 将文件内容放到一个函数之中，该函数可调用 require
  // 4. 执行该函数
};
```

上面的第 1 步和第 2 步，require 函数及其辅助方法主要如下。

1. require(): 加载外部模块
2. require.resolve()：将模块名解析到一个绝对路径
3. require.main：指向主模块
4. require.cache：指向所有缓存的模块
5. require.extensions：根据文件的后缀名，调用不同的执行函数

一旦 require 函数准备完毕，整个所要加载的脚本内容，就被放到一个新的函数之中，这样可以避免污染全局环境。该函数的参数包括 require、module、exports，以及其他一些参数。

```js
(function (exports, require, module, __filename, __dirname) {
  // YOUR CODE INJECTED HERE!
});
```

Module._compile 方法是同步执行的，所以 Module._load 要等它执行完成，才会向用户返回 module.exports 的值。

## 热更新

从面试官的角度看, 热更新是很多程序常见的问题. 对客户端而言, 热更新意味着不用换包, 当然也包含着 md5 校验/差异更新等复杂问题; 对服务端而言, 热更新意味着服务不用重启, 这样可用性较高同时也优雅和有逼格. 问的过程中可以一定程度的暴露应聘程序员的水平.

从 PHP 转 node 的同学可能会有些想法, 比如 PHP 的代码直接刷上去就好了, 并没有所谓的重启. 而 node 重启看起来动作还挺大. 当然这里面的区别, 主要是与同时有 PHP 与 node 开发经验的同学可以讨论, 也是很好的切入点.

在 Node.js 中做热更新代码, 牵扯到的知识点可能主要是 require 会有一个 cache, 有这个 cache 在, 即使你更新了 .js 文件, 在代码中再次 require 还是会拿到之前的编译好缓存在 v8 内存 (code space) 中的的旧代码. 但是如果只是单纯的清除掉 require 中的 cache, 再次 require 确实能拿到新的代码, 但是这时候很容易碰到各地维持旧的引用依旧跑的旧的代码的问题. 如果还要继续推行这种热更新代码的话, 可能要推翻当前的架构, 从头开始重新设计一下目前的框架.

不过热更新 json 之类的配置文件的话, 还是可以简单的实现的, 更新 require 的 cache 可以实现, 不会有持有旧引用的问题, 可以参见我 2 年前写着玩的[例子](https://www.npmjs.com/package/auto-reload), 但是如果旧的引用一直被持有很容易出现内存泄漏, 而要热更新配置的话, 为什么不存数据库? 或者用 zookeeper 之类的服务? 通过更新文件还要再发布一次, 但是存数据库直接写个接口配个界面多爽你说是不是?

所以这个问题其实本身其实是值得商榷的, 可能是典型的 X-Y Problem, 不过聊起来确实是可以暴露水平.

## 上下文

对于 Node.js 而言, 正常情况下只有一个上下文, 甚至于内置的很多方面例如 require 的实现只是在启动的时候运行了内置的函数.

每个单独的 .js 文件并不意味着单独的上下文, 在某个 .js 文件中污染了全局的作用域一样能影响到其他的地方.

而目前的 Node.js 将 VM 的接口暴露了出来, 可以让你自己创建一个新的 js 上下文, 这一点上跟前端 js 还是区别挺大的. 在执行外部代码的时候, 通过创建新的上下文沙盒 (sandbox) 可以避免上下文被污染:

```js
'use strict';
const vm = require('vm');

let code =
`(function(require) {

  const http = require('http');

  http.createServer( (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');
})`;

vm.runInThisContext(code)(require);
```

这种执行方式与 eval 和 Function 有明显的区别. 关于 VM 更多的一些接口可以先阅读官方文档 VM (虚拟机)

讲完这个知识点, 这里留下一个简单的问题, 既然可以通过新的上下文来避免污染, 那么为什么 Node.js 不给每一个 .js 文件以独立的上下文来避免作用域被污染? 

> 为什么 Node.js 不给每一个 .js 文件以独立的上下文来避免作用域被污染?
 
node 中 require 的实现原理里面有说明，_compile 函数有调用 vm.runInThisContext 函数，即 Node.js 模块正常情况对作用域不会造成污染，意外创建全局变量是一种例外

# 事件/异步

## Promise

相信很多同学在面试的时候都碰到过这样一个问题, 如何处理 Callback Hell. 在早些年的时候, 大家会看到有很多的解决方案例如 Q, async, EventProxy 等等. 最后从流行程度来看 Promise 当之无愧的独领风骚, 并且是在 ES6 的 JavaScript 标准上赢得了支持.

关于它的基础知识/概念推荐看阮一峰的 Promise 对象 这里就不多不赘述.

> Promise 中 .then 的第二参数与 .catch 有什么区别?

```js
somePromise().then(function () {
  throw new Error('oh noes');
}).catch(function (err) {
  // I caught your error! :)
});

somePromise().then(function () {
  throw new Error('oh noes');
}, function (err) {
  // I didn't catch your error! :(
});
```

建议使用 catch

另外关于同步与异步, 有个问题希望大家看一下, 这是很简单的 Promise 的使用例子:

```js
let doSth = new Promise((resolve, reject) => {
  console.log('hello');
  resolve();
});

doSth.then(() => {
  console.log('over');
});
```

毫无疑问的可以得到以下输出结果:

```
hello
over
```

但是首先的问题是, 该 Promise 封装的代码肯定是同步的, 那么这个 then 的执行是异步的吗?（异步）

其次的问题是, 如下代码, setTimeout 到 10s 之后再 .then 调用, 那么 hello 是会在 10s 之后在打印吗, 还是一开始就打印?（hello 是会在 10s 之后在打印）

```js
let doSth = new Promise((resolve, reject) => {
  console.log('hello');
  resolve();
});

setTimeout(() => {
  doSth.then(() => {
    console.log('over');
  })
}, 10000);
```

以及理解如下代码的执行顺序

```js
setTimeout(function() {
  console.log(1)
}, 0);
new Promise(function executor(resolve) {
  console.log(2);
  for( var i=0 ; i<10000 ; i++ ) {
    i == 9999 && resolve();
  }
  console.log(3);
}).then(function() {
  console.log(4);
});
console.log(5);
```

```
2
3
5
4
1
```

## Events

Events 是 Node.js 中一个非常重要的 core 模块, 在 node 中有许多重要的 core API 都是依赖其建立的. 比如 Stream 是基于 Events 实现的, 而 fs, net, http 等模块都依赖 Stream, 所以 Events 模块的重要性可见一斑.

通过继承 EventEmitter 来使得一个类具有 node 提供的基本的 event 方法, 这样的对象可以称作 emitter, 而触发(emit)事件的 cb 则称作 listener. 与前端 DOM 树上的事件并不相同, emitter 的触发不存在冒泡, 逐层捕获等事件行为, 也没有处理事件传递的方法.

> Eventemitter 的 emit 是同步还是异步?

Node.js 中 Eventemitter 的 emit 是同步的. 

另外, 可以讨论如下的执行结果是输出 `hi 1` 还是 `hi 2`?

```js
const EventEmitter = require('events');

let emitter = new EventEmitter();

emitter.on('myEvent', () => {
  console.log('hi 1');
});

emitter.on('myEvent', () => {
  console.log('hi 2');
});

emitter.emit('myEvent');
```

```
hi 1
hi 2
```

或者如下情况是否会死循环?（会出现）

```js
const EventEmitter = require('events');

let emitter = new EventEmitter();

emitter.on('myEvent', () => {
  console.log('hi');
  emitter.emit('myEvent');
});

emitter.emit('myEvent');
```

以及这样会不会死循环?（不会出现，只是多了一个监听）

```js
const EventEmitter = require('events');

let emitter = new EventEmitter();

emitter.on('myEvent', function sth () {
  emitter.on('myEvent', sth);
  console.log('hi');
});

emitter.emit('myEvent');
```

使用 emitter 处理问题可以处理比较复杂的状态场景, 比如 TCP 的复杂状态机, 做多项异步操作的时候每一步都可能报错, 这个时候 .emit 错误并且执行某些 .once 的操作可以将你从泥沼中拯救出来.

另外可以注意一下的是, 有些同学喜欢用 emitter 来监控某些类的状态, 但是在这些类释放的时候可能会忘记释放 emitter, 而这些类的内部可能持有该 emitter 的 listener 的引用从而导致内存泄漏.

## 阻塞/异步

> 如何判断接口是否异步? 是否只要有回调函数就是异步?

开放性问题, 每个写 node 的人都有一套自己的判断方式.

- 看文档
- console.log 打印看看
- 看是否有 IO 操作

单纯使用回调函数并不会异步, IO 操作才可能会异步, 除此之外还有使用 setTimeout 等方式实现异步.

> 有这样一个场景, 你在线上使用 koa 搭建了一个网站, 这个网站项目中有一个你同事写的接口 A, 而 A 接口中在特殊情况下会变成死循环. 那么首先问题是, 如果触发了这个死循环, 会对网站造成什么影响?

Node.js 中执行 js 代码的过程是单线程的. 只有当前代码都执行完, 才会切入事件循环, 然后从事件队列中 pop 出下一个回调函数开始执行代码. 所以实现一个 sleep 函数, 只要通过一个死循环就可以阻塞整个 js 的执行流程. (关于如何避免坑爹的同事写出死循环, 在后面的测试环节有写到.)

> 如何实现一个 sleep 函数?

```js
function sleep(ms) {
  var start = Date.now(), expire = start + ms;
  while (Date.now() < expire) ;
  return;
}
```

而异步, 是使用 libuv 来实现的 (C/C++的同学可以参见 libev 和 libevent) 另一个线程里的事件队列.

如果在线上的网站中出现了死循环的逻辑被触发, 整个进程就会一直卡在死循环中, 如果没有多进程部署的话, 之后的网站请求全部会超时, js 代码没有结束那么事件队列就会停下等待不会执行异步, 整个网站无法响应.

> 如何实现一个异步的 reduce? (注:不是异步完了之后同步 reduce)

需要了解 reduce 的情况, 是第 n 个与 n + 1 的结果异步处理完之后, 在用新的结果与第 n + 2 个元素继续依次异步下去.

```js
// 当 await memo 不是最先出现时，所有的 sleep 并行执行，因为 await memo 使得函数等待上一个函数完成后执行
// utility function for sleeping
const sleep = (n) => new Promise((res) => setTimeout(res, n));

const arr = [1, 2, 3];
const startTime = new Date().getTime();
const asyncRes = await arr.reduce(async (memo, e) => {
 await sleep(2000);
 console.log(e)
 return (await memo) + e;
}, 0);

console.log(asyncRes, `Took ${new Date().getTime() - startTime} ms`);
```

```
1
2
3
6 "Took 2001 ms"
```

```js
// 当 await memo 最先出现时，这些函数按顺序运行，所有的 sleep 串行执行
const sleep = (n) => new Promise((res) => setTimeout(res, n));
const arr = [1, 2, 3];

const startTime = new Date().getTime();

const asyncRes = await arr.reduce(async (memo, e) => {
 await memo;
 await sleep(2000);
  console.log(e)
 return (await memo) + e;
}, 0);

console.log(asyncRes, `Took ${new Date().getTime() - startTime} ms`);
```

```
1
2
3
6 "Took 6003 ms"
```

## Timers

在笔者这里将 Node.js 中的异步简单的划分为两种, 硬异步和软异步.

硬异步是指由于 IO 操作或者外部调用走 libuv 而需要异步的情况. 当然, 也存在 readFileSync, execSync 等例外情况, 不过 node 由于是单线程的, 所以如果常规业务在普通时段执行可能比较耗时同步的 IO 操作会使得其执行过程中其他的所有操作都不能响应, 有点作死的感觉. 不过在启动/初始化以及一些工具脚本的应用场景下是完全没问题的. 而一般的场景下 IO 操作都是需要异步的.

软异步是指, 通过 setTimeout 等方式来实现的异步. 

> 关于 nextTick, setTimeout 以及 setImmediate 三者的区别

setImmediate vs process.nextTick

- setImmediate() 属于 check 观察者，其设置的回调函数，会插入到下次事件循环的末尾。
- process.nextTick() 设置的回调函数，会在代码运行完成后立即执行，会在下次事件循环之前被调用，原文是 “the callback will fire as soon as the code runs to completion, but before going back to the event loop.”
- process.nextTick() 所设置的回调函数会存放到数组中，一次性执行所有回调函数。
- setImmediate() 所设置的回调函数会存到到链表中，每次事件循环只执行链表中的一个回调函数。

setTimeout(fn, 0) vs setImmediate

执行 setTimeout(fn, 0) 其实就是在执行 setTimeout(fn, 1)，也就是说 setImmediate() 是有可能先于 setTimeout(fn, 0) 执行的。

**Event loop 示例**

```
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

关于事件循环, Timers 以及 nextTick 的关系详见官方文档 The Node.js Event Loop, Timers, and process.nextTick()，[论坛中文讨论](https://cnodejs.org/topic/57d68794cb6f605d360105bf)

## 并行/并发

并行 (Parallel) 与并发 (Concurrent) 是两个很常见的概念.

![](res/2020-12-28-16-48-29.png)

并发 (Concurrent) = 2 队列对应 1 咖啡机.

并行 (Parallel) = 2 队列对应 2 咖啡机.

Node.js 通过事件循环来挨个抽取事件队列中的一个个 Task 执行, 从而避免了传统的多线程情况下 `2个队列对应 1个咖啡机` 的时候上下文切换以及资源争抢/同步的问题, 所以获得了高并发的成就.

至于在 node 中并行, 你可以通过 cluster 来再添加一个咖啡机.

// TODO nodejs 未完待续，下一篇地址：https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/process.md
