webpackJsonp([0xca483e169fb6],{1277:function(n,a){n.exports={data:{site:{siteMetadata:{title:"女王控的博客",description:'前端工程师，黑猫女王控，欢迎勾搭，技术相关<a href="https://github.com/towavephone" target="_blank">@towavephone</a>，QQ闲聊<a href="tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=634407147&website=www.oicqzone.com">@towave</a>，bili关注<a href="https://space.bilibili.com/11507708#/" target="_blank">@towave</a>',siteUrl:"https://blog.towavephone.com"}}},pathContext:{posts:[{excerpt:"forwardRef 在   中已经介绍过，有三种方式可以使用 React 元素的 ref ref 是为了获取某个节点的实例，但是 函数式组件（PureComponent） 是没有实例的，不存在 this 的，这种时候是拿不到函数式组件的 ref 的。 为了解决这个问题，由此引入  ，   允许某些组件接收 ref，并将其向下传递给 子组件 只在使用   定义组件时， 第二个参数 ref…",html:'<h1 id="forwardref"><a href="#forwardref" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>forwardRef</h1>\n<p>在 <code class="language-text">React.createRef</code> 中已经介绍过，有三种方式可以使用 React 元素的 ref</p>\n<p>ref 是为了获取某个节点的实例，但是 函数式组件（PureComponent） 是没有实例的，不存在 this 的，这种时候是拿不到函数式组件的 ref 的。</p>\n<p>为了解决这个问题，由此引入 <code class="language-text">React.forwardRef</code>， <strong><code class="language-text">React.forwardRef</code> 允许某些组件接收 ref，并将其向下传递给 子组件</strong></p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="70947801180769090000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`const ForwardInput = React.forwardRef((props, ref) => (\n  <input ref={ref} />\n));\n\nclass TestComponent extends React.Component {\n  constructor(props) {\n    super(props);\n    this.inputRef = React.createRef(); // 创建 ref 存储 textRef DOM 元素\n  }\n  componentDidMount() {\n    this.inputRef.current.value = \'forwardRef\'\n  }\n  render() {\n    return ( // 可以直接获取到 ForwardInput input 的 ref：\n      <ForwardInput ref={this.inputRef}>\n    )\n  }\n}`, `70947801180769090000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                data-tooltip="复制"\n              >\n                <svg class="gatsby-code-button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M16 1H2v16h2V3h12V1zm-1 4l6 6v12H6V5h9zm-1 7h5.5L14 6.5V12z"/></svg>\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js"><span class="token keyword">const</span> ForwardInput <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">forwardRef</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">props<span class="token punctuation">,</span> ref</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>\n  <span class="token operator">&lt;</span>input ref<span class="token operator">=</span><span class="token punctuation">{</span>ref<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">></span>\n<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">TestComponent</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">super</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>inputRef <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">createRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 创建 ref 存储 textRef DOM 元素</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>inputRef<span class="token punctuation">.</span>current<span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token string">\'forwardRef\'</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">(</span> <span class="token comment">// 可以直接获取到 ForwardInput input 的 ref：</span>\n      <span class="token operator">&lt;</span>ForwardInput ref<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>inputRef<span class="token punctuation">}</span><span class="token operator">></span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n<ul>\n<li>\n<p>只在使用 <code class="language-text">React.forwardRef</code> 定义组件时，<strong>第二个参数 ref</strong> 才存在</p>\n</li>\n<li>\n<p>在项目中组件库中尽量不要使用 <code class="language-text">React.forwardRef</code> ，因为它可能会导致子组件被 <strong>破坏性更改</strong></p>\n</li>\n<li>\n<p><strong>函数组件 和 class 组件均不接收 <code class="language-text">ref</code> 参数</strong> ，即 props 中不存在 <code class="language-text">ref</code>，<strong>ref 必须独立 props</strong> 出来，否则会被 React 特殊处理掉。</p>\n</li>\n<li>\n<p><strong>通常在 高阶组件（HOC） 中使用 <code class="language-text">React.forwardRef</code></strong></p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="81169804764075690000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`function enhance(WrappedComponent) {\nclass Enhance extends React.Component {\n  componentWillReceiveProps(nextProps) {\n    console.log(\'Current props: \', this.props);\n    console.log(\'Next props: \', nextProps);\n  }\n  render() {\n    const { forwardedRef, ...others } = this.props;\n    // 将自定义的 prop 属性 “forwardedRef” 定义为 ref\n    return <WrappedComponent ref={forwardedRef} {...others} />;\n  }\n}\n// 注意 React.forwardRef 回调的第二个参数 “ref”。\n// 我们可以将其作为常规 prop 属性传递给 Enhance，例如 “forwardedRef”\n// 然后它就可以被挂载到被 Enhance 包裹的子组件上。\nreturn React.forwardRef((props, ref) => {\n  return <Enhance {...props} forwardedRef={ref} />;\n});\n}\n\n// 子组件\nclass MyComponent extends React.Component {\nfocus() {\n  // ...\n}\n// ...\n}\n\n// EnhancedComponent 会渲染一个高阶组件 enhance(MyComponent)\nconst EnhancedComponent = enhance(MyComponent);\n\nconst ref = React.createRef();\n\n// 我们导入的 EnhancedComponent 组件是高阶组件（HOC）Enhance。\n// 通过React.forwardRef 将 ref 将指向了 Enhance 内部的 MyComponent 组件\n// 这意味着我们可以直接调用 ref.current.focus() 方法\n<EnhancedComponent label=\'Click Me\' handleClick={handleClick} ref={ref} />;`, `81169804764075690000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                data-tooltip="复制"\n              >\n                <svg class="gatsby-code-button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M16 1H2v16h2V3h12V1zm-1 4l6 6v12H6V5h9zm-1 7h5.5L14 6.5V12z"/></svg>\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js"><span class="token keyword">function</span> <span class="token function">enhance</span><span class="token punctuation">(</span><span class="token parameter">WrappedComponent</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n<span class="token keyword">class</span> <span class="token class-name">Enhance</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  <span class="token function">componentWillReceiveProps</span><span class="token punctuation">(</span><span class="token parameter">nextProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Current props: \'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Next props: \'</span><span class="token punctuation">,</span> nextProps<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> forwardedRef<span class="token punctuation">,</span> <span class="token operator">...</span>others <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">;</span>\n    <span class="token comment">// 将自定义的 prop 属性 “forwardedRef” 定义为 ref</span>\n    <span class="token keyword">return</span> <span class="token operator">&lt;</span>WrappedComponent ref<span class="token operator">=</span><span class="token punctuation">{</span>forwardedRef<span class="token punctuation">}</span> <span class="token punctuation">{</span><span class="token operator">...</span>others<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">></span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// 注意 React.forwardRef 回调的第二个参数 “ref”。</span>\n<span class="token comment">// 我们可以将其作为常规 prop 属性传递给 Enhance，例如 “forwardedRef”</span>\n<span class="token comment">// 然后它就可以被挂载到被 Enhance 包裹的子组件上。</span>\n<span class="token keyword">return</span> React<span class="token punctuation">.</span><span class="token function">forwardRef</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">props<span class="token punctuation">,</span> ref</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token operator">&lt;</span>Enhance <span class="token punctuation">{</span><span class="token operator">...</span>props<span class="token punctuation">}</span> forwardedRef<span class="token operator">=</span><span class="token punctuation">{</span>ref<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">></span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 子组件</span>\n<span class="token keyword">class</span> <span class="token class-name">MyComponent</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n<span class="token function">focus</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// ...</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// EnhancedComponent 会渲染一个高阶组件 enhance(MyComponent)</span>\n<span class="token keyword">const</span> EnhancedComponent <span class="token operator">=</span> <span class="token function">enhance</span><span class="token punctuation">(</span>MyComponent<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> ref <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">createRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 我们导入的 EnhancedComponent 组件是高阶组件（HOC）Enhance。</span>\n<span class="token comment">// 通过React.forwardRef 将 ref 将指向了 Enhance 内部的 MyComponent 组件</span>\n<span class="token comment">// 这意味着我们可以直接调用 ref.current.focus() 方法</span>\n<span class="token operator">&lt;</span>EnhancedComponent label<span class="token operator">=</span><span class="token string">\'Click Me\'</span> handleClick<span class="token operator">=</span><span class="token punctuation">{</span>handleClick<span class="token punctuation">}</span> ref<span class="token operator">=</span><span class="token punctuation">{</span>ref<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">></span><span class="token punctuation">;</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n</li>\n</ul>\n<h1 id="forwardref-与-hook-useimperativehandle"><a href="#forwardref-%E4%B8%8E-hook-useimperativehandle" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>forwardRef 与 Hook useImperativeHandle</h1>\n<p><code class="language-text">useImperativeHandle</code> 可以让你在使用 <code class="language-text">ref</code> 时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用 ref 这样的命令式代码。<code class="language-text">useImperativeHandle</code> 应当与 <code class="language-text">forwardRef</code>一起使用：</p>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="44243458490259080000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`function FancyInput(props, ref) {\n  const inputRef = useRef();\n  useImperativeHandle(ref, () => ({\n    focus: () => {\n      inputRef.current.focus();\n    }\n  }));\n  return <input ref={inputRef} ... />;\n}\nFancyInput = forwardRef(FancyInput);`, `44243458490259080000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                data-tooltip="复制"\n              >\n                <svg class="gatsby-code-button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M16 1H2v16h2V3h12V1zm-1 4l6 6v12H6V5h9zm-1 7h5.5L14 6.5V12z"/></svg>\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js"><span class="token keyword">function</span> <span class="token function">FancyInput</span><span class="token punctuation">(</span><span class="token parameter">props<span class="token punctuation">,</span> ref</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> inputRef <span class="token operator">=</span> <span class="token function">useRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token function">useImperativeHandle</span><span class="token punctuation">(</span>ref<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span>\n    <span class="token function-variable function">focus</span><span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      inputRef<span class="token punctuation">.</span>current<span class="token punctuation">.</span><span class="token function">focus</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">return</span> <span class="token operator">&lt;</span>input ref<span class="token operator">=</span><span class="token punctuation">{</span>inputRef<span class="token punctuation">}</span> <span class="token operator">...</span> <span class="token operator">/</span><span class="token operator">></span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\nFancyInput <span class="token operator">=</span> <span class="token function">forwardRef</span><span class="token punctuation">(</span>FancyInput<span class="token punctuation">)</span><span class="token punctuation">;</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>\n<p>在本例中，渲染 <code class="language-text">&lt;FancyInput ref={fancyInputRef} /&gt;</code> 的父组件可以调用 <code class="language-text">fancyInputRef.current.focus()</code>。</p>\n<h1 id="源码解读"><a href="#%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>源码解读</h1>\n<div\n              class="gatsby-code-button-container"\n              data-toaster-id="55291443301569140000"\n              data-toaster-class="gatsby-code-button-toaster"\n              data-toaster-text-class="gatsby-code-button-toaster-text"\n              data-toaster-text="复制成功"\n              data-toaster-duration="3500"\n              onClick="copyToClipboard(`export default function forwardRef<Props, ElementType: React\\$ElementType>(\n  render: (props: Props, ref: React\\$Ref<ElementType>) => React\\$Node\n) {\n  if (__DEV__) {\n    if (render != null && render.\\$\\$typeof === REACT_MEMO_TYPE) {\n      warningWithoutStack(\n        false,\n        \'forwardRef requires a render function but received a \\`memo\\` \' +\n          \'component. Instead of forwardRef(memo(...)), use \' +\n          \'memo(forwardRef(...)).\'\n      );\n    } else if (typeof render !== \'function\') {\n      warningWithoutStack(\n        false,\n        \'forwardRef requires a render function but was given %s.\',\n        render === null ? \'null\' : typeof render\n      );\n    } else {\n      warningWithoutStack(\n        // Do not warn for 0 arguments because it could be due to usage of the \'arguments\' object\n        render.length === 0 || render.length === 2,\n        \'forwardRef render functions accept exactly two parameters: props and ref. %s\',\n        render.length === 1 ? \'Did you forget to use the ref parameter?\' : \'Any additional parameter will be undefined.\'\n      );\n    }\n\n    if (render != null) {\n      warningWithoutStack(\n        render.defaultProps == null && render.propTypes == null,\n        \'forwardRef render functions do not support propTypes or defaultProps. \' +\n          \'Did you accidentally pass a React component?\'\n      );\n    }\n  }\n\n  /**\n   * REACT_FORWARD_REF_TYPE 并不是 React.forwardRef 创建的实例的 \\$\\$typeof\n   * React.forwardRef 返回的是一个对象，而 ref 是通过实例的参数形式传递进去的，\n   * 实际上，React.forwardRef 返回的是一个 ReactElement，它的 \\$\\$typeof 也就是 REACT_ELEMENT_TYPE\n   * 而 返回的对象 是作为 ReactElement 的 type 存在\n   */\n  return {\n    // 返回一个对象\n    \\$\\$typeof: REACT_FORWARD_REF_TYPE, // 并不是 React.forwardRef 创建的实例的 \\$\\$typeof\n    render // 函数组件\n  };\n}`, `55291443301569140000`)"\n            >\n              <div\n                class="gatsby-code-button"\n                data-tooltip="复制"\n              >\n                <svg class="gatsby-code-button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M16 1H2v16h2V3h12V1zm-1 4l6 6v12H6V5h9zm-1 7h5.5L14 6.5V12z"/></svg>\n              </div>\n            </div>\n<div class="gatsby-highlight" data-language="js"><pre style="counter-reset: linenumber NaN" class="language-js line-numbers"><code class="language-js"><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> forwardRef<span class="token operator">&lt;</span>Props<span class="token punctuation">,</span> ElementType<span class="token punctuation">:</span> React$ElementType<span class="token operator">></span><span class="token punctuation">(</span>\n  <span class="token function-variable function">render</span><span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token parameter">props<span class="token punctuation">:</span> Props<span class="token punctuation">,</span> ref<span class="token punctuation">:</span> React$Ref<span class="token operator">&lt;</span>ElementType<span class="token operator">></span></span><span class="token punctuation">)</span> <span class="token operator">=></span> React$Node\n<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>__DEV__<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>render <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> render<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span> <span class="token operator">===</span> <span class="token constant">REACT_MEMO_TYPE</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">warningWithoutStack</span><span class="token punctuation">(</span>\n        <span class="token boolean">false</span><span class="token punctuation">,</span>\n        <span class="token string">\'forwardRef requires a render function but received a `memo` \'</span> <span class="token operator">+</span>\n          <span class="token string">\'component. Instead of forwardRef(memo(...)), use \'</span> <span class="token operator">+</span>\n          <span class="token string">\'memo(forwardRef(...)).\'</span>\n      <span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> render <span class="token operator">!==</span> <span class="token string">\'function\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">warningWithoutStack</span><span class="token punctuation">(</span>\n        <span class="token boolean">false</span><span class="token punctuation">,</span>\n        <span class="token string">\'forwardRef requires a render function but was given %s.\'</span><span class="token punctuation">,</span>\n        render <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">?</span> <span class="token string">\'null\'</span> <span class="token punctuation">:</span> <span class="token keyword">typeof</span> render\n      <span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n      <span class="token function">warningWithoutStack</span><span class="token punctuation">(</span>\n        <span class="token comment">// Do not warn for 0 arguments because it could be due to usage of the \'arguments\' object</span>\n        render<span class="token punctuation">.</span>length <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">||</span> render<span class="token punctuation">.</span>length <span class="token operator">===</span> <span class="token number">2</span><span class="token punctuation">,</span>\n        <span class="token string">\'forwardRef render functions accept exactly two parameters: props and ref. %s\'</span><span class="token punctuation">,</span>\n        render<span class="token punctuation">.</span>length <span class="token operator">===</span> <span class="token number">1</span> <span class="token operator">?</span> <span class="token string">\'Did you forget to use the ref parameter?\'</span> <span class="token punctuation">:</span> <span class="token string">\'Any additional parameter will be undefined.\'</span>\n      <span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>render <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">warningWithoutStack</span><span class="token punctuation">(</span>\n        render<span class="token punctuation">.</span>defaultProps <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> render<span class="token punctuation">.</span>propTypes <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">,</span>\n        <span class="token string">\'forwardRef render functions do not support propTypes or defaultProps. \'</span> <span class="token operator">+</span>\n          <span class="token string">\'Did you accidentally pass a React component?\'</span>\n      <span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">/**\n   * REACT_FORWARD_REF_TYPE 并不是 React.forwardRef 创建的实例的 $$typeof\n   * React.forwardRef 返回的是一个对象，而 ref 是通过实例的参数形式传递进去的，\n   * 实际上，React.forwardRef 返回的是一个 ReactElement，它的 $$typeof 也就是 REACT_ELEMENT_TYPE\n   * 而 返回的对象 是作为 ReactElement 的 type 存在\n   */</span>\n  <span class="token keyword">return</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 返回一个对象</span>\n    $$<span class="token keyword">typeof</span><span class="token punctuation">:</span> <span class="token constant">REACT_FORWARD_REF_TYPE</span><span class="token punctuation">,</span> <span class="token comment">// 并不是 React.forwardRef 创建的实例的 $$typeof</span>\n    render <span class="token comment">// 函数组件</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span></code><span aria-hidden="true" class="line-numbers-rows" style="white-space: normal; width: auto; left: 0;"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></pre></div>',id:"/github/workspace/blog/React之forwardRef入门学习/index.md absPath of file >>> MarkdownRemark",timeToRead:3,frontmatter:{date:"2019-09-20 14:35:44",path:"/react-forwardRef-practice-learn/",tags:"前端, React, forwardRef",title:"React之forwardRef入门学习",draft:null}}],length:1,tag:"forwardRef",pagesSum:1,page:1}}}});