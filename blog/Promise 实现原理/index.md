---
title: Promise 实现原理
date: 2020-12-25 10:59:33
path: /promise-implementation-principle/
tags: 前端, JS, 高级前端
---

# 简化版

## 代码

这个 Promise 的实现不考虑任何异常情况，只考虑代码最简短，从而便于读者理解核心的异步链式调用原理。

```js
function Promise(fn) {
  this.cbs = [];

  const resolve = (value) => {
    setTimeout(() => {
      this.data = value;
      this.cbs.forEach((cb) => cb(value));
    });
  };

  fn(resolve);
}

Promise.prototype.then = function(onResolved) {
  return new Promise((resolve) => {
    this.cbs.push(() => {
      const res = onResolved(this.data);
      if (res instanceof Promise) {
        res.then(resolve);
      } else {
        resolve(res);
      }
    });
  });
};
```

## 核心案例

```js
new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
})
  .then((res) => {
    console.log(res);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, 500);
    });
  })
  .then(console.log);
```

本文将围绕这个最核心的案例来讲，这段代码的表现如下：

1. 500ms 后输出 1
2. 500ms 后输出 2

## 实现

### 构造函数

首先来实现 Promise 构造函数

```js
function Promise(fn) {
  // Promise resolve 时的回调函数集
  this.cbs = [];

  // 传递给 Promise 处理函数的 resolve
  // 这里直接往实例上挂个 data
  // 然后把 onResolvedCallback 数组里的函数依次执行一遍就可以
  const resolve = (value) => {
    // 注意 promise 的 then 函数需要异步执行
    setTimeout(() => {
      this.data = value;
      this.cbs.forEach((cb) => cb(value));
    });
  };

  // 执行用户传入的函数
  // 并且把 resolve 方法交给用户执行
  fn(resolve);
}
```

好，写到这里先回过头来看案例

```js
const fn = (resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
};

new Promise(fn);
```

分开来看，fn 就是用户传的函数，这个函数内部调用了 resolve 函数后，就会把 promise 实例上的 cbs 全部执行一遍。

到此为止我们还不知道 cbs 这个数组里的函数是从哪里来的，接着往下看。

### then

这里是最重要的 then 实现，链式调用全靠它：

```js
Promise.prototype.then = function(onResolved) {
  // 这里叫做 promise2
  return new Promise((resolve) => {
    this.cbs.push(() => {
      const res = onResolved(this.data);
      if (res instanceof Promise) {
        // resolve 的权力被交给了 user promise
        res.then(resolve);
      } else {
        // 如果是普通值就直接 resolve
        // 依次执行 cbs 里的函数，并且把值传递给 cbs
        resolve(res);
      }
    });
  });
};
```

再回到案例里

```js
const fn = (resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 500);
};

const promise1 = new Promise(fn);

promise1.then((res) => {
  console.log(res);
  // user promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, 500);
  });
});
```

注意这里的命名：

1. 我们把 new Promise 返回的实例叫做 promise1
2. 在 Promise.prototype.then 的实现中，我们构造了一个新的 promise 返回，叫它 promise2
3. 在用户调用 then 方法的时候，用户手动构造了一个 promise 并且返回，用来做异步的操作，叫它 user promise

那么在 then 的实现中，内部的 this 其实就指向 promise1

而 promise2 的传入的 fn 函数执行了一个 this.cbs.push()，其实是往 promise1 的 cbs 数组中 push 了一个函数，等待后续执行。

```js
Promise.prototype.then = function(onResolved) {
  // 这里叫做promise2
  return new Promise((resolve) => {
    // 这里的this其实是promise1
    this.cbs.push(() => {});
  });
};
```

那么重点看这个 push 的函数，注意，这个函数在 promise1 被 resolve 了以后才会执行。

```js
// promise2
return new Promise((resolve) => {
  this.cbs.push(() => {
    // onResolved 就对应 then 传入的函数
    const res = onResolved(this.data);
    // 例子中的情况 用户自己返回了一个user promise
    if (res instanceof Promise) {
      // user promise 的情况
      // 用户会自己决定何时 resolve promise2
      // 只有 promise2 被 resolve 以后
      // then 下面的链式调用函数才会继续执行
      res.then(resolve);
    } else {
      resolve(res);
    }
  });
});
```

如果用户传入给 then 的 onResolved 方法返回的是个 user promise，那么这个 user promise 里用户会自己去在合适的时机 resolve promise2，那么进而这里的 res.then(resolve) 中的 resolve 就会被执行：

```js
if (res instanceof Promise) {
  res.then(resolve);
}
```

结合下面这个例子来看：

```js
new Promise((resolve) => {
  setTimeout(() => {
    // resolve1
    resolve(1);
  }, 500);
})
  // then1
  .then((res) => {
    console.log(res);
    // user promise
    return new Promise((resolve) => {
      setTimeout(() => {
        // resolve2
        resolve(2);
      }, 500);
    });
  })
  // then2
  .then(console.log);
```

then1 这一整块其实返回的是 promise2，那么 then2 其实本质上是 promise2.then(console.log)，也就是说 then2 注册的回调函数，其实进入了 promise2 的 cbs 回调数组里，又因为我们刚刚知道，resolve2 调用了之后，user promise 会被 resolve，进而触发 promise2 被 resolve，进而 promise2 里的 cbs 数组被依次触发。

这样就实现了用户自己写的 resolve2 执行完毕后，then2 里的逻辑才会继续执行，也就是异步链式调用。

# 完整版

## Promise 标准解读

