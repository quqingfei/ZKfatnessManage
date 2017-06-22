//var setInt = self.setInterval("isOk()",300);
function localTime() {
	//setTimeout('localTime()',50);
}

function loginTimeout() {
	window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
	$('body').css('height', $(window).height()); //设置body的高度
	$('body').css('width', $(window).width());
	var height1 = $(window).height();
	var width1 = $(window).width();
	$('#center-region').css({
		'width': width1
	});
	$('#showMessage').css({
		'width': '100%',
		'height': $(window).height()
	});
	if (parseInt($('#showMessage').css('width')) > 660) $('#filter').css({
		'padding-left': parseInt($('#showMessage').css('width')) - 660
	});
	$(window).resize(function() {
		$('body').css('height', $(window).height()); //设置body的高度
		$('body').css('width', $(window).width());
		var height0 = $(window).height();
		var width0 = $(window).width();
		$('#center-region').css({
			'width': width0
		});
		$('#showMessage').css({
			'width': '100%',
			'height': height0
		});
		$('.datagrid-view2').css({
			'width': '100%'
		});
		$('.datagrid-view2').children('.datagrid-header').children('.datagrid-header-inner').children('.datagrid-htable').children('tbody').children('.datagrid-header-row').css({
			'width': parseInt($('#showMessage').css('width')) - 30
		});
		if (parseInt($('#showMessage').css('width')) > 660) $('#filter').css({
			'padding-left': parseInt($('#showMessage').css('width')) - 660
		});
	});
	$('#hideDiv').hide();
	$('#dg').datagrid({
		onLoadSuccess: function(data) {
			if (data.total == 0 && data.ERROR == '未登录') {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!', 'error');
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

			//图片弹出层
			$("a.popImage").fancybox({
				'margin': 100,
				'autoScale': false,
				'autoDimensions': false,
				'imageScale': false,
				'openEffect': 'elastic',
				'closeEffect': 'elastic'
			});
		},
		onLoadError: function() {
			//alert('出错啦');
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
	});
	$("#memberCard").combobox('unselect', '');
	$("#memberCard").combobox('setText', '全部');
});
$('#zktype').change(function(){
	var types = $(this).val();
	if(types==0){
		$('#btnc').attr('data-split',0);
		$('.teamone').hide();
		$('.team').show();
	}else{
		$('#btnc').attr('data-split',1);
		$('.team').hide();
		$('.teamone').show();
	}
})

function zhiding(){
	var row = $('#dg').datagrid('getSelected');
	if(row){
		var i = "y";
		if(formatZhiding(row.weight)=="已置顶"){
			i = "n"
		}
		$.ajax({
			type:'post',
			url: '../ngym/GymCourseAction!isTop.zk',
			data: {courseId: row.id,isTop:i},
			dataType: 'json',
			success: function(data){
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
				$('#dg').datagrid('reload');
			}
		})
	}else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要置顶或取消置顶的课程!');
	}
}
function formatZhiding(value){
	if(value){
		if(value == 100){
			return "已置顶"
		}else{
			return "未置顶"
		}
	}else{
		return "未置顶"
	}
}
function editMemberCard() {
	var row = $('#dg').datagrid('getSelected');
	$('#zktype').attr('disabled',true);
	$('.biad input').val("");
	$('#coure input[name="coure"]').eq(0).val('y');
	$('#coure input[name="coure"]').eq(1).val('n');
 	$('#imghead,#imghead1').attr('src','images/regist_pic.png');
 	$('#zkteach').html("");
 	$('#oneteach').html("");
 	$('#seeurl').val('1');
 	getteachs();
	if (row) {
		$('#dlg').dialog('open').dialog('setTitle', '&nbsp;&nbsp;编辑课程');
		if(row.type == 0){
			$('#btnc').attr('data-split',0);
			$('.team').show();
			$('.teamone').hide();	
			$('#zkid').val(row.id);		
			$('#zkcourse').val(row.name);
			$('#zktype').val(row.type).css("backgroundColor","#ccc");
			$('#imghead').attr('src','../file/FileCenter!showImage2.zk?name='+row.image);
			$('#cover').val(row.image);
			$('#imghead1').attr('src','../file/FileCenter!showImage2.zk?name='+row.courseIntroduce);
			$('#cover1').val(row.courseIntroduce);
			$('#zkonce').val(row.count);
			$('#zkchoose').val(row.time);
			$('#zkstar').val(row.level);
			$('#zkmin').val(row.minPerson);
			$('#zkmax').val(row.maxPerson);
			var coachInfo = strToJson(row.coachInfo);
			var isn = setInterval(function(){
				if ($('#zkteach .serviceCheck').length>0) {
					$.each(coachInfo, function(i,x){
						$('#zkteach .serviceCheck').each(function(){
							var item = $(this).find('.checkItemEdit3');
							if(x.id == item.attr('data-val')){
								item.attr('data-tre','1');
								item.html('<img src="images/checked.png" alt="">');
								$(this).find('input').val(x.price);
							}					
						})
					})
					clearInterval(isn);
				}
			},100);
			var zui = row.trainCycle.replace("M","");
			$('#zklong').val(zui);
			var s = (new Date( new Date(row.orderDeadTime).getTime()-row.gmtCreate )/1000/3600).toFixed(0);
			// $('#zktime').val(s);
			var e =( ( new Date(row.deadTime) - new Date(row.orderDeadTime) ) / 86400000/30).toFixed(0) ;
			$('#zkhavetime').val(e);
			if(row.isHot=='y'){				
				$('#coure input[name="coure"]').eq(0).attr('checked',true);
			}else{
				$('#coure input[name="coure"]').eq(1).attr('checked',true);
			}
		}else{
			$('#btnc').attr('data-split',1);
			$('.team').hide();
			$('.teamone').show();
			$('#zkid').val(row.id);		
			$('#zkcourse').val(row.name);
			$('#zktype').val(row.type).css("backgroundColor","#ccc");
			var e =( ( new Date(row.deadTime) - new Date(row.orderDeadTime) ) / 86400000/30).toFixed(0) ;
			$('#zkhavetime').val(e);
			$('#onechoose').val(row.time);
			var coachInfo = strToJson(row.coachInfo);
			var isn = setInterval(function(){
				if ($('#oneteach .serviceCheck').length>0) {
					$.each(coachInfo, function(i,x){
						$('#oneteach .serviceCheck').each(function(){
							var item = $(this).find('.checkItemEdit3');
							if(x.id == item.attr('data-val')){
								item.attr('data-tre','1');
								item.html('<img src="images/checked.png" alt="">');
								$(this).find('input').val(x.price);
							}					
						})
					})
					clearInterval(isn);
				}
			},100)
			var s = (new Date( new Date(row.orderDeadTime).getTime()-row.gmtCreate )/1000/3600).toFixed(0);
			// $('#onetime').val(s);
			var e =( ( new Date(row.deadTime) - new Date(row.orderDeadTime) ) / 86400000/30).toFixed(0) ;
			$('#zkhas').val(e);
		}
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要编辑的课程!');
	}

}
//符串解析
function strToJson(str){ 
	var json = eval('(' + str + ')');
	return json; 
} 
 function newMemberCard(){
 	$('#seeurl').val('0');
 	$('.biad input[type=text], input[type=hidden], textarea').val("");
 	$('#imghead,#imghead1').attr('src','images/regist_pic.png');
 	$('#zkteach').html("");
 	$('#oneteach').html("");
 	$('#zktype').attr('disabled',false).css("backgroundColor","#fff");
 	$('#dlg').dialog('open').dialog('setTitle', '&nbsp;&nbsp;添加课程');
 	getteachs();
 }
