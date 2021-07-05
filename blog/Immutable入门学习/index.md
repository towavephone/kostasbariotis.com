---
title: Immutable入门学习
path: /immutable-introduce-learn/
date: 2018-7-3 18:58:22
tags: 前端, Immutable
---

# Immutable 定义

Immutable 数据就是一旦创建，就不能更改的数据。每当对 Immutable 对象进行修改的时候，就会返回一个新的 Immutable 对象，以此来保证数据的不可变

# Immutable 数据类型

1. List: 有序索引集，类似 JavaScript 中的 Array。
2. Map: 无序索引集，类似 JavaScript 中的 Object。
3. OrderedMap: 有序的 Map，根据数据的 set()进行排序。
4. Set: 没有重复值的集合。
5. OrderedSet: 有序的 Set，根据数据的 add 进行排序。
6. Stack: 有序集合，支持使用 unshift（）和 shift（）添加和删除。
7. Range(): 返回一个 Seq.Indexed 类型的集合，这个方法有三个参数，start 表示开始值，默认值为 0，end 表示结束值，默认为无穷大，step 代表每次增大的数值，默认为 1.如果 start = end,则返回空集合。
8. Repeat(): 返回一个 vSeq.Indexe 类型的集合，这个方法有两个参数，value 代表需要重复的值，times 代表要重复的次数，默认为无穷大。
9. Record: 一个用于生成 Record 实例的类。类似于 JavaScript 的 Object，但是只接收特定字符串为 key，具有默认值。
10. Seq: 序列，但是可能不能由具体的数据结构支持。
11. Collection: 是构建所有数据结构的基类，不可以直接构建。

用的最多就是 List 和 Map，所以在这里主要介绍这两种数据类型的 API。

# API 的使用

## fromJS()

### 作用

将一个 js 数据转换为 Immutable 类型的数据

### 用法

fromJS(value, converter)

### 简介

value 是要转变的数据，converter 是要做的操作。第二个参数可不填，默认情况会将数组准换为 List 类型，将对象转换为 Map 类型，其余不做操作

### 代码实现

```js
const obj = Immutable.fromJS({a:'123',b:'234'},function (key, value, path) {
    console.log(key, value, path)
    return isIndexed(value) ? value.toList() : value.toOrderedMap())
})
```

## toJS()

### 作用

将一个 Immutable 数据转换为 JS 类型的数据。

### 用法

value.toJS()

## is()

### 作用

对两个对象进行比较。

### 用法

is(map1,map2)

### 简介

和 js 中对象的比较不同，在 js 中比较两个对象比较的是地址，但是在 Immutable 中比较的是这个对象 hashCode 和 valueOf，只要两个对象的 hashCode 相等，值就是相同的，避免了深度遍历，提高了性能。

### 代码实现

```js
import { Map, is } from 'immutable';
const map1 = Map({ a: 1, b: 1, c: 1 });
const map2 = Map({ a: 1, b: 1, c: 1 });
map1 === map2; //false
Object.is(map1, map2); // false
is(map1, map2); // true
```

## List 和 Map

### List() 和 Map()

```js
List();
Map();
```

#### 作用

用来创建一个新的 List/Map 对象

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

创建一个新的包含 value 的 List/Map 对象

#### 用法

```js
List.of<T>(...values: Array<T>): List<T>
Map.of<T>(...values: Object<T>): Map<T>
```

### List.isList() 和 Map.isMap()

#### 作用

判断一个数据结构是不是 List/Map 类型

#### 用法

```js
List.isList(maybeList: any): boolean
Map.isMap(maybeMap: any): boolean
```

### size()

#### 作用

获取 List/Map 的长度

### get() 和 getIn()

#### 作用

获取数据结构中的数据

### has() 和 hasIn()

#### 作用

判断是否存在某一个 key

#### 用法

```js
Immutable.fromJS([1, 2, 3, { a: 4, b: 5 }]).has('0'); //true
Immutable.fromJS([1, 2, 3, { a: 4, b: 5 }]).hasIn([3, 'b']); //true
```

### includes()

#### 作用

判断是否存在某一个 value

#### 用法

```js
Immutable.fromJS([1, 2, 3, { a: 4, b: 5 }]).includes(2); //true
Immutable.fromJS([1, 2, 3, { a: 4, b: 5 }]).includes('2'); //false 不包含字符2
Immutable.fromJS([1, 2, 3, { a: 4, b: 5 }]).includes(5); //false
Immutable.fromJS([1, 2, 3, { a: 4, b: 5 }]).includes({ a: 4, b: 5 }); //false
Immutable.fromJS([1, 2, 3, { a: 4, b: 5 }]).includes(Immutable.fromJS({ a: 4, b: 5 })); //true
```

### first() 和 last()

#### 作用

用来获取第一个元素或者最后一个元素，若没有则返回 undefined

#### 代码

```js
Immutable.fromJS([1, 2, 3, { a: 4, b: 5 }]).first(); //1
Immutable.fromJS([1, 2, 3, { a: 4, b: 5 }]).last(); //{a:4,b:5}

Immutable.fromJS({ a: 1, b: 2, c: { d: 3, e: 4 } }).first(); //1
Immutable.fromJS({ a: 1, b: 2, c: { d: 3, e: 4 } }).first(); //{d:3,e:4}
```

