---
title: 异步异常处理的演进
date: 2021-1-11 15:34:15
categories:
  - 前端
tags: 前端, JS, 高级前端
path: /async-exception-throw-evolution/
---

我们需要一个健全的架构捕获所有同步、异步的异常。业务方不处理异常时，中断函数执行并启用默认处理，业务方也可以随时捕获异常自己处理。

优雅的异常处理方式就像冒泡事件，任何元素可以自由拦截，也可以放任不管交给顶层处理。

# 回调

如果在回调函数中直接处理了异常，是最不明智的选择，因为业务方完全失去了对异常的控制能力。

下方的函数请求处理不但永远不会执行，还无法在异常时做额外的处理，也无法阻止异常产生时笨拙的 console.log('请求失败') 行为。

```js
function fetch(callback) {
  setTimeout(() => {
    console.log('请求失败');
  });
}

fetch(() => {
  console.log('请求处理'); // 永远不会执行
});
```

# 回调，无法捕获的异常

回调函数有同步和异步之分，区别在于对方执行回调函数的时机，异常一般出现在请求、数据库连接等操作中，这些操作大多是异步的。

异步回调中，回调函数的执行栈与原函数分离开，导致外部无法抓住异常。

```js
function fetch(callback) {
  setTimeout(() => {
    throw Error('请求失败');
  });
}

try {
  fetch(() => {
    console.log('请求处理'); // 永远不会执行
  });
} catch (error) {
  console.log('触发异常', error); // 永远不会执行
}

// 程序崩溃
// Uncaught Error: 请求失败
```

# 回调，不可控的异常

我们变得谨慎，不敢再随意抛出异常，这已经违背了异常处理的基本原则。

虽然使用了 error-first 约定，使异常看起来变得可处理，但业务方依然没有对异常的控制权，是否调用错误处理取决于回调函数是否执行，我们无法知道调用的函数是否可靠。

更糟糕的问题是，业务方必须处理异常，否则程序挂掉就会什么都不做，这对大部分不用特殊处理异常的场景造成了很大的精神负担。

```js
function fetch(handleError, callback) {
  setTimeout(() => {
    handleError('请求失败');
  });
}

fetch(
  () => {
    console.log('失败处理'); // 失败处理
  },
  (error) => {
    console.log('请求处理'); // 永远不会执行
  }
);
```

# Promise 异常处理

不仅是 reject，抛出的异常也会被作为拒绝状态被 Promise 捕获。

```js
function fetch(callback) {
  return new Promise((resolve, reject) => {
    throw Error('用户不存在');
  });
}

fetch()
  .then((result) => {
    console.log('请求处理', result); // 永远不会执行
  })
  .catch((error) => {
    console.log('请求处理异常', error); // 请求处理异常 用户不存在
  });
```

# Promise 无法捕获的异常

但是，永远不要在 macrotask 队列中抛出异常，因为 macrotask 队列脱离了运行上下文环境，异常无法被当前作用域捕获。

```js
function fetch(callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      throw Error('用户不存在');
    });
  });
}

fetch()
  .then((result) => {
    console.log('请求处理', result); // 永远不会执行
  })
  .catch((error) => {
    console.log('请求处理异常', error); // 永远不会执行
  });

// 程序崩溃
// Uncaught Error: 用户不存在
```

不过 microtask 中抛出的异常可以被捕获，说明 microtask 队列并没有离开当前作用域，我们通过以下例子来证明：

```js
Promise.resolve(true)
  .then((resolve, reject) => {
    throw Error('microtask 中的异常');
  })
  .catch((error) => {
    console.log('捕获异常', error); // 捕获异常 Error: microtask 中的异常
  });
```

至此，Promise 的异常处理有了比较清晰的答案，只要注意在 macrotask 级别回调中使用 reject，就没有抓不住的异常。

# Promise 异常追问

如果第三方函数在 macrotask 回调中以 throw Error 的方式抛出异常怎么办？

```js
function thirdFunction() {
  setTimeout(() => {
    throw Error('就是任性');
  });
}

Promise.resolve(true)
  .then((resolve, reject) => {
    thirdFunction();
  })
  .catch((error) => {
    console.log('捕获异常', error);
  });

// 程序崩溃
// Uncaught Error: 就是任性
```

值得欣慰的是，由于不在同一个调用栈，虽然这个异常无法被捕获，但也不会影响当前调用栈的执行。

我们必须正视这个问题，唯一的解决办法，是第三方函数不要做这种傻事，一定要在 macrotask 抛出异常的话，请改为 reject 的方式。

