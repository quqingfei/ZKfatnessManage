//var setInt = self.setInterval("isOk()",300);
function localTime() {
	//setTimeout('localTime()',50);
}

function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
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
				'margin': 100,
				'autoScale': false,
				'autoDimensions': false,
				'imageScale': false,
				'openEffect': 'elastic',
				'closeEffect': 'elastic'
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
	var levels = [];
	for (var i = 0; i <= 100; i++) {
		var level = {
			'text': i,
			'value': i
		}
		levels.push(level);
	}
	$('#weight').combobox({
		data: levels
	});
	$("#memberCard").combobox('unselect', '');
	$("#memberCard").combobox('setText', '全部');
});
var ISAPP = 'y';
$('#dg').datagrid({
	rownumbers: true,
	singleSelect: true,
	pagination: true,
	pageSize: '30',
	queryParams:{isShowApp:ISAPP},
	url: '../ngym/GymMembersCardAction!list.zk',
	method: 'post',
	onLoadSuccess: function(data) {
		if (data.ERROR == '未登录') { // (data.total == 0 &&
			// data.ERROR == 'No Login!')
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
			relogin();
		}
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
$('#chooseCard').combobox({
	onChange: function(n, o) {
		if (n == 1) {
			$('.chooseimg').html("<img title='图片' style='width:164px;margin-left:85px;margin-top:5px;cursor:pointer;' src='../file/FileCenter!showImage2.zk?name=2016520-165539129.jpg'/>");
			$("#image").val('2016520-165539129.jpg');
			$('#showImgDiv').hide();
		} else if (n == 2) {
			$('.chooseimg').html("<img title='图片' style='width:164px;margin-left:85px;margin-top:5px;cursor:pointer;' src='../file/FileCenter!showImage2.zk?name=2016520-165539130.jpg'/>");
			$("#image").val('2016520-165539130.jpg');
			$('#showImgDiv').hide();
		} else if (n == 3) {
			$('.chooseimg').html("<img title='图片' style='width:164px;margin-left:85px;margin-top:5px;cursor:pointer;' src='../file/FileCenter!showImage2.zk?name=2016520-165539132.jpg'/>");
			$("#image").val('2016520-165539132.jpg');
			$('#showImgDiv').hide();
		} else if (n == 4) {
			$('.chooseimg').html("");
			$('#showImgDiv').show();
		}
	}
})
$('#type').combobox({
	onChange: function(n, o) {
		if (n == "cycle") {
			$('#cycleDiv').show();
			$('#timesDiv').hide();
			$('#unitDiv').show();
			//			$("#unit").textbox('setValue', 'day');
			$("#cycle").textbox('setValue', '');
			//alert($("#times").combobox('getValues'));
			//$("#times").combobox('setValue',$("#times").combobox('getValue'));
			//alert($('#type').combobox('getValue'));
		} else if (n == "times") {
			$('#cycleDiv').hide();
			$('#timesDiv').show();
			$('#unitDiv').hide();
			$("#unit").combobox('setValue', '');
			//$("#times").attr("value",0);
			$("#times").textbox('setValue', '');
			//$("#cycle").combobox('setValue',$("#cycle").combobox('getValue'));
			//alert($('#times').combobox('getValue'));
		}
	}
});

function onOver(id) {
	$('#' + id).css({
		color: '#FFD600'
	});
}

function toOut(id) {
	$('#' + id).css({
		color: '#fff'
	});
}

function newMemberCard() {

	$('#fm').form('clear');
	$('#chooseCard').combobox('setValue', '1');
	$('#type').combobox('setValue', 'times');
	$('#unit').combobox('setValue', 'd');
	$('#dlg').dialog('open').dialog('setTitle', '&nbsp;&nbsp;&nbsp;&nbsp;添加会员卡信息');
	$("#imghead").attr("src", 'images/yun.png');
	//url = 'MemberCardAction!createOrUpdate.zk';
	url = '../ngym/GymMembersCardAction!add.zk';
}

function editMemberCard() {
	var row = $('#dg').datagrid('getSelected');
	if (row) {
		$('#dlg').dialog('open').dialog('setTitle', '&nbsp;&nbsp;&nbsp;&nbsp;编辑会员卡信息');
		$('#remark').textbox('setValue', '');
		$('#fm').form('clear');
		$('#fm').form('load', row);
		// console.log(row)
		if (row.type == 1) {
			$('#cycleDiv').hide();
			$('#timesDiv').show();
			$('#unitDiv').hide();
			$('#type').combobox('setText', '次卡');
			$('#type').combobox('setValue', 'times');
			$("#times").textbox('setValue', row.count);
		} else {
			$('#cycleDiv').show();
			$('#timesDiv').hide();
			$('#unitDiv').show();
			$('#type').combobox('setText', '时效卡');
			$('#type').combobox('setValue', 'cycle');
			$("#cycleNum").textbox('setValue', row.count);
		}
		if (row.image == '2016520-165539129.jpg') {
			$('#chooseCard').combobox('setValue', '1');
		} else if (row.image == '2016520-165539130.jpg') {
			$('#chooseCard').combobox('setValue', '2');
		} else if (row.image == '2016520-165539132.jpg') {
			$('#chooseCard').combobox('setValue', '3');
		} else {
			$('#chooseCard').combobox('setValue', '4');
		}

		if (row.image == '' || !row.image) {
			$("#imghead").attr("src", 'images/yun.png');
			$("#image").val('');
		} else {
			var imgURL = "../file/FileCenter!showImage2.zk?name=" + row.image;
			$("#imghead").attr("src", imgURL);
			$("#image").val(row.image);
		}
		url = '../ngym/GymMembersCardAction!update.zk?id=' + row.id;
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要编辑的会员卡!');
	}

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
		var imgSizeLimit = 5000 * 1024;
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

function destroyMemberCard() {
	var row = $('#dg').datagrid('getSelected');
	if (row) {
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;删除确认', '确认删除' + row.name + '吗？', function(r) {
			if (r) {
				$.getJSON('../ngym/GymMembersCardAction!delete.zk', {
					id: row.id
				}, function(data) {
					if (data.STATUS) {
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;信息', '删除成功!');
						$('#dg').datagrid('reload');
					} else {
						if ('未登录' == data.ERROR) {
							loginTimeout();
							return;
						}
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '删除失败!');
					}
				});
			}
		});
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择会员卡!');
	}
}

function saveMemberCard() {
	if (checkForm()) {
		//		var id = $('#id').val();
		msgLoading();
		clearSpecialStr('fm');
		var name = $('#name').textbox('getValue');
		//		console.log(name);
		var typevalue = $('#type').combobox('getValue');
		//		console.log(typevalue);
		//		var cycle = $('#cycle').combobox('getValue');
		//		var times = $('#times').combobox('getValue');
		var count;
		var type;
		if (typevalue == 'cycle') {
			count = $('#cycleNum').textbox('getValue');
			type = 0;
		} else {
			count = $('#times').textbox('getValue');
			type = 1;
		}
		// console.log(count);
		var price = $('#price').textbox('getValue');
		var minPrice = $('#minPrice').textbox('getValue');
		var unit = $('#unit').combobox('getValue');
		var image = $('#image').val();
		var isShowApp = $('#isShowApp').combobox('getValue');
		$.post(url, {
			//			id: id,
			name: name,
			type: type,
			weight: $('#weight').combobox('getValue'),
			remark: $('#remark').textbox('getValue'),
			//			cycle: cycle,
			//			times: times,
			isShowApp: isShowApp,
			minPrice:minPrice,
			count: count,
			price: price,
			unit: unit,
			image: image
		}, function(data) {
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
				/*$.messager.show({
				    title: '错误',
				    msg: '系统繁忙！'
				});*/
			}
		}, 'json');

		/*
				 $('#fm').form('submit',{
	                 url: url,
	                 onSubmit: function(){
	                     return checkForm();
	                 },
	                 success: function(result){
	                	 var result = eval('('+result+')');
	                     if (result.STATUS){
	                         $('#dlg').dialog('close');        // close the dialog
	                         $('#dg').datagrid('reload');    // reload the user data
	                     } else {
	                         $.messager.show({
	                             title: '错误',
	                             msg: '系统繁忙！'
	                         });
	                     }
	                 }
	             });*/
	}
}
//非零正整数
var myreg = /^\+?[1-9][0-9]*$/;

