---
title: Page Visibility(页面可见性) API介绍
date: 2020-1-3 21:04:40
path: /page-visibility-api-introduction-extend/
tags: 前端, JS, JS知识点
---

# API

目前页面可见性 API 有两个属性，一个事件，如下：

- document.hidden: Boolean 值，表示当前页面可见还是不可见
- document.visibilityState: 返回当前页面的可见状态
  - hidden
  - visible
  - prerender
  - preview
- visibilitychange: 当可见状态改变时候触发的事件

# 兼容

```js
var pageVisibility = (function() {
  var prefixSupport,
    keyWithPrefix = function(prefix, key) {
      if (prefix !== '') {
        // 首字母大写
        return prefix + key.slice(0, 1).toUpperCase() + key.slice(1);
      }
      return key;
    };
  var isPageVisibilitySupport = (function() {
    var support = false;
    if (typeof window.screenX === 'number') {
      ['webkit', 'moz', 'ms', 'o', ''].forEach(function(prefix) {
        if (support == false && document[keyWithPrefix(prefix, 'hidden')] != undefined) {
          prefixSupport = prefix;
          support = true;
        }
      });
    }
    return support;
  })();

  var isHidden = function() {
    if (isPageVisibilitySupport) {
      return document[keyWithPrefix(prefixSupport, 'hidden')];
    }
    return undefined;
  };

  var visibilityState = function() {
    if (isPageVisibilitySupport) {
      return document[keyWithPrefix(prefixSupport, 'visibilityState')];
    }
    return undefined;
  };

  return {
    hidden: isHidden(),
    visibilityState: visibilityState(),
    visibilitychange: function(fn, usecapture) {
      usecapture = undefined || false;
      if (isPageVisibilitySupport && typeof fn === 'function') {
        return document.addEventListener(
          prefixSupport + 'visibilitychange',
          function(evt) {
            this.hidden = isHidden();
            this.visibilityState = visibilityState();
            fn.call(this, evt);
          }.bind(this),
          usecapture
        );
      }
      return undefined;
    }
  };
})(undefined);
```

与`原生属性事件`对应关系如下：

```js
pageVisibility.hidden === document.hidden（兼容处理）
pageVisibility.visibilityState=== document.visibilityState（兼容处理）
pageVisibility.visibilitychange(function() { /* this指的就是pageVisibility */ }); === document.addEventListener("visibilitychange", function() {});（兼容处理）
```

# 应用

## 视频播放

进入页面播放，离开页面暂停。

<iframe src="/examples/page-visibility-api-introduction-extend/play-video.html" width="400" height="300"></iframe>

`embed:page-visibility-api-introduction-extend/play-video.html`

## 登录同步

1. 去淘宝买东西，未登录状态下，进入首页。
2. 然后新窗口打开任意页面，登录并成功返回。
3. 再次访问刚才打开的首页，发现页面还是未登录状态（见下图），实际上用户已经登录了。

<iframe src="/examples/page-visibility-api-introduction-extend/login-sync-step-1.html" width="400" height="300"></iframe>

`embed:page-visibility-api-introduction-extend/login-sync-step-1.html`

只要该页面不被关闭，你怎样刷新，都是“欢迎回来，某某某”。不过，在实际应用中，检测到已经登录成功，直接刷新当前页面的居多！IE10 下，貌似本地存储无法同源不同页面共享，这使得通过 HTML5 本地存储共享信息的做法遇到了些许阻碍。

## 精确的在线时长

这个不用多说，只有用户当前这个页面可见的时候，才计算在线时间，这样可以避免挂机的情况，时长计算更准确（这个可能不是个好 idea）。

## 在线聊天离开状态

网页聊天的时候，可以知道用户是否“离开”还是“离线”还是“下线”。当前页面不可见，但连接还在的时候，我们可以确定该人是离开的（涉及隐私，可能也不是个好 idea）。
