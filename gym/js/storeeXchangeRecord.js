//var setInt = self.setInterval("isOk()",300);
function localTime() {
    //setTimeout('localTime()',50);
}

function loginTimeout() {
    window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
    $('body').css('height', $(window).height()); //设置body的高度
    $('body').css('width', $(window).width());
    var height1 = $(window).height();
    var width1 = $(window).width();
    $('#center-region').css({
        'width': width1
    });
    $('#showMessage').css({
        'width': '100%',
        'height': $(window).height()
    });
    if (parseInt($('#showMessage').css('width')) > 660) $('#filter').css({
        'padding-left': parseInt($('#showMessage').css('width')) - 660
    });
    $('#hideDiv').hide();
    $('#dg').datagrid({
        onLoadSuccess: function(data) {
            if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
                relogin();
            }
            $('#dg12345').datagrid('doCellTip', {
                onlyShowInterrupt: false, //是否只有在文字被截断时才显示tip，默认值为false             
                position: 'bottom', //tip的位置，可以为top,botom,right,left
                cls: {
                    'background-color': '#FFF'
                }, //tip的样式D1EEEE
                delay: 100 //tip 响应时间
            });
            //图片弹出层
            //          $("a.popImage").fancybox({
            //              openEffect: 'elastic',
            //              closeEffect: 'elastic'
            //          });
        },
        onLoadError: function() {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '出错啦');
        },
        onHeaderContextMenu: function(e, field) {
            e.preventDefault();
            if (!cmenu) {
                createColumnMenu();
            }
            cmenu.menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        }
    });

});
var val = 0;
$('#dlge').scroll(function() {
    if ($(this).scrollTop() >= 234) {
        $('.ke-toolbar').css({
            position: 'absolute',
            top: '41px',
            width: '620px'
        })
    } else {
        $('.ke-toolbar').css({
            position: 'inherit'
        })
    }
});




//时间格式化
function formatTime(value) {
    var date = new Date((value));
    var result = date.format("yyyy-MM-dd hh:mm:ss"); //date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();//+':'+second;
    return result;
}
// 可执行操作
function formatAction(value, row, index) {
    var send = '<a href="javascript:;" onclick="send(\'' + row.id + '\')">推送</a>';
    var see = '<a href="javascript:;" onclick="editArticle(\'' + row.id + '\')">编辑&nbsp;&nbsp;&nbsp;&nbsp;</a>';
    var seeser = '<a href="javascript:;" onclick="openIframe(\'' + row.url + '?random=' + (Math.random() * 10000).toFixed(0) + '\')">预览&nbsp;&nbsp;&nbsp;&nbsp;</a>';
    var action;

    action = '<div class="action">' + seeser + see + send + '</div>';

    return action;
}

function formatTitle(value, row, index) {
    var vlenght = value.length;
    if (vlenght > 15) {
        return value.substring(0, 15) + "...";
    }
    return value
}

function formatUrl(value, row, index) {
    return '<a href="javascript:;" onclick="openIframe(\'' + value + '?random=' + (Math.random() * 10000).toFixed(0) + '\')">预览</a>';
}


function openIframe() {
    var row = $('#dg').datagrid('getSelected');
    if (!row) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择要预览的文章!');
        return;
    }
    var url = row.url + '?random=' + (Math.random() * 10000).toFixed(0);
    $('.copyurl').val(url)
    $('#srcUrl iframe').attr('src', url);
    $('#srcUrl').dialog('open').dialog('setTitle', '&nbsp;&nbsp;预览文章');
    var boxdtop = $('#srcUrl').offset().top;
    var boxdleft = $('#srcUrl').offset().left;
    $('#copyBox').css({
        top: boxdtop + 'px',
        left: boxdleft + 'px',
        opacity: 1
    });
}
$('#srcUrl').dialog({
    onClose: function() {
        $('#copyBox').css({
            top: 0,
            left: '-100%',
            opacity: 1
        });
    }
})

function formatStatus(value, row, index) {
    if (value == "n") {
        return '<span style="color:#ccc">未兑换</span>';
    } else if(value == "y"){
        return '<span style="color:red">已兑换</span>';
    }
}
