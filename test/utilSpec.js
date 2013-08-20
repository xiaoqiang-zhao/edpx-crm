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
});
