$.extend($.fn.datagrid.methods, {
	fixDlgWidth: function(jq) {
		return jq.each(function() {
			$('.datagrid-view1').width(0);
			$('.datagrid-view2').width('100%');
			$('.datagrid-header').width('100%');
			$('.datagrid-body').width('100%');
		});
	}
});

//清除input中的\t等特殊字符
function clearSpecialStr(element) {
	var inputList = $('#' + element + ' input'); //.children('input');
	inputList.each(function(i, n) {
		var obj = $(n);
		var str = obj.val();
		obj.val(str.replace(/[\t\v\f]/g, ''));
	});
	inputList = null;
	inputList = $('#' + element + ' textarea'); //.children('input');
	inputList.each(function(i, n) {
		var obj = $(n);
		var str = obj.val();
		obj.val(str.replace(/[\t\v\f]/g, ''));
	});
}

function postData(url, data, callBack) {
	$.post(url, data, callBack);
}

function login() {
	var userId = 'UserTest';
	var userPass = '888888';
	var userPassMD5 = hex_md5(userPass);
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
		//		borrowCode();
	} else {
		console.log(data.INFO);
	}
}
// 发送消息
function openMessage() {
	var checkedItems = $('#dg').datagrid('getChecked');
	if (checkedItems.length < 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择发送对象');
		return;
	}
	// $('#toAllMessage').textbox('setValue','');
	$('#toAllMessage').val('');
	$('#dlg0').dialog('open').dialog('setTitle', "&nbsp;&nbsp;发送消息");
}

function sendAllMessage() {
	var msg = $('#toAllMessage').val(); // $('#toAllMessage').textbox('getValue');
	var users = '';
	var checkedItems = $('#dg').datagrid('getChecked');
	var data = $('#dg').datagrid('getData');
	var ids = [];
	if (msg.length > 200) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '信息长度不得超过200个字符!');
		return false;
	} else if (msg.length == 0) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '信息内容不得为空!');
		return false;
	}
	$.each(checkedItems, function(index, item) {
		ids.push(item.userId);
	});
	users = JSON.stringify(ids);
	/*
	 * if(data.total==checkedItems.length) users=''; else{ }
	 */
	$.post('../ngym/GymMembersAction!sendMsg.zk', {
		msg: msg,
		userIds: users
	}, function(data) { // ,cardTimes:,cardExpire:
		if (data.STATUS) {
			$('#sendTheMessage').hide();
			$('#sendSuccess').show();
		} else {
			if ('No Login!' == data.ERROR) {
				loginTimeout();
				return;
			}
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '发送失败');
		}
	}, 'json');
	// console.log(ids.join(","));
}

function successed() {
	$('#sendTheMessage').show();
	$('#sendSuccess').hide();
	$('#dg').datagrid('clearChecked');
	$('#dlg0').dialog('close');
}

