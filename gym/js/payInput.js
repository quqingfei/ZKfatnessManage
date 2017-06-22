var userIdPay;
//var makerName;
//var makerId;
var payState = 1;

$(function() {
	$('#payCode').focus();
	//	login();
	//	$.post('../ngym/GymEmployeesAction!list.zk', {
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
	//			$('#payMaker').combobox({
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
	//	document.onkeydown = function(e) {
	//		var ev = document.all ? window.event : e;
	//		if (ev.keyCode == 13) {
	//			if ($('#payCode').is(":focus")) {
	//				payCode();
	//				$('#payCode').blur();
	//			}
	//		}
	//	}

});
$('#payCode').focus(function() {
	$('#payCode').val('');
	document.onkeydown = function(e) {
		var ev = document.all ? window.event : e;
		if (ev.keyCode == 13) {
			//			payCode();
			$('#payCode').blur();
		}
	}
});
$('#payCode').blur(function() {
	if ($('#payCode').val()) {
		payCode();
	}
});
$('#payKind').combobox({
	onChange: function(n) {
		if (n == '储值消费') {
			payState = 1;
			$('.pay-code').show();
			$('.pay-user').show();
			$('.pay-phone').show();
			//			$('.pay-saler').hide();
		} else {
			payState = 0;
			$('.pay-code').show();
			$('.pay-user').hide();
			$('.pay-phone').hide();
			//			$('.pay-saler').show();
		}
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

function payCode() {
	//	var code = '116151381599386260';
	var code = $('#payCode').val();
	if (code == '' || code.length > 18) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '条码不正确！');
	} else {
		//		ajaxData('http://192.168.1.250:8080/fatburn/gym/userAction!getUserByCode.zk', {
		//			code: code
		//		}, 'payCodeBack')
		postData('userAction!getUserByCode.zk', {
			code: code
		}, payCodeBack)
	}
}

function payCodeBack(data) {
	data = eval('(' + data + ')');
	if (data.STATUS) {
		console.log(data);
		$('#payName').val(data.userName);
		$('#payMobile').val(data.phone);
		userIdPay = data.userId;
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
	var code = $('#payCode').val();
	var should = $('#payVolumeShould').val();
	var remark = $('#payRemark').val();
	var item = $('#payItem').val();
	var real = $('#payVolumeReal').val();
	var regs = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
	if (code == '' && payState == 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
		return false;
	};
	if (should == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '应付金额不能为空！');
		return false;
	};
	if (!regs.test(should)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '应付金额为数字且大于0！');
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
	if (item == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '商品名称不能为空！');
		return false;
	};
	if (item.length > 32) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '商品名称最多32个字！');
		return false;
	};
	if (remark.length > 20) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注最多20个字！');
		return false;
	};
	return true;
}

$('#inputSure').on('click', function() {
	msgLoading();
	clearSpecialStr('payForm');
	var real = $('#payVolumeReal').val();
	var should = $('#payVolumeShould').val();
	var remark = $('#payRemark').val();
	var item = $('#payItem').val();

	postData('../ngym/GymUserStoreAction!expense.zk', {
		userId: userIdPay,
		pay: should,
		shouldPay: should,
		realPay: real,
		remark: remark,
		//		salesPersonId: makerId,
		payType: payState,
		goods: item
	}, submitBack);
	//		'http://192.168.1.250:8080/fatburn/ngym/GymUserpayAction!pay.zk'
})

function clearForm() {
	$('#payVolumeReal').val('');
	$('#payVolumeShould').val('');
	$('#payRemark').val('');
	$('#payName').val('');
	$('#payMobile').val('');
	$('#payItem').val('');
}

$('#paySubmit').on('click', function() {
	if (checkForm()) {

		var real = $('#payVolumeReal').val();
		var should = $('#payVolumeShould').val();
		var remark = $('#payRemark').val().replace(/\n/g, "<br>");
		var name = $('#payName').val();
		var phone = $('#payMobile').val();
		var item = $('#payItem').val().replace(/\n/g, "<br>");
		if (payState == 1) {
			$('.dlg-1').hide();
			$('.dlg-0').show();
		}
		if (payState == 0) {
			$('.dlg-0').hide();
			$('.dlg-1').show();
		}
		$('#checkReal').text(real);
		$('#checkShould').text(should);
		//		$('#checkMan').text(makerName);
		$('#checkPhone').text(phone);
		$('#checkName').text(name);
		$('#checkRemark').html(remark);
		$('#checkItem').html(item);
		$('#dlgCheck').dialog('open');
	}

})

function submitBack(data) {
	data = eval('(' + data + ')');
	$('#dlgCheck').dialog('close');
	msgLoading('close');
	if (data.STATUS) {
		//		console.log(data);
		//		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;操作成功', data.INFO);
		//		clearForm();
		//		$('#stored', window.parent.document).trigger('click');
		$('#payRecord', window.parent.document).trigger('click');
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