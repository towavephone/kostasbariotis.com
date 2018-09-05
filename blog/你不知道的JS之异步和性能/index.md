---
title: 你不知道的JS之异步与性能
categories:
  - 前端
tags: 前端, JS, 你不知道的JS
path: /you-dont-know-js-asynchronism-and-performance/
date: 2018-9-4 11:17:31
---
# 异步：现在与将来

## 分块的程序

- 程序是由多个块组成，只有一个是现在执行，其余的则会在将来执行，最常见的块单位是函数
- 程序中将来执行的部分并不一定在现在运行的部分执行完后就立即执行，也就是现在无法完成的任务将会异步完成
- 从现在到将来的等待最简单的方法是使用一个通常称为回调函数的函数
- 可以同步发送ajax请求，但是建议在任何情况都不应该使用这种方式，因为它会被锁定器UI（按钮、菜单、滚动条等），并阻塞所有用户交互

考虑以下代码：

```js
function now(){
    return 21;
}
function later(){
    answer=answer*2;
    console.log("Meaning of life:",answer);
}
var answer=now();
setTimeout(later,1000);
```

以上代码可以拆分现在和将来部分：

```js
// 现在
function now(){
    return 21;
}
function later(){/*...*/}
var answer=now();
setTimeout(later,1000);
```

```js
// 将来
answer=answer*2;
console.log("Meaning of life:",answer);
```

### 异步控制台

- 宿主环境添加到js中的，在某些条件下某些浏览器的console.log(...)并不会把传入的内容立即输出
- 出现以上情况的原因是，在许多程序中，I/O是非常低速阻塞部分，所以浏览器在后台异步处理控制台I/O能够提高性能

```js
var a={
    index:1
};
console.log(a);//可能为2，由I/O异步化造成
a.index++;
```

#### 解决方法

- 在控制台中使用断点
- 把对象序列化到一个字符串中，以强制指向一次快照，比如通过JSON.stringify()

## 事件循环

```js
//eventLoop是一个用作队列的数组
var eventLoop=[];
var event;
while(true){
    // 一次tick
    if(eventLoop.length>0){
        // 拿到队列中的下一个事件
        event=eventLoop.shift();
        try{
            // 执行下一个事件
            event();
        }catch(err){
            reportError(err);
        }
    }
}
```

事件循环理解：有一个while循环实现的持续运行的循环，循环的每一轮称为一个tick。对每个tick而言，如果在队列中有等待事件，那么就会在队列中摘下一个事件并执行，这些事件就是你的回调函数

setTimeout并没有把你的回调函数挂在事件循环队列中，它所作的是设定一个定时器，当定时器到时后，环境会把你的回调函数放在事件循环中，这样在未来的某个时刻tick会摘下并执行这个回调

回调函数不会再指定的时间间隔之前执行，很可能会在那个时刻运行，也有可能在那之后运行，要根据事件队列的状态来决定

## 并行线程

```js
var a=20;
function foo(){
    a=a+1;
}
function bar(){
    a=a*2;
}
ajax("http://some.url.1",foo);
ajax("http://some.url.2",bar);
```

根据js单线程运行特性，如果foo()运行在bar()之前，a的结果是42，而如果bar()运行在foo()之前，a的结果是41。

如果共享同一数据的js事件并行执行的话，那么问题会变得非常复杂

例如线程a（X和Y是临时内存地址）

foo():

1. 把a的值加载到X
2. 把1保存在Y
3. 执行X加Y，结果保存在X
4. 把X的值保存在a

线程b（X和Y是临时内存地址）

bar():

1. 把a的值加载到X
2. 把2保存在Y
3. 执行X乘Y，结果保存在X
4. 把X的值保存在a

假如按照以下步骤执行

| 步骤  | 执行方法 | 结果  |
| :---: | :------: | :---: |
| 1     | a1       | 20    |
| 2     | b1       | 20    |
| 3     | a2       | 1     |
| 4     | b2       | 2     |
| 5     | a3       | 22    |
| 6     | a4       | 22    |
| 7     | b3       | 44    |
| 8     | b4       | 44    |

按另一种方式运行：

