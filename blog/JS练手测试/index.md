---
title: JS练手测试
date: 2019-7-22 12:09:53
categories:
- 前端
tags: 前端, JS
path: /js-practice-test/
---

# JS测试一

![](2019-07-22-17-18-49.png)

# 具体实现

## 我的解答

```js
//第一题
4
//第二题
arr.filter((item) => !!item)
//第三题
[1, NaN, empty, NAN]
//第四题
var arr3 = [];
for (var i = 0;i < arr.length; i++) {
  arr3.push(arr[i]);
}
for (var j = 0;j < arr2.length; j++) {
  arr3.push(arr2[i]);
}
//第五题
[...new Set(arr3)]
```

## 最佳解答

```js
//第一题
4
//第二题
arr.filter((item) => true)
// 或者 arr.flat()
//第三题
[1, NaN, empty, NAN]
//第四题
arr.concat(arr2)
//第五题
[...new Set(arr3)]
```

# 实现要点

1. 空数组项也会作为length的一部分；空数组项和空字符串项是有区别的。
2. 第2题，本题只是过滤空数组项，不包括null, undefined这类。
3. 去除空数组项两个比较好的回答：
   1. 数组中的 empty 元素不会参与数组项遍历，故只需返回 true 即可过滤掉 empty 元素（而不会牵连 0、NaN、null、undefined、'' 这些）arr.filter(it => true)。然后补充，但是走for循环，还是会遍历empty数组项。
   2. 或者filter方法参数直接就是一个function即可。例如：~arr.filter(Boolean)~（纠正：不能是Boolean，false会被过滤），arr.filter(Number)， arr.filter(String)
   3. 上面并不是最好的方法。数组有个API，天然去除空数组项，arr.flat()。flat()可以让数组扁平化的方法。
4. 第3题标准答案应该是[1, NaN, NaN]，map里面Function支持参数(value, index, arr)，参见wingmeng的释义。
5. 第4题就是concat，可以数组合并。我自己用“连接猫”记忆这个API。可以分别连接子项，也可以直接连接数组。如果不考虑兼容，可以[...arr, ...arr2]。其他参考方法：Array.prototype.push.apply(arr3, arr2)，也可以[].push.apply(arr3, arr2)，此时arr3是合并后的数组。
6. 数组去重。使用new Set(arr3)，然后把Set对象转换成数组。转数组两个常用方法，一个是Array.from，还有一个是`[...]`。
