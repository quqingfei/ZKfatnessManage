// Vue.config.debug = true;
var superControl = new Vue({
	el: 'body',
	ready: function() {
		dataInit();
		getMembersCard();
		$('#userCode').focus();
		$('#hideDiv').hide();

	},
	data: {
		cardTotal: 0,
		balanceTotal: 0,
		leaseTotal: 0,
		infoIcon: 'images/regist_pic.png',
		infoName: '',
		infoNameMore: '',
		infoSex: '',
		infoAge: '',
		infoHeight: '',
		infoWeight: '',
		infoFat: '',
		infoPhone: '',
		infoBirth: '',
		infoPhoto: '',
		infoMarks: '',
		infoMarksMore: '',
		stopState: '[未停卡]',
		checkReal: '',
		checkShould: '',
		checkItem: '',
		checkRemark: ''
	},
	methods: {
		openCard: function() {
			if (!!superId) {
				clearAddFromNew();
				photoState = 1;
				$('#headIconNew').show();
				$('#iconVideoNew').hide();
				if (!!superControl.infoName) {
					$('#messageNameNew').val(superControl.infoName);
				}
				if (!!superControl.infoPhone) {
					$('#messagePhoneNew').val(superControl.infoPhone);
				}
				if (!!superControl.infoPhoto) {
					var imgURL = "../file/FileCenter!showImage2.zk?name=" + superControl.infoPhoto;
					$("#headIconNew").attr("src", imgURL);
					$("#messageImageNew").val(superControl.infoPhoto);
				}
				if (!!superControl.infoSex) {
					switch (superControl.infoSex) {
						case '男':
							$("#messageSexNew").combobox('setValue', 'M');
							break;
						case '女':
							$("#messageSexNew").combobox('setValue', 'F');
							break;
						default:
							break;
					}
				}
				if (!!superControl.infoBirth) {
					var birth = superControl.infoBirth;
					$("#birthDateNew").val(formatBirthDay(birth));
				}
				$('#dlgNew').dialog('open');
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
			}

		},
		payInput: function() {
			if (!!superId) {
				$('#payVolumeReal').val('');
				$('#payVolumeShould').val('');
				$('#payRemark').val('');
				$('#payItem').val('');
				$('#payForm').dialog('open');
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
			}

		},
		storeInput: function() {
			if (!!superId) {
				$('#storeVolumeShould').val('');
				$('#storeVolumeReal').val('');
				$('#storeRemark').val('');
				$('#storeForm').dialog('open');
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
			}
		},
		leaseInput: function() {
			if (!!superId) {
				$('#borrowItem').val('');
				$('#borrowRemark').val('');
				$('#dlgBorrow').dialog('open');
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
			}

		},
		submitCode: function() {
			$('#userCode').blur();
		},
		markEdit: function() {
			if (!!superId) {
				// var div = document.getElementById("remarkList");
				// while (div.hasChildNodes()) // 当div下还存在子节点时 循环继续
				// {
				// 	div.removeChild(div.firstChild);
				// }
				// $("#markMessage").val('');
				// $('#dlgMark').dialog('open');
				// var fatherDiv = document.getElementById("remarkList");
				// if (!!superControl.infoMarks) {
				// 	for (var i = 0; i < superControl.infoMarks.length; i++) {
				// 		var div = document.createElement("div");
				// 		$(div).attr({
				// 			'id': i + '-div',
				// 			'class': 'remarkPoint'
				// 		});
				// 		$(div).text(superControl.infoMarks[i]);
				// 		fatherDiv.appendChild(div);
				// 		var imgDiv = document.createElement("div");
				// 		$(imgDiv).attr({
				// 			'id': i + 'imgDiv',
				// 			'class': 'delRemark',
				// 			'value': i,
				// 			'onclick': 'delRemark("' + i + 'imgDiv")'
				// 		});
				// 		div.appendChild(imgDiv);
				// 	}
				// }
				$('#inputRemark').val(superControl.infoMarks);
				$('#dlgMark').dialog('open');
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
			}

		}
	}
})

$('#userCode').focus(function() {
	$('#userCode').val('');
});