function loginCheck() {
	$('#dg').datagrid({
		onLoadSuccess: function(data) {
			if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
				relogin();
			}
			if (data.total == 0 && data.STATUS) {
				//$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '还未开办会员卡');
			}
			$('#dg12345').datagrid('doCellTip', {
				onlyShowInterrupt: false, //是否只有在文字被截断时才显示tip，默认值为false             
				position: 'bottom', //tip的位置，可以为top,botom,right,left
				cls: {
					'background-color': '#FFF'
				}, //tip的样式D1EEEE
				delay: 100 //tip 响应时间
			});
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
}

function editRemark() {
	if ($('#dg').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行备注，请重新选择。');
		return false;
	}

	var row = $('#dg').datagrid('getSelected');
	if (!!row) {
		if (!!row.mark) {
			content = row.mark.replace(/\[/g, "").replace(/\]/g, "").replace(/\"/g, "").replace(/\ /g, "");
			$('#inputRemark').val(content);
		} else {
			$('#inputRemark').val('');
		}
		$('#dlgMark').dialog('open');
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择需要编辑的备注');
	}
}

function saveUserMark() {
	var row = $('#dg').datagrid('getSelected');
	if ($('#inputRemark').val().length <= 20) {
		var sl = $('#inputRemark').val();
		if ($('#inputRemark').val() == '') {
			sl = " ";
		}
		$.post('userAction!remark.zk', {
			userId: row.userId,
			remark: sl
		}, function(data) {
			if (data.STATUS) {
				$('#dg').datagrid('reload');
				$('#dlgMark').dialog('close');
			} else {
				if ('No Login!' == data.ERROR || '未登录' == data.ERROR) {
					loginTimeout();
					return;
				}
			}
		}, 'json');
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注最多20个字');
	}
}

function saveCardMark() {
	var row = $('#dg').datagrid('getSelected');
	if ($('#inputRemark').val().length <= 20) {
		var sid = $('#inputRemark').val();
		if (sid == '') {
			sid = ' ';
		}
		$.post('../ngym/GymMembersAction!update.zk', {
			id: row.id,
			mark: sid
		}, function(data) {
			if (data.STATUS) {
				$('#dg').datagrid('reload');
				$('#dlgMark').dialog('close');
			} else {
				if ('No Login!' == data.ERROR || '未登录' == data.ERROR) {
					loginTimeout();
					return;
				}
			}
		}, 'json');
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注最多20个字');
	}
}

function dgDelete(url) {
	if ($('#dg').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法删除多条，请重新选择。');
		return false;
	}

	var row = $('#dg').datagrid('getSelected');
	if (!!row) {
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;删除确认', '确认删除吗？', function(r) {
			if (r) {
				$.post(url, {
					id: row.id
				}, function(data) {
					if (data.STATUS) {
						$('#dg').datagrid('reload');
						$('#dlgMark').dialog('close');
						$.messager.show({
							title: "&nbsp;&nbsp;消息",
							timeout: 2000,
							msg: "删除成功!"
						});
					} else {
						if ('No Login!' == data.ERROR || '未登录' == data.ERROR) {
							loginTimeout();
							return;
						}
					}
				}, 'json');
			}
		})
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要删除的条目！');
	};
}

function newDelete(url) {
	if ($('#dg').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行删除，请重新选择。');
		return false;
	}

	var row = $('#dg').datagrid('getSelected');
	if (!!row) {
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;删除确认', '确认删除吗？', function(r) {
			if (r) {
				$.post(url, {
					courseUserId: row.courseUserId
				}, function(data) {
					if (data.STATUS) {
						$('#dg').datagrid('reload');
						$('#dlgMark').dialog('close');
						$.messager.show({
							title: "&nbsp;&nbsp;消息",
							timeout: 2000,
							msg: "删除成功!"
						});
					} else {
						if ('No Login!' == data.ERROR || '未登录' == data.ERROR) {
							loginTimeout();
							return;
						}
					}
				}, 'json');
			}
		})
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要删除的条目！');
	};
}

function cardDelete() {
	var ids = [];
	var checkedItems = $('#dg').datagrid('getChecked');
	$.each(checkedItems, function(index, item) {
		ids.push(item.id);
	});
	users = JSON.stringify(ids);

	var row = $('#dg').datagrid('getSelected');
	if (!!row) {
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;删除确认', '确认删除吗？', function(r) {
			if (r) {
				$.post('../ngym/GymMembersAction!deleteGymMember.zk', {
					id: users
				}, function(data) {
					if (data.STATUS) {
						$('#dg').datagrid('reload');
						$('#dlgMark').dialog('close');
						$.messager.show({
							title: "&nbsp;&nbsp;消息",
							timeout: 2000,
							msg: "删除成功!"
						});
					} else {
						if ('No Login!' == data.ERROR || '未登录' == data.ERROR) {
							loginTimeout();
							return;
						}
					}
				}, 'json');
			}
		})
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要删除的条目！');
	};
}

function editMark() {
	if ($('#dg').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行备注，请重新选择。');
		return false;
	}

	var row = $('#dg').datagrid('getSelected');
	if (!!row) {
		if (!!row.remark) {
			$('#inputRemark').val(row.remark);
		} else {
			$('#inputRemark').val('');
		}
		$('#dlgMark').dialog('open');
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择需要编辑的备注');
	}
}