1. 只有一个 then 方法，没有 catch，race，all 等方法，甚至没有构造函数

   Promise 标准中仅指定了 Promise 对象的 then 方法的行为，其它一切我们常见的方法/函数都并没有指定，包括 catch，race，all 等常用方法，甚至也没有指定该如何构造出一个 Promise 对象，另外 then 也没有一般实现中（Q, \$q 等）所支持的第三个参数，一般称 onProgress

2. then 方法返回一个新的 Promise

   Promise 的 then 方法返回一个新的 Promise，而不是返回 this，此处在下文会有更多解释

   ```js
   promise2 = promise1.then(alert);
   promise2 != promise1; // true
   ```

3. 不同 Promise 的实现需要可以相互调用(interoperable)
4. Promise 的初始状态为 pending，它可以由此状态转换为 fulfilled（本文为了一致把此状态叫做 resolved）或者 rejected，一旦状态确定，就不可以再次转换为其它状态，状态确定的过程称为 settle

## 构造函数

因为标准并没有指定如何构造一个 Promise 对象，所以我们同样以目前一般 Promise 实现中通用的方法来构造一个 Promise 对象，也是 ES6 原生 Promise 里所使用的方式，即：

```js
// Promise 构造函数接收一个 executor 函数，executor 函数执行完同步或异步操作后，调用它的两个参数 resolve 和 reject
var promise = new Promise(function(resolve, reject) {
  /*
    如果操作成功，调用 resolve 并传入 value
    如果操作失败，调用 reject 并传入 reason
  */
});
```

我们先实现构造函数的框架如下：

```js
function Promise(executor) {
  var self = this;
  self.status = 'pending'; // Promise 当前的状态
  self.data = undefined; // Promise 的值
  self.onResolvedCallback = []; // Promise resolve 时的回调函数集，因为在 Promise 结束之前有可能有多个回调添加到它上面
  self.onRejectedCallback = []; // Promise reject 时的回调函数集，因为在 Promise 结束之前有可能有多个回调添加到它上面

  executor(resolve, reject); // 执行 executor 并传入相应的参数
}
```

上面的代码基本实现了 Promise 构造函数的主体，但目前还有两个问题：

1. 我们给 executor 函数传了两个参数：resolve 和 reject，这两个参数目前还没有定义
2. executor 有可能会出错（throw），类似下面这样，而如果 executor 出错，Promise 应该被其 throw 出的值 reject：

   ```js
   new Promise(function(resolve, reject) {
     throw 2;
   });
   ```

所以我们需要在构造函数里定义 resolve 和 reject 这两个函数：

```js
function Promise(executor) {
  var self = this;
  self.status = 'pending'; // Promise 当前的状态
  self.data = undefined; // Promise 的值
  self.onResolvedCallback = []; // Promise resolve 时的回调函数集，因为在 Promise 结束之前有可能有多个回调添加到它上面
  self.onRejectedCallback = []; // Promise reject 时的回调函数集，因为在 Promise 结束之前有可能有多个回调添加到它上面

  function resolve(value) {}

  function reject(reason) {}

  try {
    // 考虑到执行 executor 的过程中有可能出错，所以我们用 try/catch 块给包起来，并且在出错后以 catch 到的值 reject 掉这个 Promise
    executor(resolve, reject); // 执行executor
  } catch (e) {
    reject(e);
  }
}
```

有人可能会问，resolve 和 reject 这两个函数能不能不定义在构造函数里呢？考虑到我们在 executor 函数里是以 resolve(value)，reject(reason) 的形式调用的这两个函数，而不是以 resolve.call(promise, value)，reject.call(promise, reason) 这种形式调用的，所以这两个函数在调用时的内部也必然有一个隐含的 this，也就是说，要么这两个函数是经过 bind 后传给了 executor，要么它们定义在构造函数的内部，使用 self 来访问所属的 Promise 对象。所以如果我们想把这两个函数定义在构造函数的外部，确实是可以这么写的：

```js
function resolve() {}
function reject() {}
function Promise(executor) {
  try {
    executor(resolve.bind(this), reject.bind(this));
  } catch (e) {
    reject.bind(this)(e);
  }
}
```

但是众所周知，bind 也会返回一个新的函数，这么一来还是相当于每个 Promise 对象都有一对属于自己的 resolve 和 reject 函数，就跟写在构造函数内部没什么区别了，所以我们就直接把这两个函数定义在构造函数里面了。不过话说回来，如果浏览器对 bind 有优化，使用后一种形式应该可以提升一下内存使用效率。

另外我们这里的实现并没有考虑隐藏 this 上的变量，这使得这个 Promise 的状态可以在 executor 函数外部被改变，在一个靠谱的实现里，构造出的 Promise 对象的状态和最终结果应当是无法从外部更改的。

接下来，我们实现 resolve 和 reject 这两个函数

```js
function Promise(executor) {
  // ...

  function resolve(value) {
    if (self.status === 'pending') {
      self.status = 'resolved';
      self.data = value;
      for (var i = 0; i < self.onResolvedCallback.length; i++) {
        self.onResolvedCallback[i](value);
      }
    }
  }

  function reject(reason) {
    if (self.status === 'pending') {
      self.status = 'rejected';
      self.data = reason;
      for (var i = 0; i < self.onRejectedCallback.length; i++) {
        self.onRejectedCallback[i](reason);
      }
    }
  }

  // ...
}
```

基本上就是在判断状态为 pending 之后把状态改为相应的值，并把对应的 value 和 reason 存在 self 的 data 属性上面，之后执行相应的回调函数，逻辑很简单，这里就不多解释了。

// TODO https://github.com/xieranmaya/blog/issues/3
