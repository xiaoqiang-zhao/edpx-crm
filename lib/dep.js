/**
 * @file 第三方依赖管理
 * @author treelite(c.xinle@gmail.com)
 */

function Deferred() {
    this.status = 0;
    this.callback = [];
}

Deferred.prototype.reslove = function (data) {
    this.data = data;
    this.status = 1;
    for (var i = 0, item; item = this.callback[i]; i++) {
        item.call(null, data);
    }
};

Deferred.prototype.then = function (callback) {
    var df = new Deferred();

    function inner(data) {
        var res = callback.call(null, data);
        df.reslove(res);
    }

    if (this.status) {
        inner.call(null, this.data);
    }
    else {
        this.callback.push(inner);
    }

    return df.promise();
};

Deferred.prototype.promise = function () {
    var me = this;
    return {
        then: function (callback) {
            return me.then(callback);
        },
        add: function (src) {
            return exports.add(src);
        }
    };
};

/**
 * 远程获取文件
 *
 * @param {string} src 文件路径
 * @param {string} target 文件保存路径
 * @param {Function} callback
 */
function fetchFile(src, target, callback) {
    var wget = require('wget');
    var fs = require('fs');
    var path = require('path');
    var options = {
            proxy: 'http://host:port'
        };

    var download = wget.download(src, target, options);

    download.on('error', function () {
        console.log('Get ' + src + ' fail...');
    });

    download.on('end', function (data) {
        var file = path.resolve(target, path.basename(src));
        console.log('Get ' + src + ' success');
        fs.writeFileSync(data, file);
        if (callback) {
            callback.call(null, file);
        }
    });
}

function scanDir(dir) {
    var fs = require('fs');
    var path =  require('path');
    var files = fs.readdirSync(dir);

    var folders = [];
    var res = [];
    for (var i = 0, file; file = files[i]; i++) {
        file = path.resolve(dir, file);
        var stat = fs.statSync(file);
        if (stat.isFile() && path.basename(file) == 'package.json') {
            res.push(file);
            break;
        }
        else if (stat.isDirectory()) {
            folders.push(file);
        }
    }
    
    if (res.length <= 0 && folders.length > 0) {
        for (var i = 0, item; item = folders[i]; i++) {
            item = scanDir(item);
            if (item.length > 0) {
                res = res.concat(item);
            }
        }
    }

    return res;
}

function compareVersion(v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    var len = Math.max(v1.length, v2.length);

    var res = 0;
    for (var i = 0; i < len; i++) {
        res = (v1[i] || 0) - (v2[i] || 0);
        if (res) {
            break;
        }
    }

    return res;
}

function getAllDeps() {
    var path = require('path');
    var util = require('edp/lib/util');
    var proDir = require('edp/lib/project').findDir();
    var depDir = path.resolve(proDir, 'dep');
    var deps = scanDir(depDir);

    var res = {};
    deps.forEach(function (item) {
        var info = util.readJson(item);
        var data = res[info.name];
        info.dir = path.relative(proDir, path.dirname(item));
        if (!data) {
            data = res[info.name] = {};
        }
        data[info.version] = info;

        if (data.last) {
            if (compareVersion(info.version, data.last.version) > 0) {
                data.last = info;
            }
        }
        else {
            data.last = info;
        }
    });

    return res;
}

/**
 * 获取依赖信息
 *
 * @param {string} name
 */
exports.get = function (name) {
    var deps = getAllDeps();

    if (name) {
        return deps[name];
    }
    else {
        return deps;
    }
};

/**
 * 增加第三方依赖（非amd结构）
 *
 * @param {string} src 文件路径
 */
exports.add = function (src) {
    var path = require('path');
    var fs = require('fs');
    var baseDir = path.resolve(require('edp/lib/project').findDir(), 'dep');
    var tmpDir = path.resolve(baseDir, 'tmp' + (new Date().getTime()));
    var util = require('edp/lib/util');

    fs.mkdirSync(tmpDir);

    var deferred = new Deferred();

    function fileHandler(file) {
        var extname = path.extname(file).substring(1);

        var extractMethod;
        switch(extname) {
            case 'gz':
            case 'tgz':
                extractMethod = 'extractTgz';
                break;
            case 'zip':
                extractMethod = 'extractZip';
                break;
        }

        var dir = path.resolve(tmpDir, 'tmp' + (new Date().getTime()));
        util[extractMethod](file, dir, function () {
            var meta = util.readJson(path.resolve(dir, 'package.json')); 

            var targetDir = path.resolve(baseDir, meta.name);
            fs.mkdirSync(targetDir);
            fs.renameSync(dir, path.resolve(targetDir, meta.version));

            fs.rmdirSync(tmpDir);
            
            deferred.reslove();
        });
    }

    if (src.indexOf('http') >= 0) {
        fetchFile(src, tmpDir, fileHandler);
    }
    else {
        fileHandler(src);
    }

    return deferred.promise();
};
