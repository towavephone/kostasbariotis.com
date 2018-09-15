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

```js
function add(getX,getY,cb) {
    var x, y;
    getX(function(xVal){
        x = xVal;
        // 两个都准备好了？
        if (y != undefined) {
            cb( x + y ); // 发送和
        }
    });
    getY(function(yVal){
        y = yVal;
        // 两个都准备好了？
        if (x != undefined) {
            cb( x + y ); // 发送和
        }
    });
}

// fetchX() 和fetchY()是同步或者异步函数
add(fetchX, fetchY, function(sum){
    console.log( sum ); // 是不是很容易？
});
```

在这段代码中，我们把 x 和 y 当作未来值，并且表达了一个运算 add(..) 。这个运算（从外部看）不在意 x 和 y 现在是否都已经可用。换句话说，它把现在和将来归一化了，因此我们可以确保这个 add(..) 运算的输出是可预测的

为了统一处理现在和将来，我们把它们都变成了将来，即所有的操作都成了异步的

通过 Promise 函数表达这个 x + y 的例子

```js
function add(xPromise,yPromise) {
    // Promise.all([ .. ])接受一个promise数组并返回一个新的promise，
    // 这个新promise等待数组中的所有promise完成
    return Promise.all([xPromise, yPromise])
    // 这个promise决议之后，我们取得收到的X和Y值并加在一起
    .then(function(values){
    // values是来自于之前决议的promise的消息数组
        return values[0] + values[1];
    });
}
// fetchX()和fetchY()返回相应值的promise，可能已经就绪，
// 也可能以后就绪
add(fetchX(), fetchY())
// 我们得到一个这两个数组的和的promise
// 现在链式调用 then(..)来等待返回promise的决议
.then(function(sum){
    console.log(sum); // 这更简单！
});
```

fetchX() 和 fetchY() 是直接调用的，它们的返回值（promise）被传给 add(..) 。这些promise 代表的底层值的可用时间可能是现在或将来，但不管怎样，promise 归一保证了行为的一致性。我们可以按照不依赖于时间的方式追踪值 X 和 Y 。它们是未来值。

第二层是 add(..) （通过 Promise.all([ .. ]) ）创建并返回的 promise。我们通过调用then(..) 等待这个 promise。 add(..) 运算完成后，未来值 sum 就准备好了，可以打印出来。我们把等待未来值 X 和 Y 的逻辑隐藏在了 add(..) 内部。

通过 Promise，调用 then(..) 实际上可以接受两个函数，第一个用于完成情况（如前所示），第二个用于拒绝情况：

```js
add(fetchX(), fetchY()).then(
    // 完成处理函数
    function(sum) {
        console.log( sum );
    },
    // 拒绝处理函数
    function(err) {
        console.error( err ); // 烦！
    }
);
```

如果在获取 X 或 Y 的过程中出错，或者在加法过程中出错， add(..) 返回的就是一个被拒绝的 promise，传给 then(..) 的第二个错误处理回调就会从这个 promise 中得到拒绝值。

Promise 是一种封装和组合未来值的易于复用的机制。

### 完成事件

如前所述，单独的 Promise 展示了未来值的特性。但是，也可以从另外一个角度看待 Promise 的决议：一种在异步任务中作为两个或更多步骤的流程控制机制，时序上的 this-then-that。

使用回调的话，通知就是任务(foo(..))调用的回调。而使用 Promise 的话，我们把这个关系反转了过来，侦听来自 foo(..) 的事件，然后在得到通知的时候，根据情况继续。

首先，考虑以下伪代码

```js
foo(x) {
    // 开始做点可能耗时的工作
}
foo(42)
on (foo "completion") {
    // 可以进行下一步了！
}
on (foo "error") {
    // 啊，foo(..)中出错了
}
```

我们调用 foo(..) ，然后建立了两个事件侦听器，一个用于 " completion" ，一个用于"error" —— foo(..) 调用的两种可能结果。从本质上讲， foo(..) 并不需要了解调用代码订阅了这些事件，这样就很好地实现了关注点分离。

