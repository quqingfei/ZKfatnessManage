var dutyId;
var dutySel;
var userIdSearch;

function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
	$('#hideDiv').hide();
	$('#privateCode').focus();
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
					"id": row.id,
					"duty": row.realName
				};
				makers.push(maker);
			}
			makers.push({
				"id": '',
				"duty": '全部'
			});
			$('#roleSel').combobox({
				valueField: 'id',
				textField: 'duty',
				data: makers,
				onSelect: function(rec) {
					dutySel = rec.duty;
					dutyId = rec.id;
					privateSearch();
				}
			});

		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
	var workTime = [];

	timeReset()
})
$('#privateCode').focus(function() {
	$('#privateCode').val('');
	document.onkeydown = function(e) {
		var ev = document.all ? window.event : e;
		if (ev.keyCode == 13) {
			$('#privateCode').blur();
		}
	}
});
$('#privateCode').blur(function() {
	if ($('#privateCode').val()) {
		privateCode();
	}
});
/*客户姓名搜索*/
function searchUser(){
	serch()
}
$('#serchShop').keydown(function(e){
	if(e.keyCode==13){
		searchUser();
	}
});
/*客户姓名搜索*/
/*教练姓名搜索*/
function searchCoach(){
	serch()
}

$('#serchCoach').keydown(function(e){
	if(e.keyCode==13){
		searchCoach();
	}
});
/*教练姓名搜索*/

function serch(){
	var serchShop = $('#serchShop').val();
	var coachName = $('#serchCoach').val();
	$("#dg").datagrid('load', {name:serchShop,coachName:coachName});
}
function privateCode() {
	//	var code = '116151381599386708';
	var code = $('#privateCode').val();
	postData('userAction!getUserByCode.zk', {
		code: code
	}, privateCodeBack)
}

function privateCodeBack(data) {
	data = eval('(' + data + ')');
	if (data.STATUS) {
		userIdSearch = data.userId;
		privateSearch();
	} else {
		if (data.ERROR == '未登录') {
			loginTimeout();
			return;
		}
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
	}
}

function formatCount(value, row) {
	var last = row.totleCount - value;
	return last;
}
function djued(val){
	var d = "";
	switch(Number(val)){
		case 1: d="预约中";break;
		case 2: d="预约完成";break;
		case 3: d="课程完成";break;
		case 4: d="预约失败";break;
	}
	return d;
}
function formatTime(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd hh:mm");
}
function formatCourseName(value){
	var nameL = value.length;
	if(nameL>5){
		return value.substr(0,5)+"...";
	}else{
		return value;
	}
}

function formatDate(value,row){
	var reg = /.*\..*/;
    if(!reg.test(row.courseHour)){
    	return value+" "+row.courseHour+":"+"00"
    }else{
    	return value+" "+parseInt(row.courseHour)+":"+"30"
    }
}
function formatControl(value, row, index) {
	// var check = '<a href="javascript:;" id="privateCheck" onclick="checkShow(' + index + ')">查看</a>';
	// var change = '<a href="javascript:;" id="privateChange" onclick="lessonChange(' + index + ')">编辑</a>';
	if(row.state == 3){
		return '已完成';
	}
	var count = '<a href="javascript:;" style="color:#FF6500" onclick="bookCancle(' + index + ')">取消预约</a>';
	// var history = '<a href="javascript:;" onclick="lessonHis(\'' + value + '\')">记录</a>';
	// var control = '<div class="private-control">' + count + '</div>';
	return count;
}

function formatPhone(value) {
	value = eval('(' + value + ')');
	return value.phone;
}

function formatName(value, row) {
	if (!!row.coachInfo)
		value = eval('(' + row.coachInfo + ')');
	if (!!row.userCoachInfo)
		value = eval('(' + row.userCoachInfo + ')');
	var coach = value.coachInfo;
	coach = eval('(' + coach + ')');
	return coach.realName;
}

function formatCourse(value) {
	value = eval('(' + value + ')');
	return value.courseName;
}

function formatKind(value) {

	return courseType(value);
}

function courseType(type) {
	switch (type) {
		case 0:
			return '社群课';
			break;
		case 1:
			return '私教课';
			break;
		default:
			return '未知';
			break;
	}
}
function formatExam(val,row){
	if(val <= 0){
		return val;
	}else{
		return '<a href="javascript:;" style="color:#3fc371" onclick="seeMessage(\'' + row.userId + '\')">'+val+'</a>'
	}
}

