var dateStart = '';
var dateEnd = '';
var payState = '';
var userIdSearch = '';

function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
	// $('.pay-type1').hide();
	//	login();
	$('#payCode').focus();
	//	$('#payCode').focus(function() {
	//		$(this).val('');
	//	});
	//	document.onkeydown = function(e) {
	//		var ev = document.all ? window.event : e;
	//		if (ev.keyCode == 13) {
	//			if ($('#payCode').is(":focus")) {
	//				payCode();
	//				$('#payCode').blur();
	//			}
	//		}
	//	}
	$('#dg').datagrid({
		onLoadSuccess: function(data) {
			if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
				relogin();
			}
			$('#dg12345').datagrid('doCellTip', {
				onlyShowInterrupt: false, //是否只有在文字被截断时才显示tip，默认值为false             
				position: 'bottom', //tip的位置，可以为top,botom,right,left
				cls: {
					'background-color': '#FFF'
				}, //tip的样式D1EEEE
				delay: 100 //tip 响应时间
			});
			//图片弹出层
			//			$("a.popImage").fancybox({
			//				openEffect: 'elastic',
			//				closeEffect: 'elastic'
			//			});
		},
		onLoadError: function() {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '网络连接错误！');
		},
		onHeaderContextMenu: function(e, field) {
			e.preventDefault();
			if (!cmenu) {
				createColumnMenu();
			}
			cmenu.menu('show', {
				left: e.pageX,
				top: e.pageY
			});
		}
	});
	$('#inputRemSure').attr({
		//		'data-type': '',
		// 'data-phone': '',
		'data-start': '',
		'data-end': ''
	});
	$('#hideDiv').hide();
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
		// $('#paySearch').val(data.phone);
		payState = 1;
		paySearch(data.userId, '', '');
		userIdSearch = data.userId;
	} else {
		if (data.ERROR == '未登录') {
			loginTimeout();
			return;
		}
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码');
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

function loginBack(data) {
	data = eval('(' + data + ')');
	if (data.STATUS) {
		//		localStorage.setItem("name", data.accountId);
		//		localStorage.setItem("pwd", hex_md5($("#user_pwd").val()));
		//		location.href = 'indexAll.html';
		console.log(data);
		//		payCode();
	} else {
		console.log(data.INFO);
	}
}

$('#payKind').combobox({
	onChange: function(n) {
		switch (n) {
			case '储值消费':
				payState = 1;
				$('.pay-type1').show();
				$('#payCode').focus();
				paySearch(userIdSearch, dateStart, dateEnd);
				break;
			case '现金消费':
				payState = 0;
				$('.pay-type1').hide();
				paySearch(userIdSearch, dateStart, dateEnd);
				break;
			default:
				payState = '';
				$('.pay-type1').show();
				paySearch(userIdSearch, dateStart, dateEnd);
				break;
		}
	}
});

// $('#paySearchSubmit').on('click', function() {
// 	var uid = '';
// 	if (payState == 1) {
// 		uid = userIdSearch;
// 	}

// 	//	var startDate = $('#startDate').val();
// 	//	var endDate = $('#endDate').val();
// 	$('#inputRemSure').attr({
// 		//		'data-type': payState,
// 		// 'data-phone': phone,
// 		'data-start': dateStart,
// 		'data-end': dateEnd
// 	});
// 	paySearch(uid, dateStart, dateEnd);
// })

function onStart(date) {
	dateStart = date + ' 00:00:00';
	paySearch(userIdSearch, dateStart, dateEnd);
};

function onEnd(date) {
	dateEnd = date + ' 23:59:59';

	paySearch(userIdSearch, dateStart, dateEnd);
};

function compareDate(ds, de) {
	//	console.log(ds);
	//	console.log(de);
	if (ds == '' || de == '') {
		return false;
	} else {
		return ((new Date(ds.replace(/-/g, "\/"))) > (new Date(de.replace(/-/g, "\/"))));
	}
}

function paySearch(uid, startDate, endDate) {
	// console.log(phone);
	if (compareDate(startDate, endDate)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '结束时间必须小于或等于起始时间！');
		return false;
	}
	var data = {};
	var today = new Date();
	data.gmtStart = '0000-00-00 00:00:00';
	data.gmtEnd = formatTime(today) + ':00';
	// if (!startDate) {
	// 	data.gmtStart = '0000-00-00 00:00:00';
	// 	data.gmtEnd = endDate;
	// }
	// if (!endDate) {
	// 	data.gmtStart = startDate;
	// 	data.gmtEnd = formatTime(today) + ':00';
	// }
	if (startDate) {
		data.gmtStart = startDate;
	}
	if (endDate) {
		data.gmtEnd = endDate;
	}
	if (payState == 1) {
		data.userId = uid;
	}
	data.payType = payState;
	$('#dg').datagrid('load', data);
}

function formatDouble(value) {
	return value.toFixed(2);
}

function formatMost(value) {
	var content = value;
	if (value == '' || !value) return '';
	if (content.length > 8) {
		content = content.substring(0, 8) + '...';
	}
	return content;
}

function formatTime(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd hh:mm");
}

function formatType(value) {
	if (value == 1) {
		return '储值消费';
	} else {
		return '现金消费';
	}
}

function checkShow(user, item, real, should, type, time, remark) {
	$('#dlgCheck').dialog('open');
	$('#checkReal').text(real.toFixed(2));
	$('#checkShould').text(should.toFixed(2));
	if (remark == 'undefined') {
		remark = '';
	}
	if (type == 1) {
		$('.dlg-type1').show();
		$('.dlg-type0').hide();
	} else {
		$('.dlg-type0').show();
		$('.dlg-type1').hide();
	}
	//	$('#checkMan').text(makerName);
	$('#checkItem').html(item);
	$('#checkTime').text(time);
	$('#checkName').text(user);
	$('#checkRemark').html(remark);
}

$('#checkSure').on('click', function() {
	$('#dlgCheck').dialog('close');
})