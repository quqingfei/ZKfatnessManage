$(function() {
	
	loadMonthData(mon);
	loadDayData();
	getToday();
	alixndolle(years+'-'+months);
	loadsignDao(years+'-'+months);
	loadlist('教练','jllist');
	loadlist('会籍','hjlist');
	//客户数量信息
	$('#hideDiv').hide();	

});
	function exPortExcel(ele){
		$(ele).table2excel({
			exclude: ".noExl",
			name: "撒旦飞洒地方",
			filename: "download",
			exclude_img: true,
			exclude_links: true,
			exclude_inputs: true
		});
	}
function getFirstAndLastMonthDay( year, month, id){    
   var   firstdate = year + '-' + month + '-01';  
   var  day = new Date(year,month,0);   
   var lastdate = year + '-' + month + '-' + day.getDate();
   var lod = day.getDate(); 
   if(id == 1){
   		return lod; 
   }   
   return lastdate;  
}  
	var userChart = echarts.init(document.getElementById('userChart'));
	var aliveChart = echarts.init(document.getElementById('aliveChart'));
	var inChart = echarts.init(document.getElementById('inChart'));
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
		avoidLabelOverlap: false,
		calculable : true,
		 series : [
	        {
	            name:'来源',
	            type:'pie',
	            radius : ['30%','60%'],
	            center: ['50%', '45%'],
	            color:['#42d5be','#3fc371','#98d944']
	           /* data:[
	                {value:335, name:'直接访问'},
	                {value:310, name:'邮件营销'},
	                {value:234, name:'联盟广告'},
	                {value:135, name:'视频广告'},
	                {value:1548, name:'搜索引擎'}
	            ]*/
	        }
	    ]
	};
	var aliveOption = {
		tooltip: {
			formatter: function(params) {
				return $('#startDated').val() + '月' + params[0].name + '日<br/>' + params[0].seriesName + ' : ' + params[0].value;
			},
			trigger: 'axis',
			axisPointer: {
				type: 'none'
			}
		},
		grid: {
			left: '1%',
			right: '2%',
			bottom: '1%',
			top: '10%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: true,
			splitLine: {
				show: false
			},
			data: []
		},
		yAxis: {
			show:true,
			type: 'value',
			splitLine: {
				show: false
			},
			splitNumber:1
		},
		series: [{
			name: '元',
			type: 'bar',
			stack: '总数',
			data: [],

		}]
		
	}
	var inOption = {
		tooltip: {
			formatter: function(params) {
				return $('#startDated').val() + '月' + params[0].name + '日<br/>' + params[0].seriesName + ' : ' + params[0].value;
			},
			trigger: 'axis',
			axisPointer: {
				type: 'none'
			}
		},
		grid: {
			left: '1%',
			right: '2%',
			bottom: '1%',
			top: '10%',
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
			show:true,
			type: 'value',
			splitLine: {
				show: false
			},
			splitNumber:1
		},
		series: [{
			name: '人',
			type: 'line',
			stack: '总数',
			data: [],
			areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(252,207,49)'
                    }, {
                        offset: 1,
                        color: 'rgb(255, 255, 255)'
                    }])
                }
            },
		}],
		color:['rgb(252,207,49)']
	}
	userChart.setOption(userOption);
	aliveChart.setOption(aliveOption);
	inChart.setOption(inOption);

	window.addEventListener("resize", function () {
		userChart.resize();
		inChart.resize();
		aliveChart.resize();
	});
