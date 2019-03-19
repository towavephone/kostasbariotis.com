---
title: 你不知道的JS之this
categories:
  - 前端
tags: 前端, JS, 你不知道的JS
path: /you-dont-know-js-this/
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

#### 隐式丢失

被隐式绑定的函数会丢失绑定对象，也就是说应用默认绑定，虽然bar是obj.foo的一个引用，但是实际上，它引用的是foo函数本身

```js
function foo(){
    console.log(this.a);
}
var obj={
    a:2,
    foo:foo
};
var bar=obj.foo;//函数别名
var a="oops,global";
bar();//oops,global
```

参数传递就是一种隐式赋值，结果一样

```js
function foo(){
    console.log(this.a);
}
function doFoo(fn){
    //fn其实引用的是foo，和上面一样，参数隐式赋值
    fn();//调用位置
}
var obj={
    a:2,
    foo:foo
};
var a="oops,global";
doFoo(obj.foo);//oops,global
```

函数传入语言内置的函数，结果一样

```js
function foo(){
    console.log(this.a);
}
var obj={
    a:2,
    foo:foo
};
var a="oops,global";
setTimeout(obj.foo,100);//oops,global
// function(fn,delay){
//     fn();//调用位置，和上面一样
// }
```

还有调用函数的函数可能会修改this，有些js库中的事件会把回调函数中的this强制绑定到触发事件的DOM上

正因为隐式绑定的不确定性，下面就通过固定this来修复这个问题

### 显式绑定

call,apply第一个参数显式绑定到this上

```js
function foo(){
    console.log(this.a);
}
var obj={
    a:2
};
foo.call(obj);//2
```

如果传入了一个原始值来当做this的绑定对象，这个原始值会被转换成它的对象形式，这通常被称为装箱

但是显式绑定仍然无法解决之前的丢失绑定的问题

#### 硬绑定

这种绑定是一种显式的强制绑定，总会在调用bar时强制在obj上调用bar

```js
function foo(){
    console.log(this.a);
}
var obj={
    a:2
};
var bar=function(){
    foo.call(obj);
}
bar();//2
setTimeout(bar,100);//2
bar.call(window);//2
```

应用场景之一：创建一个包裹函数，负责接收参数并返回值

```js
function foo(something){
    console.log(this.a,something);
    return this.a+something;
}
var obj={
    a:2
};
var bar=function(){
    return foo.apply(obj,arguments);
}
var b=bar(3);//2,3
console.log(b);//5
```

应用场景之二：创建一个可以重复使用的辅助函数

```js
function foo(something){
    console.log(this.a,something);
    return this.a+something;
}
function bind(fn,obj){
    return function(){
        return fn.apply(obj,arguments);
    }
}
var obj={
    a:2
};
var b=bind(foo,obj)(3);
console.log(b);
```

由于硬绑定是一种非常常用的模式，ES5提供了内置方法Function.prototype.bind

```js
function foo(something){
    console.log(this.a,something);
    return this.a+something;
}
var obj={
    a:2
};
var b=foo.bind(obj)(3);
console.log(b);
```

#### API调用的上下文

第三方库的许多函数，以及js语言和宿主环境的许多内置函数，都提供了一个可选的参数，通常被称为上下文，其作用和bind一样，确保你的回调函数使用指定的this

```js
function foo(el){
    console.log(el,this.id);
}
var obj={
    id:"awesome"
};
[1,2,3].forEach(foo,obj);
// 1 "awesome"
// 2 "awesome"
// 3 "awesome"
```

### new绑定

new调用函数或者发生构造函数调用时，会执行：

1. 创建（或者说构造）一个全新对象
2. 这个新对象会被执行[[Prototype]]连接
3. 这个新对象会绑定到函数调用的this
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个对象

```js
function foo(a){
    this.a=a;
}
var bar=new foo(2);
console.log(bar.a);//2
```

## 优先级

显式绑定优先级高于隐式绑定

```js
function foo(){
    console.log(this.a);
}
var obj1={
    a:2,
    foo:foo
};
var obj2={
    a:3,
    foo:foo
};
obj1.foo();//2，隐式绑定
obj2.foo();//3，隐式绑定
obj1.foo.call(obj2);//3，显式绑定优先级高于隐式绑定
obj2.foo.call(obj1);//2，显式绑定优先级高于隐式绑定
```

new绑定比隐式绑定优先级高

```js
function foo(something){
    this.a=something;
}
var obj1={
    foo:foo
};
var obj2={};
obj1.foo(2);
console.log(obj1.a);//2，隐式绑定
obj1.foo.call(obj2,3);
console.log(obj2.a);//3，显式绑定高于隐式绑定
var bar=new obj1.foo(4);
console.log(obj1.a);//2，隐式绑定
console.log(bar.a);//4，new绑定高于隐式绑定
```

因为new和apply/call无法一起使用，但是可以通过硬绑定来测试优先级

