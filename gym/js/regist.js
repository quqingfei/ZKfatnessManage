var uploadImages = [];
var certificate; //证书字符串
var url = "loginAction!regist.zk"; //"loginAction!registEncrypt.zk";
var certificateName = [];
var update = 0; //标记是否为修改证书照片
var count = 0;
var countCov = 0;
$(function() {

	$('#shield').css('height', $(window).height()); //设置body的高度
	$('#shield').css('width', $(window).width());
	$(window).resize(function() {
		$('#shield').css('height', $(window).height()); //设置body的高度
		$('#shield').css('width', $(window).width());
	});
	//alert($(window).height());

	$("#loginName").val('');
	$("#pwd").val('');
	$('#hideDiv').hide();

	$('#courseTime1').timespinner('setValue', '00:00');
	$('#courseTime2').timespinner('setValue', '00:00');
});
//添加服务设施
var services = [];

function checkThis(id) {
	var value = $('#' + id).val();
	if ($("#" + id).prop('checked')) {
		services.push(value);
	} else {
		var length = services.length;
		for (var i = 0; i < length; i++) {
			if (services[i] == value) {
				services.splice(i, 1);
				break;
			}
		}
	}
}

function saveService() {
	//alert($('#serviceFacility').val());
	$('#serviceFacility').val("");
	$('#serviceFacility1').val("");
	//$('#serviceFacility').attr('value') = JSON.stringify(services);
	$('#serviceFacility').val(JSON.stringify(services));
	var length = services.length;
	var result = "";
	for (var i = 0; i < length; i++) {
		result = result + services[i] + ','
	}
	//alert(result);
	$('#serviceFacility1').val(result);
	closeWindow();
}
// 百度地图API功能
function G(id) {
	return document.getElementById(id);
}

var map = new BMap.Map("l-map");
map.centerAndZoom("北京", 10); // 初始化地图,设置城市和地图级别。
// var point = new BMap.Point(114.311831,30.598428);
// map.centerAndZoom(point,12);
map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
// var infoView = new BMap.InfoWindow("I am here");
var ac = new BMap.Autocomplete( //建立一个自动完成的对象
	{
		"input": "address",
		"location": map
	});

ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
	var str = "";
	var _value = e.fromitem.value;
	var value = "";
	if (e.fromitem.index > -1) {
		value = _value.province + _value.city + _value.district + _value.street + _value.business;
	}
	str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

	value = "";
	if (e.toitem.index > -1) {
		_value = e.toitem.value;
		value = _value.province + _value.city + _value.district + _value.street + _value.business;
	}
	str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
	G("searchResultPanel").innerHTML = str;
});

var myValue;
ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
	var _value = e.item.value;
	myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
	G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
	setPlace();
});
var marker;
var geoc = new BMap.Geocoder();

function myFun1(result) {
	map.centerAndZoom(result.center, 12);
	// map.setCenter(result.name);
	marker = new BMap.Marker(result.center);
	map.addOverlay(marker); //添加标注
	marker.enableDragging();
	$('#gpsX').val(marker.point.lat);
	$('#gpsY').val(marker.point.lng);
	marker.addEventListener("dragend", function(e) {
		geoc.getLocation(e.point, function(rs) {

			var addComp = rs.addressComponents;
			$('#address').val(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber);
			// console.log(addComp);
		});
		$('#gpsX').val(e.point.lat);
		$('#gpsY').val(e.point.lng);
	});
	geoc.getLocation(result.center, function(rs) {

		var addComp = rs.addressComponents;
		$('#address').val(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber);
		// console.log(addComp);
	});
}
var myCity = new BMap.LocalCity();
// $(function () {
//     myCity.get(myFun1);
// })

