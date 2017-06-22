function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
	var now = new Date();
	var mon = now.getMonth() + 1;
	var date = now.getDate();
	var year = now.getFullYear();
	var day = formatDay(now.getDay());
	$('#todayDate').text(mon + '月' + date + '日 ' + day)
	$('#monthSel').val(mon);
	refreshData();
})
function getMonthNum(){
	var curMouth = new Date().getMonth()+1;
	var data = [];
	for(var i=1; i<=curMouth; i++){
		var mun = i;
		if (i<10) {
			mun = '0'+mun;
		};
		data.push({text: mun+'月',value: i});
	}
	$.each(data,function(index,item){
		$('#monthSel').append('<option value='+item.value+'>'+item.text+'</option>');
	})
}
getMonthNum()
function formatDay(value) {
	switch (value) {
		case 1:
			return '周一';
			break;
		case 2:
			return '周二';
			break;
		case 3:
			return '周三';
			break;
		case 4:
			return '周四';
			break;
		case 5:
			return '周五';
			break;
		case 6:
			return '周六';
			break;
		case 0:
			return '周日';
			break;
	}
}
var userChart = echarts.init(document.getElementById('userChart'));
var inChart = echarts.init(document.getElementById('inChart'));
var vipChart = echarts.init(document.getElementById('vipChart'));
var aliveChart = echarts.init(document.getElementById('aliveChart'));
var userOption = {
	tooltip: {
		trigger: 'item',
		formatter: "{a} <br/>{b}: {c} ({d}%)"
	},
	// legend: {
	// 	orient: 'vertical',
	// 	left: 'right',
	// 	data: ['已办卡', '未办卡']
	// },
	series: [{
		name: '用户数',
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
		data: [{
			value: 0,
			name: '已办卡'
		}, {
			value: 0,
			name: '未办卡'
		}],
		color:['#3fc370','#2f4553']
	}]
};

var inOption = {
	title: {
		text: '当月收入统计(元)',
		left: 'center',
		textStyle: {
			fontSize: '14'
		}
	},
	tooltip: {
		formatter: function(params) {
			return $('#monthSel').val() + '月' + params[0].name + '日<br/>' + params[0].seriesName + ' : ' + params[0].value;
		},
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
			show: false
		},

		data: []
	},
	yAxis: {
		type: 'value',
		splitLine: {
			show: false
		}
	},
	series: [{
		name: '当日收入',
		type: 'line',
		stack: '总额',
		data: []
	}],
	color:['#3fc370']
}
var vipOption = {
	title: {
		text: '会员增长统计(人)',
		left: 'left',
		textStyle: {
			fontSize: '14'
		}
	},
	tooltip: {
		formatter: function(params) {
			return $('#monthSel').val() + '月' + params[0].name + '日<br/>' + params[0].seriesName + ' : ' + params[0].value + '<br/>' + params[1].seriesName + ' : ' + params[1].value;
		},
		trigger: 'axis',
		axisPointer: {
			type: 'none'
		}
	},
	legend: {
		left: 'right',
		data: ['开卡增长人数', '关注增长人数']
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
			show: false
		},
		data: []
	},
	yAxis: {
		type: 'value',
		splitLine: {
			show: false
		},
		splitNumber:1
	},
	series: [{
		name: '开卡增长人数',
		type: 'line',
		// stack: '总数',
		data: []
	}, {
		name: '关注增长人数',
		type: 'line',
		// stack: '总数',
		data: []
	}],
	color:['#3fc370','#2f4553']
}

var aliveOption = {
	title: {
		text: '当月活跃人数统计(人)',
		left: 'center',
		textStyle: {
			fontSize: '14'
		}
	},
	tooltip: {
		formatter: function(params) {
			return $('#monthSel').val() + '月' + params[0].name + '日<br/>' + params[0].seriesName + ' : ' + params[0].value;
		},
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
			show: false
		},
		data: []
	},
	yAxis: {
		type: 'value',
		splitLine: {
			show: false
		},
		splitNumber:1
	},
	series: [{
		name: '当日活跃人数',
		type: 'bar',
		stack: '总数',
		data: []
	}],
	color:['#3fc370']
}
userChart.setOption(userOption);
inChart.setOption(inOption);
vipChart.setOption(vipOption);
aliveChart.setOption(aliveOption);