function loadlist(name,ele){
	$.post('../ngym/GymEmployeesAction!list.zk', {
		page: 1,
		rows: 1000,
		duty: name
	}, function(data) {
		if (data.STATUS) {
			var rows = data.rows;
			var makers = [];
			var roles = [{
				"id": '',
				"duty": '全部'
			}];
			//			roles.push();
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				$('#'+ele+'').append('<option value='+row.userId+'>'+row.realName+'</option>')
			}
		} else {
			if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
				//				relogin();
				loginTimeout();
			}
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
}
var coachId = '';
var commentId = '';
var startDate = '0001-01-01 00:00:00';
var endDate = '9999-12-31 23:59:59';
var datetime = new Date();
var month = datetime.getMonth()+1;
var daed = datetime.getDate();
var hour = datetime.getHours();
var minute = datetime.getMinutes();

var months = month>=10?month:'0'+month;
var days =  daed>=10?daed:'0'+daed;
var hours =  hour>=10?hour:'0'+hour;
var minutes =  minute>=10?minute:'0'+minute;
var years = datetime.getFullYear();

var mon = years + '-' + months;
var day = years + '-' + months+ '-' + days;
$('#startDate,#startDated,#startDatedaycoach,#otherTime').val(mon.replace('-','/'));
$('#startDateday,#startDatecoachday,#otherTimeDay').val(day.replace(/\-/g,'/'))
function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$('#hjlist').change(function(event) {
	/* Act on the event */
	if($("#startDate").is(":hidden")){
		$('#dgSign2').datagrid('load',{saleId:$(this).val(),date:$('#startDateday').val()})
	}else{
		$('#dgSign2').datagrid('load',{saleId:$(this).val(),date:$('#startDate').val()})
	}
});
$('#jllist').change(function(event) {
	/* Act on the event */
	if($("#startDatedaycoach").is(":hidden")){
		$('#dgSign3').datagrid('load',{saleId:$(this).val(),date:$('#startDatecoachday').val()})
	}else{
		$('#dgSign3').datagrid('load',{saleId:$(this).val(),date:$('#startDatedaycoach').val()})
	}
});
function formatpay(val){
	if(val == 0){
		return '付现';
	}else{
		return '储值';
	}
}
var member = [], coach = [], expense=[];
var dates = [];
function alixndolle(time){
	var yer = time.split('-');
	$.post('../ngym/GymIncomeAction!getIncomeList.zk', {
		gmtStart: time + '-01 00:00:00',
		gmtEnd: getFirstAndLastMonthDay(yer[0],yer[1])+' 23:59:59'
	}, function(datas) {
		if (datas.STATUS) {
			member = []; coach = []; expense=[];
			var series = [];
			for (var i = 1; i <= getFirstAndLastMonthDay(yer[0],yer[1],1); i++) {
				dates.push(i);
				member.push(0);
				coach.push(0);
				expense.push(0);
			}
				if (datas.member) {
					for (var i = 0; i <= datas.member.length - 1; i++) {
						var d = new Date(datas.member[i].date);
						member[d.getDate() - 1] = datas.member[i].income;
					}
				}
	

				if (datas.coach) {
					for (var i = 0; i <= datas.coach.length - 1; i++) {
						var d = new Date(datas.coach[i].date);
						coach[d.getDate() - 1] = datas.coach[i].income;
					}
				}


				if (datas.expense) {
					for (var i = 0; i <= datas.expense.length - 1; i++) {
						var d = new Date(datas.expense[i].date);
						expense[d.getDate() - 1] = datas.expense[i].income;
					}
				}
				chaediid('member','#42d5be');
				$('.desd li').removeClass('iemdt1');
				$('.desd li').removeClass('iemdt2');
				$('.desd li').removeClass('iemdt3');
				$('.desd li').eq(0).addClass('iemdt1');
		} else {
			if ('未登录' == datas.ERROR) {
				loginTimeout();
				return;
			}
		}
	}, 'json');
}
	

function chaediid(type,colors){
	var toe = "";
	if(type=='member'){
		toe = member;
	}if(type=='coach'){
		toe = coach;
	}if(type=='expense'){
		toe = expense;
	}
	aliveChart.hideLoading();
	aliveChart.setOption({
		xAxis: {
			data: dates
		},
		series: [{
			name: '当日收入',
			data: toe
		}],
		color:[colors]
	})
}
function loadsignDao(time){
	var yer = time.split('-');
	$.post('../ngym/GymIncomeAction!getActiveList.zk', {
		gmtStart: time + '-01 00:00:00',
		gmtEnd: getFirstAndLastMonthDay(yer[0],yer[1])+' 23:59:59'
	}, function(datas) {
		if (datas.STATUS) {
			var dates = [];
			var series = [];
			for (var i = 1; i <= getFirstAndLastMonthDay(yer[0],yer[1],1); i++) {
				dates.push(i);
				series.push(0);
			}
			if (datas.activeData) {
				for (var i = 0; i <= datas.activeData.length - 1; i++) {
					var d = new Date(datas.activeData[i].date);
					series[d.getDate() - 1] = datas.activeData[i].count;
				}
			}
			inChart.hideLoading();
			inChart.setOption({
				xAxis: {
					data: dates
				},
				series: [{
					name: '当日人数',
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
}	
function loadMonthData(mon){
	//月收入信息
	var yer = mon.split("-");
	$.post('../ngym/GymIncomeAction!getIncomeInfo.zk', {
		gmtStart: mon + '-01 00:00:00',
		gmtEnd: getFirstAndLastMonthDay(yer[0],yer[1])+' 23:59:59'
	}, function(data) {
		if (data.STATUS) {
			var totleitem = 0;
			$.each(data.courseIncome,function(index,item){
				totleitem+=item.income;
			})
			// var pay = parseInt(data.storeIncome) + parseInt(data.expenseIncome);
			var total = parseInt(data.membersIncome) + parseInt(data.coachIncome)+parseInt(data.expenseIncome);;
			$('#monthIn').text((total).toFixed(2));
			var ioed = data.expenseIncome;
			userChart.setOption({
				series: [{
					data: [{
						value: Number(data.membersIncome),
						name: '开卡收入'
					}, {
						value: Number(data.coachIncome),
						name: '课程收入'
					}, {
						value: ioed,
						name: '其他收入'
					}]
				}]
			})
		} else {
			if ( data.ERROR == '未登录') {
				loginTimeout();
				return;
			}
		}
	}, 'json');
}
function getToday(){
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
}
function loadDayData(){
	//月收入信息
	$.post('../ngym/GymIncomeAction!getIncomeInfo.zk', {
		gmtStart: years+'-'+months+'-'+days+' 00:00:00',
		gmtEnd: years+'-'+months+'-'+days+' '+hours+':'+minutes+':59'
	}, function(data) {
		if (data.STATUS) {
			var totleitem = 0;
			$.each(data.courseIncome,function(index,item){
				totleitem+=item.income;
			})
			var pay = parseInt(data.storeIncome) + parseInt(data.expenseIncome);
			var total = pay + parseInt(data.membersIncome) + parseInt(data.coachIncome);
	
			$('#storeIncome').text(data.expenseIncome);
			$('#membersIncome').text(data.membersIncome);
			$('#coachIncome').text(data.coachIncome);
		} else {
			if ( data.ERROR == '未登录') {
				loginTimeout();
				return;
			}
		}
	}, 'json');
}

function formatCourseName(value){
	var nameL = value.length;
	if(nameL>5){
		return value.substr(0,5)+"...";
	}else{
		return value;
	}
}
$('.desd li').click(function(event) {
	/* Act on the event */
	$('.desd li').removeClass('iemdt1');
	$('.desd li').removeClass('iemdt2');
	$('.desd li').removeClass('iemdt3');
	var sk = $(this).attr('val');
	if(sk == 1){
		$(this).addClass('iemdt1');
	}
	if(sk == 2){
		$(this).addClass('iemdt2');
	}
	if(sk == 3){
		$(this).addClass('iemdt3');
	}
});
var glocoachId = "";
function lessonHis(vla) {
	$('#startDate,#startDated,#startDatedaycoach,#otherTime').val(mon.replace('-','/'));
	$('#startDateday,#startDatecoachday,#otherTimeDay').val(day.replace(/\-/g,'/'))
	$('#hjlist').val("");
	var datas = "";
	if(vla){
		$('#startDate').hide();
		$('#startDateday').show();
		datas = day.replace(/\-/g,'/');
	}else{
		$('#startDateday').hide();
		$('#startDate').show();
		datas = mon.replace(/\-/g,'/');
	}
	$('#dlgSign2').dialog('open');
	$('#dgSign2').datagrid({
		rownumbers: true,
		// sortName: 'gmtModify',
		// singleSelect: true,
		pagination: true,
		pageSize: 20,
		url: '../ngym/GymIncomeAction!getGymMemberCardIncomeRecords.zk',
		queryParams: {
			date: datas,
			saleId:""
		},
		method: 'post',
		onLoadSuccess: function(data) {
			 if (data.ERROR == '未登录') {
					loginTimeout();
					//          login();
					return;
			}
			$('#newCount').text(data.newCount);
			$('#oldCount').text(data.oldCount);
			$('#Count').text(data.oldCount+data.newCount);
			$('#price').text(data.price.toFixed(2));
		}
	});
}
function formatType(val){
	if(val==0){
		return '线下';
	}else{
		return '线上';
	}
}
function formatCoach(val){
	switch(val){
		case 0: return '明星';break;
		case 1: return '口碑';break;
		case 2: return '实习';break;
		case 3: return '教练经理';break;
		default: return '无';
	}
}
function lessonHisCoach(vla) {
	var datas = "";
	$('#startDate,#startDated,#startDatedaycoach,#otherTime').val(mon.replace('-','/'));
	$('#startDateday,#startDatecoachday,#otherTimeDay').val(day.replace(/\-/g,'/'))
	$('#jllist').val("");
	if(vla){
		$('#startDatedaycoach').hide();
		$('#startDatecoachday').show();
		datas = day.replace(/\-/g,'/');
	}else{
		$('#startDatecoachday').hide();
		$('#startDatedaycoach').show();
		datas = mon.replace(/\-/g,'/');
	}
	$('#dlgSign3').dialog('open');
	$('#dgSign3').datagrid({
		rownumbers: true,
		// sortName: 'gmtModify',
		// singleSelect: true,
		pagination: true,
		pageSize: 20,
		url: '../ngym/GymIncomeAction!getGymGroupCourseIncomeRecords.zk',
		queryParams: {
			date: datas,
			saleId:""
		},
		method: 'post',
		onLoadSuccess: function(data) {
			 if (data.ERROR == '未登录') {
					loginTimeout();
					//          login();
					return;
			}
			$('#coachNew').text(data.newCount);
			$('#coachOld').text(data.oldCount);
			$('#coachCount').text(data.oldCount+data.newCount);
			$('#coachPrice').text(data.price.toFixed(2));
		}
	});
}
function lessonHisother(vla) {
	var datas = "";
	$('#startDate,#startDated,#startDatedaycoach,#otherTime').val(mon.replace('-','/'));
	$('#startDateday,#startDatecoachday,#otherTimeDay').val(day.replace(/\-/g,'/'))
	if(vla){
		$('#otherTime').hide();
		$('#otherTimeDay').show();
		datas = day.replace(/\-/g,'/');
	}else{
		$('#otherTimeDay').hide();
		$('#otherTime').show();
		datas = mon.replace(/\-/g,'/');
	}
	$('#dlgSign4').dialog('open');
	$('#dgSign4').datagrid({
		rownumbers: true,
		// sortName: 'gmtModify',
		// singleSelect: true,
		pagination: true,
		pageSize: 20,
		url: '../ngym/GymIncomeAction!getExpRecords.zk',
		queryParams: {
			date: datas
		},
		method: 'post',
		onLoadSuccess: function(data) {
			 if (data.ERROR == '未登录') {
					loginTimeout();
					//          login();
					return;
			}
			$('#coachNew').text(data.newCount);
			$('#coachOld').text(data.oldCount);
			$('#coachCount').text(data.oldCount+data.newCount);
			$('#otheryuan').text(data.price.toFixed(2));
		}
	});
}
function lessonHisSign(vla) {
	var datas = years+'/'+months+'/'+days;;
	$('#signTime').val(datas);
	$('#dlgSign5').dialog('open');
	$('#dgSign5').datagrid({
		rownumbers: true,
		// sortName: 'gmtModify',
		// singleSelect: true,
		pagination: true,
		pageSize: 20,
		url: '../ngym/GymIncomeAction!getSignRecords.zk',
		queryParams: {
			date: datas
		},
		method: 'post',
		onLoadSuccess: function(data) {
			 if (data.ERROR == '未登录') {
					loginTimeout();
					//          login();
					return;
			}
		}
	});
}
$('#startDateday,#startDatecoachday,#otherTimeDay,#signTime').mouseup(function(event) {
	$('#laydate_table').show();
	$('#laydate_today').hide();
	var ds = setInterval(function(){
		var d = document.getElementById('laydate_box')?1:2;
		if(d == 1){
			$('#laydate_table').show();
			$('#laydate_today').hide();
			clearInterval(ds);
		}
	},10);
});
$('#startDated,#startDate,#startDatedaycoach,#otherTime').mouseup(function(event) {
	$('#laydate_table').hide();
	$('#laydate_today').hide();
	var ds = setInterval(function(){
		var d = document.getElementById('laydate_box')?1:2;
		if(d == 1){
			$('#laydate_table').hide();
			$('#laydate_today').hide();
			clearInterval(ds);
		}
	},10);
});

laydate({
  elem: '#startDated',
  format: 'YYYY/MM', // 分隔符可以任意定义，该例子表示只显示年月
  festival: false, //显示节日
  choose: function(data){ //选择日期完毕的回调
    //alert('得到：'+datas);
    if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
			return;
	}
	loadMonthData(data.replace(/\//g,'-'));
	alixndolle(data.replace(/\//g,'-'));
	loadsignDao(data.replace(/\//g,'-'));
  }
});

laydate({
  elem: '#startDate',
  format: 'YYYY/MM', // 分隔符可以任意定义，该例子表示只显示年月
  festival: false, //显示节日
  choose: function(data){ //选择日期完毕的回调
    //alert('得到：'+datas);
    if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
			return;
	}
    $("#dgSign2").datagrid('load', {
		date: data,
		saleId:$('#hjlist').val()
	});
  }
});
laydate({
  elem: '#startDatedaycoach',
  format: 'YYYY/MM', // 分隔符可以任意定义，该例子表示只显示年月
  festival: false, //显示节日
  choose: function(data){ //选择日期完毕的回调
    //alert('得到：'+datas);
    if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
			return;
	}
    $("#dgSign3").datagrid('load', {
		date: data,
		saleId:$('#jllist').val()
	});
  }
});
laydate({
  elem: '#startDateday',
  format: 'YYYY/MM/DD', // 分隔符可以任意定义，该例子表示只显示年月
  festival: false, //显示节日
  choose: function(data){ //选择日期完毕的回调
    //alert('得到：'+datas);
    if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
			return;
	}
    $("#dgSign2").datagrid('load', {
		date: data,
		saleId:$('#hjlist').val()
	});
  }
});
laydate({
  elem: '#startDatecoachday',
  format: 'YYYY/MM/DD', // 分隔符可以任意定义，该例子表示只显示年月
  festival: false, //显示节日
  choose: function(data){ //选择日期完毕的回调
    //alert('得到：'+datas);
    if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
			return;
	}
    $("#dgSign3").datagrid('load', {
		date: data,
		saleId:$('#jllist').val()
	});
  }
});

laydate({
  elem: '#otherTime',
  format: 'YYYY/MM', // 分隔符可以任意定义，该例子表示只显示年月
  festival: false, //显示节日
  choose: function(data){ //选择日期完毕的回调
    //alert('得到：'+datas);
    if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
			return;
	}
	$("#dgSign4").datagrid('load', {
		date: data
	});
  }
});
laydate({
  elem: '#otherTimeDay',
  format: 'YYYY/MM/DD', // 分隔符可以任意定义，该例子表示只显示年月
  festival: false, //显示节日
  choose: function(data){ //选择日期完毕的回调
    //alert('得到：'+datas);
    if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
			return;
	}
	$("#dgSign4").datagrid('load', {
		date: data
	});
  }
});
laydate({
  elem: '#signTime',
  format: 'YYYY/MM/DD', // 分隔符可以任意定义，该例子表示只显示年月
  festival: false, //显示节日
  choose: function(data){ //选择日期完毕的回调
    //alert('得到：'+datas);
    if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
			return;
	}
	$("#dgSign5").datagrid('load', {
		date: data
	});
  }
});
/*laydate({
  elem: '#startDate',
  format: 'YYYY/MM/DD', // 分隔符可以任意定义，该例子表示只显示年月
  festival: false, //显示节日
  choose: function(data){ //选择日期完毕的回调
    //alert('得到：'+datas);
    if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
			return;
	}
    $("#dgSign2").datagrid('load', {
		date: data
	});
  }
});*/
function formatDate(value,row){
	var reg = /.*\..*/;
    if(!reg.test(row.courseHour)){
    	return value+" "+row.courseHour+":"+"00"
    }else{
    	return value+" "+parseInt(row.courseHour)+":"+"30"
    }
}
function formatEval(value){
	switch(value){
		case 0: return "<span style='color:#D0D0D0'>非会员</span>";break;
		case 1: return "新会员";break;
	}
	if (value>=2) {
		return '老会员'
	};
}
function formatLevel(value) {
	switch (value) {
		case 0:
			return '明星教练';
			break;
		case 1:
			return '口碑教练';
			break;
		case 2:
			return '实习教练';
			break;
		default:
			return '未知';
			break;
	}
}

function onStart(datas) {
	startDate = datas + ' 00:00:00';
	searchComment();
}

function onEnd(datas) {
	endDate = datas + ' 00:00:00';
	searchComment();
}

function searchComment() {
	$("#dg").datagrid('load', {
		coachId: coachId,
		startDate: startDate,
		endDate: endDate
	});
}
var comPage = 0;
var maxPage = 0;

function checkComment(value, major, service, total) {
	comPage = 0;
	maxPage = 0;
	commentId = value;

	$('#commentTotal h3').text(total);
	$('#expertStar h3').text(major);
	$('#serviceStar h3').text(service);
	loadComment(comPage);
	$('#dlgCheck').dialog('open');
}

function commentPrev() {
	comPage--;
	if (comPage < 0) comPage = 0;
	else loadComment(comPage);
}

function commentNext() {
	if (!maxPage) {
		comPage++;
		loadComment(comPage);
	}

}

function loadComment(page) {
	$.post('../ngym/GymGroupCourseManageAction!listCoachEvaluate.zk', {
		coachId: commentId,
		startDate: startDate,
		endDate: endDate,
		page: page,
		rows: 15
	}, function(data) {
		if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
			return;
		}
		if (data.STATUS) {
			var comments = data.rows;
			if (comments.length > 0) {
				$('.dialog-body').html('');
				for (var n = 0; n < comments.length; n++) {
					var comment = comments[n];
					var _commentItem = $('<div>').attr('class', 'comment-item');
					var _comment1 = '<div class="item-row"><div class="item-col"><b>评价学员：</b><span>' + comment.userName + '</span></div><div class="item-col"><b>训练课程：</b><span>' + comment.courseName + '</span></div></div>';
					var _comment2 = '<div class="item-row"><div class="item-col"><b>学员手机：</b><span>' + (comment.userPhone != undefined ? comment.userPhone : '无') + '</span></div><div class="item-col"><b>学员评分：</b><span>专业' + comment.major + '星 服务' + comment.service + '星</span></div></div>';
					var _comment3 = '<div class="item-row"><div class="item-col"><b>是否匿名：</b><span>' + (comment.anonymous == 'y' ? '是' : '否') + '</span></div><div class="item-col"><b>评价时间：</b><span>' + formatTime(comment.evaluateDate) + '</span></div></div>';
					var _comment4 = '<div class="item-row"><b>评价内容：</b><span>' + (comment.comment != undefined ? comment.comment : '无') + '</span></div>';
					var commentPics = $('<div>').attr('class', 'item-row');
					if (!!comment.images) {
						commentPics.append($('<b>'));
						var pics = eval('(' + comment.images + ')');
						// console.log(pics);
						for (var i = 0; i < pics.length; i++) {
							var pic = $('<div>').attr({
								'class': 'item-pics',
								'data-src': pics[i]
							}).css({
								'background': '#ccc url(\'../file/FileCenter!showImage2.zk?name=' + pics[i] + '\')',
								'background-repeat': 'no-repeat',
								'background-size': 'cover',
								'background-position': 'center'
							});
							commentPics.append(pic);
						}
					}
					_commentItem.append(_comment1);
					_commentItem.append(_comment2);
					_commentItem.append(_comment3);
					_commentItem.append(_comment4);
					_commentItem.append(commentPics);
					$('.dialog-body').append(_commentItem);
				}
			} else {
				comPage--;
				maxPage = 1;
			}

		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
}

function formatTime(value) {
	var d = new Date(value);
	return d.format("yyyy-MM-dd hh:mm");
}