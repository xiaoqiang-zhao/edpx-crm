/**
 * @file 模拟数据管理
 * @author treelite(c.xinle@gmail.com)
 */

/*global proxy:false */

// 配置信息
var DIR = 'mock';

// 反向代理配置
// 乐高平台
var REMOTE_URL = 'yf-rd-crm-cdc-db14.yf01.baidu.com';
var REMOTE_PORT = '8080';
var REMOTE_MOCK_PREFIX = '/code-gen/mock';
var REMOTE_VALIDTOR_PREFIX = '/code-gen/valid';

// 模拟数据处理器
var mockHanlder = {};

/**
 * vm处理器
 *
 * @param {Object} context ws上下文
 * @param {Object} info 模拟数据信息
 *  @param {Object} info.type 模拟数据类型
 *  @param {Object} info.file vm文件路径
 *  @param {Object} info.data 模板变量
 */
mockHanlder.vm = function (context, info) {
    var root = context.conf.documentRoot;
    var request = context.request;
    var file = info.file;
    if (!file) {
        file = request.pathname.replace(/\.action$/, '.vm').substring(1);
    }
    context.content = renderVM(file, info.data, root);
};

/**
 * 文本处理器
 *
 * @param {Object} context ws上下文
 * @param {Object} info 模拟数据信息
 *  @param {Object} info.type 模拟数据类型
 *  @param {string} info.data 文本信息
 */
mockHanlder.text = function (context, info) {
    context.content = info.data;
};

/**
 * 反向代理处理器
 *
 * @param {Object} context ws上下文
 * @param {Object} info 模拟数据信息
 *  @param {Object} info.type 模拟数据类型
 *  @param {string} info.path 反向代理路径
 */
mockHanlder.remote = function (context, info) {
    var request = context.request;
    var meta = exports.getInfo();
    
    // proxy come from global
    // inject by ws
    var remote = proxy(REMOTE_URL, REMOTE_PORT);
    if (info.path) {
        request.url = info.path;
    }
    else {
        request.url = meta.remote.mock + request.url;
    }
    remote(context);
};

/**
 * 进行#parse处理，合并vm文件
 *
 * @param {string} file 文件路径
 * @param {string} root webroot
 * @return {string}
 */
function getVMSource(file, root) {
    var path = require('path');
    var fs = require('fs');
    file = fs.readFileSync(file, 'utf-8');
    file = file.replace(
                /#parse\(['"]([^'"]+)['"]\)/g, 
                function ($0, $1) {
                    var url = $1;
                    if (url.charAt(0) == '/') {
                        url = path.resolve(root, url.substring(1));
                    }
                    else {
                        url = path.resolve(path.dirname(file), url);
                    } 
                    if (!fs.existsSync(url)) {
                        return $0;
                    }

                    return getVMSource(url, root);
                }
            );
    return file;
}

/**
 * 渲染vm文件
 *
 * @param {string} file 文件路径
 * @param {Object} data 模板变量
 * @param {string} root webroot
 */
function renderVM(file, data, root) {
    var res;
    var velocityjs = require('velocityjs');

    file = require('path').resolve(root, file);
    if (!require('fs').existsSync(file)) {
        res = '<h1>Can not find ' + file + '</h1>';
    }
    else {
        file = getVMSource(file, root);
        res = velocityjs.render(file, data || {});
    }
    return res;
}

/**
 * 获取配置信息
 */
exports.getInfo = function () {
    var meta = require('./crm').getMetaData();

    var mockPrefix = REMOTE_MOCK_PREFIX 
        + (meta.code4mock 
            ? '/' + meta.code4mock 
            : '');

    var validatorPrefix = REMOTE_VALIDTOR_PREFIX
        + (meta.code4mock 
            ? '/' + meta.code4mock 
            : '');

    return {
        dir: DIR,
        remote: {
            host: REMOTE_URL,
            port: REMOTE_PORT,
            mock: mockPrefix,
            validator: validatorPrefix
        }
    };
};


/**
 * 执行验证请求处理
 *
 * @param {Object} context ws context
 */
exports.validator = function (context) {
    var info = exports.getInfo();
    var url = context.request.url;
    context.request.url = info.remote.validator + url;

    var handler = proxy(info.remote.host, info.remote.port);
    handler(context);
};

/**
 * 执行模拟数据请求
 *
 * @param {Object} context ws context
 */
exports.execute = function (context) {
    var path = require('path');
    var request = context.request;
    var root = context.conf.documentRoot;
    var file = path.resolve(
                    root, 
                    DIR + request.pathname
                ).replace(/\.action$/, '.js');

    if (!require('fs').existsSync(file)) {
        context.content = '<h1>Can not find mock data</h1>';
        return;
    }

    var handler = require(file.replace(/\.js$/, ''));
    
    var res = {};
    if (typeof handler == 'function') {
        res = handler(request);
    }
    else {
        res = handler;
    }

    handler = mockHanlder[res.type];

    if (!handler) {
        context.content = '<h1>No data</h1>';
    }
    else {
        handler(context, res);
    }
};

/**
 * 添加模拟action
 *
 * @param {string} url
 * @param {Object} options
 */
exports.add = function (url, options) {
    var fs = require('fs');
    var path = require('path');
    var tpl = require('./scaffold').getTpl('mock');
    var proDir = require('edp-project').getInfo().dir;
    var config = require('edp-config');

    options = {
        data : options || {}
    };
    options.url = url;
    options.author = config.get('user.name');
    options.email = config.get('user.email');

    url = url.replace(/\.action$/, '.js');
    var file = path.resolve(proDir, 'mock', url);

    if (!fs.existsSync(path.dirname(file))) {
        require('mkdirp').sync(path.dirname(file));
    }

    require('edp-codegen').text(tpl, options, file);
};
