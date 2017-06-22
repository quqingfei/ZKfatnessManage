// var showInfo = new Object();
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

$('#userName').focus(function() {
	warnInfo('userName', '长度为4-18位的字母、数字。')
})

$('#userName').blur(function() {
	var loginName = $('#userName').val();
	var pattern = /^[a-zA-Z0-9]+$/;

	if (!loginName) {
		wrongInfo('userName', '账号不能为空。');
		return;
	}
	if (!pattern.test(loginName)) {
		wrongInfo('userName', '账号请用字母+数字，不能用中文。');
		return;
	}
	if (loginName.length > 18 || loginName.length < 4) {
		wrongInfo('userName', '账号长度不正确，请保证为4-18位。');
		return;
	}
	$.post('loginAction!hasRegist.zk', {
		loginName: loginName
	}, function(data) {
		// msgLoading('close');
		if (data.STATUS) {
			rightInfo('userName');
		} else {
			wrongInfo('userName', data.INFO);
		}
	}, 'json');
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

$('#gymName').blur(function() {
	var data = $('#gymName').val();
	if (!data) {
		wrongInfo('gymName', '场馆名称不能为空。');
		return;
	}
	rightInfo('gymName');
})

$('#license').blur(function() {
	var data = $('#license').val();
	if (!data) {
		wrongInfo('license', '营业执照注册编号不能为空。');
		return;
	}
	rightInfo('license');
})

$('#phone').focus(function() {
	warnInfo('phone', '请输入11位手机号码。')
})
var phoneCheck = false;
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
			phoneCheck = true;
			rightInfo('phone');
		} else {
			phoneCheck = false;
			wrongInfo('phone', data.INFO);
		}
	}, 'json');
})

function isTelephone(obj) { //手机号正则判断
	var pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
	if (pattern.test(obj)) {
		return true;
	} else {
		return false;
	}
}

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

	$.getJSON('loginAction!smsCode.zk', {
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
	rightInfo('btn-hover');
})

$('#finish').on('click', function() {
	if ($('.regist-right').length == 8) {
		msgLoading();
		var data = {};
		data.loginName = $('#userName').val();
		data.pwd = $('#userPass1').val();
		data.gymName = $('#gymName').val();
		data.businessNo = $('#license').val();
		data.certification = $('#certification').val();
		data.adminPhone = $('#phone').val();
		data.code = $('#codePass').val();
		$.post('loginAction!regist.zk', data, function(data) {
			msgLoading('close');
			if (data.STATUS) {
				location.href = "check.html";
			} else {
				wrongInfo('finish', data.INFO);
			}
		}, 'json');
	} else {
		wrongInfo('finish', '请先完善信息。');
	}
})

function uploadImage() {
	//alert('upload');
	var viewFiles = document.getElementById("licensePic");
	//是否为图片类型            
	if (/image\/\w+/.test(viewFiles.files[0].type)) {
		//最大图片文件大小 500KB
		msgLoading();
		var imgSizeLimit = 500 * 1024;
		if (viewFiles.files[0].size <= imgSizeLimit) {
			//上传图片
			$("#title_img_form").ajaxSubmit({
				type: 'post',
				url: '../file/FileCenter!uploadImage2.zk',
				success: function(data) {
					msgLoading('close');
					data = $.parseJSON(data);
					if (data.name) {

						// alert(data.name);
						var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
						$("#licenseShow").attr("src", imgURL);
						var imgObj = [{
							"name": '营业执照',
							"image": data.name
						}];
						$('#certification').val(JSON.stringify(imgObj));
						rightInfo('camButton');
					} else {
						//alert("上传图片出错！");
						wrongInfo('camButton', '上传图片出错!');
					}
					$("#title_img_form").resetForm();
				},
				error: function(XmlHttpRequest, textStatus, errorThrown) {
					//alert("error");
					msgLoading('close');
					wrongInfo('camButton', '网络异常，请稍后重试！');
				}
			});
		} else {
			msgLoading('close');
			//alert("图片大小不能超过" + (imgSizeLimit / 1024) + "KB!");
			wrongInfo('camButton', "图片大小不能超过" + (imgSizeLimit / 1024) + "KB!");
		}
	} else {
		//alert('请选择图片类型的文件!');
		wrongInfo('camButton', '请选择图片类型的文件!');
	}
}

if (window.zk_Win_X()) {
	new TitleBar("zk_title", "#333333", "燃脂部落健身场所管理系统", "./css/images/logo.png");
} else {
	alert(00);
	console.log('不在应用程序中');
}