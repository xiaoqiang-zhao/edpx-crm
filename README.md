# CRM产品线EDP扩展

符合crm产品线特点的项目开发辅助工具，主要完成项目初始化，模拟数据管理，构建等方面。使用前请先参阅[edp说明](https://github.com/ecomfe/edp)，了解基本的edp安装、使用方法。

## 安装

    $ npm install edpx-crm

## 使用

    $ edp help crm
    CRM项目管理
    Sub Command:
    add    添加文件
    doc    创建jsDoc
    import    添加第三方依赖
    init    初始化当前目录为项目目录
    mock    设置模拟数据
    start    启动调试服务器

## 实例

    $ edp crm init
    Project Code: test
    Project Name: 演示项目
    Project Code (for mock): test

    $ edp crm add index.vm

    $ edp crm mock index.action
    mock file type (1 - vm, 2 - json, 3 - remote): 1
    vm path: 

    $ edp crm start

浏览`localhost:8848/index.action`
