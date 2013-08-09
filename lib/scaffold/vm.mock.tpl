/**
 * @file VM模拟数据({{{url}}})
 * @author {{{author}}}({{{email}}})
 */

module.exports = {
    type: '{{{data.type}}}',

    // vm文件路径
    // 默认为空，以模拟请求路径来寻找vm
    file: '{{{data.file}}}',

    // 页面模板变量容器
    // 如果页面有模板变量$name, 则
    // data: {name: 'rigelfe'}
    data: {}
};