function setPlace() {
	map.clearOverlays(); //清除地图上所有覆盖物
	function myFun() {
		var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
		map.centerAndZoom(pp, 18);
		marker = new BMap.Marker(pp)
		map.addOverlay(marker); //添加标注
		marker.enableDragging();
		$('#gpsX').val(marker.point.lat);
		$('#gpsY').val(marker.point.lng);
		marker.addEventListener("dragend", function(e) {
			geoc.getLocation(e.point, function(rs) {

				var addComp = rs.addressComponents;
				$('#address').val(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber);
				// console.log(addComp);
			});
			$('#gpsX').val(e.point.lat);
			$('#gpsY').val(e.point.lng);
		});
	}
	var local = new BMap.LocalSearch(map, { //智能搜索
		onSearchComplete: myFun
	});
	local.search(myValue);
}

function step(step) {
	switch (step) {
		case 1:
			$('.step1').show();
			$('.step2').hide();
			$('.step3').hide();
			break;
		case 2:
			$('.step1').hide();
			$('.step2').show();
			$('.step3').hide();
			if ($('#address').val() == '') {
				myCity.get(myFun1);
			}
			break;
		case 3:
			$('.step1').hide();
			$('.step2').hide();
			$('.step3').show();
			break;
		default:
			break;
	}
}
if (window.zk_Win_X()) {
	new TitleBar("zk_title", "#333333", "燃脂部落健身场所管理系统", "./css/images/logo.png");
} else {
	alert(00)
	console.log('不在应用程序中');
}
//屏蔽事件
function shield() {
	event.stopPropagation();
	return false;
}

//验证码计时器
var theCount = 30;

function theTime() {
	if (theCount == 0) {
		clearTimeout(timeout);
		$('#codeClick').css({
			'background': '#FFD600'
		});
		$('#codeClick').text('获取验证码');
		$("#codeClick").click(toCode);
		$('#codeClick').prop('disabled', true);
		isSend = 0;
		return;
	}
	$('#codeClick').attr('onclick', function(event) {
		return false;
	});
	$('#codeClick').prop('disabled', false);
	$('#codeClick').css({
		'background': '#929292'
	});
	$('#codeClick').text('请等待 ' + theCount + 'S');
	theCount = theCount - 1;
	timeout = setTimeout('theTime()', 1000);
}
var timeout;
var isSend = 0;

function toCode() {
	if (isSend == 1)
		return;
	var adminPhone = $.trim($("#adminPhone").val());
	if (adminPhone == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '手机号不能为空!');
		$("#adminPhone").focus();
		return false;
	} else if (!isTelephone(adminPhone)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '手机号不正确!');
		$("#adminPhone").focus();
		return false;
	} else {
		$("#code").val('');
		$.getJSON('loginAction!smsCode.zk', {
			phone: adminPhone
		}, function(data) {
			if (data.STATUS) {
				theCount = 30;
				isSend = 1;
				theTime();
				//$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '验证码已发送，请注意查收！');
			}
		});
	}
}

function isTelephone(obj) // 正则判断
{
	var pattern = /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0?1[3|4|5|8|7][0-9]\d{8}$)/;
	if (pattern.test(obj)) {
		return true;
	} else {
		return false;
	}
}

//显示删除图标
function showDeleteDiv(id) {
	$("#" + id + "DIV").css("display", "block");
}

function hideDeleteDiv(resourceCode) {
	$("#" + resourceCode + "DIV").css("display", "none");
}

//移除图片
function removeImage(id) {
	var value = $("#" + id).parent().parent().attr('value');
	$("#" + id).parent().parent().detach();
	event.stopPropagation();
	//var div = document.getElementById("image_container");
	var div = $('#image_container');
	div.children().each(function(i, n) {
		var obj = $(n)
		if (obj.attr('value') && (obj.attr('value') > value))
			obj.css('left', parseInt(obj.css('left')) - 92);
	});
	var add = $('#addCertificate');
	add.css('left', parseInt(add.css('left')) - 92);
}

function removeCover(id) {
	var value = $("#" + id).parent().parent().attr('value');
	$("#" + id).parent().parent().detach();
	event.stopPropagation();
	//var div = document.getElementById("image_container");
	var div = $('#image_container2');
	div.children().each(function(i, n) {
		var obj = $(n)
		if (obj.attr('value') && (obj.attr('value') > value))
			obj.css('left', parseInt(obj.css('left')) - 92);
	});
	var add = $('#addCertificate2');
	add.css('left', parseInt(add.css('left')) - 92);
}

