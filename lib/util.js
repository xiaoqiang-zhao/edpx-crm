/**
 * @file 工具库
 * @author treelite(c.xinle@gmail.com)
 */

var fs = require('fs');

/**
 * 读取JSON文件
 *
 * @param {string} file 文件路径
 * @return {Object}
 */
exports.readJson = function (file) {
    var res;
    if (!fs.existsSync(file)) {
        res = {};
    }
    else {
        file = fs.readFileSync(file, 'UTF-8');
        res = JSON.parse(file);
    }
    
    return res;
};

/**
 * 写入JSON文件
 *
 * @param {string} file 文件路径
 * @param {Object} data JSON数据
 */
exports.writeJson = function (file, data) {
    fs.writeFileSync(file, JSON.stringify(data));
};

/**
 * 对象扩展
 *
 * @param {Object} target
 * @param {Object} source
 * @return {Object}
 */
exports.extend = function (target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }

    return target;
};
