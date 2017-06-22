//var setInt = self.setInterval("isOk()",300);
function localTime() {
    //setTimeout('localTime()',50);
}

function loginTimeout() {
    window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}

$(function() {

    $.post('../ngym/GymEmployeesAction!list.zk', {
        page: 1,
        rows: 1000,
        duty: '教练'
    }, function(data) {
        if (data.ERROR == '未登录') {
            loginTimeout();
            //          login();
            return;
        }
        if (data.STATUS) {
            var rows = data.rows;
            var makers = [];
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var maker = {
                    "id": row.id,
                    "duty": row.realName
                };
                makers.push(maker);
            }
            makers.push({
                "id": '',
                "duty": '全部'
            });
            $('#roleSel').combobox({
                valueField: 'id',
                textField: 'duty',
                data: makers,
                onSelect: function(rec) {
                    // dutySel = rec.duty;
                    dutyId = rec.id;
                    weekTable(startDate, endDate);
                }
            });
        } else {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
        }
    }, 'json');

    $.post('../ngym/GymGroupCourseManageAction!listCourseCoach.zk', {}, function(data) {
        if (data.ERROR == '未登录') {
            loginTimeout();
            //          login();
            return;
        }
        if (data.STATUS) {
            var rows = data.rows;
            $('#courseName').combobox({
                valueField: 'courseId',
                textField: 'courseName',
                data: rows,
                onSelect: function(rec) {
                    var coachs = eval('(' + rec.coachInfo + ')');
                    $('#coachs').combobox({
                        valueField: 'id',
                        textField: 'name',
                        data: coachs,
                        onSelect: function(rec) {
                            var startTime, endTime;
                            // $.post('../ngym/GymGroupCourseManageAction!getCoachWorkTime.zk', {
                            //     coachId: rec.id
                            // }, function(data) {
                            //     if (data.STATUS) {
                            //         startTime = data.workTime.startTime;
                            //         endTime = data.workTime.endTime;
                            //         workTimeMng(startTime, endTime);
                            //     } else {
                            //         $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
                            //     }
                            // }, 'json');
                            $.ajax({
                                url: '../ngym/GymGroupCourseManageAction!getCoachWorkTime.zk',
                                async: false,
                                type: "POST",
                                dataType: "json",
                                data: {
                                    coachId: rec.id
                                },
                                success: function(data) {
                                    if (data.ERROR == '未登录') {
                                        loginTimeout();
                                        //          login();
                                        return;
                                    }
                                    if (data.STATUS) {
                                        startTime = data.workTime.startTime;
                                        endTime = data.workTime.endTime;
                                        workTimeMng(startTime, endTime);
                                        // console.log('box');
                                    } else {
                                        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
                                    }
                                }
                            });
                        }
                    });
                }
            });
        } else {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
        }
    }, 'json');

    workTimeMng(0, 24);
    searchTime();
    weekTable(startDate, endDate);
    $('#hideDiv').hide();
});

function workTimeMng(start, end) {
    var workTime = [];
    for (var i = start * 2; i <= end * 2; i++) {
        if (i % 2 == 0) {
            var time = {
                'text': timeNum(parseInt(i / 2)) + ':' + '00',
                'value': i / 2
            }
            workTime.push(time);
        } else {
            var time = {
                'text': timeNum(parseInt(i / 2)) + ':' + '30',
                'value': i / 2
            }
            workTime.push(time);
        }
    }
    $('#courseTime1').combobox({
        valueField: 'value',
        textField: 'text',
        data: workTime,
        onSelect: function(rec) {

            var time = rec.value + 1;
            // console.log(time);
            // console.log(start);
            // console.log(end);
            if (time > end) {
                $('#courseTime2').combobox('setValue', '');
                $('#courseTime2').combobox('select', time - 1);
            } else $('#courseTime2').combobox('select', time);
        }
    });
    $('#courseTime2').combobox({
        valueField: 'value',
        textField: 'text',
        data: workTime,
        onSelect: function(rec) {

            var time = rec.value - 1;
            if (time < start) {
                $('#courseTime1').combobox('setValue', '');
                $('#courseTime1').combobox('select', time + 1);
            } else $('#courseTime1').combobox('select', time);
        }
    });
}

function formatTime1(value) {
    var d = new Date(value);
    return d.format("yyyy-MM-dd hh:mm");
}