遗憾的是，这样的代码需要 JavaScript 环境提供某种魔法，而这种环境并不存在（实际上也有点不实际）。以下是在 JavaScript 中更自然的表达方法：

```js
function foo(x) {
    // 开始做点可能耗时的工作
    // 构造一个listener事件通知处理对象来返回
    return listener;
}
var evt = foo(42);
evt.on("completion", function(){
    // 可以进行下一步了！
});
evt.on("failure", function(err){
    // 啊，foo(..)中出错了
});
```

foo(..) 显式创建并返回了一个事件订阅对象，调用代码得到这个对象，并在其上注册了两个事件处理函数。

相对于面向回调的代码，这里的反转是显而易见的，而且这也是有意为之。这里没有把回调传给 foo(..) ，而是返回一个名为 evt 的事件注册对象，由它来接受回调。

回调本身就表达了一种控制反转。所以对回调模式的反转实际上是对反转的反转，或者称为反控制反转——把控制返还给调用代码，这也是我们最开始想要的效果。

一个很重要的好处是，可以把这个事件侦听对象提供给代码中多个独立的部分；在 foo(..) 完成的时候，它们都可以独立地得到通知，以执行下一步：

```js
var evt = foo(42);
// 让bar(..)侦听foo(..)的完成
bar(evt);
// 并且让baz(..)侦听foo(..)的完成
baz(evt);
```

对控制反转的恢复实现了更好的关注点分离，其中 bar(..) 和 baz(..) 不需要牵扯到 foo(..) 的调用细节。类似地， foo(..) 不需要知道或关注 bar(..) 和 baz(..) 是否存在，或者是否在等待 foo(..) 的完成通知。

从本质上说， evt 对象就是分离的关注点之间一个中立的第三方协商机制。

事件侦听对象 evt 就是 Promise 的一个模拟。

在基于 Promise 的方法中，前面的代码片段会让 foo(..) 创建并返回一个 Promise 实例，而且这个 Promise 会被传递到 bar(..) 和 baz(..)

```js
function foo(x) {
    // 可是做一些可能耗时的工作
    // 构造并返回一个promise
    return new Promise(function(resolve,reject){
    // 最终调用resolve(..)或者reject(..)
    // 这是这个promise的决议回调
    });
}
var p = foo( 42 );
bar(p);
baz(p);
```

你可能会猜测 bar(..) 和 baz(..) 的内部实现或许如下：

```js
function bar(fooPromise) {
    // 侦听foo(..)完成
    fooPromise.then(
        function(){
        // foo(..)已经完毕，所以执行bar(..)的任务
        },
        function(){
        // 啊，foo(..)中出错了！
        }
    );
}
```

另外一种实现方式是：

```js
function bar() {
    // foo(..)肯定已经完成，所以执行bar(..)的任务
}
function oopsBar() {
    // 啊，foo(..)中出错了，所以bar(..)没有运行
}
// 对于baz()和oopsBaz()也是一样
var p = foo(42);
p.then(bar, oopsBar);
p.then(baz, oopsBaz);
```

这里没有把 promise  p 传给 bar(..) 和 baz(..) ，而是使用 promise 控制 bar(..) 和  baz(..) 何时执行，如果执行的话。最主要的区别在于错误处理部分。

在第一段代码的方法里，不论 foo(..) 成功与否， bar(..) 都会被调用。并且如果收到了foo(..) 失败的通知，它会亲自处理自己的回退逻辑。显然， baz(..) 也是如此。

在第二段代码中， bar(..) 只有在 foo(..) 成功时才会被调用，否则就会调用 oppsBar(..) 。baz(..) 也是如此。

不管哪种情况，都是从 foo(..) 返回的 promise  p 来控制接下来的步骤。

另外，两段代码都以使用 promise  p 调用 then(..) 两次结束。这个事实说明了前面的观点，
就是 Promise（一旦决议）一直保持其决议结果（完成或拒绝）不变，可以按照需要多次查看

