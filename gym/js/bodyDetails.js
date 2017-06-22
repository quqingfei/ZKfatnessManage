function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
	$('#dg').datagrid({
		onLoadSuccess: function(data) {
			if (data.ERROR == '未登录') { // (data.total == 0 &&
				// data.ERROR == 'No Login!')
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示',
					'登录超时,请重新登录!');
				relogin();
			}
			$('#dg12345').datagrid('doCellTip', {
				onlyShowInterrupt: false, // 是否只有在文字被截断时才显示tip，默认值为false
				position: 'bottom', // tip的位置，可以为top,botom,right,left
				cls: {
					'background-color': '#FFF'
				}, // tip的样式D1EEEE
				delay: 100
					// tip 响应时间
			});
			// 图片弹出层
			//					$("a.popImage").fancybox({
			//						openEffect : 'elastic',
			//						closeEffect : 'elastic'
			//					});
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
                    searchUser(curStatus,rec.id);
                }
            });
        } else {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
        }
	}, 'json');
	$('#hideDiv').hide();
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
				searchUserById(data.userId, curStatus);
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码!');
			}
		}, 'json');
	});
	$('#attention').trigger('click');
});

// 监听鼠标事件--回车
// 注册
//document.getElementById('toAllMessage').onkeydown = function(event) {
//	var event = event || window.event;// 这里的event兼容跟上面不同，关于event的兼容，请猛戳这里
//	if (event.keyCode == 13) {
//		if ($('#dlg0').css('display') == 'block') {
//			event.preventDefault();
//			sendAllMessage();
//			return false;
//		}
//	}
//};

var remarkUserId;
var curRow; // 当前行
var remark = [];
var curRowIndex;

function remarkEdit(value, index) {
	curRowIndex = index;
	var div = document.getElementById("remarkList");
	while (div.hasChildNodes()) // 当div下还存在子节点时 循环继续
	{
		div.removeChild(div.firstChild);
	}
	$("#" + 'remarkMessage').attr('value', '');
	$("#userId").attr('value', value);
	var record = $('#dg').datagrid('selectRow', index);
	var row = $('#dg').datagrid('getSelected');
	if (row) {
		$('#dlg').dialog('open').dialog('setTitle',
			"&nbsp;&nbsp;" + row.nickName + "的标注");
		remarkUserId = row.userId;
		curRow = row;
		var fatherDiv = document.getElementById("remarkList");
		remark = [];
		if (!row.mark || row.mark == '')
			return;
		var array = eval('(' + row.mark + ')');
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
	// alert(JSON.stringify(remark));
}

function saveRemark() {
	// var value = $("#"+'remarkMessage').textbox('getValue');
	var value = $.trim($("#" + 'remarkMessage').val());
	if (value.length > 10) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '长度不能超过10！');
		return;
	}
	if ($.trim(value) != '')
		remark.push($.trim(value));
	// alert(JSON.stringify(remark));
	var string = JSON.stringify(remark);
	$("#remark").attr("value", "");
	$("#remark").val(string);
	$.post('userAction!remark.zk', {
		userId: remarkUserId,
		remark: string
	}, function(data) {
		if (data.STATUS) {
			// $('#dlg').dialog('close'); // close the dialog
			// $('#dg').datagrid('reload');// reload the user data
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
			curRow.mark = string;
			// $($(curRow.remark).children("div")[0]).html("<span>hah1</span>");//"<div
			// style='width:100%;height:100%;text-align:center;'
			// onclick=\"remarkEdit('"+curRow.user_id+"',"+curRowIndex+");\">"+result+"</div>";
			$("#" + 'remarkMessage').val('');
			$('#dg').datagrid('refreshRow', curRowIndex);

			// alert("保存成功");

		} else {
			if ('No Login!' == data.ERROR) {
				loginTimeout();
				return;
			}
		}
	}, 'json');

}

// 用户筛选事件,自动搜索
// $("#startDate").datebox({
// 	onChange: function(n, o) {
// 		searchUser(curStatus);
// 	},
// 	onSelect: function(n, o) {
// 		searchUser(curStatus);
// 	}
// });
// $("#endDate").datebox({
// 	onChange: function(n, o) {
// 		searchUser(curStatus);
// 	},
// 	onSelect: function(n, o) {
// 		searchUser(curStatus);
// 	}
// });

var curId = '';

var curStatus;

