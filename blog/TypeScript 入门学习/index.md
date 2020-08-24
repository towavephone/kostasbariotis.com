---
title: TypeScript 入门学习
date: 2020-8-21 18:25:02
path: /type-script-introduce-learn/
tags: 前端， TypeScript
---

# 背景知识

[TypeScript Handbook 入门教程](https://zhongsp.gitbooks.io/typescript-handbook/content/)

# 工具泛型的实现

## Partial

Partial 作用是将传入的属性变为可选项

### 前置知识

首先我们需要理解两个关键字 keyof 和 in，keyof 可以用来取得一个对象接口的所有 key 值，比如

```js
interface Foo {
  name: string;
  age: number;
}
type T = keyof Foo // -> "name" | "age"
```

而 in 则可以遍历枚举类型， 例如

```js
type Keys = "a" | "b"
type Obj =  {
  [p in Keys]: any
} // -> { a: any， b: any }
```

### 源码解析

keyof 产生联合类型，in 则可以遍历枚举类型，所以他们经常一起使用，看下 Partial 源码

```js
type Partial<T> = { 
  [P in keyof T]?: T[P] 
};
```

上面语句的意思是 keyof T 拿到 T 所有属性名，然后 in 进行遍历，将值赋给 P，最后 `T[P]` 取得相应属性的值

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

## Required

Required 的作用是将传入的属性变为必选项，源码如下

```js
type Required<T> = { 
  [P in keyof T]-?: T[P] 
};
```

我们发现一个有意思的用法 -?，这里很好理解就是将可选项代表的 ? 去掉，从而让这个类型变成必选项。

与之对应的还有个+? ，这个含义自然与-?之前相反，它是用来把属性变成可选项的.

## Mutable (未包含)

类似地，其实还有对 + 和 -，这里要说的不是变量的之间的进行加减而是对 readonly 进行加减。

以下代码的作用就是将 T 的所有属性的 readonly 移除，你也可以写一个相反的出来.

```js
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}
```

## Readonly

将传入的属性变为只读选项, 源码如下

```js
type Readonly<T> = { 
  readonly [P in keyof T]: T[P] 
};
```

## Record

### 前置知识

此处注意 K extends keyof T 和直接使用 K in keyof T 的区别，keyof T 仅仅代表键的字符串文字类型，
而 extends keyof T 将返回该属性相同的类型

```js
function prop<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

function prop2<T>(obj: T, key: keyof T) {
    return obj[key];
}

let o = {
    p1: 0,
    p2: ''
}

let v = prop(o, 'p1') // is number, K is of type 'p1'
let v2 = prop2(o, 'p1') // is number | string, no extra info is captured
```

### 源码解析

将 K 中所有的属性的值转化为 T 类型

```js
type Record<K extends keyof any, T> = { 
  [P in K]: T 
};
```

## Pick

从 T 中取出一系列 K 的属性

```js
type Pick<T, K extends keyof T> = { 
  [P in K]: T[P]
};
```

## Exclude

### 前置知识

在 ts 2.8 中引入了一个条件类型，示例如下

```js
T extends U ? X : Y
```

以上语句的意思就是如果 T 是 U 的子类型的话，那么就会返回 X，否则返回 Y，甚至可以组合多个

```js
type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";
```

对于联合类型来说会自动分发条件，例如 T extends U ? X : Y，T 可能是 A | B 的联合类型，那实际情况就变成(A extends U ? X : Y) | (B extends U ? X : Y)

### 源码解析

```js
type Exclude<T, U> = T extends U ? never : T;
```

结合实例

```js
type T = Exclude<1 | 2, 1 | 3> // -> 2
```

很轻松地得出结果 2，据代码和示例我们可以推断出 Exclude 的作用是从 T 中找出 U 中没有的元素，换种更加贴近语义的说法其实就是从 T 中排除 U

## Extract

根据源码我们推断出 Extract 的作用是提取出 T 包含在 U 中的元素，换种更加贴近语义的说法就是从 T 中提取出 U

源码如下

```js
type Extract<T, U> = T extends U ? T : never;
```

## Omit

用之前的 Pick 和 Exclude 进行组合，实现忽略对象某些属性功能，源码如下

```js
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

// 使用
type Foo = Omit<{name: string, age: number}, 'name'> // -> { age: number }
```

## ReturnType

在阅读源码之前我们需要了解一下 infer 这个关键字，在条件类型语句中，我们可以用 infer 声明一个类型变量并且对它进行使用，我们可以用它获取函数的返回类型，源码如下

```js
type ReturnType<T> = T extends (
  ...args: any[]
) => infer R
  ? R
  : any;
```

其实这里的 infer R 就是声明一个变量来承载传入函数签名的返回值类型，简单说就是用它取到函数返回值的类型方便之后使用

```js
function foo(x: number): Array<number> {
  return [x];
}
type fn = ReturnType<typeof foo>;
```

## AxiosReturnType (未包含)

开发经常使用 axios 进行封装 API 层请求，通常是一个函数返回一个 `AxiosPromise<Resp>`，现在我想取到它的 Resp 类型，根据上一个工具泛型的知识我们可以这样写

```js
import { AxiosPromise } from 'axios' // 导入接口
type AxiosReturnType<T> = T extends (...args: any[]) => AxiosPromise<infer R> ? R : any

// 使用
type Resp = AxiosReturnType<Api> // 泛型参数中传入你的 Api 请求函数
```

# 巧用 TypeScript

## 函数重载

TypeScript 提供函数重载的功能，用来处理因函数参数不同而返回类型不同的使用场景，使用时只需为同一个函数定义多个类型即可，简单使用如下所示：

```js
declare function test(a: number): number;
declare function test(a: string): string;

const resS = test('Hello World');  // resS 被推断出类型为 string；
const resN = test(1234);           // resN 被推断出类型为 number;
```

它也适用于参数不同，返回值类型相同的场景，我们只需要知道在哪种函数类型定义下能使用哪些参数即可。

考虑如下例子：

```js
interface User {
  name: string;
  age: number;
}

declare function test(para: User | number, flag?: boolean): number;
```

在这个 test 函数里，我们的本意可能是当传入参数 para 是 User 时，不传 flag，当传入 para 是 number 时，传入 flag。TypeScript 并不知道这些，当你传入 para 为 User 时，flag 同样允许你传入：

```js
const user = {
  name: 'Jack',
  age: 666
}

// 没有报错，但是与想法违背
const res = test(user, false);
```

使用函数重载能帮助我们实现：

```js
interface User {
  name: string;
  age: number;
}

declare function test(para: User): number;
declare function test(para: number, flag: boolean): number;

const user = {
  name: 'Jack',
  age: 666
};

// bingo
// Error: 参数不匹配
const res = test(user, false);
```

实际项目中，你可能要多写几步，如在 class 中：

```js
interface User {
  name: string;
  age: number;
}

const user = {
  name: 'Jack',
  age: 123
};

class SomeClass {

  /**
   * 注释 1
   */
  public test(para: User): number;
  /**
   * 注释 2
   */
  public test(para: number, flag: boolean): number;
  public test(para: User | number, flag?: boolean): number {
    // 具体实现
    return 11;
  }
}

const someClass = new SomeClass();

// ok
someClass.test(user);
someClass.test(123, false);

// Error，涉及到具体实现时，这个地方报错
someClass.test(123);
someClass.test(user, false);
```

## 映射类型

自从 TypeScript 2.1 版本推出映射类型以来，它便不断被完善与增强。在 2.1 版本中，可以通过 keyof 拿到对象 key 类型，内置 Partial、Readonly、Record、Pick 映射类型；2.3 版本增加 ThisType；2.8 版本增加 Exclude、Extract、NonNullable、ReturnType、InstanceType；同时在此版本中增加条件类型与增强 keyof 的能力；3.1 版本支持对元组与数组的映射。这些无不意味着映射类型在 TypeScript 有着举足轻重的地位。

其中 ThisType 并没有出现在官方文档中，它主要用来在对象字面量中键入 this：

```js
// Compile with --noImplicitThis

type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>;  // Type of 'this' in methods is D & M
}

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx;  // Strongly typed this
      this.y += dy;  // Strongly typed this
    }
  }
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

> 正是由于 ThisType 的出现，Vue 2.5 才得以增强对 TypeScript 的支持。

虽已内置了很多映射类型，但在很多时候，我们需要根据自己的项目自定义映射类型：

比如你可能想取出接口类型中的函数类型：

```js
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never 
}[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

interface Part {
  id: number;
  name: string;
  subparts: Part[];
  updatePart(newName: string): void;
}

type T40 = FunctionPropertyNames<Part>;  // "updatePart"
type T42 = FunctionProperties<Part>;     // { updatePart(newName: string): void }
```

比如你可能为了便捷，把本属于某个属性下的方法，通过一些方式 alias 到其他地方

举个例子：SomeClass 下有个属性 value = [1, 2, 3]，你可能在 Decorators 给类添加了此种功能：在 SomeClass 里调用 this.find() 时，实际上是调用 this.value.find()，但是此时 TypeScript 并不知道这些：

```js
class SomeClass {
  value = [1, 2, 3];

  someMethod() {
    this.value.find(/* ... */);  // ok
    this.find(/* ... */);        // Error：SomeClass 没有 find 方法。
  }
}
```

借助于映射类型和 interface + class 的声明方式，可以实现我们的目的：

```js
type ArrayMethodName = 'filter' | 'forEach' | 'find';

type SelectArrayMethod<T> = {
 [K in ArrayMethodName]: Array<T>[K]
}

interface SomeClass extends SelectArrayMethod<number> {}

class SomeClass {
 value = [1, 2, 3];

 someMethod() {
   this.forEach(/* ... */)        // ok
   this.find(/* ... */)           // ok
   this.filter(/* ... */)         // ok
   this.value                     // ok
   this.someMethod()              // ok
 }
}

const someClass = new SomeClass();
someClass.forEach(/* ... */)        // ok
someClass.find(/* ... */)           // ok
someClass.filter(/* ... */)         // ok
someClass.value                     // ok
someClass.someMethod()              // ok
```

> 导出 SomeClass 类时，也能使用。

可能有点不足的地方，在这段代码里 `interface SomeClass extends SelectArrayMethod<number> {}` 你需要手动添加范型的具体类型（暂时没想到更好方式）。

## 类型断言

类型断言用来明确的告诉 TypeScript 值的详细类型，合理使用能减少我们的工作量。

比如一个变量并没有初始值，但是我们知道它的类型信息（它可能是从后端返回）有什么办法既能正确推导类型信息，又能正常运行了？有一种网上的推荐方式是设置初始值，然后使用 typeof 拿到类型（可能会给其他地方用）。然而我可能比较懒，不喜欢设置初始值，这时候使用类型断言可以解决这类问题：

```js
interface User {
  name: string;
  age: number;
}

export default class NewRoom extends Vue {
  private user = {} as User;
}
```

在设置初始化时，添加断言，我们就无须添加初始值，编辑器也能正常的给予代码提示了。如果 user 属性很多，这样就能解决大量不必要的工作了，定义的 interface 也能给其他地方使用。

## 枚举类型

枚举类型分为数字类型与字符串类型，其中数字类型的枚举可以当标志使用：

```js
// https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts#L3859
export const enum ObjectFlags {
  Class            = 1 << 0,  // Class
  Interface        = 1 << 1,  // Interface
  Reference        = 1 << 2,  // Generic type reference
  Tuple            = 1 << 3,  // Synthesized generic tuple type
  Anonymous        = 1 << 4,  // Anonymous
  Mapped           = 1 << 5,  // Mapped
  Instantiated     = 1 << 6,  // Instantiated anonymous or mapped type
  ObjectLiteral    = 1 << 7,  // Originates in an object literal
  EvolvingArray    = 1 << 8,  // Evolving array type
  ObjectLiteralPatternWithComputedProperties = 1 << 9,  // Object literal pattern with computed properties
  ContainsSpread   = 1 << 10, // Object literal contains spread operation
  ReverseMapped    = 1 << 11, // Object contains a property from a reverse-mapped type
  JsxAttributes    = 1 << 12, // Jsx attributes type
  MarkerType       = 1 << 13, // Marker type used for variance probing
  JSLiteral        = 1 << 14, // Object type declared in JS - disables errors on read/write of nonexisting members
  ClassOrInterface = Class | Interface
}
```

在 TypeScript src/compiler/types 源码里，定义了大量如上所示的基于数字类型的常量枚举。它们是一种有效存储和表示布尔值集合的方法。

在 《深入理解 TypeScript》 中有一个使用例子：

```js
enum AnimalFlags {
  None        = 0,
  HasClaws    = 1 << 0,
  CanFly      = 1 << 1,
  HasClawsOrCanFly = HasClaws | CanFly
}

interface Animal {
  flags: AnimalFlags;
  [key: string]: any;
}

function printAnimalAbilities(animal: Animal) {
  var animalFlags = animal.flags;
  if (animalFlags & AnimalFlags.HasClaws) {
    console.log('animal has claws');
  }
  if (animalFlags & AnimalFlags.CanFly) {
    console.log('animal can fly');
  }
  if (animalFlags == AnimalFlags.None) {
    console.log('nothing');
  }
}

var animal = { flags: AnimalFlags.None };
printAnimalAbilities(animal); // nothing
animal.flags |= AnimalFlags.HasClaws;
printAnimalAbilities(animal); // animal has claws
animal.flags &= ~AnimalFlags.HasClaws;
printAnimalAbilities(animal); // nothing
animal.flags |= AnimalFlags.HasClaws | AnimalFlags.CanFly;
printAnimalAbilities(animal); // animal has claws, animal can fly
```

上例代码中 |= 用来添加一个标志，&= 和 ~ 用来删除标志，| 用来合并标志。
