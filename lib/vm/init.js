/**
 * @file 项目初始化
 * @author treelite[c.xinle@gmail.com]
 */

/**
 * 初始化edp项目
 *
 * @inner
 */
function initProject() {
    var project = require( 'edp/lib/project' );
    project.init();
    project.initDir();
}

/**
 * 收集项目元数据信息
 *
 * @inner
 * @param {Function} callback
 */
function getMetaData(callback) {
    var readline = require('readline');
    var rl = readline.createInterface(
            {
                input: process.stdin,
                output: process.stdout
            }
        );

    var res = {};

    rl.question('Project Code: ', function (answer) {
        res.code = answer || 'test';
        rl.question('Project Name: ', function (answer) {
            res.name = answer || 'test';
            rl.close();
            
            if (callback) {
                callback(res);
            }
        });
    });
}

/**
 * 初始化项目文件夹
 *
 * @inner
 */
function initDir() {
}

/**
 * 初始导入项目默认依赖模块
 *
 * @inner
 */
function initModule() {
}

/**
 * 初始化项目默认文件
 *
 * @inner
 */
function initFile() {
}

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
cli.command = 'init';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '初始化当前目录为项目目录';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp vm init';

/**
 * 模块命令行运行入口
 */
cli.main = function () {
    getMetaData(function (metaData) {
        initProject();
        initDir();

        require('../vm').setMetaData(metaData);
        initModule();
        initFile();
    });
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