一旦 p 决议，不论是现在还是将来，下一个步骤总是相同的。

### 具有 then 方法的鸭子类型

在 Promise 领域，一个重要的细节是如何确定某个值是不是真正的 Promise。或者更直接地说，它是不是一个行为方式类似于 Promise 的值

因此，识别 Promise（或者行为类似于 Promise 的东西）就是定义某种称为 thenable 的东西，将其定义为任何具有 then(..) 方法的对象和函数。我们认为，任何这样的值就是 Promise 一致的 thenable。

根据一个值的形态（具有哪些属性）对这个值的类型做出一些假定。这种类型检查（typecheck）一般用术语鸭子类型（duck typing）来表示——“如果它看起来像只鸭子，叫起来像只鸭子，那它一定就是只鸭子”（参见本书的“类型和语法”部分）。于是，对 thenable 值的鸭子类型检测就大致类似于

```js
if (
    p !== null &&
    (
    typeof p === "object" ||
    typeof p === "function"
    ) &&
    typeof p.then === "function"
) {
// 假定这是一个thenable!
}
else {
// 不是thenable
}
```

如果你试图使用恰好有 then(..) 函数的一个对象或函数值完成一个 Promise，但并不希望它被当作 Promise 或 thenable，那就有点麻烦了，因为它会自动被识别为 thenable，并被按照特定的规则处理（参见本章后面的内容）。

即使你并没有意识到这个值有 then(..) 函数也是这样。比如：

```js
var o = { then: function(){} };
// 让v [[Prototype]]-link到o
var v = Object.create( o );
v.someStuff = "cool";
v.otherStuff = "not so cool";
v.hasOwnProperty( "then" ); // false
```

```js
Object.prototype.then = function(){};
Array.prototype.then = function(){};
var v1 = { hello: "world" };
var v2 = [ "Hello", "World" ];
```

v1 和 v2 都会被认作 thenable

如果 thenable 鸭子类型误把不是 Promise 的东西识别为了 Promise，可能就是有害的

## Promise 信任问题

### 调用过早

这个问题主要就是担心代码是否会引入类似 Zalgo 这样的副作用（参见第 2 章）。在这类问题中，一个任务有时同步完成，有时异步完成，这可能会导致竞态条件。

根据定义，Promise 就不必担心这种问题，因为即使是立即完成的 Promise（类似于 new Promise(function(resolve){ resolve(42); })）也无法被同步观察到。

也就是说，对一个 Promise 调用 then(..) 的时候，即使这个 Promise 已经决议，提供给 then(..) 的回调也总会被异步调用（对此的更多讨论，请参见 1.5 节）。

不再需要插入你自己的 setTimeout(..,0)  hack，Promise 会自动防止 Zalgo 出现。

### 调用过晚

和前面一点类似，Promise 创建对象调用 resolve(..) 或 reject(..) 时，这个 Promise 的then(..) 注册的观察回调就会被自动调度。可以确信，这些被调度的回调在下一个异步事件点上一定会被触发

同步查看是不可能的，所以一个同步任务链无法以这种方式运行来实现按照预期有效延迟另一个回调的发生。也就是说，一个 Promise 决议后，这个 Promise 上所有的通过 then(..) 注册的回调都会在下一个异步时机点上依次被立即调用（再次提醒，请参见 1.5 节）。这些回调中的任意一个都无法影响或延误对其他回调的调用。

举例来说

```js
p.then(function(){
    p.then(function(){
        console.log( "C" );
    });
    console.log( "A" );
});
p.then(function(){
    console.log( "B" );
});
// A B C
```

这里， "C" 无法打断或抢占 "B" ，这是因为 Promise 的运作方式。

但是，还有很重要的一点需要指出，有很多调度的细微差别。在这种情况下，两个独立 Promise 上链接的回调的相对顺序无法可靠预测。

如果两个 promise  p1 和 p2 都已经决议，那么 p1.then(..) ;  p2.then(..) 应该最终会先调用 p1 的回调，然后是 p2 的那些。但还有一些微妙的场景可能不是这样的，比如以下代码：

