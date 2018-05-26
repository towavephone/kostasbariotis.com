---
title: 你不知道的JS作用域与闭包
categories:
  - 前端
tags: 前端, JS
path: /you-dont-know-js-scope-closure/
date: 2018-5-26 17:18:46
---
# 作用域是什么

## LHS与RHS

LHS 和 RHS 的含义是`赋值操作的左侧或右侧`并不一定意味着就是` = 赋值操作符的左侧或右侧`。赋值操作还有其他几种形式，因此在概念上最好将其理解为`赋值操作（LHS）`以及`获取变量值（RHS）`。

```js
function foo(a) {// a的LHS引用，把2赋给a
    console.log( a ); // console.log的RHS引用，内置对象的调用；a的RHS应用，a的调用；log函数中第一个参数a的赋值，LHS引用
}
foo( 2 ); // foo的RHS引用，foo的调用1
```

```js
function foo(a){
    var b=a;//b赋值，LHS；a调用，RHS
    return a+b;//a,b调用，RHS两次
}
var c=foo(2);//c赋值，LHS；foo调用，RHS;参数a=2，LHS
```

## 作用域

LHS 和 RHS 引用都会在当前作用域进行查找，如果还是没有找到就继续向上，以此类推。

```js
function foo(a) {
    console.log( a + b );
}
var b = 2;
foo( 2 ); // 4
```

对 b 进行的 RHS 引用无法在函数 foo 内部完成，但可以在上一级作用域（在这个例子中就是全局作用域）中完成。

## 异常

### 区分 LHS 和 RHS 的意义

- 在变量还没有声明（在任何作用域中都无法找到该变量）的情况下，这两种查询的行为是不一样的。
- 如果 RHS 查询在所有嵌套的作用域中遍寻不到所需的变量，引擎就会抛出 ReferenceError异常。
- 当引擎执行 LHS 查询时，如果在顶层（全局作用域）中也无法找到目标变量，全局作用域中就会创建一个具有该名称的变量，并将其返还给引擎，前提是运行在非“严格模式”下。严格模式下，引擎会抛出同 RHS 查询失败时类似的 ReferenceError 异常。
- 如果 RHS 查询找到了一个变量，但是你尝试对这个变量的值进行不合理的操作，比如试图对一个非函数类型的值进行函数调用，或着引用 null 或 undefined 类型的值中的属性，那么引擎会抛出另外一种类型的异常，叫作 TypeError 。
- ReferenceError 同作用域判别失败相关，而 TypeError 则代表作用域判别成功了，但是对结果的操作是非法或不合理的。

```js
function foo(a) {
    console.log( a + b );
    b = a;
}
foo( 2 );
```

第一次对 b 进行 RHS 查询时是无法找到该变量的。也就是说，这是一个“未声明”的变量，因为在任何相关的作用域中都无法找到它。

# 词法作用域

## 词法阶段

定义在词法阶段的作用域，决定于代码的位置，大部分情况下保持作用域不变

```js
function foo(a){
    var b=a*2;
    function bar(c){
        console.log(a,b,c);
    }
    bar(b*3);
}
foo(2);//2,4,12
```

1. 最外层包含全局作用域，只有一个标识符：foo
2. 包含foo所创建的作用域，有三个标识符：a、bar、b
3. 包含bar创建的作用域，只有一个标识符：c

### 查找

- 作用域查找始终从运行时所处的最内部作用域开始，逐级向外或者说向上进行，直到遇到第一个匹配的标识符为准
- 全局变量会自动成为全局对象的属性，因此可以通过全局对象属性的引用来直接访问,即window.a，但非全局的变量屏蔽了之后，怎么也访问不到

## 欺骗词法

运行时来修改词法作用域，通常会导致性能下降

### eval

```js
function foo(str,a){
    eval(str); //欺骗，屏蔽了外部的b
    console.log(a,b);
}
var b=2;
foo("var b=3;",1);//1,3
```

严格模式下，eval有着自己的词法作用域，无法修改所在域。

```js
function foo(str){
    "use strict";
    eval(str);
    console.log(a);//Uncaught ReferenceError: a is not defined
}
foo("var a=2;");
```

其它类似的还有setTimeout()和setInterval()第一个参数可以是字符串，new Function()最后一个参数可以是字符串，比eval安全一些。

