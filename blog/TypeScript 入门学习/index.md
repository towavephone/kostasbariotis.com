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

## Decorator

Decorator 早已不是什么新鲜事物，在 TypeScript 1.5 + 的版本中，我们可以利用内置类型 ClassDecorator、PropertyDecorator、MethodDecorator 与 ParameterDecorator 更快书写 Decorator，如 MethodDecorator：

```js
declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
```

使用时，只需在相应地方加上类型注解，匿名函数的参数类型也就会被自动推导出来了。

```js
function methodDecorator(): MethodDecorator {
  return (target, key, descriptor) => {
    // ...
  };
}
```

值得一提的是，如果你在 Decorator 给目标类的 prototype 添加属性时，TypeScript 并不知道这些：

```js
function testAble(): ClassDecorator {
  return target => {
    target.prototype.someValue = true
  }
}

@testAble()
class SomeClass {}

const someClass = new SomeClass()

someClass.someValue() // Error: Property 'someValue' does not exist on type 'SomeClass'.
```

这很常见，特别是当你想用 Decorator 来扩展一个类时。

GitHub 上有一个关于此问题的 issues，直至目前，也没有一个合适的方案实现它。其主要问题在于 TypeScript 并不知道目标类是否使用了 Decorator 以及 Decorator 的名称。从这个 issues 来看，建议的解决办法是使用 Mixin：

```js
type Constructor<T> = new(...args: any[]) => T

// mixin 函数的声明，需要实现
declare function mixin<T1, T2>(...MixIns: [Constructor<T1>, Constructor<T2>]): Constructor<T1 & T2>;

class MixInClass1 {
    mixinMethod1() {}
}

class MixInClass2 {
    mixinMethod2() {}
}

class Base extends mixin(MixInClass1, MixInClass2) {
    baseMethod() { }
}

const x = new Base();

x.baseMethod(); // OK
x.mixinMethod1(); // OK
x.mixinMethod2(); // OK
x.mixinMethod3(); // Error
```

当把大量的 JavaScript Decorator 重构为 Mixin 时，这无疑是一件让人头大的事情。

这有一些偏方，能让你顺利从 JavaScript 迁移至 TypeScript：

- 显式赋值断言修饰符，即是在类里，明确说明某些属性存在于类上：

    ```js
    function testAble(): ClassDecorator {
      return target => {
        target.prototype.someValue = true
      }
    }

    @testAble()
    class SomeClass {
      public someValue!: boolean;
    }

    const someClass = new SomeClass();
    someClass.someValue // true
    ```

- 采用声明合并形式，单独定义一个 interface，把用 Decorator 扩展的属性的类型，放入 interface 中：

    ```js
    interface SomeClass {
      someValue: boolean;
    }

    function testAble(): ClassDecorator {
      return target => {
        target.prototype.someValue = true
      }
    }

    @testAble()
    class SomeClass {}

    const someClass = new SomeClass();
    someClass.someValue // true
    ```

## Reflect Metadata

Reflect Metadata 是 ES7 的一个提案，它主要用来在声明的时候添加和读取元数据。TypeScript 在 1.5+ 的版本已经支持它，你只需要：

- npm i reflect-metadata --save。
- 在 tsconfig.json 里配置 emitDecoratorMetadata 选项。

它具有诸多使用场景。

### 获取类型信息

譬如在 vue-property-decorator 6.1 及其以下版本中，通过使用 Reflect.getMetadata API，Prop Decorator 能获取属性类型传至 Vue，简要代码如下：

```js
function Prop(): PropertyDecorator {
  return (target, key: string) => {
    const type = Reflect.getMetadata('design:type', target, key);
    console.log(`${key} type: ${type.name}`);
    // other...
  }
}

class SomeClass {
  @Prop()
  public Aprop!: string;
};
```

运行代码可在控制台看到 Aprop type: string。除能获取属性类型外，通过 Reflect.getMetadata("design:paramtypes", target, key) 和 Reflect.getMetadata("design:returntype", target, key) 可以分别获取函数参数类型和返回值类型。

### 自定义 metadataKey

除能获取类型信息外，常用于自定义 metadataKey，并在合适的时机获取它的值，示例如下：

