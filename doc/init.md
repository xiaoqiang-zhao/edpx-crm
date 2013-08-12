# init

## 使用

    $ edp crm init
    Project Code: test
    Project Name: 演示项目
    Project Code (for mock): test

* `Project Code` 项目代号，会以此生成一个全局的配置变量，包含项目的基本信息:`var test = {root: '/'};`
* `Prject Name` 项目名称，会作为`vm`、`html`文件的默认`title`内容
* `Project Code (for mock)` 模拟数据项目代号，乐高平台使用，默认与项目代号相同，详细[mock](doc/mock.md)命名中关于模拟数据的描述

## 介绍

项目初始化。

一般在前端目录`WebContent`中执行，用于构建初始的项目目录结构，配置文件等。根据[前端目录规范](https://github.com/ecomfe/spec/blob/master/directory.md)，会初始化以下文件（夹）：

* `src` 源文件夹，存放`js`、`css`与`less`等源文件
* `entry` 入口文件夹，用于存放所有的`vm`文件，其中按照业务逻辑划分子文件夹
* `tcom` 公共宏文件夹，其中已初始化`utils.macro.vm`文件，用于项目通用的宏定义
* `test` 测试用文件夹，其中存放mock数据，mock数据的构建与用法请参阅[mock](doc/mock.md) 命令
* `dep` 开发依赖第三方文件夹，用于存放`esl`, `tangram`, `ecui`等公共组件，不需要手工维护
* `doc` 文档文件夹
* `tool` 开发工具文件夹
* `jsDoc.conf` 文档工具配置文件
* `module.conf` 模块配置文件
* `edp-build-config.js` 项目构建配置文件
* `edp-webserver-config.js` 本地服务器配置文件

项目中需要经常关注是的`src`、`entry`、`tcom`、`test`几个文件夹，配置文件如非定制化需求不用手动维护
