$(function() {
	setTimeout(function() {
		$('#dg').datagrid({
			fitColumns: true,
			nowrap: true,
			rownumbers: true,
			singleSelect: true,
			url: '../ngym/GymRoleAction!list.zk',
			pagination: true,
			pageSize: '30',
			method: 'post'
		})
	}, 100);
	loginCheck();
	$('#hideDiv').hide();
	$.post('../ngym/GymRoleAuthAction!list.zk', {}, function(data) {
		// data = $.parseJSON(data);
		if (data.ERROR == '未登录') {
			loginTimeout();
			//			login();
			return;
		}
		if (data.STATUS) {

			var rows = data.gymRoleAuths;

			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				var checkDiv = '<div class="serviceCheck"><div class="checkComb"><input id="checkItemEdit' + row.id + '" name="checkEdit" type="checkbox" value="' + row.id + '" /><label for="checkItemEdit' + row.id + '"><img src="images/checked.png" alt=""></label></div><span>' + row.name + '</span></div>'
				$('#checksEdit').append(checkDiv);
				var checkNew = '<div class="serviceCheck"><div class="checkComb"><input id="checkItemNew' + row.id + '" name="checkNew" type="checkbox" value="' + row.id + '" /><label for="checkItemNew' + row.id + '"><img src="images/checked.png" alt=""></label></div><span>' + row.name + '</span></div>'
				$('#checksNew').append(checkNew);
			}
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');

});
var alllist = [];
var params = {searchable: true,onChange:function(res){
	alllist = [];
	$.each(res,function(index, el) {
		alllist.push(el.value);
	});
	console.log(alllist)
}};

function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}

function formatTime(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd hh:mm");
}
var isadd = false;
var sodoid = '';
function addTime(){
    var row = $('#dg').datagrid('getSelected');
    sodoname = "";
    if (!row) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择需要添加考勤的条目！');
        return;
    }else{
    	sodoid = row.id;
    	if(typeof (row.gmtOffDuty) === 'undefined'){
    		isadd=true;
    		$('#courseTime1').timespinner('setValue', '00:00');
    		$('#courseTime2').timespinner('setValue', '00:00');
    	}else{
    		isadd=false;
    		var s = new Date(row.gmtOnDuty);
    		var b = new Date(row.gmtOffDuty);
    		var n = s.getHours()>9?s.getHours():"0"+s.getHours();
    		var v = s.getMinutes()>9?s.getMinutes():"0"+s.getMinutes();
    		var d = b.getHours()>9?b.getHours():"0"+b.getHours();
    		var c = b.getMinutes()>9?b.getMinutes():"0"+b.getMinutes();

    		$('#courseTime1').timespinner('setValue', n+":"+v);
    		$('#courseTime2').timespinner('setValue', d+":"+c);
    	}
    	$('#addTimeOpen').dialog('open');
    }
}
function formattooe(val,row){
	if(typeof (row.gmtOffDuty) === 'undefined'){
		return "未设置";
	}else{
		var s = new Date(row.gmtOnDuty);
		var b = new Date(row.gmtOffDuty);
		var n = s.getHours()>9?s.getHours():"0"+s.getHours();
		var v = s.getMinutes()>9?s.getMinutes():"0"+s.getMinutes();
		var d = b.getHours()>9?b.getHours():"0"+b.getHours();
		var c = b.getMinutes()>9?b.getMinutes():"0"+b.getMinutes();
		return n+":"+v+"~"+d+":"+c;
	}
}
function kqtk(){
	if(isadd){
		$.ajax({
			type:'post',
			url:'../ngym/GymRoleAction!setAttendanceTime.zk',
			data:{
				id: sodoid,
				gmtOnDuty:$('#courseTime1').timespinner('getValue')+':00',
				gmtOffDuty:$('#courseTime2').timespinner('getValue')+':00'
			},
			dataType:'JSON',
			success: function(res){
				if(res.STATUS){
					$.messager.show({
                        title: '提示',
                        msg: '添加成功'
                    });
                    $('#addTimeOpen').dialog('close');
                    $('#dg').datagrid('reload');
				}else{
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', res.INFO);
				}
			},
			error: function(err){
				console.log(err);
			}
		})
	}else{
		$.ajax({
			type:'post',
			url:'../ngym/GymRoleAction!update.zk',
			data:{
				id: sodoid,
				gmtOnDuty:$('#courseTime1').timespinner('getValue')+':00',
				gmtOffDuty:$('#courseTime2').timespinner('getValue')+':00'
			},
			dataType:'JSON',
			success: function(res){
				if(res.STATUS){
					$.messager.show({
                        title: '提示',
                        msg: '更新成功'
                    });
                    $('#dg').datagrid('reload');
                    $('#addTimeOpen').dialog('close');
				}else{
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', res.INFO);
				}
			},
			error: function(err){	
				console.log(err);
			}
		})
	}
}
$('#roleNew').on('click', function() {
	$('#edits,#adds').hide();
	
	$('.tree-multiselect').remove();
	alllist = [];
	var optionlist = $('#demo1 option');
	optionlist.each(function(index, el) {
			$(el).attr('data-index',"");
	});
	$('#roleName').val('');
	$("#demo1").treeMultiselect(params);
	$('#adds').show();
	$('#dlgNewlyBuild').dialog('open');
})
$('#roleEdit').on('click', function() {
	$('#edits,#adds').hide();
	$('#edits').show();
	$('.tree-multiselect').remove();
	var optionlist = $('#demo1 option');
	optionlist.each(function(index, el) {
			$(el).attr('data-index',"");
	});
	alllist = [];
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择角色!');
		return;
	}
	$('#roleName').val(row.name);
	$('#dlgCompile').attr('data-id', row.id);
	if (!!row.auths) {
		var auths = eval('(' + row.auths + ')');
		if(row.auths.indexOf("-")<0){
			var dil = [];
			$.each(auths,function(index, el) {
				switch(Number(el)){
					case 1: dil.push("1-0");break;
					case 8: dil.push("8-0");break;
					case 11: dil.push("11-0");break;
					case 3: dil.push("3-1");dil.push("3-2");break;
					case 4: dil.push("4-1");dil.push("4-2");dil.push("4-3");dil.push("4-4");dil.push("4-5");break;
					case 5: dil.push("5-1");dil.push("5-2");dil.push("5-3");dil.push("5-4");dil.push("5-5");dil.push("5-6");break;
					case 6: dil.push("6-1");dil.push("6-2");dil.push("6-3");dil.push("6-4");dil.push("6-5");break;
					case 10: dil.push("10-1");dil.push("10-2");break;
					case 7: dil.push("7-1");dil.push("7-2");break;
					case 9: dil.push("9-1");dil.push("9-2");break;
					case 0: dil.push("0-1");dil.push("0-2");dil.push("0-3");dil.push("0-4");dil.push("0-5");dil.push("0-6");dil.push("0-7");break;
				}
			});
			$.each(dil,function(index, el) {
				var self = el;
				optionlist.each(function(index, el) {
					if(self == $(el).val()){
						console.log(self+"vlaue"+$(el).text())
						$(el).attr('data-index',index+1);
					}
				});
			});
		}else{		
				$.each(auths,function(index, el) {
					var self = el;
					console.log(el)
					optionlist.each(function(index, el) {
						if(self == $(el).val()){
							console.log(self+"vlaue"+$(el).text())
							$(el).attr('data-index',index+1);
						}
					});
				});
		}
		
	}
	
	
	// var m = row.auths.replace((/\]|\[|\"/gi), "");
	// var nd = m.split(',');
	
	
	$("#demo1").treeMultiselect(params);
	
	
	$('#dlgNewlyBuild').dialog('open');
})

