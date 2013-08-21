/**
 * @file build processor
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 根据moduleId获取module
 * 简单查找，不进行paths, packages匹配
 * 拿来做entry module的查找应该够用了
 *
 * @param {string} moduleId
 * @param {string} baseUrl
 * @return {string}
 */
function getModuleById(moduleId, baseUrl) {
    var fs = require('fs');
    var file = require('path').resolve(baseUrl, moduleId);
    file += '.js';

    if (!fs.existsSync(file)) {
        throw new Error('can not find module by ' + moduleId);
    }

    return fs.readFileSync(file, 'utf-8');
}

var buildHandlers = {};

buildHandlers.js = {
    name: 'JsCompressor',

    process: function (file, processContext, callback) {
        if (file.extname != 'js') {
            callback();
            return;
        }

        var uglifyJS = require('uglify-js');
        var ast = uglifyJS.parse(file.data);

        ast.figure_out_scope();
        ast = ast.transform(uglifyJS.Compressor());

        ast.figure_out_scope();
        ast.compute_char_frequency();
        ast.mangle_names({ 
            except: ['$', 'require', 'exports', 'module']
                        .concat(this.except || [])
        });

        file.setData(ast.print_to_string());

        callback();
    }
};

/**
 * 生成构建处理器
 *
 * @public
 * @param {Object} Super 基类
 * @param {string} type 处理器类型
 * @param {Object} options
 * @return {Object}
 */
exports.createProcessor = function (Super, type, options) {
    options = options || {};
    options.name = 'JsCompressor';
    var processor = new Super(options);
        
    var items = buildHandlers[type];
    if (items) {
        processor = require('./util').extend(processor, items);
    }
    
    return processor;
};

/**
 * 刷新入口函数配置
 *
 * @public
 * @param {string} dir 查找目录，默认为项目根目录
 */
exports.refreshCombine = function (dir) {
    var entris;
    dir = dir || require('edp-project').getInfo().dir;
    entris = require('./module').getEntries(dir);

    var moduleInfo = require('./module').getConfig();
    var combine = moduleInfo.combine || {};
    entris.forEach(function (item) {
        combine[item] = combine[item] || {};
    });

    /* 暂时不合并packages
    var packages = moduleInfo.packages || [];
    packages.forEach(function (item) {
        if (item.name && !combine[item.name]) {
            combine[item.name] = true;
        }
    });
    */

    moduleInfo.combine = combine;
    require('./module').setConfig(moduleInfo);
};

/**
 * 刷新combine版本配置信息
 *
 * @public
 */
exports.refreshCombineVersion = function (baseUrl) {
    if (!baseUrl) {
        var edpPro = require('edp-project');
        var proInfo = edpPro.getInfo();
        baseUrl = require('path').resolve(proInfo.dir, 'output/asset');
    }
    var util = require('./util');
    var moduleInfo = require('./module').getConfig();
    var combine = moduleInfo.combine;

    var item;
    var hash;
    for (var moduleId in combine) {
        if (combine.hasOwnProperty(moduleId)) {
            item = combine[moduleId];
            item.version = item.version || 0;
            hash = util.hash(getModuleById(moduleId, baseUrl));
            if (hash && hash != item.hash) {
                item.version++; 
            }
            item.hash = hash;
        }
    }

    require('./module').setConfig(moduleInfo);
};

/**
 * 更新入口模块的配置信息
 * 根据version设置urlArgs
 * 只更新有urlArgs配置的require.config语句
 *
 * @public
 * @param {string} file 配置文件
 */
exports.updateEntryConfig = function (file) {
    var moduleInfo = require('./module').getConfig();
    var combine = moduleInfo.combine || {};
    var urlArgs = {};

    for (var moduleId in combine) {
        if (combine.hasOwnProperty(moduleId)) {
            urlArgs[moduleId] = 'v=' + combine[moduleId].version;
        }
    }

    var fs = require('fs');
    var content = fs.readFileSync(file, 'utf-8');

    content = content.replace(/require\.config\(([^)]+)\)/g, function ($0, $1) {
        var res = $0;
        try {
            var data = (new Function ('return (' + $1 + ');'))();
            if (data.urlArgs) {
                data.urlAgrs = require('./util').extend(
                    data.urlArgs, 
                    urlArgs
                );
            }
            res = JSON.stringify(data, null, 4);
            res = 'require.config(' + res + ')';
        }
        catch (e) {}

        return res;
    });

    fs.writeFileSync(file, content, 'utf-8');
};
