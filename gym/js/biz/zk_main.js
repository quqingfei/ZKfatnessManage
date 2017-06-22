///////////////用户管理/////////////
$(function() {
	$.getJSON("userAction!getUserSummary.zk", function(data) {
		$("#total").text(data.total);
		$("#male").text(data.male);
		$("#female").text(data.female);
		$("#age").text(data.age);
		//$("#dayUsers").text(data.dayUsers);
		//$("#monthUsers").text(data.monthUsers);
		$("#dayNewUsers").text(data.dayNewUsers);
		$("#monthNewUsers").text(data.monthNewUsers);
	});
});

var userId, week;
function show() {
	var row = $('#dg').datagrid('getSelected');
    if (row){
		$('#usrdlg').dialog('open').dialog('setTitle','数据分析');
    	userId = row.userId;
		week = 1;
		createHealthChart(); 
    }else{
    	$.messager.alert('错误','请先选择用户!','error');
    }
}

function createHealthChart() {
	$.getJSON("userAction!getUserHealthSummary.zk", {
		user_id : userId,
		week : week
	}, function(data) {
		if(data.ERROR&&data.ERROR=='No Login!'){
            alert('登陆超时，请重新登录!');
            location.replace('index.html');
        }else{
        	if(data.dates.length>0){
        		var myChart = echarts.init(document.getElementById('main'));
        	    myChart.setOption({
        	        title : {
        	            text: '用户运动情况分析',
        	        },
        	        tooltip : {
        	            trigger: 'axis'
        	        },
        	        legend: {
        	            data:['使用时长（分）','踏步数（步）']
        	        },
        	        toolbox: {
        	            show : true,
        	            orient: 'vertical',
    			        y: 'center',
        	            feature : {
        	                mark : {show: false},
        	                dataView : {show: false, readOnly: false},
        	                magicType : {show: true, type: ['line', 'bar']},
        	                restore : {show: true},
        	                saveAsImage : {show: true}
        	            }
        	        },
        	        calculable : true,
        	        xAxis : [
        	            {
        	                type : 'category',
        	                //data : ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日' ]
        	                data : data.dates
        	            }
        	        ],
        	        yAxis : [
        	            {
        	                type : 'value',
        	                splitArea : {show : true}
        	            }
        	        ],
        	        series : [
        	            {
        	                name:'使用时长（分）',
        	                type:'line',
        	                data: data.usedTime,
        	                markPoint : {
        	                    data : [
        	                        {type : 'max', name: '最大值'},
        	                        {type : 'min', name: '最小值'}
        	                    ]
        	                }
        	            },
        	            {
        	                name:'踏步数（步）',
        	                type:'line',
        	                data: data.steps,
        	                markPoint : {
        	                    data : [
        	                        {type : 'max', name: '最大值'},
        	                        {type : 'min', name: '最小值'}
        	                    ]
        	                }
        	            }
        	  
        	        ]
        	    });
        	}else{
        		$("#main").text('没有数据');
        	}
        }
	});
}

function prevWeek() {
	week -= 1;
	createHealthChart();
}

function nextWeek() {
	if(week == 1){
		alert('无法查看本周以后的数据!');
		return;
	}else{
		week += 1;
		createHealthChart();
	}
}




function initBroadcast(){
	$('#bcimMsg').val('');
    $('#bcmsgDlg').dialog('open').dialog('setTitle','系统通知');
}
function broadcast(){
	var $msgInput = $('#bcimMsg');
	var msg = $msgInput.val();
	if(msg == ''){
		alert('消息不能为空!');
		$msgInput.focus();
	}
	$.post('userAction!broadcast.zk',{msg:msg},function(data){
		if(data.STATUS){
			$('#bcmsgDlg').dialog('close');
			showTip('成功发送广播！');
		}else{
			alert(data.INFO);
		}
	},'json');

}