function toChooseUser(id, value) {
	if (curId != '')
		$('#' + curId).css({
			color: '#fff'
		});
	$('#' + id).css({
		color: '#FFD600'
	});
	userTypeT = $('#' + id).attr("data-value");
	curId = id;
	curStatus = value;
	$('#dg').datagrid('clearChecked');
	searchUser(value);
}

function searchUser(value,coachid) {
	var data = {};
	// var phone = $('#phoneSearch').val();
	var startDate = $("#startDate").val(); // Date.parse($("#startDate").val());
	var endDate = $("#endDate").val(); // Date.parse($("#endDate").val());
	var startDatenum = parseInt(startDate.replace(/\-/g, "").replace(/\:/g, "").replace(/\ /g, ""));
	var endDatenum = parseInt(endDate.replace(/\-/g, "").replace(/\:/g, "").replace(/\ /g, ""));
	if (startDatenum > endDatenum) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '结束日期必须大于起始日期!');
		return false;
	}
	// var mark = $('#markSearch').val();
	if (value && value != '')
		data.type = value;
	// if (phone && phone != '')
	// 	data.phone = phone;
	if (startDate && startDate != '')
		data.gmtStart = startDate + " 00:00:00";
	else
		data.gmtStart = "0000-00-00 00:00:00";
	if (endDate && endDate != '')
		data.gmtEnd = endDate + " 23:59:59";
	else
		data.gmtEnd = "9999-01-01 00:00:00";
	if (startDate == endDate && endDate != '')
		data.gmtEnd = endDate + " 23:59:59";
	// if (mark && mark != '')
	// 	data.remark = mark;
		data.coachId = coachid;
		data.requstType = 'examTime';
	$("#dg").datagrid('load', data);

}

function searchUserById(id, value) {
	var data = {};
	var userID = id;
	// var phone = $('#phoneSearch').val();
	var startDate = $("#startDate").val() // Date.parse($("#startDate").val());
	var endDate = $("#endDate").val(); // Date.parse($("#endDate").val());
	// var mark = $('#markSearch').val();
	if (value && value != '')
		data.type = value;
	// if (phone && phone != '')
	// 	data.phone = phone;
	if (startDate && startDate != '')
		data.gmtStart = startDate + " 00:00:00";
	if (endDate && endDate != '')
		data.gmtEnd = endDate + " 00:00:00";
	if (startDate == endDate && endDate != '')
		data.gmtEnd = endDate + " 23:59:59";
	if (userID && userID != '')
		data.userId = userID;
	// if (mark && mark != '')
	// 	data.remark = mark;
	$("#dg").datagrid('load', data);
}

function toSearch() {
	searchUser(curStatus);
}

// 年龄换算
function formatAge(value) {
	// alert(value);
	var date = new Date();
	return date.getFullYear() - parseInt(value);
}
// 日期换算
function formatTime(value) {
	if (!value) {
		return '';
	}
	var date = new Date((value));
	var result = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(); // +':'+second;
	return result;
}
// 日期换算
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
// 可执行操作
function formatAction(value, row, index) {
	var seeMessage = '<a href="javascript:;" onclick="seeMessage(\'' + row.userId + '\')">查看</a>';
	var bodyMeasurements = '<a href="javascript:;"  onclick="measurement(' + index + ')">体测录入</a>';

	var action;

	action = '<div class="action">' + seeMessage + bodyMeasurements + '</div>';

	return action;
}

function chooseImage(id) {
	document.getElementById(id).click();
}

//上传文章图片
function uploadImage() {
	//alert('upload');
	var viewFiles = document.getElementById("file_title_img");
	//是否为图片类型
	if (/image\/\w+/.test(viewFiles.files[0].type)) {
		//最大图片文件大小 500KB
		var imgSizeLimit = 500 * 1024;
		if (viewFiles.files[0].size <= imgSizeLimit) {
			//上传图片
			$("#title_img_form").ajaxSubmit({
				type: 'post',
				url: '../file/FileCenter!uploadImage2.zk',
				beforeSubmit: function() {
					$('#imghead').attr('src', 'images/loading.gif');
				},
				success: function(data) {
					data = $.parseJSON(data);
					if (data.name) {
						// alert(data.name);
						var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;

						// $("#imghidehead").attr("src", imgURL);
						$("#imghead").attr("src", imgURL);
						$("#cover").val(data.name);
						$("#imghidehead").attr("src", '');
						/*$("#imghidehead").one('load',function(){							
							if($("#imghidehead").width()==640 || $("#imghidehead").height()==276){
								$("#imghead").attr("src", imgURL);
								$("#cover").val(data.name);
								$("#imghidehead").attr("src", '');
							}else{
								$.messager.alert('注意','上传的图片尺寸应该为：宽640像素*高276像素');
								$('#imghead').attr('src','images/regist_pic.png');								
								return false;
							}
						}).each(function(){
						 		if(this.complete) $(this).load();
						 	})	*/
					} else {
						alert("上传图片出错！");
					}
					$("#title_img_form").resetForm();
				},
				error: function(XmlHttpRequest, textStatus, errorThrown) {
					alert("error");
				}
			});
		} else {
			alert("图片大小不能超过" + (imgSizeLimit / 1024) + "KB!");
		}
	} else {
		alert('请选择图片类型的文件!');
	}
}

