	function loginTimeout() {
		window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
	}
	$(function() {
		$('#dg').datagrid({
			onLoadSuccess: function(data) {
				if (data.ERROR == '未登录' || (data.total == 0 && data.ERROR == 'No Login!')) { //(data.total == 0 && data.ERROR == 'No Login!')
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
					relogin();
				}
				if (data.total == 0 && data.STATUS) {
					//$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无会员卡记录');
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
	})
	$("#hideDiv").hide();
	//用户筛选事件,自动搜索
	$("#startDate").datebox({
		onChange: function(n, o) {
			searchUser(curStatus);
		},
		onSelect: function(n, o) {
			searchUser(curStatus);
		}
	});
	$("#endDate").datebox({
		onChange: function(n, o) {
			searchUser(curStatus);
		},
		onSelect: function(n, o) {
			searchUser(curStatus);
		}
	});

	var curChooseId = '';

	function onOver(id) {
		if (curChooseId == '' || curChooseId != id) {
			$('#' + id).css({
				color: '#FFD600'
			});
		}

	}

	function toOut(id) {
		if (curChooseId == '' || curChooseId != id)
			$('#' + id).css({
				color: '#fff'
			});
	}
	var curStatus;

	function toChooseUser(id, value) {
		if (curChooseId != '')
			$('#' + curChooseId).css({
				color: '#fff'
			});
		$('#' + id).css({
			color: '#FFD600'
		});
		userTypeT = $('#' + id).attr("data-value");
		curChooseId = id;
		curStatus = value;
		$('#dg').datagrid('clearChecked');
		searchUser(value);
	}
	//模拟点击
	function simulationClick(id, value) {
		if (curChooseId != '')
			$('#' + curChooseId).css({
				color: '#fff'
			});
		$('#' + id).css({
			color: '#FFD600'
		});
		userTypeT = $('#' + id).attr("data-value");
		curChooseId = id;
		curStatus = value;
		$('#dg').datagrid('clearChecked');
	}
	//搜索
	function searchUser(value) {
		var data = {};
		var userID = $('#userID').val();
		var name = $('#nameSearch').val();
		var phone = $('#phoneSearch').val();
		var startDate = $('#startDate').datebox('getValue'); //Date.parse($('#startDate').datebox('getValue'));
		var endDate = $('#endDate').datebox('getValue'); //Date.parse($('#endDate').datebox('getValue'));
		var mark = $('#markSearch').val();
		if (value && value != '')
			data.type = value;
		if (name && name != '')
			data.name = name;
		if (phone && phone != '')
			data.phone = phone;
		if (startDate && startDate != '')
			data.createStart = startDate + " 00:00:00";
		if (endDate && endDate != '')
			data.createEnd = endDate + " 00:00:00";
		if (startDate == endDate && endDate != '')
			data.createEnd = endDate + " 23:59:59";
		if (mark && mark != '')
			data.mark = mark;
		if (userID && userID != '')
			data.userId = userID;
		$("#dg").datagrid('load', data);

	}

	function searchUserById(id, value) {
		var data = {};
		var userID = id;
		var name = $('#nameSearch').val();
		var phone = $('#phoneSearch').val();
		var startDate = $('#startDate').datebox('getValue'); //Date.parse($('#startDate').datebox('getValue'));
		var endDate = $('#endDate').datebox('getValue'); //Date.parse($('#endDate').datebox('getValue'));
		var mark = $('#markSearch').val();
		if (value && value != '')
			data.type = value;
		if (name && name != '')
			data.name = name;
		if (phone && phone != '')
			data.phone = phone;
		if (startDate && startDate != '')
			data.createStart = startDate + " 00:00:00";
		if (endDate && endDate != '')
			data.createEnd = endDate + " 00:00:00";
		if (startDate == endDate && endDate != '')
			data.createEnd = endDate + " 23:59:59";
		if (userID && userID != '')
			data.userId = userID;
		if (mark && mark != '')
			data.mark = mark;
		$("#dg").datagrid('load', data);
	}

	function toSearch() {
		searchUser(curStatus);
	}

	//可执行操作
	function formatAction(value, row, index) {
		var seeMessage = '<a href="javascript:;"  onclick="seeMessageOne(\'' + row.userId + '\')">查看</a>';
		return seeMessage;
	}

	function formatSex(value) {
		if (value) {
			if (value == 'F') {
				return '女';
			} else {
				return '男';
			}
		} else {
			return '无'
		}
	}

	function formatBody(value) {
		if (value < 18.5) {
			return '<div style="color:#3ba9ef">偏瘦</div>'
		}
		if (value <= 23) {
			return '<div style="color:#8cc730">标准</div>'
		}
		if (value > 23) {
			return '<div style="color:#fe6262">偏胖</div>'
		}
		return '未知'
	}

	function seeMessageOne(id) {
		$.ajax({
			type: 'get',
			url: '../ngym/GymBodyExamAction!list.zk?userId=' + id,
			success: function(data) {
				datas = $.parseJSON(data);
				var data = datas.rows[0];
				if (datas.total == 0) {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '您还未进行过体测，请先点击体测录入进行信息录入再查看。');
				}
				if (datas.total >= 1) {
					var s = '';
					if (data.sex == 'F') {
						s = '女';
					} else if (data.sex == 'M') {
						s = '男';
					} else {
						s = '无数据';
					}
					data.gmtExam ? $('#showOneDate').text(formatTime(data.gmtExam).split(' ')[0]) : $('#showOneDate').text('暂无数据');
					$('#showOneDataT').text($('#showOneDate').text().split(' ')[0]);
					data.evaluation ? $('#showOneEvaluation').text(data.evaluation) : $('#showOneEvaluation').text('无评价');
					data.explain ? $('#showOneExplain').text(data.explain) : $('#showOneExplain').text('无说明');
					data.height ? $('#showOneHeight').text(data.height + 'cm') : $('#showOneHeight').text('暂无数据');
					data.weight ? $('#showOneWeight').text(data.weight + 'kg') : $('#showOneWeight').text('暂无数据');
					data.fat ? $('#showOneFat').text(data.fat + '%') : $('#showOneFat').text('暂无数据');
					data.bmi ? $('#showOneBMI').text(data.bmi) : $('#showOneBMI').text('暂无数据');
					data.heart ? $('#showOneHeart').text(data.heart + '次/分钟') : $('#showOneHeart').text('暂无数据');
					data.maxHeart ? $('#showOneMaxHeart').text(data.maxHeart + '次/分钟') : $('#showOneMaxHeart').text('暂无数据');
					data.capacity ? $('#showOneFVC').text(data.capacity + 'cc') : $('#showOneFVC').text('暂无数据');
					data.totleCalories ? $('#showOneDetail').text(data.totleCalories) : $('#showOneDetail').text('暂无数据'); //运动明细
					data.examName ? $('#showOneSuggest').text(data.examName) : $('#showOneSuggest').text('暂无数据');
					data.sex ? $('#showOneSex').text(s) : $('#showOneSex').text('暂无数据');
					data.age ? $('#showOneAge').text(data.age) : $('#showOneAge').text('暂无数据');
					$('#showOneSell').text(data.carloriesDay + 'kcal'); //每周日均消耗
					data.coachId ? $('#showOneJiao').text(coachInfo.realName) : $('#showOneJiao').text('暂无教练'); //教练
					$('#showOneDetail').html('<div style=font-size:12px;padding-left:20px;text-align:left;line-height:20px>累计消耗' + consumeCount + '</div><div style=font-size:12px;padding-left:20px;text-align:left;line-height:16px>-跑步消耗' + typeSportConsume[0] + 'kcal，-' + typeSportConsume[1] + '个记录</div><div style=font-size:12px;padding-left:20px;text-align:left;line-height:16px>-踏步消耗' + typeSportConsume[3] + 'kcal，-' + typeSportConsume[4] + '个记录</div><div style=font-size:12px;padding-left:20px;text-align:left;line-height:16px>-单车消耗' + typeSportConsume[5] + 'kcal，-' + typeSportConsume[6] + '个记录</div>')
					$('#SeeOneMessage').dialog('open');
				}
			},
			error: function() {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '查看信息出错！');
			}
		})
	}
	//时间格式化
	function formatTime(value) {
		var date = new Date((value));
		var result = date.format("yyyy-MM-dd hh:mm:ss"); //date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();//+':'+second;
		return result;
	}

	var curIndex;

	function editMesage(index) {
		var record = $('#dg').datagrid('selectRow', index);
		var row = $('#dg').datagrid('getSelected');
		curIndex = index;
		curId = row.id;
		$('#cardName').val(row.cardName);
		$('#messageName').val(row.name);
		if (row.sex == 'M')
			$('#messageSex').combobox('setText', '男');
		else if (row.sex == 'F')
			$('#messageSex').combobox('setText', '女');
		$('#birthDate').datebox('setValue', new Date(row.gmtBirth).format("yyyy-MM-dd"));
		$('#dlgEditMessage').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;体测录入");
	}

	function seeMessage(index) {
		if ($('#testCount').val() <= 1) {
			$('#dlgSeeOnlyMessage').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;对比与评价");
		} else {
			$('#dlgSeeMessage').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;对比与评价");
		}

	}

	//查看客户信息
	function seeMember(id) {
		$.post('../ngym/GymMembersAction!listCustomer.zk', {
			userId: id,
			page: 1,
			rows: 1
		}, function(data) {
			if (data.STATUS) {
				//清除
				$('#userIcon').attr('src', '../images/default.png');
				$('#nickName').text('');
				$('#userStatus').text('');
				$('#gmtUserCreate').text('');
				$('#gmtUserLike').text('');
				var the = data.rows[0];
				$('#userIcon').attr('src', '../file/FileCenter!showImage2.zk?name=');
				$('#nickName').text(the.nickName)
				$('#userStatus').text();
				$('#gmtUserCreate').text(formatTime(the.gmtCreate));
				$('#gmtUserLike').text(formatTime(the.gmtLike));
				$('#dlgUserMessage').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;客户信息");
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '获取信息失败!');
			}
		}, 'json');
	}