```js
var p3 = new Promise(function(resolve,reject){
    resolve("B");
});
var p1 = new Promise(function(resolve,reject){
    resolve(p3);
});
p2 = new Promise(function(resolve,reject){
    resolve("A");
});
p1.then(function(v){
    console.log(v);
});
p2.then(function(v){
    console.log(v);
});
// A B <-- 而不是像你可能认为的B A
```

后面我们还会深入介绍，但目前你可以看到， p1 不是用立即值而是用另一个 promise p3 决议，后者本身决议为值 "B" 。规定的行为是把 p3 展开到 p1 ，但是是异步地展开。所以，在异步任务队列中， p1 的回调排在 p2 的回调之后（参见 1.5 节）。

要避免这样的细微区别带来的噩梦，你永远都不应该依赖于不同 Promise 间回调的顺序和调度。实际上，好的编码实践方案根本不会让多个回调的顺序有丝毫影响，可能的话就要避免。

### 回调未调用

这个问题很常见，Promise 可以通过几种途径解决。

首先，没有任何东西（甚至 JavaScript 错误）能阻止 Promise 向你通知它的决议（如果它决议了的话）。如果你对一个 Promise 注册了一个完成回调和一个拒绝回调，那么 Promise在决议时总是会调用其中的一个

当然，如果你的回调函数本身包含 JavaScript 错误，那可能就会看不到你期望的结果，但实际上回调还是被调用了。后面我们会介绍如何在回调出错时得到通知，因为就连这些错误也不会被吞掉

但是，如果 Promise 本身永远不被决议呢？即使这样，Promise 也提供了解决方案，其使用了一种称为竞态的高级抽象机制：

```js
// 用于超时一个Promise的工具
function timeoutPromise(delay) {
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            reject("Timeout!");
        }, delay);
    });
}
// 设置foo()超时
Promise.race([
    foo(), // 试着开始foo()
    timeoutPromise(3000) // 给它3秒钟
])
.then(
    function(){
        // foo(..)及时完成！
    },
    function(err){
        // 或者foo()被拒绝，或者只是没能按时完成
        // 查看err来了解是哪种情况
    }
);
```

很重要的一点是，我们可以保证一个 foo() 有一个输出信号，防止其永久挂住程序。

### 调用次数过少或过多

根据定义，回调被调用的正确次数应该是 1。“过少”的情况就是调用 0 次，和前面解释过的“未被”调用是同一种情况。

过多”的情况很容易解释。Promise 的定义方式使得它只能被决议一次。如果出于某种原因，Promise 创建代码试图调用 resolve(..) 或 reject(..) 多次，或者试图两者都调用，那么这个 Promise 将只会接受第一次决议，并默默地忽略任何后续调用。

由于 Promise 只能被决议一次，所以任何通过 then(..) 注册的（每个）回调就只会被调用一次。

当然，如果你把同一个回调注册了不止一次（比如 p.then(f); p.then(f); ），那它被调用的次数就会和注册次数相同。响应函数只会被调用一次，但这个保证并不能预防你搬起石头砸自己的脚。

### 未能传递参数 / 环境值

Promise 至多只能有一个决议值（完成或拒绝）

如果你没有用任何值显式决议，那么这个值就是 undefined ，这是 JavaScript 常见的处理方式。但不管这个值是什么，无论当前或未来，它都会被传给所有注册的（且适当的完成或拒绝）回调。

还有一点需要清楚：如果使用多个参数调用 resovle(..) 或者 reject(..) ，第一个参数之后的所有参数都会被默默忽略。这看起来似乎违背了我们前面介绍的保证，但实际上并没有，因为这是对 Promise 机制的无效使用。对于这组 API 的其他无效使用（比如多次重复调用 resolve(..) ），也是类似的保护处理，所以这里的 Promise 行为是一致的（如果不是有点令人沮丧的话）。

