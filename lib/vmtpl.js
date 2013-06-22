/**
 * @file vm文件模块
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
cli.command = 'vmtpl';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = 'vm文件模板';

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
