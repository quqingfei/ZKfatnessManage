$(function() {
	document.onkeydown = function(e) {
		var ev = document.all ? window.event : e;
		if (ev.keyCode == 13) {
			login();
		}
		if (ev.keyCode == 27) {
			$('.login-error').hide();
			$('.box-background').hide();
		}
	}
	if (!!document.cookie) {
		var userName = document.cookie;
		$('#userId').val(unescape(userName.split("=")[1]));
	}

});

$('#loginSubmit').on('click', function() {
	login();
});

function errorMsgShow(msg) {
	$('.login-error-content').text(msg)
	$('.login-error').show();
	$('.box-background').show();
}

function checkForm() {
	var userId = $('#userId').val();
	var userPass = $('#userPass').val();
	if (userId == '') {
		// errorMsgShow('账号不能为空！');
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '账号不能为空！');
		return false;
	}
	if (userPass == '') {
		// errorMsgShow('密码不能为空！');
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '密码不能为空！');
		return false;
	}
	return true;
}

$('#boxClose').on('click', function() {
	$('.login-error').hide();
	$('.box-background').hide();
});


function login() {
	if (checkForm()) {
		var userId = $('#userId').val();
		var userPass = $('#userPass').val();
		var userPassMD5 = hex_md5(userPass);
		$.post('loginAction!login.zk', {
			user_id: userId,
			user_pwd: userPassMD5
		}, function(data) {
			// data = eval('(' + data + ')');
			if (data.STATUS) {
				document.cookie = "zk_name=" + escape(userId);
				localStorage.setItem("name", data.accountId);
				localStorage.setItem("chat", data.allowChat);
				localStorage.setItem("pwd", $("#userPass").val());
				localStorage.removeItem("auths");
				if (data.auths) {
					localStorage.setItem("auths", data.auths);
				}
				location.href = 'indexAll.html';
			} else {
				// errorMsgShow(data.INFO);
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}
}

function ajaxData(url, data, callBack) {
	$.ajax({
		url: url,
		crossDomain: true,
		//cache: false,
		dataType: 'jsonp',
		type: 'POST',
		data: data,
		jsonpCallback: callBack
	});
}

function postData(url, data, callBack) {
	$.post(url, data, callBack);
}