# mock

## 使用

    edp crm mock <模拟请求地址>

**注：**模拟请求地址应与线上实际请求地址一致，都是以`.action`结尾

## 介绍

构建模拟请求，增加模拟数据。

模拟数据分为四种类型:

* `vm`：VM模拟数据，用于渲染VM模板，构建页面的模拟请求
* `json`：JSON模拟数据，输出E-JSON规范的数据，用于模拟异步请求
* `remote`：反向代理，配置反向代理模拟数据
* `validator`：验证模拟数据，用于前端验证的规则模拟数据，具体规范请参考[Rigel前后端接口文档规范](http://fe.baidu.com/doc/rigel/pub/Interface_std.text)中的《[数据验证](http://fe.baidu.com/doc/rigel/pub/Interface_std.text#数据验证)》部分。

模拟数据配置文件存放在`test`目录下，比如`custom/add.action`请求的模拟配置为`test/custom/add.js`。

### VM模拟数据

    edp crm mock custom/index.action
    mock file type (1 - vm, 2 - json, 3 - remote, 4 - validator): 1
    vm file: 

`vm file`指对应请求的vm文件路径，如果与请求地址相同则不用填写。以此实例为准，实际`vm`文件路径为`entry/custom/index.vm`

**注：**`entry`为`vm`文件的统一存放文件夹。实际请求不用写`entry`前缀。

vm模拟数据配置文件如下：

    /**
     * @file VM模拟数据(custom/index.action)
     * @author 
     */

    module.exports = {
        type: 'vm',

        // vm文件路径
        // 默认为空，以模拟请求路径来寻找vm
        file: '',

        // 页面模板变量容器
        // 如果页面有模板变量$name, 则
        // data: {name: 'rigelfe'}
        data: {}
    };

### JSON模拟数据

    edp crm mock custom/add.action
    mock file type (1 - vm, 2 - json, 3 - remote, 4 - validator): 2

json模拟数据配置文件如下：

    /**
     * @file JSON模拟数据(custom/add.action)
     * @author
     */

    // 返回数据 E-JSON
    var res = {status: 0};

    module.exports = {
        type: 'json',

        // 返回结果
        data: JSON.stringify(res)
    };

### 反向代理

    edp crm mock custom/save.action
    mock file type (1 - vm, 2 - json, 3 - remote, 4 - validator): 3
    path:

反向代理模拟数据配置文件如下：

    /**
     * @file 反向代理(custom/save.action)
     * @author cxl(chenxinle@baidu.com)
     */

    module.exports = {
        type: 'remote',

        // 反向代理的请求地址
        // 默认为空，与源请求相同
        path: '',

        // 反向代理host与端口
        // 默认为空，指向乐高平台
        host: '',
        prot: ''
    };

### 验证模拟数据

    edp crm mock custom/save.action
    mock file type (1 - vm, 2 - json, 3 - remote, 4 - validator): 4

模拟请求的地址为需要验证的请求的地址，该生成方式只适用于按照乐高平台进行配置的验证，以此为例生成的对应实际请求为`/validatorGenFilter?url=custom/save.action`，对应的配置文件为：`test/custom/saveValidator.js`。

验证模拟数据配置文件如下：

    /**
     * @file 验证数据模拟(custom/save.action)
     * @author
     */

    /*
     * 默认使用乐高平台进行反向代理获取验证模拟数据
     */
    module.exports = {
        // 模拟数据
        // 如果设置则以此数据为准，不再反向代理
        //data: {},

        // 反向代理配置，默认使用乐高平台
        //host: '',
        //port: '',
        //path: ''
    };