function chooseImage(id) {
	document.getElementById(id).click();
}
//上传图片
function uploadImage() {
	var viewFiles = document.getElementById("file_title_img");
	//是否为图片类型            
	if (/image\/\w+/.test(viewFiles.files[0].type)) {
		//最大图片文件大小 500KB
		var imgSizeLimit = 5000 * 1024;
		if (viewFiles.files[0].size <= imgSizeLimit) {
			//上传图片
			msgLoading();
			$("#title_img_form")
				.ajaxSubmit({
					type: 'post',
					url: '../file/FileCenter!uploadImage2.zk',
					success: function(data) {
						msgLoading('close');
						data = $.parseJSON(data);
						if (data.name) {
							var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
							$("#imghead").attr("src", imgURL);
							$("#cover").val(data.name);
						} else {
							//alert("上传图片出错！");
							$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上传图片出错！');
						}
						$("#title_img_form").resetForm();
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
//上传图片
function uploadImage1() {
	var viewFiles = document.getElementById("file_title_img1");
	//是否为图片类型            
	if (/image\/\w+/.test(viewFiles.files[0].type)) {
		//最大图片文件大小 500KB
		var imgSizeLimit = 5000 * 1024;
		if (viewFiles.files[0].size <= imgSizeLimit) {
			//上传图片
			msgLoading();
			$("#title_img_form1")
				.ajaxSubmit({
					type: 'post',
					url: '../file/FileCenter!uploadImage2.zk',
					success: function(data) {
						msgLoading('close');
						data = $.parseJSON(data);
						if (data.name) {
							var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
							$("#imghead1").attr("src", imgURL);
							$("#cover1").val(data.name);
						} else {
							//alert("上传图片出错！");
							$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上传图片出错！');
						}
						$("#title_img_form1").resetForm();
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
function destroyMemberCard() {
	var row = $('#dg').datagrid('getSelected');
	if (row) {
		$.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;删除确认', '确认删除' + row.name + '吗？', function(r) {
			if (r) {
				$.getJSON('../ngym/GymCourseAction!deleteGroupCourse.zk', {
					courseId: row.id
				}, function(data) {
					if (data.STATUS) {
						$.messager.show({
							title: "&nbsp;&nbsp;消息",
							timeout: 2000,
							msg: "删除成功!"
						});
						$('#dg').datagrid('reload');
					} else {
						if ('未登录' == data.ERROR) {
							loginTimeout();
							return;
						}
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
					}
				});
			}
		});
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择会员卡!');
	}
}

function saveMessage() {
	var thisval = $('#btnc').attr('data-split');
	var zktype = bijiao('#zktype');
	var zkhavetime = bijiao('#zkhavetime');
	var url = '';
	if($('#seeurl').val()==0){
		url = '../ngym/GymCourseAction!add.zk';
	}else{
		url = '../ngym/GymCourseAction!update.zk';
	}
	var regmoney = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
	var reg = /^[1-9]\d*$/;
	if(thisval==0){
		var checkarr = [];
		if(bijiao('#zkcourse')==""){
			alerts('课程名称不能呢为空！');
			return false;
		}
		// if(bijiao('#zkcourse').length>10){
		// 	alerts('课程名称不得大于10个字符！');
		// 	return false;
		// }
		if(bijiao('#cover')==""){
			alerts('课程封面不能为空！');
			return false;
		}
		if(bijiao('#zkonce')==""){
			alerts('课程次数不能呢为空！');
			return false;
		}
		if(!reg.test(bijiao('#zkonce'))){
			alerts('您输入课程次数有误，请输入正整数。');
			return false;
		}
		if(bijiao('#zkmin')==""){
			alerts('最少开课人数不能为空！');
			return false;
		}
		if(!reg.test(bijiao('#zkmin'))){
			alerts('您输入最少开课人数有误，请输入正整数。');
			return false;
		}
		if(bijiao('#zkmax')==""){
			alerts('最多开课人数不能为空！');
			return false;
		}
		if(!reg.test(bijiao('#zkmax'))){
			alerts('您输入最多开课人数有误，请输入正整数。');
			return false;
		}
		if(bijiao('#zkmax')<bijiao('#zkmin')){
			alerts('您输入最少开课人数不得大于最多开课人数有误。');
			return false;
		}
		$('#zkteach .serviceCheck').each(function(){
			var checkthis = $(this).find('.checkItemEdit3').attr('data-tre');
			var name = $(this).find('.zknams').text();
			var money = $(this).find('input').val().trim();
			if(checkthis=="1"){
				checkarr.push(checkthis);
				if(money == ""){
					alerts(name+'的课时费不得为空。');
					return false;
				}
				if(!regmoney.test(money)){
					alerts('您输入'+name+'的课时费有误，请输入正数字且最多两位小数。');
					return false;
				}
				
			}		
			
		});
		if(checkarr.length<=0){
			alerts('请选择教练!');
			return false;
		}
		/*if(bijiao('#zktime')==""){
			alerts('预约截止时间不能为空！');
			return false;
		}*/
		/*if(!reg.test(bijiao('#zktime'))){
			alerts('预约截止时间填写有误，请填写正整数！');
			return false;
		}*/
		if(bijiao('#cover1') == ""){
			alerts('课程介绍不得为空！');
			return false;
		}
		// var scour = bijiao('#zktime');
		var teachs = [];
		$('#zkteach .serviceCheck').each(function(){
			var item = $(this);
			var snv = item.find('.checkItemEdit3');
			var sname = item.find('.zknams');
			var sinput = item.find('input');
			if(snv.attr('data-tre')==1){
				teachs.push({id:snv.attr('data-val'),name:sname.text(),price:sinput.val()})
			}
		})
		var datas = {
			id: $('#zkid').val(),
			type:0,
			name:bijiao('#zkcourse'),
			// gymId: '发布课程的健身房ID',
			trainCycle: bijiao('#zklong')+"M",
			image: bijiao('#cover'),
			count: bijiao('#zkonce'),
			time: bijiao('#zkchoose'),
			level: bijiao('#zkstar'),
			minPerson: bijiao('#zkmin'),
			maxPerson: bijiao('#zkmax'),
			coachInfo: JSON.stringify(teachs),
			deadTime: bijiao('#zkhavetime'),
			// orderDeadTime: scour,
			courseIntroduce: bijiao('#cover1'),
			isHot: $('#coure input[name="coure"]:checked').val(),
			trainLevel: $('#zkelevel').val()
		}
		$.ajax({
			type:'post',
			data: datas,
			dataType: 'json',
			url: url,
			beforeSend: function(){
				msgLoading();
			},
			success: function(data){
				if(data.STATUS){
					console.log('添加成功!');					
					$('#dg').datagrid('reload');
					$('#dlg').dialog('close');					
				}else{
					alerts(data.INFO);
				}
			},
			beforeSend: function(){
				msgLoading('close');
			},
			error: function(err){
				console.log(err);
			}
			
		})
	}else{
		var checkarrone = [];
		if(bijiao('#zkcourse')==""){
			alerts('课程名称不能呢为空！');
			return false;
		}
		$('#oneteach .serviceCheck').each(function(){
			var checkthis = $(this).find('.checkItemEdit3').attr('data-tre');
			var name = $(this).find('.zknams').text();
			var money = $(this).find('input').val().trim();
			if(checkthis=="1"){
				checkarrone.push(checkthis);
				if(money == ""){
					alerts(name+'的课时费不得为空');
					return false;
				}
				if(!regmoney.test(money)){
					alerts('您输入'+name+'的课时费有误，请输入正数字且最多两位小数。');
					return false;
				}
				
			}		
			
		});
		if(checkarrone.length<=0){
			alerts('请选择教练!');
			return false;
		}
	/*	if(bijiao('#onetime')==""){
			alerts('预约截止时间不能为空！');
			return false;
		}*/
		/*if(!reg.test(bijiao('#onetime'))){
			alerts('预约截止时间为正整数！');
			return false;
		}*/
		// var scour = bijiao('#onetime');
		var teachs = [];
		$('#oneteach .serviceCheck').each(function(){
			var item = $(this);
			var snv = item.find('.checkItemEdit3');
			var sname = item.find('.zknams');
			var sinput = item.find('input');
			if(snv.attr('data-tre')==1){
				teachs.push({id:snv.attr('data-val'),name:sname.text(),price:sinput.val()})
			}
		})
		var datas = {
			id: $('#zkid').val(),
			name:bijiao('#zkcourse'),
			time: bijiao('#onechoose'),
			trainCycle:0+"M",
			type:1,
			coachInfo: JSON.stringify(teachs),
			deadTime: bijiao('#zkhas')
			// orderDeadTime: scour
		}
		$.ajax({
			type:'post',
			data: datas,
			dataType: 'json',
			url: url,
			beforeSend: function(){
				msgLoading();
			},
			success: function(data){
				if(data.STATUS){
					console.log('添加成功!');					
					$('#dg').datagrid('reload');
					$('#dlg').dialog('close');
				}else{
					alerts(data.INFO.split("name")[1]);
				}
			},
			beforeSend: function(){
				msgLoading('close');
			},
			error: function(err){
				console.log(err);
			}
		})
		
	}
}
function alerts(s){
	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', s);
}
function bijiao(e){
	return $(e).val().trim().length<=0? "":$(e).val().trim();
}

function getteachs(){
	$.ajax({
		type: 'post',
		url: '../ngym/GymCourseAction!listCoach.zk',
		dataType: 'json',
		success: function(data){
			console.log(data);
			var vData = [];
			if(data.total>0){				
				$.each(data.rows, function(i,x){
					vData.push(x.realName);
					$('#zkteach, #oneteach').append('<div style="display:none" class="serviceCheck"><div class="checkComb"><label class="checkItemEdit3" data-tre="0" data-val='+x.id+'></label></div><div class="zknams">'+x.realName+'</div><div style="margin-left:5px;"><input type="text" placeholder="填写课时金额">&nbsp;元</div></div>')
				})
				$('#searchNames').keyup(function(event) {
					var sFind = $(this).val();
					if (sFind == "") {
		                if($('#showlist').text().indexOf('显示')>=0){
		                	$('#zkteach>.serviceCheck').hide();
		                }else{
		                	$('#zkteach>.serviceCheck').show();
		                }
		            }
		            if (sFind != "") {
		                var nPos;
		                var vResult = [];
		                for (var s=0;s<vData.length;s++){
		                	var sTxt = vData[s] || '';
		                    nPos = sTxt.indexOf(sFind);
		                    if (nPos >= 0) {
		                        vResult[vResult.length] = sTxt;
		                    }
		                }
		               // alert(vResult);
		                $('#zkteach>.serviceCheck').each(function(index, el) {
		                	var item = $(el).find('.zknams').text();
		                	for(var i=0;i<vResult.length;i++){
			                    if(item == vResult[i]){
			                    	$(el).show().siblings().hide();
			                    }
			                }
		                });
		                
		            }
				});
				$('#searchOneNames').keyup(function(event) {
					var sFind = $(this).val();
					if (sFind == "") {
		                if($('#showOnelist').text().indexOf('显示')>=0){
		                	$('#oneteach>.serviceCheck').hide();
		                }else{
		                	$('#oneteach>.serviceCheck').show();
		                }
		            }
		            if (sFind != "") {
		                var nPos;
		                var vResult = [];
		                for (var s=0;s<vData.length;s++){
		                	var sTxt = vData[s] || '';
		                    nPos = sTxt.indexOf(sFind);
		                    if (nPos >= 0) {
		                        vResult[vResult.length] = sTxt;
		                    }
		                }
		               // alert(vResult);
		                $('#oneteach>.serviceCheck').each(function(index, el) {
		                	var item = $(el).find('.zknams').text();
		                	for(var i=0;i<vResult.length;i++){
			                    if(item == vResult[i]){
			                    	$(el).show().siblings().hide();
			                    }
			                }
		                });
		                
		            }
				});
				$('.checkItemEdit3').on('click', function(){
					var thistre = $(this).attr('data-tre');
					if(thistre=="0"){		
					 	$(this).html('<img src="images/checked.png" alt="">');
					 	$(this).attr('data-tre',1);
					}else{
					 	$(this).attr('data-tre',0);
						$(this).html('');
					}
				})	
			}
		}

	})
}
$('#showlist').click(function(event) {
	if($(this).attr('aie')==0){
		$('#zkteach>.serviceCheck').show();
		$(this).attr('aie',1);
		$(this).text('隐藏教练列表');
	}else{
		$('#zkteach>.serviceCheck').hide();
		$(this).attr('aie',0);
		$(this).text('显示教练列表');
	}
});
$('#showOnelist').click(function(event) {
	if($(this).attr('aie')==0){
		$('#oneteach>.serviceCheck').show();
		$(this).attr('aie',1);
		$(this).text('隐藏教练列表');
	}else{
		$('#oneteach>.serviceCheck').hide();
		$(this).attr('aie',0);
		$(this).text('显示教练列表');
	}
});
function si(){
	return "a";
}
function formatCoach(value, row){
	if(typeof (value) == 'undefined'){
		return '-';
	}
	var coachInfo = eval('(' + value + ')');
	var sname = '';
	$.each(coachInfo, function(i,x){
		sname = sname + x.name+",";
	});
	return sname.substring(0,sname.length-1);
}
function formatType(value, row){
	if (value==0) {
		return "社群课";
	}else{
		return "私教课";
	};
}
function formatAdd(value, row) {
	var unit;
	switch (row.unit) {
		case 'y':
			unit = '年';
			break;
		case 'M':
			unit = '月';
			break;
		case 'd':
			unit = '天';
			break;
		default:
			unit = '';
			break;
	}
	switch (row.type) {
		case 0:
			return value ? (value + unit) : '';
		case 1:
			return value ? (value + '次') : '';
		default:
			return '';
	}
}


function formatImage(value) {
	if (value == '' || !value)
		return '暂无图片';
	else {
		return "<a class=\"popImage\" href='../file/FileCenter!showImage2.zk?name=" + value + "'>" + "<img title='图片' style='width:30px;height:20px;margin:0 auto;display:block;cursor:pointer;' src='../file/FileCenter!showImage2.zk?name=" + value + "'/>" + "</a>";
	}
}
function formatZhouqi(value,row){
	if(value){
		var lastcart = value.substr(value.length-1,1);
		var forstcart = value.substring(0,value.length-1);
		if(value=="0M"){
			return "不限";
		}else if(lastcart=="M"){
			return forstcart+"个月";
		}else if(lastcart=="d"){
			return forstcart+"天";
		}
	}
	else {
		return "不限"
	}
}
function formatTime(value){
	return value+"分钟";
}
function formatEvele(value){
	if(value){		
		return "LV."+value;
	}else{
		return "不限"
	}
}
function formatsime(value){
	if(typeof (value) == 'undefined'){
		return '-';
	}
	return value.split(" ")[0];
}
function formatEva(value,row){
	if(row.maxPerson==1){
		return row.maxPerson+"人"
	}else{		
		return row.minPerson+"~"+row.maxPerson+"人";
	}
}
//用户筛选事件,自动搜索
$("#memberCard").combobox({
	// onUnselect: function(n, o) {
	// 	searchMemberCard();
	// 	$("#memberCard").clear();
	// },
	onSelect: function(rec) {
		searchMemberCard();
		var text = $("#memberCard").combobox('getText');
		$("#memberCard").combobox('unselect', $("#memberCard").combobox('getValue'));
		$("#memberCard").combobox('setText', text);
	}
});

function searchMemberCard() {
	var type = $("#memberCard").combobox("getValue");
	var name = $("#txt_word").searchbox("getValue");
	$("#dg").datagrid('reload', {
		name: name,
		type: type
	});
	$("#txt_word").searchbox("setValue", '');
}