function seeMessage() {
	var row = $('#dg').datagrid('getSelected');
	$('.biaochi').html('');
	if (!!row) {
		// var sidl = encodeURI(encodeURI(row.realName));
		$('#hideName').val(encodeURI(encodeURI(row.realName)));
		$('#prints').click(function() {
			window.open('../record/index.html?id='+$('#examchoosetime').val()+'&name='+$('#hideName').val());
		});
		$.ajax({
			type: 'post',
			url: '../ngym/GymBodyExamAction!list.zk!list.zk?userId=' + row.userId + '&orderBy=gmtCreate',
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
							$('.biaochi').append('<a class="ser" val="0" style="margin-left:284px;" href="javascript:;">' + formatTimeM(datas[0].examTime) + '</a>');
							break;
						case 2:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].examTime) + '</a><a class="ser" val="1" style="margin-left:466px;" href="javascript:;">' + formatTimeM(datas[1].examTime) + '</a>');
							break;
						case 3:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].examTime) + '</a><a style="margin-left:214px;" val="1" href="javascript:;">' + formatTimeM(datas[1].examTime) + '</a><a class="ser" val="2" style="margin-left: 212px;" href="javascript:;">' + formatTimeM(datas[2].examTime) + '</a>');
							break;
						case 4:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].examTime) + '</a><a style="margin-left:123px;" val="1" href="javascript:;">' + formatTimeM(datas[1].examTime) + '</a><a style="margin-left: 128px;" val="2" href="javascript:;">' + formatTimeM(datas[2].examTime) + '</a><a class="ser" val="3" style="margin-left: 123px;" href="javascript:;">' + formatTimeM(datas[3].examTime) + '</a>');
							break;
						case 5:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].examTime) + '</a><a style="margin-left:79px;" val="1" href="javascript:;">' + formatTimeM(datas[1].examTime) + '</a><a style="margin-left: 85px;" val="2" href="javascript:;">' + formatTimeM(datas[2].examTime) + '</a><a style="margin-left: 84px;" val="3" href="javascript:;">' + formatTimeM(datas[3].examTime) + '</a><a class="ser" val="4" style="margin-left: 82px;" href="javascript:;">' + formatTimeM(datas[4].examTime) + '</a>');
							break;
						case 6:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].examTime) + '</a><a style="margin-left:61px;" val="1" href="javascript:;">' + formatTimeM(datas[1].examTime) + '</a><a style="margin-left: 61px;" val="2" href="javascript:;">' + formatTimeM(datas[2].examTime) + '</a><a style="margin-left: 54px;" val="3" href="javascript:;">' + formatTimeM(datas[3].examTime) + '</a><a style="margin-left: 54px;" val="4" href="javascript:;">' + formatTimeM(datas[4].examTime) + '</a><a class="ser" val="5" style="margin-left: 59px;" href="javascript:;">' + formatTimeM(datas[5].examTime) + '</a>');
							break;
						case 7:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].examTime) + '</a><a style="margin-left:42px;" val="1" href="javascript:;">' + formatTimeM(datas[1].examTime) + '</a><a style="margin-left: 40px;" val="2" href="javascript:;">' + formatTimeM(datas[2].examTime) + '</a><a style="margin-left: 40px;" val="3" href="javascript:;">' + formatTimeM(datas[3].examTime) + '</a><a style="margin-left: 40px;" val="4" href="javascript:;">' + formatTimeM(datas[4].examTime) + '</a><a style="margin-left: 42px;" val="5" href="javascript:;">' + formatTimeM(datas[5].examTime) + '</a><a class="ser" val="6" style="margin-left: 38px;" href="javascript:;">' + formatTimeM(datas[6].examTime) + '</a>');
							break;
						default:
							$('.biaochi').append('<a style="margin-left:22px;" val="0" href="javascript:;">' + formatTimeM(datas[0].examTime) + '</a><a style="margin-left:42px;" val="1" href="javascript:;">' + formatTimeM(datas[1].examTime) + '</a><a style="margin-left: 40px;" val="2" href="javascript:;">' + formatTimeM(datas[2].examTime) + '</a><a style="margin-left: 40px;" val="3" href="javascript:;">' + formatTimeM(datas[3].examTime) + '</a><a style="margin-left: 40px;" val="4" href="javascript:;">' + formatTimeM(datas[4].examTime) + '</a><a style="margin-left: 42px;" val="5" href="javascript:;">' + formatTimeM(datas[5].examTime) + '</a><a class="ser" val="6" style="margin-left: 38px;" href="javascript:;">' + formatTimeM(datas[6].examTime) + '</a>');
							break;
					}
					// var timeList = "";
					// $('#examchoosetime').html('');
					// $.each(datas, function(i,e){
					// 	if(i<7){
					// 		timeList += "<option value=\"" + e.id + "\">"+formatTime(e.examTime)+"</option>"
					// 	}
					// });
					// $('#examchoosetime').append(timeList);
					$('.biaochi a').on('click', function() {
						$(this).addClass('ser').siblings().removeClass('ser');
						var i = $(this).attr('val');
						$('#examchoosetime').val(datas[i].id);
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
						addtype('最大心率', datas[i].maxBloodPressure);	
						addtype('最小心率', datas[i].minBloodPressure);	
						addtype('静息心率', datas[i].restingHeartRate);						
						addtype('蛋白质', datas[i].protein);						
						addtype('内脏脂肪', datas[i].infat);						
						addtype('皮下脂肪', datas[i].subFat);						
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
						$('.titcolor').text(formatTime(datas[i].examTime));
						$('.titcolorred').text(datas[i].score.toFixed(1));
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
					$('#dlgoney').dialog('open').dialog('setTitle',	"&nbsp;&nbsp;&nbsp;&nbsp;体测详情&nbsp;&nbsp;&nbsp;&nbsp;");
				}
			},
			complete: function() {
				msgLoading('close');
			}
		})
		choosetime(row, 'week');
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
	}

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