$('#userCode').blur(function() {
	if ($('#userCode').val()) {
		superCode();
	}
});
var lastt = "";
laydate({
  elem: '#startDateNew',
  format: 'YYYY-MM-DD',
  choose: function(datas){ //选择日期完毕的回调
 		lastt="";
  		var cha = todm(datas);
  		if(cha == 0){
  			console.log(YeT)
  			$('#endDateNew').val(YeT);
  		}else{
  			var endT = haom(YeT);
	    	var endts= endT+cha;
	    	$('#endDateNew').val(new Date(endts).format("yyyy-MM-dd"));
	    	lastt = new Date(endts).format("yyyy-MM-dd");
  		}
  }
});
function todm(time){
	return haom(time)-haom(YsT);
}
function haom(time){
	return new Date(time).getTime();
}

function dataClear() {
	superControl.cardTotal = 0;
	superControl.balanceTotal = 0;
	superControl.leaseTotal = 0;
	superControl.infoIcon = 'images/headIcon.png';
	superControl.infoName = '';
	superControl.infoSex = '';
	superControl.infoAge = '';
	superControl.infoHeight = '';
	superControl.infoWeight = '';
	superControl.infoFat = '';
	superControl.infoPhone = '';
	superControl.infoBirth = '';
	superControl.infoPhoto = '';
	superControl.infoMarks = '';
}
var superId = '';
$('#moreMark').on('click', function() {
	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;更多标注', superControl.infoMarks);
})

// var realMark;

function superCode() {
	var code = $('#userCode').val();
	if (code == '' || code.length > 18) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '条码不正确！');
	} else {
		$.post('userAction!getUserByCode.zk', {
			code: code
		}, function(data) {
			// data = eval('(' + data + ')');
			if (data.STATUS) {
				dataClear();
				superId = data.userId;
				$('#userId').val(superId);
				if (!!data.weight && !!data.height) {
					superControl.infoFat = showBMI(data.weight, data.height);
				}
				if (!!data.memberPhoto) {
					superControl.infoPhoto = data.memberPhoto;
					superControl.infoIcon = "../file/FileCenter!showImage2.zk?name=" + data.memberPhoto;
				}
				if (!!data.memberName) {
					superControl.infoName = data.memberName;
				}
				if (!!data.memberName && data.memberName.length > 4) {
					superControl.infoNameMore = '...';
				} else {
					superControl.infoNameMore = '';
				}
				if (!!data.age) {
					superControl.infoAge = data.age;
				}
				if (!!data.sex) {
					superControl.infoSex = data.sex;
				}
				if (!!data.height) {
					superControl.infoHeight = data.height + '厘米';
				}
				if (!!data.weight) {
					superControl.infoWeight = data.weight + '公斤';
				}
				if (!!data.phone) {
					superControl.infoPhone = data.phone;
				}
				if (!!data.birthDay) {
					superControl.infoBirth = data.birthDay;
				}
				if (!!data.mark) {
					superControl.infoMarks = data.mark;
					// realMark = data.mark;
				}
				if (!!data.saleId) {
					$('#hjSel').combobox('setValue', data.saleId);
				}
				if (!!superControl.infoMarks && superControl.infoMarks.length > 10) {
					superControl.infoMarksMore = '...';
				} else {
					superControl.infoMarksMore = '';
				}
				$('#dgSign').datagrid({
					url: '../ngym/GymMembersAction!list.zk',
					queryParams: {
						userId: superId,
						type: 'effect',
						cardType: 1
					},
					onLoadSuccess: function(data) {
						if (data.STATUS) {
							if (data.total > 0) {
								showTable(superId);
								cardCount(superId);
								$('#dlgSign').dialog('open');
								$('#dgSign').datagrid('selectRow', 0);
							} else {
								$.post('../ngym/GymMembersAction!list.zk', {
									userId: superId,
									page: 1,
									rows: 30,
									type: 'effect',
									cardType: 0
								}, function(data) {
									if (data.STATUS) {
										var today = new Date();
										var now = today.getTime();
										var num = 0;
										if (data.total == 0) {
											showTable(superId);
											cardCount(superId);
										}
										$.each(data.rows, function(n, value) {
											if (value.gmtStart < now) {
												cardSign(value.userId, value.id, value.cardType);
												return false;
											}
											num = n;
										});
										if (num == data.total - 1) {
											$.each(data.rows, function(n, value) {
												if (value.gmtStart > now) {
													$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;激活确认', '确认激活' + value.cardName + '吗？', function(r) {
														if (r) {
															cardSign(value.userId, value.id, value.cardType);
														}
													});
												}
											});
										}
									} else {
										if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
											loginTimeout();
											return;
										}
										$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
									}
								}, 'json');
							}
						} else {
							if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
								loginTimeout();
								return;
							}
							$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
						}
					}
				});
			} else {
				if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码！');
			}
		}, 'json');
	}
}
var hjId, hjSel;

