---
title: Immutable入门学习
path: /immutable-introduce-learn/
date: 2018-7-3 18:58:22
tags: 前端, Immutable
---
# Immutable 定义

Immutable数据就是一旦创建，就不能更改的数据。每当对Immutable对象进行修改的时候，就会返回一个新的Immutable对象，以此来保证数据的不可变

# Immutable 数据类型

1. List: 有序索引集，类似JavaScript中的Array。
2. Map: 无序索引集，类似JavaScript中的Object。
3. OrderedMap: 有序的Map，根据数据的set()进行排序。
4. Set: 没有重复值的集合。
5. OrderedSet: 有序的Set，根据数据的add进行排序。
6. Stack: 有序集合，支持使用unshift（）和shift（）添加和删除。
7. Range(): 返回一个Seq.Indexed类型的集合，这个方法有三个参数，start表示开始值，默认值为0，end表示结束值，默认为无穷大，step代表每次增大的数值，默认为1.如果start = end,则返回空集合。
8. Repeat(): 返回一个vSeq.Indexe类型的集合，这个方法有两个参数，value代表需要重复的值，times代表要重复的次数，默认为无穷大。
9. Record: 一个用于生成Record实例的类。类似于JavaScript的Object，但是只接收特定字符串为key，具有默认值。
10. Seq: 序列，但是可能不能由具体的数据结构支持。
11. Collection: 是构建所有数据结构的基类，不可以直接构建。

用的最多就是List和Map，所以在这里主要介绍这两种数据类型的API。

# API 的使用

## fromJS()

### 作用

将一个js数据转换为Immutable类型的数据

### 用法

fromJS(value, converter)

### 简介

value是要转变的数据，converter是要做的操作。第二个参数可不填，默认情况会将数组准换为List类型，将对象转换为Map类型，其余不做操作

### 代码实现

```js
const obj = Immutable.fromJS({a:'123',b:'234'},function (key, value, path) {
    console.log(key, value, path)
    return isIndexed(value) ? value.toList() : value.toOrderedMap())
})
```

## toJS()

### 作用

将一个Immutable数据转换为JS类型的数据。

### 用法

value.toJS()

## is()

### 作用

对两个对象进行比较。

### 用法

is(map1,map2)

### 简介

和js中对象的比较不同，在js中比较两个对象比较的是地址，但是在Immutable中比较的是这个对象hashCode和valueOf，只要两个对象的hashCode相等，值就是相同的，避免了深度遍历，提高了性能。

### 代码实现

```js
import { Map, is } from 'immutable'
const map1 = Map({ a: 1, b: 1, c: 1 })
const map2 = Map({ a: 1, b: 1, c: 1 })
map1 === map2   //false
Object.is(map1, map2) // false
is(map1, map2) // true
```

## List 和 Map

### List() 和 Map()

```js
List()
Map()
```

#### 作用

用来创建一个新的List/Map对象

#### 用法

```js
//List

List(): List<any>
List<T>(): List<T>

//Map

Map(): Map<any>
Map<T>(): Map<T>
```

### List.of() 和 Map.of()

#### 作用

创建一个新的包含value的List/Map对象

#### 用法

```js
List.of<T>(...values: Array<T>): List<T>
Map.of<T>(...values: Object<T>): Map<T>
```

### List.isList() 和 Map.isMap()

#### 作用

判断一个数据结构是不是List/Map类型

#### 用法

```js
List.isList(maybeList: any): boolean
Map.isMap(maybeMap: any): boolean
```

### size()

#### 作用

获取List/Map的长度

### get() 和 getIn()

#### 作用

获取数据结构中的数据

### has() 和 hasIn()

#### 作用

判断是否存在某一个key

#### 用法

```js
Immutable.fromJS([1,2,3,{a:4,b:5}]).has('0'); //true
Immutable.fromJS([1,2,3,{a:4,b:5}]).hasIn([3,'b']) //true
```

### includes()

#### 作用

判断是否存在某一个value

#### 用法

```js
Immutable.fromJS([1,2,3,{a:4,b:5}]).includes(2); //true
Immutable.fromJS([1,2,3,{a:4,b:5}]).includes('2'); //false 不包含字符2
Immutable.fromJS([1,2,3,{a:4,b:5}]).includes(5); //false 
Immutable.fromJS([1,2,3,{a:4,b:5}]).includes({a:4,b:5}) //false
Immutable.fromJS([1,2,3,{a:4,b:5}]).includes(Immutable.fromJS({a:4,b:5})) //true
```

### first() 和 last()

#### 作用

用来获取第一个元素或者最后一个元素，若没有则返回undefined

#### 代码

```js
Immutable.fromJS([1,2,3,{a:4,b:5}]).first()//1
Immutable.fromJS([1,2,3,{a:4,b:5}]).last()//{a:4,b:5}

Immutable.fromJS({a:1,b:2,c:{d:3,e:4}}).first() //1
Immutable.fromJS({a:1,b:2,c:{d:3,e:4}}).first() //{d:3,e:4}
```

### set()

#### 作用

设置第一层key、index的值

#### 用法

```js
set(index: number, value: T): List<T>
set(key: K, value: V): this
```

List在使用的时候，将index为number值设置为value。Map在使用的时候，将key的值设置为value。

在List中使用时，若传入的number为负数，则将index为size+index的值设置为value，例，若传入-1，则将size-1的值设为value。若传入的number的值超过了List的长度，则将List自动补全为传入的number的值，将number设置为value，其余用undefined补全。注：跟js中不同，List中不存在空位，[,,,],List中若没有值，则为undefined。

##### 代码实现

```js
//////List
const originalList = List([ 0 ]);
// List [ 0 ]
originalList.set(1, 1);
// List [ 0, 1 ]
originalList.set(0, 'overwritten');
// List [ "overwritten" ]
originalList.set(2, 2);
// List [ 0, undefined, 2 ]

List().set(50000, 'value').size;
// 50001

//////Map
const { Map } = require('immutable')
const originalMap = Map()
const newerMap = originalMap.set('key', 'value')
const newestMap = newerMap.set('key', 'newer value')

originalMap
// Map {}
newerMap
// Map { "key": "value" }
newestMap
// Map { "key": "newer value" }
```

### setIn()

#### 作用

设置深层结构中某属性的值

#### 用法

```js
setIn(keyPath: Iterable<any>, value: any): this
```

用法与set()一样，只是第一个参数是一个数组，代表要设置的属性所在的位置

### delete() 和 deleteIn()

同上用法

### deleteAll() (Map独有，List没有)

#### 作用

用来删除Map中的多个key

#### 用法

deleteAll(keys: Iterable<K>): this

#### 代码示例

```js
const names = Map({ a: "Aaron", b: "Barry", c: "Connor" })
names.deleteAll([ 'a', 'c' ])
// Map { "b": "Barry" }
```

### update()

#### 作用

对对象中的某个属性进行更新，可对原数据进行相关操作

#### 用法

```js
update(index: number, updater: (value: T) => T): this //List
update(key: K, updater: (value: V) => V): this  //Map
```

#### 代码示例

```js
////List
const list = List([ 'a', 'b', 'c' ])
const result = list.update(2, val => val.toUpperCase())

///Map
const aMap = Map({ key: 'value' })
const newMap = aMap.update('key', value => value + value)
```

### updateIn()

用法参考setIn

### clear()

#### 作用

清除所有数据

#### 用法

clear(): this

#### 代码示例

```js
Map({ key: 'value' }).clear()  //Map
List([ 1, 2, 3, 4 ]).clear()   // List
```