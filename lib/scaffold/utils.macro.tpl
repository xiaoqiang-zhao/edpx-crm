#**
 * 用于定义公共宏
 *#

#set($webRoot=$!link.getContextPath())

#**
 * 引入静态资源
 *#
#macro (includeStatic)
<link rel="stylesheet" href="$!{webRoot}/dep/ecui/dis/ecui.css" />
<link rel="stylesheet" href="$!{webRoot}/dep/rf-css/dis/rf.css" />
<script src="http://img.baidu.com/js/tangram-base-1.5.2.2.js"></script>
<script src="http://s1.bdstatic.com/r/www/cache/ecom/esl/1-4-0/esl.js"></script>
<script src="$!{webRoot}/dep/ecui/dis/ecui.js"></script>
<script type="text/javascript">
var {{{project.code}}} = {
    root: '$!{webRoot}'
};
</script>
#end

#macro (footer)
<div id="footer">
    © 2013 Baidu
</div>
#end