### set()

#### 作用

设置第一层 key、index 的值

#### 用法

```js
set(index: number, value: T): List<T>
set(key: K, value: V): this
```

List 在使用的时候，将 index 为 number 值设置为 value。Map 在使用的时候，将 key 的值设置为 value。

在 List 中使用时，若传入的 number 为负数，则将 index 为 size+index 的值设置为 value，例，若传入-1，则将 size-1 的值设为 value。若传入的 number 的值超过了 List 的长度，则将 List 自动补全为传入的 number 的值，将 number 设置为 value，其余用 undefined 补全。注：跟 js 中不同，List 中不存在空位，[,,,],List 中若没有值，则为 undefined。

##### 代码实现

```js
//////List
const originalList = List([0]);
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
const { Map } = require('immutable');
const originalMap = Map();
const newerMap = originalMap.set('key', 'value');
const newestMap = newerMap.set('key', 'newer value');

originalMap;
// Map {}
newerMap;
// Map { "key": "value" }
newestMap;
// Map { "key": "newer value" }
```

### setIn()

#### 作用

设置深层结构中某属性的值

#### 用法

```js
setIn(keyPath: Iterable<any>, value: any): this
```

用法与 set()一样，只是第一个参数是一个数组，代表要设置的属性所在的位置

### delete() 和 deleteIn()

同上用法

### deleteAll() (Map 独有，List 没有)

#### 作用

用来删除 Map 中的多个 key

#### 用法

deleteAll(keys: Iterable<K>): this

#### 代码示例

```js
const names = Map({ a: 'Aaron', b: 'Barry', c: 'Connor' });
names.deleteAll(['a', 'c']);
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
const list = List(['a', 'b', 'c']);
const result = list.update(2, (val) => val.toUpperCase());

///Map
const aMap = Map({ key: 'value' });
const newMap = aMap.update('key', (value) => value + value);
```

### updateIn()

用法参考 setIn

### clear()

#### 作用

清除所有数据

#### 用法

clear(): this

#### 代码示例

```js
Map({ key: 'value' }).clear(); //Map
List([1, 2, 3, 4]).clear(); // List
```

## List 中的各种删除与插入

1. push()：在 List 末尾插入一个元素
2. pop(): 在 List 末尾删除一个元素
3. unshift: 在 List 首部插入一个元素
4. shift: 在 List 首部删除一个元素
5. insert：在 List 的 index 处插入元素

### 代码示例

```js
List([0, 1, 2, 3, 4]).insert(6, 5);
//List [ 0, 1, 2, 3, 4, 5 ]
List([1, 2, 3, 4]).push(5);
// List [ 1, 2, 3, 4, 5 ]
List([1, 2, 3, 4]).pop();
// List[ 1, 2, 3 ]
List([2, 3, 4]).unshift(1);
// List [ 1, 2, 3, 4 ]
List([0, 1, 2, 3, 4]).shift();
// List [ 1, 2, 3, 4 ]
```

### setSize()

List 中还有一个特有的方法用法设置 List 的长度

```js
List([])
  .setSize(2)
  .toJS(); //[undefined,undefined]
```

## 关于 merge

### merge

作用：浅合并，新数据与旧数据对比，旧数据中不存在的属性直接添加，旧数据中已存在的属性用新数据中的覆盖

### mergrWith

作用：自定义浅合并，可自行设置某些属性的值

### mergeIn

作用：对深层数据进行浅合并

### mergeDeep

作用：深合并，新旧数据中同时存在的的属性为新旧数据合并之后的数据

### mergeDeepIn

作用：对深层数据进行深合并

### mergrDeepWith

作用:自定义深合并，可自行设置某些属性的值

这里用一段示例彻底搞懂 merge，此示例为 Map 结构，List 与 Map 原理相同

```js
const Map1 = Immutable.fromJS({ a: 111, b: 222, c: { d: 333, e: 444 } });
const Map2 = Immutable.fromJS({ a: 111, b: 222, c: { e: 444, f: 555 } });

const Map3 = Map1.merge(Map2);
//Map {a:111,b:222,c:{e:444,f:555}}
const Map4 = Map1.mergeDeep(Map2);
//Map {a:111,b:222,c:{d:333,e:444,f:555}}
const Map5 = Map1.mergeWith((oldData, newData, key) => {
  if (key === 'a') {
    return 666;
  } else {
    return newData;
  }
}, Map2);
//Map {a:666,b:222,c:{e:444,f:555}}
```

## 序列算法

### concat()

作用：对象的拼接，用法与 js 数组中的 concat()相同，返回一个新的对象。

用法：`const List = list1.concat(list2)`

### map()

作用：遍历整个对象，对 Map/List 元素进行操作，返回一个新的对象。

```js
Map({ a: 1, b: 2 }).map((val) => 10 * val);
//Map{a:10,b:20}
```

### Map 特有的 mapKey()

