function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}

var dutySel;
var dutyId;
var hjSel, jlSel;
var hjId, jlId;
$(function() {
	setTimeout(function() {
		$('#dg').datagrid({
			rownumbers: true,
			// sortName: 'gmtModify',
			singleSelect: false,
			pagination: true,
			pageSize: '30',
			queryParams:{orderByDesc:'gmtCreate'},
			url: '../ngym/GymCustomerAction!list.zk',
			method: 'post',
			onLoadSuccess: function(data) {
				if (data.ERROR == '未登录') { // (data.total == 0 &&
					// data.ERROR == 'No Login!')
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
		relogin();
	}
				// 图片弹出层
				$("a.popImage").fancybox({
					openEffect: 'elastic',
					closeEffect: 'elastic'
				});
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
	}, 100)
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
	// $('#birthDateNew').combobox({
	// 	valueField: 'id',
	// 	textField: 'year',
	// 	data: years
	// });
	// getMembersCard();
/*	$.post('../ngym/GymEmployeesAction!list.zk', {
		page: 1,
		rows: 1000
	}, function(data) {
		if (data.ERROR == '未登录') {
			loginTimeout();
			//			login();
			return;
		}
		if (data.STATUS) {
			var rows = data.rows;
			var makers = [];
			var sales = [];
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				var maker = {
					"id": row.userId,
					"duty": row.realName
				};
				makers.push(maker);
				sales.push(maker);
			}
			makers.push({
				"id": '',
				"duty": '全部'
			});
			sales.push({
				"id": '',
				"duty": '无'
			});
			$('#roleSel').combobox({
				valueField: 'id',
				textField: 'duty',
				data: makers,
				onSelect: function(rec) {
					dutySel = rec.duty;
					dutyId = rec.id;
					searchUser(curStatus);
				}
			});
			$('#hjSel').combobox({
				valueField: 'id',
				textField: 'duty',
				data: sales,
				onSelect: function(rec) {
					hjSel = rec.duty;
					hjId = rec.id;
				}
			});
			$('#hjSelNew').combobox({
				valueField: 'id',
				textField: 'duty',
				data: sales,
				onSelect: function(rec) {
					hjSel = rec.duty;
					hjId = rec.id;
				}
			});
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');*/
$.post('../ngym/GymEmployeesAction!listSale.zk', {
	page: 1,
	rows: 1000,
	duty: '会籍'
}, function(data) {
	if (data.ERROR == '未登录') {
		loginTimeout();
			//			login();
			return;
		}
		if (data.STATUS) {
			var rows = data.rows;
			var makers = [];
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				var maker = {
					"id": row.userId,
					"duty": row.realName
				};
				$('#guijiguwenselect').append('<option value='+row.userId+','+row.realName+'>'+row.realName+'</option>');
				$('#huijiselect').append('<option value='+row.userId+'>'+row.realName+'</option>');
				makers.push(maker);
			}
			makers.push({
				"id": '',
				"duty": '无'
			});
			$('#hjSel').combobox({
				valueField: 'id',
				textField: 'duty',
				data: makers,
				onSelect: function(rec) {
					jlSel = rec.duty;
					jlId = rec.id;
				}
			});

		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');

$('#hideDiv').hide();
$('#soieudt').focus();
$('#soieudt').keydown(function(e) {
	var sd = $(this).val();
	  	if (event.keyCode == "13") {//keyCode=13是回车键
	  		if((/^1[34578]\d{9}$/.test(sd))){
	  			$("#dg").datagrid('load', {phone:sd});
	  		}else{
	  			$("#dg").datagrid('load', {name:sd});
	  		}
	  	}

	  });
	// $('#allUser').trigger('click');
});
function sendMonthEval(){
	http://localhost/fatburn/ngym/GymMembersAction!pushMonthEvaluation.zk
	$.ajax({
		type:'post',
		dataType:'json',
		url:'../ngym/GymMembersAction!pushMonthEvaluation.zk',
		success: function(res){
			if(res.STATUS){
				$.messager.show({
					title:'消息提示',
					msg:res.INFO,
					timeout:3000,
					showType:'slide'
				});
				$('#dlgSend').dialog('close');
			}else{				
				$.messager.show({
					title:'消息提示',
					msg:res.INFO,
					timeout:3000,
					showType:'slide'
				});
				$('#dlgSend').dialog('close');
			}			
		}
	})

}
$('#huijiselect').change(function(res){
	var idsi = {saleId:$('#huijiselect').val(),status:$('#sechselect').val(),orderByDesc: 'gmtCreate',inviteStatus:$('#linechange').val()};
	if($('#startDate').val() != '' && $('#endDate').val() != ''){
		idsi.createStart= $('#startDate').val()+" 00:00:00";
		idsi.createEnd= $('#endDate').val()+" 23:59:59";
	}
	$("#dg").datagrid('load', idsi);
})
function openSend(){
	$('#dlgSend').dialog('open').dialog('setTitle',"&nbsp;&nbsp;推送月度评价");
}
function openTit(){
	$.ajax({
		type:'post',
		dataType:'json',
		url:'../gym/userAction!noticeNoSignUserCount.zk',
		success: function(res){
			$('#overindes').text(res.count);
		}
	})
	$('#dlgOver').dialog('open').dialog('setTitle',"&nbsp;&nbsp;通知未到用户");
}
function overTitMessage(){
	$.ajax({
		type:'post',
		dataType:'json',
		url:'../gym/userAction!noticeNoSignUser.zk',
		success: function(res){
			if(res.STATUS){
				$.messager.show({
					title:'消息提示',
					msg:'通知成功',
					timeout:3000,
					showType:'slide'
				});
				$('#dlgOver').dialog('close');
			}else{				
				$.messager.show({
					title:'消息提示',
					msg:'通知失败',
					timeout:3000,
					showType:'slide'
				});
				$('#dlgOver').dialog('close');
			}			
		}
	})
}
function onlyNum() {
	if (!(event.keyCode == 46) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 39))
		if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)))
			event.returnValue = false;
	}

	$('#ageStart').bind('input propertychange', function() {
		if ($('#ageStart').val() - 100 > 0) {
			$('#ageStart').val(100);
		}
	})

	$('#ageStart').blur(function() {
		if (!!$('#ageEnd').val() && $('#ageStart').val() - $('#ageEnd').val() > 0) {
			$('#ageStart').val($('#ageEnd').val());
		}
	})

	$('#ageEnd').bind('input propertychange', function() {
		if ($('#ageEnd').val() - 100 > 0) {
			$('#ageEnd').val(100);
		}
	})

	$('#ageEnd').blur(function() {
		if (!!$('#ageStart').val() && $('#ageStart').val() - $('#ageEnd').val() > 0) {
			$('#ageEnd').val($('#ageStart').val());
		}
	})
	$('#nickName').blur(function() {
		if ($('#nickName').val().length > 10) {
			$('#nickName').val($('#nickName').val().substring(0, 10));
		}
	})
	$('#searchBtn').click(function() {
		searchUser(curStatus);
	})
	// 监听鼠标事件--回车
	// 注册
	document.getElementById('toAllMessage').onkeydown = function(event) {
	var event = event || window.event; // 这里的event兼容跟上面不同，关于event的兼容，请猛戳这里
	if (event.keyCode == 13) {
		if ($('#toAllMessage').val().trim().length > 200) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '信息长度不得超过200个字符');
			return false;
		}
		if ($('#dlg0').css('display') == 'block') {
			event.preventDefault();
			sendAllMessage();
			return false;
		}
	}
};

