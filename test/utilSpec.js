var util = require('../lib/util');

describe('util Specs', function () {

    describe('extend', function () {
        it('复制对象', function () {
            var base = {name: 'chen', sex: 'male'};
            var more = {name: 'cxl', age: 25};

            util.extend(base, more);

            expect(base.name).toEqual('cxl');
            expect(base.age).toEqual(25);
            expect(base.sex).toEqual('male');
        });

        it('不影响源对象', function () {
            var base = {name: 'chen', sex: 'male'};
            var more = {name: 'cxl', age: 25};

            util.extend(base, more);

            expect(more.name).toEqual('cxl');
            expect(more.age).toEqual(25);
            expect(more.sex).toBeUndefined();
        });

        it('返回复制后的对象', function () {
            var base = {name: 'chen', sex: 'male'};
            var more = {name: 'cxl', age: 25};

            var newser = util.extend(base, more);

            // 引用比较
            expect(newser).toBe(base);
        });
    });

    describe('readJson', function () {
        var fs = require('fs');
        var file = require('path').resolve(__dirname, 'test4readJson');

        afterEach(function () {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });

        it('正确读取存在的JSON文件', function () {
            var data = {status: 0};
            fs.writeFileSync(file, JSON.stringify(data), 'utf-8');

            var res = util.readJson(file);
            
            expect(res.status).toEqual(0);
        });

        it('读取不存在的JSON文件返回空对象', function () {
            var res = util.readJson(file);

            // 字面比较
            expect(res).toEqual({});
        });
    });

    describe('writeJson', function () {
        var fs = require('fs');
        var file = require('path').resolve(__dirname, 'test4writeJson');

        afterEach(function () {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });

        it('正确写入JSON数据', function () {
            var data = {status: 0};

            util.writeJson(file, data);

            var res = fs.readFileSync(file, 'utf-8');
            res = JSON.parse(res);

            expect(res).toEqual(data);
        });
    });

    describe('loadModule', function () {
        it('加载模块不缓存', function () {
            var fs = require('fs');
            var tmpFile = require('path').resolve(process.cwd(), 'tmp.js');
            var content = 'exports.name="cxl";';

            fs.writeFileSync(tmpFile, content, 'utf-8');
            
            var data = util.loadModule(tmpFile);
            expect(data.name).toEqual('cxl');

            content = 'exports.name="chen";';
            fs.writeFileSync(tmpFile, content, 'utf-8');

            data = util.loadModule(tmpFile);
            expect(data.name).toEqual('chen');

            fs.unlinkSync(tmpFile);
        });
    });

    describe('rmdir', function () {
        it('删除非空文件夹', function () {
            var fs = require('fs');
            var path = require('path');

            var targetDir = path.resolve(process.cwd(), 'tmpDir');
            fs.mkdirSync(targetDir);

            fs.mkdirSync(
                path.resolve(targetDir, 'tmpSeDir')
            );

            fs.writeFileSync(
                path.resolve(targetDir, 'tmpFile.txt'),
                'hello world',
                'utf-8'
            );

            util.rmdir(targetDir);
            var res = fs.existsSync(targetDir);
            expect(res).toBeFalsy();

            if (res) {
                fs.rmdirSync(path.resolve(targetDir, 'tmpSeDir'));
                fs.unlinkSync(path.resolve(targetDir, 'tmpFile.txt'));
                fs.rmdirSync(targetDir);
            }
        });
    });

});
