//var setInt = self.setInterval("isOk()",300);
function localTime() {
    //setTimeout('localTime()',50);
}

function loginTimeout() {
    window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
    $('#materialMessages').attr('value', '');
    $('#editDays').attr('value', 0);

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
    $(window).resize(function() {
        $('body').css('height', $(window).height()); //设置body的高度
        $('body').css('width', $(window).width());
        var height0 = $(window).height();
        var width0 = $(window).width();
        $('#center-region').css({
            'width': width0
        });
        $('#showMessage').css({
            'width': '100%',
            'height': height0
        });
        $('.datagrid-view2').css({
            'width': '100%'
        });
        $('.datagrid-view2').children('.datagrid-header').children('.datagrid-header-inner').children('.datagrid-htable').children('tbody').children('.datagrid-header-row').css({
            'width': parseInt($('#showMessage').css('width')) - 30
        });
        if (parseInt($('#showMessage').css('width')) > 660) $('#filter').css({
            'padding-left': parseInt($('#showMessage').css('width')) - 660
        });
    });

    $('#hideDiv').hide();
    // $('#all').trigger('click');
    setTimeout(function() {
        $('#dg').datagrid({
            fitColumns: true,
            nowrap: true,
            rownumbers: true,
            singleSelect: true,
            url: 'CourseTableAction!list.zk',
            pagination: true,
            pageSize: '30',
            method: 'post',
            onLoadSuccess: function(data) {
                if (data.total == 0 && data.ERROR == 'No Login!') {
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
                $("a.popImage").fancybox({
                    openEffect: 'elastic',
                    closeEffect: 'elastic'
                });
            },
            onLoadError: function() {
                //alert('出错啦');
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
        })
    }, 100);
    // weekTable();
});

var curTime = '';
var curId = '';
var tableState = 'List';

function tableChange() {
    switch (tableState) {
        case 'List':
            tableState = 'Week';
            $('#tableState img').attr('src', 'images/tableWeek2.png');
            // $('.datagrid').hide();
            $('#dgList').hide();
            weekTable();
            $('#dgWeek').show();
            break;
        case 'Week':
            tableState = 'List';
            $('#tableState img').attr('src', 'images/tableList2.png');
            // $('.datagrid').show();
            $('#dgList').show();
            $('#dg').datagrid('reload');
            $('#dgWeek').hide();
            break;
        default:
            break;
    }
}

function iconOver() {
    $('#tableState').css('border', '1px solid #3fc371');
    switch (tableState) {
        case 'List':
            $('#tableState img').attr('src', 'images/tableList2.png');
            break;
        case 'Week':
            $('#tableState img').attr('src', 'images/tableWeek2.png');
            break;
        default:
            break;
    }
}

function iconOut() {
    $('#tableState').css('border', '1px solid #FFF');
    switch (tableState) {
        case 'List':
            $('#tableState img').attr('src', 'images/tableList.png');
            break;
        case 'Week':
            $('#tableState img').attr('src', 'images/tableWeek.png');
            break;
        default:
            break;
    }
}

function sendCurriculum() {
    $.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;推送确认', '确认推送课程表吗？', function(r) {
        if (r) {
            $.post('CourseAction!pushForUpdate.zk', {}, function(data) {
                if (data.STATUS) {
                    $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;完成', '课程表已推送成功！');
                } else {
                    if ('未登录' == datas.ERROR) {
                        loginTimeout();
                        return;
                    }
                }
            }, 'json');
        }
    });
}
var dataJSON = {};

