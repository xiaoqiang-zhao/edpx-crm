/**
 * @file 工具库
 * @author treelite(c.xinle@gmail.com)
 */

var fs = require('fs');

// 动态加载的模块列表
var customModules = {};

/**
 * 动态加载模块
 *
 * @param {string} file 文件名
 * @return {Object}
 */
exports.loadModule = function (file) {
    var stat = fs.statSync(file);
    var mtime = stat.mtime.getTime();

    if (customModules[file] && customModules[file] != mtime) {
        delete require.cache[file];
    }

    customModules[file] = mtime;
    return require(file.replace(/\.js$/, ''));
};

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

/**
 * 删除目录
 * 
 * @param {string} path 目录路径
 */
exports.rmdir = function ( path ) {
    var fs = require( 'fs' );

    if ( fs.existsSync( path ) && fs.statSync( path ).isDirectory() ) {
        fs.readdirSync( path ).forEach(
            function ( file ) {
                var fullPath = require( 'path' ).join( path, file );
                if ( fs.statSync( fullPath ).isDirectory() ) {
                    exports.rmdir( fullPath );
                }
                else {
                    fs.unlinkSync( fullPath );
                }
            }
        );

        fs.rmdirSync( path );
    }
};
