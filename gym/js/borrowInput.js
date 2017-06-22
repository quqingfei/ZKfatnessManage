var userIdBorrow;

function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}

$(function() {
	//	login();

	$('#borrowCode').focus();

});
$('#borrowCode').focus(function() {
	$('#borrowCode').val('');
	document.onkeydown = function(e) {
		var ev = document.all ? window.event : e;
		if (ev.keyCode == 13) {
			//			borrowCode();
			$('#borrowCode').blur();
		}
	}
});
$('#borrowCode').blur(function() {
	if ($('#borrowCode').val()) {
		borrowCode();
	}
});

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

function borrowCode() {
	//	var code = '116151381599386708';
	var code = $('#borrowCode').val();
	postData('userAction!getUserByCode.zk', {
		code: code
	}, borrowCodeBack)
}

function borrowCodeBack(data) {
	data = eval('(' + data + ')');
	if (data.STATUS) {
		// console.log(data);
		$('#borrowName').val(data.userName);
		$('#borrowMobile').val(data.phone);
		userIdBorrow = data.userId;
	} else {
		if (data.ERROR == '未登录') {
			loginTimeout();
			return;
		};
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码！');
	}
}

function loginBack(data) {
	data = eval('(' + data + ')');
	if (data.STATUS) {
		console.log(data);
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
	}

}

function login() {
	var userId = 'UserTest';
	var userPass = '123456';
	var userPassMD5 = hex_md5(userPass);
	postData('loginAction!login.zk', {
		user_id: userId,
		user_pwd: userPassMD5
	}, loginBack);
}

$('#boxClose').on('click', function() {
	$('.borrow-error').hide();
	$('.box-background').hide();
})

$('#boxSubmit').on('click', function() {
	$('.borrow-error').hide();
	$('.box-background').hide();
})

$('#borrowSubmit').on('click', function() {
	if (checkForm()) {
		msgLoading();
		clearSpecialStr('borrowForm');
		var item = $('#borrowItem').val();
		var remark = $('#borrowRemark').val();
		var times = $('#borrowTimes').val();
		times = times+" 00:00:00";
		var type = $('#borrowKind').combobox('getValue');
		if (remark == '') {
			remark = '无';
		}
		if(times == ''){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '时间选择不能为空!');
		}
		postData('../ngym/GymUserBorrowAction!add.zk', {
			userId: userIdBorrow,
			borrow: item,
			remark: remark,
			expire: times,
			type: type
		}, submitBack);
	}
})

function submitBack(data) {
	msgLoading('close');
	data = eval('(' + data + ')');
	if (data.STATUS) {
		//		console.log(data);
		//		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;操作成功', data.INFO);
		//		$('#lease', window.parent.document).trigger('click');
		$('#borrowRecord', window.parent.document).trigger('click');
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

function checkForm() {
	var code = $('#borrowCode').val();
	var item = $('#borrowItem').val();
	var remark = $('#borrowRemark').val();
	if (code == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
		return false;
	}
	if (item == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '租赁物品不能为空！');
		return false;
	}
	if (item.length > 16) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '租赁物品最多16个字');
		return false;
	}
	if (remark.length > 20) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注最多20个字');
		return false;
	}
	return true;
}