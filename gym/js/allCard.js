	function loginTimeout() {
		window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
	}
	var cardSel = '';
	var hjSel, hjId;
	$(function() {
	/*	$('#dg').datagrid({
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
		});*/
		$.post('../ngym/GymMembersCardAction!list.zk', {
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
						"id": row.name,
						"duty": row.name
					};
					makers.push(maker);
				}
				makers.push({
					"id": '',
					"duty": '全部'
				});
				$('#cardSel').combobox({
					valueField: 'id',
					textField: 'duty',
					data: makers,
					onSelect: function(rec) {
						// cardSel = rec.duty;
						searchUser(curStatus);
					}
				});
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
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
		// $('#birthDate').combobox({
		// 	valueField: 'id',
		// 	textField: 'year',
		// 	data: years
		// });
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
					clearAddFrom();
					$('#userID').val(data.userId);
					$.messager.show({
						title: "消息",
						timeout: 1000,
						msg: "扫码成功!"
					});
					searchUser(curStatus);
					//searchUserById(data.userId,curStatus);
				} else {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码!');
				}
			}, 'json');
		});
		if (typeof(window.parent.curSeeUserId) == 'undefined') {
			$('#userID').val(window.parent.curSeeUserId);
			window.parent.curSeeUserId = '';
			//$('#allMember').trigger('click');
			$("#dg").datagrid({
				url: '../ngym/GymMembersAction!list.zk',
				queryParams: {
					userId: $('#userID').val(),
					orderByDesc:'gmtCreate'
				}
			});
			simulationClick('allMember', '');
		} else {
			//$('#isCard').trigger('click');
			$("#dg").datagrid({
				url: '../ngym/GymMembersAction!list.zk',
				queryParams: {
					type: 'effect',
					orderByDesc:'gmtCreate'
				}
			});
			simulationClick('isCard', 'effect');
		}
	});

	//标注
	var remarkUserId;
	var curRow; //当前行
	var remark = [];
	var curRowIndex;


	var curChooseId = '';

	function onOver(id) {
		if (curChooseId == '' || curChooseId != id) {
			$('#' + id).css({
				color: '#3fc371'
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
			color: '#3fc371'
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
			color: '#3fc371'
		});
		userTypeT = $('#' + id).attr("data-value");
		curChooseId = id;
		curStatus = value;
		$('#dg').datagrid('clearChecked');
	}
	$('#serchShop').keydown(function(e){
		if(e.keyCode==13){
			searchUser();
		}
	});
	//搜索
	function searchUser(value) {
		var data = {};
		var serchShop = $('#serchShop').val();
		var serchName = $('#serchName').val();
		var userID = $('#userID').val();
		var name = $('#nameSearch').val();
		var phone = $('#phoneSearch').val();
		var startDate = $('#startDate').val(); //Date.parse($('#startDate').val());
		var endDate = $('#endDate').val(); //Date.parse($('#endDate').val());
		var mark = $('#markSearch').val();
		var card = $('#cardSel').combobox('getValue');
		var startDatenum = parseInt(startDate.replace(/\-/g, "").replace(/\:/g, "").replace(/\ /g, ""));
		var endDatenum = parseInt(endDate.replace(/\-/g, "").replace(/\:/g, "").replace(/\ /g, ""));
		if (startDatenum > endDatenum) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '结束日期必须大于起始日期!');
			$('#startDate').val('');
			$('#endDate').val('');
			return false;
		}
		if (value && value != '')
			data.type = value;
		if (serchName && serchName != '')
			data.name = serchName;
		if (name && name != '')
			data.name = name;
		if (phone && phone != '')
			data.phone = phone;
		if (startDate != '' && endDate != ''){
			data.createStart = startDate + " 00:00:00";
			data.createEnd = endDate + " 23:59:59";
		}			
		// if (startDate == endDate && endDate != '')
		// 	data.createEnd = endDate + " 23:59:59";
		if (mark && mark != '')
			data.mark = mark;
		if (userID && userID != '')
			data.userId = userID;
		if (card && card != '')
			data.cardName = card;
		if(serchShop != "")
			data.salesPersonName = serchShop;
		$("#dg").datagrid('load', data);

	}

	function searchUserById(id, value) {
		var data = {};
		var userID = id;
		var name = $('#nameSearch').val();
		var phone = $('#phoneSearch').val();
		var startDate = $('#startDate').val(); //Date.parse($('#startDate').val());
		var endDate = $('#endDate').val(); //Date.parse($('#endDate').val());
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
	function formatLock(val,row){
		if(typeof(val) == 'undefined'){
				return "<a onclick='goLock(this,\"" + row.userId + "\")' onmouseenter='showLock(this)' onmouseout='recovery(this)'>未锁定</a>"
		}else{
			if(val == 'n'){
				return "<a onclick='goLock(this,\"" + row.userId + "\")' onmouseenter='showLock(this)' onmouseout='recovery(this)'>未锁定</a>"
			}else{
				return "<a onclick='goLock(this,\"" + row.userId + "\")' onmouseenter='showLock(this)' style='color:red' onmouseout='recovery(this)'>已锁定</a>"
			}
		}
	}
 	function showLock(e){
 		var s = $(e);
 		if(s.text() == '未锁定'){
 			s.css('color','red');
 			s.text('立即锁定')
 		}
 		if(s.text() == '已锁定'){
 			s.css('color','#3fc371');
 			s.text('取消锁定')
 		}
 	}
 	function goLock(e,id){
 		var islock = 0;
 		var thie = $(e);
 		if(thie.text() == "立即锁定"){
 			islock = 0;
 		}else{
 			islock = 1;
 		}
 		$.ajax({
 			type:'post',
 			url:'../employees/GymMemberAction!solveLockProblem.zk',
 			data:{flag: islock,userId:id},
 			dataType:'json',
 			success: function(data){
 				if (data.ERROR == '未登录') {
					loginTimeout();
					//			login();
					return;
				}
				if (data.STATUS) {
					if(data.INFO == "锁定成功!"){
						thie.css('color','red');
						thie.text("已锁定");
					}
					if(data.INFO == "解锁成功!"){
						thie.css('color','#00A0E9');
						thie.text("未锁定");
					}
					$.messager.show({
						title: "消息",
						timeout: 3000,
						msg: data.INFO
					});
				}
 			}
 		})
 	}
 	function recovery(e){
 		var s = $(e);
 		if(s.text() == '立即锁定'){
 			s.css('color','#00A0E9');
 			s.text('未锁定')
 		}
 		if(s.text() == '取消锁定'){
 			s.css('color','red');
 			s.text(' 已锁定')
 		}
 	}
	//年龄换算
	function formatAge(value) {
		//alert(value);
		var date = new Date();
		return date.getFullYear() - parseInt(value);
	}
	//会员卡类型
	function formatType(value, row, index) {
		switch (parseInt(value)) {
			case 0:
				return '时效卡';
			case 1:
				return '次卡';
			default:
				return '';
		}
	}
	//可执行操作
	function formatAction(value, row, index) {
		//var seeMessage = '<a href="javascript:;" onclick="seeMessage(\'' + '' + '\')">查看信息</a>';
		var seeMessage = '<a href="javascript:;"  onclick="seeMessage(' + index + ')">详情</a>';
		var editMesage = '<a href="javascript:;"  onclick="editMesage(' + index + ')">编辑</a>';
		var seeMember = '<a href="javascript:;"  onclick="seeMember(\'' + row.userId + '\')">客户信息</a>';
		// var openCard = '<a href="javascript:;"  onclick="openCard(\'' + row.userId + '\','+index+')">开卡</a>';
		var action;
		action = '<div class="action">' + seeMessage +  '</div>';
		return action;
	}

	function formatPay(value) {
		if (value) {
			return '<span style="color:#FF4646">线上</span>';
		} else {
			return '线下';
		}
	}
	//查看信息
	//清除显示信息
	function clearShowFrom() {
		$('#memberIcon').attr('src', '../images/default.png');
		$('#shouldAmount').text('');
		$('#realAmount').text('');
		$('#memberName').text('');
		$('#memberPhone').text('');
		$('#memberSex').text('');
		$('#memberAge').text('');
		// $('#memberIDCard').text('');
		// $('#memberHeight').text('');
		// $('#memberWeight').text('');
		// $('#memberProfession').text('');
		// $('#memberEmployer').text('');
		// $('#memberName').text('');
		// $('#memberAddress').text('');
		// $('#memberEmployerAddress').text('');
		$('#memberCardType').text('');
		$('#memberCardName').text('');
		$('#memberCardGmtStart').text('');
		$('#memberCardGmtEnd').text('');
		$('#memberCardTotleTime').text('');
		$('#memberCardUseTime').text('');
		$('#gmtCreate').text('');
		$('#gmtModify').text('');
		$('#salePerson').text('');
		$('#signNumber').text('');
		$('#sendTime').text('');
	}
	function CardPaiXun(){
		var dk = $('#gmtstartend').val();
		var iske = {};
		if($('#startDate').val()!='' && $('#endDate').val()!=''){
			iske.createStart=$('#startDate').val()+' 00:00:00',
			iske.createEnd=$('#endDate').val()+' 23:59:59'
		}
		iske.cardName = $('#cardSel').combobox('getValue');
		if(dk== 1){	
			iske.orderBy= 'gmtCreate'		
			$("#dg").datagrid({
				url: '../ngym/GymMembersAction!list.zk',
				queryParams: iske
			});
			$('#gmtstartend').val('0');
			$('.sanjiaoxtime').text('▼')
		}else{
			iske.orderByDesc= 'gmtCreate'
			$("#dg").datagrid({
				url: '../ngym/GymMembersAction!list.zk',
				queryParams: iske
			});
			$('#gmtstartend').val('1');
			$('.sanjiaoxtime').text('▲');
		}
		
		// $('#dg').datagrid('reload');
	}
	function kaiCardPaiXun(){
		var dk = $('#gmtstart').val();
		var iske = {};
		if($('#startDate').val()!='' && $('#endDate').val()!=''){
			iske.createStart=$('#startDate').val()+' 00:00:00',
			iske.createEnd=$('#endDate').val()+' 23:59:59'
		}
		iske.cardName = $('#cardSel').combobox('getValue');
		if(dk== 1){	
			iske.orderBy= 'gmtCreate'			
			$("#dg").datagrid({
				url: '../ngym/GymMembersAction!list.zk',
				queryParams: iske
			});
			$('#gmtstart').val('0');
			$('.sanjiaox').text('▼')
		}else{
			iske.orderByDesc= 'gmtCreate'
			$("#dg").datagrid({
				url: '../ngym/GymMembersAction!list.zk',
				queryParams: iske
			});
			$('#gmtstart').val('1');
			$('.sanjiaox').text('▲')
		}
		
		// $('#dg').datagrid('reload');
	}
	function kaiCardEndPaiXun(){
		var dk = $('#gmtend').val();
		var iske = {};
		if($('#startDate').val()!='' && $('#endDate').val()!=''){
			iske.createStart=$('#startDate').val()+' 00:00:00',
			iske.createEnd=$('#endDate').val()+' 23:59:59'
		}
		iske.cardName = $('#cardSel').combobox('getValue');
		if(dk== 1){
			iske.orderBy= 'gmtCreate'
			$("#dg").datagrid({
				url: '../ngym/GymMembersAction!list.zk',
				queryParams: iske
			});
			$('#gmtend').val('0');
			$('.sanjiaoxend').text('▼')
		}else{
			iske.orderByDesc= 'gmtCreate'
			$("#dg").datagrid({
				url: '../ngym/GymMembersAction!list.zk',
				queryParams: iske
			});
			$('#gmtend').val('1');
			$('.sanjiaoxend').text('▲')
		}
		// $('#dg').datagrid('reload');
	}
	//时间格式化
	function formatTime(value) {
		var date = new Date((value));
		var result = date.format("yyyy-MM-dd hh:mm:ss"); //date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();//+':'+second;
		return result;
	}

	function formatTime1(value) {
		var date = new Date((value));
		var result = date.format("yyyy-MM-dd"); //date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();//+':'+second;
		return result;
	}
	function bigImg(){
		var sersrc = $('#memberIconBig').attr('src');
		var serhei = $('#memberIconBig').height();
		var serwid = $('#memberIconBig').width();
		$('body').append('<div class="bigimg" onclick="cancelBigImg()"  style="margin-top:'+-serhei/2+'px;margin-left:'+-serwid/2+'px"><img src='+sersrc+'></div><div onclick="cancelBigImg()" class="bigled"></div>');
	}
	function cancelBigImg(){
		$('.bigimg,.bigled').remove();
	}
	function seeMessage(index) {
		clearShowFrom();

		var row = $('#dg').datagrid('getData').rows[index];
		/*var row = $('#dg').datagrid('getSelected');
		if (!row) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择会员卡!');
			return;
		}*/
		if(typeof(row.photo)=='undefined'){
			$('#memberIcon,#memberIconBig').attr('src','./images/default.png');
		}else{
			$('#memberIcon').attr('src', '../file/FileCenter!showImage2.zk?name=' + row.photo);
			$('#memberIconBig').attr('src', '../file/FileCenter!showImage2.zk?name=' + row.photo);
		}
		
		// $('#shouldAmount').text(row.shouldPay);
		$('#realAmount').text(row.realPay);
		$('#shouldPay').text(row.shouldPay);
		$('#memberName').text(row.name);
		$('#signNumber').text(row.useTime);
		$('#memberPhone').text(row.phone);
		if (row.sex == 'M')
			$('#memberSex').text('男');
		else if (row.sex == 'F')
			$('#memberSex').text('女');
		else
			$('#memberSex').text('');
		if (row.gmtBirth) {
			var dateB = new Date(row.gmtBirth);
			var birth = dateB.getFullYear();
			var date = new Date();
			$('#memberAge').text(date.getFullYear() - birth);
		}
		$('#memberIDCard').text(row.idCard);
		$('#memberHeight').text(row.height);
		$('#memberWeight').text(row.weight);
		$('#memberProfession').text(row.job);
		$('#memberEmployer').text(row.workUnit);
		$('#memberName').text(row.name);
		$('#memberAddress').text(row.address);
		$('#memberEmployerAddress').text(row.workUnitAddress);
		$('#salePerson').text(row.salesPersonName);
		if (row.cardType == 0) {
			// $('#timeMemberCard').show();
			$('#countMemberCard').hide();
			$('#memberCardType').text('时效卡');
			$('#memberCardGmtStart').text(formatTime1(row.gmtStart));
			$('#memberCardGmtEnd').text(formatTime1(row.gmtEnd));
		} else if (row.cardType == 1) {
			// $('#timeMemberCard').hide();
			$('#countMemberCard').show();
			$('#memberCardType').text('次卡');
			$('#memberCardGmtStart').text(formatTime1(row.gmtStart));
			$('#memberCardGmtEnd').text(formatTime1(row.gmtEnd));
			$('#memberCardTotleTime').text(row.totleTime);
			$('#memberCardUseTime').text(row.totleTime - row.useTime);
		}

		$('#memberCardName').text(row.cardName);
		$('#gmtCreate').text(formatTime1(row.gmtCreate));
		$('#gmtModify').text(formatTime1(row.gmtModify));
		$('#sendTime').text(row.gmtSend);
		$('#dlgMessage').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;会员卡信息");
	}
	//编辑会员卡
	laydate({
	  elem: '#startDate_1',
	  format: 'YYYY-MM-DD',
	  choose: function(datas){ //选择日期完毕的回调
	  		var cha = todm(datas);
	  		if(cha == 0){
	  			$('#endDate_1').val(YeT);
	  		}else{
	  			var endT = haom(YeT);
		    	var endts= endT+cha;
		    	$('#endDate_1').val(new Date(endts).format("yyyy-MM-dd"));
	  		}
	    	
	  }
	});
	function todm(time){
		return haom(time)-haom(YsT);
	}
	function haom(time){
		return new Date(time).getTime();
	}
	//清除addFrom
	function clearAddFrom() {
		$('#headIcon').attr('src', 'images/headIcon.png');
		$('#userID').val('');
		$('#cardType').val('');
		$('.countCard').hide();
		$('#timeCard').show();
		$('#realPay').val('');
		$('#startDate_1').val('');
		$('#endDate_1').val('');
		$('#count').val(''); //次数
		$('#messageName').val('');
		$('#messagePhone').val('');
		$('#messageSex').combobox('setText', '');
		$('#messageImage').val('');
		// $('#birthDate').combobox('setValue', '');
		// $('#IDcard').val('');
		// $('#height').val('');
		// $('#weight').val('');
		// $('#position').val('');
		// $('#messageEmployer').val('');
		// $('#homeAddress').val('');
		// $('#workAddress').val('');
		// $('#remark').val('');
	}

	//拍照
	function startPhotograph(videoId) {
		if (navigator.webkitGetUserMedia) {
			$('#headIcon').hide();
			$('#' + videoId).show();
			var video = document.getElementById(videoId);
			navigator.webkitGetUserMedia({
				"video": true
			}, function(stream) {
				video.src = window.webkitURL.createObjectURL(stream);
				video.play();
			}, function() {
				$.messager.show({
					title: "消息",
					timeout: 1000,
					msg: "未安装摄像头!"
				});
			});
			return;
		} else if (navigator.getUserMedia) {
			$('#headIcon').hide();
			$('#' + videoId).show();
			var video = document.getElementById(videoId);
			navigator.getUserMedia({
				"video": true
			}, function(stream) {
				video.src = stream;
				video.play();
			}, function() {
				$.messager.show({
					title: "消息",
					timeout: 1000,
					msg: "未安装摄像头!"
				});
			});
			return;
		} else if (navigator.mozGetUserMedia) {
			$('#headIcon').hide();
			$('#' + videoId).show();
			var video = document.getElementById(videoId);
			navigator.mozGetUserMedia({
				"video": true
			}, function(stream) {
				video.src = window.URL.createObjectURL(stream);
				video.play();
			}, function() {
				$.messager.show({
					title: "消息",
					timeout: 1000,
					msg: "未安装摄像头!"
				});
			});
			return;
		}
	}

	function getPhotograph(videoId, canvasId) {
		if ($('#' + videoId).css('display') == 'none')
			return;
		var video = document.getElementById(videoId);
		var canvas = document.getElementById(canvasId);
		var context = canvas.getContext("2d");
		context.drawImage(video, 0, 0, 300, 150); //,138,103
		var base64 = canvas.toDataURL('image/jpeg', 1);
		$.post('../file/FileCenter!uploadBase64.zk', {
			fileType: '.jpeg',
			fileData: base64
		}, function(data) {
			if (data.STATUS) {
				var userPhoto = data.fileId; //TODO 验证图片
				$('#headIcon').show();
				$('#' + videoId).hide();
				$('#headIcon').attr('src', base64); //'../file/FileCenter!showImage2.zk?name='+userPhoto
				$("#messageImage").val(data.fileId);
			} else {
				$.messager.show({
					title: "消息",
					timeout: 2000,
					msg: "头像上传失败!"
				});
			}
		}, 'json');
	}

	function chooseImage(id, videoId) {
		$('#headIcon').show();
		$('#' + videoId).hide();
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
				$.messager.progress();
				//上传图片
				$("#title_img_form")
					.ajaxSubmit({
						type: 'post',
						url: '../file/FileCenter!uploadImage2.zk',
						success: function(data) {
							$.messager.progress('close');
							data = $.parseJSON(data);
							if (data.name) {
								var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
								$("#headIcon").attr("src", imgURL);
								$("#messageImage").val(data.name);
							} else {
								//alert("上传图片出错！");
								$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上传图片出错！');
							}
							$("#title_img_form").resetForm();
						},
						error: function(XmlHttpRequest, textStatus, errorThrown) {
							//alert("error");
							$.messager.progress('close');
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
	var curId;
	var curCardType;
	var YsT = null;
	var YeT = null;
	function editMesage() {
		if ($('#dg').datagrid('getChecked').length > 1) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无法对多张卡进行编辑，请重新选择。');
			return false;
		}

		var row = $('#dg').datagrid('getSelected');
		if (!row) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择会员卡!');
			return;
		}
		curId = row.id;
		curCardType = row.cardType;
		photoState = 1;
		$('#headIcon').show();
		$('#iconVideo').hide();
		$('#headIcon').attr('src', '../file/FileCenter!showImage2.zk?name=' + row.photo);
		//$('#userId').val('');
		$('#cardName').val(row.cardName);
		if (row.cardType == 0) {
			$('#cardType').val('时效卡');
			$('.countCard').hide();
			// $('#timeCard').show();
			YsT = new Date(row.gmtStart).format("yyyy-MM-dd")
			$('#startDate_1').val(YsT);
			YeT = new Date(row.gmtEnd).format("yyyy-MM-dd")
			$('#endDate_1').val(YeT);

		} else if (row.cardType == 1) {
			$('#cardType').val('次卡');
			// $('#timeCard').hide();
			$('.countCard').show();
			$('#startDate_1').val(new Date(row.gmtStart).format("yyyy-MM-dd"));
			YeT = new Date(row.gmtEnd).format("yyyy-MM-dd");
			$('#endDate_1').val(new Date(row.gmtEnd).format("yyyy-MM-dd"));
			$('#count').val(row.totleTime); //次数
		}
		$('#realPay').val(row.realPay);
		$('#messageName').val(row.name);
		$('#messagePhone').val(row.phone);
		$('#hjSel').combobox('setValue', row.salesPersonId);
		hjId = row.salesPersonId;
		if (row.sex == 'M')
			$('#messageSex').combobox('setText', '男');
		else if (row.sex == 'F')
			$('#messageSex').combobox('setText', '女');
		$('#messageImage').val(row.photo);
		$('#birthDate').val(new Date(row.gmtBirth).format('yyyy-MM-dd'));
		// $('#IDcard').val(row.idCard);
		// $('#height').val(row.height);
		// $('#weight').val(row.weight);
		// $('#position').val(row.job);
		// $('#messageEmployer').val(row.workUnit);
		// $('#homeAddress').val(row.address);
		// $('#workAddress').val(row.workUnitAddress);
		// $('#remark').val(row.remark);
		$('#dlgEditMessage').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;会员卡信息");
	}

	function checkForm() {
		var userId = $('#userID').val();
		var cardName = $('#cardName').val();
		var cardType = $.trim($('#cardType').val());
		var realPay = $.trim($('#realPay').val());
		var startDate = $.trim($('#startDate_1').val());
		var endDate = $.trim($('#endDate_1').val());
		var count = $.trim($('#count').val()); //次数
		var messageName = $.trim($('#messageName').val());
		var messagePhone = $.trim($('#messagePhone').val());
		var messageSex = $.trim($('#messageSex').combobox('getValue'));
		var messageImage = $.trim($('#messageImage').val());
		var birthDate = $.trim($('#birthDate').val());
		var startDatenum = parseInt(startDate.replace(/\-/g, "").replace(/\:/g, "").replace(/\ /g, ""));
		var endDatenum = parseInt(endDate.replace(/\-/g, "").replace(/\:/g, "").replace(/\ /g, ""));
		var regs = /^[0-9]\d*$/;
		var reg = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
		// var IDcard = $.trim($('#IDcard').val());
		// var height = $.trim($('#height').val());
		// var weight = $.trim($('#weight').val());
		// var position = $.trim($('#position').val());
		// var messageEmployer = $.trim($('#messageEmployer').val());
		// var homeAddress = $.trim($('#homeAddress').val());
		// var workAddress = $.trim($('#workAddress').val());
		// var remark = $.trim($('#remark').val());
		/*
		if(!userId||userId==''){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示','请先扫码!');
			$("#userId").focus();
			return false;
		}*/
		if (!cardType || cardType == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员卡名称不能为空!');
			$("#cardType").focus();
			return false;
		}
		if (realPay == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额不能为空!');
			$("#realPay").focus();
			return false;
		}
		if (!reg.test(realPay)) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额必须为大于或等于0的数值!');
			$("#realPay").focus();
			return false;
		}
		if (!startDate || startDate == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '生效日期不能为空!');
			$("#startDate_1").focus();
			return false;
		}
		if (!endDate || endDate == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '失效日期不能为空!');
			$("#endDate_1").focus();
			return false;
		}
		if (startDatenum >= endDatenum) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '失效日期必须大于生效日期!');
			return false;
		}
		if (curCardType == 1) {
			if (!count || count == '') {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '次卡次数不能为空!');
				$("#count").focus();
				return false;
			}
			if (!regs.test(count)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '次数必须为大于或等于0的数值!');
				$("#count").focus();
				return false;
			}
		}

		if (!messageName || messageName == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员姓名不能为空!');
			$("#messageName").focus();
			return false;
		}
		if (!messagePhone || messagePhone == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员手机号不能为空!');
			$("#messagePhone").focus();
			return false;
		}
		if (!isTelephone(messagePhone)) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员手机号不正确!');
			$("#messagePhone").focus();
			return false;
		}
		if (!messageSex || messageSex == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员性别不能为空!');
			$("#messageSex").focus();
			return false;
		}
		if (!messageImage || messageImage == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员头像不能为空!');
			$("#messageImage").focus();
			return false;
		}
		/*
		if(!birthDate||birthDate==''){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示','出生日期不能为空!');
			$("#birthDate").focus();
			return false;
		}*/
		// if (IDcard && IDcard != '') {
		// 	if (isNaN(IDcard)) {
		// 		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '身份证格式不正确!');
		// 		$("#IDcard").focus();
		// 		return false;
		// 	}
		// }
		// if (height && height != '') {
		// 	if (isNaN(height)) {
		// 		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '身高必须为数值!');
		// 		$("#height").focus();
		// 		return false;
		// 	}
		// }
		// if (weight && weight != '') {
		// 	if (isNaN(weight)) {
		// 		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '体重必须为数值!');
		// 		$("#weight").focus();
		// 		return false;
		// 	}
		// }
		return true;
	}

	function isTelephone(obj) //手机号正则判断
	{
		var pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if (pattern.test(obj)) {
			return true;
		} else {
			return false;
		}
	}
	//保存信息
	function saveMessage() {
		if (checkForm()) {
			var data = {};
			data.id = curId;
			data.userId = $('#userID').val();
			data.cardName = $.trim($('#cardName').val());
			data.cardType = curCardType; //$.trim($('#cardType').val());
			data.realPay = $.trim($('#realPay').val());
			if ($('#startDate_1').val() != '')
				data.gmtStart = $.trim($('#startDate_1').val()) + ' 00:00:00';
			if ($('#endDate_1').val() != '')
				data.gmtEnd = $.trim($('#endDate_1').val()) + ' 00:00:00';
			data.totleTime = $.trim($('#count').val()); //次数
			data.name = $.trim($('#messageName').val());
			data.phone = $.trim($('#messagePhone').val());
			data.sex = $.trim($('#messageSex').combobox('getValue'));
			data.photo = $.trim($('#messageImage').val());
			if (!!$('#birthDate').val())
				data.gmtBirth = $.trim($('#birthDate').val()) + " 00:00:00";
			// data.idCard = $.trim($('#IDcard').val());
			// data.height = $.trim($('#height').val());
			// data.weight = $.trim($('#weight').val());
			// data.job = $.trim($('#position').val());
			// data.address = $.trim($('#homeAddress').val()); //;
			// data.workUnitAddress = $.trim($('#workAddress').val());
			// data.workUnit = $.trim($('#messageEmployer').val());
			data.remark = $.trim($('#remark').val());
			data.salesPersonId = $('#hjSel').combobox('getValue');
			$.post('../ngym/GymMembersAction!update.zk', data, function(data) {
				if (data.STATUS) {
					$('#dg').datagrid('reload');
					$('#dlgEditMessage').dialog('close');
					clearAddFrom();
				} else {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '保存失败!');
				}
			}, 'json');
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
				$('#nickName').text(the.nickName);
				/*
				if(the.effective){
					if(the.effective=='true')
						$('#userStatus').text('有效会员卡');
					else if(the.effective=='false')
						$('#userStatus').text('无效会员卡');
					
				}else{
					$('#userStatus').text('未开卡');
				}
				*/
				$('#userStatus').text();
				$('#gmtUserCreate').text(formatTime(the.gmtCreate));
				$('#gmtUserLike').text(formatTime(the.gmtLike));
				$('#dlgUserMessage').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;客户信息");
			} else {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '获取信息失败!');
			}
		}, 'json');
	}

	function openCard(id, index) {
		//location.href = 'openCard.html?userId='+id;
		var record = $('#dg').datagrid('selectRow', index);
		var row = $('#dg').datagrid('getSelected');
		window.parent.curUserMessage = row.nickname;
		window.parent.curSeeUserId = id;
		$('#memberCard', window.parent.document).trigger('click');
		$('#openCard', window.parent.document).trigger('click');
		event.cancelBubble = true;
		return false;
	}

	function formatTimes(value) {
		if (!value) {
			// console.log(value);
			return '不限';
		}
		return value;
	}
	//客户状态
	function formatStatus(value, row) {
		if (!!row.userId) {
			if (value) {
				if (value == 'true') {
					return '有效';
				} else {
					return '无效';
				}
			} else {
				return '未开卡';
			}
		} else {
			return '未激活';
		}

	}

	//标注当前行
	// 标注
	// function formatRemark(value) {
	// 	var content = value;
	// 	if (value == '' || !value) return '';
	// 	if (content.length > 8) {
	// 		content = content.substring(0, 8) + '...';
	// 	}
	// 	return content;
	// }

	function sendUsers() {
		$('#file_title').val('');
		$('#dlgFile').dialog('open');
	}

	function fileName() {
		$('#fileName').text($('#file_title').val());
	}

	function uploadExl() {
		if (!!$('#file_title').val()) {
			msgLoading();
			$("#file_form").ajaxSubmit({
				type: 'post',
				url: '../ngym/GymMembersAction!uploadExcelData.zk',
				success: function(data) {
					data = eval('(' + data + ')');
					msgLoading('close');
					if (data.STATUS) {
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;成功', data.INFO);
						$('#file_title').val('');
						$('#dlgFile').dialog('close');
						$('#dg').datagrid('reload');

					} else {
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
					}
				},
				error: function(XmlHttpRequest, textStatus, errorThrown) {
					//alert("error");
					msgLoading('close');
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上传失败，请稍后重试！');
				}
			});
		} else {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要上传的文件');
		}
	}

	function cancelUp() {
		$('#dlgFile').dialog('close');
	}