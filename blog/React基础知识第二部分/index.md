---
title: React基础知识第二部分
date: 2017-12-11 02:34:59
categories:
- 前端
tags: 前端, React
path: /react-usage-part-2/
---
学习地址：[新手指南ReactJS视频](https://blog.kentcdodds.com/learn-react-fundamentals-and-advanced-patterns-eac90341c9db)，`以下标题均采用链接+视频时长的方式展示`

## [有条件地渲染一个React组件（2:43）](https://egghead.io/lessons/egghead-conditionally-render-a-react-component)

```html
<!DOCTYPE html>
<html lang="en">

<body>
    <div id="root"></div>
    <script src="https://cdn.bootcss.com/react/16.2.0/umd/react.development.js"></script>
    <script src="https://cdn.bootcss.com/react-dom/16.2.0/umd/react-dom.development.js"></script>
    <script src="https://cdn.bootcss.com/babel-standalone/7.0.0-beta.3/babel.js"></script>
    <script type="text/babel">
        function Message({message}) {
            // 简化后版本
            // return message ? React.createElement('div',null,message):React.createElement('div',null,'No mesage');
            // 最精简版本
            return <div>{message?<div>{message}</div>:<div>No message</div>}</div>
            // 原始版本
            // if(!message){
            //     return React.createElement('div',null,'No mesage')
            // }
            // return <div>{message}</div>
        }
        ReactDOM.render(<Message message={'hi'}/>, document.getElementById('root'))
    </script>
</body>

</html>
```



## [渲染React组件（3:17）](https://egghead.io/lessons/react-rerender-a-react-application)

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
        function tick() {
            const time = new Date().toLocaleTimeString()
            const element = <div>It is {time}</div>
            ReactDOM.render(element, rootElement)
            // 注意渲染的范围，react比原生es6的渲染范围小
            // const element = `<div>It is ${time}</div>`
            // rootElement.innerHTML = element;
        }
        tick()
        setInterval(tick, 1000)
    </script>
</body>

</html>
```

## [React样式（5:36）](https://egghead.io/lessons/react-style-react-components)

```html
<!DOCTYPE html>
<html lang="en">

<body>
    <div id="root"></div>
    <script src="https://cdn.bootcss.com/react/16.2.0/umd/react.development.js"></script>
    <script src="https://cdn.bootcss.com/react-dom/16.2.0/umd/react-dom.development.js"></script>
    <script src="https://cdn.bootcss.com/babel-standalone/7.0.0-beta.3/babel.js"></script>
    <style>
        .box {
            border: 1px solid #000;
        }

        .box-big {
            width: 150px;
            height: 150px;
        }

        .box-medium {
            width: 100px;
            height: 100px;
        }

        .box-small {
            width: 50px;
            height: 50px;
        }
    </style>
    <script type="text/babel">
        function Box({style, size, className = '', ...props}) {
            const sizeClassName = size ? `box-${size}` : ''
            return <div className={`box ${className} ${sizeClassName}`.trim()} style={{paddingLeft: 20, ...style}} {...props}>
            </div>   
        }
        const element = <div>
            <Box size="small" style={{backgroundColor: 'lightblue'}}>box-small</Box>
            <Box size="medium" style={{backgroundColor: 'pink'}}>box-medium</Box>
            <Box size="big" style={{backgroundColor: 'orange'}}>box-big</Box>
        </div>       
        ReactDOM.render(element, document.getElementById('root'))
    </script>
</body>

</html>
```