function leftTo(a) {
	var container = $('#image_container' + a);
	var add = $('#addCertificate' + a);
	if (container.scrollLeft() > 0)
		container.scrollLeft(container.scrollLeft() - 92);
}

function rightTo(a) {
	var container = $('#image_container' + a);
	var add = $('#addCertificate' + a);
	//alert(container.scrollLeft());
	if (container.scrollLeft() < (parseInt(add.css('left')) - 276))
		container.scrollLeft(container.scrollLeft() + 92);
}

function add(id) {
	var fatherDiv = document.getElementById("image_container");
	var addDiv = document.getElementById("addCertificate");
	var div = document.createElement("div");
	$(div).attr({
		'id': id + 'div',
		'class': 'certificateList',
		'value': count
	});
	count = count + 1;
	//fatherDiv.appendChild(div);
	fatherDiv.insertBefore(div, addDiv);
	var add = $('#addCertificate');
	$(div).css('left', parseInt(add.css('left')));
	add.css('left', parseInt(add.css('left')) + 92);
	var container = $('#image_container');
	if (parseInt(add.css('left')) >= 368)
		container.scrollLeft(parseInt(add.css('left')) - 276);
	var imgDiv = document.createElement("div");
	$(imgDiv).attr({
		'id': id + 'imgDiv',
		'class': 'add',
		'onclick': 'chooseImage1("' + id + '")',
		'onmouseover': 'showDeleteDiv("' + id + '")',
		'onmouseout': 'hideDeleteDiv("' + id + '")'
	});
	div.appendChild(imgDiv);
	var input = document.createElement("input");
	$(input).attr({
		'id': id + 'name',
		'class': 'certificateName',
		'placeholder': '请输入名称'
	});
	$(input).css('width', '88px');
	div.appendChild(input);
	var img = document.createElement("img");
	$(img).attr({
		'id': id,
		'class': "img",
		'src': "images/yun.png"
	});
	imgDiv.appendChild(img);
	//增加删除图标
	var $image = $("#" + id);
	var divObj = $("<div onclick=removeImage('" + id + "')  onmouseover=\"showDeleteDiv('" + id + "')\"" + " onmouseout=\"hideDeleteDiv('" + id + "')\">×</div>");
	divObj.addClass("divX");
	divObj.attr("id", id + "DIV");
	divObj.attr("title", "删除图片" + id);
	//alert($image.position());
	divObj.css({
		position: "absolute",
		cursor: "pointer",
		color: "#FFD22E",
		background: "#929292",
		border: "1px solid #929292",
		width: "12px",
		height: "12px",
		'font-size': "12px",
		left: 46,
		top: 0,
		display: "none"
	});
	$image.parent().append(divObj);
}