function seeMessage(id) {
	$('.biaochi').html('');
	if (id != "") {
		$.ajax({
			type: 'post',
			url: '../ngym/GymBodyExamAction!list.zk!list.zk?userId=' + id + '&orderBy=gmtCreate',
			dataType: 'json',
			beforeSend: function() {
				msgLoading();
			},
			success: function(data) {
				if (data.ERROR == '未登录') { // (data.total == 0 &&
					// data.ERROR == 'No Login!')
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示',
						'登录超时,请重新登录!');
					relogin();
				}
				if (data.rows.length <= 0) {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '未进行过体测，请先“体测录入”！');
					return false;
				} else {
					var datas = data.rows;
					// var weight = [];
					// var dates = [];
					// $.each(datas,function(i,x){
					// 	weight.push(x.weight);
					// 	dates.push(formatTimeM(x.gmtCreate));
					// })
					// canvasline(weight,dates,'体重');					
					switch (datas.length) {
						case 1:
							$('.biaochi').append('<a class="ser" val="0" style="margin-left:284px;" href="javascript:;">' + formatTimeM(datas[0].gmtCreate) + '</a>');
							break;
						case 2:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].gmtCreate) + '</a><a class="ser" val="1" style="margin-left:466px;" href="javascript:;">' + formatTimeM(datas[1].gmtCreate) + '</a>');
							break;
						case 3:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].gmtCreate) + '</a><a style="margin-left:214px;" val="1" href="javascript:;">' + formatTimeM(datas[1].gmtCreate) + '</a><a class="ser" val="2" style="margin-left: 212px;" href="javascript:;">' + formatTimeM(datas[2].gmtCreate) + '</a>');
							break;
						case 4:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].gmtCreate) + '</a><a style="margin-left:123px;" val="1" href="javascript:;">' + formatTimeM(datas[1].gmtCreate) + '</a><a style="margin-left: 128px;" val="2" href="javascript:;">' + formatTimeM(datas[2].gmtCreate) + '</a><a class="ser" val="3" style="margin-left: 123px;" href="javascript:;">' + formatTimeM(datas[3].gmtCreate) + '</a>');
							break;
						case 5:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].gmtCreate) + '</a><a style="margin-left:79px;" val="1" href="javascript:;">' + formatTimeM(datas[1].gmtCreate) + '</a><a style="margin-left: 85px;" val="2" href="javascript:;">' + formatTimeM(datas[2].gmtCreate) + '</a><a style="margin-left: 84px;" val="3" href="javascript:;">' + formatTimeM(datas[3].gmtCreate) + '</a><a class="ser" val="4" style="margin-left: 82px;" href="javascript:;">' + formatTimeM(datas[4].gmtCreate) + '</a>');
							break;
						case 6:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].gmtCreate) + '</a><a style="margin-left:61px;" val="1" href="javascript:;">' + formatTimeM(datas[1].gmtCreate) + '</a><a style="margin-left: 61px;" val="2" href="javascript:;">' + formatTimeM(datas[2].gmtCreate) + '</a><a style="margin-left: 54px;" val="3" href="javascript:;">' + formatTimeM(datas[3].gmtCreate) + '</a><a style="margin-left: 54px;" val="4" href="javascript:;">' + formatTimeM(datas[4].gmtCreate) + '</a><a class="ser" val="5" style="margin-left: 59px;" href="javascript:;">' + formatTimeM(datas[5].gmtCreate) + '</a>');
							break;
						case 7:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].gmtCreate) + '</a><a style="margin-left:42px;" val="1" href="javascript:;">' + formatTimeM(datas[1].gmtCreate) + '</a><a style="margin-left: 40px;" val="2" href="javascript:;">' + formatTimeM(datas[2].gmtCreate) + '</a><a style="margin-left: 40px;" val="3" href="javascript:;">' + formatTimeM(datas[3].gmtCreate) + '</a><a style="margin-left: 40px;" val="4" href="javascript:;">' + formatTimeM(datas[4].gmtCreate) + '</a><a style="margin-left: 42px;" val="5" href="javascript:;">' + formatTimeM(datas[5].gmtCreate) + '</a><a class="ser" val="6" style="margin-left: 38px;" href="javascript:;">' + formatTimeM(datas[6].gmtCreate) + '</a>');
							break;
						default:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].gmtCreate) + '</a><a style="margin-left:42px;" val="1" href="javascript:;">' + formatTimeM(datas[1].gmtCreate) + '</a><a style="margin-left: 40px;" val="2" href="javascript:;">' + formatTimeM(datas[2].gmtCreate) + '</a><a style="margin-left: 40px;" val="3" href="javascript:;">' + formatTimeM(datas[3].gmtCreate) + '</a><a style="margin-left: 40px;" val="4" href="javascript:;">' + formatTimeM(datas[4].gmtCreate) + '</a><a style="margin-left: 42px;" val="5" href="javascript:;">' + formatTimeM(datas[5].gmtCreate) + '</a><a class="ser" val="6" style="margin-left: 38px;" href="javascript:;">' + formatTimeM(datas[6].gmtCreate) + '</a>');
							break;
					}

					$('.biaochi a').on('click', function() {
						$(this).addClass('ser').siblings().removeClass('ser');
						var i = $(this).attr('val');
						$('#typeconsr').html('<div class="cons"><div class="consl">体重(KG)：</div><div class="consr" id="consrweight">' + parseFloat(datas[i].weight).toFixed(1) + '</div></div><div class="cons"><div class="consl">身高(CM)：</div><div class="consr" id="consrweight">' + datas[i].height + '</div></div>');
						addtype('内脏脂肪', datas[i].visFat);
						addtype('水分', datas[i].bodyWater);
						addtype('肌肉率', datas[i].muscle);
						addtype('脂肪', datas[i].fat);
						// addtype('脂肪指数', datas[i].fatNumber);
						// addtype('去脂体重', datas[i].nofatWeight);
						addtype('腰臀比', datas[i].whr);
						addtype('蛋白质', datas[i].protein);
						addtype('静态心率', datas[i].restingHeartRate);
						/*	addtype('肺活量', datas[i].vitalCapacity);
							addtype('血压', datas[i].bloodPressure);*/
						addtype('体质等级', datas[i].bodyLevel);
						// addtype('骨骼年龄', datas[i].boneAge);						
						if (datas[i].image == "") {
							$('.hpotp').html('')
						} else {
							$('.hpotp').html('<img src="../file/FileCenter!showImage2.zk?name=' + datas[i].image + '"></img>');
						}
						// $('#constrevaluation').text(datas[i].evaluation);
						var s = datas[i].weight/((datas[i].height/100)*(datas[i].height/100));
						$('#constrevaluation').text(bmiinfo(s));
						$('#constrsportSuggest').text(datas[i].sportSuggest ? datas[i].sportSuggest : '暂无');
						$('#constrsuggest').html(formatBody("",datas[i]));
						$('.titcolor').text(formatTime(datas[i].gmtCreate));
						$('.titcolorred').text(datas[i].score.toFixed(1));
						console.log(datas[i].weight)
					})
					$('.biaochi a:last').trigger('click');
					$('.bler').on('click', function() {
						$(this).addClass('ser').removeClass('ser-color').siblings().removeClass('ser').addClass('ser-color');
						if ($(this).attr('attr') == 'w') {
							console.log('W');
							var weight = [];
							var dates = [];
							$.each(datas, function(i, x) {
								if (i < 7) {
									weight.push(x.weight.toFixed(1));
									dates.push(formatTimeM(x.gmtCreate));
								}
							})
							canvasline(weight, dates, '体重');
						} else {
							console.log('B');
							var fat = [];
							var dates = [];
							$.each(datas, function(i, x) {
								if (i < 7) {
									fat.push(x.fat);
									dates.push(formatTimeM(x.gmtCreate));
								}
							})
							canvasline(fat, dates, '体脂率');
						}
					})
					$('.zktitlebler>.ser').trigger('click');
					$('#dlgoney').dialog('open');
				}
			},
			complete: function() {
				msgLoading('close');
			}
		})
		choosetime(id, 'week')
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
	}

}

