function loginTimeout() {
    window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
    $('#hideDiv').hide();
    // $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择月份及考勤时间以加载数据');
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
                    duty = $('#duty').combobox("getValue");
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
    $("#timeStart").timespinner("setValue", "08:00:00");
    $("#timeEnd").timespinner("setValue", "21:00:00");
    // $('.c6').trigger('click')
    $("#month").combobox({
        // onLoadSuccess: function() { //加载完成后,设置选中第一项
        //     var date = new Date();
        //     var orgMon = date.getMonth() + 1;
        //     $("#month").combobox("setValue", orgMon);
        // },
        onSelect: function(n, o) {
            // gmtStart = "";
            // gmtEnd = "";
            var date = new Date();
            var year = date.getFullYear();
            var mon = $("#month").combobox("getValue");
            gmtStart = year + '-' + mon + "-01 00:00:00";
            gmtEnd = year + '-' + mon + "-31 23:59:59";
            searchUser();
        }
    });
    var date = new Date();
    var orgMon = date.getMonth() + 1;
    $("#month").combobox("setValue", orgMon);
    var year = date.getFullYear();
    var mon = $("#month").combobox("getValue");
    gmtStart = year + '-' + mon + "-01 00:00:00";
    gmtEnd = year + '-' + mon + "-31 23:59:59";
    searchUser();
});
var gmtStart;
var gmtEnd;
var timeStart;
var timeEnd;
var name;
var duty;

function searchName() {
    name = $("#name").val();
    // searchUser();
}


function setSignTime() {
    $("#dlgSetTime").dialog("open");
}

function getMonthNum() {
    var curMouth = new Date().getMonth() + 1;
    var data = [];
    for (var i = 1; i <= curMouth; i++) {
        var mun = i;
        if (i < 10) {
            mun = '0' + mun;
        };
        data.push({
            text: mun + '月',
            value: i
        });
    }
    return data;
}
$('#month').combobox({
    valueField: 'value',
    textField: 'text',
    data: getMonthNum()
    // onSelect: function(rec) {
    //     if (!!dutyId) {
    //         searchStaff();
    //     }
    // }
});

function SaveTime() {
    var timeStart1 = $("#timeStart").timespinner("getValue");
    if (timeStart1 == "") {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '你未设置上班时间');
        return false;
    } else {
        timeStart = timeStart1;
    }
    var timeEnd1 = $("#timeEnd").timespinner("getValue");
    if (timeEnd1 == "") {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '你未设置下班时间');
        return false;
    } else {
        timeEnd = timeEnd1;
    }
    var a = parseInt(timeStart1.replace(/:/gm, ''));
    var b = parseInt(timeEnd1.replace(/:/gm, ''));
    if (a >= b) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上班时间不得大于等于下班时间');
        return false;
    }
    $("#dlgSetTime").dialog("close");
    searchUser();
}

function searchUser() {
    timeStart = $("#timeStart").timespinner("getValue");
    timeEnd = $("#timeEnd").timespinner("getValue");
    name = $("#name").val();
    setTimeout(function() {
        $('#dg').datagrid({
            fitColumns: true,
            nowrap: true,
            rownumbers: true,
            singleSelect: true,
            url: '../ngym/GymEmployeesAction!statisticalSigns.zk',
            pagination: true,
            pageSize: '30',
            //            queryParams:{gmtStart:gmtStart,gmtEnd:gmtEnd,timeStart:timeStart,timeEnd: timeEnd,name:name,duty:duty},
            queryParams: {
                gmtStart: gmtStart,
                gmtEnd: gmtEnd,
                timeStart: timeStart,
                timeEnd: timeEnd,
                name: name,
                duty: duty
            },
            method: 'post',
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
        })
    }, 200)

}