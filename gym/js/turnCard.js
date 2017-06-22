function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
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
	var years = [];
	var nowYear = new Date().getFullYear();
	// for (var i = 1900; i <= nowYear; i++) {
	// 	// var row = rows[i];
	// 	var year = {
	// 		"id": i,
	// 		"year": i + '年'
	// 	};
	// 	years.push(year);
	// }
	// $('#birthDate').combobox({
	// 	valueField: 'id',
	// 	textField: 'year',
	// 	data: years
	// });
	$('#hideDiv').hide();
	$('#userCode').focus();

	$('#userCode').focus(function() {
		var code = $(this).val();
		if (code && code != '') {
			$(this).val('');
		}
	});
	$('#userCode').change(function() {
		var code = $(this).val();
		if (!code) {
			return;
		}
		$.post('userAction!getUserByCode.zk', {
			code: code
		}, function(data) {
			if (data.STATUS) {
				searchUserById(data.userId, curStatus);
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码!');
			}
		}, 'json');
	});
	$('#attention').trigger('click');
});

var remarkUserId;
var curRow; //当前行
var remark = [];
var curRowIndex;

function remarkEdit(value, index) {
	curRowIndex = index;
	var div = document.getElementById("remarkList");
	while (div.hasChildNodes()) //当div下还存在子节点时 循环继续
	{
		div.removeChild(div.firstChild);
	}
	$("#" + 'remarkMessage').attr('value', '');
	$("#userId").attr('value', value);
	var record = $('#dg').datagrid('selectRow', index);
	var row = $('#dg').datagrid('getSelected');
	if (row) {
		$('#dlg').dialog('open').dialog('setTitle', "&nbsp;&nbsp;" + row.nickName + "的标注");
		remarkUserId = row.userId;
		curRow = row;
		var fatherDiv = document.getElementById("remarkList");
		remark = [];
		if (!row.mark || row.mark == '')
			return;
		var array = eval('(' + row.mark + ')');
		for (var k = 0; k < array.length; k++) {
			remark.push(array[k]);
		}
		for (var i = 0; i < remark.length; i++) {
			var div = document.createElement("div");
			$(div).attr({
				'id': i + '-div',
				'class': 'remarkPoint'
			});
			$(div).text(remark[i]);
			fatherDiv.appendChild(div);
			var imgDiv = document.createElement("div");
			$(imgDiv).attr({
				'id': i + 'imgDiv',
				'class': 'delRemark',
				'value': i,
				'onclick': 'delRemark("' + i + 'imgDiv")'
			});
			div.appendChild(imgDiv);
		}

	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要编辑的用户!');
	}
}
//
function delRemark(id) {
	var text = $($("#" + id).parent()).text();
	var length = remark.length;
	for (var i = 0; i < length; i++) {
		if (remark[i] == text) {
			remark.splice(i, 1);
			break;
		}
	}
	$("#" + id).parent().detach();
	event.stopPropagation();
	saveRemark();
	//alert(JSON.stringify(remark));
}

function saveRemark() {
	//var value = $("#"+'remarkMessage').textbox('getValue');
	var value = $.trim($("#" + 'remarkMessage').val());
	if (value.length > 10) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '长度不能超过10！');
		return;
	}
	if ($.trim(value) != '')
		remark.push($.trim(value));
	//alert(JSON.stringify(remark));
	var string = JSON.stringify(remark);
	$("#remark").attr("value", "");
	$("#remark").val(string);
	$.post('userAction!remark.zk', {
		userId: remarkUserId,
		remark: string
	}, function(data) {
		if (data.STATUS) {
			//$('#dlg').dialog('close');    // close the dialog
			//$('#dg').datagrid('reload');// reload the user data
			if ($.trim(value) != '') {
				var fatherDiv = document.getElementById("remarkList");
				var div = document.createElement("div");
				var pointId = $.now();
				$(div).attr({
					'id': pointId + '-div',
					'class': 'remarkPoint'
				});
				$(div).text(value);
				fatherDiv.appendChild(div);
				var imgDiv = document.createElement("div");
				$(imgDiv).attr({
					'id': pointId + 'imgDiv',
					'class': 'delRemark',
					'value': pointId,
					'onclick': 'delRemark("' + pointId + 'imgDiv")'
				});
				div.appendChild(imgDiv);
			}
			curRow.mark = string;
			//$($(curRow.remark).children("div")[0]).html("<span>hah1</span>");//"<div style='width:100%;height:100%;text-align:center;' onclick=\"remarkEdit('"+curRow.user_id+"',"+curRowIndex+");\">"+result+"</div>";
			$("#" + 'remarkMessage').val('');
			$('#dg').datagrid('refreshRow', curRowIndex);

			//alert("保存成功");

		} else {
			if ('No Login!' == data.ERROR) {
				loginTimeout();
				return;
			}
		}
	}, 'json');

}
//格式化日期控件-选择生日
// $("#birthDate").datebox().datebox('calendar').calendar({ validator:function(day){ return day < new Date(); } })
function formatTime(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd hh:mm:ss");
}
function formatTime1(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd");
}
//用户筛选事件,自动搜索
//$("#startDate").datebox({
//	onChange: function(n, o) {
//		searchUser(curStatus);
//	},
//	onSelect: function(n, o) {
//		searchUser(curStatus);
//	}
//});
//$("#endDate").datebox({
//	onChange: function(n, o) {
//		searchUser(curStatus);
//	},
//	onSelect: function(n, o) {
//		searchUser(curStatus);
//	}
//});