function choosetime(id, week) {
	chserls(week);
	$.ajax({
		type: 'post',
		url: '../gym/userAction!getSportData.zk?userId=' + id + '&dataType=' + week,
		dataType: 'json',
		beforeSend: function() {
			msgLoading();
		},
		success: function(data) {
			var persent = '';
			if (data.STATUS) {
				persent = '[{value:' + data.aerobicSportWeight + ',name:"有氧"},{value:' + data.anaerobicSportWeight + ',name:"耐力"},{value:' + data.suitableSportWeight + ',name:"无氧"}]';
				if (data.sport == '') {
					$("#staytime").text('-小时-分')
				} else {
					$('#latittype').html('');
					$.each(data.sport, function(i, x) {
						$('#latittype').append('<tr><td>' + x.type + '</td><td>' + x.amount + '' + x.unit + '</td><td class="green">' + x.calorie + '大卡</td></tr>')
					})
				}
			}
			$('#perhavey').text(parseFloat(data.aerobicSportWeight).toFixed(1));
			$('#pernail').text(parseFloat(data.anaerobicSportWeight).toFixed(1));
			$('#pernoy').text(parseFloat(data.anaerobicSportWeight).toFixed(1));
			$('#peronce').text(data.useTime);

			var newper = eval("(" + persent + ")");
			canvaspie(newper)
			$('.blers').on('click', function() {
				$(this).addClass('ser').removeClass('ser-color').siblings().removeClass('ser').addClass('ser-color');
				if ($(this).attr('attr') == 'week') {
					chserls('week');
					$.ajax({
							type: 'post',
							url: '../gym/userAction!getSportData.zk?userId=' + id + '&dataType=week',
							dataType: 'json',
							success: function(data) {
								var persent = '';
								$('#latittype').html('');
								if (data.STATUS) {
									persent = '[{value:' + data.aerobicSportWeight + ',name:"有氧"},{value:' + data.anaerobicSportWeight + ',name:"耐力"},{value:' + data.suitableSportWeight + ',name:"无氧"}]';
									if (data.sport == '') {
										$("#staytime").text('-小时-分')
									} else {
										$('#latittype').html('');
										$.each(data.sport, function(i, x) {
											$('#latittype').append('<tr><td>' + x.type + '</td><td>' + x.amount + '' + x.unit + '</td><td class="green">' + x.calorie + '大卡</td></tr>')
										})
									}
								}
								$('#perhavey').text(parseFloat(data.aerobicSportWeight).toFixed(1));
								$('#pernail').text(parseFloat(data.anaerobicSportWeight).toFixed(1));
								$('#pernoy').text(parseFloat(data.anaerobicSportWeight).toFixed(1));
								$('#peronce').text(data.useTime);

								var newper = eval("(" + persent + ")");
								canvaspie(newper)
							}
						})
						// canvaspie(,'体重');
				} else if ($(this).attr('attr') == 'month') {
					chserls('month');
					$.ajax({
						type: 'post',
						url: '../gym/userAction!getSportData.zk?userId=' + id + '&dataType=month',
						dataType: 'json',
						success: function(data) {
							var persent = '';
							$('#latittype').html('');
							if (data.STATUS) {
								persent = '[{value:' + data.aerobicSportWeight + ',name:"有氧"},{value:' + data.anaerobicSportWeight + ',name:"耐力"},{value:' + data.suitableSportWeight + ',name:"无氧"}]';
								if (data.sport == '') {
									$("#staytime").text('-小时-分')
								} else {
									$('#latittype').html('');
									$.each(data.sport, function(i, x) {
										$('#latittype').append('<tr><td>' + x.type + '</td><td>' + x.amount + '' + x.unit + '</td><td class="green">' + x.calorie + '大卡</td></tr>')
									})
								}
							}
							$('#perhavey').text(parseFloat(data.aerobicSportWeight).toFixed(1));
							$('#pernail').text(parseFloat(data.anaerobicSportWeight).toFixed(1));
							$('#pernoy').text(parseFloat(data.anaerobicSportWeight).toFixed(1));
							$('#peronce').text(data.useTime);

							var newper = eval("(" + persent + ")");
							canvaspie(newper)
						}
					})

					// canvaspie(,'体脂率');
				} else if ($(this).attr('attr') == 'year') {
					chserls('year');
					$.ajax({
							type: 'post',
							url: '../gym/userAction!getSportData.zk?userId=' + id + '&dataType=year',
							dataType: 'json',
							success: function(data) {
								var persent = '';
								$('#latittype').html('');
								if (data.STATUS) {
									persent = '[{value:' + data.aerobicSportWeight + ',name:"有氧"},{value:' + data.anaerobicSportWeight + ',name:"耐力"},{value:' + data.suitableSportWeight + ',name:"无氧"}]';
									if (data.sport == '') {
										$("#staytime").text('-小时-分')
									} else {
										$.each(data.sport, function(i, x) {
											$('#latittype').append('<tr><td>' + x.type + '</td><td>' + x.amount + '' + x.unit + '</td><td class="green">' + x.calorie + '大卡</td></tr>')
										})
									}
								}
								$('#perhavey').text(parseFloat(data.aerobicSportWeight).toFixed(1));
								$('#pernail').text(parseFloat(data.anaerobicSportWeight).toFixed(1));
								$('#pernoy').text(parseFloat(data.anaerobicSportWeight).toFixed(1));
								$('#peronce').text(data.useTime);

								var newper = eval("(" + persent + ")");
								canvaspie(newper)
							}
						})
						// canvaspie(fat,dates,'体脂率');
				}
			})
		},
		complete: function() {
			msgLoading('close');
		}
	})
}