```js
function thirdFunction() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('收敛一些');
    });
  });
}

Promise.resolve(true)
  .then((resolve, reject) => {
    return thirdFunction();
  })
  .catch((error) => {
    console.log('捕获异常', error); // 捕获异常 收敛一些
  });
```

请注意，如果 `return thirdFunction()` 这行缺少了 return 的话，依然无法抓住这个错误，这是因为没有将对方返回的 Promise 传递下去，错误也不会继续传递。

我们发现，这样还不是完美的办法，不但容易忘记 return，而且当同时含有多个第三方函数时，处理方式不太优雅：

```js
function thirdFunction() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('收敛一些');
    });
  });
}

Promise.resolve(true)
  .then((resolve, reject) => {
    return thirdFunction()
      .then(() => {
        return thirdFunction();
      })
      .then(() => {
        return thirdFunction();
      })
      .then(() => {});
  })
  .catch((error) => {
    console.log('捕获异常', error);
  });
```

是的，我们还有更好的处理方式。

# Async Await 异常

不论是同步、异步的异常，await 都不会自动捕获，但好处是可以自动中断函数，我们大可放心编写业务逻辑，而不用担心异步异常后会被执行引发雪崩：

```js
function fetch(callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject();
    });
  });
}

async function main() {
  const result = await fetch();
  console.log('请求处理', result); // 永远不会执行
}

main();
```

# Async Await 捕获异常

我们使用 try catch 捕获异常，为什么此时异步的异常可以通过 try catch 来捕获。

因为此时的异步其实在一个作用域中，通过 generator 控制执行顺序，所以可以将异步看做同步的代码去编写，包括使用 try catch 捕获异常。

```js
function fetch(callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('no');
    });
  });
}

async function main() {
  try {
    const result = await fetch();
    console.log('请求处理', result); // 永远不会执行
  } catch (error) {
    console.log('异常', error); // 异常 no
  }
}

main();
```

# Async Await 无法捕获的异常

和 `Promise 无法捕获的异常` 一样，这也是 await 的软肋，不过依然可以通过 `Promise 异常追问` 的方案解决：

```js
function thirdFunction() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('收敛一些');
    });
  });
}

async function main() {
  try {
    const result = await thirdFunction();
    console.log('请求处理', result); // 永远不会执行
  } catch (error) {
    console.log('异常', error); // 异常 收敛一些
  }
}

main();
```

现在解答 `Promise 异常追问` 尾部的问题，为什么 await 是更加优雅的方案：

```js
async function main() {
  try {
    const result1 = await secondFunction(); // 如果不抛出异常，后续继续执行
    const result2 = await thirdFunction(); // 抛出异常
    const result3 = await thirdFunction(); // 永远不会执行
    console.log('请求处理', result); // 永远不会执行
  } catch (error) {
    console.log('异常', error); // 异常 收敛一些
  }
}

main();
```

# 业务场景

在如今 action 概念成为标配的时代，我们大可以将所有异常处理收敛到 action 中。

我们以如下业务代码为例，默认不捕获错误的话，错误会一直冒泡到顶层，最后抛出异常。

```js
const successRequest = () => Promise.resolve('a');
const failRequest = () => Promise.reject('b');

class Action {
  async successReuqest() {
    const result = await successRequest();
    console.log('successReuqest', '处理返回值', result); // successReuqest 处理返回值 a
  }

  async failReuqest() {
    const result = await failRequest();
    console.log('failReuqest', '处理返回值', result); // 永远不会执行
  }

  async allReuqest() {
    const result1 = await successRequest();
    console.log('allReuqest', '处理返回值 success', result1); // allReuqest 处理返回值 success a
    const result2 = await failRequest();
    console.log('allReuqest', '处理返回值 success', result2); // 永远不会执行
  }
}

const action = new Action();
action.successReuqest();
action.failReuqest();
action.allReuqest();

// 程序崩溃
// Uncaught (in promise) b
// Uncaught (in promise) b
```

为了防止程序崩溃，需要业务线在所有 async 函数中包裹 try catch。

我们需要一种机制捕获 action 最顶层的错误进行统一处理。

# 业务场景 统一异常捕获

我们来编写类级别装饰器，专门捕获 async 函数抛出的异常：

```js
const asyncClass = (errorHandler?: (error?: Error) => void) => (target: any) => {
  Object.getOwnPropertyNames(target.prototype).forEach((key) => {
    const func = target.prototype[key];
    target.prototype[key] = async (...args: any[]) => {
      try {
        await func.apply(this, args);
      } catch (error) {
        errorHandler && errorHandler(error);
      }
    };
  });
  return target;
};
```

