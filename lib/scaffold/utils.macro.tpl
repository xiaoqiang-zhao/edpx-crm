#**
 * 用于定义公共宏
 *#

#set($webRoot=$!link.getContextPath())

#**
 * 引入静态资源
 *#
#macro (includeStatic)
{{#each styles}}
<link rel="stylesheet" href="$!{webRoot}/{{{this}}}" />
{{/each}}
<script src="http://img.baidu.com/js/tangram-base-1.5.2.2.js"></script>
<script src="http://s1.bdstatic.com/r/www/cache/ecom/esl/1-4-0/esl.js"></script>
{{#each scripts}}
<script src="$!{webRoot}/{{{this}}}"></script>
{{/each}}
<script>
var {{{project.code}}} = {
    root: '$!{webRoot}'
};
</script>
#end

#macro (footer)
<div class="footer">
    © 2013 Baidu
</div>
#end