对环境来说，JavaScript 中的函数总是保持其定义所在的作用域的闭包（参见《你不知道的 JavaScript（上卷）》的“作用域和闭包”部分），所以它们当然可以继续访问你提供的环境状态。当然，对于只用回调的设计也是这样，因此这并不是 Promise 特有的优点——但不管怎样，这仍是我们可以依靠的一个保证。

### 吞掉错误或异常

基本上，这部分是上个要点的再次说明。如果拒绝一个 Promise 并给出一个理由（也就是一个出错消息），这个值就会被传给拒绝回调。

```js
var p = new Promise(function(resolve,reject){
    foo.bar(); // foo未定义，所以会出错！
    resolve(42); // 永远不会到达这里 :(
});
p.then(
    function fulfilled(){
        // 永远不会到达这里 :(
    },
    function rejected(err){
        // err将会是一个TypeError异常对象来自foo.bar()这一行
    }
);
```

foo.bar() 中发生的 JavaScript 异常导致了 Promise 拒绝，你可以捕捉并对其作出响应

这是一个重要的细节，因为其有效解决了另外一个潜在的 Zalgo 风险，即出错可能会引起同步响应，而不出错则会是异步的。Promise 甚至把 JavaScript 异常也变成了异步行为，进而极大降低了竞态条件出现的可能

但是，如果 Promise 完成后在查看结果时（ then(..) 注册的回调中）出现了 JavaScript 异常错误会怎样呢？即使这些异常不会被丢弃，但你会发现，对它们的处理方式还是有点出乎意料，需要进行一些深入研究才能理解：

```js
var p = new Promise(function(resolve,reject){
    resolve(42);
});
p.then(
    function fulfilled(msg){
        foo.bar();
        console.log( msg ); // 永远不会到达这里 :(
    },
    function rejected(err){
        // 永远也不会到达这里 :(
    }
);
```

### 是可信任的 Promise 吗

你肯定已经注意到 Promise 并没有完全摆脱回调。它们只是改变了传递回调的位置。我们并不是把回调传递给 foo(..) ，而是从 foo(..) 得到某个东西（外观上看是一个真正的 Promise），然后把回调传给这个东西。

但是，为什么这就比单纯使用回调更值得信任呢？如何能够确定返回的这个东西实际上就是一个可信任的 Promise 呢？这难道不是一个（脆弱的）纸牌屋，在里面只能信任我们已经信任的？

关于 Promise 的很重要但是常常被忽略的一个细节是，Promise 对这个问题已经有一个解决方案。包含在原生 ES6  Promise 实现中的解决方案就是 Promise.resolve(..) 。

如果向 Promise.resolve(..) 传递一个非 Promise、非 thenable 的立即值，就会得到一个用这个值填充的 promise。下面这种情况下，promise  p1 和 promise  p2 的行为是完全一样的：

```js
var p1 = new Promise(function(resolve,reject){
    resolve(42);
});
var p2 = Promise.resolve(42);
```

而如果向 Promise.resolve(..) 传递一个真正的 Promise，就只会返回同一个 promise：

```js
var p1 = Promise.resolve(42);
var p2 = Promise.resolve(p1);
p1 === p2; // true
```

更重要的是，如果向 Promise.resolve(..) 传递了一个非 Promise 的 thenable 值，前者就会试图展开这个值，而且展开过程会持续到提取出一个具体的非类 Promise 的最终值。

```js
var p = {
    then: function(cb) {
        cb(42);
    }
};
// 这可以工作，但只是因为幸运而已
p
.then(
    function fulfilled(val){
        console.log(val); // 42
    },
    function rejected(err){
        // 永远不会到达这里
    }
);
```

这个 p 是一个 thenable，但并不是一个真正的 Promise。幸运的是，和绝大多数值一样，它是可追踪的。但是，如果得到的是如下这样的值又会怎样呢：

