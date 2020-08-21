---
title: TypeScript 入门学习
date: 2020-8-21 18:25:02
path: /type-script-introduce-learn/
tags: 前端, TypeScript
---

# 前置知识

[TypeScript Handbook 入门教程](https://zhongsp.gitbooks.io/typescript-handbook/content/)

# 工具泛型的实现

## Partial

Partial 作用是将传入的属性变为可选项

### 前置知识

首先我们需要理解两个关键字 keyof 和 in, keyof 可以用来取得一个对象接口的所有 key 值，比如

```js
interface Foo {
  name: string;
  age: number
}
type T = keyof Foo // -> "name" | "age"
```

而 in 则可以遍历枚举类型, 例如

```js
type Keys = "a" | "b"
type Obj =  {
  [p in Keys]: any
} // -> { a: any, b: any }
```

### 源码解析

keyof 产生联合类型, in 则可以遍历枚举类型, 所以他们经常一起使用, 看下 Partial 源码

```js
type Partial<T> = { 
  [P in keyof T]?: T[P] 
};
```

上面语句的意思是 keyof T 拿到 T 所有属性名, 然后 in 进行遍历, 将值赋给 P, 最后 `T[P]` 取得相应属性的值

结合中间的 ? 我们就明白了 Partial 的含义了

### 使用场景

假设我们有一个定义 user 的接口，如下

```js
interface IUser {
  name: string
  age: number
  department: string
}
```

经过 Partial 类型转化后得到

```js
type optional = Partial<IUser>

// optional的结果如下
type optional = {
  name?: string | undefined;
  age?: number | undefined;
  department?: string | undefined;
}
```



