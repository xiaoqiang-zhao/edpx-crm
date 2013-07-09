# 注释说明

这里先参照ecui中的`button.js`给出一个简单的例子

    /**
     * @file
     * Button - 定义按钮的基本操作。
     * 按钮控件，继承自基础控件，屏蔽了激活状态的向上冒泡，
     * 并且在激活(active)状态下鼠标移出控件区域会失去激活样式，
     * 移入控件区域再次获得激活样式，按钮控件中的文字不可以被选中。
     *
     * 按钮控件直接HTML初始化的例子:
     * @example
     *  &lt;div ecui="type:button"&gt
     *    &lt;!-- 这里放按钮的文字 --&gt
     *    ...
     *  &lt;/div&gt
     *  或
     *  &lt;button ecui="type:button"&gt
     *    &lt;!-- 这里放按钮的文字 --&gt
     *    ...
     *  &lt;/button&gt
     *  或
     *  &lt;input ecui="type:button" value="按钮文字" type="button"&gt
     *
     * @author Ryan Asleson
     * @version 1.0
     */
    (function () {

        var core = ecui,
            dom = core.dom,
            ui = core.ui,
            util = core.util,
            setText = dom.setText,
            setDefault = util.setDefault,
            inheritsControl = core.inherits,
            UI_CONTROL = ui.Control,
            UI_CONTROL_CLASS = UI_CONTROL.prototype;

        var UI_BUTTON = ui.Button =
            inheritsControl(
                UI_CONTROL,
                'ui-button',
                function (el, options) {
                    setDefault(options, 'userSelect', false);
                    if (options.text) {
                        setText(el, options.text);
                    }
                }
            ),

            /**
             * 初始化基础控件
             *
             * @extends module:UI_CONTROL_CLASS
             * @requires UI_CONTROL_CLASS
             * @exports UI_BUTTON_CLASS
             *
             * @property {Object} options 初始化选项
             * @property {string} options.text 按钮的文字
             */
            UI_BUTTON_CLASS = UI_BUTTON.prototype;

        /**
         * 按钮控件获得激活时需要阻止事件的冒泡。
         */
        UI_BUTTON_CLASS.$activate = function (event) {
            ……
        };

        /**
         * 如果控件处于激活状态，移除状态样式 -active，移除状态样式不失去激活状态。
         */
        UI_BUTTON_CLASS.$mouseout = function (event) {
            ……
        };

        /**
         * 如果控件处于激活状态，添加状态样式 -active。
         */
        UI_BUTTON_CLASS.$mouseover = function (event) {
           ……
        };

        /**
         * 设置控件的文字。
         *
         * @public
         *
         * @param {string} text 控件的文字
         */
        UI_BUTTON_CLASS.setText = function (text) {
            ……
        };
    })();

这段代码用到了如下几个标签：
`@file`，`@example`，`@author`，`@version`，`@extends`，`@requires`，`@exports`，`@property`，`@public`，`@param`

这里我们主要介绍一下`@extends`，`@requires`，`@exports`这三个标签，其他的可以参阅[ECOM Javascript编码规范](http://fe.baidu.com/doc/ecom/std/javascript-code-style.text)。

1、`@exports`

这个标签把当前模块对外公开，比如例子中的`@exports UI_BUTTON_CLASS`，表示`button.js`对外公开的`UI_BUTTON_CLASS`模块，这里有一点要注意，例子中的方法都是挂到`UI_BUTTON_CLASS`这个对象上的，因为jsDoc会自动的把这些方法作为这个模块的方法在文档中标识，如果向外公开的不是`UI_BUTTON_CLASS`这个模块或者方法不是挂到`UI_BUTTON_CLASS`这个对象上的话，那么方法不会被显示在文档中，当然，你可以在方法的注释里加上`@method`也能将方法显示在文档上，但这个时候方法是挂到`Global`而不是挂到`UI_BUTTON_CLASS`上的。

2、`@extends`

这个标签主要标识当前模块继承自哪些模块，例子中表示当前`UI_BUTTON_CLASS`模块是继承自`module:UI_CONTROL_CLASS`这个模块的，因为我在`control.js`这个文件中`@exports`标识的是`UI_CONTROL_CLASS`（PS：这里前面一定要加上`module:`）。在jsDoc生成的文档中，可以在`Extends`处看到当前模块所继承的父模块，并可以链接到父模块。

3、`@requires`

这个标签标识当前模块依赖于哪些模块，同样，在jsDoc生成的文档中，可以在`Requires`处看到当前模块所依赖的模块并可以链接过去。

这三个标签比较关键，其他的标签以及jsDoc的用法可以参阅[jsDoc官方文档](http://usejsdoc.org/)