var remarkUserId;
var curRow; // 当前行
var remark = [];
var curRowIndex;

function remarkEdit(value, index) {
	curRowIndex = index;
	var div = document.getElementById("remarkList");
	while (div.hasChildNodes()) // 当div下还存在子节点时 循环继续
	{
		div.removeChild(div.firstChild);
	}
	$("#" + 'remarkMessage').attr('value', '');
	$("#userId").attr('value', value);
	var record = $('#dg').datagrid('selectRow', index);
	var row = $('#dg').datagrid('getSelected');
	if (row) {
		$('#dlg').dialog('open').dialog('setTitle',
			"&nbsp;&nbsp;" + row.nickName + "的标注");
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
	// alert(JSON.stringify(remark));
}

function saveRemark() {
	// var value = $("#"+'remarkMessage').textbox('getValue');
	var value = $.trim($("#" + 'remarkMessage').val());
	if (value.length > 10) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '长度不能超过10！');
		return;
	}
	if ($.trim(value) != '')
		remark.push($.trim(value));
	// alert(JSON.stringify(remark));
	var string = JSON.stringify(remark);
	$("#remark").attr("value", "");
	$("#remark").val(string);
	$.post('userAction!remark.zk', {
		userId: remarkUserId,
		remark: string
	}, function(data) {
		if (data.STATUS) {
			// $('#dlg').dialog('close'); // close the dialog
			// $('#dg').datagrid('reload');// reload the user data
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
			// $($(curRow.remark).children("div")[0]).html("<span>hah1</span>");//"<div
			// style='width:100%;height:100%;text-align:center;'
			// onclick=\"remarkEdit('"+curRow.user_id+"',"+curRowIndex+");\">"+result+"</div>";
			$("#" + 'remarkMessage').val('');
			$('#dg').datagrid('refreshRow', curRowIndex);

			// alert("保存成功");

		} else {
			if ('No Login!' == data.ERROR) {
				loginTimeout();
				return;
			}
		}
	}, 'json');

}

function compareDate(ds, de) {
	if (ds == '' || de == '') {
		return false;
	} else {
		return ((new Date(ds.replace(/-/g, "\/"))) > (new Date(de.replace(/-/g, "\/"))));
	}
}

var curId = 'allUser';

function onOver(id) {
	if (curId == '' || curId != id) {
		$('#' + id).css({
			color: '#3fc371'
		});
	}
}

function toOut(id) {
	if (curId == '' || curId != id)
		$('#' + id).css({
			color: '#fff'
		});
}
var curStatus;

