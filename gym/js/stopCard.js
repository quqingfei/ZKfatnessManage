function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
	loginCheck();

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
				$.messager.show({
					title: "消息",
					timeout: 1000,
					msg: "扫码成功!"
				});
				searchUserById(data.userId);
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码!');
			}
		}, 'json');
	});
});


//标注
var remarkUserId;
var curRow; //当前行
var remark = [];
var curRowIndex;

//搜索
function searchUser() {
	var data = {};
	var name = $('#nameSearch').val();
	var phone = $('#phoneSearch').val();
	data.cardType = 0;
	data.type = 'effect';
	if (name && name != '')
		data.name = name;
	if (phone && phone != '')
		data.phone = phone;
	$("#dg").datagrid('load', data);

}

function searchUserById(id) {
	var data = {};
	var userID = id;
	var name = $('#nameSearch').val();
	var phone = $('#phoneSearch').val();
	data.cardType = 0;
	data.type = 'effect';
	if (name && name != '')
		data.name = name;
	if (phone && phone != '')
		data.phone = phone;
	if (userID && userID != '')
		data.userId = userID;
	$("#dg").datagrid('load', data);
}

function toSearch() {
	searchUser();
}


//客户状态
function formatStatus(value, row) {
	if (!!row.userId) {
		if (value) {
			if (value == 'true') {
				return '有效会员卡';
			} else {
				return '无效会员卡';
			}
		} else {
			return '未开卡';
		}
	} else {
		return '未激活';
	}
}
//会员卡类型
function formatType(value, row, index) {
	switch (parseInt(value)) {
		case 0:
			return '时效卡';
		case 1:
			return '次卡';
		default:
			return '';
	}
}
//标注当前行
//标注
// function formatRemark(value, row, index) {
// 	var content = value;
// 	if (value == '' || !value) return '';
// 	if (content.length > 8) {
// 		content = content.substring(0, 8) + '...';
// 	}
// 	return content;
// }
//可执行操作
function formatAction(value, row, index) {
	//var seeMessage = '<a href="javascript:;" onclick="seeMessage(\'' + '' + '\')">查看信息</a>';
	var seeMessage = '<a href="javascript:;"  onclick="seeMessage(' + index + ')">查看</a>';
	var stopCard = '<a href="javascript:;"  onclick="stopCard(' + index + ')">停卡</a>';
	var action;
	action = '<div class="action">' + seeMessage + stopCard + '</div>';
	return action;
}
var curStopId;

function stopCard() {
	// var record = $('#dg').datagrid('selectRow', index);
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择会员卡!');
		return;
	}
	$('#startDate').val(formatTime(row.gmtStart));
	var today = new Date();
	// if (row.gmtStart - today.getTime() >= 0) {
	// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '此卡已停!');
	// 	return;
	// }
	if (row.gmtStart - today.getTime() >= 0) {
		$('#stopState').text('[已停卡]');
	} else {
		$('#stopState').text('[未停卡]');
	}
	if (row.cardType == 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '次卡不能停卡!');
		return;
	}
	if (row.effective == 'false') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员卡已过期!');
		return;
	}
	curStopId = row.id
	if (row.totlePause) {
		$('#stopCount').text(row.totlePause);
	} else {
		$('#stopCount').text('0');
	}

	if (row.totlePauseDate) {
		$('#stopTime').text(parseInt(row.totlePauseDate / 3600 / 24 / 1000));
	} else {
		$('#stopTime').text('0');
	}
	$('#dlgStopMessage').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;停卡");
	$('#dlgStopMessage').attr('data-end', row.gmtEnd);
	$('#dlgStopMessage').attr('data-start', row.gmtStart);
}


function restart(date) {
	var today = new Date();
	var start = $('#dlgStopMessage').attr('data-start');
	var days;
	date = new Date(date);
	if (start < today.getTime()) {
		days = date.getTime() - today.getTime();
		if (days < 0) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择今天以后的时间!');
			$('#startDate').val('');
		}
	} else {
		days = date.getTime() - start;
	}
	var newEnd = parseInt($('#dlgStopMessage').attr('data-end')) + days;
	newEnd = formatTime(newEnd);

	$('#dlgStopMessage').attr('data-newend', newEnd);
}


