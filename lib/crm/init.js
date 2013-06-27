/**
 * @file 项目初始化
 * @author treelite(c.xinle@gmail.com)
 */

var DEPENDENCS = ['ecui', 'rf-css'];

/**
 * 初始化edp项目
 *
 * @inner
 */
function initProject() {
    var project = require('edp/lib/project');
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
    var fs = require('fs');

    fs.mkdirSync('tcom');
}

/**
 * 初始导入项目默认依赖文件
 *
 * @inner
 */
function initDependence(callback) {
    var scaffold = require('../scaffold');
    var dep = require('../dep');

    function addDep(i, callback) {
        if (i >= DEPENDENCS.length) {
            if (callback) {
                callback.call(null);
            }
            return;
        }

        var file = DEPENDENCS[i] + '.zip';
        dep.add(scaffold.getFile(file)).then(function () {
            addDep(++i, callback);
        });
    }

    addDep(0, callback);
}

/**
 * 初始化项目默认文件
 *
 * @inner
 */
function initFile(metaData) {
    var fs = require('fs');
    var tpl = require('../scaffold').getTpl('utils.macro');
    var info = {
        project: metaData,
        scripts: [],
        styles: []
    };

    function addDep(item) {
        var mainFiles = item.main || [];
        if (typeof mainFiles == 'string') {
            mainFiles = [mainFiles];
        }

        var deps;
        var type;
        for (var i = 0, file; file = mainFiles[i]; i++) {
            deps = [];
            type = file.split('.')[1];
            if (type == 'js') {
                deps = info.scripts;
            }
            else if (type == 'css') {
                deps = info.styles;
            }
            deps.push(item.dir + '/' + file);
        }
    }

    var deps = require('../dep').get();
    DEPENDENCS.forEach(function (item) {
        item = deps[item].last;
        addDep(item);
    });

    fs.writeFileSync('tcom/utils.macro.vm', tpl(info), 'UTF-8');
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
cli.usage = 'edp crm init';

/**
 * 模块命令行运行入口
 */
cli.main = function () {
    getMetaData(function (metaData) {
        initProject();
        initDir();

        require('../crm').setMetaData(metaData);
        initDependence(function () {
            initFile(metaData);
        });
    });
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