function toChooseUser(id, value) {
	if (curId != '')
		$('#' + curId).css({
			color: '#fff'
		});
	$('#' + id).css({
		color: '#3fc371'
	});
	userTypeT = $('#' + id).attr("data-value");
	curId = id;
	curStatus = value;
	$('#dg').datagrid('clearChecked');
	searchUser(value);
}
function formatNY(val){
	if(val==0){
		return "是";
	}
	if(val == 1){
		return "否"
	}
}
var ifsle = "";
function openHj() {
	ifsle="";
	if ($('#dg').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行操作，请重新选择。');
		return false;
	}
	var row = $('#dg').datagrid('getSelected');
	
	if (!!row) {
		if(row.saleId=="" || typeof(row.saleId)=="undefined"){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '所选用户没有分配会籍无法进行操作！');
			return false;
		}
		$('.linkma .linkji').eq(0).trigger('click');
		$('#linktime').val("");
		$('#linkarea').val("");
		$('#rectime').val("");
		$('#recarea').val("");
		ifsle=row.id;
		var linkname = $('#linkname').val(row.saleName);
		var recname = $('#recname').val(row.name);     	
		$('#dglink').datagrid({
			queryParams:{customerId:ifsle,orderByDesc:'gmtCreate'},
			rownumbers: true,
			// sortName: 'gmtModify',
			singleSelect: false,
			pagination: true,
			pageSize: '4',
			url: '../ngym/GymCustomerRecordAction!list.zk',
			method: 'post',
			onLoadSuccess: function(data) {
				if (data.ERROR == '未登录') { // (data.total == 0 &&
					// data.ERROR == 'No Login!')
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
		relogin();
	}
				// 图片弹出层
				$("a.popImage").fancybox({
					openEffect: 'elastic',
					closeEffect: 'elastic'
				});
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
		$('#dgrecord').datagrid({
			rownumbers: true,
			singleSelect: false,
			pagination: true,
			pageSize: '30',
			queryParams:{customerId:ifsle,orderByDesc:'gmtCreate'},
			url: '../ngym/GymCustomerInvitationAction!list.zk',
			method: 'post',
			onLoadSuccess: function(data) {
				if (data.ERROR == '未登录') { // (data.total == 0 &&
					// data.ERROR == 'No Login!')
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
		relogin();
	}
	$('#dg12345').datagrid('doCellTip', {
					onlyShowInterrupt: false, // 是否只有在文字被截断时才显示tip，默认值为false
					position: 'bottom', // tip的位置，可以为top,botom,right,left
					cls: {
						'background-color': '#FFF'
					}, // tip的样式D1EEEE
					delay: 100
						// tip 响应时间
					});
				// 图片弹出层
				$("a.popImage").fancybox({
					openEffect: 'elastic',
					closeEffect: 'elastic'
				});
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
$('#dlgHj').dialog({title: "<div style='float:left'>&nbsp;&nbsp;&nbsp;&nbsp;沟通管理&nbsp;&nbsp;&nbsp;&nbsp;"+row.name+"</div>\
	<span id='linkmanage'><div class='sendMessage' style='float:left;margin-left:20px;' onclick='linkadd()'><img alt='' class='sendImg' src='images/addNew1.png'><span style='margin-left:5px;'>新增</span></div>\
	<div class='sendMessage' style='float:left;' onclick='linkedit()'><img alt='' class='sendImg' src='images/editAccount.png'><span style='margin-left:5px;'>修改</span></div>\
	<div class='sendMessage' style='float:left;' onclick='deleteFun()'><img alt='' class='sendImg' src='images/cencle.png'><span style='margin-left:5px;'>删除</span></div></span>\
	<span id='linkrecord' style='display:none'><div class='sendMessage' style='float:left;margin-left:20px;' onclick='linkrecadd()'><img alt='' class='sendImg' src='images/addNew1.png'><span style='margin-left:5px;'>新增</span></div>\
	<div class='sendMessage' style='float:left;' onclick='linkrecedit()'><img alt='' class='sendImg' src='images/editAccount.png'><span style='margin-left:5px;'>修改</span></div>\
	<div class='sendMessage' style='float:left;' onclick='deleterecFun()'><img alt='' class='sendImg' src='images/cencle.png'><span style='margin-left:5px;'>删除</span></div></span>\
	"});


$('#dlgHj').dialog('open');
}else{
	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
	return;
}
hjId = '';
}
$('#linkSubmit').click(function(){
	linkSubmit(ifsle)
})
$('#linkTXSubmit').click(function(){
	linkTXSubmit(ifsle);
})
var idkae=0;
var idkrow=0;
function linkrecadd(){
	idkae=0;
	$('#rectime').val("");
	$('#recarea').val("");
}
function linkrecedit(){
	idkae=1;
	if ($('#dgrecord').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行操作，请重新选择。');
		return false;
	}
	var row = $('#dgrecord').datagrid('getSelected');
	if (!!row) {
		$('#rectime').val(formatTime(row.invitationDate));
		$('#recarea').val(row.remark);
		idkedit=1;
		idkrow=row.id;
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		return;
	}
}
function deletdtd(){
	var row = $('#dg').datagrid('getChecked');
	var dellist = [];
	$.each(row,function(index, el) {
		dellist.push(el.id);
	});
	if (!!row) {
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;删除确认', '确认删除吗？', function(r) {
			if(r){
				$.ajax({
					type:'post',
					data:{ids:"["+dellist.toString()+"]"},
					dataType:'json',
					url:'../ngym/GymCustomerAction!delete.zk',
					success: function(res){
						if(res.STATUS){
							$.messager.show({
								title:'&nbsp;&nbsp;&nbsp;&nbsp;消息提示',
								msg:'删除成功',
								timeout:3000,
								showType:'slide'
							});
							$('#dg').datagrid('reload');
						}else{
							if (res.ERROR == '未登录') {
								loginTimeout();
								return;
							}else{
								$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', res.paraName+"字段"+res.description);
							}							
						}
					},
					error: function(err){
						console.log(err);
					}
				})
			}
		})
		
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		return;
	}
}

function deleterecFun(){
	if ($('#dgrecord').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行操作，请重新选择。');
		return false;
	}
	var row = $('#dgrecord').datagrid('getSelected');
	if (!!row) {
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;删除确认', '确认删除吗？', function(r) {
			if(r){
				$.ajax({
					type:'post',
					data:{id:row.id},
					dataType:'json',
					url:'../ngym/GymCustomerInvitationAction!delete.zk',
					success: function(res){
						if(res.STATUS){
							$.messager.show({
								title:'消息提示',
								msg:'删除成功',
								timeout:3000,
								showType:'slide'
							});
							$('#dgrecord').datagrid('reload');
						}else{
							$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', res.paraName+"字段"+res.description);
						}
					},
					error: function(err){
						console.log(err);
					}
				})
			}
		})
		
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		return;
	}
}

function linkTXSubmit(val){
	var rectime = $('#rectime').val();
	var recarea = $('#recarea').val();
	if(rectime=="" || typeof(rectime)=="undefined"){
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '邀约时间不能为空');
		return false;
	}
	if(recarea=="" || typeof(recarea)=="undefined"){
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '提醒备注不能为空');
		return false;
	}
	if(idkae==0){
		$.post('../ngym/GymCustomerInvitationAction!add.zk', {
			customerId:val,
			invitationDate:rectime,
			remark:recarea
		}, function(data) {
			if (data.STATUS) {	
				$('#rectime').val("");
				$('#recarea').val("");
				$('#dgrecord').datagrid('reload');
				$.messager.show({
					title: "&nbsp;&nbsp;消息",
					timeout: 2000,
					msg: "操作成功!"
				});
			} else {
				if ('未登录' == data.ERROR) {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '分配失败');
			}
		}, 'json');
		return false;
	}else{
		$.post('../ngym/GymCustomerInvitationAction!update.zk', {
			id:idkrow,
			customerId:val,
			invitationDate:rectime,
			remark:recarea
		}, function(data) {
			if (data.STATUS) {
				$('#rectime').val("");
				$('#recarea').val("");
				$('#dgrecord').datagrid('reload');
				$.messager.show({
					title: "&nbsp;&nbsp;消息",
					timeout: 2000,
					msg: "操作成功!"
				});
			} else {
				if ('未登录' == data.ERROR) {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '分配失败');
			}
		}, 'json');
		return false;
	}	
	return false;
}
var idkedit=0;
var editids="";
function linkedit(){
	if ($('#dglink').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行操作，请重新选择。');
		return false;
	}
	var row = $('#dglink').datagrid('getSelected');
	if (!!row) {
		$('#linkname').val(row.saleName); 
		$('#linktime').val(formatTime(row.gmtCreate));
		$('#linkeYN').val(row.status);
		$('#linkfang').val();
		$('#linkarea').val(row.record);
		// $('#recname').val(row.name); 
		$('#rectime').val();
		$('#recarea').val();
		idkedit=1;
		editids=row.id;
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		return;
	}
}

