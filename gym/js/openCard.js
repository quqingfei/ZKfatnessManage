	function loginTimeout() {
		window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
	}
	var hjSel, hjId;
	$(function() {
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
		//登陆
		//login();
		getMembersCard();
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
					//$("#dg").datagrid('load',{userId:data.userId});
					$('#userId').val(data.userId);
					$.messager.show({
						title: "&nbsp;&nbsp;&nbsp;消息",
						timeout: 2000,
						msg: "扫码成功!"
					});
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
								$("#messageSex").combobox('setValue', '');
								break;
						}
					}
					if (!!data.saleId) {
						$('#hjSel').combobox('setValue', data.saleId);
					}
					if (!!data.birthDay) {
						$("#birthDate").val(formatBirthDay(data.birthDay))
					}
				} else {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码!');
				}
			}, 'json');
		});
		if (!!window.parent.curSeeUserId) {
			$.post('userAction!getByUserId.zk', {
				userId: window.parent.curSeeUserId
			}, function(data) {
				if (data.STATUS) {
					//$("#dg").datagrid('load',{userId:data.userId});
					$('#userId').val(data.userId);
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
								$("#messageSex").combobox('setValue', '');
								break;
						}
					}
					if (!!data.saleId) {
						$('#hjSel').combobox('setValue', data.saleId);
					}
					if (!!data.birthDay) {
						$("#birthDate").val(formatBirthDay(data.birthDay))
					}
				} else {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '获取用户信息失败，请扫码。');
				}
			}, 'json');
		}
	});

	//登陆
	function postData(url, data, callBack) {
		$.post(url, data, callBack);
	}
	//获取会员卡类型
	var cards;
	var curCardType;
	var curCardTypeStr;
	var curCardName;

	function dateAdd(unit, count, start) {
		//		var dates;
		//一天是86400秒
		// console.log(start.getDate());
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
		$('#realPay').val(card.price);
		if (card.type == 0) {
			curCardTypeStr = '时效卡';
			$('#countCard').hide();
			$('#timeCard').show();
			$('#startDate').val(start);
			$('#endDate').val(end);
			$('#minPrice').text(card.minPrice);
		}

		if (card.type == 1) {
			curCardTypeStr = '次卡';
			$('#timeCard').hide();
			$('#startDate').val(start);
			var sid = dateAdd('y', 1, new Date());
			YeT = sid;
			$('#endDate').val(sid);
			$('#countCard').show();
			$('#count').val(card.count);
			$('#minPrice').text(card.minPrice);
			$('#timeCard').hide();
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
	var lastt = "";
	laydate({
	  elem: '#startDate',
	  format: 'YYYY-MM-DD',
	  choose: function(datas){ //选择日期完毕的回调
	  		lastt="";
	  		var cha = todm(datas);
	  		if(cha == 0){
	  			$('#endDate').val(YeT);
	  		}else{
	  			var endT = haom(YeT);
		    	var endts= endT+cha;
		    	$('#endDate').val(new Date(endts).format("yyyy-MM-dd"));
		    	lastt = new Date(endts).format("yyyy-MM-dd");
	  		}
	    	
	  }
	});
	var addm = 0,addd = 0;
	$('#addtimes').click(function(){
		var unit = $('input:radio[name="date"]:checked').val();
		var endt = $('#endDate').val();
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
			$('#endDate').val(yeos+"-"+meos+"-"+dfen);
		}else{
			addd+=itemval;
			deos = hmzj+(itemval*86400000);
			$('#endDate').val(new Date(deos).format("yyyy-MM-dd"));
		}
		$('#endDate').css({borderColor: '#3fc371',background:'#3fc371',color:'white'});
		setTimeout(function(){
			$('#endDate').css({borderColor: '#ccc',background:'#eee',color:'black'});
		},500);
		$('#datetime').val('');
	})
	$('#cencle').click(function(){
		addm = 0;
		addd = 0;
		$('#datetime').val("");
		if(lastt==""){
			$('#endDate').val(YeT);
		}else{
			$('#endDate').val(lastt);
		}
		
	})
	//判断是否为闰年
	function isLeapYear(year) {  return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);  }
	function todm(time){
		return haom(time)-haom(YsT);
	}
	function haom(time){
		return new Date(time).getTime();
	}
	function getMembersCard() {
		cards = [];
		$.post('../ngym/GymMembersCardAction!list.zk', {
			page: 1,
			rows: 300
		}, function(data) {
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
				$('#cardType').combobox({
					valueField: 'id',
					textField: 'text',
					data: cards,
					onSelect: function(rec) {
						getSelectCard(rec.num);
						$('#startDate').attr('disabled',false);
						$('.chooseded').show();
						$('#startDate').css('background','#fff');
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
					msg: "摄像头调用失败!"
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
					msg: "摄像头调用失败!"
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
					msg: "摄像头调用失败!"
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
					timeout: 1000,
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
				msgLoading();
				//上传图片
				$("#title_img_form")
					.ajaxSubmit({
						type: 'post',
						url: '../file/FileCenter!uploadImage2.zk',
						success: function(data) {
							msgLoading('close');
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
	function clearAddFrom() {
		$('#headIcon').attr('src', 'images/headIcon.png');
		$('#userId').val('');
		$('#cardType').combobox('setText', '时效卡');
		$('#realPay').val('');
		$('#startDate').val('');
		$('#endDate').val('');
		$('#count').val(''); //次数
		$('#messageName').val('');
		$('#messagePhone').val('');
		$('#messageSex').combobox('setText', '男');
		$('#messageImage').val('');
		$('#birthDate').val('');
		$('#IDcard').val('');
		$('#height').val('');
		$('#weight').val('');
		$('#position').val('');
		$('#messageEmployer').val('');
		$('#homeAddress').val('');
		$('#workAddress').val('');
		$('#remark').val('');
	}

	function checkForm() {
		var userId = $('#userId').val();
		var cardType = $.trim($('#cardType').combobox('getValue'));
		var realPay = $.trim($('#realPay').val());
		var startDate = $.trim($('#startDate').val());
		var endDate = $.trim($('#endDate').val());
		var count = $.trim($('#count').val()); //次数
		var messageName = $.trim($('#messageName').val());
		var messagePhone = $.trim($('#messagePhone').val());
		var messageSex = $.trim($('#messageSex').combobox('getValue'));
		var messageImage = $.trim($('#messageImage').val());
		var birthDate = $.trim($('#birthDate').val());
		var remark = $.trim($('#remark').val());
		var startDatenum = parseInt(startDate.replace(/\-/g, "").replace(/\:/g, "").replace(/\ /g, ""));
		var endDatenum = parseInt(endDate.replace(/\-/g, "").replace(/\:/g, "").replace(/\ /g, ""));
		var regs = /^[0-9]+\.{0,1}[0-9]{0,2}$/;

		if (!userId || userId == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先扫码!');
			$("#userId").focus();
			return false;
		}
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
		if (!regs.test(realPay)) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '实付金额为不小于0的数值!');
			$("#realPay").focus();
			return false;
		}
		if (!startDate || startDate == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '生效日期不能为空!');
			$("#startDate").focus();
			return false;
		}
		if (!endDate || endDate == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '失效日期不能为空!');
			$("#endDate").focus();
			return false;
		}
		if (startDatenum >= endDatenum) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '失效日期必须大于生效日期!');
			return false;
		}
		if (curCardType == 1) {
			if (!count || count == '') {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '次数卡次数不能为空!');
				$("#count").focus();
				return false;
			}
			if (!regs.test(count)) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '次数必须为不小于0的数值!');
				$("#count").focus();
				return false;
			}
		}

		if (!messageName || messageName == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员姓名不能为空!');
			$("#messageName").focus();
			return false;
		}
		if (messageName.length > 10) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员姓名长度不得超过10位!');
			$("#messageName").focus();
			return false;
		}
		if (!messagePhone || messagePhone == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '会员手机号不能为空!');
			$("#messagePhone").focus();
			return false;
		}
		if (!isTelephone(messagePhone)) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请填写正确的手机号码!');
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

		if (!birthDate || birthDate == '') {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '出生日期不能为空!');
			$("#birthDate").focus();
			return false;
		}
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
		if (remark.length > 20) {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '备注不能超过20个字!');
			$("#remark").focus();
			return false;
		}
		return true;
	}

	function isTelephone(obj) { //手机号正则判断
		var pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if (pattern.test(obj)) {
			return true;
		} else {
			return false;
		}
	}
	//清除显示信息
	function clearShowFrom() {
		$('#memberIcon').attr('src', '../images/default.png');
		$('#realAmount').text('');
		$('#memberName').text('');
		$('#memberPhone').text('');
		$('#memberSex').text('');
		$('#memberAge').text('');
		$('#memberIDCard').text('');
		// $('#memberHeight').text('');
		// $('#memberWeight').text('');
		// $('#memberProfession').text('');
		// $('#memberEmployer').text('');
		// $('#memberName').text('');
		// $('#memberAddress').text('');
		// $('#memberEmployerAddress').text('');
		$('#memberCardType').text('');
		$('#memberCardName').text('');
		$('#memberCardRemark').text('');
		$('#gmtCreate').text('');
		$('#gmtModify').text('');
	}
	//展示信息
	function showMessage() {
		clearShowFrom();
		if (checkForm()) {
			$('#memberIcon').attr('src', '../file/FileCenter!showImage2.zk?name=' + $.trim($('#messageImage').val()));
			$('#realAmount').text($.trim($('#realPay').val()));
			$('#memberName').text($.trim($('#messageName').val()));
			$('#memberPhone').text($.trim($('#messagePhone').val()));
			$('#memberSex').text($.trim($('#messageSex').combobox('getText')));
			var birth = $('#birthDate').val();
			var date = new Date();
			if (birth)
				$('#memberAge').text(date.getFullYear() - parseInt(birth));
			$('#memberIDCard').text($.trim($('#IDcard').val()));
			// $('#memberHeight').text($.trim($('#height').val()+'cm'));
			// $('#memberWeight').text($.trim($('#weight').val()+'kg'));
			// $('#memberProfession').text($.trim($('#position').val()));
			// $('#memberEmployer').text($.trim($('#messageEmployer').val()));
			// $('#memberAddress').text($.trim($('#homeAddress').val()));
			// $('#memberEmployerAddress').text($.trim($('#workAddress').val()));
			// $('#memberName').text($.trim($('#remark').val()));
			$('#memberCardType').text($.trim(curCardTypeStr));
			$('#memberCardName').text($.trim(curCardName));
			if (curCardType == 0) {
				// $('#timeMemberCard').show();
				$('#countMemberCard').hide();
				$('#memberCardGmtStart').text($.trim($('#startDate').val()));
				$('#memberCardGmtEnd').text($.trim($('#endDate').val()));
			} else if (curCardType == 1) {
				// $('#timeMemberCard').hide();
				$('#countMemberCard').show();
				$('#memberCardGmtStart').text($.trim($('#startDate').val()));
				$('#memberCardGmtEnd').text($.trim($('#endDate').val()));
				$('#memberCardTotleTime').text($('#count').val());
				$('#memberCardUseTime').text($('#count').val());
			}
			if (!!$('#hjSel').combobox('getText')) {
				$('#salePerson').text($('#hjSel').combobox('getText'));
			} else {
				$('#salePerson').text($('#hjSel').combobox('无'));
			}
			$('#gmtCreate').text(new Date().format("yyyy-MM-dd"));
			$('#gmtModify').text(new Date().format("yyyy-MM-dd"));
			$('#sendTime').text(addm+"月"+addd+"天");
			$('#memberCardRemark').text($('#remark').val());
			$('#dlgMessage').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;会员卡信息");
		}
	}
	//格式化日期控件-选择生日
	// $("#birthDate").datebox().datebox('calendar').calendar({ validator:function(day){ return day < new Date(); } })
	function chooseSure(dlgId) {
		saveMessage();
	}

	function chooseCancle(dlgId) {
		$('#' + dlgId).dialog('close');
	}
	//保存信息
	var itemData = null;
	function saveMessage() {
		if (checkForm()) {
			msgLoading();
			$('.chooseSure').attr('disabled', 'disabled');
			var data = {};
			data.userId = $('#userId').val();
			data.cardId = $.trim($('#cardType').combobox('getValue'));
			data.typeText = $.trim($('#cardType').combobox('getText'));
			data.realPay = $.trim($('#realPay').val());
			if (!!$('#startDate').val())
				data.gmtStart = $.trim($('#startDate').val()) + ' 00:00:00';
			if (!!$('#endDate').val())
				data.gmtEnd = $.trim($('#endDate').val()) + ' 00:00:00';
			data.totleTime = $.trim($('#count').val()); //次数
			data.name = $.trim($('#messageName').val());
			data.phone = $.trim($('#messagePhone').val());
			data.sex = $.trim($('#messageSex').combobox('getValue'));
			data.photo = $.trim($('#messageImage').val());
			data.salesPersonId = $('#hjSel').combobox('getValue');
			if(addm==0&&addd==0){
				data.gmtSend = "无"
			}else{
				data.gmtSend = addm+"月"+addd+"天";
			}	
			if (!!$('#birthDate').val())
				data.gmtBirth = $.trim($('#birthDate').val()) + " 00:00:00";
			// data.idCard = $.trim($('#IDcard').val());
			// data.height = $.trim($('#height').val());
			// data.weight = $.trim($('#weight').val());
			// data.job = $.trim($('#position').val());
			// data.address = $.trim($('#homeAddress').val());
			// data.workUnitAddress = $.trim($('#workAddress').val());
			// data.workUnit = $.trim($('#messageEmployer').val());
			data.mark = $.trim($('#remark').val());
			itemData = data;
			$.post('../ngym/GymMembersAction!add.zk', data, function(data) {
				msgLoading('close');
				if (data.STATUS) {
					//					clearAddFrom();
					//					$('#dlgMessage').dialog('close');
					//					var s = window.location.href.split('gym/')[0] + 'gym/allCard.html';
					//					window.location.href = s;
					$('#dlgiloed').dialog('open').dialog('setTitle', "&nbsp;&nbsp;&nbsp;&nbsp;提示信息");
					$('#dlgiloed').parent().find('.panel-tool').css('display','none');
					
				} else {
					if (data.ERROR == '未登录') {
						loginTimeout();
						return;
					}
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
					$('.chooseSure').removeAttr('disabled');
				}
			}, 'json');
		}
	}
	function cencles(){		
		$('#allCard', window.parent.document).trigger('click');
		event.cancelBubble = true;
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