```js
var p = {
    then: function(cb,errcb) {
        cb( 42 );
        errcb( "evil laugh" );
    }
};
p
.then(
    function fulfilled(val){
        console.log( val ); // 42
    },
    function rejected(err){
        // 啊，不应该运行！
        console.log( err ); // 邪恶的笑
    }
);
```

这个 p 是一个 thenable，但是其行为和 promise 并不完全一致。这是恶意的吗？还只是因为它不知道 Promise 应该如何运作？说实话，这并不重要。不管是哪种情况，它都是不可信任的。

尽管如此，我们还是都可以把这些版本的 p 传给 Promise.resolve(..) ，然后就会得到期望中的规范化后的安全结果：

```js
Promise.resolve( p )
.then(
    function fulfilled(val){
        console.log( val ); // 42
    },
    function rejected(err){
        // 永远不会到达这里
    }
);
```

Promise.resolve(..) 可以接受任何 thenable，将其解封为它的非 thenable 值。从 Promise.resolve(..) 得到的是一个真正的 Promise，是一个可以信任的值。如果你传入的已经是真正的 Promise，那么你得到的就是它本身，所以通过 Promise.resolve(..) 过滤来获得可信任性完全没有坏处。

假设我们要调用一个工具 foo(..) ，且并不确定得到的返回值是否是一个可信任的行为良好的 Promise，但我们可以知道它至少是一个 thenable。 Promise.resolve(..) 提供了可信任的 Promise 封装工具，可以链接使用：

```js
// 不要只是这么做：
foo( 42 )
.then( function(v){
    console.log( v );
} );
// 而要这么做：
Promise.resolve( foo( 42 ) )
.then( function(v){
    console.log( v );
} );
```

对于用 Promise.resolve(..) 为所有函数的返回值（不管是不是 thenable）都封装一层。另一个好处是，这样做很容易把函数调用规范为定义良好的异步任务。如果 foo(42) 有时会返回一个立即值，有时会返回 Promise，那么Promise.resolve( foo(42) ) 就能够保证总会返回一个 Promise 结果。而且避免 Zalgo 就能得到更好的代码。

### 建立信任

可以用 JavaScript 编写异步代码而无需信任吗？当然可以。JavaScript 开发者近二十年来一直都只用回调编写异步代码。

可一旦开始思考你在其上构建代码的机制具有何种程度的可预见性和可靠性时，你就会开始意识到回调的可信任基础是相当不牢靠。

Promise 这种模式通过可信任的语义把回调作为参数传递，使得这种行为更可靠更合理。通过把回调的控制反转反转回来，我们把控制权放在了一个可信任的系统（Promise）中，这种系统的设计目的就是为了使异步编码更清晰。

## 链式流

我们可以把多个 Promise 连接到一起以表示一系列异步步骤

这种方式可以实现的关键在于以下两个 Promise 固有行为特性：

- 每次你对 Promise 调用 then(..) ，它都会创建并返回一个新的 Promise，我们可以将其链接起来；
- 不管从 then(..) 调用的完成回调（第一个参数）返回的值是什么，它都会被自动设置为被链接 Promise（第一点中的）的完成。

考虑如下代码

```js
var p = Promise.resolve( 21 );
var p2 = p.then( function(v){
    console.log( v ); // 21
    // 用值42填充p2
    return v * 2;
} );
// 连接p2
p2.then( function(v){
    console.log( v ); // 42
} );
```

我们通过返回 v * 2 ( 即 42 )，完成了第一个调用 then(..) 创建并返回的 promise  p2 。 p2 的 then(..) 调用在运行时会从 return v * 2 语句接受完成值。当然， p2.then(..) 又创建了另一个新的 promise，可以用变量 p3 存储

但是，如果必须创建一个临时变量 p2 （或 p3 等），还是有一点麻烦的。谢天谢地，我们很容易把这些链接到一起：

```js
var p = Promise.resolve( 21 );
p
.then( function(v){
    console.log( v ); // 21
    // 用值42完成连接的promise
    return v * 2;
} )
// 这里是链接的promise
.then( function(v){
    console.log( v ); // 42
} );
```

