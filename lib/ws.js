var DEFAULT_CONF_FILE = 'edp-webserver-config.js';

function getConfig() {
    var proDir = require('edp-project').getInfo().dir;
    var fs = require('fs');
    var file = require('path').resolve(proDir, DEFAULT_CONF_FILE);

    if (fs.existsSync(file)) {
        return require(file.replace(/\.js$/, ''));
    }
    else {
        return require('edp-webserver').getDefaultConfig();
    }
}

function crmMockHandler() {
    return function (context) {
        require('./mock').execute(context);
    };
}

/**
 * 创建配置文件
 *
 * @param {Object} projectInfo 项目信息
 */
exports.createConfigFile = function (projectInfo) {
    var tpl = require('./scaffold').getTpl(
            DEFAULT_CONF_FILE.replace(/\.js$/, '')
        );
    var file = require('path').resolve(
            projectInfo.dir,
            DEFAULT_CONF_FILE
        );

    require('edp-codegen').text(tpl, {}, file);
};

/**
 * 启动ws 注入velocity解析，CRM模拟数据拦截等逻辑
 *
 * @param {Object} options
 */
exports.start = function (options) {
    var config = getConfig();
    config.port = options.port || config.port;
    config.documentRoot = options.documentRoot || config.documentRoot;

    var injectRes = config.injectRes || config.injectResource;
    config.injectResource = function (res) {
        res.crmMock = crmMockHandler;
        injectRes(res);
    };

    var server = require('edp-webserver');
    server.start(config);
};