function refreshData() {
	var now = new Date();
	var mon = now.getFullYear() + '-' + $('#monthSel').val();
	var day = now.getFullYear() + '-' + parseInt(now.getMonth() + 1) + '-' + now.getDate();
	//月收入信息
	$.post('../ngym/GymIncomeAction!getIncomeInfo.zk', {
		gmtStart: mon + '-01 00:00:00',
		gmtEnd: mon + '-31 23:59:59'
	}, function(data) {
		if (data.STATUS) {
			var totleitem = 0;
			$.each(data.courseIncome,function(index,item){
				totleitem+=item.income;
			})
			var pay = parseInt(data.storeIncome) + parseInt(data.expenseIncome);
			var total = pay + parseInt(data.membersIncome) + parseInt(data.coachIncome);
			$('#openIn').text(data.membersIncome);
			$('#lessonIn').text(totleitem.toFixed(2));
			$('#payIn').text(pay.toFixed(2));
			$('#monthIn').text((total+totleitem).toFixed(2));
		} else {
			if (data.ERROR == '未登录') {
				loginTimeout();
				return;
			}
		}
	}, 'json');
	//今日收入信息
	$.post('../ngym/GymIncomeAction!getIncomeInfo.zk', {
		gmtStart: day + ' 00:00:00',
		gmtEnd: day + ' 23:59:59'
	}, function(data) {
		if (data.STATUS) {
			var totleitem = 0;
			$.each(data.courseIncome,function(index,item){
				totleitem+=item.income;
			})
			var pay = parseInt(data.storeIncome) + parseInt(data.expenseIncome);
			var total = pay + parseInt(data.membersIncome) + parseInt(data.coachIncome);
			$('#dayIn').text((total+totleitem).toFixed(2));
		} else {
			if ('未登录' == datas.ERROR) {
				loginTimeout();
				return;
			}
		}
	}, 'json');
	//客户数量信息
	$.post('../ngym/GymIncomeAction!getCustomInfo.zk', {}, function(data) {
		if (data.STATUS) {
			var total = data.hasCardCount + data.hasLikeCount;
			$('#userTotal').text(total);
			$('#cardTotal').text(data.hasCardCount);
			$('#likeTotal').text(data.hasLikeCount);
			userChart.setOption({
				series: [{
					data: [{
						value: data.hasCardCount,
						name: '已办卡'
					}, {
						value: data.hasLikeCount,
						name: '未办卡'
					}]
				}]
			})
		} else {
			if ('未登录' == datas.ERROR) {
				loginTimeout();
				return;
			}
		}
	}, 'json');
	//今日签到人数
	$.post('../ngym/GymIncomeAction!getSignedCount.zk', {}, function(data) {
		if (data.STATUS) {
			$('#signTotal').text(data.signedCount);
		} else {
			if ('未登录' == datas.ERROR) {
				loginTimeout();
				return;
			}
		}
	}, 'json');
	//收入统计更新
	inChart.showLoading();
	$.post('../ngym/GymIncomeAction!getIncomeList.zk', {
		gmtStart: mon + '-01 00:00:00',
		gmtEnd: mon + '-31 23:59:59'
	}, function(datas) {
		if (datas.STATUS) {
			var dates = [];
			var series = [];
			for (var i = 1; i <= 31; i++) {
				dates.push(i);
				series.push(0);
			}
			if (datas.data) {
				for (var i = 0; i <= datas.data.length - 1; i++) {
					var d = new Date(datas.data[i].date);
					series[d.getDate() - 1] = datas.data[i].count;
				}
			}
			inChart.hideLoading();
			inChart.setOption({
				xAxis: {
					data: dates
				},
				series: [{
					name: '当日收入',
					data: series
				}]
			})
		} else {
			if ('未登录' == datas.ERROR) {
				loginTimeout();
				return;
			}
		}
	}, 'json');

	//会员统计更新
	vipChart.showLoading();
	$.post('../ngym/GymIncomeAction!getCustomeList.zk', {
		gmtStart: mon + '-01 00:00:00',
		gmtEnd: mon + '-31 23:59:59'
	}, function(datas) {
		if (datas.STATUS) {
			var dates = [];
			var likes = [];
			var membs = [];
			for (var i = 1; i <= 31; i++) {
				dates.push(i);
				likes.push(0);
				membs.push(0);
			}
			if (datas.likeData) {
				for (var i = 0; i <= datas.likeData.length - 1; i++) {
					var d = new Date(datas.likeData[i].date);
					likes[d.getDate() - 1] = datas.likeData[i].count;
				}
			}
			if (datas.memberData) {
				for (var i = 0; i <= datas.memberData.length - 1; i++) {
					var d = new Date(datas.memberData[i].date);
					membs[d.getDate() - 1] = datas.memberData[i].count;
				}
			}
			vipChart.hideLoading();
			vipChart.setOption({
				xAxis: {
					data: dates
				},
				series: [{
					name: '开卡增长人数',
					data: membs
				}, {
					name: '关注增长人数',
					data: likes
				}]
			})
		} else {
			if ('未登录' == datas.ERROR) {
				loginTimeout();
				return;
			}
		}
	}, 'json');

	//活跃统计更新
	aliveChart.showLoading();
	$.post('../ngym/GymIncomeAction!getActiveList.zk', {
		gmtStart: mon + '-01 00:00:00',
		gmtEnd: mon + '-31 23:59:59'
	}, function(datas) {
		if (datas.STATUS) {
			var dates = [];
			var alive = [];
			for (var i = 0; i <= 31; i++) {
				dates.push(i);
				alive.push(0);
			}
			if (datas.activeData) {
				for (var i = 0; i <= datas.activeData.length - 1; i++) {
					var d = new Date(datas.activeData[i].date);
					alive[d.getDate()] = datas.activeData[i].count;
				}
			}
			aliveChart.hideLoading();
			aliveChart.setOption({
				xAxis: {
					data: dates
				},
				series: [{
					name: '当日活跃人数',
					data: alive
				}]
			})
		} else {
			if ('未登录' == datas.ERROR) {
				loginTimeout();
				return;
			}
		}
	}, 'json');
}