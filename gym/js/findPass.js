function rightInfo(id) {
	$('#' + id).siblings('.regist-info').remove();
	var div = '<div class="regist-info regist-right"><img src="images/regist_right.png" alt=""></div>';
	$('#' + id).after(div);
}

function wrongInfo(id, info) {
	$('#' + id).siblings('.regist-info').remove();
	var div = '<div class="regist-info"><img src="images/regist_wrong.png" alt="">' + info + '</div>';
	$('#' + id).after(div);
}

function warnInfo(id, info) {
	$('#' + id).siblings('.regist-info').remove();
	var div = '<div class="regist-info"><img src="images/regist_warn.png" alt="">' + info + '</div>';
	$('#' + id).after(div);
}

function isTelephone(obj) { //手机号正则判断
	var pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
	if (pattern.test(obj)) {
		return true;
	} else {
		return false;
	}
}
var phoneCheck;
$('#phone').focus(function() {
	warnInfo('phone', '请输入11位手机号码。')
})
$('#phone').blur(function() {
	var data = $('#phone').val();
	if (!data) {
		wrongInfo('phone', '手机号不能为空。');
		phoneCheck = false;
		return;
	}
	if (!isTelephone(data)) {
		wrongInfo('phone', '手机号格式不正确。');
		phoneCheck = false;
		return;
	}
	$.post('loginAction!hasPhone.zk', {
		adminPhone: data
	}, function(data) {
		// msgLoading('close');
		if (data.STATUS) {
			phoneCheck = false;
			wrongInfo('phone', '此手机号并未注册健身房。');
		} else {
			phoneCheck = true;
			rightInfo('phone');
		}
	}, 'json');
	// rightInfo('phone');
})

$('#userPass1').focus(function() {
	warnInfo('userPass1', '长度为6-18位的字母、数字。');
})

$('#userPass1').blur(function() {
	var data = $('#userPass1').val();
	var pattern = /^[a-zA-Z0-9]+$/;
	if (!data) {
		wrongInfo('userPass1', '密码不能为空。');
		return;
	}
	if (!pattern.test(data)) {
		wrongInfo('userPass1', '密码仅可包含数字、字母。');
		return;
	}
	if (data.length > 18 || data.length < 6) {
		wrongInfo('userPass1', '密码长度不正确，请保证为6-18位。');
		return;
	}
	rightInfo('userPass1');
})

$('#userPass2').focus(function() {
	warnInfo('userPass2', '请确认密码。')
})

$('#userPass2').blur(function() {
	var data = $('#userPass1').val();
	var data2 = $('#userPass2').val();
	if (!data2) {
		wrongInfo('userPass2', '密码不能为空。');
		return;
	}
	if (data != data2) {
		wrongInfo('userPass2', '两次密码不相同，请确认。');
		return;
	}
	rightInfo('userPass2');
})
$('#codeGet').on('click', function() {
	if (phoneCheck) {
		codeGet();
	}
})

function codeGet() {
	var phone = $('#phone').val();
	if (!phone) {
		wrongInfo('phone', '手机号不能为空。');
		return;
	}
	if (!isTelephone(phone)) {
		wrongInfo('phone', '手机号格式不正确。');
		return;
	}

	$.getJSON('loginAction!smsCodeForPwd.zk', {
		phone: phone
	}, function(data) {
		if (data.STATUS) {
			$('#btn-hover div').show();
			var count = 60;
			var a = setInterval(function() {
				$('#codeGet').text(count + '秒后重新获取');
				if (count == 0) {
					$('#btn-hover div').hide();
					$('#codeGet').text('点击获取验证码');
					clearInterval(a);
				} else {
					count--;
				}
			}, 1000)
		}
	});
}

$('#codePass').focus(function() {
	warnInfo('btn-hover', '请输入6位验证码。')
})

$('#codePass').blur(function() {
	var data = $('#codePass').val();
	if (!data) {
		wrongInfo('btn-hover', '验证码不能为空。');
		return;
	}
	if (data.length != 6) {
		wrongInfo('btn-hover', '验证码位数不正确。');
		return;
	}
	// $.getJSON('loginAction!checkResetCode.zk', {
	// 	phone: $('#phone').val(),
	// 	code: data
	// }, function(data) {
	// 	if (!data.STATUS) {
	// 		wrongInfo('btn-hover', '验证码错误!');
	// 		$("#codePass").focus();
	// 		return;
	// 	} else {
	// 		rightInfo('btn-hover');
	// 	}
	// });
	rightInfo('btn-hover');
})

$('#finish').on('click', function() {
	if ($('.regist-right').length == 4) {
		msgLoading();
		var data = {};
		// data.loginName = $('#userName').val();
		data.pwd = $('#userPass1').val();
		// data.gymName = $('#gymName').val();
		// data.businessNo = $('#license').val();
		// data.certification = $('#certification').val();
		data.phone = $('#phone').val();
		data.code = $('#codePass').val();
		// $.getJSON('loginAction!checkResetCode.zk', {
		// 	phone: data.phone,
		// 	code: data.code
		// }, function(datas) {
		// 	if (!datas.STATUS) {
		// 		wrongInfo('finish', datas.INFO);
		// 		return;
		// 	} else {
		$.post('loginAction!resetPwd.zk', data, function(data) {
			msgLoading('close');
			if (data.STATUS) {
				$('.regist-cont').hide();
				$('.succ').show();
			} else {
				wrongInfo('finish', data.INFO);
			}
		}, 'json');
		// 	}
		// });

	} else {
		wrongInfo('finish', '请先完善信息。');
	}
})

if (window.zk_Win_X()) {
	new TitleBar("zk_title", "#333333", "燃脂部落健身场所管理系统", "./css/images/logo.png");
} else {
	alert(00);
	console.log('不在应用程序中');
}