function linkadd(){
	$('#linktime').val("");
	$('#linkeYN').val(0);
	$('#linkfang').val(1);
	$('#linkarea').val(""); 
	$('#rectime').val("");
	$('#recarea').val("");
	idkedit=0;
}
function linkSubmit(id){
	var linktime = $('#linktime').val();
	var linkeYN = $('#linkeYN').val();
	var linkfang = $('#linkfang').val();
	var linkarea = $('#linkarea').val();
	if(linktime=="" || typeof(linktime)=="undefined"){
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '联系时间不能为空');
		return false;
	}
	if(linkfang=="" || typeof(linkfang)=="undefined"){
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '来访状态不能为空');
		return false;
	}

	if(idkedit==0){
		$.post('../ngym/GymCustomerRecordAction!add.zk', {
			customerId: id,
			status: linkeYN,
			record:linkarea,
			date:linktime,
			invteStatus:linkfang
		}, function(data) {
			if (data.STATUS) {
				$('#linktime').val("");
				$('#linkeYN').val("0");
				$('#linkfang').val("");
				$('#linkarea').val("");
				$('#dglink').datagrid('reload');
				$('#dg').datagrid('reload');
				$.messager.show({
					title: "&nbsp;&nbsp;消息",
					timeout: 2000,
					msg: "操作成功!"
				});
			} else {
				if ('未登录' == data.ERROR) {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '分配失败');
			}
		}, 'json');
		return false;
	}else{
		$.post('../ngym/GymCustomerRecordAction!update.zk', {
			id:editids,
			customerId: id,
			status: linkeYN,
			record:linkarea,
			date:linktime,
			invteStatus:linkfang
		}, function(data) {
			if (data.STATUS) {
				$('#linktime').val("");
				$('#linkeYN').val("0");
				$('#linkfang').val("");
				$('#linkarea').val("");
				$('#dglink').datagrid('reload');
				$('#dg').datagrid('reload');
				$.messager.show({
					title: "&nbsp;&nbsp;消息",
					timeout: 2000,
					msg: "操作成功!"
				});
			} else {
				if ('未登录' == data.ERROR) {
					loginTimeout();
					return;
				}
				if(data.paraName=="id" && data.description=="不能为空!"){
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请点击 <b>新增</b> 来添加用户');
				}
			}
		}, 'json');
		return false;
	}
	return false;	
}
function openHjA() {
	var checkedItems = $('#dg').datagrid('getChecked');
	if (checkedItems.length < 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		return;
	}
	// $('#toAllMessage').textbox('setValue','');
	$('#hjSel').combobox('setValue', '');
	hjId = '';
	$('#dlgHjA').dialog('open');
}
var sore = 0;
var itemId=null;
function openJl() {
	// $('#guijiguwenselect').val();
	sore = 0;
	itemId=null;
	$('#khname').val("");
	$('#khsex').val("M");
	$('#khphone').val("");
	$('#khtype').val('1');
	$('#khfang').val('1');
	$('#khremake').val("");
	$('#dlgJl').dialog({title: "&nbsp;&nbsp;&nbsp;&nbsp;新增客户"});
	$('#dlgJl').dialog('open');
}
function openJledit() {
	$('#dlgJl').dialog({title: "&nbsp;&nbsp;&nbsp;&nbsp;编辑客户"});
	if ($('#dg').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行操作，请重新选择。');
		return false;
	}
	var row = $('#dg').datagrid('getSelected');
	if (!!row) {
		sore=1;
		itemId=row.id;
		$('#khname').val(row.name);
		$('#khsex').val(row.sex);
		$('#khphone').val(row.phone);
		$('#khtype').val(row.level);
		$('#khfang').val(row.inviteStatus);
		$('#khremake').val(row.reservedInfo);
		$('#guijiguwenselect').val(row.saleId+","+row.saleName);
		$('#dlgJl').dialog('open');
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		return;
	}
	$('#dlgJl').dialog('open');
}