function dataInit() {
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
	// $('#birthDate').combobox({
	// 	valueField: 'id',
	// 	textField: 'year',
	// 	data: years
	// });
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
			$('#hjSel').combobox({
				valueField: 'id',
				textField: 'duty',
				data: makers,
				onSelect: function(rec) {
					hjSel = rec.duty;
					hjId = rec.id;
				}
			});
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
}

function showTable(uid) {
	$('#dgCard').datagrid({
		url: '../ngym/GymMembersAction!list.zk',
		fitColumns: true,
		nowrap: true,
		rownumbers: true,
		singleSelect: true,
		pagination: true,
		pageSize: '30',
		method: 'post',
		queryParams: {
			userId: uid,
			type: 'effect'
		},
		onLoadSuccess: function(data) {
			if (data.STATUS) {
				superControl.cardTotal = data.total;
			} else {
				if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}
	})

	$('#dgLease').datagrid({
		url: '../ngym/GymUserBorrowAction!list.zk',
		fitColumns: true,
		nowrap: true,
		rownumbers: true,
		singleSelect: true,
		pagination: true,
		pageSize: '30',
		method: 'post',
		queryParams: {
			status: 0,
			userId: uid
		},
		onLoadSuccess: function(data) {
			if (data.STATUS) {
				superControl.leaseTotal = data.total;
			} else {
				if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}
	})
	$('#dgMoney').datagrid({
		url: '../ngym/GymUserStoreAction!listExpenseAndStory.zk',
		fitColumns: true,
		nowrap: true,
		rownumbers: true,
		singleSelect: true,
		pagination: true,
		pageSize: '30',
		method: 'post',
		queryParams: {
			userId: uid
		}
	})
}
//取消次卡签到
function signCancle() {
	$('#dlgSign').dialog('close');
	showTable(superId);
	cardCount(superId);
	$.post('../ngym/GymMembersAction!list.zk', {
		userId: superId,
		page: 1,
		rows: 30,
		type: 'effect',
		cardType: 0
	}, function(data) {
		if (data.STATUS) {
			var today = new Date();
			var now = today.getTime();
			var num = 0;
			$.each(data.rows, function(n, value) {
				if (value.gmtStart < now) {
					cardSign(value.userId, value.id, value.cardType);
					return false;
				}
				num = n;
			});
			if (num == data.total - 1) {
				$.each(data.rows, function(n, value) {
					if (value.gmtStart > now) {
						$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;激活确认', '确认激活' + value.cardName + '吗？', function(r) {
							if (r) {
								cardSign(value.userId, value.id, value.cardType);
							}
						});
					}
				});
			}
		} else {
			if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
				loginTimeout();
				return;
			}
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
}
//确认次卡签到
function signSure() {
	var row = $('#dgSign').datagrid('getSelected');
	if (!!row) {
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;签到确认', '确认签到' + row.cardName + '吗？', function(r) {
			if (r) {
				cardSign(row.userId, row.id, row.cardType);
			}
		});
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要签到的次卡。');
	}
}
//签到
function cardSign(uid, mid, type) {
	msgLoading();
	$.post('../ngym/GymMembersAction!sign.zk', {
		userId: uid,
		memberId: mid
	}, function(data) {
		if (data.STATUS) {
			msgLoading('close');
			if (type == 1) {
				$.messager.show({
					title: "&nbsp;&nbsp;消息",
					timeout: 2000,
					msg: "签到成功!"
				});
				$('#dlgSign').dialog('close');
			}
			showTable(superId);
			cardCount(superId);
		} else {
			msgLoading('close');
			if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
				loginTimeout();
				return;
			}
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
}

function saveUserMark() {
	if ($('#inputRemark').val().length <= 20) {
		$.post('userAction!remark.zk', {
			userId: superId,
			remark: $('#inputRemark').val()
		}, function(data) {
			if (data.STATUS) {
				superControl.infoMarks = $('#inputRemark').val();
				if (!!superControl.infoMarks && superControl.infoMarks.length > 10) {
					superControl.infoMarksMore = '...';
				} else {
					superControl.infoMarksMore = '';
				}
				$('#dlgMark').dialog('close');
			} else {
				if ('No Login!' == data.ERROR || '未登录' == data.ERROR) {
					loginTimeout();
					return;
				} else {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
					return false;
				}
			}
		}, 'json');
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注最多20个字');
		return false;
	}
}

// $('#inputRemark').focus(function () {

// })

function cardCount(uid) {
	$.post('../ngym/GymUserStoreAction!list.zk', {
		userId: uid,
		page: 1,
		rows: 10
	}, function(data) {
		// data = eval('(' + data + ')');
		if (data.STATUS) {
			// return data.total;
			if (!!data.rows[0]) {
				var row = eval(data.rows[0]);
				superControl.balanceTotal = (row.totleStore*10000 - row.useStore*10000)/10000;
			}
		} else {
			if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
				loginTimeout();
				return;
			}
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
}

function showBMI(weight, height) {
	var bmi = weight / height / height * 10000;
	if (bmi < 18.5) return '偏瘦';
	if (bmi >= 18.5 && bmi < 24) return '标准';
	if (bmi >= 24 && bmi < 28) return '偏胖';
	if (bmi >= 28) return '肥胖';
}

function formatCount(value, row) {
	var time = row.totleTime - value;
	return time;
}

function formatState(value) {
	var state = '';
	switch (value) {
		case 0:
			state = '借出'
			break;
		case 1:
			state = '归还'
			break;
		case 2:
			state = '丢失'
			break;
		default:
			state = ''
			break;
	}
	return state;
}

function formatKind(value) {
	if (value == 3) {
		return '<span style="color:#56D96B">充值</span>'
	} else {
		return '<span style="color:#F55A5D">消费</span>'
	}
}

function formatMore(value, row, index) {
	var more = '<div class="store-control"><a href="javascript:;" onclick="payCheck(' + index + ')">详情</a></div>';
	return more;
}

function payCheck(index) {
	var record = $('#dgMoney').datagrid('selectRow', index);
	var row = $('#dgMoney').datagrid('getSelected');
	superControl.checkItem = row.goods;
	superControl.checkShould = row.shouldPay;
	superControl.checkReal = row.realPay;
	superControl.checkRemark = row.remark;
	$('#dlgCheck').dialog('open');
}

function formatTime1(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd hh:mm:ss");
}

function formatTime2(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd");
}

function formatTime(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd hh:mm");
}

function formatMost(value) {
	var content = value;
	if (value == '' || !value) return '';
	if (content.length > 8) {
		content = content.substring(0, 8) + '...';
	}
	return content;
}

function formatBorrow(value, row) {
	var back = '<a href="javascript:;" style="color:#3fc371;" onclick="statusAttr(\'' + value + '\',' + 1 + ')">归还</a>';
	var lost = '<a href="javascript:;" style="color:#FA5B38;" onclick="statusAttr(\'' + value + '\',' + 2 + ')">丢失</a>';
	var control = '<div class="borrow-control">' + lost + back + '</div>';
	return control;
}

function statusAttr(userid, bor) {
	$('#dlgRemark').val('');
	$('#dlgSubmit').dialog('open');
	var rem = $('#dlgRemark').val();
	if (bor == 1) {
		$('#dlgContent').text('确认归还？');
		// $('.borrow-lost').hide();
	} else {
		$('#dlgContent').text('确认丢失？');
		// $('.borrow-lost').show();
	}
	$('#dlgSure').attr({
		'data-uid': userid,
		'data-bor': bor,
		'data-rem': rem
	});
}

$('#dlgSure').on('click', function() {
	var uid = $(this).attr('data-uid');
	var bor = $(this).attr('data-bor');
	var rem = $(this).attr('data-rem');
	// rem = rem.replace(/<br>/g, '\n');
	statusChange(uid, bor, rem);
	$('#dlgSubmit').dialog('close');
})

function statusChange(uid, bor, rem) {
	//	console.log(uid);
	$.post('../ngym/GymUserBorrowAction!setStatus.zk', {
		id: uid,
		status: bor,
		remark: rem
	}, function(data) {
		// data = eval('(' + data + ')');
		// console.log(data);
		if (data.STATUS) {
			$('#dgLease').datagrid('reload');
			$('#dlgSubmit').dialog('close');
			// cardCount(superId);
		} else {
			if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
				loginTimeout();
				return;
			}
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
}

function formatControl(value, row, index) {
	var stopCard = '<a href="javascript:;"  style="color:#FA5B38;" onclick="stopCard(' + index + ')">停卡</a>';
	var transCard = '<a href="javascript:;" style="color:#3fc371;" onclick="transCard(' + index + ')">转卡</a>';
	if (row.cardType == 1) stopCard = '<a href="javascript:;" style="color:#666666" disabled="disabled">停卡</a>';
	var action = '<div class="action">' + stopCard + transCard + '</div>';
	return action;
}
//转卡
var transId = '';

function transCard(index) {
	clearAddForm();
	photoState = 1;
	$('#headIcon').show();
	$('#iconVideo').hide();
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
			// data = eval('(' + data + ')');
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
				if (!!data.birthDay) {
					// var birth = data.birthYear + '-1-1';
					$("#birthDate").val(formatBirthDay(data.birthDay))
				}
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码!');
			}
		}, 'json');
	});
	var record = $('#dgCard').datagrid('selectRow', index);
	var row = $('#dgCard').datagrid('getSelected');
	var type;
	if (row.cardType == 1) {
		type = '次卡';
		$('#startDate').val(formatTime2(row.gmtStart));
		$('#endDate').val(formatTime2(row.gmtEnd));
		$('#countLast').val(row.useTime);
		$('#count').val(row.totleTime);
		// $('#timeCard').hide();
		$('#countCard').show();
		$('#cycleMsg').hide();
		$('#timeMsg').show();
	} else {
		type = '时效卡';
		$('#startDate').val(formatTime2(row.gmtStart));
		$('#endDate').val(formatTime2(row.gmtEnd));
		// $('#timeCard').show();
		$('#countCard').hide();
		$('#cycleMsg').show();
		$('#timeMsg').hide();
	}
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
	$('#gmtCreate').attr('data-time', formatTime1(row.gmtCreate));
}

//拍照
function startPhotograph(videoId, open) {
	if (navigator.webkitGetUserMedia) {
		$('#headIcon' + open).hide();
		$('#' + videoId).show();
		var video = document.getElementById(videoId);
		navigator.webkitGetUserMedia({
			"video": true
		}, function(stream) {
			video.src = window.webkitURL.createObjectURL(stream);
			video.play();
		}, function() {
			$.messager.show({
				title: "&nbsp;&nbsp;消息",
				timeout: 2000,
				msg: "未安装摄像头!"
			});
		});
		return;
	} else if (navigator.getUserMedia) {
		$('#headIcon' + open).hide();
		$('#' + videoId).show();
		var video = document.getElementById(videoId);
		navigator.getUserMedia({
			"video": true
		}, function(stream) {
			video.src = stream;
			video.play();
		}, function() {
			$.messager.show({
				title: "&nbsp;&nbsp;消息",
				timeout: 2000,
				msg: "未安装摄像头!"
			});
		});
		return;
	} else if (navigator.mozGetUserMedia) {
		$('#headIcon' + open).hide();
		$('#' + videoId).show();
		var video = document.getElementById(videoId);
		navigator.mozGetUserMedia({
			"video": true
		}, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, function() {
			$.messager.show({
				title: "&nbsp;&nbsp;消息",
				timeout: 1000,
				msg: "未安装摄像头!"
			});
		});
		return;
	}
}

function getPhotograph(videoId, canvasId, open) {
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
			$('#headIcon' + open).show();
			$('#' + videoId).hide();
			$('#headIcon' + open).attr('src', base64); //'../file/FileCenter!showImage2.zk?name='+userPhoto
			$("#messageImage" + open).val(data.fileId);
		} else {
			$.messager.show({
				title: "&nbsp;&nbsp;消息",
				timeout: 1000,
				msg: "头像上传失败!"
			});
		}
	}, 'json');
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
	var startDatenum = parseInt(startDate.replace(/\-/g, "").replace(/\:/g, "").replace(/\ /g, ""));
	var endDatenum = parseInt(endDate.replace(/\-/g, "").replace(/\:/g, "").replace(/\ /g, ""));
	var regs = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
	// var IDcard = $.trim($('#IDcard').val());
	// var height = $.trim($('#height').val());
	// var weight = $.trim($('#weight').val());
	// var position = $.trim($('#position').val());
	// var messageEmployer = $.trim($('#messageEmployer').val());
	// var homeAddress = $.trim($('#homeAddress').val());
	// var workAddress = $.trim($('#workAddress').val());
	// var remark = $.trim($('#remark').val());
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
	if (!regs.test(realPay)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额必须为大于0的数值!');
		$("#realPay").focus();
		return false;
	}
	if (curCardType == '时效卡') {
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
	} else if (curCardType == '次卡') {
		if (!count || count == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '次卡使用次数不能为空!');
			$("#count").focus();
			return false;
		}
		if (!regs.test(count)) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '次数必须为大于0的数值!');
			$("#count").focus();
			return false;
		}
	}
	if (startDatenum >= endDatenum) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '失效日期必须大于生效日期!');
		return false;
	}
	if (!birthDate || birthDate == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '出生日期不能为空!');
		$("#birthDateNew").focus();
		return false;
	}
	if (!messageName || messageName == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '姓名不能为空!');
		$("#messageName").focus();
		return false;
	}
	if (messageName.length > 10) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '姓名长度不得超过10位！');
		$("#messageName").focus();
		return false;
	}
	if (!isTelephone(messagePhone)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请填写正确的手机号码!');
		$("#messagePhone").focus();
		return false;
	}
	if (!messageSex || messageSex == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择性别!');
		$("#messageSex").focus();
		return false;
	}
	if (!messageImage || messageImage == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '头像不能为空!');
		$("#messageImage").focus();
		return false;
	}
	// if (homeAddress.length > 32 || workAddress.length > 32 || remark.length > 32) {
	// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '最多输入32个字!');
	// 	return false;
	// }

	return true;
}
//保存转卡信息
function saveMessage() {
	if (checkForm()) {
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
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;转卡确认', '请确认双方信息，确认转卡？', function(r) {
			if (r) {
				msgLoading();
				$.post('../ngym/GymMembersAction!transfer.zk', data, function(data) {
					// data = eval('(' + data + ')');
					if (data.STATUS) {
						msgLoading('close');
						clearAddForm();
						$.messager.show({
							title: "&nbsp;&nbsp;消息",
							timeout: 2000,
							msg: "转卡成功!"
						});
						// cardCount(superId);
						// toSearch();
						$('#dgCard').datagrid('reload');
						$('#dlgTrans').dialog('close');
					} else {
						msgLoading('close');
						if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
							loginTimeout();
							return;
						}
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
					}
				}, 'json');
			}
		});

	}
}

