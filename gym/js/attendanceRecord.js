/**
 * Created by Administrator on 2016/5/24.
 */
function loginTimeout() {
    window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
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
        },
        onLoadError: function() {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '网络连接出错！');
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
    $('#hideDiv').hide();
    $('#userCode').focus();
    $('#userCode').focus(function() {
        var code = $(this).val();
        if (code && code != '') {
            $(this).val('');
        }
    });
    $('#userCode').change(function() {
        var code = $(this).val();
        if (!code) {
            return;
        }
        $.post('userAction!getUserByCode.zk', {
            code: code
        }, function(data) {
            if (data.STATUS) {
                searchUserById(data.userId);
            } else {
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码!');
            }
        }, 'json');

    });
    $.post('../ngym/GymRoleAction!list.zk', {
        page: 1,
        rows: 1000
    }, function(data) {
        if (data.STATUS) {
            var rows = data.rows;
            // var makers = [];
            var roles = [{
                "id": '',
                "duty": '全部'
            }];
            roles.push();
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var maker = {
                    "id": row.name,
                    "duty": row.name
                };
                // makers.push(maker);
                roles.push(maker);
            }

            $('#duty').combobox({
                valueField: 'id',
                textField: 'duty',
                data: roles,
                onSelect: function(rec) {
                    // duty = $('#duty').combobox("getValue");
                    searchUser();
                }
            });
        } else {
            if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
                //              relogin();
                relogin();
            }
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
        }
    }, 'json');
});
// $("#date").datebox({
//     onChange: function(n, o) {
//         searchUser();
//     }
// });

function searchUser() {
    var date = $("#date").val();
    var name = $('#name').val();
    var duty = $("#duty").combobox("getValue");
    $("#dg").datagrid('load', {
        name: name,
        duty: duty,
        date: date
    });
}

function searchUserById(id) {
    $.post('../ngym/GymEmployeesAction!sign.zk', {
        userId: id
    }, function(data) {
        if (data.STATUS) {
            // $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '打卡成功!');
            $('#dg').datagrid('reload');
            $.messager.show({
                title: "&nbsp;&nbsp;消息",
                timeout: 2000,
                msg: "签到成功!"
            });
            $('#userCode').focus();
        } else {
            if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
                //              relogin();
                relogin();
            }
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
        }
    }, 'json');
}

//格式化签到类型
function formatType(value) {
    if (value == "1") {
        return "上班"
    } else {
        return "下班"
    }
}
//格式化日期
function formatTime1(value) {
    var d = new Date(value);
    return d.format("yyyy-MM-dd");
}
//格式化签到时间
function formatTime2(value) {
    var d = new Date(value);
    return d.format("yyyy-MM-dd hh:mm");
}

//格式化备注
// function formatRemark(value, row, index) {
//     if (value == "" || value == undefined) {
//         return "<img title='备注' style='width:14px;height:14px;margin-top:0px;cursor:pointer;' src='images/remark.png' onclick='remarkEdit(" + index + ")';/>";
//     } else {
//         if (value.length >= 8) {
//             value = value.substring(0, 8) + '...';
//         }
//         return value + "&nbsp;&nbsp;&nbsp;" + "<img title='备注' style='width:14px;height:14px;margin-top:0px;cursor:pointer;' src='images/remark.png'onclick='remarkEdit(" + index + ")'; />";
//     }
// }

function remarkEdit() {
    $('#inputRemark').val('');
    // var record = $('#dg').datagrid('selectRow', index);
    var row = $('#dg').datagrid('getSelected');
    if (!row) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择需要备注的条目！');
        return;
    }
    $('#dlgRemark').dialog('open');
    if (!!row.mark) {
        $('#inputRemark').val(row.mark);
    }
}

function saveMark() {
    var row = $('#dg').datagrid('getSelected');
    var signId = row.id;
    var mark = $("#inputRemark").val();
    mark = mark.replace(/\n/g, ' ');
    if (mark == '') mark = '无';
    if (mark.length > 20) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注不能超过20个字！');
        return false;
    }
    $.post('../ngym/GymEmployeesAction!updateSignMark.zk', {
        signId: signId,
        mark: mark
    }, function(data) {
        if (data.STATUS) {
            $('#dlgRemark').dialog('close');
            $('#dg').datagrid('reload');
        } else {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
        }
    }, 'json')
}