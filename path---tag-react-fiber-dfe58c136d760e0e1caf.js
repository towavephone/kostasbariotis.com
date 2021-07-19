webpackJsonp([0xf0ef4e6810f9],{1318:function(n,a){n.exports={data:{site:{siteMetadata:{title:"女王控的博客",description:'前端工程师，黑猫女王控，欢迎勾搭，技术相关<a href="https://github.com/towavephone" target="_blank">@towavephone</a>，QQ闲聊<a href="tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=634407147&website=www.oicqzone.com">@towave</a>，bili关注<a href="https://space.bilibili.com/11507708#/" target="_blank">@towave</a>',siteUrl:"https://blog.towavephone.com"}}},pathContext:{posts:[{excerpt:"Fiber 的数据结构 此小节会通过两个   来展示   以及   的数据结构。 首先用代码表示上图节点间的关系。比如  下有  , 就可以把它们间的关系写成  ; Stack Reconciler 在   之前，节点之间的关系可以用数据结构中   来表示。 如下实现   函数, 将深度遍历的节点打印出来。 输出结果为:  Fiber Reconciler…",html:'<h1 id="fiber-的数据结构"><a href="#fiber-%E7%9A%84%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Fiber 的数据结构</h1>\n<p>此小节会通过两个 <code class="language-text">demo</code> 来展示 <code class="language-text">Stack Reconciler</code> 以及 <code class="language-text">Fiber Reconciler</code> 的数据结构。</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/2020-05-28-14-50-48-09d9e762f85f9e5c7638bf975d99727d-7027d.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 300px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 133.33333333333331%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAbCAIAAADzvTiPAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB1klEQVQ4y5WU2Y6CUBBE5/9/SL/A+OCDPrivuCtq3FFUmDNU5sbcuTDYieYCXV3d1QVfcRxHURQEweVyeT6fURJxvvjiB6zf78/n88ViEX8SP+Dz+Tybzfb7faPRGI1Gk8nkM3Cz2RwOh+Px+PF4TKdT+s8L1tgmlsvl6/V6v/MP2ITv+8y/Xq/B52U2/CCRrdPpMDyFOO92u7xgxgaDZqvVCi2OxyPntC4cbdfrdcQ3o9ZqtTAMc4EJONFc5+12WywW05bnADOnqO73Oy1cr1fP86iiKXBUFhipxUwJlo/zWq0WVfwkEJKibjD24DFsukRqYSQn/6VSSfpzaYMHgwGC93o9g393EearVqvYURa0V4U2OIxtd7tdWvWSECcA7pxOJ3LUuc1MzzgEsFkPjYiHEkhAAsxuMH4gm9db2VwWCgXY9BQhAW82myy1RQshVHTRbrfNe8bObrdbKpiZBSaJPZHNkGaKcrmcqrbA2jM9o5bIZW8eVSoVZtZlFlh4zkqlc1ZFI6zTLZjlbUtLGmEE1uEGU54MyyEmMDafusPhoM3bYLzFkNQ2kub9ktAYXaEwq04jz3ol6RlVcMLfDwATUTH4DXRxOAwxnJ9e5mQWnoZJkPkNxuof2xgpx1gAAAAASUVORK5CYII=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px #fafafa;"\n        alt="2020 05 28 14 50 48"\n        title=""\n        src="/static/2020-05-28-14-50-48-09d9e762f85f9e5c7638bf975d99727d-7027d.png"\n        srcset="/static/2020-05-28-14-50-48-09d9e762f85f9e5c7638bf975d99727d-55fa9.png 200w,\n/static/2020-05-28-14-50-48-09d9e762f85f9e5c7638bf975d99727d-7027d.png 300w"\n        sizes="(max-width: 300px) 100vw, 300px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>首先用代码表示上图节点间的关系。比如 <code class="language-text">a1 节点</code>下有 <code class="language-text">b1、b2、b3 节点</code>, 就可以把它们间的关系写成 <code class="language-text">a1.render = () =&gt; [b1, b2, b3]</code>;</p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="76351292650819260000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`var a1 = { name: \'a1\', render = () => [b1, b2, b3] }\nvar b1 = { name: \'b1\', render = () => [c1] }\nvar b2 = { name: \'b2\', render = () => [c2] }\nvar b3 = { name: \'b3\', render = () => [] }\nvar c1 = { name: \'c1\', render = () => [d1] }\nvar c2 = { name: \'c2\', render = () => [] }\nvar d1 = { name: \'d1\', render = () => [d2] }\nvar d2 = { name: \'d2\', render = () => [] }`, `76351292650819260000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                js 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js"><span class="token keyword">var</span> a1 <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token punctuation">:</span> <span class="token string">\'a1\'</span><span class="token punctuation">,</span> <span class="token function-variable function">render</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">[</span>b1<span class="token punctuation">,</span> b2<span class="token punctuation">,</span> b3<span class="token punctuation">]</span> <span class="token punctuation">}</span>\n<span class="token keyword">var</span> b1 <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token punctuation">:</span> <span class="token string">\'b1\'</span><span class="token punctuation">,</span> <span class="token function-variable function">render</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">[</span>c1<span class="token punctuation">]</span> <span class="token punctuation">}</span>\n<span class="token keyword">var</span> b2 <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token punctuation">:</span> <span class="token string">\'b2\'</span><span class="token punctuation">,</span> <span class="token function-variable function">render</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">[</span>c2<span class="token punctuation">]</span> <span class="token punctuation">}</span>\n<span class="token keyword">var</span> b3 <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token punctuation">:</span> <span class="token string">\'b3\'</span><span class="token punctuation">,</span> <span class="token function-variable function">render</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">}</span>\n<span class="token keyword">var</span> c1 <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token punctuation">:</span> <span class="token string">\'c1\'</span><span class="token punctuation">,</span> <span class="token function-variable function">render</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">[</span>d1<span class="token punctuation">]</span> <span class="token punctuation">}</span>\n<span class="token keyword">var</span> c2 <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token punctuation">:</span> <span class="token string">\'c2\'</span><span class="token punctuation">,</span> <span class="token function-variable function">render</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">}</span>\n<span class="token keyword">var</span> d1 <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token punctuation">:</span> <span class="token string">\'d1\'</span><span class="token punctuation">,</span> <span class="token function-variable function">render</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">[</span>d2<span class="token punctuation">]</span> <span class="token punctuation">}</span>\n<span class="token keyword">var</span> d2 <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token punctuation">:</span> <span class="token string">\'d2\'</span><span class="token punctuation">,</span> <span class="token function-variable function">render</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">}</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n<h2 id="stack-reconciler"><a href="#stack-reconciler" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Stack Reconciler</h2>\n<p>在 <code class="language-text">React 16</code> 之前，节点之间的关系可以用数据结构中 <code class="language-text">树的深度遍历</code> 来表示。</p>\n<p>如下实现 <code class="language-text">walk</code> 函数, 将深度遍历的节点打印出来。</p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="27499986141323653000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`walk(a1);\n\nfunction walk(instance) {\n  if (!instance) return;\n  console.log(instance.name);\n  instance.render().map(walk);\n}`, `27499986141323653000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                js 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js"><span class="token function">walk</span><span class="token punctuation">(</span>a1<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">instance</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>instance<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>instance<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  instance<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>walk<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n<p>输出结果为: <code class="language-text">a1 b1 c1 d1 d2 b2 c2 b3</code></p>\n<h2 id="fiber-reconciler"><a href="#fiber-reconciler" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Fiber Reconciler</h2>\n<p>在 <code class="language-text">React 16</code> 中，节点之间的关系可以用数据结构中的 <code class="language-text">链表</code> 来表示。</p>\n<p>节点之间的链表有三种情形, 用图表示如下:</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/2020-05-28-14-52-10-62a31ae4097adb3c3b9f05ed0d77f9da-7027d.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 300px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 133.33333333333331%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAbCAIAAADzvTiPAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADL0lEQVQ4y5VU2ZKcNhTt/89P5MFvSV5SqVT5JUulEtvjTs00PXRPL4CaHQlJSIDYBEQC3O01Ht8qiovQ0T0690grznkYhlEUIZSO4zgMw/jsWHmeByHEhByfdk1Zjt8SKwAucRQyip+2WwrcMiX9ROBZ4Jxn93v75d0Bo0TBmOfXYqr/DPxKPYcoe/G3PX8X5o78+lJjpfwqXoOZEK8Pbi07hNHe2FyMRxs4w9A/q3Im6gcAEWembSv9KOfHg439oOGsadrhy1vQ4KrpHpxEJX4YGdtNEtrf//LWOAZjLWgYlTkbvtBCDe46uQFx28teDownOLVJnruEzjPYel373mclXM2vvZ/CXIssZVUWsUpijGlREE6tV6+tN3cBQgtCLfFuldXM5xQiH+tSnSyLQm+hH2TC8reGyfKccH4+HPtKtKWQsruyWMAezewYq1R2Bef+1acny/ZcD6fwux//fTp5HcuyIGx4MU9YwCHN/DQt6z5Fx0fzp35YwDnnyvM8I3+ZzqO/MGf/vKoOx1tlBc6qcnuyT6e95zuObWmTjDeZuKhML87KEqrl12uwefDCcDX/SzkvqtYOAsuxEUL3m713dhpCRF4Ok0JN17mYoKLcHk8QQcqYcsQCVsJS0WYEb81t5J9/+M3YADTKhkMoIJ4JuKlOHABM8xE49vl8XmgrPojrVjEGk8QSVXVJ6dhrh8a//4kNQyWqnJomu47SCEJQ1+0CLusmokx3qK/VvlSCGEuUilEIDgfwdPB8v2q7AJPJVEKU+GYS7U2cyb6Xqs95PPPkVb3emoRSTKnjOLqjKZHDyBlIEuMDsJtm6ocC53k4UdCMwMVxXS8IArXDWZogIY51t9//kefVDRwSJZmqLfI8upqkrmsyRTndUGrozWZ/8bwEQi3YPKS7VeQpF2q+0m5u8EfHYPFiqNsZR5HrujcwLQtS1F1LITTev0aHKa4jaYoAAL7vqwv3RrvreyfElnX/sPmZMf5p5c+f5+uqxglYDkhTYllW27b/j9QH431wGCe73c6eommaj2ZLKYVQ9lmi67oPwOrAXYDqYaK29Om9o0aU+GrRdoq+7/8DKMcIrds8ZhQAAAAASUVORK5CYII=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px #fafafa;"\n        alt="2020 05 28 14 52 10"\n        title=""\n        src="/static/2020-05-28-14-52-10-62a31ae4097adb3c3b9f05ed0d77f9da-7027d.png"\n        srcset="/static/2020-05-28-14-52-10-62a31ae4097adb3c3b9f05ed0d77f9da-55fa9.png 200w,\n/static/2020-05-28-14-52-10-62a31ae4097adb3c3b9f05ed0d77f9da-7027d.png 300w"\n        sizes="(max-width: 300px) 100vw, 300px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<ol>\n<li>父节点到子节点(红色虚线)</li>\n<li>同层节点(黄色虚线)</li>\n<li>子节点到父节点(蓝色虚线)</li>\n</ol>\n<blockquote>\n<p>父节点指向第一个子节点, 每个子节点都指向父节点，同层节点间是单向链表。</p>\n</blockquote>\n<p>首先, 构建节点的数据结构, 如下所示:</p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="53357077350723215000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`var FiberNode = function(instance) {\n  this.instance = instance;\n  this.parent = null;\n  this.sibling = null;\n  this.child = null;\n};`, `53357077350723215000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                js 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js"><span class="token keyword">var</span> <span class="token function-variable function">FiberNode</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">instance</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span>instance <span class="token operator">=</span> instance<span class="token punctuation">;</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span>parent <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span>sibling <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span>child <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n<p>然后创建一个将节点串联起来的 <code class="language-text">connect</code> 函数:</p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="39414512289413660000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`var connect = function(parent, childList) {\n  parent.child = childList.reduceRight((prev, current) => {\n    const fiberNode = new FiberNode(current);\n    fiberNode.parent = parent;\n    fiberNode.sibling = prev;\n    return fiberNode;\n  }, null);\n\n  return parent.child;\n};`, `39414512289413660000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                js 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js"><span class="token keyword">var</span> <span class="token function-variable function">connect</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">parent<span class="token punctuation">,</span> childList</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  parent<span class="token punctuation">.</span>child <span class="token operator">=</span> childList<span class="token punctuation">.</span><span class="token function">reduceRight</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">prev<span class="token punctuation">,</span> current</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> fiberNode <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FiberNode</span><span class="token punctuation">(</span>current<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    fiberNode<span class="token punctuation">.</span>parent <span class="token operator">=</span> parent<span class="token punctuation">;</span>\n    fiberNode<span class="token punctuation">.</span>sibling <span class="token operator">=</span> prev<span class="token punctuation">;</span>\n    <span class="token keyword">return</span> fiberNode<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">return</span> parent<span class="token punctuation">.</span>child<span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n<blockquote>\n<p>在 JavaScript 中实现链表的数据结构可以巧用 reduceRight</p>\n</blockquote>\n<p><code class="language-text">connect</code> 函数中实现了上述链表关系。可以像这样使用它:</p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="79077469801027320000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`var parent = new FiberNode(a1);\nvar childFirst = connect(\n  parent,\n  a1.render()\n);`, `79077469801027320000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                js 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js"><span class="token keyword">var</span> parent <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FiberNode</span><span class="token punctuation">(</span>a1<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> childFirst <span class="token operator">=</span> <span class="token function">connect</span><span class="token punctuation">(</span>\n  parent<span class="token punctuation">,</span>\n  a1<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n<p>这样子便完成了 <code class="language-text">a1 节点</code>指向 <code class="language-text">b1 节点</code>的链表、<code class="language-text">b1、b2、b3 节点间</code>的单向链表以及 <code class="language-text">b1、b2、b3 节点</code>指向 <code class="language-text">a1 节点</code> 的链表。</p>\n<p>最后剩下 <code class="language-text">goWalk</code> 函数将全部节点给遍历完。</p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="60081878935534650000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`// 打印日志以及添加列表\nvar walk = function(node) {\n  console.log(node.instance.name);\n  const childLists = node.instance.render();\n  let child = null;\n  if (childLists.length > 0) {\n    child = connect(\n      node,\n      childLists\n    );\n  }\n  return child;\n};\n\nvar goWalk = function(root) {\n  let currentNode = root;\n\n  while (true) {\n    const child = walk(currentNode);\n    // 如果有子节点\n    if (child) {\n      currentNode = child;\n      continue;\n    }\n\n    // 如果没有相邻节点, 则返回到父节点\n    while (!currentNode.sibling) {\n      currentNode = currentNode.parent;\n      if (currentNode === root) {\n        return;\n      }\n    }\n\n    // 相邻节点\n    currentNode = currentNode.sibling;\n  }\n};\n\n// 调用\ngoWalk(new FiberNode(a1));`, `60081878935534650000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                js 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js"><span class="token comment">// 打印日志以及添加列表</span>\n<span class="token keyword">var</span> <span class="token function-variable function">walk</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">node</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>instance<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> childLists <span class="token operator">=</span> node<span class="token punctuation">.</span>instance<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">let</span> child <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>childLists<span class="token punctuation">.</span>length <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    child <span class="token operator">=</span> <span class="token function">connect</span><span class="token punctuation">(</span>\n      node<span class="token punctuation">,</span>\n      childLists\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">return</span> child<span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> <span class="token function-variable function">goWalk</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> currentNode <span class="token operator">=</span> root<span class="token punctuation">;</span>\n\n  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> child <span class="token operator">=</span> <span class="token function">walk</span><span class="token punctuation">(</span>currentNode<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token comment">// 如果有子节点</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      currentNode <span class="token operator">=</span> child<span class="token punctuation">;</span>\n      <span class="token keyword">continue</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token comment">// 如果没有相邻节点, 则返回到父节点</span>\n    <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span>currentNode<span class="token punctuation">.</span>sibling<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      currentNode <span class="token operator">=</span> currentNode<span class="token punctuation">.</span>parent<span class="token punctuation">;</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>currentNode <span class="token operator">===</span> root<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">return</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token comment">// 相邻节点</span>\n    currentNode <span class="token operator">=</span> currentNode<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 调用</span>\n<span class="token function">goWalk</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">FiberNode</span><span class="token punctuation">(</span>a1<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n<p>打印结果为 <code class="language-text">a1 b1 c1 d1 d2 b2 c2 b3</code></p>\n<p><code class="language-text">Fiber</code> 在一个节点上的执行流程总结如下:</p>\n<ul>\n<li>\n<p>在当前节点下寻找是否有子节点</p>\n<ul>\n<li>若有, 则进入子节点</li>\n<li>若没有, 则在当前节点下寻找是否有下一个相邻节点</li>\n<li>若有, 则进入下一个相邻节点</li>\n<li>若没有, 则返回它的父节点</li>\n</ul>\n</li>\n</ul>\n<h1 id="fiber-reconciler-的优势"><a href="#fiber-reconciler-%E7%9A%84%E4%BC%98%E5%8A%BF" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Fiber Reconciler 的优势</h1>\n<p>通过分析上述两种数据结构实现的代码，可以得出下面结论:</p>\n<ul>\n<li>基于树的深度遍历实现的 Reconciler: 一旦进入调用栈便无法暂停;</li>\n<li>基于链表实现的 Reconciler: 在 <code class="language-text">while(true) {}</code> 的循环中, 可以通过 <code class="language-text">currentNode</code> 的赋值重新得到需要操作的节点，而在赋值之前便可以’暂停’来执行其它逻辑, 这也是 <code class="language-text">requestIdleCallback</code> 能得以在 <code class="language-text">Fiber Reconciler</code> 的原因。</li>\n</ul>\n<h1 id="相关链接"><a href="#%E7%9B%B8%E5%85%B3%E9%93%BE%E6%8E%A5" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>相关链接</h1>\n<ul>\n<li><a href="https://medium.com/react-in-depth/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-67f1014d0eb7" target="_blank" rel="nofollow noreferrer noopener">The how and why on React’s usage of linked list in Fiber to walk the component’s tree</a></li>\n<li><a href="https://github.com/facebook/react/issues/7942" target="_blank" rel="nofollow noreferrer noopener">Fiber Principles: Contributing To Fiber</a>: Fiber 设计思想相关 issue, 推荐。</li>\n</ul>',
id:"/github/workspace/blog/React Fiber数据结构/index.md absPath of file >>> MarkdownRemark",timeToRead:3,frontmatter:{date:"2020-05-28 14:32:24",path:"/react-fiber-data-struct/",tags:"前端, React Fiber, 数据结构",title:"React Fiber 数据结构",draft:null}}],length:1,tag:"React Fiber",pagesSum:1,page:1}}}});