function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}

//获取会员卡类型
var cards;
var curCardType;
var curCardTypeStr;
var curCardName;

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
		$('#timeCardNewdd').show();

		$('#startDateNew').val(start);
		$('#endDateNew').val(end);
		$('#minPrice').text(card.minPrice)
	}

	if (card.type == 1) {
		curCardTypeStr = '次卡';
		$('#timeCardNewdd').hide();
		$('#countCardNew').show();
		$('#startDateNew').val(start);
		$('#endDateNew').val(dateAdd('y', 1, new Date()));
		$('#countNew').val(card.count);
		$('#minPrice').text(card.minPrice)
	}

	curCardName = card.text;
}
//	function cardsChange(id){
//	    var card = getSelectCard(id) ;
//	    if(!card){ return ; }
//	    if( 0 == card.type  ){
//	        $('#countCard').hide();
//	        $('#timeCard').show();
//	    }
//	    if(1 == card.type){
//	        $('#timeCard').hide();
//	        $('#countCard').show();
//	    }
//	}

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
					$('.chooseded').show();
					$('#startDateNew').css('background','#fff');
	
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
	if (!superId || superId == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码!');
		$("#userId").focus();
		return false;
	}
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
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '次数必须为大于0的数值!');
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

// function isTelephone(obj) { //手机号正则判断
// 	var pattern = /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0?1[3|4|5|8|7][0-9]\d{8}$)/;
// 	if (pattern.test(obj)) {
// 		return true;
// 	} else {
// 		return false;
// 	}
// }

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
		data.salesPersonId = $('#hjSel').combobox('getValue');
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
	itemData=null;
}
function printPaper(){
	if(itemData.name !="" && typeof(itemData.name)!="undefined"){	
		var name = encodeURI(encodeURI(itemData.name));				
		var typeText = encodeURI(encodeURI(itemData.typeText));				
		window.open("paper.html?name="+name+"&cardId="+itemData.cardId+"&gmtStart="+itemData.gmtStart+"\
			&gmtEnd="+itemData.gmtEnd+"&phone="+itemData.phone+"&typeText="+typeText);
	}
}