function chooseSure(dlgId) {
	var startDate = $('#startDate').val();
	var endDate = $('#dlgStopMessage').attr('data-newend');
	if (!startDate || startDate == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '起始时间不能为空!');
		$("#startDate").focus();
		return false;
	}
	// startDate += " 00:00:00";
	$.post('../ngym/GymMembersAction!pause.zk', {
		id: curStopId,
		gmtStart: startDate,
		gmtEnd: endDate
	}, function(data) {
		if (data.STATUS) {
			$('#' + dlgId).dialog('close');
			$('#dg').datagrid('reload');
			$.messager.show({
				title: "&nbsp;&nbsp;&nbsp;&nbsp;消息",
				timeout: 2000,
				msg: "停卡成功!"
			});
		} else {
			if (data.INFO) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
				return false;
			}
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '停卡失败!');
		}
	}, 'json');
}

function chooseCancle(dlgId) {
	$('#' + dlgId).dialog('close');
	$('#startDate').val('');
	// $('#endDate').datebox('setValue', '');
	$('#stopCount').text('0');
	$('#stopTime').text('0');
	curStopId = '';
}
//时间格式化
function formatTime(value) {
	var date = new Date((value));
	var result = date.format("yyyy-MM-dd hh:mm:ss"); //date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();//+':'+second;
	return result;
}

function formatTime1(value) {
	var date = new Date((value));
	var result = date.format("yyyy-MM-dd"); //date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();//+':'+second;
	return result;
}

function clearShowFrom() {
	$('#memberIcon').attr('src', '../images/default.png');
	$('#shouldAmount').text('');
	$('#realAmount').text('');
	$('#memberName').text('');
	$('#memberPhone').text('');
	$('#memberSex').text('');
	$('#memberAge').text('');
	// $('#memberIDCard').text('');
	// $('#memberHeight').text('');
	// $('#memberWeight').text('');
	// $('#memberProfession').text('');
	// $('#memberEmployer').text('');
	// $('#memberName').text('');
	// $('#memberAddress').text('');
	// $('#memberEmployerAddress').text('');
	$('#memberCardType').text('');
	$('#memberCardName').text('');
	$('#memberCardGmtStart').text('');
	$('#memberCardGmtEnd').text('');
	$('#memberCardTotleTime').text('');
	$('#memberCardUseTime').text('');
	$('#gmtCreate').text('');
	$('#gmtModify').text('');
}

function seeMessage() {


	// var record = $('#dg').datagrid('selectRow', index);
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择会员卡!');
		return;
	}
	clearShowFrom();
	$('#memberIcon').attr('src', '../file/FileCenter!showImage2.zk?name=' + row.photo);
	$('#shouldAmount').text(row.shouldPay);
	$('#realAmount').text(row.realPay);
	$('#memberName').text(row.name);
	$('#memberPhone').text(row.phone);
	if (row.sex == 'M')
		$('#memberSex').text('男');
	else if (row.sex == 'F')
		$('#memberSex').text('女');
	else
		$('#memberSex').text('');
	if (row.gmtBirth) {
		var dateB = new Date(row.gmtBirth);
		var birth = dateB.getFullYear();
		var date = new Date();
		$('#memberAge').text(date.getFullYear() - birth);
	} else {
		$('#memberAge').text('0');
	}
	// $('#memberIDCard').text(row.idCard);
	// $('#memberHeight').text(row.height);
	// $('#memberWeight').text(row.weight);
	// $('#memberProfession').text(row.job);
	// $('#memberEmployer').text(row.workUnit);
	// $('#memberName').text(row.name);
	// $('#memberAddress').text(row.address);
	// $('#memberEmployerAddress').text(row.workUnitAddress);
	if (row.cardType == 0) {
		$('#timeMemberCard').show();
		$('#countMemberCard').hide();
		$('#memberCardType').text('时效卡');
		$('#memberCardGmtStart').text(formatTime1(row.gmtStart));
		$('#memberCardGmtEnd').text(formatTime1(row.gmtEnd));
	} else if (row.cardType == 1) {
		$('#timeMemberCard').hide();
		$('#countMemberCard').show();
		$('#memberCardType').text('次数卡');
		$('#memberCardTotleTime').text(row.totleTime);
		$('#memberCardUseTime').text(row.totleTime - row.useTime);
	}

	$('#memberCardName').text(row.cardName);
	$('#gmtCreate').text(formatTime1(row.gmtCreate));
	$('#gmtModify').text(formatTime1(row.gmtModify));

	$('#dlgMessage').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;会员卡信息");
}