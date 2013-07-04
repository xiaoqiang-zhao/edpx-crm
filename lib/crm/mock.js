/**
 * @file 添加模拟数据
 * @author treelite(c.xinle@gmail.com)
 */

var maker = {};

maker['1'] = function (rl, callback) {
    var proDir = require('edp-project').getInfo().dir;
    var path = require('path');
    var res = {type: 'vm'};
    rl.question('vm path: ', function (answer) {
        if (answer) {
            res.file = path.relative(
                            proDir, 
                            path.resolve(process.cwd(), answer)
                        );
        }
        callback(res);
    });
};

maker['2'] = function (rl, callback) {
    var res = {type: 'text'};
    res.data = '';

    callback(res);
};

maker['3'] = function (rl, callback) {
    var res = {type: 'remote'};

    rl.question('path: ', function (answer) {
        if (answer) {
            res.path = answer;
        }
        callback(res);
    });
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
cli.command = 'mock';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '设置模拟数据';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp crm mock <url>';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function (args) { 
    var url = args[0];

    if (!url) {
        console.log('Please input mock url');
        return;
    }

    var readline = require('readline');
    var rl = readline.createInterface(
            {
                input: process.stdin,
                output: process.stdout
            }
        );

    rl.question(
        'mock file type (1 - vm, 2 - json, 3 - remote): ', 
        function (answer) {
            var hanlder = maker[answer];

            if (!hanlder) {
                rl.close();
                console.log('unknow type');
            }
            else {
                hanlder(rl, function (info) {
                    rl.close();
                    require('../mock').add(url, info);
                });
            }
        }
    );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