$('#borrowSubmit').on('click', function() {
	if (checkFormLease()) {
		msgLoading();
		clearSpecialStr('dlgBorrow');
		var item = $('#borrowItem').val();
		var remark = $('#borrowRemark').val();
		if (remark == '') {
			remark = '无';
		}
		var type = $('#borrowKind').combobox('getValue');
		$.post('../ngym/GymUserBorrowAction!add.zk', {
			userId: superId,
			borrow: item,
			remark: remark,
			type: type
		}, function(data) {
			msgLoading('close');
			// data = eval('(' + data + ')');
			if (data.STATUS) {
				$.messager.show({
					title: "&nbsp;&nbsp;消息",
					timeout: 2000,
					msg: "领用成功!"
				});
				// cardCount(superId);
				$('#dgLease').datagrid('reload');
				$('#dlgBorrow').dialog('close');
			} else {
				if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}
})


function checkFormLease() {
	// var code = $('#userCode').val();
	var item = $('#borrowItem').val();
	var remark = $('#borrowRemark').val();
	if (superId == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
		return false;
	}
	if (item == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '租赁物品不能为空！');
		return false;
	}
	if (item.length > 16) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '租赁物品最多16个字');
		return false;
	}
	if (remark.length > 20) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注最多20个字');
		return false;
	}
	return true;
}