现在第一个 then(..) 就是异步序列中的第一步，第二个 then(..) 就是第二步。这可以一直任意扩展下去。只要保持把先前的 then(..) 连到自动创建的每一个 Promise 即可。

如果需要步骤 2 等待步骤 1 异步来完成一些事情怎么办？我们使用了立即返回 return 语句，这会立即完成链接的 promise

使 Promise 序列真正能够在每一步有异步能力的关键是，回忆一下当传递给 Promise.resolve(..) 的 是 一 个 Promise 或 thenable 而不是最终值时的运作方式。Promise.resolve(..) 会直接返回接收到的真正 Promise，或展开接收到的 thenable 值，并在持续展开 thenable 的同时递归地前进

从完成（或拒绝）处理函数返回 thenable 或者 Promise 的时候也会发生同样的展开。考虑：

```js
var p = Promise.resolve( 21 );
p.then( function(v){
    console.log( v ); // 21
    // 创建一个promise并将其返回
    return new Promise( function(resolve,reject){
        // 用值42填充
        resolve( v * 2 );
    } );
} )
.then( function(v){
    console.log( v ); // 42
} );
```

虽然我们把 42 封装到了返回的 promise 中，但它仍然会被展开并最终成为链接的 promise 的决议，因此第二个 then(..) 得到的仍然是 42 。如果我们向封装的 promise 引入异步，一切都仍然会同样工作：

```js
var p = Promise.resolve( 21 );
p.then( function(v){
    console.log( v ); // 21
    // 创建一个promise并返回
    return new Promise( function(resolve,reject){
        // 引入异步！
        setTimeout( function(){
            // 用值42填充
            resolve( v * 2 );
        }, 100 );
    } );
} )
.then( function(v){
    // 在前一步中的100ms延迟之后运行
    console.log( v ); // 42
} );
```

这种强大实在不可思议！现在我们可以构建这样一个序列：不管我们想要多少个异步步骤，每一步都能够根据需要等待下一步（或者不等！）。

当然，在这些例子中，一步步传递的值是可选的。如果不显式返回一个值，就会隐式返回 undefined ，并且这些 promise 仍然会以同样的方式链接在一起。这样，每个 Promise 的决议就成了继续下一个步骤的信号。

为了进一步阐释链接，让我们把延迟 Promise 创建（没有决议消息）过程一般化到一个工具中，以便在多个步骤中复用：

```js
function delay(time) {
    return new Promise( function(resolve,reject){
        setTimeout( resolve, time );
    } );
}
delay( 100 ) // 步骤1
.then( function STEP2(){
    console.log( "step 2 (after 100ms)" );
    return delay( 200 );
} )
.then( function STEP3(){
    console.log( "step 3 (after another 200ms)" );
} )
.then( function STEP4(){
    console.log( "step 4 (next Job)" );
    return delay( 50 );
} )
.then( function STEP5(){
    console.log( "step 5 (after another 50ms)" );
} )
```

调用 delay(200) 创建了一个将在 200ms 后完成的 promise，然后我们从第一个 then(..) 完成回调中返回这个 promise，这会导致第二个 then(..) 的 promise 等待这个 200ms 的 promise。

但说实话，没有消息传递的延迟序列对于 Promise 流程控制来说并不是一个很有用的示例。我们来考虑如下这样一个更实际的场景。

这里不用定时器，而是构造 Ajax 请求：

```js
// 假定工具ajax( {url}, {callback} )存在
// Promise-aware ajax
function request(url) {
    return new Promise( function(resolve,reject){
    // ajax(..)回调应该是我们这个promise的resolve(..)函数
        ajax( url, resolve );
    } );
}
```

我们首先定义一个工具 request(..) ，用来构造一个表示 ajax(..) 调用完成的 promise：

```js
request( "http://some.url.1/" )
.then( function(response1){
    return request( "http://some.url.2/?v=" + response1 );
} )
.then( function(response2){
    console.log( response2 );
} );
```