| 步骤  | 执行方法 | 结果  |
| :---: | :------: | :---: |
| 1     | a1       | 20    |
| 2     | b1       | 20    |
| 3     | b2       | 2     |
| 4     | a2       | 1     |
| 5     | b3       | 20    |
| 6     | a3       | 21    |
| 7     | a4       | 21    |
| 8     | b4       | 21    |

所以多线程是非常复杂的，如果不通过特殊的步骤来防止中断和交错运行，可能会得到不确定的行为

js从不跨线程共享数据，但并不保证js总是确定性的，foo和bar的相对顺序的改变可能会导致不同的结果

### 完整运行

由于js单线程特性，foo以及bar中的代码具有原子性，也就是说一旦foo开始运行，它的所有代码都会在bar中的任意代码运行之前完成，或者相反，这称为完整运行特性

```js
var a=1;
var b=2;
function foo(){
    a++;
    b=b*a;
    a=b+3;
}
function bar(){
    b--;
    a=8+b;
    b=a*2;
}
ajax("http://some.url.1",foo);
ajax("http://some.url.2",bar);
```

会被解析为：

```js
//块1
var a=1;
var b=2;
//块2
a++;
b=b*a;
a=b+3;
//块3
b--;
a=8+b;
b=a*2;
```

块2和块3哪个都有可能先运行，所以有两种输出，是函数顺序级别的不确定，而不是多线程下语句的顺序级别

在js的特性中，这种函数顺序的不确定性就是通常所说的竞态条件，foo和bar相互竞争，看谁先运行

## 并发

单线程事件循环是并发的一种形式

### 非交互

如果进程间没有相互影响的话，不确定性是完全可以接受的，如以下代码

```js
var res={};
function foo(results){
    res.foo=results;
}
function bar(result){
    res.bar=results;
}
ajax("http://some.url.1",foo);
ajax("http://some.url.2",bar);
```

不管如何执行，结果一样，这就是非交互

### 交互

更常见的情况是，并发的进程需要交流，通过作用域或DOM间接交互，正如前面介绍的，如果出现这样的交互，就需要对他们的交互进行协调以避免竞态的出现

```js
var res={};
function response(data){
    res.push(data);
}
ajax("http://some.url.1",response);
ajax("http://some.url.2",response);
```

不同的调用顺序会导致数组顺序的不同，这种不确定性很有可能就是竞态条件的bug

需要协调交互顺序来处理竞态条件

```js
var res=[];
function response(data){
    if(data.url=="http://some.url.1"){
        res[0]=data;
    }else{
        res[1]=data;
    }
}
ajax("http://some.url.1",response);
ajax("http://some.url.2",response);
```

有些并发场景不做协调，就总是出错，考虑

```js
var a,b;
function foo(x){
    a=x*2;
    baz();
}
function bar(y){
    b=y*2;
    baz();
}
function baz(){
    console.log(a+b);
}
ajax("http://some.url.1",foo);
ajax("http://some.url.2",bar);
```

在这个例子中，无论bar与foo哪一个先触发，总会使baz过早运行（a或者b处于未定义状态）；但对baz的第二次调用就没有问题，因为这时候a,b都已经可用了

解决方法如下

```js
var a,b;
function foo(x){
    a=x*2;
    if(a&&b){
        baz();
    }
}
function bar(y){
    b=y*2;
    if(a&&b){
        baz();
    }
}
function baz(){
    console.log(a+b);
}
ajax("http://some.url.1",foo);
ajax("http://some.url.2",bar);
```

另一种可能遇到的并发交互条件有时称为竞态(race)，但更精确的叫法是门闩(latch)，它的特性可以描述为只有第一名取胜，不确定性是可以接受的

```js
var a;
function foo(x){
    a=x*2;
    baz();
}
function bar(x){
    a=x/2;
    baz();
}
function baz(){
    console.log(a);
}
ajax("http://some.url.1",foo);
ajax("http://some.url.2",bar);
```

不管哪一个先触发，都会覆盖另外一个给a赋的值，也会重复调用baz

可以通过一个简单的门闩协调这个过程，只让第一个通过