function addCover(id) {
	var fatherDiv = document.getElementById("image_container2");
	var addDiv = document.getElementById("addCertificate2");
	var div = document.createElement("div");
	$(div).attr({
		'id': id + 'div',
		'class': 'certificateList',
		'value': countCov
	});
	countCov = countCov + 1;
	//fatherDiv.appendChild(div);
	fatherDiv.insertBefore(div, addDiv);
	var add = $('#addCertificate2');
	$(div).css('left', parseInt(add.css('left')));
	add.css('left', parseInt(add.css('left')) + 92);
	var container = $('#image_container2');
	if (parseInt(add.css('left')) >= 368)
		container.scrollLeft(parseInt(add.css('left')) - 276);
	var imgDiv = document.createElement("div");
	$(imgDiv).attr({
		'id': id + 'imgDiv',
		'class': 'addCover',
		'onclick': 'chooseImage2("' + id + '")',
		'onmouseover': 'showDeleteDiv("' + id + '")',
		'onmouseout': 'hideDeleteDiv("' + id + '")'
	});
	div.appendChild(imgDiv);
	// var input = document.createElement("input");
	// $(input).attr({
	//     'id': id + 'name',
	//     'class': 'certificateName',
	//     'placeholder': '请输入名称'
	// });
	// $(input).css('width', '88px');
	// div.appendChild(input);
	var img = document.createElement("img");
	$(img).attr({
		'id': id,
		'class': "img",
		'src': "images/yun.png"
	});
	imgDiv.appendChild(img);
	//增加删除图标
	var $image = $("#" + id);
	var divObj = $("<div onclick=removeCover('" + id + "')  onmouseover=\"showDeleteDiv('" + id + "')\"" + " onmouseout=\"hideDeleteDiv('" + id + "')\">×</div>");
	divObj.addClass("divX");
	divObj.attr("id", id + "DIV");
	divObj.attr("title", "删除图片" + id);
	//alert($image.position());
	divObj.css({
		position: "absolute",
		cursor: "pointer",
		color: "#FFD22E",
		background: "#929292",
		border: "1px solid #929292",
		width: "12px",
		height: "12px",
		'font-size': "12px",
		left: "66px",
		top: "0",
		display: "none"
	});
	$image.parent().append(divObj);
}

function up(oldId, newId) {
	$('#' + oldId + 'div').attr({
		'id': newId + 'div',
	});
	$('#' + oldId + 'name').attr({
		'id': newId + 'name',
	});
	$('#' + oldId + 'imgDiv').attr({
		'id': newId + 'imgDiv',
		'class': 'add',
		'onclick': 'chooseImage1("' + newId + '")',
		'onmouseover': 'showDeleteDiv("' + newId + '")',
		'onmouseout': 'hideDeleteDiv("' + newId + '")'
	});
	$('#' + oldId).attr({
		'id': newId
	});
	var deleteDiv = $('#' + oldId + 'DIV');
	$(deleteDiv).attr({
		'id': newId + "DIV",
		'onclick': 'removeImage("' + newId + '")',
		'onmouseover': 'showDeleteDiv("' + newId + '")',
		'onmouseout': 'hideDeleteDiv("' + newId + '")'
	});
}

function upCover(oldId, newId) {
	$('#' + oldId + 'div').attr({
		'id': newId + 'div',
	});
	$('#' + oldId + 'name').attr({
		'id': newId + 'name',
	});
	$('#' + oldId + 'imgDiv').attr({
		'id': newId + 'imgDiv',
		'class': 'addCover',
		'onclick': 'chooseImage2("' + newId + '")',
		'onmouseover': 'showDeleteDiv("' + newId + '")',
		'onmouseout': 'hideDeleteDiv("' + newId + '")'
	});
	$('#' + oldId).attr({
		'id': newId
	});
	var deleteDiv = $('#' + oldId + 'DIV');
	$(deleteDiv).attr({
		'id': newId + "DIV",
		'onclick': 'removeCover("' + newId + '")',
		'onmouseover': 'showDeleteDiv("' + newId + '")',
		'onmouseout': 'hideDeleteDiv("' + newId + '")'
	});
}

function chooseImage1(id) {
	update = id;
	document.getElementById("image_file").click();
}

function chooseImage2(id) {
	update = id;
	document.getElementById("file_title_img").click();
}

function chooseImage(id) {
	if (countCov == 6 && id == 'file_title_img') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "封面最多6张！");
		return false;
	}
	update = 0;
	document.getElementById(id).click();
}

