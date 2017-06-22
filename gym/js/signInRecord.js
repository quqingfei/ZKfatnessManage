	function loginTimeout() {
		window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
	}
	$(function() {
		//localTime();//启动日期计时器
		$('#hideDiv').hide();
		$('#dg').datagrid({
			onLoadSuccess: function(data) {
				if ((data.total == 0 && data.ERROR == 'No Login!') || (data.ERROR == '未登录')) {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
					relogin();
				}

			},
			onLoadError: function() {
				//alert('出错啦');
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
					$("#dg").datagrid('load', {
						userId: data.userId
					});
				} else {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码!');
				}
			}, 'json');
		});
	});



	function searchUser() {
		var data = {};
		var phone = $('#phoneSearch').val();
		var name = $('#nameSearch').val();
		var startDate = $('#startDate').datebox('getValue'); //Date.parse($('#startDate').datebox('getValue'));
		var endDate = $('#endDate').datebox('getValue'); //Date.parse($('#endDate').datebox('getValue'));
		if (phone && phone != '')
			data.userPhone = phone;
		if (name && name != '')
			data.memberName = name;
		if (startDate && startDate != '')
			data.gmtStart = startDate + " 00:00:00";
		if (endDate && endDate != '')
			data.gmtEnd = endDate + " 00:00:00";
		if (startDate == endDate && endDate != '')
			data.gmtEnd = endDate + " 23:59:59";
		$("#dg").datagrid('load', data);
	}


	//会员卡类型
	function formatCardType(value, row) {
		switch (parseInt(eval('(' + row.memberInfo + ')').cardType)) {
			case 0:
				return '时效卡';
			case 1:
				return '次数卡';
			default:
				return '';
		}
	}
	//会员卡名称
	function formatCardName(value, row) {
		return eval('(' + row.memberInfo + ')').cardName;
	}
	//手机号码
	function formatPhone(value) {
		return eval('(' + value + ')').phone;
	}
	//当前可执行的操作
	var curRowMessage = {};

	function formatAction(value, row, index) {
		var seeCard = '<a href="javascript:;" onclick="seeCard(\'' + eval('(' + row.memberInfo + ')').userId + '\')">查看会员卡</a>';
		//var signIn = '<a href="javascript:;"  onclick="signIn(\'' + row.userId + '\',\''+ row.id +'\',\''+row.cardType+'\',\''+index+'\')">离场签到</a>';
		var action = '<div class="action">' + seeCard + '</div>';
		return action;
	}

	function seeCard(id) {
		$('#memberCard', window.parent.document).trigger('click');
		$('#allCard', window.parent.document).trigger('click');
		event.cancelBubble = true;
		window.parent.curSeeUserId = id;
		return false;
	}

	//日期换算
	function formatTime(value) {
		//alert(value);
		if (!value) {
			return '';
		}
		var date = new Date((value));
		var result = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(); //+':'+second;
		return result;
	}

	//标注当前行
	//标注
	function formatRemark(value, row, index) {
		if (value == "" || value == null || value == '[]') {
			return "<img title='标注' style='width:14px;height:14px;margin-top:0px;cursor:pointer;' src='images/remark.png' onclick=\"remarkEdit('" + eval('(' + row.memberInfo + ')').id + "'," + index + ");\"/>"; //event.cancelBubble=true;event.stopPropagation();
		}
		//remark = [];
		//value = eval('('+value+')');
		//alert(value);
		var array = eval('(' + value + ')');
		//array.push(value);
		var result = "";
		for (var i = 0; i < array.length; i++) {
			result = result + array[i] + ',';
			//remark.push(array[i]);
		}
		if (result.length > 12)
			result = result.substr(0, 11);
		//alert(JSON.stringify(row));
		return "<div style='width:100%;height:100%;text-align:center;' onclick=\"remarkEdit('" + eval('(' + row.memberInfo + ')').id + "'," + index + ");\">" + result + "<img title='标注' style='width:14px;height:14px;margin-top:0px;cursor:pointer;' src='images/remark.png'/>" + "</div>"; //event.cancelBubble=true;event.stopPropagation();
	}
	//标注
	var remarkId;
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
		var rowInfo = eval('(' + row.memberInfo + ')');
		if (row) {
			$('#dlg').dialog('open').dialog('setTitle', "&nbsp;&nbsp;" + row.cardName + "的标注");
			remarkId = rowInfo.id;
			curRow = row;
			var fatherDiv = document.getElementById("remarkList");
			remark = [];
			if (!row.remark || row.remark == '')
				return;
			var array = eval('(' + row.remark + ')');
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
		$.post('../ngym/GymMembersAction!update.zk', {
			id: remarkId,
			mark: string
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
				curRow.remark = string;
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