function formatBMI(value, index) {
    var weight = index.weight;
    var height = index.height;
    var bmi = weight / height / height * 10000;
    if (bmi < 18.5) {
        return '<div style="color:#3ba9ef">偏瘦</div>'
    } else if (bmi < 24) {
        return '<div style="color:#3fc371">标准</div>'
    } else if (bmi < 28) {
        return '<div style="color:#FCBA48">偏胖</div>'
    } else if (bmi >= 28) {
        return '<div style="color:#fe6262">肥胖</div>'
    } else {
        return '未知'
    }
}

var curTime = '';
var curId = '';
var tableState = 'Week';
var startDate, endDate;
var dateSch = 0;
var dutyId = '';

function timeNum(num) {
    if (num < 10) return '0' + num;
    else return num;
}

function searchTime() {
    var today = new Date();

    var start = new Date();
    if (!start.getDay()) {
        start.setDate(start.getDate() - start.getDay() - 6 + dateSch * 7);
    } else {
        start.setDate(start.getDate() - start.getDay() + 1 + dateSch * 7);
    }
    startDate = formatDate(start) + ' 00:00:00';

    var end = new Date();
    if (!end.getDay()) {
        end.setDate(end.getDate() - end.getDay() + dateSch * 7);
    } else {
        end.setDate(end.getDate() - end.getDay() + 7 + dateSch * 7);
    }
    endDate = formatDate(end) + ' 23:59:59';

    var title = formatNum(start.getMonth() + 1) + '/' + formatNum(start.getDate()) + '~' + formatNum(end.getMonth() + 1) + '/' + formatNum(end.getDate());
    $('#dateChange span').text(title);

    for (var i = 1; i < 8; i++) {
        var day = formatNum(start.getMonth() + 1) + '/' + formatNum(start.getDate());
        if (start < today) {
            var weekDay = new Date;
            weekDay.setDate(start.getDate() + 7);
            var week = weekDay.format("yyyy-MM-dd");
        } else {
            var week = start.format("yyyy-MM-dd");
        }
        $('#week a').eq(i - 1).attr('data-day', week);
        $('#date' + i).text(day);
        start.setDate(start.getDate() + 1);
    }
}

function formatNum(num) {
    if (num <= 9) return '0' + num;
    else return num;
}

$('#weekPrev').on('click', function() {
    dateSch--;
    if (dateSch < 0) dateSch = 0;
    else {
        searchTime();
        weekTable(startDate, endDate);
    }

})

$('#weekNext').on('click', function() {
    dateSch++;
    if (dateSch > 2) dateSch = 2;
    else {
        searchTime();
        weekTable(startDate, endDate);
    }

})

var dataJSON = {};

function formatDate(date) {
    var year = date.getFullYear();
    var mon = date.getMonth() + 1;
    var date = date.getDate();
    return year + '-' + mon + '-' + date;
}

function weekTable(start, end) {
    for (var i = 0; i < 7; i++) {
        $('#week' + i).html('');
    }
    msgLoading();
    dataJSON = {};
    $.post('../ngym/GymGroupCourseManageAction!GroupCorseTable.zk', {
        start: start,
        end: end,
        coachId: dutyId
    }, function(data) {
        msgLoading('close');
        if (data.STATUS) {

            $.each(data.rows, function(n, value) {
                var time = '<span class="week-img"><img src="images/lesson-time.png" alt="" /></span>' + value.hour + '<br>';
                var name = '<span class="week-img"><img src="images/lesson-name.png" alt="" /></span>' + value.courseName + '<br>';
                var counts = '<span class="week-img"><img src="images/lesson-people.png" alt="" /></span>' + value.orderCount + '/' + value.maxCount + '<br>';
                var coach = '<span class="week-img"><img src="images/lesson-coach.png" alt="" /></span>' + value.coachName + '<br>';

                var lesson = '<div class="week-lesson" data-id=' + n + '><div class="week-center">' + time + name + counts + coach + '</div></div>';
                var week = new Date(value.date);
                $('#week' + week.getDay()).append(lesson);
                dataJSON[n] = value;
            });
            $('.week-lesson').on('click', function() {
                if ($('#editLesson')[0]) {
                    $('#editLesson img').eq(0).attr('src', 'images/lesson-time.png');
                    $('#editLesson img').eq(1).attr('src', 'images/lesson-name.png');
                    $('#editLesson img').eq(2).attr('src', 'images/lesson-people.png');
                    $('#editLesson img').eq(3).attr('src', 'images/lesson-coach.png');
                    $('#editLesson').attr('id', '');
                }
                $(this).attr('id', 'editLesson');
                $('#editLesson img').eq(0).attr('src', 'images/lesson-time1.png');
                $('#editLesson img').eq(1).attr('src', 'images/lesson-name1.png');
                $('#editLesson img').eq(2).attr('src', 'images/lesson-people1.png');
                $('#editLesson img').eq(3).attr('src', 'images/lesson-coach1.png');
            })
            drawLine($('#dgWeek').height());
        } else {
            if ('未登录' == data.ERROR) {
                loginTimeout();
                return;
            }
        }
    }, 'json');

}

