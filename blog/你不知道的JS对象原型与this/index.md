---
title: 你不知道的JS对象原型与this
categories:
  - 前端
tags: 前端, JS, 你不知道的JS
path: /you-dont-know-js-object-prototype-this/
date: 2018-5-27 14:34:18
---
# 关于this

## 为什么要用this

```js
function identify(){
    return this.name.toUpperCase();
}
function speak(){
    var greeting="Hello,I'm "+identify.call(this);
    console.log(greeting);
}
var me={
    name:"Kyle"
};
var you={
    name:"Reader"
};
console.log(identify.call(me));//KYLE
console.log(identify.call(you));//READER
speak.call(me);//Hello,I'm KYLE
speak.call(you);//Hello,I'm READER
```

如果不使用this：

```js
function identify(context){
    return context.name.toUpperCase();
}
function speak(context){
    var greeting="Hello,I'm "+identify(context);
    console.log(greeting);
}
var me={
    name:"Kyle"
};
var you={
    name:"Reader"
};
console.log(identify(me));//KYLE
console.log(identify(you));//READER
speak(me);//Hello,I'm KYLE
speak(you);//Hello,I'm READER
```

## 误解

### 指向自身

this并不是指向函数本身，下例中的count通过LHS查找指向全局变量。

```js
function foo(num){
    console.log("foo: "+ num);//6,7,8,9
    this.count++;
}
foo.count=0;
var i;
for(i=0;i<10;i++){
    if(i>5){
        foo(i);
    }
}
console.log(foo.count);//0次调用
console.log(count);//NaN，count成为全局变量，未进行初始化
```

利用词法作用域的一种“解决”办法，逃避的解决方式

```js
function foo(num){
    console.log("foo: "+ num);//6,7,8,9
    data.count++;
}
var data={
    count:0
};
var i;
for(i=0;i<10;i++){
    if(i>5){
        foo(i);
    }
}
console.log(data.count);//4
```

foo标识符代替this引用函数对象，同样回避了this问题

```js
function foo(num){
    console.log("foo: "+ num);//6,7,8,9
    foo.count++;
}
foo.count=0;
var i;
for(i=0;i<10;i++){
    if(i>5){
        foo(i);
    }
}
console.log(foo.count);//4
```

强制this指向foo函数对象，完美的解决方式

```js
function foo(num){
    console.log("foo: "+ num);//6,7,8,9
    this.count++;
}
foo.count=0;
var i;
for(i=0;i<10;i++){
    if(i>5){
        //确保this指向函数对象foo本身
        foo.call(foo,i);
    }
}
console.log(foo.count);//4
```

### 它的作用域

this不一定指向函数的作用域，this在任何情况下都不指向函数的词法作用域，具体表现为a不能通过this.a/foo.a访问到

```js
function foo(){
    var a=2;// a不能通过foo.a访问到
    this.bar();
}
function bar(){
    console.log(this.a);//undefined
}
foo();
```

修正后

```js
function foo(){
    var a=2;// a不能通过foo.a访问到，在foo作用域下被隐藏
    bar.call(foo);//不使用this调用，因为this的值不确定，this不是指向全局作用域就调用不到
}
foo.a=3;
function bar(){
    console.log(this.a);//3
    console.log(a);//undefined
}
foo();
```

## this到底是什么

this在运行时绑定，它的上下文取决于函数调用时的各种条件

# this全面解析

## 调用位置

调用栈是为了到达当前执行位置所调用的所有函数，调用位置在当前正在执行的函数的前一个调用中

```js
function baz(){
    //当前调用栈是baz，当前调用位置为全局作用域
    console.log("baz");
    bar();//bar的调用位置
}
function bar(){
    //当前调用栈是baz->bar,调用位置baz
    console.log("bar");
    foo();//foo的调用位置
}
function foo(){
    //当前调用栈是baz->bar->foo,调用位置bar
    console.log("foo");
}
baz();//baz调用位置
```

## 绑定规则

### 默认绑定

独立函数调用，绑定到全局对象

```js
function foo(){
    console.log(this.a);
}
var a=2;
foo();//2
```

严格模式this绑定到undefined

```js
function foo(){
    "use strict"
    console.log(this.a);
}
var a=2;
foo();//Uncaught TypeError: Cannot read property 'a' of undefined
```

严格模式调用foo不影响默认绑定

```js
function foo(){
    console.log(this.a);
}
var a=2;
(function(){
    "use strict"
    foo();//2
})();
```

### 隐式绑定

调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含，this绑定到这个上下文对象

```js
function foo(){
    console.log(this.a);
}
var obj={
    a:2,
    foo:foo
};
obj.foo();//2
```

对象属性引用链中只有上一层或者说最后一层在调用位置起作用

```js
function foo(){
    console.log(this.a);
}
var obj2={
    a:42,
    foo:foo
};
var obj1={
    a:2,
    obj2:obj2
};
obj1.obj2.foo();//42
```