function weekTable() {
    for (var i = 1; i < 8; i++) {
        $('#week' + i).html('');
    }
    dataJSON = {};
    $.post('CourseTableAction!list.zk', {
        page: 1,
        rows: 100,
    }, function(data) {
        if (data.STATUS) {
            $.each(data.rows, function(n, value) {
                var time = '<span class="week-img"><img src="images/lesson-time.png" alt="" /></span>' + value.courseTime + '<br>';
                var name = '<span class="week-img"><img src="images/lesson-name.png" alt="" /></span>' + value.courseName + '<br>';
                var coach = '<span class="week-img"><img src="images/lesson-coach.png" alt="" /></span>' + value.coachs + '<br>';
                var zan = '<span class="week-img"><img src="images/lesson-zan.png" alt="" /></span>' + value.zanCount;
                var cai = '<span class="week-img"><img src="images/lesson-cai.png" alt="" /></span>' + value.caiCount + '<br>';
                var lesson = '<div class="week-lesson" data-id=' + n + '><div class="week-center">' + time + name + coach + zan + cai + '</div></div>';
                $('#week' + value.week).append(lesson);
                dataJSON[n] = value;
            });
            $('.week-lesson').on('click', function() {
                if ($('#editLesson')[0]) {
                    $('#editLesson img').eq(0).attr('src', 'images/lesson-time.png');
                    $('#editLesson img').eq(1).attr('src', 'images/lesson-name.png');
                    $('#editLesson img').eq(2).attr('src', 'images/lesson-coach.png');
                    $('#editLesson img').eq(3).attr('src', 'images/lesson-zan.png');
                    $('#editLesson img').eq(4).attr('src', 'images/lesson-cai.png');
                    $('#editLesson').attr('id', '');
                }
                $(this).attr('id', 'editLesson');
                $('#editLesson img').eq(0).attr('src', 'images/lesson-time1.png');
                $('#editLesson img').eq(1).attr('src', 'images/lesson-name1.png');
                $('#editLesson img').eq(2).attr('src', 'images/lesson-coach1.png');
                $('#editLesson img').eq(3).attr('src', 'images/lesson-zan1.png');
                $('#editLesson img').eq(4).attr('src', 'images/lesson-cai1.png');
            })
        } else {
            if ('未登录' == datas.ERROR) {
                loginTimeout();
                return;
            }
        }
    }, 'json');
}

function searchCurriculum(week) {
    //var type = $("#course").combobox("getValue");
    //var name = $("#txt_word").searchbox("getValue");
    $("#dg").datagrid('load', {
        week: week
    });
    //$("#txt_word").searchbox("setValue",'');
}

function formatTime1(value, row, index) {
    //return value+'-'+row.courseTime2;
}

function formatTime(value) {
    switch (value) {
        case 1:
            return '星期一';
            //break;
        case 2:
            return '星期二';
            //break;
        case 3:
            return '星期三';
            //break;
        case 4:
            return '星期四';
            //break;
        case 5:
            return '星期五';
            //break;
        case 6:
            return '星期六';
            //break;
        case 7:
            return '星期日';
            //break;
        default:
            return '';
            //break;
    }

}

//新增
function newCurriculum() {
    $('#fm').form('clear');
    $('#courseTime1').timespinner('setValue', '00:00');
    $('#courseTime2').timespinner('setValue', '00:00');
    $('#dlg').dialog('open').dialog('setTitle', '&nbsp;&nbsp;添加课表信息');
    url = 'CourseTableAction!createOrUpdate.zk';
    $('#week').combobox('setValue', curTime);
}
//编辑
function editCurriculum() {
    if (tableState == 'List') {
        var row = $('#dg').datagrid('getSelected');
        if (row) {
            $('#dlg').dialog('open').dialog('setTitle', '&nbsp;&nbsp;编辑课表信息');
            url = 'CourseTableAction!createOrUpdate.zk?id=' + row.id;
            $("#id").val(row.id);
            $('#week').combobox('setValue', row.week);
            $('#courseTime1').timespinner('setValue', row.courseTime.split('-')[0]);
            $('#courseTime2').timespinner('setValue', row.courseTime.split('-')[1]);
            $('#fm').form('load', row);
        } else {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要编辑的课表!');
        }
    } else {
        var lesson = $('#editLesson').attr('data-id');
        // console.log(lesson);
        if (lesson) {
            lesson = dataJSON[lesson];
            $('#dlg').dialog('open').dialog('setTitle', '&nbsp;&nbsp;编辑课表信息');
            url = 'CourseTableAction!createOrUpdate.zk?id=' + lesson.id;
            $("#id").val(lesson.id);
            $('#week').combobox('setValue', lesson.week);
            $('#courseTime1').timespinner('setValue', lesson.courseTime.split('-')[0]);
            $('#courseTime2').timespinner('setValue', lesson.courseTime.split('-')[1]);
            $('#fm').form('load', lesson);
        } else {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要编辑的课表!');
        }
    }

}

