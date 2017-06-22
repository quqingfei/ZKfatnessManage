var dutySel;
var dutyId;
var searchRole = '';
var userIdStaff;

$(function() {
	$('#dg').datagrid({
		onLoadSuccess: function(data) {
			if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
				//				relogin();
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
	var levels = [];
	for (var i = 0; i <= 100; i++) {
		var level = {
			'text': i,
			'value': i
		}
		levels.push(level);
	}
	$('#coachStar').combobox({
		data: levels
	});
	$('#coachStarEd').combobox({
		data: levels
	});
	$.post('../ngym/GymRoleAction!list.zk', {
		page: 1,
		rows: 1000
	}, function(data) {
		if (data.STATUS) {
			var rows = data.rows;
			var makers = [];
			var roles = [{
				"id": '',
				"duty": '全部'
			}];
			//			roles.push();
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				var maker = {
					"id": row.id,
					"duty": row.name
				};
				makers.push(maker);
				roles.push(maker);
			}

			$('#roleNew').combobox({
				valueField: 'id',
				textField: 'duty',
				data: makers,
				onSelect: function(rec) {
					dutySel = rec.duty;
					dutyId = rec.id;
					if (rec.duty == '教练') {
						$('.coachMode').show();
					} else {
						$('.coachMode').hide();
					}
				}
			});
			$('#roleSel').combobox({
				valueField: 'id',
				textField: 'duty',
				data: makers,
				onSelect: function(rec) {
					dutySel = rec.duty;
					dutyId = rec.id;
					if (rec.duty == '教练') {
						$('.coachMode').show();
					} else {
						$('.coachMode').hide();
					}
				}
			});
			$('#searchRole').combobox({

				valueField: 'id',
				textField: 'duty',
				data: roles,
				onSelect: function(rec) {
					//					dutySel = rec.duty;
					searchRole = rec.id;
					searchStaff();
				}
			});
		} else {
			if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
				//				relogin();
				relogin();
			}
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
	var workTime = [];
	for (var i = 0; i < 48; i++) {
		if (i % 2 == 0) {
			var time = {
				'text': timeNum(parseInt(i / 2)) + ':' + '00',
				'value': i / 2
			}
			workTime.push(time);
		} else {
			var time = {
				'text': timeNum(parseInt(i / 2)) + ':' + '30',
				'value': i / 2
			}
			workTime.push(time);
		}
	}
	$('#coachStart').combobox({
		valueField: 'value',
		textField: 'text',
		data: workTime
	});
	$('#coachEnd').combobox({
		valueField: 'value',
		textField: 'text',
		data: workTime
	});
	$('#coachStartEd').combobox({
		valueField: 'value',
		textField: 'text',
		data: workTime
	});
	$('#coachEndEd').combobox({
		valueField: 'value',
		textField: 'text',
		data: workTime
	});
	$('#hideDiv').hide();
});

function timeNum(num) {
	if (num < 10) return '0' + num;
	else return num;
}

function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}

function formatControl(value, row) {
	var control = '<a href="javascript:;" id="staffEdit" onclick="staffEdit(\'' + value + '\',\'' + row.realName + '\',' + row.phone + ',\'' + row.duty + '\',\'' + row.roleId + '\')">编辑</a>';
	return control;
}

function formatTime(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd hh:mm");
}

function staffEdit() {
	if ($('#dg').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个员工进行编辑，请重新选择。');
		return false;
	}
	$('.showImgDiv').remove();
	$('#fmEdit').form('clear');
	$('#imgheadEd').attr('src', 'images/yun.png');
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择员工!');
		return;
	}
	$('#emNameEd').val(row.realName);
	$('#emPhoneEd').val(row.phone);
	if (!!row.coachLevel || row.coachLevel == 0)
		$('#coachLevelEd').combobox('select', row.coachLevel);
	if (!!row.coachWeight || row.coachWeight == 0)
		$('#coachStarEd').combobox('select', row.coachWeight);
	if (!!row.coachIntroduce)
		$('#coachIntroduceEd').val(row.coachIntroduce);
	if (!!row.coachDetail)
		$('#coachDetailEd').val(row.coachDetail);
	if (!!row.coachPicture) {
		// $('#imgheadEd').attr('src', '../file/FileCenter!showImage2.zk?name=' + row.coachPicture);
		// $('#imageEd').val(row.coachPicture);
		var imgs = row.coachPicture.split(',');
		for (var i = 0; i < imgs.length; i++) {
			var imgURL = "../file/FileCenter!showImage2.zk?name=" + imgs[i];
			var divImg = $('<div>').attr('class', 'showImgDiv');
			var delBtn = $('<div>').attr({
				'class': 'deleteCover',
			}).text('×').on('click', function() {
				$(this).parent().remove();
			});
			var imgPart = $('<img>').attr({
				'src': imgURL
			});

			divImg.append(imgPart);
			divImg.append(delBtn);

			$('#imgheadEd').before(divImg);
		}

	}
	if (!!row.coachStart || row.coachStart == 0) {
		$('#coachStartEd').combobox('select', row.coachStart);
	}
	if (!!row.coachEnd || row.coachEnd == 0) {
		$('#coachEndEd').combobox('select', row.coachEnd);
	}
	$('#roleSel').combobox('select', row.roleId);
	// $('#roleSel').combobox('setText', row.duty);
	dutyId = row.roleId;
	dutySel = row.duty;
	$('#dlgConfirm').dialog('open');
	$('#dlgConfirm').attr('data-id', row.id);
}

$('#staffNew').on('click', function() {
	$('#fmNew').form('clear');
	$('.showImgDiv').remove();
	$('#imghead').attr('src', 'images/yun.png');
	$('#dlgNewCons').dialog('open');
	$('.coachMode').hide();
	$('#emCode').focus();
});

$('#emCode').focus(function() {
	$('#emCode').val('');
	document.onkeydown = function(e) {
		var ev = document.all ? window.event : e;
		if (ev.keyCode == 13) {
			//			emCode();
			$('#emCode').blur();
		}
	};
});

$('#emCode').blur(function() {
	if ($('#emCode').val()) {
		emCode();
	}
});

function postData(url, data, callBack) {
	$.post(url, data, callBack);
}

function emCode() {
	//	var code = '116151381599386260';
	var code = $('#emCode').val();
	if (code == '' || code.length > 18) {
		//		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '条码不正确！');
		$.messager.show({
			title: '&nbsp;&nbsp;&nbsp;&nbsp;提示',
			msg: '条码不正确！',
			timeout: 2000,
			showType: 'slide'
		});
	} else {
		//		ajaxData('http://192.168.1.250:8080/fatburn/gym/userAction!getUserByCode.zk', {
		//			code: code
		//		}, 'emCodeBack')
		postData('userAction!getUserByCode.zk', {
			code: code
		}, emCodeBack)
	}
};

function emCodeBack(data) {
	data = eval('(' + data + ')');
	if (data.STATUS) {
		//		console.log(data);
		if (!!data.memberName)
			$('#emName').val(data.memberName);
		if (!!data.phone)
			$('#emPhone').val(data.phone);
		userIdStaff = data.userId;
	} else {
		if (data.ERROR == '未登录') {
			loginTimeout();
			return;
		}
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
	}
};

function saveNewStaff() {
	var name = $('#emName').val();
	var phone = $('#emPhone').val();
	if (dutySel == '教练') {
		saveCoach();
	} else if (checkNew()) {
		msgLoading();
		$.post('../ngym/GymEmployeesAction!add.zk', {
			userId: userIdStaff,
			realName: name,
			roleId: dutyId,
			duty: dutySel,
			phone: phone
		}, function(data) {
			msgLoading('close');
			if (data.STATUS) {
				$('#dlgNewCons').dialog('close');
				$('#dg').datagrid('reload');
			} else {
				if (data.ERROR == '未登录') {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');

					relogin();
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}
};
var coachInfo = {};

function checkCoach() {
	var code = $('#emCode').val();
	coachInfo = {};
	coachInfo.roleId = $('#roleNew').combobox('getValue');
	coachInfo.realName = $('#emName').val();
	coachInfo.phone = $('#emPhone').val();
	coachInfo.coachLevel = $('#coachLevel').combobox('getValue');
	coachInfo.coachWeight = $('#coachStar').combobox('getValue');
	var imgList = new Array;

	for (var i = 0; i < $('.showImgDiv img').length; i++) {
		imgList.push($('.showImgDiv img').eq(i).attr('src').split('name=')[1]);
	}
	coachInfo.coachPicture = imgList.toString();
	coachInfo.coachIntroduce = $('#coachIntroduce').val();
	coachInfo.coachDetail = $('#coachDetail').val();
	coachInfo.coachStart = $('#coachStart').combobox('getValue');
	coachInfo.coachEnd = $('#coachEnd').combobox('getValue');

	if ($.trim(code) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
		return false;
	}
	if ($.trim(coachInfo.roleId) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择角色！');
		return false;
	}
	if ($.trim(coachInfo.realName) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入姓名！');
		return false;
	}
	if ($.trim(coachInfo.phone) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入手机号！');
		return false;
	}
	if (!isTelephone(coachInfo.phone)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '手机号不正确!');
		$("#emPhone").focus();
		return false;
	}
	if ($.trim(coachInfo.coachLevel) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择教练等级！');
		return false;
	}
	// if ($.trim(coachInfo.coachStar) == '') {
	// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择教练星级！');
	// 	return false;
	// }
	if ($.trim(coachInfo.coachPicture) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择教练照片！');
		return false;
	}
	if ($.trim(coachInfo.coachStart) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择教练上班时间！');
		return false;
	}
	if ($.trim(coachInfo.coachEnd) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择教练下班时间！');
		return false;
	}
	// if (coachInfo.coachEnd < coachInfo.coachStart) {
	// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '下班时间应在上班时间之后！');
	// 	return false;
	// }
	if ($.trim(coachInfo.coachIntroduce) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入简介！');
		return false;
	}
	if (coachInfo.coachIntroduce.replace(/[\r\n]/g, '').length > 25) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '简介不能多于25个字！');
		return false;
	}
	if ($.trim(coachInfo.coachDetail) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入个人介绍！');
		return false;
	}
	return true;
}

function saveCoach() {
	if (checkCoach()) {
		msgLoading();
		coachInfo.userId = userIdStaff;
		coachInfo.duty = '教练';
		$.post('../ngym/GymEmployeesAction!addCoach.zk', coachInfo, function(data) {
			msgLoading('close');
			if (data.STATUS) {
				$('#dlgNewCons').dialog('close');
				$('#dg').datagrid('reload');
			} else {
				if (data.ERROR == '未登录') {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
					relogin();
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}
}

$('#getInfo').click(function(event) {
	/* Act on the event */
	if ($('#dg').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个员工进行编辑，请重新选择。');
		return false;
	}
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择员工!');
		return false;
	}
	$.ajax({
		type:'post',
		url:'../ngym/GymEmployeesAction!setMsgPeople.zk',
		data:{userId:row.userId},
		dataType:'json',
		success: function(res){
			if(res.STATUS){
				if (res.ERROR == '未登录') {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
					relogin();
					return false;
				}
				$.messager.show({
					title: '&nbsp;&nbsp;&nbsp;&nbsp;提示',
					msg: '设置接收者成功！',
					timeout: 2000,
					showType: 'slide'
				});
			}
		}
	})
});

function isTelephone(obj) { //手机号正则判断
	var pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
	if (pattern.test(obj)) {
		return true;
	} else {
		return false;
	}
}

function checkNew() {
	var code = $('#emCode').val();
	var role = $('#roleNew').combobox('getValue');
	var name = $('#emName').val();
	var phone = $('#emPhone').val();
	if ($.trim(code) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
		return false;
	}
	if ($.trim(role) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择角色！');
		return false;
	}
	if ($.trim(name) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入姓名！');
		return false;
	}
	if ($.trim(phone) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入手机号！');
		return false;
	}
	if (!isTelephone(phone)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '手机号不正确!');
		$("#emPhone").focus();
		return false;
	}
	return true;
}
// var coachInfo = {};

function checkCoachEd() {
	coachInfo = {};
	coachInfo.roleId = $('#roleSel').combobox('getValue');
	coachInfo.realName = $('#emNameEd').val();
	coachInfo.phone = $('#emPhoneEd').val();
	coachInfo.coachLevel = $('#coachLevelEd').combobox('getValue');
	coachInfo.coachWeight = $('#coachStarEd').combobox('getValue');
	// for (var i = $('.showImgDiv img').length - 1; i >= 0; i--) {
	// 	$('.showImgDiv img').eq[i].
	// }
	var imgList = new Array;

	for (var i = 0; i < $('.showImgDiv img').length; i++) {
		imgList.push($('.showImgDiv img').eq(i).attr('src').split('name=')[1]);
	}
	coachInfo.coachPicture = imgList.toString();
	// = $('#imageEd').val();
	coachInfo.coachIntroduce = $('#coachIntroduceEd').val();
	coachInfo.coachDetail = $('#coachDetailEd').val();
	coachInfo.coachStart = $('#coachStartEd').combobox('getValue');
	coachInfo.coachEnd = $('#coachEndEd').combobox('getValue');
	if ($.trim(coachInfo.roleId) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择角色！');
		return false;
	}
	if ($.trim(coachInfo.realName) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入姓名！');
		return false;
	}
	if ($.trim(coachInfo.phone) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入手机号！');
		return false;
	}
	if (!isTelephone(coachInfo.phone)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '手机号不正确!');
		$("#emPhone").focus();
		return false;
	}
	if ($.trim(coachInfo.coachLevel) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择教练等级！');
		return false;
	}
	// if ($.trim(coachInfo.coachStar) == '') {
	// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择教练星级！');
	// 	return false;
	// }
	if (coachInfo.coachPicture == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请添加教练照片！');
		return false;
	}
	if ($.trim(coachInfo.coachStart) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择教练上班时间！');
		return false;
	}
	if ($.trim(coachInfo.coachEnd) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择教练下班时间！');
		return false;
	}
	// if (coachInfo.coachEnd < coachInfo.coachStart) {
	// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '下班时间应在上班时间之后！');
	// 	return false;
	// }
	if ($.trim(coachInfo.coachIntroduce) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入简介！');
		return false;
	}
	if (coachInfo.coachIntroduce.replace(/[\r\n]/g, '').length > 25) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '简介不能多于25个字！');
		return false;
	}
	if ($.trim(coachInfo.coachDetail) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入个人介绍！');
		return false;
	}
	return true;
}

function saveCoachEd() {
	if (checkCoachEd()) {
		msgLoading();
		coachInfo.id = $('#dlgConfirm').attr('data-id');
		coachInfo.duty = '教练';
		$.post('../ngym/GymEmployeesAction!updateCoach.zk', coachInfo, function(data) {
			msgLoading('close');
			if (data.STATUS) {
				$('#dlgConfirm').dialog('close');
				$('#dg').datagrid('reload');
			} else {
				if (data.ERROR == '未登录') {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
					relogin();
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}
}

function saveEditStaff() {
	var name = $('#emNameEd').val();
	var phone = $('#emPhoneEd').val();
	var id = $('#dlgConfirm').attr('data-id');
	if (dutySel == '教练') {
		saveCoachEd();
	} else if (checkEdit()) {
		msgLoading();
		$.post('../ngym/GymEmployeesAction!update.zk', {
			id: id,
			realName: name,
			roleId: dutyId,
			duty: dutySel,
			phone: phone
		}, function(data) {
			msgLoading('close');
			if (data.STATUS) {
				$('#dlgConfirm').dialog('close');
				$('#dg').datagrid('reload');
				//				$('#roleName').val('');
			} else {
				if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
					//				relogin();
					relogin();
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}
}

function checkEdit() {
	var role = $('#roleSel').combobox('getValue');
	var name = $('#emNameEd').val();
	var phone = $('#emPhoneEd').val();
	if ($.trim(role) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择角色！');
		return false;
	}
	if ($.trim(name) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入姓名！');
		return false;
	}
	if ($.trim(phone) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入手机号！');
		return false;
	}
	if (!isTelephone(phone)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '手机号不正确!');
		$("#emPhone").focus();
		return false;
	}
	return true;
}

function delStaff() {
	var id = $('#dlgConfirm').attr('data-id');
	$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;提示', '确认删除？', function(r) {
		if (r) {
			$.post('../ngym/GymEmployeesAction!delete.zk', {
				id: id
			}, function(data) {
				if (data.STATUS) {
					$('#dlgConfirm').dialog('close');
					// $('#dlgDeleteFail').dialog('close');
					$('#dg').datagrid('reload');
					//				$('#roleName').val('');
				} else {
					if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
						//				relogin();
						relogin();
					}
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
				}
			}, 'json');
		}
	})
}

function searchStaff() {
	var name = $('#searchName').val();
	if (isTelephone(name)) {
		$('#dg').datagrid('load', {
			roleId: searchRole,
			phone: name
		});
	} else {
		$('#dg').datagrid('load', {
			roleId: searchRole,
			realName: name
		});
	}
}
// var coverId;

function chooseImage2(id, i) {
	// coverId = i;
	if (i == 'new') {
		var lens = $('.showImgDiv').length;
		if (lens >= 6) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '封面不能超过6张！');
			return false;
		}
		// if (removeId.length > 0) {
		// 	coverId = removeId[0];
		// } else {
		// 	coverId = lens;
		// }
	}
	// if (isEdit == 1)
	// 	return;
	document.getElementById(id).click();
}

// var imageList=[];
//上传图片
function uploadImage() {
	var viewFiles = document.getElementById("file_title_img");
	//是否为图片类型            
	if (/image\/\w+/.test(viewFiles.files[0].type)) {
		//最大图片文件大小 500KB
		var imgSizeLimit = 500 * 1024;
		if (viewFiles.files[0].size <= imgSizeLimit) {
			//上传图片
			msgLoading();
			$("#title_img_form")
				.ajaxSubmit({
					type: 'post',
					url: '../file/FileCenter!uploadImage2.zk',
					success: function(data) {
						msgLoading('close');
						data = $.parseJSON(data);
						if (data.name) {
							var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
							var divImg = $('<div>').attr('class', 'showImgDiv');
							var delBtn = $('<div>').attr({
								'class': 'deleteCover',
							}).text('×').on('click', function() {
								$(this).parent().remove();
							});
							var imgPart = $('<img>').attr({
								'src': imgURL
							});

							divImg.append(imgPart);
							divImg.append(delBtn);

							$('#imghead').before(divImg);
						} else {
							//alert("上传图片出错！");
							$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上传图片出错！');
						}
						$("#title_img_form").resetForm();
					},
					error: function(XmlHttpRequest, textStatus, errorThrown) {
						//alert("error");
						msgLoading('close');
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', 'error');
					}
				});
		} else {
			//alert("图片大小不能超过" + (imgSizeLimit / 1024) + "KB!");
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "图片大小不能超过" + (imgSizeLimit / 1024) + "KB!");
		}
	} else {
		//alert('请选择图片类型的文件!');
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择图片类型的文件!');
	}
}
// var removeId = [];

// function removeCover(i) {
// 	$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;提示', '确认删除？', function(e) {
// 		if (e) {
// 			$('#imghead-' + i).parent().remove();
// 			removeId.push(i);
// 		}
// 	});
// }

function uploadImageEd(obj) {
	var viewFiles = document.getElementById("file_title_img_ed");
	//是否为图片类型            
	if (/image\/\w+/.test(viewFiles.files[0].type)) {
		//最大图片文件大小 500KB
		var imgSizeLimit = 500 * 1024;
		if (viewFiles.files[0].size <= imgSizeLimit) {
			//上传图片
			msgLoading();
			$("#title_img_form_ed")
				.ajaxSubmit({
					type: 'post',
					url: '../file/FileCenter!uploadImage2.zk',
					success: function(data) {
						msgLoading('close');
						data = $.parseJSON(data);
						if (data.name) {
							var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
							var divImg = $('<div>').attr('class', 'showImgDiv');
							var delBtn = $('<div>').attr({
								'class': 'deleteCover',
							}).text('×').on('click', function() {
								$(this).parent().remove();
							});
							var imgPart = $('<img>').attr({
								'src': imgURL
							});

							divImg.append(imgPart);
							divImg.append(delBtn);

							$('#imgheadEd').before(divImg);
						} else {
							//alert("上传图片出错！");
							$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上传图片出错！');
						}
						$("#title_img_form_ed").resetForm();
					},
					error: function(XmlHttpRequest, textStatus, errorThrown) {
						//alert("error");
						msgLoading('close');
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', 'error');
					}
				});
		} else {
			//alert("图片大小不能超过" + (imgSizeLimit / 1024) + "KB!");
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "图片大小不能超过" + (imgSizeLimit / 1024) + "KB!");
		}
	} else {
		//alert('请选择图片类型的文件!');
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择图片类型的文件!');
	}
}