var curId = '';

var curStatus;

function toChooseUser(id, value) {
	$('#' + id).css({
		color: '#FFD600'
	});
	if (curId != '')
		$('#' + curId).css({
			color: '#fff'
		});
	userTypeT = $('#' + id).attr("data-value");
	curId = id;
	curStatus = value;
	$('#dg').datagrid('clearChecked');
	searchUser(value);
}

function searchUser(value) {
	var data = {};
	var phone = $('#phoneSearch').val();
	var name = $('#nameSearch').val();
	data.type = 'effect';
	if (phone && phone != '')
		data.phone = phone;
	if (name && name != '')
		data.name = name;
	$("#dg").datagrid('load', data);

}

function searchUserById(id, value) {
	var data = {};
	var userID = id;
	var phone = $('#phoneSearch').val();
	data.type = 'effect';
	if (phone && phone != '')
		data.phone = phone;
	if (userID && userID != '')
		data.userId = userID;
	$("#dg").datagrid('load', data);
}

function toSearch() {
	searchUser(curStatus);
}

//年龄换算
function formatAge(value) {
	//alert(value);
	var date = new Date();
	return date.getFullYear() - parseInt(value);
}
//会员卡类型
function formatType(value, row, index) {
	switch (parseInt(value)) {
		case 0:
			return '时效卡';
		case 1:
			return '次卡';
		default:
			return '';
	}
}

function seeMessage() {
	// var record = $('#dg').datagrid('selectRow', index);
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择会员卡!');
		return;
	}
	clearShowFrom();
	$('.chooseBtn').hide();
	$('#memberIcon').attr('src', '../file/FileCenter!showImage2.zk?name=' + row.photo);
	$('#shouldAmount').text(row.shouldPay);
	$('#realAmount').text(row.realPay);
	$('#memberName').text(row.name);
	$('#memberPhone').text(row.phone);
	if (row.sex == 'M')
		$('#memberSex').text('男');
	else if (row.sex == 'F')
		$('#memberSex').text('女');
	else
		$('#memberSex').text('');
	$('#salePerson').text(row.salesPersonName);
	var dateB = new Date(row.gmtBirth);
	var birth = dateB.getFullYear();
	var date = new Date();

	if (row.gmtBirth) {
		$('#memberAge').text(date.getFullYear() - birth);
	} else {
		$('#memberAge').text('0');
	}
	// $('#memberIDCard').text(row.idCard);
	// $('#memberHeight').text(row.height);
	// $('#memberWeight').text(row.weight);
	// $('#memberProfession').text(row.job);
	// $('#memberEmployer').text(row.workUnit);
	// $('#memberName').text(row.name);
	// $('#memberAddress').text(row.address);
	// $('#memberEmployerAddress').text(row.workUnitAddress);
	if (row.cardType == 0) {
		// $('#cycleMsg').show();
		$('#timeMsg').hide();
		$('#memberCardType').text('时效卡');
		$('#gmtStart').text(formatTime1(row.gmtStart));
		$('#gmtEnd').text(formatTime1(row.gmtEnd));
	} else if (row.cardType == 1) {
		// $('#cycleMsg').hide();
		$('#timeMsg').show();
		$('#memberCardType').text('次卡');
		$('#gmtStart').text(formatTime1(row.gmtStart));
		$('#gmtEnd').text(formatTime1(row.gmtEnd));
		$('#msgCountLast').text(row.totleTime - row.useTime);
		$('#msgCountTotle').text(row.totleTime);
	}

	$('#memberCardName').text(row.cardName);
	$('#gmtCreate').text(formatTime1(row.gmtCreate));
	$('#gmtModify').text(formatTime1(row.gmtModify));

	//	var last = row.totleTime - row.useTime;

	$('#dlgMessage').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;会员卡信息");
}
var transId;