function chserls(week) {
	var nowtime = new Date();
	var secondtime = nowtime.getTime();
	var month = nowtime.getMonth() + 1;
	var date = nowtime.getDate();
	var year = nowtime.getFullYear();
	$('#nowdate').text((month < 10 ? '0' + month : month) + "" + '-' + (date < 10 ? '0' + date : date) + "");
	if (week == 'week') {
		$('#nowdate').text(year + '-' + (month < 10 ? '0' + month : month) + "" + '-' + (date < 10 ? '0' + date : date) + "");
		var nise = new Date(secondtime - 604800000);
		var lastmonth = nise.getMonth() + 1;
		var lastdate = nise.getDate();
		var lastyear = nise.getFullYear();
		$('#lastdate').text(lastyear + '-' + (lastmonth < 10 ? '0' + lastmonth : lastmonth) + "" + '-' + (lastdate < 10 ? '0' + lastdate : lastdate) + "");
	} else if (week == 'month') {
		$('#nowdate').text(year + '-' + (month < 10 ? '0' + month : month) + "" + '-' + (date < 10 ? '0' + date : date) + "");
		var nise = new Date(secondtime - 2592000000);
		var lastmonth = nise.getMonth() + 1;
		var lastdate = nise.getDate();
		var lastyear = nise.getFullYear();
		$('#lastdate').text(lastyear + '-' + (lastmonth < 10 ? '0' + lastmonth : lastmonth) + "" + '-' + (lastdate < 10 ? '0' + lastdate : lastdate) + "");
	} else if (week == 'year') {
		$('#nowdate').text(year + '-' + (month < 10 ? '0' + month : month) + "" + '-' + (date < 10 ? '0' + date : date) + "");
		var nise = new Date(secondtime - 31536000000);
		var lastmonth = nise.getMonth() + 1;
		var lastdate = nise.getDate();
		var lastyear = nise.getFullYear();
		$('#lastdate').text(lastyear + '-' + (lastmonth < 10 ? '0' + lastmonth : lastmonth) + "" + '-' + (lastdate < 10 ? '0' + lastdate : lastdate) + "");
	}
}