```js
function classDecorator(): ClassDecorator {
  return target => {
    // 在类上定义元数据，key 为 `classMetaData`，value 为 `a`
    Reflect.defineMetadata('classMetaData', 'a', target);
  }
}

function methodDecorator(): MethodDecorator {
  return (target, key, descriptor) => {
    // 在类的原型属性 'someMethod' 上定义元数据，key 为 `methodMetaData`，value 为 `b`
    Reflect.defineMetadata('methodMetaData', 'b', target, key);
  }
}

@classDecorator()
class SomeClass {

  @methodDecorator()
  someMethod() {}
};

Reflect.getMetadata('classMetaData', SomeClass);                         // 'a'
Reflect.getMetadata('methodMetaData', new SomeClass(), 'someMethod');    // 'b'
```

### 用例

#### 控制反转和依赖注入

在 Angular 2+ 的版本中，控制反转与依赖注入便是基于此实现，现在，我们来实现一个简单版：

```js
type Constructor<T = any> = new (...args: any[]) => T;

const Injectable = (): ClassDecorator => target => {}

class OtherService {
  a = 1
}

@Injectable()
class TestService {
  constructor(public readonly otherService: OtherService) {}

  testMethod() {
    console.log(this.otherService.a);
  }
}

const Factory = <T>(target: Constructor<T>): T  => {
  // 获取所有注入的服务
  const providers = Reflect.getMetadata('design:paramtypes', target); // [OtherService]
  const args = providers.map((provider: Constructor) => new provider());
  return new target(...args);
}

Factory(TestService).testMethod()   // 1
```

#### Controller 与 Get 的实现

如果你在使用 TypeScript 开发 Node 应用，相信你对 Controller、Get、POST 这些 Decorator，并不陌生：

```js
@Controller('/test')
class SomeClass {

  @Get('/a')
  someGetMethod() {
    return 'hello world';
  }

  @Post('/b')
  somePostMethod() {}
};
```

它们也是基于 Reflect Metadata 实现，不同的是，这次我们将 metadataKey 定义在 descriptor 的 value 上（稍后解释），简单实现如下：

```js
const METHOD_METADATA = 'method'；
const PATH_METADATA = 'path'；

const Controller = (path: string): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
  }
}

const createMappingDecorator = (method: string) => (path: string): MethodDecorator => {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
  }
}

const Get = createMappingDecorator('GET');
const Post = createMappingDecorator('POST');
```

接着，创建一个函数，映射出 route：

```js
function mapRoute(instance: Object) {
  const prototype = Object.getPrototypeOf(instance);
  
  // 筛选出类的 methodName
  const methodsNames = Object.getOwnPropertyNames(prototype)
                              .filter(item => !isConstructor(item) && isFunction(prototype[item]));
  return methodsNames.map(methodName => {
    const fn = prototype[methodName];

    // 取出定义的 metadata
    const route = Reflect.getMetadata(PATH_METADATA, fn);
    const method = Reflect.getMetadata(METHOD_METADATA, fn);
    return {
      route,
      method,
      fn,
      methodName
    }
  })
};
```

我们可以得到一些有用的信息：

```js
Reflect.getMetadata(PATH_METADATA, SomeClass);  // '/test'

mapRoute(new SomeClass())

/**
 * [{
 *    route: '/a',
 *    method: 'GET',
 *    fn: someGetMethod() { ... },
 *    methodName: 'someGetMethod'
 *  },{
 *    route: '/b',
 *    method: 'POST',
 *    fn: somePostMethod() { ... },
 *    methodName: 'somePostMethod'
 * }]
 * 
 */
```

最后，只需把 route 相关信息绑在 express 或者 koa 上就 ok 了。

至于为什么要定义在 descriptor 的 value 上，我们希望 mapRoute 函数的参数是一个实例，而非 class 本身（控制反转）。

## 数组与元组

创建一个数组很简单：

```js
const arr = [1];
```

此时 TypeScript 将会推断 arr 类型为 number[]：

```js
arr.push('1');  // Error
```

当数组元素具有其它类型时，可以通过类型注解的方式：

```js
const arr: Array<string | number> = [1];

arr.push('1');  // OK
arr.push(true);  // Error
```

