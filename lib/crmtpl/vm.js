/**
 * @file 添加vm文件
 * @author treelite[c.xinle@gmail.com]
 */

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
cli.description = '添加vm文件';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp crmtpl vm <vmfile>';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 * @param {Object} opts 命令运行选项
 */
cli.main = function (args) {
    var vmFile = args[0];

    if (!vmFile) {
        console.log('Please input the file name');
        return;
    }

    var addHTML = require('edp/lib/addhtml');

    addHTML(vmFile, {}, require('../crmtpl').getTPLFile('vm'));
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
