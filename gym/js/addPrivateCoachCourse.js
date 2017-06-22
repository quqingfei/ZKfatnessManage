function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
var userIdBorrow = null;
var dutyId;
var dutySel;
var priceNow = 0;
var lessonId = '';
$(function() {
	$('#hideDiv').hide();
	$('#studentCode').focus();

	$.post('../ngym/GymEmployeesAction!listAllCoach.zk', {
	}, function(data) {
		if (data.ERROR == '未登录') {
			loginTimeout();
			//			login();
			return;
		}
		if (data.STATUS) {
			var rows = data.rows;
			var makers = [];
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				var maker = {
					"id": row.userId,
					"duty": row.realName
				};
				makers.push(maker);
			}
			$('#health').combobox({
				valueField: 'id',
				textField: 'duty',
				data: makers,
				onSelect: function(rec) {
					dutySel = rec.duty;
					dutyId = rec.id;
				}
			});

		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');

});
var lessonInfo = [];
$('#lessonKind').combobox({
	onSelect: function(rec) {
		priceNow = 0;
		lessonId = '';
		$('#storeManCount').val('');
		shouldPay();
		if (rec.value == 0) {
			$('#storeManCount').attr('readonly', 'true');
			$('#storeManCount').attr('disabled', 'true');
			// $('#storeVolumeShould').attr('disabled', 'true');
		} else {
			$('#storeManCount').removeAttr('readonly');
			$('#storeManCount').removeAttr('disabled');
			// $('#storeVolumeShould').removeAttr('disabled');
		}
		$.post('../ngym/GymUserCoachAction!listGroupCourse.zk', {
			type: rec.value
		}, function(data) {
			if (data.ERROR == '未登录') {
				loginTimeout();
				//			login();
				return;
			}
			if (data.STATUS) {
				var lessons = data.gymGroupCourses;
				lessonInfo = lessons;
				var names = [];
				for (var i = 0; i < lessons.length; i++) {
					var lesson = lessons[i];
					var n = {
						"text": lesson.couserName,
						"value": i
					}
					names.push(n);
				}
				$('#lessonName').combobox({
					valueField: 'value',
					textField: 'text',
					data: names,
					onSelect: function(rec) {
						lessonCoach(rec.value);
					}
				})
				$('#lessonName').combobox('select', '0');
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}
})
var coachInfo = [];

function lessonCoach(n) {
	$('#storeManCount').val('');
	if ($('#storeManCount').attr('readonly')) {
		$('#storeManCount').val(lessonInfo[n].count);
	}
	var coachs = eval('(' + lessonInfo[n].coachInfo + ')');
	coachInfo = coachs;
	lessonId = lessonInfo[n].id;
	var names = [];
	for (var i = 0; i < coachs.length; i++) {
		var coach = coachs[i];
		var n = {
			"text": coach.name,
			"value": i
		}
		names.push(n);
	}
	$('#roleSel').combobox({
		valueField: 'value',
		textField: 'text',
		data: names,
		onSelect: function(rec) {
			priceNow = coachInfo[rec.value].price;
			dutyId = coachInfo[rec.value].id;
			shouldPay();
		}
	})
	$('#roleSel').combobox('select', '0');
}

function numCheck() {
	var keyCode = event.keyCode;
	if ((keyCode >= 96 && keyCode <= 105 || keyCode >= 48 && keyCode <= 57 || keyCode == 8)) {
		event.returnValue = true;
	} else {
		event.returnValue = false;
	}
}

// $('#storeManCount').blur(function() {
// 	shouldPay();
// })

function shouldPay() {
	var times = $('#storeManCount').val();
	if (times > 100) {
		$('#storeManCount').val(100);
		times = 100;
	}
	if (times == '') times = 0;
	if ($('#lessonKind').combobox('getValue') == 1) {
		var should = priceNow * times
		$('#storeVolumeShould').val(should);
	} else {
		$('#storeVolumeShould').val(priceNow);
	}

}

$('#studentCode').focus(function() {
	$('#studentCode').val('');
	document.onkeydown = function(e) {
		var ev = document.all ? window.event : e;
		if (ev.keyCode == 13) {
			$('#studentCode').blur();
		}
	}
});
$('#studentCode').blur(function() {
	if ($('#studentCode').val()) {
		borrowCode();
	}
});

function borrowCode() {
	//	var code = '116151381599386708';
	var code = $('#studentCode').val();
	postData('userAction!getUserByCode.zk', {
		code: code
	}, borrowCodeBack)
}

function borrowCodeBack(data) {
	data = eval('(' + data + ')');
	if (data.STATUS) {
		// console.log(data);
		$('#studentName').val(data.userName);
		$('#studentMobile').val(data.phone);
		userIdBorrow = data.userId;
	} else {
		if (data.ERROR == '未登录') {
			loginTimeout();
			return;
		}
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码！');
	}
}
// var self = this;
var fromSend = {};
$('#storeManSubmit').on('click', function() {
	if (checkForm()) {
		$('#checkName').text($('#studentName').val());
		$('#checkMan').text($('#roleSel').combobox('getText'));
		$('#checkLessonKind').text($('#lessonKind').combobox('getText'));
		$('#checkLesson').text($('#lessonName').combobox('getText'));
		$('#healthName').text($('#health').combobox('getText'))
		$('#checkShould').text(fromSend.shouldPay);
		$('#checkReal').text(fromSend.realPay);
		$('#checkCount').text(fromSend.count);
		$('#checkRemark').text(fromSend.remark);
		$('#dlgManCheck').dialog('open');
	}
})

$('#inputManSure').on('click', function() {
	msgLoading();
	$.ajax({
		type: 'POST',
		url: '../ngym/GymGroupCourseManageAction!buyGroupCourse.zk',
		data: fromSend,
		success: function(data) {
			msgLoading('close');
			// $('#inputManSure').attr('disabled', 'disabled');
			data = eval('(' + data + ')');
			if (data.STATUS) {
				$('#privateCourseMange', window.parent.document).trigger('click');
				event.cancelBubble = true;
				return false;
			} else {
				if (data.ERROR == '未登录') {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}
	});
})

$('#inputManCancel').on('click', function() {
	$('#dlgManCheck').dialog('close');
})

function checkForm() {
	fromSend = {
		userId: userIdBorrow,
		// realName: $("#studentName").val(),
		// userPhone: $("#studentMobile").val(),
		//			coach: dutySel,
		saleId: $('#health').combobox('getValue'),
		courseId: lessonId,
		coachId: dutyId,
		count: parseInt($('#storeManCount').val()),
		shouldPay: $('#storeVolumeShould').val(),
		realPay: $('#storeVolumeReal').val(),
		remark: $('#storeRemark').val()
	}
	var code = $.trim($('#studentName').val()).length;
	var reg = new RegExp("^[0-9]\d*$");
	if (code <= 0) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
		return false;
	}
	if (!fromSend.saleId) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择健康顾问！');
		return false;
	}
	if (!fromSend.courseId) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择课程！');
		return false;
	}
	if (fromSend.coachId == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择教练！');
		return false;
	}
	if (fromSend.count <= 0 || isNaN(fromSend.count) || fromSend.count > 100) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '课程次数应为大于0小于100的整数！');
		return false;
	}
	if (fromSend.shouldPay.length <= 0 || isNaN(fromSend.shouldPay)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '应付金额不能为空且为数字！');
		return false;
	}
	if (fromSend.realPay.length <= 0 || isNaN(fromSend.realPay)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额不能为空且为数字！');
		return false;
	}

	if (fromSend.remark.length > 16) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注不能超过16个字！');
		return false;
	}
	return true;
}