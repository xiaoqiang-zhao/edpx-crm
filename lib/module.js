/**
 * @file module管理
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 从Javascript代码中寻找入口模块
 * 
 * @inner
 * @param {string} code 源码
 * @return {Array.<string>}
 */
function findFromJsCode(code) {
    // 不再使用JS语法分析改用正则寻找
    // 因为在入口页面的JS环境下可能有模板语法进行的数据组装操作
    // 此情况下JS语法检查都过不了...
    // 还可以考虑先进行模板解析再进行JS语法分析，但相应模拟数据的选择是个问题...
    var res = [];
    code.replace(/(^|\s+|\t+)require\(([^,]+)[^)]*\)/g, function ($0 ,$1, $2) {
        var moduleList;
        // 先按数组解析
        // 不成功再按字符串解析
        try {
            // 将'替换成"，便于JSON解析
            // PS: 将'作为moduleId算你狠...
            moduleList = JSON.parse($2.replace(/'/g, '"'));
        }
        catch (e) {
            // 去掉开头、结尾的空格和引号
            $2 = $2.replace(/(^\s+["']|["']\s+$)/g, '');
            moduleList = [$2];
        }

        res = res.concat(moduleList);
    });

    return res;
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
 * @return {Array.<string>}
 */
function getEntryModules(file) {
    var content = require('fs').readFileSync(file, 'utf-8');

    if (require('path').extname(file) != '.js') {
        content = findScriptInHTML(content).join('\n');
    }

    return findFromJsCode(content);
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

    var res = [];
    entryfiles.forEach(function (file) {
        res = res.concat(getEntryModules(file));
    });

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