### with

with块可以将一个对象处理为词法作用域，但是这个块内部正常的var声明并不会限制在这个块的作用域中，而是在with所处的作用域中。

当o1传递给with时，with所在的作用域是o1，而这个作用域正好有一个o1.a。但当o2作为作用域时，其中并没有a的标识符，因此进行LHS查询，此时o2,foo(),全局作用域中都没有找到标识符a，因此当a=2自动创建了一个全局变量。

```js
function foo(obj){
    with(obj){
        a=2;
    }
    // var a=3; 此语句会覆盖obj.a的赋值，使得a在foo的作用域下，故此时从全局作用域访问不到该变量。
}
var o1={
    a:3
};
var o2={
    b:3
}
foo(o1);
console.log(o1.a);//2

foo(o2);
console.log(o2.a);//undefined
console.log(a);//2，a被泄露到全局作用域上
```

在严格模式下，with被完全禁止，在保留核心功能的前提下，间接或非安全的使用eval也被禁止。

### 性能

js引擎会在编译阶段进行多项优化，如果发现了eval或with，它只能简单假设关于标识符位置的判断都是无效的，最悲观的情况是即使对eval或with做了优化，所有的优化可能是无意义的，因此代码中大量使用eval或with，运行起来一定会变的非常慢。

# 函数作用域与块作用域

## 函数中的作用域

- 无论标识符的声明出现在作用域何处，这个标识符所代表的变量或函数都附属于所处的作用域。
- 函数的作用域是指，属于这个函数的全部变量都可以在整个函数范围内使用以及复用。

## 隐藏内部实现

用作用域来隐藏变量，遵守最小暴露原则

```js
function doSometing(a){
    b=a+doSomethingElse(a*2);
    console.log(b*3);
}
function doSomethingElse(a){
    return a-1;
}
var b;
doSometing(2);
```

更理想的方式是将b和doSometing私有化，防止有意或无意的以非预期的方式使用

```js
function doSometing(a){
    function doSomethingElse(a){
        return a-1;
    }
    var b;
    b=a+doSomethingElse(a*2);
    console.log(b*3);
}

doSometing(2);
```

### 规避冲突

避免同名标识符之间的冲突，防止变量的值被意外覆盖

```js
function foo(){
    function bar(a){
        i=3;//修改for循环所属作用域中的i，前面加上var可以遮蔽变量
        console.log(a+i);
    }
    for(var i=0;i<10;i++){
        bar(i*2);
    }
}
foo();//无限循环
```

#### 全局命名空间

```js
var MyReallyCoolLibrary={
    awesome:"stuff",
    doSomething:function(){
        //...
    },
    doAnotherThing:function(){
        //...
    }
};
```

#### 模块管理

利用模块管理器，保持私有、无冲突的作用域

## 函数作用域

```js
var a=2;
function foo(){
    var a=3;
    console.log(a);
}
foo();
console.log(a);
```

**缺点**

- foo这个名称本身污染了所在作用域
- 必须显式调用这个函数才能运行。

```js
var a=2;
(function foo(){
    var a=3;
    console.log(a);//3
})();
console.log(a);//2
```

**优点**

