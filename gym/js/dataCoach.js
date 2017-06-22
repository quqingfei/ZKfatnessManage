var dutySel;
var dutyId;
var searchRole = '';
var userIdStaff;

$(function() {
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
			// makers.push({
			// 	"id": '',
			// 	"duty": ''
			// });
			$('#searchRole').combobox({
				valueField: 'id',
				textField: 'duty',
				data: makers,
				onSelect: function(rec) {
					dutySel = rec.duty;
					dutyId = rec.id;
					if ($('#month').combobox('getValue')) {
						searchStaff();
					}
				}
			});
			// $('#hjSel').combobox({
			// 	valueField: 'id',
			// 	textField: 'duty',
			// 	data: makers,
			// 	onSelect: function(rec) {
			// 		hjSel = rec.duty;
			// 		hjId = rec.id;

			// 	}
			// });
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
	$('#hideDiv').hide();
	var dates = new Date().getMonth()+1;
	$('#month').combobox('setValue', dates);
	chartInit();
});
var inChart = echarts.init(document.getElementById('dataChart'));
var inOption = {
	title: {
		text: '当月业绩统计(元)',
		left: 'center',
		textStyle: {
			fontSize: '14'
		}
	},
	tooltip: {
		formatter: function(params) {
			return $('#month').combobox('getValue') + '月' + params[0].name + '日<br/>' + params[0].seriesName + ' : ' + params[0].value;
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
		name: '当日业绩',
		type: 'line',
		stack: '总额',
		data: []
	}],
	color: ['#3fc370']
}
inChart.setOption(inOption);

function getMonthNum() {
	var curMouth = new Date().getMonth() + 1;
	var data = [];
	for (var i = 1; i <= curMouth; i++) {
		var mun = i;
		if (i < 10) {
			mun = '0' + mun;
		};
		data.push({
			text: mun + '月',
			value: i
		});
	}
	return data;
}
$('#month').combobox({
	valueField: 'value',
	textField: 'text',
	data: getMonthNum(),
	onSelect: function(rec) {
		if (!!dutyId) {
			searchStaff();
		}
	}
});

function chartInit() {
	var dates = [];
	var series = [];
	for (var i = 1; i <= 31; i++) {
		dates.push(i);
		series.push(0);
	}
	inChart.setOption({
		xAxis: {
			data: dates
		},
		series: [{
			name: '当日业绩',
			data: series
		}]
	})
}

function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}

function formatControl(value, row) {
	var control = '<a href="javascript:;" id="staffEdit" onclick="staffEdit(\'' + value + '\',\'' + row.realName + '\',' + row.phone + ',\'' + row.duty + '\',\'' + row.roleId + '\')">编辑</a>';
	return control;
}

function formatTime(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd hh:mm");
}

function searchStaff() {
	var now = new Date();
	var year = now.getFullYear();
	var mon = year + '-' + $('#month').combobox('getValue');
	inChart.showLoading();
	$.post('../ngym/GymEmployeesAction!statisticalCoach.zk', {
		gmtStart: mon + '-01 00:00:00',
		gmtEnd: mon + '-31 23:59:59',
		coachId: dutyId
	}, function(datas) {
		if (datas.STATUS) {
			var dates = [];
			var series = [];
			var totalMoney = 0;
			if (datas.data.length > 0) {
				$.each(datas.data, function(index, item) {
					totalMoney += item.pay;
				})
				$('#totalMoney').html(totalMoney);
			} else {
				$('#totalMoney').html(totalMoney);
			}
			for (var i = 1; i <= 31; i++) {
				dates.push(i);
				series.push(0);
			}
			if (datas.data) {
				for (var i = 0; i <= datas.data.length - 1; i++) {
					var d = new Date(datas.data[i].date);
					series[d.getDate() - 1] = datas.data[i].pay;
				}
			}
			inChart.hideLoading();
			inChart.setOption({
				xAxis: {
					data: dates
				},
				series: [{
					name: '当日业绩',
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
	$('#dg').datagrid({
		fitColumns: true,
		nowrap: true,
		rownumbers: true,
		singleSelect: true,
		url: '../ngym/GymEmployeesAction!listCoachRecore.zk',
		pagination: true,
		pageSize: '30',
		//            queryParams:{gmtStart:gmtStart,gmtEnd:gmtEnd,timeStart:timeStart,timeEnd: timeEnd,name:name,duty:duty},
		queryParams: {
			gmtStart: mon + '-01 00:00:00',
			gmtEnd: mon + '-31 23:59:59',
			coachId: dutyId
		},
		method: 'post',
		onLoadSuccess: function(data) {
			if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
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
		},
		onLoadError: function() {
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
	})
}