//屏蔽事件
function shield() {
    event.stopPropagation();
    return false;
}


//check form
function checkForm() {
    var name = $.trim($("#courseName").textbox('getValue'));
    if (name == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '课程名称不能为空!');
        $("#courseName").focus();
        return false;
    }
    // if (name.length > 16) {
    //     $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '课程名称不得超过16个字符!');
    //     $("#courseName").focus();
    //     return false;
    // }
    var courseTime1 = $.trim($("#courseTime1").timespinner('getValue'));
    if (courseTime1 == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '课程起始时间不能为空!');
        $("#courseTime1").focus();
        return false;
    }
    var place = $.trim($("#place").textbox('getValue'));
    if (place == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '课程地点不能为空!');
        $("#place").focus();
        return false;
    }
    var courseTime2 = $.trim($("#courseTime2").timespinner('getValue'));
    //alert(courseTime2);
    if (courseTime2 == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '课程结束时间不能为空!');
        $("#courseTime2").focus();
        return false;
    }
    var startDatenum = parseInt(courseTime1.replace(/\:/g, ""));
    var endDatenum = parseInt(courseTime2.replace(/\:/g, ""));
    if (startDatenum > endDatenum) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '结束时间必须大于开始时间!');
        return false;
    }
    if (place.length > 50) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '课程地点不能太长!');
        $("#place").focus();
        return false;
    }
    var coachs = $.trim($("#coachs").textbox('getValue'));
    if (coachs == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '课程教练不能为空!');
        $("#coachs").focus();
        return false;
    }
    if (coachs.length > 20) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '课程教练不能太长!');
        $("#coachs").focus();
        return false;
    }
    var week = $.trim($("#week").combobox('getValue'));
    if (week == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '课程日期不能为空!');
        $("#week").focus();
        return false;
    }
    return true;
}

function saveCurriculum() {
    //uploadImage();
    if (checkForm()) {
        window.msgLoading();
        $('#fm').form('submit', {
            url: url,
            onSubmit: function() {
                return checkForm();
            },
            success: function(result) {
                msgLoading('close');
                var result = eval('(' + result + ')');
                if (result.STATUS) {
                    //$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;信息', '保存成功!');
                    //$('#dg').datagrid('reload');
                    $("#dg").datagrid('reload');
                    weekTable();
                    $('#dlg').dialog('close');
                } else {
                    $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '系统繁忙!');
                }
            }
        });

    }


}

function destroyCurriculum() {
    if (tableState == 'List') {
        var row = $('#dg').datagrid('getSelected');
        if (row) {
            $.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;删除确认', '确认删除' + row.courseName + '吗？', function(r) {
                if (r) {
                    $.getJSON('CourseTableAction!delete.zk', {
                        id: row.id
                    }, function(data) {
                        if (data.STATUS) {
                            $('#dg').datagrid('reload');
                            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;信息', '删除成功!');
                        } else {
                            if ('No Login!' == data.ERROR) {
                                loginTimeout();
                                return;
                            }
                            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '删除失败!');
                        }
                    });
                }
            });
        } else {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择课程!');
        }
    } else {
        var lesson = $('#editLesson').attr('data-id');
        if (lesson) {
            lesson = dataJSON[lesson];
            $.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;删除确认', '确认删除' + lesson.courseName + '吗？', function(r) {
                if (r) {
                    $.getJSON('CourseTableAction!delete.zk', {
                        id: lesson.id
                    }, function(data) {
                        if (data.STATUS) {
                            // $('#dg').datagrid('reload');
                            weekTable();
                            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;信息', '删除成功!');
                        } else {
                            if ('No Login!' == data.ERROR) {
                                loginTimeout();
                                return;
                            }
                            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '删除失败!');
                        }
                    });
                }
            });
        } else {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择课程!');
        }
    }

}