var curStopId;

function stopCard(index) {
	var record = $('#dgCard').datagrid('selectRow', index);
	var row = $('#dgCard').datagrid('getSelected');
	// $('#restartDate').val(formatTime1(row.gmtStart));
	if (row.effective == 'false') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员卡已过期!');
		return;
	}
	curStopId = row.id
	if (row.totlePause) {
		$('#stopCount').text(row.totlePause);
	} else {
		$('#stopCount').text('0');
	}
	var today = new Date();
	if (row.gmtStart - today.getTime() >= 0) {
		superControl.stopState = '[已停卡]';
	} else {
		superControl.stopState = '[未停卡]';
	}
	if (row.totlePauseDate) {
		$('#stopTime').text(parseInt(row.totlePauseDate / 3600 / 24 / 1000));
	} else {
		$('#stopTime').text('0');
	}
	$('#stopTime').text('');
	$('#dlgStopMessage').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;停卡");
	$('#dlgStopMessage').attr('data-end', row.gmtEnd);
	$('#dlgStopMessage').attr('data-start', row.gmtStart);
}

function restart(date) {
	var today = new Date();
	var start = $('#dlgStopMessage').attr('data-start');
	// var days = date.getTime() - today.getTime();
	// if (days < 0) {
	// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择今天以后的时间!');
	// 	$('#restartDate').datebox('setValue', '');
	// }
	var days;
	date = new Date(date);
	if (start < today.getTime()) {
		days = date.getTime() - today.getTime();
		if (days < 0) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择今天以后的时间!');
			$('#restartDate').val('');
		}
	} else {
		days = date.getTime() - start;
	}
	var newEnd = parseInt($('#dlgStopMessage').attr('data-end')) + days;
	newEnd = formatTime1(newEnd);

	$('#dlgStopMessage').attr('data-newend', newEnd);
}