```js
function foo(something){
    this.a=something;
}
var obj1={};
var bar=foo.bind(obj1);

bar(2);
console.log(obj1.a);//2，显式绑定

var baz=new bar(3);
console.log(obj1.a);//2，不变
console.log(baz.a);//3，new绑定高于显式绑定
```

new是怎么修改硬绑定的？

```js{9,13-14}
if(!Function.prototype.bind){
    Function.prototype.bind=function(oThis){
        if(typeof this!=="function"){
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        };
    }
    var aArgs=Array.prototype.slice.call(arguments,1),fToBind=this,fNOP=function(){},fBound=function(){
        return fToBind.apply(
            (this instanceof fNOP && oThis ? this : oThis),
            aArgs.concat(Array.prototype.slice.call(arguments))
        );
    };
    fNOP.prototype=this.prototype;
    fBound.prototype=new fNOP();
    return fBound;
}
```

标记部分会判断硬绑定函数是否被new调用，是的话会使用新的this替换硬绑定的this

之所以在new中使用硬绑定函数，主要目的是预先设置函数的一些参数，这样在使用new进行初始化是就可以只传入其余参数。bind的功能之一就是把除了第一个参数之外的其他参数都传给下层函数。

```js
function foo(p1,p2){
    this.val=p1+p2;
}
var bar=foo.bind(null,"p1");//使用null的原因是不关心硬绑定的this是什么，反正之后的new绑定会更改
var baz=new bar("p2");
console.log(baz.val);//p1p2
```

### 判断this

new绑定>显式绑定>隐式绑定>默认绑定

## 绑定例外

### 被忽略的this

- 如果把null，undefined作为this的绑定对象传入call、apply、bind，这些值调用时会被忽略，应用的是默认的绑定规则
- 使用apply来展开一个数组，并当作参数传入一个参数；类似的，bind可以对参数进行柯里化（预先设置一些参数)

```js
function foo(a,b){
    this.a=a;
    console.log("a:"+a+",b:"+b);
}
foo.apply(null,[2,3]);//a:2,b:3
var bar=foo.bind(null,2);
bar(3);//a:2,b:3
console.log(a);//2，this绑定到全局对象
```

总是使用null来忽略this绑定会产生一些副作用，比如一些第三方库确实用到了this，那默认绑定会将this绑定到全局对象，这会造成不可预计的
后果

#### 更安全的this 

解决方法：传入一个特殊的对象，把this绑定到这个对象上不会产生副作用，简称DMZ（非军事区）空对象

```js
function foo(a,b){
    console.log("a:"+a+",b:"+b);
    this.a=a;
}
//DMZ空对象
var nullObject=Object.create(null);
foo.apply(nullObject,[2,3]);//a:2,b:3
var bar=foo.bind(nullObject,2);
bar(3);//a:2,b:3
console.log(a);//Uncaught ReferenceError: a is not defined，this绑定到DMZ空对象
```

### 间接引用

创建一个函数的间接引用，会应用默认规则

```js
function foo(){
    console.log(this.a);
}
var a=2;
var o={a:3,foo:foo};
var p={a:4};
o.foo();//3
(p.foo=o.foo)();//2，调用位置是foo()，这里会应用默认绑定
```

### 软绑定

硬绑定会大大降低函数的灵活性，使用硬绑定之后就无法使用隐式绑定或显式绑定来修改this

如果可以给默认绑定指定一个全局对象和undefined以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改this的能力

```js
if(!Function.prototype.softBind){
    Function.prototype.softBind=function(obj){
        var fn=this;
        var curried=[].slice.call(arguments,1);
        console.log(curried);
        var bound=function(){
            return fn.apply(
                (!this||this===(window||global))?obj:this,//软绑定关键步骤
                curried.concat.apply(curried,arguments)//柯里化相关
            );
        };
        bound.prototype=Object.create(fn.prototype);
        return bound;
    }
}
function foo(){
    console.log("name:"+this.name+","+[].slice.call(arguments).join(","));
}
var obj={name:"obj"},obj2={name:"obj2"},obj3={name:"obj3"};
var fooOBJ=foo.softBind(obj,"1");//已经绑定到全局对象，会被修改，软绑定
fooOBJ("2","3");//name:obj,1,2,3，参数柯里化
obj2.foo=foo.softBind(obj);
obj2.foo();//name:obj2，隐式绑定，绑定到obj2
fooOBJ.call(obj3);//name:obj3,1，显式绑定，绑定到obj3
setTimeout(obj2.foo,10);//name:obj //已经绑定到全局对象，会被修改，软绑定
```

## this词法

箭头函数根据外层作用域来决定this，不使用以上规则

```js
function foo(){
    return (a)=>{
        console.log(this.a);
    }
}
var obj1={a:2};
var obj2={a:3};
var bar=foo.call(obj1);
bar.call(obj2);//2
```

代码风格任选其一：

1. 只使用词法作用域并完全抛弃错误的this风格的写法，例如self=this,箭头函数
2. 完全采用this风格，在必要时使用bind()，尽量避免使用self=this,箭头函数