---
title: Page Visibility(页面可见性) API介绍
date: 2020-1-3 21:04:40
path: /page-visibility-api-introduction-extend/
tags: 前端, JS, JS知识点
---

# API属性和事件

目前页面可见性API有两个属性，一个事件，如下：

- document.hidden: Boolean值，表示当前页面可见还是不可见
- document.visibilityState: 返回当前页面的可见状态
  - hidden
  - visible
  - prerender
  - preview
- visibilitychange: 当可见状态改变时候触发的事件

# 浏览器支持与私有前缀

```js
var pageVisibility = (function() {
    var prefixSupport, keyWithPrefix = function(prefix, key) {
        if (prefix !== "") {
            // 首字母大写
            return prefix + key.slice(0,1).toUpperCase() + key.slice(1);    
        }
        return key;
    };
    var isPageVisibilitySupport = (function() {
        var support = false;
        if (typeof window.screenX === "number") {
            ["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
                if (support == false && document[keyWithPrefix(prefix, "hidden")] != undefined) {
                    prefixSupport = prefix;
                    support = true;
                }
            });
        }
        return support;
    })();
    
    var isHidden = function() {
        if (isPageVisibilitySupport) {
            return document[keyWithPrefix(prefixSupport, "hidden")];
        }
        return undefined;
    };
    
    var visibilityState = function() {
        if (isPageVisibilitySupport) {
            return document[keyWithPrefix(prefixSupport, "visibilityState")];
        }
        return undefined;
    };
    
    return {
        hidden: isHidden(),
        visibilityState: visibilityState(),
        visibilitychange: function(fn, usecapture) {
            usecapture = undefined || false;
            if (isPageVisibilitySupport && typeof fn === "function") {
                return document.addEventListener(prefixSupport + "visibilitychange", function(evt) {
                    this.hidden = isHidden();
                    this.visibilityState = visibilityState();
                    fn.call(this, evt);
                }.bind(this), usecapture);
            }
            return undefined;
        }
    };    
})(undefined);
```