function checkForm() {
	var name = $.trim($("#name").val());
	if (name == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员卡名称不能为空!');
		$("#name").focus();
		return false;
	}
	if (name.length > 30) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员卡名称长度不能超过30位!');
		$("#name").focus();
		return false;
	}
	var type = $.trim($('#type').combobox('getValue'));
	if (type == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员卡类型不能为空!');
		$("#type").focus();
		return false;
	}
	if (type == 'cycle') {
		var cycle = $.trim($('#cycleNum').textbox('getValue'));
		var unit = $('#unit').combobox('getValue');
		if (cycle == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员卡时间不能为空!');
			$("#cycle").focus();
			return false;
		} else if (!myreg.test(cycle)) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '时间为非零正整数!');
			$("#cycle").focus();
			return false;
		}
		if (unit == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '时间单位不能为空!');
			$("#unit").focus();
			return false;
		}
	} else {
		var times = $.trim($('#times').textbox('getValue'));
		if (times == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员卡次数不能为空!');
			$("#times").focus();
			return false;
		} else if (!myreg.test(times)) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员卡次数为非零正整数!');
			$("#times").focus();
			return false;
		}
	}
	var price = $.trim($("#price").textbox('getValue'));
	var minPrice = $.trim($("#minPrice").textbox('getValue'));
	if (price == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '价格不为空!');
		$("#price").focus();
		return false;
	} else if (Number(price) < 0) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '价格不能小于0!');
		$("#price").focus();
		return false;
	}
	if (minPrice == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '底价不为空!');
		$("#minPrice").focus();
		return false;
	} else if (Number(minPrice) < 0) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '底价不能小于0!');
		$("#minPrice").focus();
		return false;
	}else if(Number(minPrice)>Number(price)){
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '底价不能大于价格(售价)!');
		$("#minPrice").focus();
		return false;
	}
	var remark = $('#remark').textbox('getValue');
	if (remark.length > 100) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注不能超过100个字!');
		return false;
	}
	var images = $("#image").val();
	if (images == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择一张图片!');
		return false;
	}
	return true;
}