//添加+更新
function formSubmit(){
	var phonereg = /^1[34578]\d{9}$/;
	var nhe = $('#guijiguwenselect').val();
	var khname = $('#khname').val();
	var khsex = $('#khsex').val();
	var khphone = $('#khphone').val();
	var guijiguwenselect = nhe.split(',')[0];
	var guijiguwenselectname = nhe.split(',')[1];
	var khtype = $('#khtype').val();
	var khfang = $('#khfang').val();
	var khremake = $('#khremake').val();
	if(khname==""){
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '姓名不能为空');
		return false;
	}
	if(khphone==""){
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '电话不能为空');
		return false;
	}
	if(!phonereg.test(khphone)){
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '电话号码有误');
		return false;
	}
/*	if(guijiguwenselect==""){
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会籍顾问不能为空');
		return false;
	}*/
	var khdata={
		name:khname,
		phone:khphone,
		sex:khsex,
		saleId:guijiguwenselect,
		level:khtype,
		inviteStatus:khfang,
		reservedInfo:khremake,
		saleName:guijiguwenselectname,
		id:itemId
	}
	if(sore==0){
		$.ajax({
			type:'post',
			data:khdata,
			dataType:'json',
			url:'../ngym/GymCustomerAction!add.zk',
			success: function(res){
				if(res.STATUS){
					$.messager.show({
						title:'消息提示',
						msg:'添加成功',
						timeout:3000,
						showType:'slide'
					});
					$('#dlgJl').dialog('close');
					$('#dg').datagrid('reload');
				}else{
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', res.paraName+"字段"+res.description);
				}
			},
			error: function(err){

			}
		})
	}
	if(sore==1){
		$.ajax({
			type:'post',
			data:khdata,
			dataType:'json',
			url:'../ngym/GymCustomerAction!update.zk',
			success: function(res){
				if(res.STATUS){
					$.messager.show({
						title:'消息提示',
						msg:'更新成功',
						timeout:3000,
						showType:'slide'
					});
					$('#dlgJl').dialog('close');
					$('#dg').datagrid('reload');
				}else{
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', res.paraName+"字段"+res.description);
				}
			},
			error: function(err){

			}
		})
	}
	
}
//删除
function deleteFun(){
	if ($('#dglink').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行操作，请重新选择。');
		return false;
	}
	var row = $('#dglink').datagrid('getSelected');
	if (!!row) {
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;删除确认', '确认删除吗？', function(r) {
			if(r){
				$.ajax({
					type:'post',
					data:{id:row.id},
					dataType:'json',
					url:'../ngym/GymCustomerRecordAction!delete.zk',
					success: function(res){
						if(res.STATUS){
							$.messager.show({
								title:'消息提示',
								msg:'删除成功',
								timeout:3000,
								showType:'slide'
							});
							$('#dglink').datagrid('reload');
						}else{
							$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', res.paraName+"字段"+res.description);
						}
					},
					error: function(err){
						console.log(err);
					}
				})
			}
		})
		
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		return;
	}
}

$('.linkma .linkji').click(function(){
	$('.linkma .linkji').removeClass("linkji-item");
	$(this).addClass('linkji-item');
	if($(this).attr('attr')==1){
		$('.lianjilu').show();
		$('.linktixing').css({'height':0,'overflow': 'hidden'});
		$('#linkmanage').show();
		$('#linkrecord').hide();
	}
	if($(this).attr('attr')==2){
		$('.linktixing').css({'height':"auto",'overflow': 'auto'});
		$('.lianjilu').hide();
		$('#linkmanage').hide();
		$('#linkrecord').show();
	}
})