function chooseSure(dlgId) {
	var startDate = $('#restartDate').val();
	var endDate = $('#dlgStopMessage').attr('data-newend');
	if (!startDate || startDate == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '起始时间不能为空!');
		$("#restartDate").focus();
		return false;
	}
	// startDate += " 00:00:00";
	// endDate += " 00:00:00";
	$.post('../ngym/GymMembersAction!pause.zk', {
		id: curStopId,
		gmtStart: startDate,
		gmtEnd: endDate
	}, function(data) {
		// data = eval('(' + data + ')');
		if (data.STATUS) {
			$('#' + dlgId).dialog('close');
			$('#dgCard').datagrid('reload');
			$.messager.show({
				title: "&nbsp;&nbsp;消息",
				timeout: 2000,
				msg: "停卡成功!"
			});
		} else {
			if (data.INFO) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
				return false;
			}
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '停卡失败!');
		}
	}, 'json');
}

function chooseCancle(dlgId) {
	$('#' + dlgId).dialog('close');
	$('#restartDate').val('');
	// $('#endDate').datebox('setValue', '');
	$('#stopCount').text('0');
	$('#stopTime').text('0');
	curStopId = '';
}

// 充值
function checkFormStore() {
	// var code = $('#userCode').val();
	var should = $('#storeVolumeShould').val();
	var remark = $('#storeRemark').val();
	var real = $('#storeVolumeReal').val();
	var regs = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
	if (superId == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
		return false;
	};
	if (should == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '充值额度不能为空！');
		return false;
	};
	if (!regs.test(should)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '充值额度必须为大于0的数字！');
		return false;
	};
	if (real == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额不能为空！');
		return false;
	};
	if (!regs.test(real)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额必须为大于0的数字！');
		return false;
	};
	if (remark.length > 20) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注最多20个字');
		return false;
	};
	return true;
}