function bmiinfo(userbmi) {
	var plans = [];
	plans[0] = '主人，看着你这么瘦，小燃好心疼哦，建议您增加日常高蛋白膳食的摄入量。在运动方式上，慢跑是个不错的选择，可以促进您肠胃蠕动次数增多呦.';
	plans[1] = '主人，您的体重标准。小燃觉得您可以适当继续保持，可以多多锻炼，让体质更棒.';
	plans[2] = '主人，小燃发现您最近肉肉渐涨了，为了不成为膘肥的后裔，我们开始加强日常锻练吧。小燃发现步行1小时或单车半小时很适合主人，我们一起奔跑吧，主人。';
	plans[3] = '主人，怎么体重巨轮说沉就沉了？真的不能再胖下去了，小燃给主人加油，我们要开始注意控制热量与脂肪，加强日常锻炼促进热量的的消耗，我们一定要成为白富美/高富帅，冲上世界顶峰！';
	if (userbmi < 18.5) {
		$('.textAreaBoxPin').val(plans[0]);
		// $('#onlySuggest2 .addMuscle').attr('checked', true);
		$('.onlySuggest .addMuscle').attr('checked', true);
		return plans[0];
	} else if (userbmi <= 24) {
		$('.textAreaBoxPin').val(plans[1]);
		// $('#onlySuggest2 .maintain').attr('checked', true);
		$('.onlySuggest .maintain').attr('checked', true);
		return plans[1];
	} else if (userbmi <= 28) {
		$('.textAreaBoxPin').val(plans[2]);
		// $('#onlySuggest2 .minus').attr('checked', true);
		$('.onlySuggest .minus').attr('checked', true);
		return plans[2];
	} else if (userbmi >= 28) {
		$('.textAreaBoxPin').val(plans[3]);
		// $('#onlySuggest2 .minus').attr('checked', true);
		$('.onlySuggest .minus').attr('checked', true);
		return plans[3];
	}
}

function addtype(word, value) {
	var vle = parseFloat(value).toFixed(1);
	if (value) {
		$('#typeconsr').append('<div class="cons"><div class="consl">' + word + '：</div><div class="consr">' + vle + '</div></div>')
	}
}

function formatTimeM(value) {
	// alert(value);
	if (!value) {
		return '';
	}
	var date = new Date((value));
	var month = "",ds = "";
	if((date.getMonth() + 1)<10){
		month = "0"+(date.getMonth() + 1);
	}else{
		month = date.getMonth() + 1;
	}
	if(date.getDate()<10){
		ds = "0"+date.getDate();
	}else{
		ds = date.getDate();
	}
	var result = month + '-' + ds; // +':'+second;
	return result;
}

var canvaspie = function(newper) {
	var pChart = echarts.init(document.getElementById('pieChart'));
	var userOption = {
		tooltip: {
			trigger: 'item',
			formatter: "{b}: {c} ({d}%)"
		},
		// legend: {
		//  orient: 'vertical',
		//  left: 'right',
		//  data: ['已办卡', '未办卡']
		// },
		series: [{
			name: '运动占比',
			type: 'pie',
			radius: ['40%', '80%'],
			// center: ['35%', '50%'],
			avoidLabelOverlap: false,

			label: {
				normal: {
					show: false,
					position: 'center'
				},
				emphasis: {
					show: true,
					formatter: "{d}%",
					textStyle: {
						fontWeight: 'bold'
					}
				}
			},
			labelLine: {
				normal: {
					show: false
				}
			},
			data: newper,
			color: ['#3fc370', '#feba3b', '#f25657']
		}]
	};
	pChart.setOption(userOption);
}

function formatBody(value, row) {
	// if(value<18.5){
	//     return '<div style="color:#3ba9ef">偏瘦</div>'
	// }else if(value<=23){
	//     return '<div style="color:#3fc371">标准</div>'
	// }else if(value>23){
	//     return '<div style="color:#fe6262">偏胖</div>'
	// }else{
	//     return '未知'
	// }
	var bmi = row.weight / ((row.height / 100) * (row.height / 100));
	if (bmi < 18.5) {
		return '<div style="color:#3ba9ef">偏瘦</div>'
	} else if (bmi < 24) {
		return '<div style="color:#3fc371">标准</div>'
	} else if (bmi < 28) {
		return '<div style="color:#FCBA48">偏胖</div>'
	} else if (bmi >= 28) {
		return '<div style="color:#fe6262">肥胖</div>'
	} else {
		return '未知'
	}
}

function canvasline(weight, dates, name) {
	var wChart = echarts.init(document.getElementById('weightChart'));
	var aliveOption = {
		title: {
			text: '',
			left: 'center',
			textStyle: {
				fontSize: '14'
			}
		},
		tooltip: {
			//            formatter: function(params) {
			//                return $('#monthSel').val() + '月' + 'params[0].name' + '日<br/>' + 'params[0].seriesName' + ' : ' + 'params[0].value';
			//            },
			trigger: 'axis',
			axisPointer: {
				type: 'none'
			}
		},
		grid: {
			left: '1%',
			right: '5%',
			bottom: '1%',
			top: '20%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			splitLine: {
				show: true,
				lineStyle: {
					color: '#eee'
				}
			},
			data: dates
		},
		yAxis: {
			type: 'value',
			boundaryGap: false,
			splitLine: {
				show: true,
				lineStyle: {
					color: '#eee'
				}
			}
		},
		series: [{
			name: name,
			type: 'line',
			//            smooth: true,
			symbolSize: '8',
			stack: '总数',
			data: weight,
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: 'rgb(71, 194, 116)'
					}, {
						offset: 1,
						color: 'rgb(255, 255, 255)'
					}])
				}
			},
		}],
		color: ['#3fc370']
	}
	wChart.setOption(aliveOption);
}