function transCard() {
	clearAddForm();
	photoState = 1;
	$('#headIcon').show();
	$('#iconVideo').hide();
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择会员卡!');
		return;
	}
	$('#dlgTrans').dialog('open');

	$('#turnCode').focus(function() {
		var code = $(this).val();
		if (code && code != '') {
			$(this).val('');
		}
	});
	$('#turnCode').change(function() {
		var code = $(this).val();
		if (!code) {
			return;
		}
		$.post('userAction!getUserByCode.zk', {
			code: code
		}, function(data) {
			if (data.STATUS) {
				transId = data.userId;
				if (!!data.memberName) {
					$('#messageName').val(data.memberName);
				}
				if (!!data.memberPhone) {
					$('#messagePhone').val(data.memberPhone);
				}
				if (!!data.memberPhoto) {
					var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.memberPhoto;
					$("#headIcon").attr("src", imgURL);
					$("#messageImage").val(data.memberPhoto);
				}
				if (!!data.sex) {
					switch (data.sex) {
						case '男':
							$("#messageSex").combobox('setValue', 'M');
							break;
						case '女':
							$("#messageSex").combobox('setValue', 'F');
							break;
						default:
							break;
					}
				}
				if (!!data.birthYear) {
					// var birth = data.birthYear + '-1-1';
					$("#birthDate").val(formatBirthDay(data.birthDay))
				}
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码!');
			}
		}, 'json');
	});
	// var record = $('#dg').datagrid('selectRow', index);

	var type;
	if (row.cardType == 1) {
		type = '次卡';
		// var times = row.totleTime - row.useTime;
		$('#countLast').val(row.useTime);
		$('#count').val(row.totleTime);
		$('#startDate').val(formatTime1(row.gmtStart));
		$('#endDate').val(formatTime1(row.gmtEnd));
		// $('#timeCard').hide();
		$('#countCard').show();
		// $('#cycleMsg').hide();
		$('#timeMsg').show();
	} else {
		type = '时效卡';
		$('#startDate').val(formatTime1(row.gmtStart));
		$('#endDate').val(formatTime1(row.gmtEnd));
		// $('#timeCard').show();
		$('#countCard').hide();
		// $('#cycleMsg').show();
		$('#timeMsg').hide();
	}
	$('#salePersonName').val(row.salesPersonName);
	$('#cardType').attr('data-id', row.id);
	$('#cardType').val(type);
	$('#cardName').val(row.cardName);
	$('#realPay').val(row.realPay);
	$('#shouldPay').val(row.shouldPay);
	$('#oldName').val(row.name);
	if (row.phone) {
		$('#oldPhone').val(row.phone);
	}
	if (row.totleTransfer) {
		$('#turnTimes').text(row.totleTransfer);
	}
	$('#gmtCreate').attr('data-time', formatTime(row.gmtCreate));
}

//客户状态
function formatStatus(value) {
	if (value) {
		if (value == 'true') {
			return '有效会员卡';
		} else {
			return '无效会员卡';
		}
	} else {
		return '未开卡';
	}
}

//标注当前行
//标注
// function formatRemark(value, row, index) {
// 	var content = value;
// 	if (value == '' || !value) return '';
// 	if (content.length > 8) {
// 		content = content.substring(0, 8) + '...';
// 	}
// 	return content;
// }

