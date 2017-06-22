function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
var games = []; //比赛模板
var gameSel = '';
$(function() {
	$('body').css('height', $(window).height()); //设置body的高度
	$('body').css('width', $(window).width());
	var height1 = $(window).height();
	var width1 = $(window).width();
	$('#center-region').css({
		'width': width1
	});
	$('#showMessage').css({
		'width': '100%',
		'height': $(window).height()
	});
	if (parseInt($('#showMessage').css('width')) > 660) $('#filter').css({
		'padding-left': parseInt($('#showMessage').css('width')) - 660
	});
	$(window).resize(function() {
		$('body').css('height', $(window).height()); //设置body的高度
		$('body').css('width', $(window).width());
		var height0 = $(window).height();
		var width0 = $(window).width();
		$('#center-region').css({
			'width': width0
		});
		$('#showMessage').css({
			'width': '100%',
			'height': height0
		});
		$('.datagrid-view2').css({
			'width': '100%'
		});
		$('.datagrid-view2').children('.datagrid-header').children('.datagrid-header-inner').children('.datagrid-htable').children('tbody').children('.datagrid-header-row').css({
			'width': parseInt($('#showMessage').css('width')) - 30
		});
		if (parseInt($('#showMessage').css('width')) > 660) $('#filter').css({
			'padding-left': parseInt($('#showMessage').css('width')) - 660
		});
	});
	$('#hideDiv').hide();
	$('#dg').datagrid({
		onLoadSuccess: function(data) {
			if (data.total == 0 && data.ERROR == '未登录') {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!', 'error');
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
			$("a.popImage").fancybox({
				openEffect: 'elastic',
				closeEffect: 'elastic'
			});
		},
		onLoadError: function() {
			//alert('出错啦');
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
	$.post('../ngym/FatburnGameAction!listTemps.zk', {}, function(data) {
		if (data.STATUS) {
			var rows = data.gameTemps;

			//			roles.push();
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				var game = {
					"id": i,
					"code": row.code,
					"info": row.info,
					"name": row.name,
					"type": row.type
				};
				games.push(game);
			}

			$('#gameMod').combobox({
				valueField: 'id',
				textField: 'name',
				data: games,
				onSelect: function(rec) {
					gameSel = games[rec.id].code;
					$('#gameInfo').val(games[rec.id].info);
					// $('#gameInfo').val('12hiuasjioafhiuqhfiehfiauhdjiqwufebiufqweiufndsajfnuih,ashiufidhi');
					// $('#gameEquip').val(games[rec.id].type);
					var equips = [];
					for (var i = games[rec.id].type.length - 1; i >= 0; i--) {
						var equip = games[rec.id].type[i];
						var name;
						switch (equip) {
							case 'bike':
								name = '动感单车';
								break;
							case 'stepper':
								name = '踏步机';
								break;
							case 'treadmill':
								name = '跑步机';
								break;
							default:
								name = '';
								break;
						}
						var type = {
							'id': equip,
							'name': name
						}
						equips.push(type);
					}
					$('#gameEquip').combobox({
						valueField: 'id',
						textField: 'name',
						data: equips
					});
					$('#gameEquip').combobox('select', equips[0].id);
				}
			});
		} else {
			if (data.total == 0 && data.ERROR == '未登录') {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
				relogin();
			}
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
});

$('#borrowSearchKind').combobox({
	onSelect: function() {
		searchMemberCard();
	}
})

function newMemberCard() {

	$('#fm').form('clear');
	$('#dlg').dialog('open').dialog('setTitle', '&nbsp;&nbsp;添加比赛');
	// $("#imghead").attr("src", 'images/yun.png');
	url = '../ngym/FatburnGameAction!add.zk';
}

function destroyMemberCard() {
	var row = $('#dg').datagrid('getSelected');
	if (row) {
		if (row.isAudited == 1) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '比赛已通过审核，无法删除!');
		} else {
			$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;删除确认', '确认删除这条比赛吗？', function(r) {
				if (r) {
					$.getJSON('../ngym/FatburnGameAction!delete.zk', {
						id: row.id
					}, function(data) {
						if (data.STATUS) {
							$('#dg').datagrid('reload');
							//showTip("删除成功!");
							// $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;信息', '删除成功!');
							$.messager.show({
								title: "&nbsp;&nbsp;消息",
								timeout: 2000,
								msg: "删除成功!"
							});
						} else {
							//showTip("删除失败!");
							if ('No Login!' == data.ERROR) {
								loginTimeout();
								return;
							}
							$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '删除失败!');
						}
					});
				}
			});
		}
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择比赛!');
	}
}

function saveMemberCard() {
	if (checkForm()) {
		msgLoading();
		clearSpecialStr('fm');
		$.post(url, data, function(data) {
			msgLoading('close');
			if (data.STATUS) {
				$('#dlg').dialog('close'); // close the dialog
				$('#dg').datagrid('reload'); // reload the user data
			} else {
				if ('No Login!' == data.ERROR) {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '保存失败!');
			}
		}, 'json');
	}
}
var data = {};

function checkForm() {
	// var name = $.trim($("#name").val());
	data.code = gameSel;
	if (data.code == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择比赛类型!');
		$("#gameMod").focus();
		return false;
	}
	var type = $.trim($('#gameEquip').combobox('getValue'));
	if (type == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择所需器材!');
		$("#gameEquip").focus();
		return false;
	}
	data.gameUrl = $.trim($("#gameUrl").val());
	/*if (data.gameUrl == ) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入比赛链接!');
		$("#cycleNum").focus();
		return false;
	}*/
	data.seconds = $.trim($("#cycleNum").textbox('getValue')) * 60;
	if (data.seconds == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入比赛时长!');
		$("#cycleNum").focus();
		return false;
	}
	if (isNaN(data.seconds)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '比赛时长必须为数值!');
		$("#cycleNum").focus();
		return false;
	}
	if (data.seconds < 0) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '比赛时长必须为正数!');
		$("#cycleNum").focus();
		return false;
	}
	data.gmtStart = $("#startDate").val();
	if (data.gmtStart == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择比赛开始时间!');
		return false;
	}
	data.gmtEnd = $("#endDate").val();
	if (data.gmtEnd == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择比赛结束时间!');
		return false;
	}
	var end = new Date(data.gmtEnd.replace(/-/g, "/"));
	var start = new Date(data.gmtStart.replace(/-/g, "/"));
	if (end.getTime() - start.getTime() < data.seconds * 1000) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请正确输入比赛时间!');
		return false;
	}
	data.cover = $('#image').val();
	return true;
}