将类所有方法都用 try catch 包裹住，将异常交给业务方统一的 errorHandler 处理：

```js
const successRequest = () => Promise.resolve('a');
const failRequest = () => Promise.reject('b');

const iAsyncClass = asyncClass((error) => {
  console.log('统一异常处理', error); // 统一异常处理 b
});

@iAsyncClass
class Action {
  async successReuqest() {
    const result = await successRequest();
    console.log('successReuqest', '处理返回值', result);
  }

  async failReuqest() {
    const result = await failRequest();
    console.log('failReuqest', '处理返回值', result); // 永远不会执行
  }

  async allReuqest() {
    const result1 = await successRequest();
    console.log('allReuqest', '处理返回值 success', result1);
    const result2 = await failRequest();
    console.log('allReuqest', '处理返回值 success', result2); // 永远不会执行
  }
}

const action = new Action();
action.successReuqest();
action.failReuqest();
action.allReuqest();
```

我们也可以编写方法级别的异常处理：

```js
const asyncMethod = (errorHandler?: (error?: Error) => void) => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const func = descriptor.value;
  return {
    get() {
      return (...args: any[]) => {
        return Promise.resolve(func.apply(this, args)).catch((error) => {
          errorHandler && errorHandler(error);
        });
      };
    },
    set(newValue: any) {
      return newValue;
    }
  };
};
```

业务方用法类似，只是装饰器需要放在函数上：

```js
const successRequest = () => Promise.resolve('a');
const failRequest = () => Promise.reject('b');

const asyncAction = asyncMethod((error) => {
  console.log('统一异常处理', error); // 统一异常处理 b
});

class Action {
  @asyncAction async successReuqest() {
    const result = await successRequest();
    console.log('successReuqest', '处理返回值', result);
  }

  @asyncAction async failReuqest() {
    const result = await failRequest();
    console.log('failReuqest', '处理返回值', result); // 永远不会执行
  }

  @asyncAction async allReuqest() {
    const result1 = await successRequest();
    console.log('allReuqest', '处理返回值 success', result1);
    const result2 = await failRequest();
    console.log('allReuqest', '处理返回值 success', result2); // 永远不会执行
  }
}

const action = new Action();
action.successReuqest();
action.failReuqest();
action.allReuqest();
```

# 业务场景 没有后顾之忧的主动权

在上面这种场景下，业务方是不用担心异常导致的 crash，因为所有异常都会在顶层统一捕获，可能表现为弹出一个提示框，告诉用户请求发送失败。

业务方也不需要判断程序中是否存在异常，而战战兢兢的到处 try catch，因为程序中任何异常都会立刻终止函数的后续执行，不会再引发更恶劣的结果。

> 像 golang 中异常处理方式，就存在这个问题通过 err, result := func() 的方式，虽然固定了第一个参数是错误信息，但下一行代码免不了要以 if error {...} 开头，整个程序的业务代码充斥着巨量的不必要错误处理，而大部分时候，我们还要为如何处理这些错误想的焦头烂额。

而 js 异常冒泡的方式，在前端可以用提示框兜底，nodejs 端可以返回 500 错误兜底，并立刻中断后续请求代码，等于在所有危险代码身后加了一层隐藏的 return。

同时业务方也握有绝对的主动权，比如登录失败后，如果账户不存在，那么直接跳转到注册页，而不是傻瓜的提示用户帐号不存在，可以这样做：

```js
async login(nickname, password) {
    try {
        const user = await userService.login(nickname, password)
        // 跳转到首页，登录失败后不会执行到这，所以不用担心用户看到奇怪的跳转
    } catch (error) {
        if (error.no === -1) {
            // 跳转到登录页
        } else {
            throw Error(error) // 其他错误不想管，把球继续踢走
        }
    }
}
```

# 补充

在 nodejs 端，记得监听全局错误，兜住落网之鱼：

```js
process.on('uncaughtException', (error: any) => {
  logger.error('uncaughtException', error);
});

process.on('unhandledRejection', (error: any) => {
  logger.error('unhandledRejection', error);
});
```

在浏览器端，记得监听 window 全局错误，兜住漏网之鱼：

```js
window.addEventListener('unhandledrejection', (event: any) => {
  logger.error('unhandledrejection', event);
});
window.addEventListener('onrejectionhandled', (event: any) => {
  logger.error('onrejectionhandled', event);
});
```
