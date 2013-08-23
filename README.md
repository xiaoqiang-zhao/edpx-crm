# CRM产品线EDP扩展

符合crm产品线特点的项目开发辅助工具，主要完成项目初始化，模拟数据管理，构建等方面。使用前请先参阅[edp说明](https://github.com/ecomfe/edp)，了解基本的edp安装、使用方法。

## 安装

    $ npm install edpx-crm

## 使用

    $ edp help crm
    CRM项目管理
    Sub Command:
    add     添加文件
    build   构建目录或项目
    doc     创建jsDoc
    import  添加第三方依赖
    init    初始化当前目录为项目目录
    mock    设置模拟数据
    refresh 刷新模块配置信息
    start   启动调试服务器 

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

## 命令

* [init](doc/init.md)
* [add](doc/add.md)
* [start](doc/start.md)
* [mock](doc/mock.md)
* [doc](doc/doc.md)
* [build](doc/build.md)

## 测试

    $ npm test

使用[jasmine](http://pivotal.github.io/jasmine/)，借助[jasmine-node](https://github.com/mhevery/jasmine-node)构建的单元测试用例

## 版本变更

最新版本：__0.3.0__

* 增加自动寻找入口模块并更新combine配置
* 增加入口模块的urlArgs参数自动配置，自动化管理缓存配置
* `edp-build-config.js`添加retention参数用于在构建时保留但不处理文件
* `edp-build-config.js`添加entryDir参数用于配置自动扫描入口模块的文件夹，默认为`/entry`
* `module.conf`增加combine配置（该配置项由构建过程自动管理）
* `utils.macor.vm`增加`require.config`配置，预留`urlArgs`的配置入口，用于构建时自动更新各入口模块的`urlArgs`配置
* `edp crm start`命令增加`--document-root=`参数，支持自定义自测服务器的根目录
* 模拟请求配置文件增加请求参数的获取，以支持动态模拟数据构造
* `edp crm add`命令支持添加`.html`文件

[了解更多](doc/changelog.md)