//上传证书
function uploadCertificate() {
	//alert('upload');
	var viewFiles = document.getElementById("image_file");
	//是否为图片类型            
	if (/image\/\w+/.test(viewFiles.files[0].type)) {
		//最大图片文件大小 500KB
		msgLoading();
		var imgSizeLimit = 5000 * 1024;
		if (viewFiles.files[0].size <= imgSizeLimit) {
			//上传图片
			$("#image_form")
				.ajaxSubmit({
					type: 'post',
					url: '../file/FileCenter!uploadImage2.zk',
					success: function(data) {
						//data = $.parseJSON(data);
						msgLoading('close');
						data = eval("(" + data + ")");
						if (data.name) {
							//alert(data.name);
							var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
							var id = data.name.split(".")[0];
							if (update == 0) {
								add(id);
							} else {
								up(update, id);
							}
							$("#" + id).attr("src", imgURL);
							$("#" + id).attr("alt", data.name);
						} else {
							//alert("上传图片出错！");
							$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "上传图片出错！");
						}
						//$("#title_img_form").resetForm();
						$("#image_form").resetForm();
					},
					error: function(XmlHttpRequest, textStatus, errorThrown) {
						//alert("error");
						msgLoading('close');
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '网络异常，请稍后重试！');
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

//上传文章图片
function uploadImage() {
	//alert('upload');
	var viewFiles = document.getElementById("file_title_img");
	//是否为图片类型            
	if (/image\/\w+/.test(viewFiles.files[0].type)) {
		//最大图片文件大小 500KB
		msgLoading();
		var imgSizeLimit = 5000 * 1024;
		if (viewFiles.files[0].size <= imgSizeLimit) {
			//上传图片
			$("#title_img_form")
				.ajaxSubmit({
					type: 'post',
					url: '../file/FileCenter!uploadImage2.zk',
					success: function(data) {
						msgLoading('close');
						data = $.parseJSON(data);
						if (data.name) {

							// alert(data.name);
							var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
							var id = data.name.split(".")[0];
							if (update == 0) {
								addCover(id);
							} else {
								upCover(update, id);
							}
							$("#" + id).attr("src", imgURL);
							$("#" + id).attr("alt", data.name);
							// var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
							// $("#imghead").attr("src", imgURL);
							// $("#phoneCover").attr("src", imgURL);
							// var coverArray = [];
							// coverArray.push(data.name)
							// $("#cover").val(JSON.stringify(coverArray));
						} else {
							//alert("上传图片出错！");
							$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上传图片出错!');
						}
						$("#title_img_form").resetForm();
					},
					error: function(XmlHttpRequest, textStatus, errorThrown) {
						//alert("error");
						msgLoading('close');
						$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '网络异常，请稍后重试！');
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

function checkForm() {
	var name = $.trim($("#gymName").val());
	var pattern = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
	if (name == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '健身房名称不能为空!');
		step(1);
		$("#gymName").focus();
		return false;
	}
	if (!pattern.test(name)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '健身房名称仅能包含英文、数字和中文！不可包含字符和空格！');
		step(1);
		$("#gymName").focus();
		return false;
	}
	var admin = $.trim($("#admin").val());
	if (admin == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '法人不能为空!');
		step(1);
		$("#admin").focus();
		return false;
	}
	var adminPhone = $.trim($("#adminPhone").val());
	if (adminPhone == '' || adminPhone.length != 11) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '手机号有误!');
		step(1);
		$("#adminPhone").focus();
		return false;
	}
	var loginName = $.trim($("#loginName").val());
	var pattern1 = /^[a-zA-Z0-9]+$/;
	if (loginName == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录名不能为空!');
		step(1);
		$("#loginName").focus();
		return false;
	} else {
		$.post('loginAction!checkLoginName.zk', {
			loginName: loginName
		}, function(data) {
			if (data.exist) {
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录名已经存在!');
				step(1);
				$("#loginName").focus();
			}
		});
	}
	if (!pattern1.test(loginName)) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录名仅能包含英文和数字！不可包含字符和空格！');
		step(1);
		$("#loginName").focus();
		return false;
	}
	var pwd = $.trim($("#pwd").val());
	if (pwd == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '密码不能为空!');
		step(1);
		$("#pwd").focus();
		return false;
	}
	var courseTime1 = $.trim($("#courseTime1").timespinner('getValue'));
	if (courseTime1 == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '营业开始时间不能为空!');
		step(1);
		$("#courseTime1").focus();
		return false;
	}
	var courseTime2 = $.trim($("#courseTime2").timespinner('getValue'));
	//alert(courseTime2);
	if (courseTime2 == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '营业结束时间不能为空!');
		step(1);
		$("#courseTime2").focus();
		return false;
	}
	if (parseInt(courseTime1.split(':')[0]) > parseInt(courseTime2.split(':')[0])) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '营业结束时间不可在开始时间之前!');
		step(1);
		$("#courseTime1").focus();
		return false;
	}
	var code = $.trim($("#code").val());
	if (code == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '验证码不能为空!');
		step(1);
		$("#code").focus();
		return false;
	}

	// var zfbName = $.trim($("#zfbName").val());
	// if (zfbName == '') {
	//  $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '提现账户名不能为空!');
	//  $("#zfbName").focus();
	//  return false;
	// }
	// var zfbAccount = $.trim($("#zfbAccount").val());
	// if (zfbAccount == '') {
	//  $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '提现账户不能为空!');
	//  $("#zfbAccount").focus();
	//  return false;
	// }
	var businessNo = $.trim($("#businessNo").val());
	if (businessNo == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '营业执照编号不能为空!');
		step(1);
		$("#businessNo").focus();
		return false;
	}
	var cover = document.getElementById("image_container2").getElementsByTagName("img");
	if (cover.length <= 0) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '封面不能为空!');
		// $("#cover").focus();
		return false;
	}
	var list = document.getElementById("image_container").getElementsByTagName("input");
	//var certification = $.trim($("#certification").val());
	if (list.length <= 0) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '资质认证不能为空!');
		//$("#certification").focus();
		return false;
	}
	if (list.length > 0) {
		//alert(list.length);
		var i = 0;
		while (i < list.length) {
			var id = list.item(i).id;
			if ($.trim($("#" + id).val()) == '') {
				//alert('证书名称为空！');
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '证书名称为空!');
				$("#" + id).focus();
				return;
			}
			i = i + 1;
		}

	}
	return true;
}