function saveHj() {
	var users = '';
	var checkedItems = $('#dg').datagrid('getChecked');
	var data = $('#dg').datagrid('getData');
	var ids = [];
	var dutySelId = $('#hjSel').combobox('getValue');
	var dutySelName = $('#hjSel').combobox('getText');
	$.each(checkedItems, function(index, item) {
		ids.push(item.id);
	});
	users = JSON.stringify(ids);
	// if(hjSel == "无"){
	// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '您还未被分配到其他会籍！');
	// 	return false;
	// }
	if (hjId == '') {
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;会籍取消', '确认分配会籍？', function(r) {
			if (r) {
				$.post('../ngym/GymCustomerAction!assignSale.zk', {
					customerIdList: users,
					saleId: dutySelId,
					saleName:dutySelName
				}, function(data) { // ,cardTimes:,cardExpire:
					if (data.STATUS) {
						$('#dlgHjA').dialog('close');
						$('#dg').datagrid('reload');
						$.messager.show({
							title: "&nbsp;&nbsp;消息",
							timeout: 2000,
							msg: "操作成功!"
						});
						hjSel = '';
					} else {
						if ('未登录' == data.ERROR) {
							loginTimeout();
							return;
						}
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '分配失败');
					}
				}, 'json');
			}
		});
	} else {
		// $.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;会籍确认', '确认分配会籍？', function(r) {
		// 	if (r) {
			$.post('../ngym/GymMembersAction!setSale.zk', {
				saleId: hjId,
				userIds: users
		}, function(data) { // ,cardTimes:,cardExpire:
			if (data.STATUS) {
				$('#dlgHj').dialog('close');
				$('#dg').datagrid('reload');
				$.messager.show({
					title: "&nbsp;&nbsp;消息",
					timeout: 2000,
					msg: "操作成功!"
				});
			} else {
				if ('未登录' == data.ERROR) {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '分配失败');
			}
		}, 'json');
		// 	}
		// });
}
}

function saveJl() {
	var users = '';
	var checkedItems = $('#dg').datagrid('getChecked');
	var data = $('#dg').datagrid('getData');
	var ids = [];
	$.each(checkedItems, function(index, item) {
		ids.push(item.userId);
	});
	users = JSON.stringify(ids);
	// if(hjSel == "无"){
	// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '您还未被分配到其他会籍！');
	// 	return false;
	// }
	if (jlId == '') {
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;教练取消', '确认取消所分配教练？', function(r) {
			if (r) {
				$.post('../ngym/GymMembersAction!removeCoach.zk', {
					userIds: users
				}, function(data) { // ,cardTimes:,cardExpire:
					if (data.STATUS) {
						$('#dlgJl').dialog('close');
						$('#dg').datagrid('reload');
						$.messager.show({
							title: "&nbsp;&nbsp;消息",
							timeout: 2000,
							msg: "操作成功!"
						});
						hjSel = '';
					} else {
						if ('未登录' == data.ERROR) {
							loginTimeout();
							return;
						}
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '分配失败');
					}
				}, 'json');
			}
		});
	} else {
		// $.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;会籍确认', '确认分配会籍？', function(r) {
		// 	if (r) {
			$.post('../ngym/GymMembersAction!setCoach.zk', {
				coachId: jlId,
				userIds: users
		}, function(data) { // ,cardTimes:,cardExpire:
			if (data.STATUS) {
				$('#dlgJl').dialog('close');
				$('#dg').datagrid('reload');
				$.messager.show({
					title: "&nbsp;&nbsp;消息",
					timeout: 2000,
					msg: "操作成功!"
				});
			} else {
				if (data.ERROR == '未登录') {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '分配失败');
			}
		}, 'json');
		// 	}
		// });
}
}
// $('#nickName').keyup(function(){
// 	var n = $(this).val().trim();
// 	if(n.length>10){
// 		$(this).val(n.substr(0,9));
// 	}
// })
$('#backlist').click(function(event) {
	$('#dlgback').dialog('open').dialog('setTitle',"&nbsp;&nbsp;&nbsp;&nbsp;回收站&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class='reback' onclick='reback()'>还原</span>");
	$('#dlgbacklist').datagrid({
			rownumbers: true,
			// sortName: 'gmtModify',
			singleSelect: false,
			pagination: true,
			pageSize: '30',
			queryParams:{orderByDesc:'gmtCreate'},
			url: '../ngym/GymCustomerAction!listDeleted.zk',
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
			}
		});
});