作用：遍历整个对象，对 Map 元素的 key 进行操作，返回一个新的对象。

```js
Map({ a: 1, b: 2 }).mapKey((val) => val + 'l');
//Map{al:10,bl:20}
```

### Map 特有的 mapEntries()

作用：遍历整个对象，对 Map 元素的 key 和 value 同时进行操作，返回一个新的对象。Map 的 map()也可实现此功能。

```js
Map({ a: 1, b: 2 }).map((key, val) => {
  return [key + 'l', val * 10];
});
//Map{al:10,bl:20}
```

### 过滤 filter

作用：返回一个新的对象，包括所有满足过滤条件的元素

```js
Map({ a: 1, b: 2 }).filter((key, val) => {
  return val == 2;
});
//Map{b:2}
```

### 反转 reverse

作用：将数据的结构进行反转

```js
Immutable.fromJS([1, 2, 3, 4, 5]).reverse();
// List [5,4,3,2,1]
Immutable.fromJS({ a: 1, b: { c: 2, d: 3 }, e: 4 }).reverse();
//Map {e:4,b:{c:2,d:3},a:1}
```

### 排序 sort & sortBy

作用：对数据结构进行排序

```js
///List
Immutable.fromJS([4, 3, 5, 2, 6, 1]).sort();
// List [1,2,3,4,5,6]
Immutable.fromJS([4, 3, 5, 2, 6, 1]).sort((a, b) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  if (a === b) {
    return 0;
  }
});
// List [1,2,3,4,5,6]
Immutable.fromJS([{ a: 3 }, { a: 2 }, { a: 4 }, { a: 1 }]).sortBy(
  (val, index, obj) => {
    return val.get('a');
  },
  (a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    if (a === b) {
      return 0;
    }
  }
);
//List  [ {a:3}, {a:2}, {a:4}, {a:1} ]

//Map

Immutable.fromJS({ b: 1, a: 3, c: 2, d: 5 }).sort();
//Map {b: 1, c: 2, a: 3, d: 5}
Immutable.fromJS({ b: 1, a: 3, c: 2, d: 5 }).sort((a, b) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  if (a === b) {
    return 0;
  }
});
//Map {b: 1, c: 2, a: 3, d: 5}
Immutable.fromJS({ b: 1, a: 3, c: 2, d: 5 }).sortBy((value, key, obj) => {
  return value;
});
//Map {b: 1, c: 2, a: 3, d: 5}
```

### 分组 groupBy

作用：对数据进行分组

```js
const listOfMaps = List([Map({ v: 0 }), Map({ v: 1 }), Map({ v: 1 }), Map({ v: 0 }), Map({ v: 2 })]);
const groupsOfMaps = listOfMaps.groupBy((x) => x.get('v'));
// Map {
//   0: List [ Map{ "v": 0 }, Map { "v": 0 } ],
//   1: List [ Map{ "v": 1 }, Map { "v": 1 } ],
//   2: List [ Map{ "v": 2 } ],
// }
```

## 查找数据

### indexOf() 、 lastIndexOf，Map 不存在此方法

作用：和 js 数组中的方法相同，查找第一个或者最后一个 value 的 index 值，找不到则返回-1

```js
Immutable.fromJS([1, 2, 3, 4]).indexof(3); //2
Immutable.fromJS([1, 2, 3, 4]).lastIndexof(3); //2
```

### findIndex() 、 findLastIndex()，Map 不存在此方法

作用：查找满足要求的元素的 index 值

```js
Immutable.fromJS([1, 2, 3, 4]).findIndex((value, index, array) => {
  return value % 2 === 0;
}); // 1
Immutable.fromJS([1, 2, 3, 4]).findLastIndex((value, index, array) => {
  return index % 2 === 0;
}); // 3
```

### find() 、 findLast()

作用：查找满足条件的元素的 value 值

```js
Immutable.fromJS([1, 2, 3, 4]).find((value, index, array) => {
  return value % 2 === 0;
}); // 2

Immutable.fromJS([1, 2, 3, 4]).findLast((value, index, array) => {
  return value % 2 === 0;
}); // 4
```

### findKey() 、 findLastKey()

作用：查找满足条件的元素的 key 值

```js
Immutable.fromJS([1, 2, 3, 4]).findKey((value, index, array) => {
  return value % 2 === 0;
}); // 1

Immutable.fromJS([1, 2, 3, 4]).findLastKey((value, index, array) => {
  return value % 2 === 0;
}); // 3
```

### findEntry() 、 findLastEntry()

作用：查找满足条件的元素的键值对 key:value

```js
Immutable.fromJS([1, 2, 3, 4]).findEntry((value, index, array) => {
  return value % 2 === 0;
}); // [1,2]

Immutable.fromJS([1, 2, 3, 4]).findLastEntry((value, index, array) => {
  return value % 2 === 0;
}); // [3,4]
```

### keyOf()、lastKeyOf()

作用：查找某一个 value 对应的 key 值

```js
Immutable.fromJS([1, 2, 3, 4]).keyOf(2); //1
Immutable.fromJS([1, 2, 3, 4]).lastKeyOf(2); //1
```