function saveMessage() {
	if (checkForm()) {
		var formImages = "";
		var formCovers = "";
		var imgObjArr = [];
		var coverAlt = [];
		var listInput = document.getElementById("image_container").getElementsByTagName("input");
		var listImg = document.getElementById("image_container").getElementsByTagName("img");
		if (listInput.length > 0) {
			for (var i = 0; i < listInput.length; i++) {
				var imgObj = {
					"name": $.trim($("#" + listInput.item(i).id).val()),
					"image": listImg.item(i).alt
				}; //$.trim($("#"+listInput.item(i).id).val)
				imgObjArr.push(imgObj);
			}
			formImages = JSON.stringify(imgObjArr);
		}
		// var coverInput = document.getElementById("image_container2").getElementsByTagName("input");
		var coverImg = document.getElementById("image_container2").getElementsByTagName("img");
		if (coverImg.length > 0) {
			for (var i = 0; i < coverImg.length; i++) {
				var imgObj = $.trim(coverImg.item(i).alt);
				coverAlt.push(imgObj);
			}
			formCovers = JSON.stringify(coverAlt);
		}
		$("#certification").attr("value", "");
		$("#certification").val(formImages);
		$('#cover').val(formCovers);
		$('#businessHours').val($("#courseTime1").timespinner('getValue') + '-' + $("#courseTime2").timespinner('getValue'));

		/*
		    var gymName = $("#gymName").val();//$("#gymName").textbox('getValue');
		    var description = $("#description").val();//$("#description").textbox('getValue');
		    var address = $("#address").val();//$("#address").textbox('getValue');
		    var certification = $("#certification").val();
		    var cover = $("#cover").val();
		    $.getJSON('GymAccountAction!updateGymInfo.zk',{gymName:gymName,description:description,address:address,certification:certification,cover:cover},function(data){
		        if(data.STATUS){
		            $("#phoneAddress").text($("#address").textbox('getValue'));
		            $("#phoneDescription").text($("#description").textbox('getValue'));
		            alert("保存成功");
		        }
		    });*/
		clearSpecialStr('fm');
		$('#fm').form('submit', {
			url: url,
			onSubmit: function() {
				return checkForm();
			},
			success: function(result) {
				var result = eval('(' + result + ')');
				if (result.STATUS) {
					//$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '保存成功!');
					location.href = "check.html";
				} else {
					/*
					     $.messager.show({
					         title: '错误',
					         
					     });*/
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', result.INFO);
				}

			}
		});

	}
}

