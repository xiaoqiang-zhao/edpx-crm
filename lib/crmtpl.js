/**
 * @file VM文件模块
 * @author treelite[c.xinle@gmail.com]
 */

var path = require('path');

var DIR_TPL = 'scaffold';


/**
 * 获取template文件
 *
 * @public
 * @param {string} name 文件名
 * @return {string} 文件路径
 */
exports.getTPLFile = function (name) {
    return path.resolve(__dirname + '/' + DIR_TPL, name + '.tpl');
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
cli.command = 'crmtpl';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = 'CRM文件模板';

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
