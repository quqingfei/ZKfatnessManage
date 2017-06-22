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
			url: '../ngym/GymMembersAction!listCustomer.zk',
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
	getMembersCard();
	$.post('../ngym/GymEmployeesAction!list.zk', {
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
	}, 'json');
	$.post('../ngym/GymEmployeesAction!list.zk', {
		page: 1,
		rows: 1000,
		duty: '教练'
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
				makers.push(maker);
			}
			makers.push({
				"id": '',
				"duty": '无'
			});
			$('#jlSel').combobox({
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
	// $('#allUser').trigger('click');
});

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

//增加
function linkadd(){
	$('#linktime').val("");
    $('#linkfang').val(1);
    $('#linkarea').val(""); 
    $('#rectime').val("");
    $('#recarea').val("");
    idkedit=0;
}

var idkae=0;
var idkrow=0;
function linkrecadd(){
	idkae=0;
	$('#rectime').val("");
	$('#recarea').val("");
}
//编辑
var idkedit=0;
var editids="";
function linkedit(){
	if ($('#dglink').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行操作，请重新选择。');
		return false;
	}
	var row = $('#dglink').datagrid('getSelected');
	if (!!row) {
		// $('#linkname').val(row.saleName); 
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
function linkrecedit(){
	if ($('#dgrecord').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行操作，请重新选择。');
		return false;
	}
	var row = $('#dgrecord').datagrid('getSelected');
	if (!!row) {
	    $('#rectime').val(formatTime(row.invitationDate));
	    $('#recarea').val(row.remark);
	    idkae=1;
	    idkrow=row.id;
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		return;
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
					url:'../ngym/UserGymRecordAction!delete.zk',
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
$('#linkSubmit').click(function(){
	linkSubmit(ifsle)
})
$('#linkTXSubmit').click(function(){
	linkTXSubmit(ifsle);
})
function linkSubmit(id){
	var linktime = $('#linktime').val();
    var linkeYN = $('#linkeYN').val();
    var linkfang = $('#linkfang').val();
    var linkarea = $('#linkarea').val();
    var rectime = $('#rectime').val();
    var recarea = $('#recarea').val();
    if(linktime=="" || typeof(linktime)=="undefined"){
    	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '联系时间不能为空');
    	return false;
    }
    if(linkfang=="" || typeof(linkfang)=="undefined"){
    	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '来访状态不能为空');
    	return false;
    }

    if(idkedit==0){
    	$.post('../ngym/UserGymRecordAction!add.zk', {
			customerId: id,
			status: linkeYN,
			record:linkarea,
			coachId: coachkd,
			coachName: coachna,
			date:linktime,
			inviteStatus:linkfang
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
    	$.post('../ngym/UserGymRecordAction!update.zk', {
    		id:editids,
			customerId: id,
			status: linkeYN,
			record:linkarea,
			coachId: coachkd,
			coachName: coachna,
			date:linktime,
			inviteStatus:linkfang
		}, function(data) {
			if (data.STATUS) {
				$('#linktime').val("");
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
    	$.post('../ngym/UserGymInvitationAction!add.zk', {
    			customerId:val,
		 		invitationDate:rectime,
		 		remark:recarea,
		 		coachId: coachkd,
				coachName: coachna
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
    	$.post('../ngym/UserGymInvitationAction!update.zk', {
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
var coachkd = '';
var ifsle = '';
var coachna = '';
function serverManage() {
	ifsle="";
	coachkd = '';
	coachkd = '';
	if ($('#dg').datagrid('getChecked').length > 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行操作，请重新选择。');
		return false;
	}
	var row = $('#dg').datagrid('getSelected');
	
	if (!!row) {
		if(row.coachId=="" || typeof(row.coachId)=="undefined"){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '所选用户<b>没有分配教练</b>无法进行操作！');
			return false;
		}
		$('.linkma .linkji').eq(0).trigger('click');
		$('#linktime').val("");
		$('#linkarea').val("");
		$('#rectime').val("");
		$('#recarea').val("");
		ifsle=row.id;
		coachkd = row.coachId;
		coachna = row.coachName;
        var linkname = $('#linkname').val(row.coachName);
        var recname = $('#recname').val(row.coachName);     	
		$('#dglink').datagrid({
			queryParams:{customerId:ifsle,orderByDesc:'gmtCreate'},
			rownumbers: true,
			// sortName: 'gmtModify',
			singleSelect: false,
			pagination: true,
			pageSize: '4',
			url: '../ngym/UserGymRecordAction!list.zk',
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
			url: '../ngym/UserGymInvitationAction!list.zk',
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
		$('#server').dialog({title: "<div style='float:left'>&nbsp;&nbsp;&nbsp;&nbsp;服务管理&nbsp;&nbsp;&nbsp;&nbsp;"+row.realName+"</div>\
			<span id='linkmanage'><div class='sendMessage' style='float:left;margin-left:20px;' onclick='linkadd()'><img alt='' class='sendImg' src='images/addNew1.png'><span style='margin-left:5px;'>新增</span></div>\
			<div class='sendMessage' style='float:left;' onclick='linkedit()'><img alt='' class='sendImg' src='images/editAccount.png'><span style='margin-left:5px;'>修改</span></div>\
			<div class='sendMessage' style='float:left;' onclick='deleteFun()'><img alt='' class='sendImg' src='images/cencle.png'><span style='margin-left:5px;'>删除</span></div></span>\
			<span id='linkrecord' style='display:none'><div class='sendMessage' style='float:left;margin-left:20px;' onclick='linkrecadd()'><img alt='' class='sendImg' src='images/addNew1.png'><span style='margin-left:5px;'>新增</span></div>\
			<div class='sendMessage' style='float:left;' onclick='linkrecedit()'><img alt='' class='sendImg' src='images/editAccount.png'><span style='margin-left:5px;'>修改</span></div>\
			<div class='sendMessage' style='float:left;' onclick='deleterecFun()'><img alt='' class='sendImg' src='images/cencle.png'><span style='margin-left:5px;'>删除</span></div></span>\
			"});
		
		
		$('#server').dialog('open');
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		return;
	}
	hjId = '';
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
					url:'../ngym/UserGymInvitationAction!delete.zk',
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
function openHj() {
	var checkedItems = $('#dg').datagrid('getChecked');
	if (checkedItems.length < 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		return;
	}
	// $('#toAllMessage').textbox('setValue','');
	$('#hjSel').combobox('setValue', '');
	hjId = '';
	$('#dlgHj').dialog('open');
}

function openJl() {
	var checkedItems = $('#dg').datagrid('getChecked');
	if (checkedItems.length < 1) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		return;
	}
	// $('#toAllMessage').textbox('setValue','');
	$('#jlSel').combobox('setValue', '');
	jlId = '';
	$('#dlgJl').dialog('open');
}

function saveHj() {
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
	if (hjId == '') {
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;会籍取消', '确认取消所分配会籍？', function(r) {
			if (r) {
				$.post('../ngym/GymMembersAction!removeSale.zk', {
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
// $('#nickName').keyup(function(){
// 	var n = $(this).val().trim();
// 	if(n.length>10){
// 		$(this).val(n.substr(0,9));
// 	}
// })
function searchUser(value) {
	var data = {
			nickName: $('#nickName').val(),
			// remark: $('#remark').val().trim(),
			// saleId: $('#saleId').val().trim(),
			bodySize: $('#bodySize').combobox('getValue'),
			ageStart: $('#ageStart').val(),
			ageEnd: $('#ageEnd').val()
		}
		// var phone = $('#phoneSearch').val();
	var startDate = $('#startDate').val(); // Date.parse($('#startDate').val());
	if(startDate!=""){
		data.gmtStart = startDate+" 00:00:00";
	}
	
	var endDate = $('#endDate').val(); // Date.parse($('#endDate').val());
	if(endDate!=""){
		data.gmtEnd = endDate+" 00:00:00";
	}
	
	var sex = $('#sex').combobox('getValue');
	// var mark = $('#markSearch').val();
	if (value && value != '')
		data.type = value;
	// if (phone && phone != '')
	// 	data.phone = phone;
	if (data.ageStart && data.ageStart != '') {
		data.ageStart = data.ageStart;
	} else {
		data.ageStart = 0;
	}
	if (data.ageEnd && data.ageEnd != '') {
		data.ageEnd = data.ageEnd;
	} else {
		data.ageEnd = 100;
	}
	if (data.ageStart - data.ageEnd > 0) {

		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '最小年龄应小于最大年龄！');
		return;
	}
	if (compareDate(startDate, endDate)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '起始日期应在结束日期之前！');
		return;
	}
	/*if (startDate && startDate != '')
		data.gmtStart = startDate + " 00:00:00";
	else
		data.gmtStart = '0001-01-01 00:00:00';
	if (endDate && endDate != '')
		data.gmtEnd = endDate + " 23:59:59";
	else
		data.gmtEnd = '9999-01-01 00:00:00';*/
	// if (startDate == endDate && endDate != '')
	// 	data.gmtEnd = endDate + " 23:59:59";
	data.saleId = dutyId;
	data.requstType = 'signTime';
	if (!!sex) {
		data.sex = sex;
	}
	// if (mark && mark != '')
	// 	data.remark = mark;
	$("#dg").datagrid('load', data);
	$('#dlgserch').dialog('close');

	$('#nickName').val('');
	$('#bodySize').combobox('setValue', '');
	$('#ageStart').val('');
	$('#ageEnd').val('');
	$('#sex').combobox('setValue', '');
	$('#startDate').val('');
	$('#endDate').val('');
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
		return ('')
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
function formatAge(value) {
	var today = new Date();
	var age = today.getFullYear() - value;
	return age;
}
//BMI转换
function formatBMI(value, index) {
	var bmi = index.bmi;
	// console.log(index.nickName + ":" + bmi)
	// console.log(index.weight, index.height, bmi)
	if (bmi < 18.5) {
		return '<div style="color:#3ba9ef">偏瘦</div>'
	} else if (bmi < 23) {
		return '<div style="color:#3fc371">标准</div>'
	} else if (bmi >= 23) {
		return '<div style="color:#FCBA48">偏胖</div>'
	} else {
		return '未知'
	}
}

function openSerch() {
	$('#dlgserch').dialog('open');
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
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多个客户进行开卡，请重新选择。');
		return false;
	}
	var row = $('#dg').datagrid('getSelected');
	if (!!row) {
		// window.parent.curSeeUserId = row.userId;
		// $('#cardManagement', window.parent.document).trigger('click');
		// $('#openCard', window.parent.document).trigger('click');
		// event.cancelBubble = true;
		// return false;
		clearAddFromNew();
		photoState = 1;
		$('#headIconNew').show();
		$('#iconVideoNew').hide();
		$.post('userAction!getByUserId.zk', {
			userId: row.userId
		}, function(data) {
			if (data.STATUS) {
				//$("#dg").datagrid('load',{userId:data.userId});
				$('#userId').val(data.userId);
				if (!!data.memberName) {
					$('#messageNameNew').val(data.memberName);
				}
				if (!!data.memberPhone) {
					$('#messagePhoneNew').val(data.memberPhone);
				}
				if (!!data.memberPhoto) {
					var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.memberPhoto;
					$("#headIconNew").attr("src", imgURL);
					$("#messageImageNew").val(data.memberPhoto);
				}
				if (!!data.sex) {
					switch (data.sex) {
						case '男':
							$("#messageSexNew").combobox('setValue', 'M');
							break;
						case '女':
							$("#messageSexNew").combobox('setValue', 'F');
							break;
						default:
							$("#messageSexNew").combobox('setValue', '');
							break;
					}
				}
				if (!!data.saleId) {
					$('#hjSel').combobox('setValue', data.saleId);
				}
				if (!!data.birthDay) {
					$("#birthDateNew").val(formatBirthDay(data.birthDay))
				}
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '获取用户信息失败。');
			}
		}, 'json');
		$('#dlgNew').dialog('open');
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
	}
}

function measurement(id) {
	event.cancelBubble = true;
	return false;
}

// 客户状态
function formatStatus(value) {
	if (value) {
		if (value == 'true') {
			return '有效';
		} else {
			return '无效';
		}
	} else {
		return '未开卡';
	}
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

function chooseImage(id, videoId, open) {
	$('#headIcon' + open).show();
	$('#' + videoId).hide();
	document.getElementById(id).click();
}
//上传图片
function uploadImage(open) {
	var viewFiles = document.getElementById("file_title_img" + open);
	//是否为图片类型            
	if (/image\/\w+/.test(viewFiles.files[0].type)) {
		//最大图片文件大小 500KB
		var imgSizeLimit = 5000 * 1024;
		if (viewFiles.files[0].size <= imgSizeLimit) {
			msgLoading();
			//上传图片
			$("#title_img_form" + open)
				.ajaxSubmit({
					type: 'post',
					url: '../file/FileCenter!uploadImage2.zk',
					success: function(data) {
						msgLoading('close');
						data = $.parseJSON(data);
						if (data.name) {
							var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
							$("#headIcon" + open).attr("src", imgURL);
							$("#messageImage" + open).val(data.name);
						} else {
							//alert("上传图片出错！");
							$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上传图片出错！');
						}
						$("#title_img_form" + open).resetForm();
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

//保存开卡信息
var itemData = null;
function saveMessageNew() {
	if (checkFormNew()) {
		msgLoading();
		var data = {};
		data.userId = $('#userId').val();
		data.cardId = $.trim($('#cardTypeNew').combobox('getValue'));
		data.typeText = $.trim($('#cardTypeNew').combobox('getText'));
		data.realPay = $.trim($('#realPayNew').val());
		if ($('#startDateNew').val() != '')
			data.gmtStart = $.trim($('#startDateNew').val()) + ' 00:00:00';
		if ($('#endDateNew').val() != '')
			data.gmtEnd = $.trim($('#endDateNew').val()) + ' 00:00:00';
		data.totleTime = $.trim($('#countNew').val()); //次数
		data.name = $.trim($('#messageNameNew').val());
		data.phone = $.trim($('#messagePhoneNew').val());
		data.sex = $.trim($('#messageSexNew').combobox('getValue'));
		data.photo = $.trim($('#messageImageNew').val());
		// if (!!$('#hjSel').combobox('getValue')) {
		data.salesPersonId = $('#hjSelNew').combobox('getValue');
		if(addm==0&&addd==0){
			data.gmtSend = "无"
		}else{
			data.gmtSend = addm+"月"+addd+"天";
		}	
		data.mark = $.trim($('#remark').val());
		// }
		if ($('#birthDateNew').val() != '')
			data.gmtBirth = $.trim($('#birthDateNew').val()) + " 00:00:00";
		itemData = data;
		$.post('../ngym/GymMembersAction!add.zk', data, function(data) {
			// data = eval('(' + data + ')');
			if (data.STATUS) {
				msgLoading('close');
				$('#dlgiloed').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;提示信息");
				$('#dlgiloed').parent().find('.panel-tool').css('display','none');
				
				$.messager.show({
					title: "&nbsp;&nbsp;消息",
					timeout: 2000,
					msg: "开卡成功!"
				});
				// cardCount(superId);
				$('#dgCard').datagrid('reload');
				$('#dlgNew').dialog('close');
				clearAddFromNew();
			} else {
				msgLoading('close');
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
				// $('.submitMessage').removeAttr('disabled');
			}
		}, 'json');
	}
}
function cencles(){		
	$('#dlgiloed').dialog('close');
	itemData = null;
}
function printPaper(){
	if(itemData.name !="" && typeof(itemData.name)!="undefined"){
		var name = encodeURI(encodeURI(itemData.name));				
		var typeText = encodeURI(encodeURI(itemData.typeText));				
		window.open("paper.html?name="+name+"&cardId="+itemData.cardId+"&gmtStart="+itemData.gmtStart+"\
			&gmtEnd="+itemData.gmtEnd+"&phone="+itemData.phone+"&typeText="+typeText);
	}
}


function checkFormNew() {
	// var userId = $('#userId').val();
	var cardType = $.trim($('#cardTypeNew').combobox('getValue'));
	var realPay = $.trim($('#realPayNew').val());
	var startDate = $.trim($('#startDateNew').val());
	var endDate = $.trim($('#endDateNew').val());
	var count = $.trim($('#countNew').val()); //次数
	var messageName = $.trim($('#messageNameNew').val());
	var messagePhone = $.trim($('#messagePhoneNew').val());
	var messageSex = $.trim($('#messageSexNew').combobox('getValue'));
	var messageImage = $.trim($('#messageImageNew').val());
	var birthDate = $.trim($('#birthDateNew').val());
	var startDatenum = parseInt(startDate.replace(/\-/g, "").replace(/\:/g, "").replace(/\ /g, ""));
	var endDatenum = parseInt(endDate.replace(/\-/g, "").replace(/\:/g, "").replace(/\ /g, ""));
	var remark = $.trim($('#remark').val());
	var regs = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
	// if (!superId || superId == '') {
	// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码!');
	// 	$("#userId").focus();
	// 	return false;
	// }
	if (!cardType || cardType == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员卡名称不能为空!');
		$("#cardTypeNew").focus();
		return false;
	}
	if (realPay == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额不能为空!');
		$("#realPayNew").focus();
		return false;
	}
	if (realPay < 0) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额必须为不小于0的数值!');
		$("#realPayNew").focus();
		return false;
	}
	if (!regs.test(realPay)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额必须为数值!');
		$("#realPayNew").focus();
		return false;
	}
	if (!startDate || startDate == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '生效日期不能为空!');
		$("#startDateNew").focus();
		return false;
	}
	if (!endDate || endDate == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '失效日期不能为空!');
		$("#endDateNew").focus();
		return false;
	}
	if (startDatenum >= endDatenum) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '失效日期必须大于生效日期!');
		return false;
	}
	if (curCardType == 1) {
		if (!count || count == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '次数卡次数不能为空!');
			$("#countNew").focus();
			return false;
		}
		if (!regs.test(count)) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '次数必须为不小于0的数值!');
			$("#countNew").focus();
			return false;
		}
	}

	if (!messageName || messageName == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员姓名不能为空!');
		$("#messageNameNew").focus();
		return false;
	}
	if (messageName.length > 10) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员姓名长度不得超过10位!');
		$("#messageNameNew").focus();
		return false;
	}
	if (!messagePhone || messagePhone == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员手机号不能为空!');
		$("#messagePhoneNew").focus();
		return false;
	}
	if (!isTelephone(messagePhone)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员手机号不正确!');
		$("#messagePhoneNew").focus();
		return false;
	}
	if (!messageSex || messageSex == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员性别不能为空!');
		$("#messageSexNew").focus();
		return false;
	}
	if (!messageImage || messageImage == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员头像不能为空!');
		$("#messageImageNew").focus();
		return false;
	}

	if (!birthDate || birthDate == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '出生日期不能为空!');
		$("#birthDate").focus();
		return false;
	}
	if (remark.length > 20) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注不能超过20个字!');
		$("#remark").focus();
		return false;
	}
	return true;
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
var lastt = "";
laydate({
  elem: '#startDateNew',
  format: 'YYYY-MM-DD',
  choose: function(datas){ //选择日期完毕的回调
  	console.log(datas)
  		var cha = todm(datas);
  		if(cha == 0){
  			console.log(YeT)
  			$('#endDateNew').val(YeT);
  		}else{
  			var endT = haom($('#endDateNew').val());
	    	var endts= endT+cha;
	    	$('#endDateNew').val(new Date(endts).format("yyyy-MM-dd"));
	    	lastt = new Date(endts).format("yyyy-MM-dd");
  		}
    	
  }
});
var addm = 0,addd = 0;
	$('#addtimes').click(function(){
		var unit = $('input:radio[name="date"]:checked').val();
		var endt = $('#endDateNew').val();
		var hmzj = new Date(endt).getTime();
		var yfen = Number(endt.split("-")[0]);
		var mfen = Number(endt.split("-")[1]);
		var dfen = Number(endt.split("-")[2]);
		var itemval = Number($('#datetime').val());
		var meos = 0,deos = 0,yeos=0,lise=0;
		if(itemval == ""){
			return false;
		}
		if(unit == "m"){
			addm+=itemval;
			meos = mfen+itemval;
			lise = parseInt(meos/12);	
			yeos = yfen+lise;
			if(meos>=12){			
				meos = (meos%12);
			}
			switch(meos){
				case 4:
				case 6:
				case 9:
				case 11:dfen>=31?dfen=30:dfen;break;
			}
			if(meos==2){
				if(isLeapYear(yeos)){
					dfen>=29?dfen=29:dfen;
				}else{
					dfen>=28?dfen=28:dfen;
				}
			}
			if(meos==0){
				meos = 1;
				dfen = 1;
			}
			meos = meos>9?meos:"0"+meos;
			dfen = dfen>9?dfen:"0"+dfen;
			$('#endDateNew').val(yeos+"-"+meos+"-"+dfen);
		}else{
			addd+=itemval;
			deos = hmzj+(itemval*86400000);
			$('#endDateNew').val(new Date(deos).format("yyyy-MM-dd"));
		}
		$('#endDateNew').css({borderColor: '#3fc371',background:'#3fc371',color:'white'});
		setTimeout(function(){
			$('#endDateNew').css({borderColor: '#ccc',background:'#eee',color:'black'});
		},500);
	})
	$('#cencle').click(function(){
		addm = 0;
		addd = 0;
		$('#datetime').val("");
		if(lastt==""){
			$('#endDateNew').val(YeT);
		}else{
			$('#endDateNew').val(lastt);
		}
		
	})
	//判断是否为闰年
	function isLeapYear(year) {  return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);  }
function todm(time){
	return haom(time)-haom(YsT);
}
function haom(time){
	return new Date(time).getTime();
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

function getMembersCard() {
	cards = [];
	$.post('../ngym/GymMembersCardAction!list.zk', {
		page: 1,
		rows: 300
	}, function(data) {
		// data = eval('(' + data + ')');
		if (data.STATUS) {
			var rows = data.rows;
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				var card = {
					"num": i,
					"id": row.id,
					"text": row.name,
					"type": row.type,
					"count": row.count,
					"unit": row.unit,
					"price": row.price,
					"minPrice": row.minPrice
				};
				//					if(i == 0){
				//						card.selected = true ;
				//					}
				cards.push(card);
			}
			$('#cardTypeNew').combobox({
				valueField: 'id',
				textField: 'text',
				data: cards,
				onSelect: function(rec) {
					getSelectCard(rec.num);
					$('#startDateNew').attr('disabled',false);
					$('#startDateNew').css('background','#fff');
					$('.chooseded').show();
				},
				//					onChange : function(n){
				//						cardsChange(n);
				//					}

			});
		} else {
			if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
				loginTimeout();
				return;
			}
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "获取会员卡失败");
		}
	}, 'json');
}
var YsT = null;
var YeT = null;
function getSelectCard(cardId) {
	addm = 0;
	addd = 0;
	lastt = "";
	$('#minPrice').text(0);
	var card = cards[cardId];
	var start = new Date().format("yyyy-MM-dd");
	YsT = start;
	var end = dateAdd(card.unit, card.count, new Date());
	YeT = end;
	curCardType = card.type;
	$('#realPayNew').val(card.price);
	if (card.type == 0) {
		curCardTypeStr = '时效卡';
		$('#countCardNew').hide();
		$('#timeCard').show();

		$('#startDateNew').val(start);
		$('#endDateNew').val(end);
		$('#minPrice').text(card.minPrice)
	}

	if (card.type == 1) {
		curCardTypeStr = '次卡';
		$('#timeCard').hide();
		$('#countCardNew').show();
		$('#startDateNew').val(start);
		$('#endDateNew').val(dateAdd('y', 1, new Date()));
		$('#countNew').val(card.count);
		$('#minPrice').text(card.minPrice)
	}

	curCardName = card.text;
}

function dateAdd(unit, count, start) {
	//		var dates;
	//一天是86400秒
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
			// console.log(new Date(endTime).getDate());
			break;
		case 'M':
			endTime += count * days * 86400 * 1000;
			// console.log(new Date(endTime).getDate());
			break;
		case 'd':
			endTime += count * 86400 * 1000;
			// console.log(new Date(endTime).getDate());
			break;
		default:
			break;
	}
	var endshijian = new Date(endTime);
	var endDate = endshijian.getFullYear() + '-' + ((endshijian.getMonth() + 1) > 9 ? (endshijian.getMonth() + 1) : '0' + (endshijian.getMonth() + 1)).toString() + '-' + (endshijian.getDate() > 9 ? endshijian.getDate() : '0' + endshijian.getDate()).toString();
	return endDate;
}
// 标注当前行
// 标注
// function formatRemark(value){
// 	var content = value;
// 	if (value == '' || !value) {
// 		return ' '
// 	}else{
// 		content = content.replace(/\[/g, "").replace(/\]/g, "").replace(/\"/g, "");
// 	};
// 	if (content.length > 8) {
// 		content = content.substring(0, 8) + '...';
// 	}
// 	return content;
// }