// function show(i) {
// 	if (i == 1) {
// 		//window.zk_setPosition(100,100);
// 		camera = new zk_CameraTag("iconVideo");
// 		$('#headIcon').hide();
// 		$('#iconVideo').show();
// 		camera.open();
// 	} else if (i == 2) {
// 		var base64 = camera.capture();
// 		$.post('../file/FileCenter!uploadBase64.zk', {
// 			fileType: '.jpeg',
// 			fileData: base64
// 		}, function(data) {
// 			if (data.STATUS) {
// 				var userPhoto = data.fileId; //TODO 验证图片
// 				$('#headIcon').show();
// 				$('#iconVideo').hide();
// 				$('#headIcon').attr('src', base64); //'../file/FileCenter!showImage2.zk?name='+userPhoto
// 				$("#messageImage").val(data.fileId);
// 			} else {
// 				$.messager.show({
// 					title: "消息",
// 					timeout: 1000,
// 					msg: "头像上传失败!"
// 				});
// 			}
// 		}, 'json');
// 	}
// }
//拍照
function startPhotograph(videoId) {
	if (navigator.webkitGetUserMedia) {
		$('#headIcon').hide();
		$('#' + videoId).show();
		var video = document.getElementById(videoId);
		navigator.webkitGetUserMedia({
			"video": true
		}, function(stream) {
			video.src = window.webkitURL.createObjectURL(stream);
			video.play();
		}, function() {
			$.messager.show({
				title: "消息",
				timeout: 1000,
				msg: "未安装摄像头!"
			});
		});
		return;
	} else if (navigator.getUserMedia) {
		$('#headIcon').hide();
		$('#' + videoId).show();
		var video = document.getElementById(videoId);
		navigator.getUserMedia({
			"video": true
		}, function(stream) {
			video.src = stream;
			video.play();
		}, function() {
			$.messager.show({
				title: "消息",
				timeout: 1000,
				msg: "未安装摄像头!"
			});
		});
		return;
	} else if (navigator.mozGetUserMedia) {
		$('#headIcon').hide();
		$('#' + videoId).show();
		var video = document.getElementById(videoId);
		navigator.mozGetUserMedia({
			"video": true
		}, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, function() {
			$.messager.show({
				title: "消息",
				timeout: 1000,
				msg: "未安装摄像头!"
			});
		});
		return;
	}
}

function getPhotograph(videoId, canvasId) {
	if ($('#' + videoId).css('display') == 'none')
		return;
	var video = document.getElementById(videoId);
	var canvas = document.getElementById(canvasId);
	var context = canvas.getContext("2d");
	context.drawImage(video, 0, 0, 300, 150);
	var base64 = canvas.toDataURL('image/jpeg', 1);
	$.post('../file/FileCenter!uploadBase64.zk', {
		fileType: '.jpeg',
		fileData: base64
	}, function(data) {
		if (data.STATUS) {
			var userPhoto = data.fileId; //TODO 验证图片
			$('#headIcon').show();
			$('#' + videoId).hide();
			$('#headIcon').attr('src', base64); //'../file/FileCenter!showImage2.zk?name='+userPhoto
			$("#messageImage").val(data.fileId);
		} else {
			$.messager.show({
				title: "消息",
				timeout: 1000,
				msg: "头像上传失败!"
			});
		}
	}, 'json');
}

