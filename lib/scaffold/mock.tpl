/**
 * @file 模拟数据({{{url}}})
 * @author {{{author}}}({{{email}}})
 */

module.exports = {
{{#forEach data}}
    {{{key}}}: '{{{value}}}'{{^last}},{{/last}}
{{/forEach}}
};