function reback(){
	var row = $('#dlgbacklist').datagrid('getChecked');
	var dellist = [];
	$.each(row,function(index, el) {
		dellist.push(el.id);
	});
	if (!!row) {
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;恢复确认', '确认恢复吗？', function(r) {
			if(r){
				$.ajax({
					type:'post',
					data:{ids:"["+dellist.toString()+"]"},
					dataType:'json',
					url:'../ngym/GymCustomerAction!restore.zk',
					success: function(res){
						if(res.STATUS){
							$.messager.show({
								title:'&nbsp;&nbsp;&nbsp;&nbsp;消息提示',
								msg:'恢复成功',
								timeout:3000,
								showType:'slide'
							});
							$('#dg').datagrid('reload');
							$('#dlgbacklist').datagrid('reload');
						}else{
							if (res.ERROR == '未登录') {
								loginTimeout();
								return;
							}else{
								$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', res.paraName+"字段"+res.description);
							}							
						}
					},
					error: function(err){
						console.log(err);
					}
				})
			}
		})
		
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		return;
	}
}
$('#sechselect').change(function(res){
	var idsi = {saleId:$('#huijiselect').val(),status:$('#sechselect').val(),orderByDesc: 'gmtCreate',inviteStatus:$('#linechange').val()};
	if($('#startDate').val() != '' && $('#endDate').val() != ''){
		idsi.createStart= $('#startDate').val()+" 00:00:00";
		idsi.createEnd= $('#endDate').val()+" 23:59:59";
	}
	$("#dg").datagrid('load', idsi);
})
$('.userChoose').click(function(){
	$('.userChoose').removeClass('linkjiserdd');
	$(this).addClass('linkjiserdd');
	if($(this).attr('ise')=='y'){
		$("#dg").datagrid('load', {thePublic:'y',orderByDesc:'gmtCreate'});
	}else{
		$("#dg").datagrid('load',{orderByDesc:'gmtCreate'});
	}
})
function osnid(){
	var idsi = {saleId:$('#huijiselect').val(),status:$('#sechselect').val(),orderByDesc: 'gmtCreate',inviteStatus:$('#linechange').val()};
	if($('#startDate').val() != '' && $('#endDate').val() != ''){
		idsi.createStart= $('#startDate').val()+" 00:00:00";
		idsi.createEnd= $('#endDate').val()+" 23:59:59";
	}
	$("#dg").datagrid('load', idsi);
}
function searchTimeOfUser(value) {
	var data = {
			createStart: $('#startDate').val()+" 00:00:00",
			// remark: $('#remark').val().trim(),
			// saleId: $('#saleId').val().trim(),
			createEnd: $('#endDate').val()+" 23:59:59",
			orderByDesc:'gmtCreate',
			inviteStatus:$('#linechange').val()
		}
		if (compareDate(data.createStart, data.createEnd)) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '起始日期应在结束日期之前！');
			return;
		}
		$("#dg").datagrid('load', data);
	}
	function searchUserById(id, value) {
		var data = {};
		var userID = id;
	// var phone = $('#phoneSearch').val();
	var startDate = $('#startDate').val(); // Date.parse($('#startDate').val());
	var endDate = $('#endDate').val(); // Date.parse($('#endDate').val());
	// var mark = $('#markSearch').val();
	if (value && value != '')
		data.type = value;
	// if (phone && phone != '')
	// 	data.phone = phone;
	if (startDate && startDate != '')
		data.gmtStart = startDate + " 00:00:00";
	if (endDate && endDate != '')
		data.gmtEnd = endDate + " 00:00:00";
	if (startDate == endDate && endDate != '')
		data.gmtEnd = endDate + " 23:59:59";
	if (userID && userID != '')
		data.userId = userID;
	// if (mark && mark != '')
	// 	data.remark = mark;
	$("#dg").datagrid('load', data);
}

function toSearch() {
	searchUser(curStatus);
}

// 年龄换算
function formatAge(value) {
	// alert(value);
	var date = new Date();
	return date.getFullYear() - parseInt(value);
}
// 日期换算
function formatTime(value) {
	// alert(value);
	// if (!value) {
	// 	return '';
	// }
	// var date = new Date((value));
	// var result = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(); // +':'+second;
	// return result;
	if (!!value) {
		var d = new Date(value);
		return d.format("yyyy-MM-dd hh:mm:ss");
	} else {
		return "-";
	}

}

function formatSex(value) {
	switch (value) {
		case 'F':
		return '女';
		break;
		case 'M':
		return '男';
		break;
		default: return "未知";	
	}
}