function formatAdd(value, row) {
	var unit;
	switch (row.unit) {
		case 'y':
			unit = '年';
			break;
		case 'M':
			unit = '月';
			break;
		case 'd':
			unit = '天';
			break;
		default:
			unit = '';
			break;
	}
	switch (row.type) {
		case 0:
			return value ? (value + unit) : '';
		case 1:
			return value ? (value + '次') : '';
		default:
			return '';
	}
}

function formatShow(value) {
	switch (value) {
		case 'y':
			return '<span style="color:#3fc371">上架</span>';
		case 'n':
			return '<span style="color:#D5D5D5">下架</span>';
		default:
			return '';
	}
}

function formatType(value) {
	switch (value) {
		case 0:
			return '时效卡';
		case 1:
			return '次卡';
		default:
			return '';
	}
}

function formatImage(value) {
	if (value == '' || !value)
		return '暂无图片';
	else {
		return "<a class=\"popImage\" href='../file/FileCenter!showImage2.zk?name=" + value + "'>" + "<img title='图片' style='width:30px;height:20px;margin:0 auto;display:block;cursor:pointer;' src='../file/FileCenter!showImage2.zk?name=" + value + "'/>" + "</a>";
	}

}
//用户筛选事件,自动搜索
$("#memberCard").combobox({
	// onUnselect: function(n, o) {
	// 	searchMemberCard();
	// 	$("#memberCard").clear();
	// },
	onSelect: function(rec) {
		searchMemberCard();
		// var text = $("#memberCard").combobox('getText');
		// $("#memberCard").combobox('unselect', $("#memberCard").combobox('getValue'));
		// $("#memberCard").combobox('setText', text);
	}
});

$("#isJia").combobox({
	onSelect: function(rec) {
		searchMemberCard();
		// var text = $("#isJia").combobox('getText');
		// $("#isJia").combobox('unselect', $("#isJia").combobox('getValue'));
		// $("#isJia").combobox('setText', text);
	}
});

function searchMemberCard() {
	var type = $("#memberCard").combobox("getValue");
	var isShowApp = $("#isJia").combobox("getValue");
	var name = $("#txt_word").searchbox("getValue");
	$("#dg").datagrid('reload', {
		name: name,
		type: type,
		isShowApp: isShowApp
	});
	$("#txt_word").searchbox("setValue", '');
}