function choosetime(row, week) {
	chserls(week);
	$.ajax({
		type: 'post',
		url: '../gym/userAction!getSportData.zk?userId=' + row.userId + '&dataType=' + week,
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
							url: '../gym/userAction!getSportData.zk?userId=' + row.userId + '&dataType=week',
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
						url: '../gym/userAction!getSportData.zk?userId=' + row.userId + '&dataType=month',
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
							url: '../gym/userAction!getSportData.zk?userId=' + row.userId + '&dataType=year',
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

function addtype(word, value) {
	var vle = parseFloat(value).toFixed(1);
	if (value) {
		$('#typeconsr').append('<div class="cons"><div class="consl">' + word + '：</div><div class="consr">' + vle + '</div></div>')
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

function measurement(index) {
	// var record = $('#dg').datagrid('selectRow', index);
	var data = $('#dg').datagrid('getSelected');
	if (!data) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择客户！');
		return;
	}
	$('.biad input[type=text],#cover').val("");
	$('#messageName').val(data.nickName);
	// $('#messageSex').combobox('setValue', data.sex);
	var newdate = new Date();
	$('#imghead').attr('src','images/regist_pic.png');
	// $('#userAge').val(newdate.getFullYear() - data.birthYear);
	$('#userHeight').val(data.height);
	$('#userWeight').val(data.weight);
	$('#userAge').val(formatAge(data.birthYear));
	$('#dlgEditMessage').dialog('open');
	$('#userID').val(data.userId);
	$('#userSex').val(data.sex);
	/*$('#infat').val(data.visFat);
	$('#bodyWater').val(data.bodyWater);
	$('#muscle').val(data.muscle);
	$('#mineral').val(data.mineral);
	$('#fatWeight').val(data.fatWeight);*/
	// $('#fatNumber').val(data.fatNumber);
	// $('#nofatWeight').val(data.nofatWeight);
	// $('#fatMineral').val(data.fatMineral);
	// $('#waistHip').val(data.waistHip);
	// $('#boneAge').val(data.boneAge);
	// $('#textAreaBoxPin').val(data.evaluation);
	var userbmi = parseFloat(bmiSouce(data.weight, data.height));
	bmiinfo(userbmi);

}
$('#userHeight').keyup(function() {
	var heiv = $(this).val();
	var weiv = $('#userWeight').val();
	var bmi = bmiSouce(heiv, weiv);
	bmiinfo(bmi);
})
$('#userWeight').keyup(function() {
	var heiv = $(this).val();
	var weiv = $('#userHeight').val();
	var bmi = bmiSouce(heiv, weiv);
	bmiinfo(bmi);
})

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
var bmiSouce = function(w, h) {
	var hei = h / 100;
	return (w / (hei * hei)).toFixed(1);
}
var baseFat = function(w, h, sex, age) {
	var gender = 0
	if (sex == "F") {
		return (1.2 * bmiSouce(w, h) + 0.23 * age - 10.8 * gender - 5.4).toFixed(0);
	} else if (sex == "M") {
		gender = 1;
		return (1.2 * bmiSouce(w, h) + 0.23 * age - 10.8 * gender - 5.4).toFixed(0);
	}
}
var countPen = function(bmi) {
	var _bmi = bmi,
		_score = null,
		_stars = null;
	//综合得分    
	var standardBMIValue = 22;
	var offsetBMI = _bmi - standardBMIValue; //standardBMIValue为标准BMI
	if (offsetBMI < 0) offsetBMI = -offsetBMI;

	_stars = 5.0 - 5.0 * (offsetBMI / standardBMIValue); //bmi以standardBMIValue为标准 stars = 5 - 5*(|bmi - standardBMIValue|/standardBMIValue)
	if (_bmi < 0 || _bmi > standardBMIValue * 2) {
		_stars = 0.1;
	}
	return _score = ((_stars / 5.0) * 100).toFixed(1);
}

function testNums(data, string) {
	var reg = /^[1-9]\d*([.][1-9])?$/;
	if (data.length > 0) {
		if (!reg.test(data)) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '' + string + '为"正数"且小数位只能有一位！');
			return false;
		}
	}
}
var database = [];

function saveMessage() {
	var userId = $('#userID').val();
	//    var datas = $('#startDate_1').datebox({
	//                    onSelect: function(date) {
	//                    var dates = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ' 00:00:00';
	//                    return dates;
	//	               }
	//                });
	var datas = $('#startDate_1').val();
	// var mans = $('#payMaker').combobox('getValue');
	// var mansText = $('#payMaker').combobox('getText');
	// var testName = $('#messageName').val().trim();
	// var userSex = $('#messageSex').combobox('getValue');
	// var age = $('#userAge').val().trim();
	var userHeight = $('#userHeight').val().trim();
	var userWeight = $('#userWeight').val().trim();
	// var userbmi = bmiSouce(userWeight, userHeight);
	var age = $('#userAge').val();
	var userSex = $('#userSex').val();
	var messageFat = Math.abs(baseFat(userWeight, userHeight, userSex, age));
	// var messageHR = $('#messageHR').val().trim();
	// var messageMaxHR = $('#messageMaxHR').val().trim();
	// var messageFVC = $('#messageFVC').val().trim();
	var caloriesInput = (userHeight - 105) * 25;
	var caloriesOutput = ((14.7 * userWeight + 496) * 1.56).toFixed(0);
	// var score = countPen(userbmi);
	var caloriesBase = (0.0061 * userHeight + 0.0128 * userWeight - 0.1603) * 35.1 * 16; //http://zhidao.baidu.com/question/1302888962463897499.html?qbl=relate_question_1&word=%C8%CB%CC%E5%C8%D5%B3%A3%B4%FA%D0%BB
	var warning = '无';
	var visFat = $('#visFat').val().trim();
	var bodyWater = $('#bodyWater').val().trim();
	var muscle = $('#muscle').val().trim();
	var mineral = $('#mineral').val().trim();
	var fat = $('#fatWeight').val().trim();
	// var fatNumber = $('#fatNumber').val().trim();
	// var nofatWeight = $('#nofatWeight').val().trim();
	// var fatMineral = $('#fatMineral').val().trim();
	var waistHip = $('#waistHip').val().trim();
	// var boneAge = $('#boneAge').val().trim();
	var protein = $('#protein').val().trim();
	var restingHeartRate = $('#restingHeartRate').val().trim();
	/*var vitalCapacity = $('#vitalCapacity').val().trim();
	var bloodPressure = $('#bloodPressure').val().trim();*/
	// var bodyAge = $('#bodyAge').val().trim();
	var subFat = $('#subFat').val().trim();
	var maxBloodPress = $('#maxBloodPress').val().trim();
	var minBloodPress = $('#minBloodPress').val().trim();
	var image = $("#cover").val()
		/*var ggz = $('#ggz').val().trim();
		var ggt = $('#ggt').val().trim();
		var zfg = $('#zfg').val().trim();*/
	var reg = /^[1-9]\d*([.][1-9])?$/;
	var doublereg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
	var regs = /^[0-9]\d*$/;
	if (userId.trim().length > 0) {

		//        if(mans == ''){
		//            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '未选择"教练"！'); 
		//            return false;
		//        }else{
		//            $('#showJiao').text(mansText);
		//        }
		// if (testName.length <= 0) {
		// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请填写"姓名"！');
		// 	return false;
		// } else if (testName.length > 10) {
		// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"姓名"不得超过10个字符！');
		// 	return false;
		// }
		// if (userSex == '') {
		// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '未选择"性别"！');
		// 	return false;
		// }
		// if (age.trim().length <= 0 || !regs.test(age) || age.trim() > 100) {
		// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请填写"年龄"且为"正整数"不得超过100！');
		// 	return false;
		// } else {
		// 	$('#showAge').text(age)
		// }
		if (userHeight.length <= 0 || !reg.test(userHeight) || userHeight > 300) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请填写"身高"且为"正数"数值小于300,小数位只能有一位！！');
			return false;
		}
		// else {
		// 	$('#showHeight').text(userHeight + 'cm');
		// 	$('#showHeightOney').text(userHeight + 'cm');
		// }
		if (userWeight.length <= 0 || !reg.test(userWeight) || userWeight > 300) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请填写"体重"且为"正数"数值小于300,小数位只能有一位！');
			return false;
		}
		// else {
		// 	$('#showWeight').text(userWeight + 'kg');
		// 	$('#showWeightOney').text(userWeight + 'kg');
		// }
		if (visFat.length > 0) {
			if (!regs.test(Number(visFat))) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"内脏脂肪"为"正整数"！');
				return false;
			}
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"内脏脂肪"不能为空!');
			return false;
		}
		if (bodyWater.length > 0) {
			if (!doublereg.test(bodyWater)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"体水分率"为"正数"且小数位最多只能有两位！');
				return false;
			}
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"体水分率"不能为空!');
			return false;
		}
		if (muscle.length > 0) {
			if (!doublereg.test(muscle)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"肌肉率"为"正数"且小数位最多只能有两位！');
				return false;
			}
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"肌肉率"不能为空!');
			return false;
		}
		if (fat.length > 0) {
			if (!doublereg.test(fat)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"脂肪"为"正数"且小数位最多只能有两位！');
				return false;
			}
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"脂肪"不能为空!');
			return false;
		}
		if (protein.length > 0) {
			if (!doublereg.test(protein)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"蛋白质"为"正数"且小数位最多只能有两位！');
				return false;
			}
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"蛋白质"不能为空!');
			return false;
		}
		if (mineral.length > 0) {
			if (!doublereg.test(mineral)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"骨量"为"正数"且小数位最多只能有两位！');
				return false;
			}
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"骨量"不能为空!');
			return false;
		}
		/*	if (fatWeight.length > 0) {
				if (!doublereg.test(fatWeight)) {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"脂肪体重"为"正数"且小数位最多只能有两位！');
					return false;
				}
			}*/
		/*if (fatNumber.length > 0) {
			if (!doublereg.test(fatNumber)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"脂肪指数"为"正数"且小数位最多只能有两位！');
				return false;
			}
		}*/
		/*if (nofatWeight.length > 0) {
			if (!doublereg.test(nofatWeight)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"去脂体重"为"正数"且小数位最多只能有两位！');
				return false;
			}
		}*/
		/*if (fatMineral.length > 0) {
			if (!doublereg.test(fatMineral)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"全身脂肌比"为"正数"且小数位只能有两位！');
				return false;
			}
		}*/
		if (restingHeartRate.length > 0) {
			if (!doublereg.test(restingHeartRate)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '静态心率数值为数字类型！');
				return false;
			}
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '静态心率不能为空!');
			return false;
		}
		if (waistHip.length > 0) {
			if (!doublereg.test(waistHip)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"腰臀比"为"正数"且小数位只能有两位！');
				return false;
			}
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"腰臀比"不能为空!');
			return false;
		}

		if (subFat.length > 0) {
			if (!doublereg.test(subFat)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"皮下脂肪"为"正数"且小数位只能有两位！');
				return false;
			}
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '皮下脂肪不能为空!');
			return false;
		}

		if (maxBloodPress.length <= 0 || !regs.test(maxBloodPress)) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请填写"收缩压"且为"正整数"!');
			return false;
		}
		if (minBloodPress.length <= 0 || !regs.test(minBloodPress)) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请填写"舒张压"且为"正整数"!');
			return false;
		}
		/*if (vitalCapacity.length > 0) {
			if (!doublereg.test(vitalCapacity)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '肺活量数值为数字类型！');
				return false;
			}
		}
		if (bloodPressure.length > 0) {
			if (!doublereg.test(bloodPressure)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '血压数值为数字类型！');
				return false;
			}
		}*/
		/*if (bodyAge.length > 0) {
			if (!doublereg.test(bodyAge)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '血压数值为数字类型！');
				return false;
			}
		}
		if (ggz.length > 0) {
			if (!doublereg.test(ggz)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '高血脂数值为数字类型！');
				return false;
			}
		}		
		if (ggt.length > 0) {
			if (!doublereg.test(ggt)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '脂肪肝数值为数字类型！');
				return false;
			}
		}
		if (zfg.length > 0) {
			if (!doublereg.test(zfg)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '高血压数值为数字类型！');
				return false;
			}
		}
		var healthRisk=[];
		healthRisk.push({"ggz":ggz,"ggt":ggt,"zfg":zfg});
		var bingtong = JSON.stringify(healthRisk); */
		/*if (boneAge.length > 0) {
			if (!regs.test(boneAge)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"骨骼年龄"为"正整数"！');
				return false;
			}
		}*/
		/*var evaluation = $('.textAreaBoxPin').val().trim(),
		explain = $('.textAreaBoxTer').val().trim(),
		explainte = $('.textAreaBoxTerite').val().trim(),
		suggest = [];
		if(evaluation.length <= 0){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '体测评价不得为空！');
			return false;
		}
		if(evaluation.length > 200){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '体测评价不得超过200个字符!');
			return false;
		}
		if(explain.length <= 0){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '运动建议不得为空！');
			return false;
		}
		if(explain.length > 200){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '运动建议不得超过200个字符!');
			return false;
		}*/
		// if(explainte.length <= 0){
		// 	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '特别备注不得为空！');
		// 	return false;
		// }
		/*if(explainte.length > 200){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '特别备注不得超过200个字符!');
			return false;
		}
		var s = '';
		for (var i = 0; i < $('.onlySuggest input:radio').length; i++) {
			if ($($('.onlySuggest input:radio')[i]).attr('checked')) {
				s = s + $($('.onlySuggest input:radio')[i]).val();
			}
		}*/
		// for (var i = 0; i < $('#onlySuggest2 input:radio').length; i++) {
		// 	if ($($('#onlySuggest2 input:radio')[i]).attr('checked')) {
		// 		s = s + $($('#onlySuggest2 input:radio')[i]).val();
		// 	}
		// }
		/*if (s == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '必须选择体重控制建议！');
			return false;
		}*/
		if (datas == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '未选择"日期"！');
			return false;
		}
		if (image == "") {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请上传图片！');
			return false;
		}
		// messageFat ? $('#showFat').text(messageFat + '%') : $('#showFat').text('暂无数据');
		// fat ? $('#showFatOney').text(fat + '%') : $('#showFat').text('暂无数据');
		// userbmi ? $('#showBMI').text(userbmi) : $('#showBMI').text('暂无数据');
		// userbmi ? $('#showBMIOney').text(userbmi) : $('#showBMI').text('暂无数据');

		//        if(messageHR.length>0 && !reg.test(messageHR)){
		//            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"静息心率"为"正数字"不超过3位！'); 
		//            return false;
		//        }else{
		//            messageHR? $('#showHeart').text(messageHR) : $('#showHeart').text('暂无数据');
		//            messageHR? $('#showHeartOney').text(messageHR) : $('#showHeart').text('暂无数据');
		//        }
		//        if(messageMaxHR.length>0 && !reg.test(messageMaxHR)){
		//            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"最大心率"为"正数字"不超过3位！'); 
		//            return false;
		//        }else{
		//            messageMaxHR?  $('#showMaxHeart').text(messageMaxHR) : $('#showMaxHeart').text('暂无数据');
		//            messageMaxHR?  $('#showMaxHeartOney').text(messageMaxHR) : $('#showMaxHeart').text('暂无数据');
		//        }
		//        if(messageFVC.length > 0 && !reg.test(messageFVC)){
		//            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '"肺活量"为"正数字"！'); 
		//            return false;
		//        }else{
		//            messageFVC? $('#showFVC').text(messageFVC) : $('#showFVC').text('暂无数据'); 
		//            messageFVC? $('#showFVCOney').text(messageFVC) : $('#showFVC').text('暂无数据'); 
		//        }

		database = {
			userId: userId,
			examTime: datas,
			//             gmtExam: datas,
			//             coachId: mans,
			// name: testName,
			sex: userSex,
			// age: age,
			height: userHeight,
			weight: userWeight,
			// bmi: userbmi,
			fat: fat,
			subFat: subFat,
			//               heart: messageHR,
			//            maxHeart: messageMaxHR,
			//			capacity: messageFVC,
			caloriesInput: caloriesInput,
			caloriesOutput: caloriesOutput,
			// score: score,
			caloriesBase: caloriesBase,
			infat: visFat,
			bodyWater: bodyWater,
			muscle: muscle,
			bone: mineral,
			// fatWeight: fatWeight,
			// fatNumber: fatNumber,
			// nofatWeight: nofatWeight,
			protein: protein,
			restingHeartRate: restingHeartRate,
			/*vitalCapacity: vitalCapacity,
			bloodPressure: bloodPressure,*/
			// bodyAge: bodyAge,
			bodyLevel: $('#bodyLevel').val(),
			// fatMineral: fatMineral,
			whr: waistHip,
			maxBloodPressure: maxBloodPress,
			minBloodPressure: minBloodPress,
			// boneAge: boneAge,
			/*evaluation:evaluation,
			warning:explain,
			sportSuggest: explainte,
			suggest:s,*/
			// healthRisk: bingtong,
			image: image
		}
		$.ajax({
			type: 'post',
			url: '../ngym/GymBodyExamAction!add.zk',
			data: database,
			beforeSend: function() {
				$('#btnc').text('保存中...');
				msgLoading();
			},
			success: function(data) {
				var datar = $.parseJSON(data);
				if (datar.STATUS == true) {
					// $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '提交成功！');
					$('#dlgEditMessage').dialog('close');
					$('#dg').datagrid('reload');
				} else {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '服务器响应失败！请重新提交');
					$(this).show();
				}
			},
			complete: function() {
				msgLoading('close');
				$('#btnc').text('保存');
			},
			error: function() {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '提交失败！');
				$(this).hide();
			}
		})
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '非正常操作！');
	}
}

