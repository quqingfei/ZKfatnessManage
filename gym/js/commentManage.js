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
					coachId = rec.id;
					searchComment();
				}
			});
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
	$('#hideDiv').hide();
});
var coachId = '';
var commentId = '';
var startDate = '0001-01-01 00:00:00';
var endDate = '9999-12-31 23:59:59';

function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}

function formatControl(value, row) {
	/*var control = '<a href="javascript:;" onclick="checkComment(\'' + value + '\',' + row.avgMajor + ',' + row.avgService + ',' + row.totalEvaluate + ')">详情</a> | <a href="javascript:;" onclick="lessonHis(\''+row.coachId+'\')">统计</a>';*/
	var control = '<a href="javascript:;" onclick="lessonHis(\''+row.coachId+'\')">统计</a>';

	return control;
}
function formatCourseName(value){
	var nameL = value.length;
	if(nameL>5){
		return value.substr(0,5)+"...";
	}else{
		return value;
	}
}
var glocoachId = "";
function lessonHis(coachId) {
	glocoachId = coachId;
	$('#dlgSign2').dialog({title: "&nbsp;&nbsp;&nbsp;&nbsp;已完成课程用户"});
	$('#dlgSign2').dialog('open');
	$('#dgSign2').datagrid({
		// rownumbers: true,
		// sortName: 'gmtModify',
		// singleSelect: true,
		pagination: true,
		pageSize: 20,
		url: '../ngym/GymGroupCourseManageAction!countCoachEvaluate.zk',
		queryParams: {
			coachId: coachId
		},
		method: 'post',
		onLoadSuccess: function(data) {
			if (data.ERROR == '未登录') {
					loginTimeout();
					//          login();
					return;
			}
			$(this).datagrid("fixDlgWidth");
		}
	});
}

laydate({
  elem: '#startDated',
  format: 'YYYY/MM', // 分隔符可以任意定义，该例子表示只显示年月
  festival: false, //显示节日
  choose: function(data){ //选择日期完毕的回调
    //alert('得到：'+datas);
    if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
			return;
	}
    $("#dgSign2").datagrid('load', {
		courseDate: data,
		coachId:glocoachId
	});
  }
});
$('#alllist').click(function(event) {
	$("#dgSign2").datagrid('load', {
		coachId:glocoachId
	});
});
function formatDate(value,row){
	var reg = /.*\..*/;
    if(!reg.test(row.courseHour)){
    	return value+" "+row.courseHour+":"+"00"
    }else{
    	return value+" "+parseInt(row.courseHour)+":"+"30"
    }
}
function formatEval(value,row){
	console.log(row)
	switch(value){
		case 0: return "<span style='color:#C45757' onclick='pushEval(\""+row.id+"\")'>再次推送</span>";break;
		case 1: return "<span style='color:#3fc371' onclick='showEvalOne(\""+row.id+"\")'>查看</span>";break;
		case 2: return "<span style='color:#6C63F7'>隐藏</span>";break;
	}
}
function formatLevel(value) {
	switch (value) {
		case 0:
			return '明星教练';
			break;
		case 1:
			return '口碑教练';
			break;
		case 2:
			return '实习教练';
			break;
		default:
			return '未知';
			break;
	}
}

function onStart(datas) {
	startDate = datas + ' 00:00:00';
	searchComment();
}

function onEnd(datas) {
	endDate = datas + ' 00:00:00';
	searchComment();
}

function searchComment() {
	$("#dg").datagrid('load', {
		coachId: coachId,
		startDate: startDate,
		endDate: endDate
	});
}
var comPage = 0;
var maxPage = 0;

function pushEval(id){
	$.messager.confirm("&nbsp;&nbsp;&nbsp;&nbsp;再次推送", "是否推送？", function (r) {  
        if (r) {  
            $.ajax({
				type:'post',
				data:{id:id},
				url:'../ngym/GymGroupCourseManageAction!pushEvaluation.zk',
				dataType:'json',
				success:function(res){
					if (data.ERROR == '未登录') {
			 			loginTimeout();
			  			return;
		  			}
					if(res.STATUS){						
						$.messager.show({
						       title:'&nbsp;&nbsp;&nbsp;&nbsp;消息',
						       msg:'推送成功！',
						       timeout:3000,
						       showType:'slide'
						});
					}
				}
			})
        }  
    });  
	
}

function checkComment(value, major, service, total) {
	comPage = 0;
	maxPage = 0;
	commentId = value;

	$('#commentTotal h3').text(total);
	$('#expertStar h3').text(major);
	$('#serviceStar h3').text(service);
	loadComment(comPage);
	$('#dlgCheck').dialog('open');
}
function showEvalOne(id){
	loadOneComment(id);
	$('#dlgCheck').dialog('open');
}

function commentPrev() {
	comPage--;
	if (comPage < 0) comPage = 0;
	else loadComment(comPage);
}

