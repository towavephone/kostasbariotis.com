---
title: 涂波涛的个人简历-打印版本
date: 2021-3-18 17:27:15
categories:
- 面试
tags: 面试, 简历
path: /personal-resume-2021-print/
password: 19930319
abstract: 输入密码可见。
message: 请输入密码以浏览：
draft: true
---

# 联系方式

- 手机：13072748105/19928327201
- Email：634407147@qq.com
- QQ：634407147
- 微信：13072748105

# 个人信息

- 涂波涛/男/1993 
- 本科/武汉科技大学/软件工程
- 工作年限：4 年
- 技术博客：https://blog.towavephone.com/
- Github: https://github.com/towavephone
- 期望职位：高级前端工程师
- 目前状况：在职，可短期内到岗

# 工作经历

## 广东数果科技有限公司——中级前端工程师（2020 年 8 月 ~ 至今）

- 智能营销前端开发
- 统计综合管理——客车开行效益全栈开发
- 统计综合管理——指标管理前端开发

### 客车开行效益

- 背景
  - 由于需要开发政府定制项目，需要启动在主项目的基础上开发一个拓展项目
- 任务
  - 负责地图组件的选型、搭建、验证、部署，详见 [基于arcgis地图组件的搭建部署](https://blog.towavephone.com/arcgis-map-component-build-deploy/)
  - 优化主项目监听子项目文件变化，以实现增量编译的功能，详见 [基于nodemon实现监听文件链接变化](https://blog.towavephone.com/nodemon-monitor-link-changes/)
- 成果
  - 独立负责客车开行效益模块开发，对接数据组提供的数据，熟悉了后端的开发模式

## 广州探迹科技有限公司——中级前端工程师（2018 年 6 月 ~ 2020 年 7 月）

- 集客、智能呼叫前端开发
- 负责项目架构搭建、公用组件封装、架构优化、新人培训、技术分享、基础工具开发、日常迭代开发

### 集客项目

- 背景
  - 由于公司需要从各种渠道比如网站、表单等等渠道获取信息，集客产品承担了从各个渠道收集、分析信息的任务
- 任务
  - 负责客服聊天组件新窗口打开的功能，支持各种网站包括公司的产品端，为此封装底层通信库，解决 webpack 运行环境等等问题，具体探索过程见 [客服新窗口技术探索](https://blog.towavephone.com/new-window-technology-research/)
  - 负责集客产品脚手架搭建，技术栈采用 webpack v4 + React + MobX + antd，解决了 IE 兼容性、命令行显示异常问题，实现了加速构建、react-loadable 优化，最终效果为编译时间 `10s` 左右，首屏时间 `439ms`，首屏加载大小 `1.1MB`，具体搭建过程见 [Webpack脚手架搭建笔记](https://blog.towavephone.com/webpack-template-new-project/)
  - 负责集客顾客端脚手架搭建，兼容桌面端、移动端、微信公众号以及小程序，技术栈采用 webpack v2 + React + antd，搭建过程见 [记一次组件打包为链接的实践](https://blog.towavephone.com/components-pack-as-library/)
  - 负责集客顾客端脚手架优化，技术栈 webpack v4 + react-lite + react-component。使用组件懒加载、大组件预加载技术，将首屏时间减小到 `236ms`，首屏加载大小减小到 `101KB`。桌面端、移动端分离打包并优化编译脚本，编译时间 `10s` 左右，具体搭建过程见 [构建多平台轻量化组件的实践](https://blog.towavephone.com/building-platform-lightweight-components/)。其中也踩了一些移动端的坑，踩坑过程见 [移动端适配汇总](https://blog.towavephone.com/mobile-adaptation-summary/)
  - 负责集客表单脚手架的搭建，技术栈 gulp + generator-webapp，增加了资源文件 hash、接口代理、html 模板等功能，原生 javascript 实现集客表单，最终实现了首屏时间 `264ms`，首屏加载大小 `85.9KB`，具体搭建过程见 [轻量级网站构建实践](https://blog.towavephone.com/lightweight-website-construction/)
- 成果
  - 集客、集客顾客端、集客表单脚手架编译时间较快提升了开发体验，集客产品线在各端加载很快，大大提升用户体验
  - 实现了从各个渠道获取信息的目标，使公司整体的获客效率提升了 `300%`

### 智能呼叫项目

- 背景
  - 公司需要能配置各种话术且能调度三方线路的平台，以及统计拨打的效果
- 任务
  - 负责智能呼叫脚手架的升级，技术栈 webpack v4 + React + antd + Redux-Saga，实现了按路由、组件懒加载功能，编译时间由 `40s` 左右降低到 `10s` 左右，首屏时间由 `855ms` 缩短到 `567ms`，首屏加载大小由 `1.3MB` 减小到 `880KB`，具体过程见 [Webpack升级优化](https://blog.towavephone.com/webpack-upgrade-about-product/)
  - 封装带话术变量的话术富文本框，底层使用 draft.js，解决了 IE 下的 parseFromString 兼容、transfrom 属性问题，具体过程见 [富文本框疑难点处理过程](https://blog.towavephone.com/rich-input-question/)
  - 使声音播放组件兼容到 IE9，底层使用 embed 标签，单独对 IE 封装能播放声音的组件，具体过程见 [ReactPlayer之IE兼容性研究](https://blog.towavephone.com/reactplayer-ie-compatibility/)
  - 封装网页打电话三方库，底层采用支持 freeswitch 的 SIP.js，具体过程见 [基于SIP协议云端电话的实践](https://blog.towavephone.com/sip-protocol-practice/)
- 成果
  - 实现了智能呼叫从 webpack v2 到 webpack v4 的升级，编译时间缩短了 `75%`，首屏时间缩短了 `33%`
  - 处理各种组件兼容性问题，使用户数量提升了 `10%`

## 上海拼多多有限公司——初级前端工程师（2016 年 7 月 ~ 2017 年 3 月）

- MMS、OMS 前端开发
- 负责日常迭代开发、技术分享

### 客服售后留言项目

- 背景
    - 由于新的平台用户售后开放，需要实现与之对应用户平台售后留言功能，提升售后体验
- 职责
    - 此项目团队一共 `2` 人，我和另外一人负责前端客服平台实现，其中后端研发，移动端也一起参与
    - 采用 AngularJS + Ionic 技术实现网页版客服平台，postMessage 传递窗口间消息，WebSocket 服务推送实现会话功能
    - 实现发送、放大图片，每隔一段时间显示会话时间的功能
- 成果
    - 从零实现了网页版客服平台系统，平台用户售后回复率提升了 `400%`，处理留言的速度提升了 `5` 倍

# 开源项目和作品

- [技术博客](https://blog.towavephone.com/) : gatsby 做的技术博客，离线加载，PWA、PRPL 架构，GitLab / Jenkins 自动化部署
- [安卓内存清理](https://github.com/towavephone/MemoryCleaner) : 在校期间做的安卓项目，至今（2020-5-13 00:04:39） star 数 82，fork 数 32

# 技能清单

以下均为我掌握的技能

- Web开发：JavaScript = jQuery > CSS = HTML
- 前端框架：React
- 前端工具：Webpack > ESLint > Sass = Gulp
- 数据库相关：MySQL > SQLite