```js
var a;
function foo(x){
    if(!a){
        a=x*2;
        baz();
    }
}
function bar(x){
    if(!a){
        a=x/2;
        baz();
    }
}
function baz(){
    console.log(a);
}
ajax("http://some.url.1",foo);
ajax("http://some.url.2",bar);
```

以上例子只会让第一个运行的通过

### 协作

并发协作：取到一个长期运行的进程，并将其分割成多个步骤或多批任务，使得其他并发进程有机会将自己的运算插入到事件循环队列中交替运行

```js
var res=[];
function response(data){
    res=res.concat(data.map(function(val){
        return val*2;
    })
}
ajax("http://some.url.1",response);
ajax("http://some.url.2",response);
```

假设ajax请求的数据规模达到上千万，那么就会阻塞UI事件的运行，所以需要创建一个协作性更强且不会阻塞事件循环队列的并发系统，可以分批处理这些结果，每次处理后返回事件循环，让其他等待事件有机会运行

```js
var res=[];
function response(data){
    var chunk=data.splice(0,1000);
    res=res.concat(chunk.map(function(val){
            return val*2;
        })
    );
    if(data.length>0){
        //异步调度下一次批处理
        setTimeout(function(){
            response(data);
        },0);
    }
}
ajax("http://some.url.1",response);
ajax("http://some.url.2",response);
```

每次只处理1000条数据，确保运行时间会很短，即使这意味着更多的后续进程，因为事件循环队列的交替运行会提高响应

当然这些结果的顺序是不可预测的，使用setTimeout进行异步调度，其意义在于把这个函数插入到当前事件循环队列的结尾处

## 任务

在ES6中，promise的异步建立在事件循环队列之上，叫做任务队列

它是挂在事件循环队列的每个tick之后的一个队列，任务循环可能无限循环，进而导致程序卡死，无法转移到下一个事件循环tick

设想一个调度任务的API，称之为schedule，考虑

```js
console.log("A");
setTimeout(function(){
    console.log("B");
},0);
schedule(function(){
    console.log("C");
    schedule(function(){
        console.log("D");
    });
});
```

实际打印的结果是ACDB，因为任务处理是在当前事件循环tick结尾处，且定时器触发是为了调度下一个事件循环tick（如果可用的话）

## 语句顺序

代码中语句的顺序和js引擎执行语句的顺序并不一定要一致

```js
var a,b;
a=10;
b=30;
a=a+1;
b=b+1;
console.log(a+b);//42
```

js引擎会这样优化以提高执行速度

```js
var a,b;
a=11;
b=31;
console.log(42);
```

或者

```js
console.log(42);
```

但是有一种场景其中特定的优化是不安全的，因此也是不允许的

```js
var a,b;
a=10;
b=30;
// 我们需要a和b处于递增之前的状态
console.log(a*b);
a=a+1;
b=b+1;
console.log(a+b);
```

还有其他一些例子，其中编译器排序会产生可见的副作用（因此必须禁止），比如会产生副作用的函数调用或ES6代理对象

```js
function foo(){
    console.log(b);
    return 1;
}
var a,b,c;
// ES5.1 getter字面量语法
c={
    get bar(){
        console.log(a);
        return 1;
    }
};
a=10;
b=30;
a+=foo();//30
b+=c.bar;//11
console.log(a+b);//42
```

如果不是代码片段中的语句console.log，js引擎如果愿意的话，本来可以自由的把代码重新排序

```js
//...
a=10+foo();
b=30+c.bar;
//...
```

编译器语句的重排序几乎就是并发和交互的微型隐喻，作为一个一般性的概念，理解后有助于理清异步js的代码流问题

# 回调

## continuation

```js
// A
ajax( "..", function(..){
// C
} );
// B
```

// A 和 // B 表示程序的前半部分（也就是现在的部分），而 // C 标识了程序的后半部分（也就是将来的部分）。前半部分立刻执行，然后是一段时间不确定的停顿。在未来的某个时刻，如果 Ajax 调用完成，程序就会从停下的位置继续执行后半部分。

### 嵌套回调与链式回调