function commentNext() {
	if (!maxPage) {
		comPage++;
		loadComment(comPage);
	}

}
function loadOneComment(id) {
	$.post('../ngym/GymGroupCourseManageAction!getEvaluateById.zk', {
		id: id
	}, function(data) {
		if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
			return;
		}
		if (data.STATUS) {
			var comments = data.gymGroupCourseEvaluate;
			var courseName  = data.course.courseName;
			var user = JSON.parse(data.user)
			if (comments) {
				$('.dialog-body').html('');
					var _commentItem = $('<div>').attr('class', 'comment-item');
					var _comment1 = '<div class="item-row"><div class="item-col"><b>评价学员：</b><span>' + user.memberName + '</span></div><div class="item-col"><b>训练课程：</b><span>' + courseName + '</span></div></div>';
					var _comment2 = '<div class="item-row"><div class="item-col"><b>学员手机：</b><span>' + (user.memberPhone != undefined ? user.memberPhone : '无') + '</span></div><div class="item-col"><b>学员评分：</b><span>专业' + comments.majorEvaluate + '星 服务' + comments.serviceEvaluate + '星</span></div></div>';
					var _comment3 = '<div class="item-row"><div class="item-col"><b>是否匿名：</b><span>' + (comments.anonymous == 'y' ? '是' : '否') + '</span></div><div class="item-col"><b>评价时间：</b><span>' + formatTime(comments.gmtCreate) + '</span></div></div>';
					var _comment4 = '<div class="item-row"><b>评价内容：</b><span>' + (comments.comment != undefined ? comments.comment : '无') + '</span></div>';
					var commentPics = $('<div>').attr('class', 'item-row');
					if (!!comments.images) {
						commentPics.append($('<b>'));
						var pics = eval('(' + comments.images + ')');
						// console.log(pics);
						for (var i = 0; i < pics.length; i++) {
							var pic = $('<div>').attr({
								'class': 'item-pics',
								'data-src': pics[i]
							}).css({
								'background': '#ccc url(\'../file/FileCenter!showImage2.zk?name=' + pics[i] + '\')',
								'background-repeat': 'no-repeat',
								'background-size': 'cover',
								'background-position': 'center'
							});
							commentPics.append(pic);
						}
					}
					_commentItem.append(_comment1);
					_commentItem.append(_comment2);
					_commentItem.append(_comment3);
					_commentItem.append(_comment4);
					_commentItem.append(commentPics);
					$('.dialog-body').append(_commentItem);
				
			} else {
				comPage--;
				maxPage = 1;
			}

		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
}

function loadComment(page) {
	$.post('../ngym/GymGroupCourseManageAction!listCoachEvaluate.zk', {
		coachId: commentId,
		startDate: startDate,
		endDate: endDate,
		page: page,
		rows: 15
	}, function(data) {
		if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
			return;
		}
		if (data.STATUS) {
			var comments = data.rows;
			if (comments.length > 0) {
				$('.dialog-body').html('');
				for (var n = 0; n < comments.length; n++) {
					var comment = comments[n];
					var _commentItem = $('<div>').attr('class', 'comment-item');
					var _comment1 = '<div class="item-row"><div class="item-col"><b>评价学员：</b><span>' + comment.userName + '</span></div><div class="item-col"><b>训练课程：</b><span>' + comment.courseName + '</span></div></div>';
					var _comment2 = '<div class="item-row"><div class="item-col"><b>学员手机：</b><span>' + (comment.userPhone != undefined ? comment.userPhone : '无') + '</span></div><div class="item-col"><b>学员评分：</b><span>专业' + comment.major + '星 服务' + comment.service + '星</span></div></div>';
					var _comment3 = '<div class="item-row"><div class="item-col"><b>是否匿名：</b><span>' + (comment.anonymous == 'y' ? '是' : '否') + '</span></div><div class="item-col"><b>评价时间：</b><span>' + formatTime(comment.evaluateDate) + '</span></div></div>';
					var _comment4 = '<div class="item-row"><b>评价内容：</b><span>' + (comment.comment != undefined ? comment.comment : '无') + '</span></div>';
					var commentPics = $('<div>').attr('class', 'item-row');
					if (!!comment.images) {
						commentPics.append($('<b>'));
						var pics = eval('(' + comment.images + ')');
						// console.log(pics);
						for (var i = 0; i < pics.length; i++) {
							var pic = $('<div>').attr({
								'class': 'item-pics',
								'data-src': pics[i]
							}).css({
								'background': '#ccc url(\'../file/FileCenter!showImage2.zk?name=' + pics[i] + '\')',
								'background-repeat': 'no-repeat',
								'background-size': 'cover',
								'background-position': 'center'
							});
							commentPics.append(pic);
						}
					}
					_commentItem.append(_comment1);
					_commentItem.append(_comment2);
					_commentItem.append(_comment3);
					_commentItem.append(_comment4);
					_commentItem.append(commentPics);
					$('.dialog-body').append(_commentItem);
				}
			} else {
				comPage--;
				maxPage = 1;
			}

		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
}

function formatTime(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd hh:mm");
}