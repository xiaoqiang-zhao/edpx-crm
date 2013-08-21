/**
 * @file module管理
 * @author treelite(c.xinle@gmail.com)
 */

var estraverse = require('estraverse');
var SYNTAX = estraverse.Syntax;
var LITERAL_REQUIRE = 'require';

/**
 * 从Javascript代码中寻找入口模块
 * 
 * @inner
 * @param {string} code 源码
 * @param {Object} modules 入口模块
 */
function findFromJsCode(code, modules) {
    var ast = require('esprima').parse(code);
    
    estraverse.traverse(
        ast,
        {
            enter: function (node) {
                var arrayArg;
                if (node.type === SYNTAX.CallExpression 
                    && node.callee.name === LITERAL_REQUIRE
                    && (arrayArg = node.arguments[0])
                    && arrayArg.type === SYNTAX.ArrayExpression
                ) {
                    arrayArg.elements.forEach(function (item) {
                        var value;
                        if (item.type === SYNTAX.Literal 
                            && (value = item.value)
                            && typeof value === 'string' 
                            && !modules[value]
                        ) {
                            modules[value] = 1;
                        }
                    } );
                }
            }
        }
    );
}

/**
 * html片段中查询script标签的innerText
 * 
 * @inner
 * @param {string} content html片段内容
 * @return {Array.<string>} 每个标签一个数组项
 */
function findScriptInHTML(content) {
    var segs = content.split(/<script[^>]*>/);
    var texts = [];
    for (var i = 1; i < segs.length; i++) {
        texts.push(segs[i].split(/<\/script>/)[0]);
    }

    return texts;
}

/**
 * 获取module配置信息
 *
 * @inner
 * @param {string} file 文件路径
 * @param {Object} modules 模块集合
 */
function getEntryModules(file, modules) {
    var content = require('fs').readFileSync(file, 'utf-8');

    if (require('path').extname(file) != '.js') {
        content = findScriptInHTML(content).join('\n');
    }

    findFromJsCode(content, modules);
}

/**
 * 获取所有的入口模块
 */
exports.getEntries = function (dir, extnames) {
    var path = require('path');
    var entryfiles = [];

    extnames = extnames || 'vm';
    extnames = ',' + extnames + ',';
    require('./util').walker(
        dir, 
        function (file, stat) {
            if (!stat.isFile()) {
                return;
            }

            var extname = path.extname(file);
            extname = extname.length > 0 
                ? extname.substring(1)
                : extname;

            if (extnames.indexOf(',' + extname + ',') === 0) {
                entryfiles.push(file);
            }
        }
    );

    var modules = {};
    entryfiles.forEach(function (file) {
        getEntryModules(file, modules);
    });

    var res = [];
    for (var key in modules) {
        if (modules.hasOwnProperty(key) && modules[key]) {
            res.push(key);
        }
    }

    return res;
};

/**
 * 获取module配置信息
 *
 * @public
 * @return {Object}
 */
exports.getConfig = function () {
    var edpPro = require('edp-project');
    var proInfo = edpPro.getInfo();
    var moduleConfFile = edpPro.module.getConfigFile(proInfo);

    return require('./util').readJson(moduleConfFile);
};

/**
 * 设置module配置信息
 *
 * @public
 * @param {Object} config 配置项
 */
exports.setConfig = function (config) {
    var util = require('./util');
    var edpPro = require('edp-project');
    var proInfo = edpPro.getInfo();
    var moduleConfFile = edpPro.module.getConfigFile(proInfo);
    var base = exports.getConfig();

    config = util.extend(base, config || {});

    util.writeJson(moduleConfFile, config);
};