function chooseImage(id, videoId) {
	$('#headIcon').show();
	$('#' + videoId).hide();
	document.getElementById(id).click();
}
//上传图片
function uploadImage() {
	var viewFiles = document.getElementById("file_title_img");
	//是否为图片类型            
	if (/image\/\w+/.test(viewFiles.files[0].type)) {
		//最大图片文件大小 500KB
		var imgSizeLimit = 5000 * 1024;
		if (viewFiles.files[0].size <= imgSizeLimit) {
			msgLoading();
			//上传图片
			$("#title_img_form")
				.ajaxSubmit({
					type: 'post',
					url: '../file/FileCenter!uploadImage2.zk',
					success: function(data) {
						msgLoading('close');
						data = $.parseJSON(data);
						if (data.name) {
							var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
							$("#headIcon").attr("src", imgURL);
							$("#messageImage").val(data.name);
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

//清除addFrom
function clearAddForm() {
	$('#turnCode').val('');
	$('#headIcon').attr('src', 'images/regist_pic.png');
	//	$('#userId').val('');
	$('#cardType').val('');
	$('#cardName').val('');
	$('#shouldPay').val('');
	$('#realPay').val('');
	$('#startDate').val('');
	$('#endDate').val('');
	$('#count').val(''); //次数
	$('#messageName').val('');
	$('#messagePhone').val('');
	$('#messageSex').combobox('setValue', '');
	$('#messageImage').val('');
	$('#birthDate').val('');
	$('#turnTimes').text('0');
	$('#oldName').val('');
	$('#oldPhone').val('');
	// $('#salePerson').val('');
	// $('#IDcard').val('');
	// $('#height').val('');
	// $('#weight').val('');
	// $('#position').val('');
	// $('#messageEmployer').val('');
	// $('#homeAddress').val('');
	// $('#workAddress').val('');
	// $('#remark').val('');
}

function isTelephone(obj) // 手机号正则判断
{
	var pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
	if (pattern.test(obj)) {
		return true;
	} else {
		return false;
	}
}

function checkForm() {
	var userId = transId;
	var cardType = $.trim($('#cardType').val());
	var curCardType = $('#cardType').val();
	var realPay = $.trim($('#realPay').val());
	var startDate = $.trim($('#startDate').val());
	var endDate = $.trim($('#endDate').val());
	var count = $.trim($('#count').val()); //次数
	var messageName = $.trim($('#messageName').val());
	var messagePhone = $.trim($('#messagePhone').val());
	var messageSex = $.trim($('#messageSex').combobox('getValue'));
	var messageImage = $.trim($('#messageImage').val());
	var birthDate = $.trim($('#birthDate').val());
	// var IDcard = $.trim($('#IDcard').val());
	// var height = $.trim($('#height').val());
	// var weight = $.trim($('#weight').val());
	// var position = $.trim($('#position').val());
	// var messageEmployer = $.trim($('#messageEmployer').val());
	// var homeAddress = $.trim($('#homeAddress').val());
	// var workAddress = $.trim($('#workAddress').val());
	var remark = $.trim($('#remark').val());
	if (!isTelephone(messagePhone)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请正确输入手机号!');
		$("#messagePhone").focus();
		return false;
	}
	if (!userId || userId == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码!');
		$("#userId").focus();
		return false;
	}
	if (!cardType || cardType == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员卡类型不能为空!');
		$("#cardType").focus();
		return false;
	}
	if (realPay == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额不能为空!');
		$("#realPay").focus();
		return false;
	}
	if (isNaN(realPay)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额必须为数值!');
		$("#realPay").focus();
		return false;
	}
	if (!startDate || startDate == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '起始时间不能为空!');
		$("#startDate").focus();
		return false;
	}
	if (!endDate || endDate == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '结束时间不能为空!');
		$("#endDate").focus();
		return false;
	}
	if (curCardType == '次卡') {
		if (!count || count == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '次卡使用次数不能为空!');
			$("#count").focus();
			return false;
		}
		if (isNaN(count)) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '次数必须为数值!');
			$("#count").focus();
			return false;
		}
	}
	if (!birthDate || birthDate == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '出生日期不能为空!');
		$("#birthDate").focus();
		return false;
	}
	if (!messageName || messageName == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员姓名不能为空!');
		$("#messageName").focus();
		return false;
	}
	if (!messagePhone || messagePhone == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员手机号不能为空!');
		$("#messagePhone").focus();
		return false;
	}
	if (!messageSex || messageSex == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '性别不能为空!');
		$("#messageSex").focus();
		return false;
	}
	if (!messageImage || messageImage == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员头像不能为空!');
		$("#messageImage").focus();
		return false;
	}
	// if (homeAddress.length > 32 || workAddress.length > 32 || remark.length > 32) {
	// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '最多输入32个字!');
	// 	return false;
	// }
	return true;
}
//清除显示信息
function clearShowFrom() {
	$('#memberIcon').attr('src', '../images/default.png');
	$('#realAmount').text('');
	$('#memberName').text('');
	$('#memberPhone').text('');
	$('#memberSex').text('');
	$('#memberAge').text('');
	$('#salePerson').text('');
	// $('#memberIDCard').text('');
	// $('#memberHeight').text('');
	// $('#memberWeight').text('');
	// $('#memberProfession').text('');
	// $('#memberEmployer').text('');
	// $('#memberName').text('');
	// $('#memberAddress').text('');
	// $('#memberEmployerAddress').text('');
	$('#memberCardType').text('');
	$('#memberCardName').text('');
	$('#gmtCreate').text('');
	$('#gmtModify').text('');
}
//展示信息
function showMessage() {
	clearShowFrom();
	if (checkForm()) {
		$('.chooseBtn').show();
		//		console.log($('#messageName').val());
		$('#memberIcon').attr('src', '../file/FileCenter!showImage2.zk?name=' + $.trim($('#messageImage').val()));
		$('#realAmount').text($.trim($('#realPay').val()));
		$('#memberName').text($('#messageName').val());
		$('#memberPhone').text($.trim($('#messagePhone').val()));
		$('#memberSex').text($.trim($('#messageSex').combobox('getText')));
		$('#salePerson').text($('#salePersonName').val());
		if ($('#birthDate').val()) {
			var birth = $('#birthDate').val().split('-')[0];
			var date = new Date();
			$('#memberAge').text(date.getFullYear() - parseInt(birth));
		} else {
			$('#memberAge').text('0');
		}
		// $('#memberIDCard').text($.trim($('#IDcard').val()));
		// $('#memberHeight').text($.trim($('#height').val() + 'cm'));
		// $('#memberWeight').text($.trim($('#weight').val() + 'kg'));
		// $('#memberProfession').text($.trim($('#position').val()));
		// $('#memberEmployer').text($.trim($('#messageEmployer').val()));
		// $('#memberAddress').text($.trim($('#homeAddress').val()));
		// $('#memberEmployerAddress').text($.trim($('#workAddress').val()));
		//		$('#memberName').text($.trim($('#remark').val()));
		$('#memberCardType').text($('#cardType').val());
		$('#memberCardName').text($('#cardName').val());
		$('#gmtCreate').text($('#gmtCreate').attr('data-time'));
		$('#gmtModify').text(new Date().format("yyyy-MM-dd hh:mm:ss"));
		$('#dlgMessage').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;请确认转卡信息");
		$('#gmtStart').text($('#startDate').val());
		$('#gmtEnd').text($('#endDate').val());
		$('#msgCountLast').text($('#countLast').val());
		$('#msgCountTotle').text($('#count').val());
	}
}