function formatRemark(value) {
	var content = value;
	if (value == '' || !value) {
		return ' '
	} else {
		content = content.replace(/\[/g, "").replace(/\]/g, "").replace(/\"/g, "");
	};
	if (content.length > 8) {
		content = content.substring(0, 8) + '...';
		value = value.replace(/\[/g, "").replace(/\]/g, "").replace(/\"/g, "");
		return '<span style="position:relative;" onmouseover="titelShow(\'' + value + '\',$(this))" onmouseout="titelShow(\'' + value + '\',$(this),1)">' + content + '<textarea class="titelhow" rows="3" disabled="disabled" style="position:absolute;box-sizing:border-box;width:100%;font-size:12px;background-color:white;top:0px;left:0;z-index:1;color: black;  padding: 0 5px;  border: 1px solid #eee;  border-radius: 3px;resize:none;display:none;">' + value + '</textarea></span>';
	} else {
		return '<span style="position:relative;" >' + content + '</span>';
	}
	// return content;

}

function titelShow(value, ele, c) {
	if (c == 1) {
		ele.find('.titelhow').stop(true, true).hide();
	} else {
		ele.find('.titelhow').stop(true, true).fadeIn(100);
	}
	ele.parent().css({
		'overflow': 'visible'
	})
}

function saveMark(url) {
	var row = $('#dg').datagrid('getSelected');
	var sis = $('#inputRemark').val();
	if (sis == '') {
		sis = ' ';
	}
	if ($('#inputRemark').val().length <= 20) {
		$.post(url, {
			id: row.id,
			remark: sis
		}, function(data) {
			if (data.STATUS) {
				$('#dg').datagrid('reload');
				$('#dlgMark').dialog('close');
			} else {
				if ('No Login!' == data.ERROR || '未登录' == data.ERROR) {
					loginTimeout();
					return;
				}
			}
		}, 'json');
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注最多20个字');
	}
}

function msgLoading(close) {
	var loading = '<div id="loadingCir" style="position:absolute;z-index:9999;background-color:#fff;opacity:0.5;top:0;left:0;right:0;bottom:0;"><img style="display:block;position:absolute;width:30px;margin-left:-15px;margin-top:-15px;left:50%;top:50%;" src="js/themes/common/loading.gif" alt="" /></div>';
	if (close == 'close') {
		$('#loadingCir').remove();
	} else {
		$('body').append(loading);
	}
}

function resetDate(obj) {
	// setTimeout(function() {
	$(obj).val('');
	// }, 1);
	// event.returnValue = false;
}

function dateTimeTest(data) {
	var dT = dateTest(data.split(' ')[0]);
	var tT = timeTest(data.split(' ')[1]);
	if (dT && tT) {
		return true;
	}
	return false;
}

function dateTest(date) {
	var pattern = /((((1[6-9]|[2-9]\d)\d{2})-(1[02]|0?[13578])-([12]\d|3[01]|0?[1-9]))|(((1[6-9]|[2-9]\d)\d{2})-(1[012]|0?[13456789])-([12]\d|30|0?[1-9]))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(1\d|2[0-8]|0?[1-9]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))/;
	return pattern.test(date);
}

function timeTest(time) {
	var pattern = /([01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d/;
	return pattern.test(time);
}


var camera = '';
var photoState = 1;

function show(n) {
	var id = '';
	if (!!n) {
		id = n;
	}
	if (photoState == 1) {
		//window.zk_setPosition(100,100);
		camera = new zk_CameraTag("iconVideo" + id);
		$('#headIcon' + id).hide();
		$('#iconVideo' + id).show();
		if (!camera.open()) {
			$.messager.show({
				title: "&nbsp;&nbsp;消息",
				timeout: 2000,
				msg: "未安装摄像头!"
			});
			return false;
		};
		photoState = 2;
	} else if (photoState == 2) {
		var base64 = camera.capture();
		msgLoading();
		$.post('../file/FileCenter!uploadBase64.zk', {
			fileType: '.jpeg',
			fileData: base64
		}, function(data) {
			if (data.STATUS) {
				var userPhoto = data.fileId; //TODO 验证图片
				$('#headIcon' + id).show();
				$('#iconVideo' + id).hide();
				$('#headIcon' + id).attr('src', base64); //'../file/FileCenter!showImage2.zk?name='+userPhoto
				$("#messageImage" + id).val(data.fileId);
				msgLoading('close');
				$.messager.show({
					title: "&nbsp;&nbsp;消息",
					timeout: 2000,
					msg: "头像上传成功!"
				});
				photoState = 1;
			} else {
				msgLoading('close');
				$.messager.show({
					title: "&nbsp;&nbsp;消息",
					timeout: 2000,
					msg: "头像上传失败!"
				});
				return false;
			}
		}, 'json');
	}
}

function formatBirthDay(date) {
	var day = new Date(date);
	return day.format('yyyy-MM-dd');
}
function formatTi(date) {
	var day = new Date(date);
	return day.format('yyyy-MM-dd hh:mm');
}

Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
//禁止输入框输入非数字和小于0的数，用法在input输入框加属性onkeyup="isnum(this)" onafterpaste="delunum(this)"即可
function isnum(e){
	if(e.value.length==1){e.value=e.value.replace(/[^0-9]/g,'')}else{e.value=e.value.replace(/\D/g,'')}
}
function delunum(e){
	if(e.value.length==1){e.value=e.value.replace(/[^0-9]/g,'')}else{e.value=e.value.replace(/\D/g,'')}
}