或者你也可以通过可选元组的方式：

```js
const arr: [number, string?] = [1];  // arr 的成员类型可以是: number, string, undefined 
arr.push('1');   // OK
arr.push(true);   // Error
```

使用元组形式，还能提供指定位置的类型检查：

```js
arr[0] = '1';   // Error
arr[1] = 1;    // Error
```

### 使用

通常，我们使用 Promise.all 并行发出多个请求：

```js
interface A {
  name: string;
}

interface B {
  age: number;
}

const [{ data: a }, { data: b }] = await Promise.all([
  axios.get<A>('http://some.1'),
  axios.get<B>('http://some.2')
])
```

此时，TypeScript 能推出 a 的类型是 A, b 的类型是 B。

现在，稍作改变：当满足特定条件时，才发出第二个请求：

```js
// 使用类型注解
const requestList: [Promise<AxiosResponse<A>>, Promise<AxiosResponse<B>>?]
                    = [axios.get<A>('http://some.1')];
if (flag) {
  requestList[1] = (axios.get<B>('http://some.2'));
};
const [ { data: a }, response ] = await Promise.all(requestList);
```

我们期望它会如预想时那样工作，可是事与愿违，Promise.all(requestList)，会出现类型兼容性的报错，在这个 Issues 里，描述了相同的问题。

现在，你可以通过断言的方式，来让程序正常运作：

```js
const requestList: any[]  = [axios.get<A>('http://some.1')];  // 设置为 any[] 类型
if (flag) {
  requestList[1] = (axios.get<B>('http://some.2'));
}
const [
  { data: a },
  response
] = await Promise.all(requestList) as [AxiosResponse<A>, AxiosResponse<B>?] // 类型安全
```

## 字面量类型

在 JavaScript 基础上，TypeScript 扩展了一系列字面量类型，用来确保类型的准确性。

如创建一个字符串字面量：

```js
const a = 'hello';  // a 的类型是 'hello'
a = 'world';   // Error
```

或者你也可以：

```js
let a: 'hello' = 'hello';  // a 的类型是 'hello'
a = 'world';     // Error
```

其它数据类型与此相似。

你也可以定义交叉类型与联合类型的字面量：

```js
interface A {
  name: string;
}
interface B {
  name: string;
  age: number;
}

type C = A | B;
type D = A & B;
```

### 对象字面量类型

对于对象字面量的类型，TypeScript 有一个被称之为 `Freshness` 的概念，它也被称为更严格的对象字面量检查，如下例子：

```js
let someThing: { name: string };
someThing = { name: 'hello' };              // ok
someThing = { name: 'hello', age: 123 };    // Error, 对象字面量只能指定已知属性, { name: string } 类型中不存在 age 属性

let otherThing = { name: 'hello', age: 123 };
someThing = otherThing;                     // ok
```

TypeScript 认为创建的每个对象字面量都是 `fresh` 状态；当一个 `fresh` 对象字面量赋值给一个变量时，如果对象的类型与变量类型不兼容时，会出现报错（如上例子中 someThine = { name: 'hello', age: 123 }; 的错误）；当对象字面量的类型变宽，对象字面量的 `fresh` 状态会消失（如上例子中 someThing = otherThing; ，赋值以后，someThing 的类型变宽）。

一个更实际的用例如下：

```js
function logName(something: { name: string }) {
  console.log(something.name);
}

const obj = {
  name: 'matt',
  job: 'being awesome'
}

logName(obj); // ok
logName({ name: 'matt' }); // ok
logName({ nama: 'matt' }); // Error: nama 属性在 { name: string } 属性中不存在。
logName({ name: 'matt', job: 'being awesome' }); // Error: 对象字面量只能指定已知属性，`job` 属性在这里并不存在。
```

基本原理与上文中相似，当想用更严格的类型检查时，可以传一个具有 fresh 状态的对象字面量（如 logName({ name: 'matt', job: 'being awesome' });）。当你想多传一些属性至函数，可以将对象字面量赋值至一个新变量，然后再传至函数（如 logName(obj)）。或者你也可以通过给函数形参添加多余类型的方式 function logName(someThing: { name: string; [key: string]: string })。