function chooseSure(dlgId) {
	saveMessage();
}

function chooseCancle(dlgId) {
	$('#' + dlgId).dialog('close');
}
//保存信息
function saveMessage() {
	$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;转卡确认', '请确认双方信息，确认转卡？', function(r) {
		if (r) {

			if (checkForm) {
				msgLoading();
				var data = {};
				data.userId = transId;
				//		data.cardId = $.trim($('#cardType').combobox('getValue'));
				data.memberId = $('#cardType').attr('data-id');
				//		data.realPay = $.trim($('#realPay').val());
				if ($('#startDate').val()) {
					data.gmtStart = $.trim($('#startDate').val()) + ' 00:00:00';
				}
				if ($('#endDate').val()) {
					data.gmtEnd = $.trim($('#endDate').val()) + ' 00:00:00';
				}

				data.totleTime = $.trim($('#count').val()); //次数
				data.name = $.trim($('#messageName').val());
				data.phone = $.trim($('#messagePhone').val());
				data.sex = $.trim($('#messageSex').combobox('getValue'));
				data.photo = $.trim($('#messageImage').val());
				if ($('#birthDate').val()) {
					data.gmtBirth = $.trim($('#birthDate').val()) + " 00:00:00";
				}

				// data.idCard = $.trim($('#IDcard').val());
				// data.height = $.trim($('#height').val());
				// data.weight = $.trim($('#weight').val());
				// data.job = $.trim($('#position').val());
				// data.address = $.trim($('#messageEmployer').val());
				// data.homeAddress = $.trim($('#homeAddress').val());
				// data.workUnitAddress = $.trim($('#workAddress').val());
				// data.remark = $.trim($('#remark').val());

				$.post('../ngym/GymMembersAction!transfer.zk', data, function(data) {
					msgLoading('close');
					if (data.STATUS) {
						$('#dlgMessage').dialog('close');
						$('#dlgTrans').dialog('close');
						clearAddForm();
						toSearch();
					} else {
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
					}
				}, 'json');
			}
		}
	})
}