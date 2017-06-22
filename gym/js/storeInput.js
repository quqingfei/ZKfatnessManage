var userIdStore;
//var makerName;
//操作人
//var makerId;
function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
	$('#storeCode').focus();
	//	$('#storeCode').focus(function() {
	//		$(this).val('');
	//	});
	//	login();
	//	$.post('http://192.168.1.250:8080/fatburn/ngym/GymEmployeesAction!list.zk', {
	//		page: 1,
	//		rows: 1000
	//	}, function(data) {
	//		if (data.STATUS) {
	//			var rows = data.rows;
	//			var makers = [];
	//			for (var i = 0; i < rows.length; i++) {
	//				var row = rows[i];
	//				var maker = {
	//					"id": row.userId,
	//					"name": row.realName
	//				};
	//				makers.push(maker);
	//			}
	//			$('#storeMaker').combobox({
	//				valueField: 'id',
	//				textField: 'name',
	//				data: makers,
	//				onSelect: function(rec) {
	//						makerName = rec.name;
	//						makerId = rec.id;
	//					}
	//			});
	//		} else {
	//			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
	//		}
	//	}, 'json');
});
$('#storeCode').focus(function() {
	$('#storeCode').val('');
	document.onkeydown = function(e) {
		var ev = document.all ? window.event : e;
		if (ev.keyCode == 13) {
			//			storeCode();
			$('#storeCode').blur();
		}
	}
});
$('#storeCode').blur(function() {
	if ($('#storeCode').val()) {
		storeCode();
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

function storeCode() {
	//	var code = '116151381599386708';
	var code = $('#storeCode').val();
	if (code == '' || code.length > 18) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '条码不正确！');
	} else {
		//		ajaxData('http://192.168.1.250:8080/fatburn/gym/userAction!getUserByCode.zk', {
		//			code: code
		//		}, 'storeCodeBack')
		postData('userAction!getUserByCode.zk', {
			code: code
		}, storeCodeBack)
	}
}

function storeCodeBack(data) {
	data = eval('(' + data + ')');
	if (data.STATUS) {
		// console.log(data);
		$('#storeName').val(data.userName);
		$('#storeMobile').val(data.phone);
		userIdStore = data.userId;
	} else {
		if (data.ERROR == '未登录') {
			loginTimeout();
			return;
		}
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
	//	ajaxData('http://192.168.1.250:8080/fatburn/gym/loginAction!login.zk', {
	//		user_id: userId,
	//		user_pwd: userPassMD5
	//	}, 'loginBack');
	postData('loginAction!login.zk', {
		user_id: userId,
		user_pwd: userPassMD5
	}, loginBack);
}

function checkForm() {
	var code = $('#storeCode').val();
	var should = $('#storeVolumeShould').val();
	var remark = $('#storeRemark').val();
	var real = $('#storeVolumeReal').val();
	var regs = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
	if (code == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
		return false;
	};
	if (should == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '充值额度不能为空！');
		return false;
	};
	if (!regs.test(should)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '充值额度为数字且大于0！');
		return false;
	};
	if (real == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额不能为空！');
		return false;
	};
	if (!regs.test(real)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额为数字且大于0！');
		return false;
	};
	if (remark.length > 20) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注最多20个字');
		return false;
	};
	return true;
}

$('#inputSure').on('click', function() {
	msgLoading();
	clearSpecialStr('storeForm');
	var real = $('#storeVolumeReal').val();
	var should = $('#storeVolumeShould').val();
	var remark = $('#storeRemark').val();

	postData('../ngym/GymUserStoreAction!store.zk', {
		userId: userIdStore,
		store: should,
		shouldPay: should,
		realPay: real,
		//		salesPersonId: makerId,
		remark: remark
	}, submitBack);
	//		'http://192.168.1.250:8080/fatburn/ngym/GymUserStoreAction!store.zk'
})

function clearForm() {
	$('#storeVolumeReal').val('');
	$('#storeVolumeShould').val('');
	$('#storeRemark').val('');
	$('#storeName').val('');
	$('#storeMobile').val('');
}

$('#storeSubmit').on('click', function() {
	if (checkForm()) {
		$('#dlgCheck').dialog('open');
		var real = $('#storeVolumeReal').val();
		var should = $('#storeVolumeShould').val();
		var remark = $('#storeRemark').val();
		var name = $('#storeName').val();
		var phone = $('#storeMobile').val();
		$('#checkReal').text(real);
		$('#checkShould').text(should);
		//		$('#checkMan').text(makerName);
		$('#checkPhone').text(phone);
		$('#checkName').text(name);
		$('#checkRemark').text(remark);
	}

})

function submitBack(data) {
	data = eval('(' + data + ')');
	msgLoading('close');
	$('#dlgCheck').dialog('close');
	if (data.STATUS) {
		//		console.log(data);
		//		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;操作成功', data.INFO);
		//		clearForm();
		// $('#stored', window.parent.document).trigger('click');
		$('#storeRecord', window.parent.document).trigger('click');
		event.cancelBubble = true;
		return false;
	} else {
		if (data.ERROR == '未登录') {
			loginTimeout();
			return;
		};
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
	}
}