$('#storeSubmit').on('click', function() {
	if (checkFormStore()) {
		msgLoading();
		clearSpecialStr('storeForm');
		var real = $('#storeVolumeReal').val();
		var should = $('#storeVolumeShould').val();
		var remark = $('#storeRemark').val();

		$.post('../ngym/GymUserStoreAction!store.zk', {
			userId: superId,
			store: should,
			shouldPay: should,
			realPay: real,
			remark: remark
		}, function(data) {
			msgLoading('close');
			// data = eval('(' + data + ')');
			if (data.STATUS) {
				$.messager.show({
					title: "&nbsp;&nbsp;消息",
					timeout: 2000,
					msg: "充值成功!"
				});
				$('#storeForm').dialog('close');
				$('#dgMoney').datagrid('reload');
				cardCount(superId);
			} else {
				if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}
})

function checkFormPay() {
	// var code = $('#userCode').val();
	var should = $('#payVolumeShould').val();
	var remark = $('#payRemark').val();
	var item = $('#payItem').val();
	var real = $('#payVolumeReal').val();
	var regs = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
	if (superId == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码！');
		return false;
	};
	if (should == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '应付金额不能为空！');
		return false;
	};
	if (!regs.test(should)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '应付金额必须为大于0的数字！');
		return false;
	};
	if (real == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额不能为空！');
		return false;
	};
	if (!regs.test(real)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额必须为大于0的数字！');
		return false;
	};
	if (item == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '商品名称不能为空！');
		return false;
	};
	if (item.length > 20) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '商品名称最多20个字！');
		return false;
	};
	if (remark.length > 20) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注最多20个字！');
		return false;
	};
	return true;
}
$('#paySubmit').on('click', function() {
	if (checkFormPay()) {
		msgLoading();
		clearSpecialStr('payForm');
		var real = $('#payVolumeReal').val();
		var should = $('#payVolumeShould').val();
		var remark = $('#payRemark').val();
		var item = $('#payItem').val();

		$.post('../ngym/GymUserStoreAction!expense.zk', {
			userId: superId,
			pay: should,
			shouldPay: should,
			realPay: real,
			remark: remark,
			payType: 1,
			goods: item
		}, function(data) {
			msgLoading('close');
			// data = eval('(' + data + ')');
			if (data.STATUS) {
				$.messager.show({
					title: "&nbsp;&nbsp;消息",
					timeout: 2000,
					msg: "消费成功!"
				});
				$('#payForm').dialog('close');
				$('#dgMoney').datagrid('reload');
				cardCount(superId);
			} else {
				if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}
});