function formatStu(value) {
	value = eval('(' + value + ')');
	return value.userName;
}
function dayRecordShow(){
	$('#dlgSign4').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;每日约课记录");
	$('#dgSign4').datagrid({
		// sortName: 'gmtModify',
		singleSelect: true,
		pagination: true,
		pageSize: 20,
		url: '../ngym/GymGroupCourseManageAction!listUserBookingCourse.zk',
		queryParams: {
			// userId: row.userId,
			// courseId: row.courseId
		},
		method: 'post',
		onLoadSuccess: function(data) {
			$(this).datagrid("fixDlgWidth");
		}
	});
}
function searchMone () {
	console.log()
}
function  shrso (date) {
	$('#dgSign4').datagrid({
		// sortName: 'gmtModify',
		singleSelect: true,
		pagination: true,
		pageSize: 20,
		url: '../ngym/GymGroupCourseManageAction!listUserBookingCourse.zk',
		queryParams: {
			bookingTime: date
			// courseId: row.courseId
		},
		method: 'post',
		onLoadSuccess: function(data) {
			$(this).datagrid("fixDlgWidth");
		}
	});
}
function bookCancle(index) {
	var record = $('#dgSign1').datagrid('selectRow', index);
	var row = $('#dgSign1').datagrid('getSelected');
	$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;取消预约', '确认取消预约吗？', function(r) {
		if (r) {
			$.post('../ngym/GymGroupCourseManageAction!cancelReservation.zk', {
				timeUserId: row.timeUserId,
				tableId: row.tableId
			}, function(data) {
				if (data.STATUS) {
					$('#dgSign1').datagrid('reload');
					$('#dg').datagrid('reload');
					$.messager.show({
						title: "&nbsp;&nbsp;消息",
						timeout: 2000,
						msg: "取消成功!"
					});
				} else {
					if ('No Login!' == data.ERROR || '未登录' == data.ERROR) {
						loginTimeout();
						return;
					}
				}
			}, 'json');
		}
	})
}

function lessonHis() {
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择学员!');
		return;
	}
	$('#dlgSign2').dialog('open');
	$('#dgSign2').datagrid({
		rownumbers: true,
		// sortName: 'gmtModify',
		singleSelect: true,
		pagination: true,
		pageSize: 20,
		url: '../ngym/GymGroupCourseManageAction!listFinishedCourse.zk',
		queryParams: {
			courseUserId: row.courseUserId
		},
		method: 'post',
		onLoadSuccess: function(data) {
			$(this).datagrid("fixDlgWidth");
		}
	});
}

var dlgUserId;

function checkShow() {
	// var record = $('#dg').datagrid('selectRow', index);
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择学员!');
		return;
	}
	// var info = eval('(' + row.userInfo + ')');
	// var phone = info.phone;
	// var coachInfo = eval('(' + row.coachInfo + ')');
	// var coach = eval('(' + coachInfo.coachInfo + ')');
	// // var couch = coachInfo.realName;
	// var last = row.totleCount - row.useCount;
	useCountCourse = row.totalCount - row.restCount;
	$('#dlgCheck').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;查看");
	$('.dlg-item').show();
	$('.dlg-edit').hide();
	$('.dlg-top').hide();
	$('.dlg-button').hide();
	$('.dlg-check').show();
	dlgClear();
	$('#checkLay').text(row.totalCount - row.restCount);
	$('#checkName').text(row.userName);
	$('#checkPhone').text(row.userPhone);
	$('#checkCouch').text(row.coachName);
	$('#checkCourse').text(row.courseName);
	$('#checkTime').text(row.courseTime);
	$('#checkType').text(courseType(row.courseType));
	$('#checkShould').text(row.shouldPay);
	$('#checkReal').text(row.realPay);
	$('#checkTotal').text(row.totalCount);
	$('#checkLast').text(row.restCount);
	$('#checkCreate').text(formatTime(row.buyDate));
	$('#checkRemark').text(row.remark);
}

function lessonChange() {
	// var record = $('#dg').datagrid('selectRow', index);
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择学员!');
		return;
	}
	// var info = eval('(' + row.userInfo + ')');
	// var phone = info.phone;
	// var coachInfo = eval('(' + row.coachInfo + ')');
	// var coach = eval('(' + coachInfo.coachInfo + ')');
	// var last = row.totleCount - row.useCount;
	dlgUserId = row.courseUserId;
	totalCourse = row.totleCount;
	useCountCourse = row.totalCount - row.restCount;
	$('#dlgCheck').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;编辑");
	$('.dlg-item').show();
	$('.dlg-check').hide();
	$('.dlg-top').hide();
	$('.dlg-edit').show();
	$('.dlg-button').show();
	$('#inputManSave').show();
	$('#inputManSure').hide();

	dlgClear();
	coachList(row.courseId);
	$('#checkName').text(row.userName);
	$('#checkPhone').text(row.userPhone);
	// $('#checkCouch').text(couch);
	// $('#editShould').val(row.shouldPay);
	$('#editCoach').combobox('select', row.coachId);

	$('#checkCourse').text(row.courseName);
	$('#checkTime').text(row.courseTime);
	$('#checkType').text(courseType(row.courseType));
	$('#checkShould').text(row.shouldPay);
	$('#editReal').val(row.realPay);
	$('#editTotal').val(row.totalCount);
	$('#checkLast').text(row.restCount);
	$('#checkLay').text(row.totalCount - row.restCount);
	$('#checkCreate').text(formatTime(row.buyDate));
	$('#editRemark').val(row.remark);


}
var coachId = '';
var coachPrices = {};