- (function...开头确保是函数表达式，不是函数声明；
- 第一个片段foo被绑定在所在作用域中，可以直接通过foo()来调用；第二个foo被绑定在函数表达式自身的函数中而不是所在域中。

### 匿名和具名

函数表达式的缺点：

1. 匿名函数在栈追踪中不会显示有意义的函数名，使得调试很困难
2. 如果没有函数名，但函数引用自身只能使用已经过期的arguments.callee引用，比如在递归中。另一个函数需要自身的例子，是在事件触发后事件监听器需要解绑自身
3. 匿名函数省略了对于代码可读性很重要的函数名

始终给函数表达式命名是一个最佳实践

### 立即执行函数表达式

```js
var a=2;
(function(){
    var a=3;
    console.log(a);//3
})();
console.log(a);//2
```

- 第一个()将函数变成表达式，第二个()执行了这个函数，称为IIFE（立即执行函数表达式）
- 还有一种改进形式：(function(){...}())，功能上是一致的

```js
var a=2;
(function IIFE(global){
    var a=3;
    console.log(a);//3
    console.log(global.a);//2
})(window);
console.log(a);//2
```

可以将window对象引用传递进去，使得内部可以访问重名的变量。

```js
undefined=true;//给其他代码挖了一个大坑，会覆盖undefined默认值，解决方法见下
(function IIFE(undefined){
    var a;
    if(a===undefined){
        console.log("Undefined is safe here");
    }
})();
```

上述代码将一个参数命名为undefined，但是在对应的位置不传入任何值，保证undefined的标识符值就是undefined

```js
var a=2;
(function IIFE(def){
    def(window);
})(function def(global){
    var a=3;
    console.log(a);//3
    console.log(global.a);//2
})
```

倒置代码执行顺序，将需要运行的函数放在第二位，在UMD中被广泛使用

## 块作用域

for循环和if语句都不会产生块作用域，表面上看是没有块作用域的

### with

with生成块作用域，仅在with声明中有效。

### try/catch

ES3中规定try/catch的catch分句会创建一个块作用域

```js
try{
    undefined();//执行一个非法操作来强制制造异常
}
catch(err){
    console.log(err);//正常执行
}
console.log(err);// Uncaught ReferenceError: err is not defined
```

### let

let会创建一个绑定的块，同时let声明不会在块作用域中进行提升

#### 垃圾收集

```js
function process(data){
    //...
}
var someRealllyBigData={/*...*/};
process(someRealllyBigData);
var btn=document.getElementById("my_button");
btn.addEventListener("click",function click(evt){
    console.log("button clicked");
});
```

click函数的点击回调不需要someReallyBigData变量，意味着process执行完后someRealllyBigData会被回收。但由于click函数形成了一个覆盖整个作用域的闭包，js引擎极有可能保存这个数据结构。

块作用域可以解决这个问题，可以让引擎清除的知道没有必要保存someRealllyBigData了

```js
function process(data){
    //...
}
{
    let someRealllyBigData={/*...*/};
    process(someRealllyBigData);
}
var btn=document.getElementById("my_button");
btn.addEventListener("click",function click(evt){
    console.log("button clicked");
});
```

#### let循环

```js
for(let i=0;i<10;i++){
    console.log(i);
}
console.log(i);//ReferenceError
```

for循环中的let不仅绑定到for循环的块中，事实上它将其绑定到循环的每个迭代中。

```js
{
    let j;
    for(let j=0;j<10;j++){
        let i=j;//每次迭代重新绑定
        console.log(i);
    }
}
```

相对应的如果考虑用let来替代var则需要在代码重构中付出额外的精力

```js
var foo=true,baz=10;
if(foo){
    var bar=3;
    if(baz>bar){
        console.log(baz);
    }
    //...
}
```

重构后：

```js
var foo=true,baz=10;
if(foo){
    var bar=3;
    
    //...
}
if(baz>bar){
    console.log(baz);
}
```

重构成let变量时：

```js
var foo=true,baz=10;
if(foo){
    let bar=3;
    if(baz>bar){
        console.log(baz);
    }
    //...
}
```

### const

ES6引入了const，同样可以创建块作用域变量，但值是固定的。

```js
var foo=truel;
if(foo){
    var a=2;
    const b=3;
    a=3;//正常
    b=4;//错误
}
console.log(a);//3
console.log(b);//ReferenceError
```

# 提升

变量和函数在内的所有声明都会在任何代码被执行前首先被处理，这个过程叫做提升。

---

```js
a=2;
var a;
console.log(a);//2
```

编译成：

```js
var a;
a=2;
console.log(a);
```

---

```js
console.log(a);//undefined
var a=2;
```

编译成：

```js
var a;
console.log(a);
a=2;
```

---

```js
foo();
function foo(){
    console.log(a); //undefined
    var a=2;
}
```

编译成：

```js
function foo(){
    var a;
    console.log(a);
    a=2;
}
foo();
```

---

函数表达式不会提升

```js
foo();//TypeError
var foo=function bar(){
    //...
};
```

编译为：

```js
var foo;
foo();//TypeError
foo=function bar(){
    //...
};
```

---

即使是具名的函数表达式，名称标识符在赋值之前也无法使用

```js
foo();//TypeError
bar();//ReferenceError
var foo=function bar(){
    //...
}
```

编译成：

```js
var foo;
foo();
bar();
foo=function(){
    var bar = ...self...
    //...
}
```

## 函数优先

函数声明和变量声明都会被提升，但是函数会首先被提升，然后才是变量，冲突时重复的声明会被忽略

---

var foo尽管出现在function foo()...声明之前，但它是重复的声明（被忽略），因为函数声明会被提升到普通变量之前

```js
foo();//1
var foo;
function foo(){
    console.log(1);
}
foo=function(){
    console.log(2);
}
```

编译成：

```js
function foo(){
    console.log(1);
}
foo();
foo=function(){
    console.log(2);
}
```

---

尽管重复的var声明会被忽略掉，但出现在后面的函数声明还是可以覆盖前面的

```js
foo();//3
function foo(){
    console.log(1);
}
var foo=function(){
    console.log(2);
}
function foo(){
    console.log(3);
}
```

编译成：

```js
function foo(){
    console.log(3);
}
foo();//3
foo=function(){
    console.log(2);
}
```

---

一个普通块内部的函数声明通常会被提升到所在作用域的顶部，注意这个行为不可靠，在未来的版本中会发生改变，应该尽可能的避免在块内部声明函数

```js{1}
foo();//TypeError，按照定义应该是b，此处有疑问
var a=true;
if(a){
    function foo(){console.log("a");}
}else{
    function foo(){console.log("b");}
}
```

编译成：

```js
function foo () { console.log("b"); }
foo();
```

# 作用域闭包

当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行

---

```js
function foo(){
    var a=2;
    function bar(){
        console.log(a);//2
    }
    return bar;
}
var baz=foo();
baz();//2
```

- 函数bar的词法作用域能够访问foo()的内部作用域，然后bar()本身当做一个值类型传递
- bar()涵盖foo()内部作用域的闭包，使得该作用域能够一直存活，不会被垃圾回收器回收，以供bar()在之后任何时间进行引用，bar一直持有对该作用域引用，这个引用就叫做闭包

---

```js
function wait(message){
    setTimeout(function timer(){
        //timer函数一直持有对wait作用域的闭包
        console.log(message);
    },1000);
}
wait("Hello,closure!");
```

---

```js
var a=2;
(function IIFE(){
    console.log(a);
})();
```

IIFE不是典型的闭包，因为函数并不是在它本身的词法作用域以外执行的。它是在定义时所在的作用域执行，也就是全局作用域也持有a，a是通过普通的词法作用域而非闭包被发现的。

## 循环和闭包

```js
for(var i=1;i<=5;i++){
    setTimeout(function timer(){
        console.log(i);//五个6
    },i*1000);
}
```

- 这个循环的终止条件i不再<=5，条件首次成立时i的值是6
- 延迟函数的回调会在循环结束时才执行，同步环境执行 -> 事件循环1（microtask queue的All）-> 事件循环2(macrotask queue中的一个) -> 事件循环1（microtask queue的All）-> 事件循环2(macrotask queue中的一个)...
    1. 主线程读取JS代码，此时为同步环境，形成相应的堆和执行栈；
    2. 主线程遇到异步任务，指给对应的异步进程进行处理（WEB API）；
    3. 异步进程处理完毕（Ajax返回、DOM事件处罚、Timer等），将相应的异步任务推入任务队列；
    4. 主线程查询任务队列，执行microtask queue（promise,MutationObserver），将其按序执行，全部执行完毕；
    5. 主线程查询任务队列，执行macrotask queue（onclick，setTimeout，Ajax），取队首任务执行，执行完毕；
    6. 重复step4、step5。

---

试图输出1,2,3,4,5

```js
for(var i=1;i<=5;i++){
    (function(){
        setTimeout(function timer(){
            console.log(i);//五个6
        },i*1000);
    })();
}
```

此时闭包函数的作用域为空，i向上进行RHS引用，直至最外层，得到i=6，即i未记住所在的词法作用域时，不能形成闭包

---

```js
for(var i=1;i<=5;i++){
    (function(){
        var j=i;
        setTimeout(function timer(){
            console.log(j);//1,2,3,4,5
        },j*1000);
    })();
}
```

每次迭代都会保存i的值，i已记住所在的词法作用域，形成闭包

---

改进

```js
for(var i=1;i<=5;i++){
    (function(j){
        setTimeout(function timer(){
            console.log(j);//1,2,3,4,5
        },j*1000);
    })(i);
}
```