function formatAge(value) {
	var today = new Date();
	var age = today.getFullYear() - value;
	return age;
}
//来访状态
function formatSt(value, index) {
	switch(value){
		case 0: return "未知";break;
		case 1: return "电话来访";break;
		case 2: return "到店来访";break;
		default: return "移动端";
	}
}
/*function formatRecade(val){
	if(val=="" || typeof(val)=="undefined"){
		return "<span style='color:#3fc371'>无</span>"
	}else{
		return "<span style='color:#3fc371'>"+val+"</span>";
	}
}*/
function formatFenlei(val){
	switch(val){
		case 1: return "一级";break;
		case 2: return "二级";break;
		case 3: return "三级";break;
		default: return "无";
	}
}
function formatCusSt(val){
	switch(val){
		case 1: return "新录入";break;
		case 2: return "已注册";break;
		case 3: return "已购卡";break;
		case 4: return "卡过期";break;
			// case 5: return "跟进失败";break;
			// case 6: return "放弃跟进";break;
			default: return "新录入";	
		}
	}

	function openSerch() {
		if ($('#dg').datagrid('getChecked').length > 1) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行操作，请重新选择。');
			return false;
		}
		var row = $('#dg').datagrid('getSelected');
		if (!!row) {
			$('#dlgserch').dialog({title: "&nbsp;&nbsp;&nbsp;&nbsp;客户详情&nbsp;&nbsp;&nbsp;&nbsp;"+row.name});
			intoText('detname',row.name);
			intoText('detsex',formatSex(row.sex));
			intoText('detphone',row.phone);
			intoText('detrealname',row.saleName);
			intoText('dettype',formatFenlei(row.level));
			intoText('detgostatus',formatSt(row.inviteStatus));
			intoText('detstatus',formatCusSt(row.status));
			intoText('dettotime',formatTime(row.gmtSetSale));
			intoText('detgotime',formatTime(row.gmtInvite));
			intoText('detlinktime',formatTime(row.lastCommunicationDate));
			$('#detmark').text(row.lastCommunication);
			$('#detdiffmark').text(row.reservedInfo);
			$('#dlgserch').dialog('open');
			var ifsle=row.id;
			$('#dglinkd').datagrid({
				queryParams:{customerId:ifsle,orderByDesc:'gmtCreate'},
				rownumbers: true,
			// sortName: 'gmtModify',
			singleSelect: false,
			pagination: true,
			pageSize: '4',
			url: '../ngym/GymCustomerRecordAction!list.zk',
			method: 'post',
			onLoadSuccess: function(data) {
				if (data.ERROR == '未登录') { // (data.total == 0 &&
					// data.ERROR == 'No Login!')
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
			relogin();
		}
				// 图片弹出层
				$("a.popImage").fancybox({
					openEffect: 'elastic',
					closeEffect: 'elastic'
				});
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
		}else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		}
	}
	function intoText(id,val){
		$("#"+id).html(val);
	}
	function seeCard(id) {
	// $('#dlgMessage').dialog('open').dialog('setTitle',"&nbsp;&nbsp;查看会员卡");
	$('#memberCard', window.parent.document).trigger('click');
	$('#allCard', window.parent.document).trigger('click');
	event.cancelBubble = true;
	window.parent.curSeeUserId = id;
	return false;
}

function openCard() {
	if ($('#dg').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行操作，请重新选择。');
		return false; 
	}
	var row = $('#dg').datagrid('getSelected');
	
	if (!!row) {
		if(row.saleId=="" || typeof(row.saleId)=="undefined"){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '所选用户没有分配会籍无法进行操作！');
			return false;
		}
		$('#dlgNew').dialog({title: "&nbsp;&nbsp;&nbsp;&nbsp;邀约到访&nbsp;&nbsp;&nbsp;&nbsp;"+row.name});
		$('#yaoname').val(row.name);
		$('#dlgNew').dialog('open');
		$('#yaoSubmit').click(function(){
			var yaotime = $('#yaotime').val();
			var yaomark = $('#yaomark').val();
			if(yaotime==""){
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择邀约时间!');
				return false;
			}
			/*if(yaomark==""){
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请填写备注!');
				return false;
			}*/
			$.ajax({
				type:'post',
				data:{customerId:row.id,status:0,record:yaomark,date:yaotime},
				dataType:'json',
				url:'../ngym/GymCustomerRecordAction!addAppointment.zk',
				success: function(res){
					if(res.STATUS){
						$.messager.show({
							title:'消息提示',
							msg:'添加成功',
							timeout:3000,
							showType:'slide'
						});
						$('#dlgNew').dialog('close');
						$('#dg').datagrid('reload');
					}else{
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', res.paraName+"字段"+res.description);
					}
				},
				error: function(err){
					console.log(err);
				}
			})
		})
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
	}
}

function measurement(id) {
	event.cancelBubble = true;
	return false;
}

function printTable() {
	var b = $(".datagrid-view2 .datagrid-htable tbody").html();
	$(".datagrid-view2 .datagrid-btable tbody").prepend(b);
	$(".datagrid-view2 .datagrid-btable").jqprint({
		debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
		importCSS: false, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
		printContainer: true, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
		operaSupport: true //表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
	});
	$(".datagrid-view2 .datagrid-btable .datagrid-header-row").remove();
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
//清除addFrom
function clearAddFromNew() {
	$('#headIconNew').attr('src', 'images/regist_pic.png');
	$('#cardTypeNew').combobox('setValue', '');
	$('#realPayNew').val('');
	$('#startDateNew').val('');
	$('#endDateNew').val('');
	$('#countNew').val(''); //次数
	$('#messageNameNew').val('');
	$('#messagePhoneNew').val('');
	$('#messageSexNew').combobox('setText', '男');
	$('#messageImageNew').val('');
	$('#birthDateNew').val('');
}

function dateAdd(unit, count, start) {
	//		var dates;
	//一天是86400秒
	console.log(start.getDate());
	var date = new Date();
	//获取年份
	var year = date.getFullYear();
	//获取当前月份
	var mouth = date.getMonth() + 1;
	//定义当月的天数；
	var days;
	//当月份为二月时，根据闰年还是非闰年判断天数
	year = year % 4 == 0 ? 366 : 365;
	if (mouth == 2) {
		days = year % 4 == 0 ? 29 : 28;
	} else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
		//月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
		days = 31;
	} else {
		//其他月份，天数为：30.
		days = 30;
	}
	var endTime = start.getTime();
	switch (unit) {
		case 'y':
		endTime += count * year * 86400 * 1000;
		console.log(new Date(endTime).getDate());
		break;
		case 'M':
		endTime += count * days * 86400 * 1000;
		console.log(new Date(endTime).getDate());
		break;
		case 'd':
		endTime += count * 86400 * 1000;
		console.log(new Date(endTime).getDate());
		break;
		default:
		break;
	}
	var endshijian = new Date(endTime);
	var endDate = endshijian.getFullYear() + '-' + ((endshijian.getMonth() + 1) > 9 ? (endshijian.getMonth() + 1) : '0' + (endshijian.getMonth() + 1)).toString() + '-' + (endshijian.getDate() > 9 ? endshijian.getDate() : '0' + endshijian.getDate()).toString();
	return endDate;
}