```js
listen( "click", function handler(evt){
    setTimeout( function request(){
        ajax( "http://some.url.1", function response(text){
            if (text == "hello") {
                handler();
            }
            else if (text == "world") {
                request();
            }
        } );
    }, 500) ;
} );
```

这种代码常常被称为回调地狱（callback hell），有时也被称为毁灭金字塔

一开始我们在等待 click 事件，然后等待定时器启动，然后等待 Ajax 响应返回，之后可能再重头开始。

一眼看去，这段代码似乎很自然地将其异步性映射到了顺序大脑计划。

```js
doA(function(){
    doB();
    doC(function(){
        doD();
    })
    doE();
});
doF();
```

实际运行顺序：doA()、doF()、doB()、doC()、doE()、doD()

我们的顺序阻塞式的大脑计划行为无法很好地映射到面向回调的异步代码，这就是回调方式最主要的缺陷

## 信任问题

顺序的人脑计划和回调驱动的异步 JavaScript 代码之间的不匹配只是回调问题的一部分。还有一些更深入的问题需要考虑

```js
// A
ajax( "..", function(..){
// C
} );
// B
```

有时候 ajax(..) （也就是你交付回调 continuation 的第三方）不是你编写的代码，也不在你的直接控制下。多数情况下，它是某个第三方提供的工具

我们把这称为控制反转（inversion of control），也就是把自己程序一部分的执行控制交给某个第三方。在你的代码和第三方工具（一组你希望有人维护的东西）之间有一份并没有明确表达的契约

### 五个回调的故事

假设你是一名开发人员，为某个销售昂贵电视的网站建立商务结账系统。你已经做好了结账系统的各个界面。在最后一页，当用户点击“确定”就可以购买电视时，你需要调用（假设由某个分析追踪公司提供的）第三方函数以便跟踪这个交易。

代码可能是这样：

```js
analytics.trackPurchase(purchaseData, function(){
    chargeCreditCard();
    displayThankyouPage();
});
```

唯一的解释就是那个分析工具出于某种原因把你的回调调用了五次而不是一次。他们的文档中完全没有提到这种情况

经过修补之后，你实现了像下面这样的简单临时代码，大家似乎也很满意：

```js
var tracked = false;
analytics.trackPurchase(purchaseData, function(){
    if (!tracked) {
        tracked = true;
        chargeCreditCard();
        displayThankyouPage();
    }
});
```

但是，后来有一个 QA 工程师问道：“如果他们根本不调用这个回调怎么办？”哎呦！之前你们双方都没有想到这一点。

然后，你开始沿着这个兔子洞深挖下去，考虑着他们调用你的回调时所有可能的出错情况。这里粗略列出了你能想到的分析工具可能出错的情况：

- 调用回调过早（在追踪之前）；
- 调用回调过晚（或没有调用）；
- 调用回调的次数太少或太多（就像你遇到过的问题！）；
- 没有把所需的环境 / 参数成功传给你的回调函数；
- 吞掉可能出现的错误或异常；

这感觉就像是一个麻烦列表，实际上它就是。你可能已经开始慢慢意识到，对于被传给你无法信任的工具的每个回调，你都将不得不创建大量的混乱逻辑。

### 不只是别人的代码

回调并没有为我们提供任何东西来支持类型的检查 / 规范化。我们不得不自己构建全部的机制，而且通常为每个异步回调重复这样的工作最后都成了负担。

回调最大的问题是控制反转，它会导致信任链的完全断裂。

如果你的代码中使用了回调，尤其是但也不限于使用第三方工具，而且你还没有应用某种逻辑来解决所有这些控制反转导致的信任问题，那你的代码现在已经有了 bug，即使它们还没有给你造成损害。隐藏的 bug 也是 bug。

## 省点回调

回调设计存在几个变体，意在解决前面讨论的一些信任问题（不是全部！）。这种试图从回调模式内部挽救它的意图是勇敢的，但却注定要失败。

举例来说，为了更优雅地处理错误，有些 API 设计提供了分离回调（一个用于成功通知，一个用于出错通知）：

```js
function success(data) {
    console.log( data );
}
function failure(err) {
    console.error( err );
}
ajax( "http://some.url.1", success, failure );
```