function diffValue(e1, e2, d1, d2, s) {
	$(e1).text(d2 + s);
	var n = d1 - d2;
	if (hasDot(n)) {
		n = n.toFixed(1);
	}
	if (n > 0) {
		n = '+' + n
	}
	$(e2).text(n + s);
}
//判断是否为小数
function hasDot(num) {
	if (!isNaN(num)) {
		return ((num + '').indexOf('.') != -1) ? true : false;
	}
}
//计算天数差的函数，通用  
function DateDiff(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式  
	var aDate, oDate1, oDate2, iDays;
	aDate = sDate1.split("-")
	oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2006格式  
	aDate = sDate2.split("-")
	oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
	iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数  
	return iDays;
}


var cancelMessage = function() {
	$('#dlgSeeOnlyMessage').dialog('close');
	$('#dlgSeeMessage').dialog('close');
}

// 客户状态
function formatStatus(value) {
	if (value) {
		if (value == 'true') {
			return '有效';
		} else {
			return '无效';
		}
	} else {
		return '未开卡';
	}
}

function formatSex(value) {
	if (value) {
		if (value == 'F') {
			return '女';
		} else if (value == 'M') {
			return '男';
		}
	} else {
		return '无'
	}
}

function formatAge(value) {
	var date = new Date();
	return date.getFullYear() - value;
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

function formatBmibody(value, index) {
	var bmi = (index.weight / ((index.height / 100) * (index.height / 100))).toFixed(1);
	// console.log(index.weight, index.height, bmi)
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