function coachList(id) {
	$.ajax({
		url: '../ngym/GymUserCoachAction!listCoach.zk',
		async: false,
		type: "POST",
		dataType: "json",
		data: {
			id: id
		},
		success: function(data) {
			if (data.ERROR == '未登录') {
				loginTimeout();
				//			login();
				return;
			}
			if (data.STATUS) {
				// var rows = data.rows;
				var coachs = data.gymGroupCourses[0];
				coachs = coachs.coachInfo;
				coachs = eval('(' + coachs + ')');
				var makers = [];

				for (var i = 0; i < coachs.length; i++) {
					var coach = coachs[i];
					var maker = {
						"id": coach.id,
						"duty": coach.name
					};
					coachPrices[coach.id] = coach.price;
					makers.push(maker);
				}
				$('#editCoach').combobox({
					valueField: 'id',
					textField: 'duty',
					data: makers,
					onSelect: function(rec) {
						// dutySel = rec.duty;
						coachId = rec.id;
						// privateSearch();
					}
				});
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}
	});
}

function numCheck() {
	var keyCode = event.keyCode;
	if ((keyCode >= 96 && keyCode <= 105 || keyCode >= 48 && keyCode <= 57 || keyCode == 8)) {
		event.returnValue = true;
	} else {
		event.returnValue = false;
	}
}

// $('#editTotal').blur(function() {
// 	var should = $('#editTotal').val() * coachPrices[coachId];
// 	$('#checkShould').text(should);
// })

$('#inputManSave').on('click', function() {
	if (checkForm()) {
		var should = $('#checkShould').text();
		var real = $('#editReal').val();
		var total = $('#editTotal').val();
		var remark = $('#editRemark').val();
		$.post('../ngym/GymGroupCourseManageAction!updateUserCourse.zk', {
			courseUserId: dlgUserId,
			shouldPay: should,
			realPay: real,
			courseCount: total,
			remark: remark,
			coachId: coachId
		}, function(data) {
			if (data.ERROR == '未登录') {
				loginTimeout();
				//			login();
				return;
			}
			if (data.STATUS) {
				$('#dlgCheck').dialog('close');
				$('#dg').datagrid('reload');
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}

})

function lessonCount() {
	// var record = $('#dg').datagrid('selectRow', index);
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择学员!');
		return;
	}
	$('#dlgSign1').dialog('open');
	$('#dgSign1').datagrid({
		// sortName: 'gmtModify',
		singleSelect: true,
		pagination: true,
		pageSize: 20,
		url: '../ngym/GymGroupCourseManageAction!listUserBookingCourse.zk',
		queryParams: {
			userId: row.userId,
			courseId: row.courseId
		},
		method: 'post',
		onLoadSuccess: function(data) {
			$(this).datagrid("fixDlgWidth");
		}
	});
	// var info = eval('(' + row.coachInfo + ')');
	// var coachInfo = eval('(' + row.coachInfo + ')');
	// var coach = eval('(' + row.coachInfo + ')');
	// var couch = info.realName;
	var last = row.totleCount - row.useCount;
	if (last < 0) {
		last = 0;
	}
	dlgUserId = row.id;
	useCountCourse = row.useCount;
	// $('#dlgCheck').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;计次");
	$('.dlg-item').hide();
	$('.dlg-count').show();
	$('.dlg-top').show();
	$('.dlg-button').show();
	$('#inputManSave').hide();
	$('#inputManSure').show();

	dlgClear();
	$('#checkLay').text(useCountCourse);
	$('#checkName').text(row.realName);
	$('#checkCouch').text(row.coachName);
	$('#checkTotal').text(row.totleCount);
	$('#checkLast').text(last);
}

$('#inputManSure').on('click', function() {
	//	var should = $('#editShould').val();
	//	var real = $('#editReal').val();
	//	var total = $('#editTotal').val();
	msgLoading();
	$.post('../ngym/GymUserCoachAction!sign.zk', {
		id: dlgUserId
	}, function(data) {
		if (data.STATUS) {
			msgLoading('close');
			$('#dlgCheck').dialog('close');
			$('#dg').datagrid('reload');
		} else {
			msgLoading('close');
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
})

$('#inputManCancel').on('click', function() {
	$('#dlgCheck').dialog('close');
})

function dlgHisClose() {
	$('#dlgHis').dialog('close')
}

function checkForm() {
	// var should = $('#editShould').val();
	var real = $('#editReal').val();
	var total = $('#editTotal').val();
	var remark = $('#editRemark').val();
	var reg = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
	// if (!$.trim(should)) {
	// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '应付金额不能为空且为正整数!');
	// 	$("#editShould").focus();
	// 	return false;
	// }
	// if (!reg.test(should)) {
	// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '应付金额必须为正整数!');
	// 	$("#editShould").focus();
	// 	return false;
	// }
	if (!$.trim(real)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额不能为空!');
		$("#editReal").focus();
		return false;
	}
	if (!reg.test(real)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额必须为正整数!');
		$("#editReal").focus();
		return false;
	}
	if (total > 100) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '总次数不能大于100次!');
		$("#editTotal").focus();
		return false;
	}
	if (parseInt(total) < useCountCourse) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '课程总次数不得小于已用次数!');
		$("#editTotal").focus();
		return false;
	}
	if (!$.trim(total)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '总次数不能为空!');
		$("#editTotal").focus();
		return false;
	}
	if (!reg.test(total)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '总次数必须为正整数!');
		$("#editTotal").focus();
		return false;
	}
	if (remark.length > 16) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注不能超过16个字！');
		$('#editRemark').focus();
		return false;
	}
	return true;
}

