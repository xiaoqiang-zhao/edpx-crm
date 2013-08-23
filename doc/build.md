# build

## 使用

    $ edp crm build

## 介绍

构建项目，合并、压缩所有的JS模块，编译less，拷贝文件到输出目录。在[edp build](https://github.com/ecomfe/edp/blob/master/doc/cli/build.md)的基础上添加了保留文件（夹）设置，自动入口模块合并处理，自动管理模块版本等功能

## 配置

配置文件位于项目根目录`edp-build-confg.js`，其中有以下配置项需要关注：

* `exclude` 构建时排除的文件（夹），不会进行构建处理也不会出现在最终的输出目录中，支持*通配符，默认会排除一些开发相关的配置文件等
* `retention` 保留文件（夹），不进行构建处理但是最终会保留在输出目录中
* `entryDir` 入口文件目录地址，指`vm`文件的目录，用于自动搜索入口模块，默认为`/entry`
