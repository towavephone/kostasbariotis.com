---
title: JS 设计模式
original:
date: 2017-11-16 17:51:52
categories:
  - 前端
path: /js-design-pattern/
tags: 前端, 设计模式, JS
---

## 单例模式

```js
var singleton = function(fn) {
  var result;
  return function() {
    return result || (result = fn.apply(this, arguments));
  };
};

var createMask = singleton(function() {
  return document.body.appendChild(document.createElement('div'));
});
```

## 简单工厂模式

> 这段代码来自 es5 的 new 和构造器的相关说明，可以看到，所谓的 new 本身只是一个对象的复制和改写过程， 而具体会生成什么是由调用 ObjectFactory 时传进去的参数所决定的。

```js
function A(name) {
  this.name = name;
}

function ObjectFactory() {
  var obj = {},
    Constructor = Array.prototype.shift.call(arguments);
  obj.__proto__ = typeof Constructor.prototype === 'number' ? Object.prototype : Constructor.prototype;
  var ret = Constructor.apply(obj, arguments);
  return typeof ret === 'object' ? ret : obj;
}

var a = ObjectFactory(A, 'svenzeng');
alert(a.name); // svenzeng
```

## 观察者模式

```js
Events = function() {
  var listen, log, obj, one, remove, trigger, __this;
  obj = {};
  __this = this;
  listen = function(key, eventfn) {
    // 把简历扔盒子, key 就是联系方式.
    var stack, _ref; // stack 是盒子
    stack = (_ref = obj[key]) != null ? _ref : (obj[key] = []);
    return stack.push(eventfn);
  };
  one = function(key, eventfn) {
    remove(key);
    return listen(key, eventfn);
  };
  remove = function(key) {
    var _ref;
    return (_ref = obj[key]) != null ? (_ref.length = 0) : void 0;
  };
  trigger = function() {
    // 面试官打电话通知面试者
    var fn, stack, _i, _len, _ref, key;
    key = Array.prototype.shift.call(arguments);
    stack = (_ref = obj[key]) != null ? _ref : (obj[key] = []);
    console.log(key, stack, obj[key]);
    for (_i = 0, _len = stack.length; _i < _len; _i++) {
      fn = stack[_i];
      if (fn.apply(__this, arguments) === false) {
        return false;
      }
    }
  };
  return {
    listen: listen,
    one: one,
    remove: remove,
    trigger: trigger
  };
};

var adultTv = Events();
console.log(adultTv);
adultTv.listen('play', function(data) {
  alert('今天是谁的电影' + data.name);
});
adultTv.listen('play', function(data) {
  alert('今天是' + data.name);
});
// 发布者
adultTv.trigger('play', {
  name: '广告'
});
adultTv.trigger('play', {
  name: '麻生'
});
```

## 适配器模式

```js
my.category = adapterCategory(afu.category);
$id = function(id) {
  return jQuery('##' + id)[0];
};
```

## 代理模式

```js
var keyMgr = keyManage();

keyMgr.listen('change', proxy(function(keyCode) {
  console.log(keyCode); // 前下前 + 拳
)});

var request = Ajax.get('cgi.xx.com/xxx');
request.send();
request.done(function() {

});
```

## 桥接模式

```js
forEach = function(ary, fn) {
  for (var i = 0, l = ary.length; i < l; i++) {
    var c = ary[i];
    if (fn.call(c, i, c) === false) {
      return false;
    }
  }
};

forEach([1, 2, 3], function(i, n) {
  alert(n * 2);
});

forEach([1, 2, 3], function(i, n) {
  alert(n * 3);
});
```

## 外观模式

```js
var stopEvent = function(e) {
  // 同时阻止事件默认行为和冒泡
  e.stopPropagation();
  e.preventDefault();
};
```

## 访问者模式

```js
function ArrayPush() {
    var n = TO_UINT32(this.length);
    var m = %_ArgumentsLength();
    for (var i = 0; i < m; i++) {
      this[i + n] = %_Arguments(i); // 属性拷贝
    }
    this.length = n + m; // 修正 length
    return this.length;
}
// 访问者模式先把一些可复用的行为抽象到一个函数（对象）里，这个函数我们就称为访问者（Visitor）。
// 如果另外一些对象要调用这个函数，只需要把那些对象当作参数传给这个函数，在 js 里我们经常通过 call 或者 apply 的方式传递 this 对象给一个 Visitor 函数
var obj = {};
obj.push = function() {
    return Array.prototype.push.apply(this, arguments);
};
obj.push("first");
alert(obj[0]) // "first"
alert(obj.length); // 1
```

## 策略模式

