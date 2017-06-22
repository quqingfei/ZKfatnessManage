function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
var userIdSearch;
$(function() {
	//	login();
	//	show();
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
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '出错啦');
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
	$('#balanceCode').focus();

	// $('#inputBalSure').attr({
	// 	'data-phone': ''
	// });
	$('#hideDiv').hide();
});

$('#balanceCode').focus(function() {
	$('#balanceCode').val('');
	document.onkeydown = function(e) {
		var ev = document.all ? window.event : e;
		if (ev.keyCode == 13) {
			//			balanceCode();
			$('#balanceCode').blur();
		}
	}
});

$('#balanceCode').blur(function() {
	if ($('#balanceCode').val()) {
		balanceCode();
	}
});

function balanceCode() {
	//	var code = '116151381599386260';
	var code = $('#balanceCode').val();
	if (code == '' || code.length > 18) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '条码不正确！');
	} else {
		//		ajaxData('http://192.168.1.250:8080/fatburn/gym/userAction!getUserByCode.zk', {
		//			code: code
		//		}, 'balanceCodeBack')
		postData('userAction!getUserByCode.zk', {
			code: code
		}, balanceCodeBack)
	}
}

function balanceCodeBack(data) {
	data = eval('(' + data + ')');
	if (data.STATUS) {
		// $('#balanceSearch').val(data.phone);
		userIdSearch = data.userId;
		balanceSearch(data.userId);
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码！');
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
		//		balanceCode();
	} else {
		console.log(data.INFO);
	}
}

$('#balanceSearchSubmit').on('click', function() {
	// var phone = $('#balanceSearch').val();
	//	var startDate = $('#startDate').val();
	//	var endDate = $('#endDate').val();
	// $('#inputBalSure').attr({
	// 	'data-phone': phone,
	// });
	balanceSearch(userIdSearch);
})

function balanceSearch(uid) {
	$('#dg').datagrid('load', {
		userId: uid
	});
}

function formatBalance(value, row) {
	var balance = row.totleStore - row.useStore;
	return balance.toFixed(2);
}

function formatDouble(value) {
	return value.toFixed(2);
}

function formatControl(value, row) {
	var change = '<a href="javascript:;" id="balanceChange" onclick="balanceChange(\'' + value + '\',' + row.useStore + ',' + row.totleStore + ')">修改余额</a>';
	var control = '<div class="balance-control">' + change + '</div>';
	return control;
}

function balanceChange() {
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择需要修改的余额！');
		return;
	}
	var balance = row.totleStore - row.useStore;
	$('#dlgChange').dialog('open');
	$('#inputBalance').val(balance.toFixed(2));
	$('#inputBalSure').attr({
		'data-uid': row.userId,
		'data-use': row.useStore,
		'data-totle': row.totleStore
	});

}
$('#inputBalSure').on('click', function() {
		var uid = $('#inputBalSure').attr('data-uid');
		var totles = $('#inputBalSure').attr('data-totle');
		var uses = $('#inputBalSure').attr('data-use');
		var value = $('#inputBalance').val()
		var totleNow = parseFloat(uses) + parseFloat($('#inputBalance').val());
		if (value.trim() == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '余额不能为空！');
			return false;
		} else if (isNaN(value) || value < 0) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入大于零的数字！');
			return false;
		} else {
			$('#dlgChange').dialog('close');

			postData('../ngym/GymUserStoreAction!update.zk', {
				//		id: uid,
				//		status: bor,
				//		remark: rem
				//	}, 'remarkBack');
				userId: uid,
				useStore: uses,
				totleStore: totleNow
			}, balanceBack);
		}
	})
	//function remarkChange(uid, rem) {
	//	if (rem == '') {
	//		rem = ' ';
	//	}
	//	postData('../ngym/GymUserStoreAction!remarkStoreRecord.zk', {
	//		//		id: uid,
	//		//		status: bor,
	//		//		remark: rem
	//		//	}, 'remarkBack');
	//		id: uid,
	//		remark: rem
	//	}, remarkBack);
	//}

function balanceBack(data) {
	data = eval('(' + data + ')');
	// console.log(data);
	if (data.STATUS) {
		//		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;成功！', data.INFO);
		// var phone = $('#inputBalSure').attr('data-phone');
		balanceSearch(userIdSearch);
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
	}
}