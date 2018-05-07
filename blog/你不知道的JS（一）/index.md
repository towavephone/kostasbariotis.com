---
title: 你不知道的JS（一）
categories:
  - 面试
tags: 面试, You Don't know JS
path: /you-dont-know-js-1/
date: 2018-04-21 17:52:46
---
# 作用域与闭包

## 作用域是什么

### LHS与RHS

LHS 和 RHS 的含义是`赋值操作的左侧或右侧`并不一定意味着就是` = 赋值操作符的左侧或右侧`。赋值操作还有其他几种形式，因此在概念上最好将其理解为`赋值操作（LHS）`以及`获取变量值（RHS）`。



```js
function foo(a) {// a的LHS引用，把2赋给a
    console.log( a ); // console的RHS引用，内置对象的调用；a的RHS应用，a的调用
}
foo( 2 ); // foo的RHS引用，调用foo
```

### 作用域

LHS 和 RHS 引用都会在当前作用域进行查找，如果还是没有找到就继续向上，以此类推。

```js
function foo(a) {
    console.log( a + b );
}
var b = 2;
foo( 2 ); // 4
```

对 b 进行的 RHS 引用无法在函数 foo 内部完成，但可以在上一级作用域（在这个例子中就是全局作用域）中完成。

### 异常

- 区分 LHS 和 RHS 的意义：在变量还没有声明（在任何作用域中都无法找到该变量）的情况下，这两种查询的行为是不一样的。
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

### 小测验

```js
function foo(a) {
    var b = a;
    return a + b;
}
var c = foo( 2 );
```

1. 找出所有的 LHS 查询（这里有 3 处！）
    c = ..; 、 a = 2 （隐式变量分配）、 b = ..
2. 找出所有的 RHS 查询（这里有 4 处！）
    foo(2.. 、 = a; 、 a .. 、 .. b