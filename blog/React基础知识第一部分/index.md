---
title: React基础知识第一部分
date: 2017-12-9 00:54:08
tags: 前端, React
path: /react-usage-part-1/
categories:
  - 前端
---
学习地址：[新手指南ReactJS视频](https://blog.kentcdodds.com/learn-react-fundamentals-and-advanced-patterns-eac90341c9db)，`以下标题均采用链接+视频时长的方式展示`

## [用原始的React API写出Hello World（3:24）](https://egghead.io/lessons/react-write-hello-world-with-raw-react-apis)

```html
<!DOCTYPE html>
<html lang="en">
<body>
    <div id="root"></div>
    <script src="https://cdn.bootcss.com/react/16.2.0/umd/react.development.js"></script>
    <script src="https://cdn.bootcss.com/react-dom/16.2.0/umd/react-dom.development.js"></script>
    <script>
        const rootElement = document.getElementById('root')
        // const element = document.createElement('div')
        // element.textContent = 'Hello World'
        // element.className = 'container'
        // rootElement.appendChild(element)
        const element = React.createElement('div', { className: 'container' }, 'HelloWorld', 'fdafaf')
        //或 const element = React.createElement('div', { className: 'container', children: ['HelloWorld', 'fdafaf']})
        console.log(element)
        ReactDOM.render(element, rootElement)
    </script>
</body>
</html>
```



## [使用JSX和React（5:48）](https://egghead.io/lessons/react-use-jsx-with-react)

### 方式一

```html
<!DOCTYPE html>
<html lang="en">

<body>
    <div id="root"></div>
    <script src="https://cdn.bootcss.com/react/16.2.0/umd/react.development.js"></script>
    <script src="https://cdn.bootcss.com/react-dom/16.2.0/umd/react-dom.development.js"></script>
    <script src="https://cdn.bootcss.com/babel-standalone/7.0.0-beta.3/babel.js"></script>
    <!-- 注意babel解释器的改变 -->
    <script type="text/babel">
        const rootElement = document.getElementById('root')
        // 注意不能解释JSX语法，不能正常运行，需添加Babel解释器
        const HelloWorld = "HelloWorld"
        const myClassName = "container"
        const element = <div className={myClassName}>{(()=>HelloWorld)()}</div>
        ReactDOM.render(element, rootElement)
    </script>
</body>

</html>
```

### 方式二

```html
<!DOCTYPE html>
<html lang="en">

<body>
    <div id="root"></div>
    <script src="https://cdn.bootcss.com/react/16.2.0/umd/react.development.js"></script>
    <script src="https://cdn.bootcss.com/react-dom/16.2.0/umd/react-dom.development.js"></script>
    <script src="https://cdn.bootcss.com/babel-standalone/7.0.0-beta.3/babel.js"></script>
    <!-- 注意babel解释器的改变 -->
    <script type="text/babel">
        const rootElement = document.getElementById('root')
        // 注意不能解释JSX语法，不能正常运行，需添加Babel解释器
        const HelloWorld = "HelloWorld"
        const myClassName = "container"
        const props = {
            className: 'container',
            children: 'HelloWorld'
        }
        // className放在前面会被覆盖，同理children也会被覆盖
        const element = <div className="myClassName" {...props}>Heee</div>
        ReactDOM.render(element, rootElement)
    </script>
</body>

</html>
```

## [创建自定义React组件（5:15）](https://egghead.io/lessons/react-create-custom-react-components)

```html
<!DOCTYPE html>
<html lang="en">

<body>
    <div id="root"></div>
    <script src="https://cdn.bootcss.com/react/16.2.0/umd/react.development.js"></script>
    <script src="https://cdn.bootcss.com/react-dom/16.2.0/umd/react-dom.development.js"></script>
    <script src="https://cdn.bootcss.com/babel-standalone/7.0.0-beta.3/babel.js"></script>
    <script type="text/babel">
        const rootElement = document.getElementById('root')
        const Message = props=><div>{props.msg + ':' + props.children}</div>
        const element = <div className="container">
            // 调用自定义组件的5种方式
            <Message msg="Hello" children="333"/>
            <Message msg="333">444</Message>
            {React.createElement(Message,{msg:'Hello'},'333','444')}
            {React.createElement(Message,{msg:'Hello', children:['333','444']})}
            {Message({msg:'faff', children:'32434'})}
        </div>
        ReactDOM.render(element, rootElement)
    </script>
</body>

</html>
```

## [使用PropTypes验证自定义React组件（3:30）](https://egghead.io/lessons/react-validate-custom-react-component-props-with-proptypes)

### 使用自定义PropTypes验证

```html
<!DOCTYPE html>
<html lang="en">

<body>
    <div id="root"></div>
    <script src="https://cdn.bootcss.com/react/16.2.0/umd/react.development.js"></script>
    <script src="https://cdn.bootcss.com/react-dom/16.2.0/umd/react-dom.development.js"></script>
    <script src="https://cdn.bootcss.com/babel-standalone/7.0.0-beta.3/babel.js"></script>
    <script type="text/babel">
        function SayHello(props) {
            return (
                <div>
                    Hello {props.firstName}{props.lastName}!
                </div>
            )
        }
        const PropTypes = {
            string(props, propsName, componentName){
                if(typeof props[propsName] !== 'string'){
                    return new Error(`you should pass a string for ${propsName} in ${componentName},but you passed a ${typeof props[propsName]}!`)
                }
            }
        }
        SayHello.propTypes = {
            firstName: PropTypes.string,
            lastName: PropTypes.string
        }
        ReactDOM.render(<SayHello firstName={true}/>, document.getElementById('root'))
    </script>
</body>

</html>
```

### 使用已有的PropTypes验证

```html
<!DOCTYPE html>
<html lang="en">

<body>
    <div id="root"></div>
    <script src="https://cdn.bootcss.com/react/16.2.0/umd/react.development.js"></script>
    <!-- 更换生产环境代码后没有PropTypes库警告 -->
    <!-- <script src="https://cdn.bootcss.com/react/16.2.0/umd/react.production.min.js"></script> -->
    <script src="https://cdn.bootcss.com/react-dom/16.2.0/umd/react-dom.development.js"></script>
    <!-- <script src="https://cdn.bootcss.com/react-dom/16.2.0/umd/react-dom.production.min.js"></script> -->
    <script src="https://cdn.bootcss.com/prop-types/15.6.0/prop-types.js"></script>
    <script src="https://cdn.bootcss.com/babel-standalone/7.0.0-beta.3/babel.js"></script>
    <script type="text/babel">
    
        // function SayHello(props) {
        //     return (
        //         <div>
        //             Hello {props.firstName}{' '}{props.lastName||'unknown'}!
        //         </div>
        //     )
        // }
        class SayHello extends React.Component {
            static propTypes = {
                firstName: PropTypes.string.isRequired,
                lastName: PropTypes.string.isRequired
            }
            render() {
                const {firstName, lastName} = this.props
                return (<div>
                    Hello {firstName}{' '}{lastName||'unknown'}!
                </div>)
            }
        }
        // SayHello.propTypes = {
        //     firstName: PropTypes.string.isRequired,
        //     lastName: PropTypes.string.isRequired
        // }
        ReactDOM.render(<SayHello firstName={true}/>, document.getElementById('root'))
    </script>
</body>

</html>
```