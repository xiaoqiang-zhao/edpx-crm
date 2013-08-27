# create

## 使用

    $ edp crm create index

## 介绍

创建业务模块。根据模块ID在相应的目录创建`vm`与`js`文件，比如：

    $ edp crm create task/add

会在`entry/task`目录中创建`task.vm`页面文件，并且在`src/task`下创建`add.js`业务逻辑模块，创建的页面文件已默认添加对业务逻辑模块的引用
