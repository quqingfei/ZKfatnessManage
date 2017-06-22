var searchData;
var statusNow = 0;
var idNow = 'borrowOut';
var borrowType;

function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
	//	$('#dg').datagrid('load', {
	//		status: statusNow
	//	});
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
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '网络连接出错！');
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
	//	login();

	$('#hideDiv').hide();
});
$('#borrowCode').focus(function() {
	$('#borrowCode').val('');
	document.onkeydown = function(e) {
		var ev = document.all ? window.event : e;
		if (ev.keyCode == 13) {
			// borrowCode();
			$('#borrowCode').blur();
		}
	}
});
$('#borrowCode').blur(function() {
	if ($('#borrowCode').val()) {
		borrowCode();
	}

});
$('#borrowSearchKind').combobox({
	onSelect: function(rec) {
		borrowType = rec.label;
		var searchItem = $('#borrowSearchItem').val();
		$('#dg').datagrid('load', {
			status: statusNow,
			userId: searchData,
			borrow: searchItem,
			type: borrowType,
			realName:$('#serchShop').val()
		});
	}
})

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
	}, borrowBack)
}
function searchname(){
	var searchItem = $('#borrowSearchItem').val();
	$('#dg').datagrid('load', {
		status: $('.borrow-kind .action').attr('val'),
		userId: searchData,
		borrow: searchItem,
		type: borrowType,
		realName:$('#serchShop').val()
	});
}
$('#serchShop').keyup(function(event){
  if(event.keyCode ==13){
    var searchItem = $('#borrowSearchItem').val();
	$('#dg').datagrid('load', {
		status: $('.borrow-kind .action').attr('val'),
		userId: searchData,
		borrow: searchItem,
		type: borrowType,
		realName:$('#serchShop').val()
	});
  }
});
function borrowBack(data) {
	data = eval('(' + data + ')');
	if (data.STATUS) {
		// console.log(data);
		// $('#borrowSearchPhone').val(data.userId);
		searchData = data.userId;
		$('#dg').datagrid('load', {
			userId: searchData,
			status: statusNow
		});
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码！');
	}
}

$('#borrowSearchSubmit').on('click', function() {
	var searchItem = $('#borrowSearchItem').val();
	$('#dg').datagrid('load', {
		userId: searchData,
		borrow: searchItem,
		type: borrowType,
		realName:$('#serchShop').val()
	});
})

function formatKind(value) {
	switch (value) {
		case 1:
			return '储物柜';
			break;
		case 2:
			return '运动设备';
			break;
		case 0:
			return '其他';
			break;
		default:
			return '无';
			break;
	}
}

function formatStatus(value) {
	switch (value) {
		case 0:
			return "未归还";
			break;
		case 1:
			return "已归还";
			break;
		case 2:
			return "已丢失";
			break;
	}
}

function formatTime(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd hh:mm");
}

function formatControl(value, row) {
	if (row.remark) {
		var rem = row.remark.replace(/\n/g, "<br>");
	}

	var check = '<a href="javascript:;" id="borrowCheck" onclick="checkShow(\'' + row.realName + '\',' + row.phone + ',\'' + row.borrow + '\',' + row.gmtCreate + ',' + row.type + ',\'' + row.operatorName + '\',\'' + rem + '\')">查看</a>';
	var remark = '<a href="javascript:;" id="borrowRemarked" onclick="remarkAttr(\'' + value + '\',' + row.status + ',\'' + rem + '\')">备注</a>';
	var back = '<a href="javascript:;" id="borrowBacked" onclick="statusAttr(\'' + value + '\',' + 1 + ',\'' + rem + '\')">归还</a>';
	var lost = '<a href="javascript:;" id="borrowLosted" onclick="statusAttr(\'' + value + '\',' + 2 + ',\'' + rem + '\')">丢失</a>';
	var control = '';
	switch (row.status) {
		case 0:
			control = '<div class="borrow-control">' + check + remark + back + lost + '</div>'
			break;
		case 2:
			control = '<div class="borrow-control">' + check + remark + back + '</div>'
			break;
		default:
			control = '<div class="borrow-control">' + check + remark + '</div>'
	}
	return control;
}

function statusAttr(bor) {
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择需要操作的条目！');
		return;
	}

	if (bor == 1) {
		if (row.status == 0 || row.status == 2) {
			$('#dlgSubmit').dialog('open');
			$('#dlgContent').text('确认归还？');
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '此物品已归还!');
			return false;
		}
	} else {
		if (row.status == 0) {
			$('#dlgSubmit').dialog('open');
			$('#dlgContent').text('确认丢失？');
		} else {
			if (row.status == 1) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '此物品已归还!');
				return false;
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '此物品已丢失!');
				return false;
			}
		}
	}
	$('#dlgSure').attr({
		'data-uid': row.id,
		'data-bor': bor,
		'data-rem': row.remark
	});
}

$('#dlgSure').on('click', function() {
	var uid = $(this).attr('data-uid');
	var bor = $(this).attr('data-bor');
	var rem = $(this).attr('data-rem');
	rem = rem.replace(/<br>/g, '\n');
	statusChange(uid, bor, rem);
	$('#dlgSubmit').dialog('close');
})

function remarkAttr() {
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择需要编辑的备注！');
		return;
	}
	$('#dlgMark').dialog('open');
	// rem = rem.replace(/<br>/g, '\n');
	$('#inputRemark').val(row.remark);
	//	console.log(itemid);
	$('#inputRemSure').attr({
		'data-uid': row.id,
		'data-bor': row.status
	});
}

$('#inputRemSure').on('click', function() {
	var uid = $(this).attr('data-uid');
	var bor = $(this).attr('data-bor');
	var rem = $('#inputRemark').val();
	if (rem == '') {
		rem = ' ';
	}
	if (rem.length > 20) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注不能超过20个字！');
	} else {
		$('#dlgMark').dialog('close');
		statusChange(uid, bor, rem);
	}
})

function checkShow(user, phone, item, time, type, checker, remark) {
	$('#dlgCheck').dialog('open');
	$('#checkName').text(user);
	$('#checkPhone').text(phone);
	$('#checkItem').text(item);
	$('#checkTime').text(formatTime(time));
	$('#checkKind').text(formatKind(type));
	$('#checkMan').text(checker);
	$('#checkRemark').html(remark);
}

function statusChange(uid, bor, rem) {
	//	console.log(uid);
	postData('../ngym/GymUserBorrowAction!setStatus.zk', {
		id: uid,
		status: bor,
		remark: rem
	}, statusBack);
}

function statusBack(data) {
	data = eval('(' + data + ')');
	// console.log(data);
	if (data.STATUS) {
		borrowAction(statusNow, idNow);
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
	}
}

function formatMost(value) {
	var content = value;
	if (value == '' || !value) return '';
	if (content.length > 8) {
		content = content.substring(0, 8) + '...';
	}
	return content;
}

function borrowAction(status, id) {
	var statu = status;
	statusNow = status;
	idNow = id;
	$('.action').removeClass('action');
	switch (status) {
		case 1:
			$('#btnLost').show();
			$('#btnBack').hide();
			break;
		case 2:
			$('#btnLost').hide();
			$('#btnBack').show();
			break;
		default:
			$('#btnLost').show();
			$('#btnBack').show();
			break;
	}
	$('#' + id).addClass('action');
	$('#dg').datagrid('load', {
		userId: searchData,
		status: statu,
		type: borrowType,
		realName:$('#serchShop').val()
	});
}