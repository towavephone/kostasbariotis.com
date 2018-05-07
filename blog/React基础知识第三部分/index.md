---
title: React基础知识第三部分
date: 2017-12-11 23:45:34
categories:
- 前端
tags: 前端, React
path: /react-usage-part-3/
---
学习地址：[新手指南ReactJS视频](https://blog.kentcdodds.com/learn-react-fundamentals-and-advanced-patterns-eac90341c9db)，`以下标题均采用链接+视频时长的方式展示`

## [React事件处理（3:42）](https://egghead.io/lessons/egghead-use-event-handlers-with-react)

```html

<!DOCTYPE html>
<html lang="en">

<body>
    <div id="root"></div>
    <script src="https://cdn.bootcss.com/react/16.2.0/umd/react.development.js"></script>
    <script src="https://cdn.bootcss.com/react-dom/16.2.0/umd/react-dom.development.js"></script>
    <script src="https://cdn.bootcss.com/babel-standalone/7.0.0-beta.3/babel.js"></script>
    <script type="text/babel">
        // 函数式编程
        const state = {eventCount: 0,username: ''}
        function App() {
            return <div>
                <p>
                    There have been {state.eventCount} events
                </p>
                <p>
                    <button onClick={increment}>Press</button>
                </p>
                <p>
                    You typed: {state.username}
                </p>
                <p>
                    <input onChange={updateUsername}/>
                </p>
            </div>
        }

        function updateUsername(event){
            console.log(event)
            setState({
                username: event.target.value
            })
        }
        
        function increment(){
            setState({
                eventCount: state.eventCount + 1
            })
        }

        function setState(newState){
            Object.assign(state, newState)
            renderApp()
        }

        function renderApp(){
            ReactDOM.render(<App/>, document.getElementById('root'))
        }

        renderApp()
    </script>
</body>

</html>
```



## [React组件状态（7:09）](https://egghead.io/lessons/react-use-component-state-with-react)

```html
<!DOCTYPE html>
<html lang="en">

<body>
    <div id="root"></div>
    <script src="https://cdn.bootcss.com/react/16.2.0/umd/react.development.js"></script>
    <script src="https://cdn.bootcss.com/react-dom/16.2.0/umd/react-dom.development.js"></script>
    <script src="https://cdn.bootcss.com/babel-standalone/7.0.0-beta.3/babel.js"></script>
    <script type="text/babel">
        class StopWatch extends React.Component{
            state = {lapse: 0, running: false}
            handleRunClick = () => {
                this.setState(state => {
                    if(state.running){
                        clearInterval(this.timer)
                    } else {
                        const startTime = Date.now() - this.state.lapse
                        this.timer = setInterval(state => {
                            this.setState({lapse: Date.now() - startTime});
                        })
                    }
                    return {running: !state.running}
                })
            }
            handleClearClick = () =>{
                clearInterval(this.timer)
                this.setState({lapse: 0, running: false})
            }
            render() {
                const {lapse, running} = this.state
                const buttonStyle = {
                    border: '1px solid #ccc',
                    background: '#fff',
                    fontSize: '2em',
                    padding: 15,
                    margin: 5,
                    width: 200
                }
                return <div style={{textAlign: 'center'}}>
                    <label style={{fontSize: '5em', display: 'block'}}>{lapse}ms</label>
                    <button style={buttonStyle} onClick={this.handleRunClick}>{running ? 'Stop' : 'Start'}</button>
                    <button style={buttonStyle} onClick={this.handleClearClick}>Clear</button>
                </div>
            }
        }
        ReactDOM.render(<StopWatch/>, document.getElementById('root'))
    </script>
</body>

</html>
```

## [React用componentWillUnmount方法停止内存泄漏（1:14）](https://egghead.io/lessons/react-stop-memory-leaks-with-componentwillunmount-lifecycle-method-in-react)

```html
<!DOCTYPE html>
<html lang="en">

<body>
    <div id="root"></div>
    <script src="https://cdn.bootcss.com/react/16.2.0/umd/react.development.js"></script>
    <script src="https://cdn.bootcss.com/react-dom/16.2.0/umd/react-dom.development.js"></script>
    <script src="https://cdn.bootcss.com/babel-standalone/7.0.0-beta.3/babel.js"></script>
    <script type="text/babel">
        class StopWatch extends React.Component{
            state = {lapse: 0, running: false, isShow: true}
            handleRunClick = () => {
                this.setState(state => {
                    if(state.running){
                        clearInterval(this.timer)
                    } else {
                        const startTime = Date.now() - this.state.lapse
                        this.timer = setInterval(state => {
                            this.setState({lapse: Date.now() - startTime},()=>{console.log(this.state.lapse)});
                        })
                    }
                    return {running: !state.running}
                })
            }
            handleClearClick = () =>{
                clearInterval(this.timer)
                this.setState({lapse: 0, running: false})
            }
            handleShow = (event) => {
                this.setState({isShow: event.target.checked})
            }
            componentWillUnmount() {
                // 注意释放，否则报错
                clearInterval(this.timer)
            }
            render() {
                const {lapse, running, isShow} = this.state
                const buttonStyle = {
                    border: '1px solid #ccc',
                    background: '#fff',
                    fontSize: '2em',
                    padding: 15,
                    margin: 5,
                    width: 200
                }
                return <div style={{textAlign: 'center'}}>
                    Show or hide ? <input type="checkbox" checked={isShow} onChange = {this.handleShow}/>
                    {      
                        isShow ? <div><label style={{fontSize: '5em', display: 'block'}}>{lapse}ms</label>
                        <button style={buttonStyle} onClick={this.handleRunClick}>{running ? 'Stop' : 'Start'}</button>
                        <button style={buttonStyle} onClick={this.handleClearClick}>Clear</button></div>:null
                    }
                </div>
            }
        }
        ReactDOM.render(<StopWatch/>, document.getElementById('root'))
    </script>
</body>

</html>
```

## [React Class（4:16）](https://egghead.io/lessons/egghead-use-class-components-with-react)

```html
<!DOCTYPE html>
<html lang="en">

<body>
    <div id="root"></div>
    <script src="https://cdn.bootcss.com/react/16.2.0/umd/react.development.js"></script>
    <script src="https://cdn.bootcss.com/react-dom/16.2.0/umd/react-dom.development.js"></script>
    <script src="https://cdn.bootcss.com/babel-standalone/7.0.0-beta.3/babel.js"></script>
    <script type="text/babel">
        class Counter extends React.Component {
            state = {count: 0}
            handleClick = () => {
                // 注意箭头函数写法，参数、返回值都带括号
                this.setState(({count}) => ({
                    count: count + 1 
                }))
            }
            render(){
                return (
                    <button onClick={this.handleClick}>
                        {this.state.count}
                    </button>
                )
            }
        }
        ReactDOM.render(<Counter/>, document.getElementById('root'))
    </script>
</body>

</html>
```