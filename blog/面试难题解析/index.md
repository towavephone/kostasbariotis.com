---
title: 面试难题解析
categories:
  - 面试
path: /interview-question-analysis/
tags: 面试, 前端
date: 2018-6-3 21:30:08
---

# 微任务与任务队列的执行顺序 

```js
let b=0;
let promise=new Promise(resolve=>{
    let b=1;
    console.log(b);
    resolve('A');
});
promise.then(data=>{
    console.log('2');
    return 'B';
}).then(data=>{
    console.log(data);
}).then(data=>{
    console.log(b);
    console.log(data);
});
promise.then(()=>{
    console.log('3');
});
```

1. 写出以上代码的输出结果，分析原因
    - 123B0undefined
    - 执行顺序：同步环境执行 -> 事件循环1(microtask queue的All)-> 事件循环2(macrotask queue中的一个) -> 事件循环1(microtask queue的All)-> 事件循环2(macrotask queue中的一个)
2. 修改代码，使3秒钟输出3，再2秒钟输出2，再1秒钟输出1(A、B可忽略)

```js
function next( n ){
    return new Promise( function( resolve, reject ){
        setTimeout( function(){
            resolve( n );
        }, n*1000 );
    } );
}

next(3).then(data=>{
    console.log(data);
    return next(2);
}).then(data=>{
    console.log(data);
    return next(1);
}).then(data=>{
    console.log(data);
});
```

# this指向与new

```js
// 方式1：一个构造函数嘛，里面有个全部变量getName 指向一个匿名函数（小心闭包）  
function Foo(){
    getName=function(){console.log(1)};
    return this;
}
// 方式2：构造函数的一个属性getName 指向一个匿名函数  
Foo.getName=function(){console.log(2);};
// 方式3：构造函数的原型上有个getName方法  
Foo.prototype.getName=function(){console.log(3);};
// 方式4：定义一个变量指针指向一个匿名函数  
var getName=function(){console.log(4);};
// 方式5：声明一个叫getName的有名函数  
function getName(){console.log(5);};
```

写出以下代码的输出结果

```js
Foo.getName();//2，当做对象，是Foo的属性，直接调用对象内的方法
getName();//4，函数声明提升高于变量声明提升（被忽略）
Foo().getName();//1，当做函数，函数foo执行，this指向window，getName被覆盖
getName();//1
new Foo.getName();//2，优先级：new Foo() >  Foo() > new Foo，Foo.getName首先执行，再new实例Foo对象
new Foo().getName();//3，先执行new Foo()生成新的实例对象，并且继承了Foo()这个构造函数中的getName方法，以方式3执行
new new Foo().getName();//3，同上，多了一次new Foo的实例对象
```