function drawLine(height) {
    console.log(height);
    var n = parseInt(height / 110);
    $('.dg-line').remove();
    for (var i = 1; i <= n; i++) {
        var line = '<div class="dg-line" style="position: absolute;top: ' + 110 * i + 'px; width:100%;background-color: #e4e4e4;height: 1px;z-index: 999;"></div>'
        $('#dgWeek').append(line);
    }

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

function formClear() {
    $('#courseName').combobox('setValue', '');
    $('#coachs').combobox('setValue', '');
    $('.week-check').removeClass('week-check');
    workTimeMng(0, 24);
    $('#courseTime1').combobox('select', 0);
    // $('#courseTime2').combobox('setValue', '');
    $('#courseDate').val('');
}

function checkCurriculum() {
    var lesson = $('#editLesson').attr('data-id');
    // console.log(lesson);
    if (lesson) {
        lesson = dataJSON[lesson];
        $('#dlgSign').dialog('open');
        $('#dgSign2').datagrid({
            url: '../ngym/GymGroupCourseManageAction!selectCourseTable.zk',

            pageSize: '30',
            method: 'post',
            queryParams: {
                tableId: lesson.tableId
            },
            onLoadSuccess: function(data) {
                if (data.STATUS) {
                    $(this).datagrid("fixDlgWidth");
                    var courseInfo = data.courseInfo[0];
                    $('#dlgCourseName').text(courseInfo.courseName);
                    $('#dlgCoachName').text(courseInfo.coachName);
                    $('#dlgCourseTime').text(courseInfo.date + ' ' + courseInfo.hour);
                    switch (courseInfo.courseState) {
                        case 1:
                            $('#dlgCourseState').text('预约中');
                            break;
                        case 2:
                            $('#dlgCourseState').text('已开课');
                            break;
                        case 3:
                            $('#dlgCourseState').text('课程完成');
                            break;
                        default:
                            $('#dlgCourseState').text('无');
                            break;
                    }
                    $('#dlgCourseNum').text(courseInfo.orderCount + '人');
                } else {
                    if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
                        loginTimeout();
                        return;
                    }
                    $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
                }
            }
        })
    } else {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要查看的课程!');
    }
}
var curState;
//新增
function newCurriculum() {
    curState = 0;
    formClear();
    $('#courseDate').parent().hide();
    $('#week').parent().show();
    $('#courseState').parent().hide();
    $('#dlgTable').hide();
    $('#dlg').dialog('open').dialog('setTitle', '&nbsp;&nbsp;&nbsp;&nbsp;添加课程');
    // $('#week').combobox('setValue', curTime);
}
//编辑
function editCurriculum() {
    curState = 1;
    formClear();
    $('#courseDate').parent().show();
    $('#week').parent().hide();
    $('#courseState').parent().show();
    $('#dlgTable').show();
    var lesson = $('#editLesson').attr('data-id');
    if (lesson) {
        lesson = dataJSON[lesson];
        $('#dlg').dialog('open').dialog('setTitle', '&nbsp;&nbsp;&nbsp;&nbsp;编辑课程');
        $("#id").val(lesson.tableId);
        $('#courseName').combobox('select', lesson.courseId);
        $('#coachs').combobox('select', lesson.coachId);
        $('#courseDate').val(lesson.date);
        var hour = parseInt(lesson.hour.split('-')[0].split(':')[0]);
        if (lesson.hour.split('-')[0].split(':')[1] == 30)
            hour = hour + 0.5;

        // console.log(hour);
        $('#courseTime1').combobox('select', hour);
        $('#courseState').combobox('select', lesson.courseState);
        $('#dgSign1').datagrid({
            url: '../ngym/GymGroupCourseManageAction!selectCourseTable.zk',

            pageSize: '30',
            method: 'post',
            queryParams: {
                tableId: lesson.tableId
            },
            onLoadSuccess: function(data) {
                $(this).datagrid("fixDlgWidth");
            }
        })

    } else {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要编辑的课程!');
    }
}

