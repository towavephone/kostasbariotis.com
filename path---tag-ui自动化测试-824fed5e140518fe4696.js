webpackJsonp([0xc954c772e8e2],{1333:function(n,a){n.exports={data:{site:{siteMetadata:{title:"女王控的博客",description:'前端工程师，黑猫女王控，欢迎勾搭，技术相关<a href="https://github.com/towavephone" target="_blank">@towavephone</a>，QQ闲聊<a href="tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=634407147&website=www.oicqzone.com">@towave</a>，bili关注<a href="https://space.bilibili.com/11507708#/" target="_blank">@towave</a>',siteUrl:"https://blog.towavephone.com"}}},pathContext:{posts:[{excerpt:"项目背景 最近帮平台组做 UI 自动化测试，在多次调研下，选定阿里的 macaca 作为技术栈，参考  sample-nodejs ，在模板  macaca-nodejs-boilerplate  的基础下进行 UI 自动化测试的开发 前期准备 因为 UI 自动化测试需要用到 CSS 选择器，为了查找的方便，要在做自动化测试的项目中设置锚点，本人以   属性作为自动化测试的锚点 研究过程以及疑难点 查看报告结果 目标：在 macaca 编译成功输出报告后打开相应的浏览器查看 安装 open…",html:'<h1 id="项目背景"><a href="#%E9%A1%B9%E7%9B%AE%E8%83%8C%E6%99%AF" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>项目背景</h1>\n<p>最近帮平台组做 UI 自动化测试，在多次调研下，选定阿里的 macaca 作为技术栈，参考 <a href="https://github.com/macaca-sample/sample-nodejs" target="_blank" rel="nofollow noreferrer noopener">sample-nodejs</a>，在模板 <a href="https://github.com/macaca-sample/macaca-nodejs-boilerplate" target="_blank" rel="nofollow noreferrer noopener">macaca-nodejs-boilerplate</a> 的基础下进行 UI 自动化测试的开发</p>\n<h1 id="前期准备"><a href="#%E5%89%8D%E6%9C%9F%E5%87%86%E5%A4%87" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>前期准备</h1>\n<p>因为 UI 自动化测试需要用到 CSS 选择器，为了查找的方便，要在做自动化测试的项目中设置锚点，本人以 <code class="language-text">name=&quot;&quot;</code> 属性作为自动化测试的锚点</p>\n<h1 id="研究过程以及疑难点"><a href="#%E7%A0%94%E7%A9%B6%E8%BF%87%E7%A8%8B%E4%BB%A5%E5%8F%8A%E7%96%91%E9%9A%BE%E7%82%B9" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>研究过程以及疑难点</h1>\n<h2 id="查看报告结果"><a href="#%E6%9F%A5%E7%9C%8B%E6%8A%A5%E5%91%8A%E7%BB%93%E6%9E%9C" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>查看报告结果</h2>\n<p>目标：在 macaca 编译成功输出报告后打开相应的浏览器查看</p>\n<ol>\n<li>安装 open 库</li>\n</ol>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="11311072793308963000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`yarn add open`, `11311072793308963000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                bash 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="bash"><pre style="counter-reset: linenumber NaN" class="language-bash line-numbers"><code class="language-bash"><span class="token function">yarn</span> <span class="token function">add</span> <span class="token function">open</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span></span></pre></div>\n<ol start="2">\n<li>编写 open.js 工具类</li>\n</ol>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="5889826119553865000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`const open = require(\'open\');\nconst path = require(\'path\');\n\n// Opens the image in the default image viewer\n(async () => {\n  // Specify app arguments\n  await open(path.join(__dirname, \'..\', \'reports\', \'index.html\'), { app: \'chrome\' });\n})();`, `5889826119553865000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                js 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js"><span class="token keyword">const</span> open <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'open\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// Opens the image in the default image viewer</span>\n<span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token comment">// Specify app arguments</span>\n  <span class="token keyword">await</span> <span class="token function">open</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'..\'</span><span class="token punctuation">,</span> <span class="token string">\'reports\'</span><span class="token punctuation">,</span> <span class="token string">\'index.html\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> app<span class="token punctuation">:</span> <span class="token string">\'chrome\'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n<ol start="3">\n<li>在 package.json 文件调用</li>\n</ol>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="58628956921531410000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`&quot;scripts&quot;: {\n  &quot;doctor&quot;: &quot;macaca doctor&quot;,\n  &quot;start&quot;: &quot;npm run test:chrome & yarn test:report&quot;, // 注意必须要用 & 否则测试失败后不会调用\n  &quot;test:chrome&quot;: &quot;cross-env browser=chrome npm run test:desktop-browser&quot;,\n  &quot;test:desktop-browser&quot;: &quot;macaca run --reporter macaca-reporter --verbose -d ./test/index.js&quot;,\n  &quot;test:report&quot;: &quot;node ./utils/open.js&quot;\n}`, `58628956921531410000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                json 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="json"><pre style="counter-reset: linenumber NaN" class="language-json line-numbers"><code class="language-json"><span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token property">"doctor"</span><span class="token operator">:</span> <span class="token string">"macaca doctor"</span><span class="token punctuation">,</span>\n  <span class="token property">"start"</span><span class="token operator">:</span> <span class="token string">"npm run test:chrome &amp; yarn test:report"</span><span class="token punctuation">,</span> <span class="token comment">// 注意必须要用 &amp; 否则测试失败后不会调用</span>\n  <span class="token property">"test:chrome"</span><span class="token operator">:</span> <span class="token string">"cross-env browser=chrome npm run test:desktop-browser"</span><span class="token punctuation">,</span>\n  <span class="token property">"test:desktop-browser"</span><span class="token operator">:</span> <span class="token string">"macaca run --reporter macaca-reporter --verbose -d ./test/index.js"</span><span class="token punctuation">,</span>\n  <span class="token property">"test:report"</span><span class="token operator">:</span> <span class="token string">"node ./utils/open.js"</span>\n<span class="token punctuation">}</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n<h2 id="自定义截图到-screenshots-文件夹下"><a href="#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%88%AA%E5%9B%BE%E5%88%B0-screenshots-%E6%96%87%E4%BB%B6%E5%A4%B9%E4%B8%8B" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>自定义截图到 screenshots 文件夹下</h2>\n<p>在 wx-extend.js 中编写自定义方法</p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="28240254178143110000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`wd.addPromiseChainMethod(\'customSaveScreenshot\', function(context) {\n  const filepath = path.join(__dirname, \'..\', \'screenshots\', \\`\\${_.uuid()}.png\\`);\n  const reportspath = path.join(__dirname, \'..\', \'reports\');\n  _.mkdir(path.dirname(filepath));\n  return this.saveScreenshot(filepath).then(() => {\n    appendToContext(context, \\`\\${path.relative(reportspath, filepath)}\\`);\n  });\n});`, `28240254178143110000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                js 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js">wd<span class="token punctuation">.</span><span class="token function">addPromiseChainMethod</span><span class="token punctuation">(</span><span class="token string">\'customSaveScreenshot\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">context</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> filepath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'..\'</span><span class="token punctuation">,</span> <span class="token string">\'screenshots\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>_<span class="token punctuation">.</span><span class="token function">uuid</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.png</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> reportspath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'..\'</span><span class="token punctuation">,</span> <span class="token string">\'reports\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  _<span class="token punctuation">.</span><span class="token function">mkdir</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token function">dirname</span><span class="token punctuation">(</span>filepath<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">saveScreenshot</span><span class="token punctuation">(</span>filepath<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token function">appendToContext</span><span class="token punctuation">(</span>context<span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>path<span class="token punctuation">.</span><span class="token function">relative</span><span class="token punctuation">(</span>reportspath<span class="token punctuation">,</span> filepath<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n<h2 id="调用相同逻辑的操作步骤"><a href="#%E8%B0%83%E7%94%A8%E7%9B%B8%E5%90%8C%E9%80%BB%E8%BE%91%E7%9A%84%E6%93%8D%E4%BD%9C%E6%AD%A5%E9%AA%A4" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>调用相同逻辑的操作步骤</h2>\n<p>实际上考察的是 Promise 的用法</p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="71815014065752990000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`const Promise = require(\'bluebird\');\n\nconst array = [1, 2, 3, 4];\n// 调用 Promise.reduce 以实现链式顺序调用\n// 其中 reduce 方法是从第 2 个数据开始遍历的，故需要在 array 前加 null\nreturn driver\n  .then(() => Promise.reduce([null, ...array], (total, graph, index) => {\n      return driver\n      .elementByCss(选择器)\n      .click()\n      .sleep(1000)\n    }\n  ))\n});`, `71815014065752990000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                js 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js"><span class="token keyword">const</span> Promise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'bluebird\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> array <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n<span class="token comment">// 调用 Promise.reduce 以实现链式顺序调用</span>\n<span class="token comment">// 其中 reduce 方法是从第 2 个数据开始遍历的，故需要在 array 前加 null</span>\n<span class="token keyword">return</span> driver\n  <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> Promise<span class="token punctuation">.</span><span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token operator">...</span>array<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">total<span class="token punctuation">,</span> graph<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">return</span> driver\n      <span class="token punctuation">.</span><span class="token function">elementByCss</span><span class="token punctuation">(</span>选择器<span class="token punctuation">)</span>\n      <span class="token punctuation">.</span><span class="token function">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n<h2 id="模拟上传文件操作"><a href="#%E6%A8%A1%E6%8B%9F%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6%E6%93%8D%E4%BD%9C" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>模拟上传文件操作</h2>\n<p>项目中用的是 antd 的框架，这里尝试了几种方式</p>\n<h3 id="domevent"><a href="#domevent" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>domEvent</h3>\n<p>调用 domEvent 方法模拟 <code class="language-text">&lt;input type=&quot;file&quot;&gt;</code> 的 change 操作</p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="68855801134107610000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`driver.elementByCss(\'#input-element\').domEvent(\'change\', {\n  data: {\n    files: [{ file: \'foo.jpg\' }]\n  }\n});`, `68855801134107610000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                js 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js">driver<span class="token punctuation">.</span><span class="token function">elementByCss</span><span class="token punctuation">(</span><span class="token string">\'#input-element\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">domEvent</span><span class="token punctuation">(</span><span class="token string">\'change\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  data<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    files<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> file<span class="token punctuation">:</span> <span class="token string">\'foo.jpg\'</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n<p>在 antd 中不成功，估计是需要调用 upload 组件的方法才起作用</p>\n<h3 id="sendkeys"><a href="#sendkeys" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>sendKeys</h3>\n<p>sendKeys 方法直接赋值给 input 控件也是不成功，原因同上</p>\n<h3 id="用-autoit-软件编辑脚本，模拟上传操作"><a href="#%E7%94%A8-autoit-%E8%BD%AF%E4%BB%B6%E7%BC%96%E8%BE%91%E8%84%9A%E6%9C%AC%EF%BC%8C%E6%A8%A1%E6%8B%9F%E4%B8%8A%E4%BC%A0%E6%93%8D%E4%BD%9C" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>用 autoit 软件编辑脚本，模拟上传操作</h3>\n<ol>\n<li>\n<p>首先在官网下载 autoit 软件，安装完毕后打开上传窗口同时打开 autoit 软件，找出文件名和打开两个控件所对应的 ID，如下图</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/2019-04-16-19-57-29-4f5d40ac0b6d3d88efddeeb78ca930a6-ad506.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 800px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 48.12785388127854%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAIAAAA7N+mxAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABq0lEQVQoz22S24rUQBCG83Y+ic/h/d654K3XgsIKgheCNzIoLK7jYXcmacdxcu4knZ4+pE/p7sTeiQ4ifhQ/xU9XQVV1NAyD99N/sdYJIYw20zw77w/Xz29fPvrx5qJZXaL3l3D1OFJKG2Ps6IwZT6HtvZoll1orM/JBdoT/zOs7cKg72jPdEYWojDRauZEecWKMHFnircH9B6Go47dKQk+A6hrH1xp/LMsmjrdtC48YZWkOkl3U5++84WkNCCeSpFIqwTdKCdbctM130x+GqrIyJfVNmpWb7XZ/oijKuoYRY8yNWio9Ose5CFPAYYZ8PqRpnmV+mq1z1k1aaYS6LC8gbNquQwj1PY6uvmX5Ee3Tr6AbX3yBb3fiwdP54bOwoznsbD4zedR3RVlprRfDex992mwREy0EmJtX12Dfiosr9OQ1+11y1sm3YQywg3W99Aq3iJZH1tp7NSrYQnA7mvkfJi/EwBgPx1uMMRSXVRWmr6qqDFR1kLCJk1m0bUspxRhTyjhnlOC+7wjBA2chGD1GeZ4Xf1jys0JYx3G8Xn8GACRJEr6T/Asl5S+y7CuBrxS0UwAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px #fafafa;"\n        alt="2019 04 16 19 57 29"\n        title=""\n        src="/static/2019-04-16-19-57-29-4f5d40ac0b6d3d88efddeeb78ca930a6-fee1c.png"\n        srcset="/static/2019-04-16-19-57-29-4f5d40ac0b6d3d88efddeeb78ca930a6-a67b7.png 200w,\n/static/2019-04-16-19-57-29-4f5d40ac0b6d3d88efddeeb78ca930a6-0b187.png 400w,\n/static/2019-04-16-19-57-29-4f5d40ac0b6d3d88efddeeb78ca930a6-fee1c.png 800w,\n/static/2019-04-16-19-57-29-4f5d40ac0b6d3d88efddeeb78ca930a6-ad506.png 1095w"\n        sizes="(max-width: 800px) 100vw, 800px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n</li>\n<li>\n<p>打开编辑器，添加以下代码</p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="57504687983793670000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`ControlFocus(&quot;[Class:#32770]&quot;,&quot;&quot;,&quot;Edit1&quot;) // 对文件名发起焦点事件\nWinWait(&quot;[Class:#32770]&quot;,&quot;&quot;,10) // 等待 10 ms\nControlSetText(&quot;[Class:#32770]&quot;,&quot;&quot;,&quot;Edit1&quot;,\\$CmdLine[1]) // 对文件名赋值，其中 \\$CmdLine[1] 代表调用命令的第一个参数\nSleep(2000)\nControlClick(&quot;[Class:#32770]&quot;,&quot;&quot;,&quot;Button1&quot;) // 点击打开按钮`, `57504687983793670000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                cs 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="cs"><pre style="counter-reset: linenumber NaN" class="language-cs line-numbers"><code class="language-cs"><span class="token function">ControlFocus</span><span class="token punctuation">(</span><span class="token string">"[Class:#32770]"</span><span class="token punctuation">,</span><span class="token string">""</span><span class="token punctuation">,</span><span class="token string">"Edit1"</span><span class="token punctuation">)</span> <span class="token comment">// 对文件名发起焦点事件</span>\n<span class="token function">WinWait</span><span class="token punctuation">(</span><span class="token string">"[Class:#32770]"</span><span class="token punctuation">,</span><span class="token string">""</span><span class="token punctuation">,</span><span class="token number">10</span><span class="token punctuation">)</span> <span class="token comment">// 等待 10 ms</span>\n<span class="token function">ControlSetText</span><span class="token punctuation">(</span><span class="token string">"[Class:#32770]"</span><span class="token punctuation">,</span><span class="token string">""</span><span class="token punctuation">,</span><span class="token string">"Edit1"</span><span class="token punctuation">,</span>$CmdLine<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token comment">// 对文件名赋值，其中 $CmdLine[1] 代表调用命令的第一个参数</span>\n<span class="token function">Sleep</span><span class="token punctuation">(</span><span class="token number">2000</span><span class="token punctuation">)</span>\n<span class="token function">ControlClick</span><span class="token punctuation">(</span><span class="token string">"[Class:#32770]"</span><span class="token punctuation">,</span><span class="token string">""</span><span class="token punctuation">,</span><span class="token string">"Button1"</span><span class="token punctuation">)</span> <span class="token comment">// 点击打开按钮</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n</li>\n<li>\n<p>编译以上代码生成 upload.exe</p>\n</li>\n<li>\n<p>在 wx-extend.js 中编写自定义方法</p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="35930008658623480000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`require(\'shelljs/global\');\nwd.addPromiseChainMethod(\'uploadFile\', function(filePath) {\n const uploadPath = path.resolve(__dirname, upload.exe所在目录);\n const voicePath = path.resolve(__dirname, 上传文件所在目录);\n exec(\\`\\${uploadPath} \\${path.join(voicePath, filePath)}\\`);\n});`, `35930008658623480000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                js 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js"><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'shelljs/global\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nwd<span class="token punctuation">.</span><span class="token function">addPromiseChainMethod</span><span class="token punctuation">(</span><span class="token string">\'uploadFile\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">filePath</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n <span class="token keyword">const</span> uploadPath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> upload<span class="token punctuation">.</span>exe所在目录<span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token keyword">const</span> voicePath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> 上传文件所在目录<span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token function">exec</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>uploadPath<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>voicePath<span class="token punctuation">,</span> filePath<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n</li>\n<li>\n<p>愉快的调用方法，成功上传</p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="29290023004717924000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`driver.uploadFile(文件名);`, `29290023004717924000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                \n              >\n                js 复制代码\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js">driver<span class="token punctuation">.</span><span class="token function">uploadFile</span><span class="token punctuation">(</span>文件名<span class="token punctuation">)</span><span class="token punctuation">;</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span></span></pre></div>\n</li>\n</ol>',
id:"/github/workspace/blog/UI自动化测试疑难点/index.md absPath of file >>> MarkdownRemark",timeToRead:4,frontmatter:{date:"2019-04-16 19:17:35",path:"/ui-auto-test-note/",tags:"测试, UI自动化测试, 预研",title:"UI自动化测试疑难点",draft:null}}],length:1,tag:"UI自动化测试",pagesSum:1,page:1}}}});