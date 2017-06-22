var dateStart = '';
var dateEnd = '';
var userIdSearch = '';

function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
	//	login();
	$('#storeCode').focus();
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
	$('#inputRemSure').attr({
		// 'data-phone': '',
		'data-start': '',
		'data-end': ''
	});
	$('#hideDiv').hide();
});

function storeCode() {
	//	var code = '116151381599386708';
	var code = $('#storeCode').val();
	if (code == '') {
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

function storeCodeBack(data) {
	data = eval('(' + data + ')');
	if (data.STATUS) {
		// $('#storeSearch').val(data.phone);
		userIdSearch = data.userId;
		storeSearch(data.userId, '', '');
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
		//		storeCode();
	} else {
		console.log(data.INFO);
	}
}

function searchBtn() {
	// var phone = $('#storeSearch').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var startDatenum = parseInt(startDate.replace(/\-/g, "").replace(/\ /g, ""));
	var endDatenum = parseInt(endDate.replace(/\-/g, "").replace(/\ /g, ""));
	if (startDatenum > endDatenum) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '结束日期必须大于起始日期!');
		return false;
	}
	storeSearch(userIdSearch, dateStart, dateEnd);
}
$('#endDate').focus(function() {
		setTimeout(function() {
			var wW = $(window).width();
			var sW = null;
			var settime = setInterval(function() {
				if ($('#laydate_box')) {
					sW = $('#laydate_box').offset().left;
					if (sW - wW < 0) {
						$('#laydate_box').css('left', sW - (wW - sW) + 53 + 'px');
					}
					clearInterval(settime);
				}
			}, 10)
		}, 200)

	})
	//标注
// function formatRemark(value, row, index) {
// 	var content = value;
// 	if (value == '' || !value) return '';
// 	if (content.length > 8) {
// 		content = content.substring(0, 8) + '...';
// 	}
// 	return content;
// }

// $('#startDate').datebox({
// 	onSelect: function(date) {
// 		dateStart = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ' 00:00:00';
// 		storeSearch(userIdSearch, dateStart, dateEnd);
// 	}
// });

function onStart(date) {
	dateStart = date + ' 00:00:00';
	// storeSearch(userIdSearch, dateStart, dateEnd);
}

function onEnd(date) {
	dateEnd = date + ' 23:59:59';
	// storeSearch(userIdSearch, dateStart, dateEnd);
}

// $('#endDate').datebox({
// 	onSelect: function(date) {
// 		dateEnd = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ' 23:59:59';
// 		storeSearch(userIdSearch, dateStart, dateEnd);
// 	}
// });

function compareDate(ds, de) {
	console.log(ds);
	console.log(de);
	if (ds == '' || de == '') {
		return false;
	} else {
		return ((new Date(ds.replace(/-/g, "\/"))) > (new Date(de.replace(/-/g, "\/"))));
	}
}

function storeSearch(uid, startDate, endDate) {
	if (compareDate(startDate, endDate)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请正确选择时间！');
	} else if (startDate == '' || endDate == '') {
		$('#dg').datagrid('load', {
			userId: uid
		});
	} else {
		$('#dg').datagrid('load', {
			userId: uid,
			gmtStart: startDate,
			gmtEnd: endDate
		});
	}
}

function formatDouble(value) {
	return value.toFixed(2);
}

function formatTime(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd hh:mm");
}

function checkShow(user, phone, real, should, time, remark) {
	$('#dlgCheck').dialog('open');
	$('#checkReal').text(real.toFixed(2));
	$('#checkShould').text(should.toFixed(2));
	//	if (makerName == 'undefined') {
	//		makerName = '无';
	//	}
	//	$('#checkMan').text(makerName);
	$('#checkPhone').text(phone);
	$('#checkTime').text(time);
	$('#checkName').text(user);
	$('#checkRemark').html(remark);
}