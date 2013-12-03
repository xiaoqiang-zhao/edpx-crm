# 版本变更

## 0.3.3

* 添加本地模拟使用的`ejson`模块，支持`ejson.toJson()`，`ejson.toSimpleJson`
* 所有`vm`模版变量统一封装到`$data`中
* bug fix

## 0.3.2

* 添加[create](create.md)命令，创建业务模块一步到位
* [combine](build.md)配置支持手动管理，urlArgs配置分散到各个入口页面

## 0.3.0

* 增加自动寻找入口模块并更新combine配置
* 增加入口模块的urlArgs参数自动配置，自动化管理缓存配置
* `edp-build-config.js`添加retention参数用于在构建时保留但不处理文件
* `edp-build-config.js`添加entryDir参数用于配置自动扫描入口模块的文件夹，默认为`/entry`
* `module.conf`增加combine配置（该配置项由构建过程自动管理）
* `utils.macor.vm`增加`require.config`配置，预留`urlArgs`的配置入口，用于构建时自动更新各入口模块的`urlArgs`配置
* `edp crm start`命令增加`--document-root=`参数，支持自定义自测服务器的根目录
* 模拟请求配置文件增加请求参数的获取，以支持动态模拟数据构造
* `edp crm add`命令支持添加`.html`文件