```js
nameInput.addValidata({
  notNull: true,
  dirtyWords: true,
  maxLength: 30
});
// 而 notNull，maxLength 等方法只需要统一的返回 true 或者 false，来表示是否通过了验证。
validataList = {
  notNull: function(value) {
    return value !== '';
  },
  maxLength: function(value, maxLen) {
    return value.length() > maxLen;
  }
};

var validator = {
  // 所有可以验证规则处理类存放的地方，后面会单独定义
  types: {},
  // 验证类型所对应的错误消息
  messages: [],
  // 当然需要使用的验证类型
  config: {},
  // 暴露的公开验证方法
  // 传入的参数是 key => value 对
  validate: function(data) {
    var i, msg, type, checker, result_ok;
    // 清空所有的错误信息
    this.messages = [];
    for (i in data) {
      if (data.hasOwnProperty(i)) {
        type = this.config[i]; // 根据 key 查询是否有存在的验证规则
        checker = this.types[type]; // 获取验证规则的验证类
        if (!type) {
          continue; // 如果验证规则不存在，则不处理
        }
        if (!checker) {
          // 如果验证规则类不存在，抛出异常
          throw {
            name: 'ValidationError',
            message: 'No handler to validate type ' + type
          };
        }
        result_ok = checker.validate(data[i]); // 使用查到的单个验证类进行验证
        if (!result_ok) {
          msg = 'Invalid value for *' + i + '*, ' + checker.instructions;
          this.messages.push(msg);
        }
      }
    }
    return this.hasErrors();
  },
  // helper
  hasErrors: function() {
    return this.messages.length !== 0;
  }
};

// 验证给定的值是否不为空
validator.types.isNonEmpty = {
  validate: function(value) {
    return value !== '';
  },
  instructions: '传入的值不能为空'
};

// 验证给定的值是否是数字
validator.types.isNumber = {
  validate: function(value) {
    return !isNaN(value);
  },
  instructions: '传入的值只能是合法的数字，例如：1, 3.14 or 2010'
};

// 验证给定的值是否只是字母或数字
validator.types.isAlphaNum = {
  validate: function(value) {
    return !/[^a-z0-9]/i.test(value);
  },
  instructions: '传入的值只能保护字母和数字，不能包含特殊字符'
};

var data = {
  first_name: 'Tom',
  last_name: 'Xu',
  age: 'unknown',
  username: 'TomXu'
};
// 该对象的作用是检查验证类型是否存在
validator.config = {
  first_name: 'isNonEmpty',
  age: 'isNumber',
  username: 'isAlphaNum'
};

validator.validate(data);

if (validator.hasErrors()) {
  console.log(validator.messages.join('\n'));
}
```

## 模版方法模式

```js
var Life = function() {
}

Life.prototype.init = function() {
   this.DNA复制();
   this.出生();
   this.成长();
   this.衰老();
   this.死亡();
}

this.prototype.DNA复制 = function() {
  // &*$%&^%^&(&(&(&&(^^(*)  //看不懂的代码
}

Life.prototype.出生 = function() {
}

Life.prototype.成长 = function() {
}

Life.prototype.衰老 = function() {
}

Life.prototype.死亡 = function() {
}

var Mammal = function() {
}

Mammal.prototype = Life.prototype; // 继承 Life

Mammal.prototope.出生 = function() {
  // 胎生()
}

Mammal.prototype.成长 = function() {
 // 再留给子类去实现
}

Mammal.prototope.衰老 = function() {
  // 自由基的过氧化反应
}

Life.prototype.死亡 = function() {
 // 再留给子类去实现
}

//再实现一个 Dog 类
var = Dog = function() {
}

// Dog 继承自哺乳动物
Dog.prototype = Mammal.prototype;
var dog = new Dog();
dog.init();
```

## 中介者模式

```js
var mode1 = Mode.create(),
  mode2 = Mode.create();
var view1 = View.create(),
  view2 = View.create();
var controler1 = Controler.create(mode1, view1, function() {
  view1.el.find('div').bind('click', function() {
    this.innerHTML = mode1.find('data');
  });
});
var controler2 = Controler.create(mode2, view2, function() {
  view1.el.find('div').bind('click', function() {
    this.innerHTML = mode2.find('data');
  });
});
```

## 迭代器模式

```js
forEach = function(ary, fn) {
  for (var i = 0, l = ary.length; i < l; i++) {
    var c = ary[i];
    if (fn.call(c, i, c) === false) {
      return false;
    }
  }
};

forEach([1, 2, 3], function(i, n) {
  alert(i);
});
```

## 组合模式

```js
var allNodes = document.getElementsByTagName('*');
var len = allNodes.length;
while (len--) {
  allNodes.unbind('*');
}
form.validata = function() {
  forEach(fields, function(index, field) {
    if (field.validata() === false) {
      return false;
    }
  });
  return true;
};
```

## 备忘录模式

```js
var Page = (function() {
  var page = 1,
    cache = {},
    data;
  return function(page) {
    if (cache[page]) {
      data = cache[page];
      render(data);
    } else {
      Ajax.send('cgi.xx.com/xxx', function(data) {
        cache[page] = data;
        render(data);
      });
    }
  };
})();
```

## 职责链模式

js 中的事件冒泡就是作为一个职责链来实现的。一个事件在某个节点上被触发，然后向根节点传递， 直到被节点捕获。

## 享元模式

```js
var getDiv = (function() {
  var created = [];
  var create = function() {
    return document.body.appendChild(document.createElement('div'));
  };
  var get = function() {
    if (created.length) {
      return created.shift();
    } else {
      return create();
    }
  };
  /* 一个假设的事件，用来监听刚消失在视线外的 div，实际上可以通过监听滚动条位置来实现 */
  userInfoContainer.disappear(function(div) {
    created.push(div);
  });
})();
var div = getDiv();
div.innerHTML = '${userinfo}';
```

## 状态模式

```js
if (state === 'jump') {
  if (currState === 'attack' || currState === 'defense') {
    return false;
  }
} else if (state === 'wait') {
  if (currState === 'attack' || currState === 'defense') {
    return true;
  }
}

var StateManager = function() {
  var currState = 'wait';
  var states = {
    jump: function(state) {},
    wait: function(state) {},
    attack: function(state) {},
    crouch: function(state) {},
    defense: function(state) {
      if (currState === 'jump') {
        return false; // 不成功，跳跃的时候不能防御
      }
      // do something; // 防御的真正逻辑代码, 为了防止状态类的代码过多, 应该把这些逻辑继续扔给真正的fight类来执行.
      currState = 'defense'; // 切换状态
    }
  };
  var changeState = function(state) {
    states[state] && states[state]();
  };
  return {
    changeState: changeState
  };
};
var stateManager = StateManager();
stateManager.changeState('defense');
```
