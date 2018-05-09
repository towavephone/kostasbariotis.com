---
title: 腾讯一面面试总结
categories:
  - 面试
path: /tx-interview-part-1-summary/
tags: 面试, 腾讯一面
date: 2018-04-27 12:02:32
---

注：只总结与项目无关的知识

## Ionic框架是做什么的？

Ionic 是一个用HTML, CSS 跟JS 开发的一个用于移动设备的混合APP 开发框架，采用 Sass与AngularJS 开发。

## Ionic前身是解决什么问题的？

开发混合手机应用的，开源的，免费的代码库，开发成本低

## websocket怎么实现的？

WebSocket是HTML5出的东西（协议），也就是说HTTP协议没有变化，或者说没关系，但HTTP是不支持持久连接的（长连接，循环连接的不算）

### 客户端发出websocket

```js 客户端websocket
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

```js
Upgrade: websocket
Connection: Upgrade
```

这个就是Websocket的核心了，告诉Apache、Nginx等服务器，找到对应的websocket请求处理器

```js
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
```

- Sec-WebSocket-Key 是一个Base64 encode的值，这个是浏览器随机生成的，告诉服务器验证是不是真的是Websocket助理。
- Sec_WebSocket-Protocol 是一个用户定义的字符串，用来区分同URL下，不同的服务所需要的协议。简单理解要服务A来处理，- Sec-WebSocket-Version 是告诉服务器所使用的Websocket Draft（协议版本），然后服务器会返回下列东西，表示已经接受到请求，成功建立Websocket！

### 服务器响应websocket

```js 服务器websocket
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
Sec-WebSocket-Protocol: chat
```

- 这里开始就是HTTP最后负责的区域了，告诉客户端，我已经成功切换协议~
- Sec-WebSocket-Accept 这个则是经过服务器确认，并且加密过后的 Sec-WebSocket-Key。服务器：好啦好啦，知道啦，给你看我的ID CARD来证明行了吧。
- Sec-WebSocket-Protocol 则是表示最终使用的协议。至此，HTTP已经完成它所有工作了，接下来就是完全按照Websocket协议进行了。

```js
Upgrade: websocket
Connection: Upgrade
```

依然是固定的，告诉客户端即将升级的是Websocket协议，而不是mozillasocket，lurnarsocket或者shitsocket。

### websocket背景

**背景技术**

- ajax轮询
    ```js
    setInterval(function() {
        $.ajax({
            url: 'https://www.baidu.com/',
            success: function() {
                //success code
            }
        });
    }, 3000);
    ```
    ajax轮询的原理非常简单，让浏览器隔个几秒就发送一次请求，询问服务器是否有新信息。
- long poll 
    ```js
    function async() {
        $.ajax({
            url: 'http://api.3g.qq.com',
            success: function() {
                async();
                //success code
            }
        });
    }
    ```
    采用轮询的方式，不过采取的是阻塞模型，也就是说，客户端发起连接后，如果没消息，就一直不返回Response给客户端。直到有消息才返回，返回完之后，客户端再次建立连接，周而复始。

**相同点**

都是在不断地建立HTTP连接，然后等待服务端处理，可以体现HTTP协议的另外一个特点，被动性。

**缺点**

- ajax轮询需要服务器有很快的处理速度和资源。
- long poll需要有很高的并发，也就是说同时响应客户端的能力。

### websocket实现原理

- 我们所用的程序是要经过两层代理的，即HTTP协议在Nginx等服务器的解析下，然后再传送给相应的Handler（PHP等）来处理。
- 简单地说，我们有一个非常快速的接线员（Nginx），他负责把问题转交给相应的客服（Handler）。本身接线员基本上速度是足够的，但是每次都卡在客服（Handler）了，老有客服处理速度太慢，导致客服不够。
- Websocket就解决了这样一个难题，建立后，可以直接跟接线员建立持久连接，有信息的时候客服想办法通知接线员，然后接线员在统一转交给客户。这样就可以解决客服处理速度过慢的问题了。

### js调用代码

```js
var websocket = new WebSocket("ws://www.host.com/path");   
websocket.onopen = function(evt) { onOpen(evt) };   
websocket.onclose = function(evt) { onClose(evt) };   
websocket.onmessage = function(evt) { onMessage(evt) };   
websocket.onerror = function(evt) { onError(evt) }; }    
function onMessage(evt) { alert( evt.data); }  
function onError(evt) { alert( evt.data); }    
websocket.send("client to server"); 
```

## 还有什么别的方式来实现消息推送机制？

1. 长链接 
    例如用 iframe 维护长链接开销较大，而且页面会显示一直在加载，不利于使用
2. flash socket
    利用 flash 插件提供的 socket，需要会 flash，无法避免如安全

## 双向绑定是怎么实现的？

### 发布者-订阅者模式（backbone.js）

一般通过sub, pub的方式实现数据和视图的绑定监听，更新数据方式通常做法是vm.set('property', value)，这种方式现在毕竟太low了，我们更希望通过 vm.property = value 这种方式更新数据，同时自动更新视图，于是有了下面两种方式

### 脏值检查（angular.js）

angular.js 是通过脏值检测的方式比对数据是否有变更，来决定是否更新视图，最简单的方式就是通过 setInterval() 定时轮询检测数据变动，当然Google不会这么low，angular只有在指定的事件触发时进入脏值检测，大致如下：

- DOM事件，譬如用户输入文本，点击按钮等( ng-click )
- XHR响应事件 ( $http )
- 浏览器Location变更事件 ( $location )
- Timer事件( &#36timeout , &#36interval )
- 执行 &#36digest() 或 &#36apply()

### 数据劫持（vue.js）

vue.js 则是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

### mvvm的实现

[]
通过Object.defineProperty()来实现对属性的劫持，达到监听数据变动的目的

1. 实现一个数据监听器Observer，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者
2. 实现一个指令解析器Compile，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数
3. 实现一个Watcher，作为连接Observer和Compile的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图
4. mvvm入口函数，整合以上三者

![mvvm架构](./132184689-57b310ea1804f_articlex.png)

## 301与302区别？

302重定向只是暂时的重定向，搜索引擎会抓取新的内容而保留旧的地址，因为服务器返回302，所以，搜索搜索引擎认为新的网址是暂时的。

301重定向是永久的重定向，搜索引擎在抓取新的内容的同时也将旧的网址替换为了重定向之后的网址。

## jquery中bind和on的用法？以及他们的区别？优缺点？

### bind()

1. 使用方式：$(selector).bind(event,data,function)；
2. event：必需项；添加到元素的一个或多个事件，例如 click,dblclick 等；
3. 单事件处理：例如 $(selector).bind("click",data,function)；
4. 多事件处理：
    1. 利用空格分隔多事件，例如 $(selector).bind("click dbclick mouseout",data,function);
    2. 利用大括号灵活定义多事件，例如 $(selector).bind({event1:function, event2:function, ...})；
    3. 空格相隔方式：绑定较为死板，不能给事件单独绑定函数,适合处理多个事件调用同一函数情况；
    4. 大括号替代方式：绑定较为灵活，可以给事件单独绑定函数；
5. data：可选；需要传递的参数；
6. function：必需；当绑定事件发生时，需要执行的函数；
7. 适用所有版本，但是根据官网解释，自从jquery1.7版本以后bind()函数推荐用on()来代替。

### on()

1. 使用方式：$(selector).on(event,childselector,data,function):
2. event：必需项；添加到元素的一个或多个事件，例如 click,dblclick 等；
3. 单事件处理：例如 $(selector).on("click",childselector,data,function);
4. 多事件处理：
    1. 利用空格分隔多事件，例如 $(selector).on("click dbclick mouseout",childseletor,data,function);
    2. 利用大括号灵活定义多事件，例如 $(selector).on({event1:function, event2:function, ...},childselector);　
    3. 空格相隔方式：绑定较为死板，不能给事件单独绑定函数,适合处理多个事件调用同一函数情况；
    4. 大括号替代方式：绑定较为灵活，可以给事件单独绑定函数；　
5. childSelector: 可选；需要添加事件处理程序的元素，一般为selector的子元素；　　  
6. data：可选；需要传递的参数；
7. function：必需；当绑定事件发生时，需要执行的函数；
8. jquery1.7及其以上版本；jquery1.7版本出现之后用于替代bind()，live()绑定事件方式；

### 相同点：

1. 都支持单元素多事件的绑定，空格相隔方式或者大括号替代方式;
2. 均是通过事件冒泡方式，将事件传递到document进行事件的响应；

### 比较和联系:

1. bind()函数只能针对已经存在的元素进行事件的设置；但是live(),on(),delegate()均支持未来新添加元素的事件设置；
2. bind()函数在jquery1.7版本以前比较受推崇，1.7版本出来之后，官方已经不推荐用bind()，替代函数为on()，这也是1.7版本新添加的函数，同样，可以用来代替live()函数，live()函数在1.9版本已经删除；
3. live()函数和delegate()函数两者类似，但是live()函数在执行速度，灵活性和CSS选择器支持方面较delegate()差些，想了解具体情况，[请戳这](http://kb.cnblogs.com/page/94469/)；
4. bind()支持Jquery所有版本；live()支持jquery1.8-；delegate()支持jquery1.4.2+；on()支持jquery1.7+；
5. 如果项目中引用jquery版本为低版本，推荐用delegate(),高版本jquery可以使用on()来代替。
6. 商家后台技术栈？react是什么东西？react虚拟dom算法的实现方式？虚拟dom是什么？
7. 重绘与重排是什么？他们的区别？有一个动画怎样实现使它的dom的重排重绘改变最小？也就是更流畅？
8. 什么是一级dom和二级dom？
9. 什么是事件委托？
10. 跨域的几种实现方式？其中postMessage内部的实现方式？调用过程？伪装域名怎么解决？其中服务器端怎么实现Access-Control-Allow-Origin的跨域的（怎么拦截跨域的）？
11. 浏览器事件规则的传递？
12. 缓存的实现方式？
13. dns的查询过程？



