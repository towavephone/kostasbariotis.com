---
title: 你不知道的JS之异步与性能
categories:
  - 前端
tags: 前端, JS, 你不知道的JS
path: /you-dont-know-js-asynchronism-and-performance/
date: 2018-6-6 18:31:03
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