利用返回 Promise 的 request(..) ，我们通过使用第一个 URL 调用它来创建链接中的第一步，并且把返回的 promise 与第一个 then(..) 链接起来。

我们构建的这个 Promise 链不仅是一个表达多步异步序列的流程控制，还是一个从一个步骤到下一个步骤传递消息的消息通道。

如果这个 Promise 链中的某个步骤出错了怎么办？错误和异常是基于每个 Promise 的，这意味着可能在链的任意位置捕捉到这样的错误，而这个捕捉动作在某种程度上就相当于在这一位置将整条链“重置”回了正常运作

```js
// 步骤1：
request( "http://some.url.1/" )
// 步骤2：
.then( function(response1){
    foo.bar(); // undefined，出错！
    // 永远不会到达这里
    return request( "http://some.url.2/?v=" + response1 );
} )
// 步骤3：
.then(
    function fulfilled(response2){
        // 永远不会到达这里
    },
    // 捕捉错误的拒绝处理函数
    function rejected(err){
        console.log( err );
        // 来自foo.bar()的错误TypeError
        return 42;
    }
)
// 步骤4：
.then( function(msg){
    console.log( msg ); // 42
} );
```

第 2 步出错后，第 3 步的拒绝处理函数会捕捉到这个错误。拒绝处理函数的返回值（这段代码中是 42 ），如果有的话，会用来完成交给下一个步骤（第 4 步）的 promise，这样，这个链现在就回到了完成状态。

如果你调用 promise 的 then(..) ，并且只传入一个完成处理函数，一个默认拒绝处理函数就会顶替上来：

```js
var p = new Promise( function(resolve,reject){
    reject( "Oops" );
} );
var p2 = p.then(
    function fulfilled(){
    // 永远不会达到这里
    }
    // 假定的拒绝处理函数，如果省略或者传入任何非函数值
    // function(err) {
    // throw err;
    // }
);
```

如你所见，默认拒绝处理函数只是把错误重新抛出，这最终会使得 p2 （链接的 promise）用同样的错误理由拒绝。从本质上说，这使得错误可以继续沿着 Promise 链传播下去，直到遇到显式定义的拒绝处理函数。

如果没有给 then(..) 传递一个适当有效的函数作为完成处理函数参数，还是会有作为替代的一个默认处理函数：

```js
var p = Promise.resolve( 42 );
p.then(
    // 假设的完成处理函数，如果省略或者传入任何非函数值
    // function(v) {
    // return v;
    // }
    null,
    function rejected(err){
    // 永远不会到达这里
    }
);
```

你可以看到，默认的完成处理函数只是把接收到的任何传入值传递给下一个步骤（Promise）而已。

then(null,function(err){ .. }) 这个模式——只处理拒绝（如果有的话），但又把完成值传递下去——有一个缩写形式的 API：catch(function(err){ .. })。下一小节会详细介绍 catch(..)。

让我们来简单总结一下使链式流程控制可行的 Promise 固有特性。

- 调用 Promise 的 then(..) 会自动创建一个新的 Promise 从调用返回。
- 在完成或拒绝处理函数内部，如果返回一个值或抛出一个异常，新返回的（可链接的）Promise 就相应地决议。
- 如果完成或拒绝处理函数返回一个 Promise，它将会被展开，这样一来，不管它的决议值是什么，都会成为当前 then(..) 返回的链接 Promise 的决议值。

尽管链式流程控制是有用的，但是对其最精确的看法是把它看作 Promise 组合到一起的一个附加益处，而不是主要目的。正如前面已经多次深入讨论的，Promise 规范化了异步，并封装了时间相关值的状态，使得我们能够把它们以这种有用的方式链接到一起。

当然，相对于第 2 章讨论的回调的一团乱麻，链接的顺序表达（this-then-this-then-this...）已经是一个巨大的进步。但是，仍然有大量的重复样板代码（ then(..) 以及 function(){ ... } ）。在第 4 章，我们将会看到在顺序流程控制表达方面提升巨大的优美模式，通过生成器实现。


