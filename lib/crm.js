/**
 * @file vm项目管理
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 元数据文件名
 *
 * @const
 * @inner
 * @type {string}
 */
var PROJECT_META =  'vmmetadata';

/**
 * 获取meta文件路径
 */
function getMetaDataFile() {
    var project = require('edp/lib/project');
    var proDir = project.findDir();
    return project.getConfFile(proDir, PROJECT_META);
}

/**
 * 获取项目元数据
 *
 * @return {Object}
 */
exports.getMetaData = function () {
    var metaFile = getMetaDataFile();

    var res;
    if (!require('fs').existsSync(metaFile)) {
        res = {};
    }
    else {
        res = require('edp/lib/util').readJson(metaFile);
    }

    return res;
};

/**
 * 设置项目元数据
 *
 * @param {Object} data
 */
exports.setMetaData = function (data) {
    var util = require('edp/lib/util');
    var metaData = exports.getMetaData();

    metaData = util.extend(metaData, data);

    var metaFile = getMetaDataFile();

    util.writeJson(metaFile, metaData);
};

/**
 * 命令行配置项
 *
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * 命令名称
 *
 * @type {string}
 */
cli.command = 'crm';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = 'CRM项目管理';

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