//添加服务窗口的响应函数
function addService() {
	var index = $($('#service').parent()).css('z-index');
	$("#shield").css({
		"z-index": index - 1
	});
	$("#shield").show();
	$('#service').css({
		'display': 'block',
		left: ($(window).width() - $('#service').width()) / 2,
		top: ($(window).height() - $('#service').height()) / 2
	});
	if ($('#serviceFacility').val() && $('#serviceFacility').val() != '') {
		services = eval('(' + $('#serviceFacility').attr('value') + ')');
		var length = services.length;
		for (var i = 0; i < length; i++) {
			switch (services[i]) {
				case $('#wifi').val():
					$('#wifi').attr('checked', true);
					break;
				case $('#shop').val():
					$('#shop').attr('checked', true);
					break;
				case $('#showerRoom').val():
					$('#showerRoom').attr('checked', true);
					break;
				case $('#deposit').val():
					$('#deposit').attr('checked', true);
					break;
				case $('#smoking').val():
					$('#smoking').attr('checked', true);
					break;
				case $('#toilets').val():
					$('#toilets').attr('checked', true);
					break;
				case $('#rent').val():
					$('#rent').attr('checked', true);
					break;
				case $('#sleep').val():
					$('#sleep').attr('checked', true);
					break;
				case $('#park').val():
					$('#park').attr('checked', true);
					break;
				default:
					break;
			}
		}
	}
}

function iconOver(value) {
	$('#' + value + 'Chat').attr('src', 'images/' + value + '_1.png');
}

function iconOut(value) {
	$('#' + value + 'Chat').attr('src', 'images/' + value + '.png');
}

function minWindow() {
	$('#dlgChat').hide();
}

function closeWindow() {
	$('#service').hide();
	$("#shield").hide();
}
//鼠标拖动窗口移动
var Dragging = function(validateHandler) { //参数为验证点击区域是否为可移动区域，如果是返回欲移动元素，负责返回null
	var draggingObj = null; //dragging Dialog
	var diffX = 0;
	var diffY = 0;

	function mouseHandler(e) {
		switch (e.type) {
			case 'mousedown':
				draggingObj = validateHandler(e); //验证是否为可点击移动区域
				if (draggingObj != null) {
					diffX = e.clientX - draggingObj.offsetLeft;
					diffY = e.clientY - draggingObj.offsetTop;
				}
				break;

			case 'mousemove':
				if (draggingObj) {
					draggingObj.style.left = (e.clientX - diffX) + 'px';
					draggingObj.style.top = (e.clientY - diffY) + 'px';
				}
				break;

			case 'mouseup':
				draggingObj = null;
				diffX = 0;
				diffY = 0;
				break;
		}
		//event.stopPropagation();
	};

	return {
		enable: function() {
			document.addEventListener('mousedown', mouseHandler);
			document.addEventListener('mousemove', mouseHandler);
			document.addEventListener('mouseup', mouseHandler);
		},
		disable: function() {
			document.removeEventListener('mousedown', mouseHandler);
			document.removeEventListener('mousemove', mouseHandler);
			document.removeEventListener('mouseup', mouseHandler);
		}
	}
}

function getDraggingDialog(e) {
	var target = e.target;
	//alert(target.className.indexOf('dialog'));
	while (target && target.className.indexOf('dlgChat') == -1) { //className
		target = target.offsetParent;
	}
	if (target != null) {
		return target.offsetParent;
	} else {
		return null;
	}
}
Dragging(getDraggingDialog).enable();