在这种设计下，API 的出错处理函数 failure() 常常是可选的，如果没有提供的话，就是
假定这个错误可以吞掉。

还有一种常见的回调模式叫作“error-first 风格”（有时候也称为“Node 风格”，因为几乎所有 Node.js API 都采用这种风格），其中回调的第一个参数保留用作错误对象（如果有的话）。如果成功的话，这个参数就会被清空 / 置假（后续的参数就是成功数据）。不过，如果产生了错误结果，那么第一个参数就会被置起 / 置真（通常就不会再传递其他结果）：

```js
function response(err,data) {
    // 出错？
    if (err) {
        console.error( err );
    }
    // 否则认为成功
    else {
        console.log( data );
    }
}
ajax( "http://some.url.1", response );
```

在这两种情况下，都应该注意到以下几点。

这并没有像表面看上去那样真正解决主要的信任问题。这并没有涉及阻止或过滤不想要的重复调用回调的问题，因为现在你可能同时得到成功或者失败的结果，或者都没有，并且你还是不得不编码处理所有这些情况

那么完全不调用这个信任问题又会怎样呢？如果这是个问题的话（可能应该是个问题！），你可能需要设置一个超时来取消事件。可以构造一个工具（这里展示的只是一个“验证概念”版本）来帮助实现这一点

```js
function timeoutify(fn,delay) {
    var intv = setTimeout(function(){
        intv = null;
        fn(new Error( "Timeout!" ));
    }, delay);

    return function() {
        // 还没有超时？
        if (intv) {
            clearTimeout( intv );
            fn.apply( this, arguments );
        }
    };
}
```

以下是使用方式：

```js
// 使用"error-first 风格" 回调设计
function foo(err,data) {
    if (err) {
        console.error( err );
    }
        else {
        console.log( data );
    }
}
ajax( "http://some.url.1", timeoutify( foo, 500 ) );
```

还有一个信任问题是调用过早。在特定应用的术语中，这可能实际上是指在某个关键任务完成之前调用回调。但是更通用地来说，对于既可能在现在（同步）也可能在将来（异步）调用你的回调的工具来说，这个问题是明显的。

这种由同步或异步行为引起的不确定性几乎总会带来极大的 bug 追踪难度

这也引出了一条非常有效的建议：永远异步调用回调，即使就在事件循环的下一轮，这样，所有回调就都是可预测的异步调用了

考虑：

```js
function result(data) {
    console.log( a );
}
var a = 0;
ajax( "..pre-cached-url..", result );
a++;
```

这段代码会打印出 0 （同步回调调用）还是 1 （异步回调调用）呢？这要视情况而定。

```js
function asyncify(fn) {
var orig_fn = fn,
    intv = setTimeout(function(){
        intv = null;
        if (fn) fn();
    }, 0);
    fn = null;
    return function() {
        // 触发太快，在定时器intv触发指示异步转换发生之前？
        if (intv) {
            fn = orig_fn.bind.apply(
            orig_fn,
            // 把封装器的this添加到bind(..)调用的参数中，
            // 以及克里化（currying）所有传入参数
            [this].concat( [].slice.call( arguments ) )
            );
        }
        // 已经是异步
        else {
            // 调用原来的函数
            orig_fn.apply( this, arguments );
        }
    };
}
```

可以像这样使用 asyncify(..) ：

```js
function result(data) {
    console.log( a );
}
var a = 0;
ajax( "..pre-cached-url..", asyncify( result ) );
a++;
```

不管这个 Ajax 请求已经在缓存中并试图对回调立即调用，还是要从网络上取得，进而在将来异步完成，这段代码总是会输出 1 ，而不是 0 —— result(..) 只能异步调用，这意味着 a++ 有机会在 result(..) 之前运行。

可能现在你希望有内建的 API 或其他语言机制来解决这些问题。最终，ES6 带着一些极好
的答案登场了，所以，继续读下去吧！

# Promise

## 什么是 Promise

事实证明，只了解 API 会丢失很多抽象的细节。Promise 属于这样一类工具：通过某人使用它的方式，很容易分辨他是真正理解了这门技术，还是仅仅学习和使用 API而已

### 未来值







