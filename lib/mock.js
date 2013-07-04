/**
 * @file 模拟数据管理
 * @author treelite(c.xinle@gmail.com)
 */

/*global proxy:false */

var LEGO_URL = 'yf-rd-crm-cdc-db14.yf01.baidu.com';
var LEGO_PORT = '8080';
var LEGO_MOCK_PREFIX = '/code-gen/mock';

var mockHanlder = {};

mockHanlder.vm = function (context, info) {
    var root = context.conf.documentRoot;
    var request = context.request;
    var file = info.file;
    if (!file) {
        file = request.pathname.replace(/\.action$/, '.vm').substring(1);
    }
    context.content = renderVM(file, info.data, root);
};

mockHanlder.text = function (context, info) {
    context.content = info.data;
};

mockHanlder.remote = function (context, info) {
    var request = context.request;
    // proxy come from global
    // inject by ws
    var remote = proxy(LEGO_URL, LEGO_PORT);
    if (info.path) {
        request.url = info.path;
    }
    else {
        request.url = LEGO_MOCK_PREFIX + request.url;
    }
    remote(context);
};

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
 * mock数据文件夹
 */
exports.DIR = 'mock';

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
                    exports.DIR + request.pathname
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
