$(function() {
/*	$.post('../ngym/GymEmployeesAction!list.zk', {
		page: 1,
		rows: 1000,
		duty: '教练'
	}, function(data) {
		if (data.ERROR == '未登录') {
			loginTimeout();
			//          login();
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
					// dutySel = rec.duty;
					coachId = rec.id;
					searchComment($('#lessonYear').combobox('getValue'),$('#lessonMonth').combobox('getValue'),coachId);
				}
			});
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');*/
	$('#hideDiv').hide();
	var coachId = '';
	var commentId = '';

	function loginTimeout() {
		window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
	}
	setTimeout(function(){		
		$('#lessonYear,#lessonMonth').combobox({
			onSelect: function() {
				searchComment($('#lessonYear').combobox('getValue'),$('#lessonMonth').combobox('getValue'),$('#roleSel').combobox('getValue'));
			}
		});
		$('#lessonYear').combobox('setValue',new Date().getFullYear());
		$('#lessonMonth').combobox('setValue',new Date().getMonth()+1);
	},10)

	function searchComment(year, month ,id) {
		$("#dg").datagrid({
			url:'../ngym/GymGroupCourseManageAction!effectAchievementRatio.zk',
			method:'post',
			queryParams:{				
				year: year,
				month: month,
				coachId: id
			},
			onLoadSuccess: function(data) {
				if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
					//				relogin();
					relogin();
				}
			}
		});
	}
	
	setTimeout(function(){
		searchComment(new Date().getFullYear(),new Date().getMonth()+1);
	},10)
	$.post('../ngym/GymEmployeesAction!list.zk', {
		page: 1,
		rows: 1000,
		duty: '教练'
	}, function(data) {
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
                "duty": '全部'
            });
            $('#roleSel').combobox({
                valueField: 'id',
                textField: 'duty',
                data: makers,
                onSelect: function(rec) {
                    $("#dg").datagrid('load', {coachId:$('#roleSel').combobox('getValue'),year:$('#lessonYear').combobox('getValue'),month:$('#lessonMonth').combobox('getValue')});
                }
            });
        } else {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
        }
	}, 'json');
	$('.duibibtn').click(function(){
		var row = $('#dg').datagrid('getSelected');
		if (!row) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择需要操作的条目！');
			return false;
		}
		$.ajax({
			type: 'post',
			url: '../fatburn/ngym/GymGroupCourseManageAction!getTwoExam.zk',
			dataType: 'json',
			data: {userId:row.userId,year:$('#lessonYear').combobox('getValue'),month:$('#lessonMonth').combobox('getValue')},
			success: function(res){
				var first = res.firstExamData[0];
				var last  = res.lastExamData[0];
				if( typeof(first)=='undefined'){
					$('#ftime').text('-');
					$('#fweight').text('-');
					$('#fbmi').text('-');
					$('#ffat').text('-');
					$('#fcalor').text('-');
					$('#fsubfat').text('-');
					$('#fmus').text('-');
					$('#fbone').text('-');
					$('#fwater').text('-');
					$('#fprotein').text('-');
					$('#finfat').text('-');
					$('#frestingHeartRate').text('-');
					$('#fwaistHip').text('-');
					$('#fminBloodPressure').text('-');
					$('#fmaxBloodPressure').text('-');
				}else{
					var ftime = new Date(first.examTime).format("yyyy-MM-dd");
					$('#ftime').text(ftime);
					var fweight = first.weight;
					$('#fweight').text(fweight);
					var fbmi = first.bmi;
					$('#fbmi').text(fbmi);
					var ffat = first.fat;
					$('#ffat').text(ffat);
					var fcalor = Number(first.caloriesBase.toFixed(1));
					$('#fcalor').text(fcalor);
					var fsubfat = first.subFat;
					$('#fsubfat').text(fsubfat);
					var fmus = first.muscle;
					$('#fmus').text(fmus);
					var fbone = first.bone;
					$('#fbone').text(fbone);
					var fwater = first.bodyWater;
					$('#fwater').text(fwater);
					var fprotein = first.protein;
					$('#fprotein').text(fprotein);
					var finfat = first.infat;
					$('#finfat').text(finfat);
					var frestingHeartRate = first.restingHeartRate;
					$('#frestingHeartRate').text(frestingHeartRate);
					var fwaistHip = first.waistHip;
					$('#fwaistHip').text(fwaistHip);
					var fminBloodPressure = first.minBloodPressure;
					$('#fminBloodPressure').text(fminBloodPressure);
					var fmaxBloodPressure = first.maxBloodPressure;
					$('#fmaxBloodPressure').text(fmaxBloodPressure);
				}
				if( typeof(last)=='undefined'){
					$('#ltime').text('-');
					$('#lweight').text('-');
					$('#lbmi').text('-');
					$('#lfat').text('-');
					$('#lcalor').text('-');
					$('#lsubfat').text('-');
					$('#lmus').text('-');
					$('#lbone').text('-');
					$('#lwater').text('-');
					$('#lprotein').text('-');
					$('#linfat').text('-');
					$('#lrestingHeartRate').text('-');
					$('#lwaistHip').text('-');
					$('#lminBloodPressure').text('-');
					$('#lmaxBloodPressure').text('-');
				}else{
					var ltime = new Date(last.examTime).format("yyyy-MM-dd");
					$('#ltime').text(ltime);
					var lweight = last.weight;
					$('#lweight').text(lweight);
					var lbmi = last.bmi;
					$('#lbmi').text(lbmi);
					var lfat = last.fat;
					$('#lfat').text(lfat);
					var lcalor = Number(last.caloriesBase.toFixed(1));
					$('#lcalor').text(lcalor);
					var lsubfat = last.subFat;
					$('#lsubfat').text(lsubfat);
					var lmus = last.muscle;
					$('#lmus').text(lmus);
					var lbone = last.bone;
					$('#lbone').text(lbone);
					var lwater = last.bodyWater;
					$('#lwater').text(lwater);
					var lprotein = last.protein;
					$('#lprotein').text(lprotein);
					var linfat = last.infat;
					$('#linfat').text(linfat);
					var lrestingHeartRate = last.restingHeartRate;
					$('#lrestingHeartRate').text(lrestingHeartRate);
					var lwaistHip = last.waistHip;
					$('#lwaistHip').text(lwaistHip);
					var lminBloodPressure = last.minBloodPressure;
					$('#lminBloodPressure').text(lminBloodPressure);
					var lmaxBloodPressure = last.maxBloodPressure;
					$('#lmaxBloodPressure').text(lmaxBloodPressure);
				}
				
				if( typeof(first)!='undefined' && typeof(last)!='undefined'){
					$('#cweight').text(lweight-fweight>0?'+'+(lweight-fweight).toFixed(1):(lweight-fweight).toFixed(1));

					$('#cbmi').text(lbmi-fbmi>0?'+'+((lbmi-fbmi).toFixed(2)):((lbmi-fbmi).toFixed(2)));

					$('#cfat').text(lfat-ffat>0?'+'+(lfat-ffat).toFixed(1):(lfat-ffat).toFixed(1));

					$('#ccalor').text(lcalor-fcalor>0?'+'+((lcalor-fcalor).toFixed(2)):((lcalor-fcalor).toFixed(2)));
							
					$('#csubfat').text(lsubfat-fsubfat>0?'+'+(lsubfat-fsubfat).toFixed(1):(lsubfat-fsubfat).toFixed(1));
	
					$('#cmus').text(lmus-fmus>0?'+'+(lmus-fmus).toFixed(2):(lmus-fmus).toFixed(2));
									
					$('#cbone').text(lbone-fbone>0?'+'+(lbone-fbone).toFixed(1):(lbone-fbone).toFixed(1));
								
					$('#cwater').text(lwater-fwater>0?'+'+(lwater-fwater).toFixed(1):(lwater-fwater).toFixed(1));
									
					$('#cprotein').text(lprotein-fprotein>0?'+'+(lprotein-fprotein).toFixed(1):(lprotein-fprotein).toFixed(1));
									
					$('#cinfat').text(linfat-finfat>0?'+'+(linfat-finfat).toFixed(1):(linfat-finfat).toFixed(1));
							
					$('#crestingHeartRate').text(lrestingHeartRate-frestingHeartRate>0?'+'+(lrestingHeartRate-frestingHeartRate).toFixed(1):(lrestingHeartRate-frestingHeartRate).toFixed(1));
								
					$('#cwaistHip').text((lwaistHip-fwaistHip>0?'+'+lwaistHip-fwaistHip:lwaistHip-fwaistHip).toFixed(2));
							
					$('#cminBloodPressure').text(lminBloodPressure-fminBloodPressure>0?'+'+(lminBloodPressure-fminBloodPressure).toFixed(1):(lminBloodPressure-fminBloodPressure).toFixed(1));
				
					$('#cmaxBloodPressure').text(lmaxBloodPressure-fmaxBloodPressure>0?'+'+(lmaxBloodPressure-fmaxBloodPressure).toFixed(1):(lmaxBloodPressure-fmaxBloodPressure).toFixed(1));
			
				}else{
					$('#cweight').text('-');
					$('#cbmi').text('-');
					$('#cfat').text('-');
					$('#ccalor').text('-');
					$('#csubfat').text('-')
					$('#cmus').text('-');
					$('#cbone').text('-');
					$('#cwater').text('-');
					$('#cprotein').text('-');
					$('#cinfat').text('-');
					$('#crestingHeartRate').text('-');
					$('#cwaistHip').text('-');
					$('#cminBloodPressure').text('-');
					$('#cmaxBloodPressure').text('-');
				}	
			},
			error: function(err){
				console.log(err);
			}
		})
		$('#dlgCheck').dialog('open');
	})
});
	function formatTime(value) {
		var d = new Date(value);
		return d.format("yyyy-MM-dd hh:mm");
	}
	function fommantBMI (value) {
		if(value=='-'){
			return value;
		}else{
			var first = value.substr(0, 1);
			var other = value.substr(1, 4);
			return first+other;
		}
	}
	function formatImse(bmi){
		if (bmi < 18.5) {
			return '增肌'
		} else if (bmi < 24) {
			return '维持'
		} else if (bmi < 28) {
			return '减脂'
		} else if (bmi >= 28) {
			return '减脂'
		} else {
			return '未知'
		}
	}