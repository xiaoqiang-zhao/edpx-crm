# create

## 使用

    $ edp crm create index

## 介绍

创建业务模块，会进行以下操作：

* 在`entry`目录中创建`vm`页面文件
* 在`src`目录中创建`js`业务逻辑文件
* 在`test`目录中创建模拟数据文件

比如：

    $ edp crm create task/add

* 在`entry/task`目录下创建`add.vm`页面文件，并在`<script>`标签中通过`require(['task/add'], function () {})`添加对`task/add`模块的引用
* 在`src/task`目录下创建`add.js`业务逻辑模块
* 在`test/task`目录下创建`add.js`模拟数据文件，以模拟`/task/add.action`请求