function dlgClear() {
	$('#checkName').text('');
	$('#checkPhone').text('');
	$('#checkCouch').text('');
	$('#checkShould').text('');
	$('#checkReal').text('');
	$('#checkTotal').text('');
	$('#checkLast').text('');
	$('#checkCreate').text('');
	// $('#editShould').val('');
	$('#editReal').val('');
	$('#editTotal').val('');
	$('#editCoach').combobox('setText', '');
	$('#editRemark').val('');
}

function privateSearch() {
	var couchId = dutyId;
	var phone = $('#searchPhone').val();
	var name = $('#searchName').val();
	$('#dg').datagrid('load', {
		userId: userIdSearch,
		realName: name,
		coachInfo: phone,
		coachId: couchId
	});
}

var bookCoach, bookCourse, bookType, bookId, bookUserId;

function lessonBook() {
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择学员!');
		return;
	}
	var today = new Date();
	bookType = row.courseType;
	bookCoach = row.coachId;
	bookCourse = row.courseId;
	bookUserId = row.userId;
	bookId = row.courseUserId;
	$('#courseDate').val(today.format('yyyy-MM-dd'));
	bookTime();
}

function timeNum(num) {
	if (num < 10) return '0' + num;
	else return num;
}

function bookTime() {
	// $('#bookTime').html('');
	$('.book-check').removeClass('book-check');
	$('.book-disable').removeClass('book-disable');
	$('.dlg-button').show();
	var startTime, endTime;
	$.post('../ngym/GymGroupCourseManageAction!getCoachWorkTime.zk', {
		coachId: bookCoach
	}, function(data) {
		if (data.STATUS) {
			startTime = data.workTime.startTime;
			endTime = data.workTime.endTime;
			if (!bookType) {
				timeReset(startTime, endTime - 1);
				$('.book-time').hide();
				$.post('../ngym/GymGroupCourseManageAction!listTimeForTeam.zk', {
					coachId: bookCoach,
					courseId: bookCourse,
					date: $('#courseDate').val() + ' 00:00:00'
				}, function(data) {
					if (data.STATUS) {
						var rows = data.rows;
						for (var i = 0; i < rows.length; i++) {
							var n = ' ' + rows[i].orderCount + '/' + rows[i].maxCount;
							$('#' + rows[i].hour.replace(/:/g, "")).append(n).show();
						}
						var none = '<span style="line-height:24px;">暂无可选时间</span>'
						if (rows.length == 0) $('#bookTime').html(none);
						$('#dlgBook').dialog('open');
					} else {
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
					}
				}, 'json');
			} else {
				timeReset(startTime, endTime - 1);
				$.post('../ngym/GymGroupCourseManageAction!listTimeForPrivate.zk', {
					coachId: bookCoach,
					courseId: bookCourse,
					date: $('#courseDate').val() + ' 00:00:00'
				}, function(data) {
					if (data.STATUS) {
						var rows = data.rows;
						for (var i = 0; i < rows.length; i++) {
							$('#' + rows[i].hour.replace(/:/g, "")).addClass('book-disable');
						}
						$('#dlgBook').dialog('open');
					} else {
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
					}
				}, 'json');
			}
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');

}

function timeReset(start, end) {
	$('#bookTime').html('');
	for (var i = start * 2; i <= end * 2; i++) {
		if (i % 2 == 0) {
			var time = timeNum(parseInt(i / 2)) + ':' + '00'
				// workTime.push(time);
			var div = $('<a>').attr({
				'href': "javascript:;",
				'id': time.replace(/:/g, ""),
				'class': "book-time",
				'data-val': i / 2
			}).text(time).on('click', function() {
				if (!$(this).hasClass("book-disable")) {
					$('.book-check').removeClass('book-check');
					$(this).addClass('book-check');
				}
			});
			$('#bookTime').append(div);
		} else {
			var time = timeNum(parseInt(i / 2)) + ':' + '30'
				// workTime.push(time);
			var div = $('<a>').attr({
				'href': "javascript:;",
				'id': time.replace(/:/g, ""),
				'class': "book-time",
				'data-val': i / 2
			}).text(time).on('click', function() {
				if (!$(this).hasClass("book-disable")) {
					$('.book-check').removeClass('book-check');
					$(this).addClass('book-check');
				}
			});
			$('#bookTime').append(div);
		}
	}
}

function bookSure() {
	if ($('.book-check').length == 0) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择预约时间。');
	} else {
		msgLoading();
		$.post('../ngym/GymGroupCourseManageAction!bookingCourse.zk', {
			coachId: bookCoach,
			courseId: bookCourse,
			date: $('#courseDate').val() + ' 00:00:00',
			hour: $('.book-check').attr('data-val'),
			userId: bookUserId,
			courseUserId: bookId
		}, function(data) {
			msgLoading('close');
			if (data.STATUS) {
				$('#dlgBook').dialog('close');
				$('#dg').datagrid('reload');
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}

}