function saveNewRole() {
	var name = $('#roleName').val();
	if ($.trim(name) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入角色！');
		//		return false;
	}else {
		msgLoading();
		$.post('../ngym/GymRoleAction!add.zk', {
			name: name,
			auths: JSON.stringify(alllist)
		}, function(data) {
			msgLoading('close');
			if (data.STATUS) {
				$('#dlgNewlyBuild').dialog('close');
				$('#dg').datagrid('reload');
				$('#roleName').val('');
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}

}

function checkEdit() {
	// var record = $('#dg').datagrid('selectRow', index);
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择角色!');
		return;
	}
	$("input[name='checkEdit']").each(function() {
		$(this).attr('checked', false);
	})
	var auths = eval('(' + row.auths + ')');
	// var m = row.auths.replace((/\]|\[|\"/gi), "");
	// var nd = m.split(',');
	if (!!row.auths) {
	$.each(auths,function(index, el) {
		$("input[value='" + el + "'][name='checkEdit']").attr("checked", "checked");
	});
	}
	$('#dlgCompile').dialog('open');
	$('#roleNameEdit').val(row.name);
	$('#dlgCompile').attr('data-id', row.id);
	$('#dlgCompile').attr('data-count', row.count);
	// auths.forEach(function(e) {
	// 	$('#type').combobox('select', e);
	// })

}

function saveEditRole() {
	var name = $('#roleName').val();
	var id = $('#dlgCompile').attr('data-id');
	if ($.trim(name) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入角色！');
	} else {
		$.post('../ngym/GymRoleAction!update.zk', {
			id: id,
			name: name,
			auths: JSON.stringify(alllist)
		}, function(data) {
			if (data.STATUS) {
				$('#dlgNewlyBuild').dialog('close');
				$('#dg').datagrid('reload');
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}

}

function delRole() {
	var id = $('#dlgCompile').attr('data-id');
	var count = $('#dlgCompile').attr('data-count');
	if (count > 0) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '删除失败！请先清除该角色下的员工！');
		$('#dlgCompile').dialog('close');
		$('#dlgConfirm').dialog('close');
	} else {
		$.post('../ngym/GymRoleAction!delete.zk', {
			id: id
		}, function(data) {
			if (data.STATUS) {
				$('#dlgCompile').dialog('close');
				$('#dlgConfirm').dialog('close');
				$('#dlgNewlyBuild').dialog('close');
				$('#dg').datagrid('reload');
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}

}

function checkForm() {
	var nameEdit = $('#roleNameEdit').val();
	var nameNew = $('#roleName').val();
	if ($.trim(nameNew) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入角色！');
		return false;
	}
	if ($.trim(nameEdit) == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入角色！');
		return false;
	}
	return true;
}