function formatTime(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd hh:mm");
}

function formatEquip(value) {
	var name;
	switch (value) {
		case 'bike':
			name = '动感单车';
			break;
		case 'stepper':
			name = '踏步机';
			break;
		case 'treadmill':
			name = '跑步机';
			break;
		default:
			name = '无数据';
			break;
	}
	return name;
}

function openIframe(id) {
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择比赛!');
		return;
	}
	var url = '../game/fatburn_game.html?gameId=' + row.id;
	$('#iframeCont').attr('src', url);
	$('#iframeInfo').dialog('open');
}

function formatInfo(value) {
	var info = '<a href="javascript:;" id="gameLink" onclick="openIframe(\'' + value + '\')">查看</a>'
	return info;
}

function formatState(value, row) {
	var state;

	if (!!value && value == 1) {
		var today = new Date();
		var now = today.getTime();
		if (now >= row.gmtStart) {
			state = now > row.gmtEnd ? '<span style="color:#F45A5D">结束</span>' : '<span style="color:#3fc371">比赛中</span>';
		} else {
			state = '<span style="color:#5DB0F4">热身中</span>'
		}
	} else {
		switch (value) {
			case 1:
				state = state;
				break;
			case 2:
				state = '审核未通过';
				break;
			case 0:
				state = '审核中';
				break;
			default:
				state = '审核中';
				break;
		}
	}
	return state;
}

function formatCount(value) {
	var time = value / 60 + '分钟';
	return time;
}

function searchMemberCard() {
	// var type = $("#memberCard").combobox("getValue");
	var name = $("#borrowSearchKind").combobox('getValue');
	// var name = $("#txt_word").searchbox("getValue");
	$("#dg").datagrid('load', {
		name: name
			// type: type
	});
	// $("#txt_word").searchbox("setValue", '');
}

function chooseImage2(id) {
	document.getElementById(id).click();
}

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
			$("#title_img_form").ajaxSubmit({
				type: 'post',
				url: '../file/FileCenter!uploadImage2.zk',
				success: function(data) {
					msgLoading('close');
					data = $.parseJSON(data);
					if (data.name) {
						var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
						$("#imghead").attr("src", imgURL);
						$("#image").val(data.name);
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