//屏蔽事件
function shield() {
    event.stopPropagation();
    return false;
}


//check form
function checkForm() {
    var name = $("#courseName").combobox('getValue');
    if (name == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '课程名称不能为空!');
        return false;
    }

    var coachs = $("#coachs").combobox('getValue');
    if (coachs == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '带课教练不能为空!');
        $("#coachs").focus();
        return false;
    }
    if (!curState) {
        var week = $('.week-check').length;
        if (week == 0) {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择星期!');
            return false;
        }
    } else {
        var date = $('#courseDate').val();
        if (date == '') {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择日期!');
            return false;
        }
    }
    var courseTime1 = $.trim($("#courseTime1").combobox('getValue'));
    if (courseTime1 == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上课时间不能为空!');
        return false;
    }
    var courseTime2 = $.trim($("#courseTime2").combobox('getValue'));
    //alert(courseTime2);
    if (courseTime2 == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '下课时间不能为空!');
        return false;
    }
    return true;
}

function saveCurriculum() {
    //uploadImage();
    if (checkForm()) {
        msgLoading();
        if (!curState) {
            var date = $('.week-check');
            var dates = [];
            for (var i = 0; i < date.length; i++) {
                dates.push($(date[i]).attr('data-day'));
            }
            $.post('../ngym/GymGroupCourseManageAction!addCourseTable.zk', {
                courseId: $('#courseName').combobox('getValue'),
                coachId: $('#coachs').combobox('getValue'),
                date: dates.toString(),
                hour: $('#courseTime1').combobox('getValue')
            }, function(data) {
                msgLoading('close');
                if (data.ERROR == '未登录') {
                    loginTimeout();
                    //          login();
                    return;
                }
                if (data.STATUS) {
                    weekTable(startDate, endDate);
                    $('#dlg').dialog('close');
                } else {
                    $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
                }
            }, 'json');
        } else {
            $.post('../ngym/GymGroupCourseManageAction!updateCourseTable.zk', {
                tableId: $('#id').val(),
                courseId: $('#courseName').combobox('getValue'),
                coachId: $('#coachs').combobox('getValue'),
                date: $('#courseDate').val(),
                state: $('#courseState').combobox('getValue'),
                hour: $('#courseTime1').combobox('getValue')
            }, function(data) {
                msgLoading('close');
                if (data.ERROR == '未登录') {
                    loginTimeout();
                    //          login();
                    return;
                }
                if (data.STATUS) {
                    weekTable(startDate, endDate);
                    $('#dlg').dialog('close');
                } else {
                    $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
                }
            }, 'json');
        }

    }


}

function destroyCurriculum() {
    var lesson = $('#editLesson').attr('data-id');
    if (lesson) {
        lesson = dataJSON[lesson];
        $('#dgSign3').datagrid({
            url: '../ngym/GymGroupCourseManageAction!selectCourseTable.zk',

            pageSize: '30',
            method: 'post',
            queryParams: {
                tableId: lesson.tableId
            },
            onLoadSuccess: function(data) {
                $(this).datagrid("fixDlgWidth");
            }
        })
        $('#dlgDel').dialog('open');
        $('#delBtn').off('click').on('click', function() {
            $.getJSON('../ngym/GymGroupCourseManageAction!deleteCourseTable.zk', {
                tableId: lesson.tableId
            }, function(data) {
                if (data.STATUS) {
                    // $('#dg').datagrid('reload');
                    $('#dlgDel').dialog('close');
                    weekTable(startDate, endDate);
                    $.messager.show({
                        title: "&nbsp;&nbsp;消息",
                        timeout: 2000,
                        msg: "删除成功!"
                    });
                } else {
                    if ('No Login!' == data.ERROR) {
                        loginTimeout();
                        return;
                    }
                    $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '删除失败!');
                }
            });
        })
    } else {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择课程!');
    }

}

$('#week a').on('click', function() {
    if ($(this).attr('class') == 'week-check')
        $(this).removeClass('week-check');
    else
        $(this).addClass('week-check');
})