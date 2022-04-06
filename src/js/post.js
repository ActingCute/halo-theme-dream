/**
 * 文章界面的所有操作
 *  |-代码前面加入行号
 *  |-在代码的右上角显示代码的格式
 *  |-剪切板功能
 *  Status: OK
 */
(function ($) {
    /**
     * 取得并设置代码块class，实现定义代码块标题
     */
    let setCodeTitle = (codeSelector) => {
        $(codeSelector).each(function () {
            let clazz = $(this).attr("class");
            if (clazz != null) {
                /**
                 * 这段代码只能获取代码格式，这样修改后可以通过“|”给代码块命名
                 * let languages = classs.split(' ').filter((value) => value && value.trim() && value.startsWith("language"));
                 * let language = languages.length && languages[0].substring(9) || '';
                 * language = language && `${language[0].toUpperCase()}${language.slice(1)}`;
                 */
                let num = clazz.indexOf('|');
                let closeNum = clazz.indexOf('<');
                if (num !== -1 || closeNum !== -1) {
                    if (num === -1 || (closeNum !== -1 && closeNum < num)) {
                        $(this).attr('data-close', true);
                        num = closeNum;
                    }
                    $(this).attr('class', clazz.substring(0, num));
                    $(this).attr('data-title', num === clazz.length - 1 ? clazz.substring(9, num) : clazz.substring(num + 1));
                } else {
                    $(this).attr('data-title', clazz.substring(9));
                }
            }
            $(this).addClass("uncode");
        });
    };
    /**
     * 代码前面加入行号 Todo 效率有点低
     */
    let addLineNumber = (codeSelector) => {
        $(codeSelector).each(function () {
            let nums = $(this).text().split("\n").length - 1 || 1;
            let lineDigit = String(nums).length;
            if (lineDigit === 1) lineDigit = 2;
            var lis = '';
            for (var i = 0; i < nums; i++) {
                lis += `<li class="line-number">${String(i + 1).padStart(lineDigit, 0)}</li>`
            }
            $(this).parent().append(`<ul class="pre-numbering">${lis}</ul>`);
        });
    };
    /**
     * 剪切板功能，初始化代码块折叠按钮
     */
    let clipBoardSupport = () => {
        $("pre").each(function (index) {
            // 在code中加入id
            let id = `codeBlock${index}`;
            let codeDiv = $(this).children("code");
            codeDiv.attr("id", id);
            // 复制按钮
            let clipButton = $(`<a class='btn-clipboard' title="复制代码" data-clipboard-target='#${id}'>
                    <i class="fas fa-copy"></i>
                </a>`
            );
            let arrows = "down";
            if (codeDiv.attr("data-close") === "true") {
                arrows = "right";
                codeDiv.hide();
            }
            // 添加复制按钮到页面上
            $(this).siblings("div.code-head").append(clipButton);
            $(this).siblings("div.code-head").prepend($(`<span data-code='#${id}'><i class="fas fa-angle-${arrows}"></i></span>`))
        });

        let clipboard = new ClipboardJS('.btn-clipboard');
        clipboard.on('error', function (e) {
            e.clearSelection();
            alert("您的浏览器不支持复制");
        });
    };
    /**
     * 在代码的右上角显示代码的格式，方法需要配合CSS的支持
     */
    let displayCodeFormat = (codeSelector) => {
        $(codeSelector).each(function () {
            $(this).parent().wrap(`<div class='code-format hljs'></div>`);
            let title = $(this).attr("data-title");
            if (title != null) {
                $(this).parent().parent().prepend(`<div class='code-head'>${title}</div>`);
            } else {
                $(this).parent().parent().prepend(`<div class='code-head'></div>`);
            }
        });
    };
    // 设置代码块标题，裁剪class代码语言信息
    setCodeTitle("pre > code");
    // 初始化代码块高亮工具
    hljs.initHighlightingOnLoad();
    // 1、代码前面加入行号
    addLineNumber("pre > code");
    // 4、在代码的右上角显示代码的格式
    displayCodeFormat("pre > code");
    // 5、代码可复制
    clipBoardSupport();
    // 代码块展开和关闭点击事件
    $(".content .code-format>.code-head>span").on("click", function () {
        var i = $(this).find('i');
        if (i.is('.fa-angle-down')) {
            $($(this).attr('data-code')).hide();
            i.removeClass('fa-angle-down');
            i.addClass('fa-angle-right');
        } else {
            $($(this).attr('data-code')).show();
            i.removeClass('fa-angle-right');
            i.addClass('fa-angle-down');
        }
    });
})(jQuery);