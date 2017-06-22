var apiURL = null;
var curUserId = null;
var curChatUserId = null;
var conn = null;
var curRoomId = null;
var userId = null;
var userName = null; // 客服昵称
var headIcon = null; // 客服头像
var userPhone = null; // 保存教练的电话
var userPassword = null; //
var remarkMessage = false; // 标记是否提示
var userSex = null; // 客服性别
var deleteLi = null; // 正在删除客服列表的li
var del = ""; // 标记是否响应设置null-nouser
var curChatTo = null; // 保存当前聊天界面用户的“to”信息
var isDel = false;
var msgCardDivId = "chat01";
var talkToDivId = "talkTo";
var talkInputId = "talkInputId";
var fileInputId = "fileInput";
var bothRoster = [];
var toRoster = [];
var maxWidth = 200;
var groupFlagMark = "group--";
var groupQuering = false;
var textSending = false;
var appkey = "zkim2014#stepper"; //本地
//var appkey = "zkim2014#fatburn";// 云端
var time = 0;

window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
var getLoginInfo = function() {
	return {
		isLogin: false
	};
};
var showLoginUI = function() {

	$('#loginmodal').modal('show');
	$('#username').focus();
};
var hiddenLoginUI = function() {
	$('#loginmodal').modal('hide');
};
var showWaitLoginedUI = function() {
	$('#waitLoginmodal').modal('show');
};
var hiddenWaitLoginedUI = function() {
	$('#waitLoginmodal').modal('hide');
};
var showChatUI = function() {
	$('#content').css({
		"display": "block"
	});
	var login_userEle = document.getElementById("login_user").children[0];
	// login_userEle.innerHTML = curUserId;
	// login_userEle.setAttribute("title", curUserId);
};
// 登录之前不显示web对话框
var hiddenChatUI = function() {
	$('#content').css({
		"display": "none"
	});
	document.getElementById(talkInputId).value = "";
};
// 定义消息编辑文本域的快捷键，enter和ctrl+enter为发送，alt+enter为换行
// 控制提交频率
$(function() {
	$("textarea").keydown(function(event) {
		if (event.altKey && event.keyCode == 13) {
			e = $(this).val();
			$(this).val(e + '\n');
		} else if (event.ctrlKey && event.keyCode == 13) {
			// e = $(this).val();
			// $(this).val(e + '<br>');
			event.returnValue = false;
			sendText();
			return false;
		} else if (event.keyCode == 13) {
			event.returnValue = false;
			sendText();
			return false;
		}

	});
});

// easemobwebim-sdk注册回调函数列表
$(document).ready(function() {
	// showStudyMessage();
	conn = new Easemob.im.Connection();
	// 初始化连接
	conn.init({
		https: false,
		// 当连接成功时的回调方法
		onOpened: function() {
			handleOpen(conn);
		},
		// 当连接关闭时的回调方法
		onClosed: function() {
			handleClosed();
		},
		// 收到文本消息时的回调方法
		onTextMessage: function(message) {
			handleTextMessage(message);
		},
		// 收到表情消息时的回调方法
		onEmotionMessage: function(message) {
			handleEmotion(message);
		},
		// 收到图片消息时的回调方法
		onPictureMessage: function(message) {
			handlePictureMessage(message);
		},
		// 收到音频消息的回调方法
		onAudioMessage: function(message) {
			handleAudioMessage(message);
		},
		// 收到位置消息的回调方法
		onLocationMessage: function(message) {
			handleLocationMessage(message);
		},
		// 收到文件消息的回调方法
		onFileMessage: function(message) {
			handleFileMessage(message);
		},
		// 收到视频消息的回调方法
		onVideoMessage: function(message) {
			handleVideoMessage(message);
		},
		// 收到联系人订阅请求的回调方法
		onPresence: function(message) {
			handlePresence(message);
		},
		// 收到联系人信息的回调方法
		onRoster: function(message) {
			handleRoster(message);
		},
		// 收到群组邀请时的回调方法
		onInviteMessage: function(message) {
			handleInviteMessage(message);
		},
		// 异常时的回调方法
		onError: function(message) {
			handleError(message);
		}
	});

	var loginInfo = getLoginInfo();
	/*
	 * if (loginInfo.isLogin) { showWaitLoginedUI(); } else { showLoginUI();
	 * $("#username").val(userPhone); }
	 */
	// /showLoginUI();
	// /if(userPhone!=null)
	// /$("#username").val(userPhone);
	// 发送文件的模态窗口
	$('#fileModal').on('hidden.bs.modal', function(e) {
		var ele = document.getElementById(fileInputId);
		ele.value = "";
		if (!window.addEventListener) {
			ele.outerHTML = ele.outerHTML;
		}
		document.getElementById("fileSend").disabled = false;
		document.getElementById("cancelfileSend").disabled = false;
	});

	$('#addFridentModal').on('hidden.bs.modal', function(e) {
		var ele = document.getElementById("addfridentId");
		ele.value = "";
		if (!window.addEventListener) {
			ele.outerHTML = ele.outerHTML;
		}
		document.getElementById("addFridend").disabled = false;
		document.getElementById("cancelAddFridend").disabled = false;
	});

	$('#delFridentModal').on('hidden.bs.modal', function(e) {
		var ele = document.getElementById("delfridentId");
		ele.value = "";
		if (!window.addEventListener) {
			ele.outerHTML = ele.outerHTML;
		}
		document.getElementById("delFridend").disabled = false;
		document.getElementById("canceldelFridend").disabled = false;
	});

	$('#confirm-block-div-modal').on('hidden.bs.modal', function(e) {

	});

	$('#option-room-div-modal').on('hidden.bs.modal', function(e) {

	});

	$('#notice-block-div').on('hidden.bs.modal', function(e) {

	});

	$('#regist-div-modall').on('hidden.bs.modal', function(e) {

	});
	/*
	 * /// //在 密码输入框时的回车登录 $('#password').keypress(function(e) { var key =
	 * e.which; if (key == 13) { login(); } });
	 */
	$(function() {
		$(window).bind('beforeunload', function() {
			if (conn) {
				conn.close();
				/*
				 * if (navigator.userAgent.indexOf("Firefox") > 0) return ' ';
				 * else return '';
				 */
			}

		});
	});

});

// 处理连接时函数,主要是登录成功后对页面元素做处理
var handleOpen = function(conn) {
	// 从连接中获取到当前的登录人注册帐号名
	curUserId = conn.context.userId;
	// 获取当前登录人的联系人列表
	conn.getRoster({
		success: function(roster) {
			// 页面处理
			// hiddenWaitLoginedUI();
			showChatUI();
			var curroster;
			for (var i in roster) {
				var ros = roster[i];
				// both为双方互为好友，要显示的联系人,from我是对方的单向好友
				if (ros.subscription == 'both' || ros.subscription == 'from') {
					bothRoster.push(ros);
				} else if (ros.subscription == 'to') {
					// to表明了联系人是我的单向好友
					toRoster.push(ros);
				}
			}
			if (bothRoster.length > 0) {
				curroster = bothRoster[0];
				// TODO Delete
				// buildContactDiv("contractlist", bothRoster);//联系人列表页面处理
				if (curroster)
					setCurrentContact(curroster.name); // 页面处理将第一个联系人作为当前聊天div
			}
			// 获取当前登录人的群组列表
			conn.listRooms({
				success: function(rooms) {
					if (rooms && rooms.length > 0) {
						buildListRoomDiv("contracgrouplist", rooms); // 群组列表页面处理
						if (curChatUserId == null) {
							console.log('set current contact:' + (groupFlagMark + rooms[0].roomId));
							setCurrentContact(groupFlagMark + rooms[0].roomId);

							// $('#accordion2').click();
						}
					}
					conn.setPresence(); // 设置用户上线状态，必须调用
				},
				error: function(e) {

				}
			});
		}
	});
	// 启动心跳
	if (conn.isOpened()) {
		conn.heartBeat(conn);
	}
};

// 连接中断时的处理，主要是对页面进行处理
var handleClosed = function() {
	curUserId = null;
	curChatUserId = null;
	curRoomId = null;
	bothRoster = [];
	toRoster = [];
	hiddenChatUI();
	/*
	 * clearContactUI("contactlistUL", "contactgrouplistUL", "momogrouplistUL",
	 * msgCardDivId);
	 */

	// /showLoginUI();
	groupQuering = false;
	textSending = false;
};
// easemobwebim-sdk中收到联系人订阅请求的处理方法，具体的type值所对应的值请参考xmpp协议规范
var handlePresence = function(e) {
	// （发送者希望订阅接收者的出席信息），即别人申请加你为好友
	if (e.type == 'subscribe') {
		if (e.status) {
			if (e.status.indexOf('resp:true') > -1) {
				agreeAddFriend(e.from);
				return;
			}
		}
		var subscribeMessage = e.from + "请求加你为好友。\n验证消息：" + e.status;
		showNewNotice(subscribeMessage);
		$('#confirm-block-footer-confirmButton').click(function() {
			// 同意好友请求
			agreeAddFriend(e.from); // e.from用户名
			// 反向添加对方好友
			conn.subscribe({
				to: e.from,
				message: "[resp:true]"
			});
			$('#confirm-block-div-modal').modal('hide');
		});
		$('#confirm-block-footer-cancelButton').click(function() {
			rejectAddFriend(e.from); // 拒绝加为好友
			$('#confirm-block-div-modal').modal('hide');
		});
		return;
	}
	// (发送者允许接收者接收他们的出席信息)，即别人同意你加他为好友
	if (e.type == 'subscribed') {
		toRoster.push({
			name: e.from,
			jid: e.fromJid,
			subscription: "to"
		});
		return;
	}
	// （发送者取消订阅另一个实体的出席信息）,即删除现有好友
	if (e.type == 'unsubscribe') {
		// 单向删除自己的好友信息，具体使用时请结合具体业务进行处理
		delFriend(e.from);
		return;
	}
	// （订阅者的请求被拒绝或以前的订阅被取消），即对方单向的删除了好友
	if (e.type == 'unsubscribed') {
		delFriend(e.from);
		return;
	}
};
// easemobwebim-sdk中处理出席状态操作
var handleRoster = function(rosterMsg) {
	for (var i = 0; i < rosterMsg.length; i++) {
		var contact = rosterMsg[i];
		if (contact.ask && contact.ask == 'subscribe') {
			continue;
		}
		if (contact.subscription == 'to') {
			toRoster.push({
				name: contact.name,
				jid: contact.jid,
				subscription: "to"
			});
		}
		// app端删除好友后web端要同时判断状态from做删除对方的操作
		if (contact.subscription == 'from') {
			toRoster.push({
				name: contact.name,
				jid: contact.jid,
				subscription: "from"
			});
		}
		if (contact.subscription == 'both') {
			var isexist = contains(bothRoster, contact);
			if (!isexist) {
				var lielem = $('<li>').attr({
					"id": contact.name,
					"class": "offline",
					"className": "offline"
				}).click(function() {
					chooseContactDivClick(this);
				});
				$('<img>').attr({
					"src": "img/head/contact_normal.png"
				}).appendTo(lielem);

				$('<span>').html(contact.name).appendTo(lielem);
				$('#contactlistUL').append(lielem);
				bothRoster.push(contact);
			}
		}
		if (contact.subscription == 'remove') {
			var isexist = contains(bothRoster, contact);
			if (isexist) {
				removeFriendDomElement(contact.name);
			}
		}
	}
};
var remindUser = 0; // 标记消息是否提醒
// 异常情况下的处理方法
var handleError = function(e) {
	if (remindUser) {
		remindUser = 1;
		if (curUserId == null) {
			// /hiddenWaitLoginedUI();
			// alert(e.msg + ",请重新登录");
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "聊天连接已断开,请重新登录");
			return;
			// /showLoginUI();
		} else {
			var msg = e.msg;
			if (e.type == EASEMOB_IM_CONNCTION_SERVER_CLOSE_ERROR) {
				if (msg == "" || msg == 'unknown') {
					// alert("服务器器断开连接,可能是因为在别处登录");
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示',
						"聊天连接已断开,请重新登录");
					return;
				} else {
					// alert("服务器器断开连接");
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示',
						"聊天连接已断开,请重新登录");
					return;
				}
			} else {
				// alert(msg);
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "聊天连接已断开,请重新登录");
				return;
			}
		}
	}
};
// 判断要操作的联系人和当前联系人列表的关系
var contains = function(roster, contact) {
	var i = roster.length;
	while (i--) {
		if (roster[i].name === contact.name) {
			return true;
		}
	}
	return false;
};

Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i].name == val.name)
			return i;
	}
	return -1;
};
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

// 登录系统时的操作方法
var login = function(name, gymName, gymHeadIcon) {
	var user = name;
	var pass = "123456";
	userPhone = user;
	headIcon = gymHeadIcon;
	userId = user;
	userSex = 'M';
	// userPassword = pass;
	if (user == '' || pass == '') {
		// alert("请输入用户名和密码");
		return;
	}
	// hiddenLoginUI();
	// showWaitLoginedUI();

	conn.open({
		apiUrl: apiURL,
		user: user,
		pwd: pass,
		// 连接时提供appkey
		appKey: appkey
			// accessToken :
			// 'YWMt8bfZfFk5EeSiAzsQ0OXu4QAAAUpoZFOMJ66ic5m2LOZRhYUsRKZWINA06HI'
	});
	userName = gymName;
	/*
	 * $.getJSON('../CoachAction!search.zk',{phoneNumber:user,passWord:pass},function(data){//http://192.168.1.107/Stepper/CoachAction!search.zk
	 * userName = data.name; headIcon = data.avatar; userId = data.id; userSex =
	 * data.sex; //userSex = "M"; if(data.STATUS){ //根据用户名密码登录系统 conn.open({
	 * apiUrl : apiURL, user : data.id, pwd : pass, //连接时提供appkey appKey :
	 * appkey //accessToken :
	 * 'YWMt8bfZfFk5EeSiAzsQ0OXu4QAAAUpoZFOMJ66ic5m2LOZRhYUsRKZWINA06HI' });
	 * //doResize(); //createMomogrouplistUL(null); }else{
	 * ///hiddenWaitLoginedUI(); ///showLoginUI();
	 *  } });
	 */
	return false;
};

// 注册页面返回登录页面操作
var showlogin = function() {
	$('#loginmodal').modal('show');
	$('#regist-div-modal').modal('hide');
};

var logout = function() {
	conn.close();
};
var nameSet = null;
// 设置当前显示的聊天窗口div，如果有联系人则默认选中联系人中的第一个联系人，如没有联系人则当前div为null-nouser
var setCurrentContact = function(defaultUserId) {
	showContactChatDiv(defaultUserId, nameSet);
	if (curChatUserId != null) {
		hiddenContactChatDiv(curChatUserId);
	} else {
		$('#null-nouser').css({
			"display": "none"
		});
	}
	curChatUserId = defaultUserId;
};

// 构造联系人列表
/*
 * var buildContactDiv = function(contactlistDivId, roster) { var uielem =
 * document.getElementById("contactlistUL"); var cache = {}; for (i = 0; i <
 * roster.length; i++) { if (!(roster[i].subscription == 'both' ||
 * roster[i].subscription == 'from')) { continue; } var jid = roster[i].jid; var
 * userName = jid.substring(jid.indexOf("_") + 1).split("@")[0]; if (userName in
 * cache) { continue; } cache[userName] = true; var lielem = $('<li>').attr({
 * 'id' : userName, 'class' : 'offline', 'className' : 'offline', 'type' :
 * 'chat', 'displayName' : userName }).click(function() {
 * chooseContactDivClick(this); }); $('<img>').attr("src",
 * "img/head/contact_normal.png").appendTo( lielem); $('<span>').html(userName).appendTo(lielem);
 * $('#contactlistUL').append(lielem); } var contactlist =
 * document.getElementById(contactlistDivId); var children =
 * contactlist.children; if (children.length > 0) {
 * contactlist.removeChild(children[0]); } contactlist.appendChild(uielem); };
 */

// 构造群组列表
var cache = {}; // 保存已有的群组
var buildListRoomDiv = function(contactlistDivId, rooms) {
	var uielem = document.getElementById("contactgrouplistUL");

	for (var i = 0; i < rooms.length; i++) {
		var roomsName = rooms[i].name;
		var roomId = rooms[i].roomId;
		if (roomId in cache) {
			continue;
		}
		cache[roomId] = true;
		var lielem = $('<li>').attr({
			'id': groupFlagMark + roomId,
			'class': 'offline',
			'className': 'offline',
			'type': 'groupchat',
			'displayName': roomsName,
			'roomId': roomId,
			'value': '{' + '"groupIcon":' + '""' + ',' + '"groupId":' + '"' + roomId + '"' + ',' + '"groupName":' + '"' + roomsName + '"' + ',' + '"groupType":' + '"course"' + '}',

			'joined': 'false'
		}).click(function() {
			chooseContactDivClick(this);
		});
		$('<img>').attr({
			'src': 'img/head/group_normal.png'
		}).appendTo(lielem);
		$('<span>').html(roomsName).appendTo(lielem);
		$('#contactgrouplistUL').append(lielem);
	}
	var contactlist = document.getElementById(contactlistDivId);
	var children = contactlist.children;
	if (children.length > 0) {
		contactlist.removeChild(children[0]);
	}
	contactlist.appendChild(uielem);
};

// 选择联系人的处理
var getContactLi = function(chatUserId) {
	/*
	 * $.getJSON('../UserCourseAction!listNew1.zk',{userId:chatUserId},function(data){
	 * if(data.STATUS){ for(var i in data.students){ var courseId =
	 * data.students[i].courseId; var userId = data.students[i].userId;
	 * if(document.getElementById(courseId+"-"+userId)) } } }
	 */
	return document.getElementById(chatUserId);
};

// 构造当前聊天记录的窗口div
var getContactChatDiv = function(chatUserId) {

	return document.getElementById(curUserId + "-" + chatUserId);
};

// 如果当前没有某一个联系人的聊天窗口div就新建一个
var createContactChatDiv = function(chatUserId) {
	var msgContentDivId = curUserId + "-" + chatUserId;
	var newContent = document.createElement("div");
	$(newContent).attr({
		"id": msgContentDivId,
		"class": "chat01_content",
		"className": "chat01_content",
		"style": "display:none"
	});
	// $(newContent).css({'height':$(window).height()*0.9*0.59-42});
	return newContent;
};

// 显示当前选中联系人的聊天窗口div，并将该联系人在联系人列表中背景色置为蓝色
var showContactChatDiv = function(chatUserId, chatUserName) {

	var contentDiv = getContactChatDiv(chatUserId);
	if (contentDiv == null) {
		contentDiv = createContactChatDiv(chatUserId);
		document.getElementById(msgCardDivId).appendChild(contentDiv);
	}
	contentDiv.style.display = "block";
	var contactLi = document.getElementById(chatUserId);
	if (contactLi == null) {
		return;
	}
	// contactLi.style.backgroundColor = "#33CCFF";
	// contactLi.style.border="1px solid #33CCFF";
	contactLi.style.color = "#FED500";
	var dispalyTitle = null; // 聊天窗口显示当前对话人名称
	if (chatUserId.indexOf(groupFlagMark) >= 0) {
		dispalyTitle = "群组" + $(contactLi).attr('displayname') + "聊天中";
		curRoomId = $(contactLi).attr('roomid');
		$("#roomMemberImg").css('display', 'block');
	} else {
		dispalyTitle = "与" + chatUserName + "聊天中";
		$("#roomMemberImg").css('display', 'none');
	}

	/*
	 * document.getElementById(talkToDivId).children[0].innerHTML =
	 * dispalyTitle;
	 */
};
// 对上一个联系人的聊天窗口div做隐藏处理，并将联系人列表中选择的联系人背景色置空
var hiddenContactChatDiv = function(chatUserId) {
	var contactLi = document.getElementById(chatUserId);
	if (contactLi) {
		// contactLi.style.backgroundColor = "";
		// contactLi.style.border="";
		contactLi.style.color = "#fff";
	}
	var contentDiv = getContactChatDiv(chatUserId);
	if (contentDiv) {
		contentDiv.style.display = "none";

	}

};
// 刷新操作处理

// 获取token
var gettoken = function(type) {
	// 本地
	var Client_Id = "YXA6s3jZQHkAEeSvivXzQkAWdQ"; // $("#Client_Id").val();
	var Client_Secret = "YXA6HIOk2xIjsQUGxMKXWXPloWc2u8M"; // $("#Client_Secret").val();
	var Appkey = "zkim2014#stepper"; // $("#Appkey").val();

	// 云端
	/*
	 * var Client_Id = "YXA6VNbMIK_8EeSunqNJLeoMnw";//$("#Client_Id").val(); var
	 * Client_Secret =
	 * "YXA6iHc9AWTAW1FNBjhCxLrfFnghp6o";//$("#Client_Secret").val(); var
	 * Appkey="zkim2014#zkim";
	 */
	Appkey = Appkey.replace("#", "/");
	var url = 'https://a1.easemob.com/' + Appkey + '/token';
	var client_credentials = "client_credentials";
	var token = null;
	var requestData = {
		grant_type: client_credentials,
		client_id: Client_Id,
		client_secret: Client_Secret
	};

	$.ajax({
		type: "post",
		dataType: "json",
		url: url,
		// data: '{"grant_type": "client_credentials", "client_id":
		// "YXA6QpKQoFUAEeSAPsXiXiKQ6Q", "client_secret":
		// "YXA6UJRXDXzpr2KJ-dx644NOlUig7gc"}',
		data: JSON.stringify(requestData),
		success: function(data, textStatus) {
			token = data;
			// token = JSON.stringify(token.access_token);
			token = token.access_token;
			console.log(token);
			var url1 = 'https://a1.easemob.com/' + Appkey + '/users/' + userId;
			if (token != null) {
				if (type == 'groupchat')
					nickname = userName + "(" + curChatTo.groupName + ")";
				else
					nickname = userName;
				nickname = JSON.stringify({
					"nickname": nickname
				});
				// token = JSON.stringify({"Authorization":"Bearer "+token});
				var options = {
					dataType: 'json', // default
					success: function() {}, // handle request success},
					error: function() {}, // handle request error},
					type: 'put', // default 'post'
					url: url1,
					headers: {
						"Authorization": "Bearer " + token
					}, // default {}
					data: nickname
						// default null
				};
				Easemob.im.Helper.xhr(options);
			}

			// document.write("token:"+token.access_token+"<br/>");
			// document.write("有效期："+token.expires_in+"秒");
			// var token=$("#sendContent").val();
		}
	});
	// return token;
};

// 切换联系人聊天窗口div
var chooseContactDivClick = function(li) {
	var chatUserId = li.id;
	var chatUsername = li.title;
	var nickname = null;
	// //设置当前聊天用户的信息
	var curMessage = eval('(' + $('#' + li.id).attr("data-value") + ')');

	if (curMessage.userName != null)
		$('#curChatName').text(curMessage.userName);
	else
		$('#curChatName').text('');
	if (curMessage.userSex == 'M')
		$('#curChatSex').text('男');
	else if (curMessage.userSex == 'F')
		$('#curChatSex').text('女');
	else
		$('#curChatSex').text('');
	if (curMessage.userAge != null)
		$('#curChatAge').text(curMessage.userAge);
	else
		$('#curChatAge').text('');
	/*
	 * if(curMessage.userRemark!=null)
	 * $('#curChatOccupation').text(curMessage.userRemark); else
	 * $('#curChatOccupation').text('');
	 */
	curChatTo = document.getElementById(li.id).getAttribute("value");
	curChatTo = jQuery.parseJSON(curChatTo);
	var type = document.getElementById(li.id).getAttribute("type");
	// curChatTo=eval('('+curChatTo+')');
	gettoken(type); // 获取token修改nickname

	if ($(li).attr("type") == 'groupchat' && ('true' != $(li).attr("joined"))) {
		conn.join({
			roomId: $(li).attr("roomId")
		});
		$(li).attr("joined", "true");
	}
	if (chatUserId != curChatUserId) {
		if (curChatUserId == null) {
			showContactChatDiv(chatUserId, chatUsername);
		} else {
			showContactChatDiv(chatUserId, chatUsername);
			hiddenContactChatDiv(curChatUserId);
		}
		curChatUserId = chatUserId;
	}

	// 对默认的null-nouser div进行处理,走的这里说明联系人列表肯定不为空所以对默认的聊天div进行处理

	// if(del != "delete"){
	$('#null-nouser').css({
		"display": "none"
	});
	// }
	// curChatUserId = "shanchu";

	var badgespan = $(li).children(".badge");
	if (badgespan && badgespan.length > 0) {
		if (type == "chat")
			li.removeChild(li.children[3]); // 2 to 3
		else
			li.removeChild(li.children[2]);
	}
	/*
	 * //点击有未读消息对象时对未读消息提醒的处理 var badgespanGroup =
	 * $(li).parent().parent().parent().find(".badge"); if (badgespanGroup &&
	 * badgespanGroup.length == 0) {
	 * $(li).parent().parent().parent().prev().children().children() .remove(); }
	 */
	$('#actionSend').children().remove();
	remarkMessage = false;
};
/*
 * var clearContactUI = function(contactlistUL, contactgrouplistUL,
 * momogrouplistUL, contactChatDiv) { //清除左侧联系人内容 $('#contactlistUL').empty();
 * $('#contactgrouplistUL').empty(); $('#momogrouplistUL').empty();
 * 
 * //处理联系人分组的未读消息处理 var accordionChild = $('#accordionDiv').children(); for (var
 * i = 1; i <= accordionChild.length; i++) { var badgegroup = $('#accordion' +
 * i).find(".badgegroup"); if (badgegroup && badgegroup.length > 0) {
 * $('#accordion' + i).children().remove(); } } ;
 * 
 * //清除右侧对话框内容 document.getElementById(talkToDivId).children[0].innerHTML = "";
 * var chatRootDiv = document.getElementById(contactChatDiv); var children =
 * chatRootDiv.children; for (var i = children.length - 1; i > 1; i--) {
 * chatRootDiv.removeChild(children[i]); } $('#null-nouser').css({ "display" :
 * "block" }); };
 */

var emotionFlag = false;
var showEmotionDialog = function() {
	$("#word").fadeOut("fast");
	if (emotionFlag) {
		$('#wl_faces_box').css({
			"display": "block"
		});
		return;
	}
	emotionFlag = true;
	// Easemob.im.Helper.EmotionPicData设置表情的json数组
	var sjson = Easemob.im.Helper.EmotionPicData;
	for (var key in sjson) {
		var emotions = $('<img>').attr({
			"id": key,
			"src": sjson[key],
			"style": "cursor:pointer;"
		}).click(function() {
			selectEmotionImg(this);
		});
		$('<li>').append(emotions).appendTo($('#emotionUL'));
	}
	$('#wl_faces_box').css({
		"display": "block"
	});
};
var showWord = function() {
	$("#wl_faces_box").fadeOut("fast");
	if (emotionFlag) {
		$('#word').css({
			"display": "block"
		});
		return;
	}
	$('#word').css({
		"display": "block"
	});
};
// 表情选择div的关闭方法
var turnoffFaces_box = function() {
	$("#wl_faces_box").fadeOut("fast");
};
var turnoff = function() {
	$("#word").fadeOut("fast");
};
var selectEmotionImg = function(selImg) {
	var txt = document.getElementById(talkInputId);
	txt.value = txt.value + selImg.id;
	txt.focus();
};
var selectWord = function(word) {
	var txt = document.getElementById(talkInputId);
	txt.value = txt.value + word;
	txt.focus();
	sendText();
};
var showSendPic = function() {
	$("#wl_faces_box").fadeOut("fast");
	$("#word").fadeOut("fast");
	$('#fileModal').modal('toggle');
	$('#sendfiletype').val('pic');
	$('#send-file-warning').html("");
};
var showSendAudio = function() {
	$("#wl_faces_box").fadeOut("fast");
	$("#word").fadeOut("fast");
	$('#fileModal').modal('toggle');
	$('#sendfiletype').val('audio');
	$('#send-file-warning').html("");
};

var sendText = function() {
	var len = document.getElementById("momogrouplistUL").getElementsByTagName(
		"li").length;
	if (len < 1)
		return;

	if (textSending) {
		textSending = false;
		return;
	}
	$('#talkInputId').css({
		'height': 25
	});
	turnoffFaces_box();
	turnoff();

	textSending = true;
	var msgInput = document.getElementById(talkInputId);
	var msg = msgInput.value;

	if (msg == null || msg.length == 0) {
		return;
	}
	var to = curChatUserId;
	if (to == null) {
		return;
	}
	var options = {
		type: "chat",
		from: userId,
		to: to,
		msg: msg,

		"ext": {
			"from": {
				"address": "",
				"age": 21,
				"birthYear": 1994,
				"bmi": 16.130613,
				"gmtCreate": "",
				"gmtModify": "",
				"gpsX": 30.500119,
				"gpsY": 114.434681,
				"headIcon": headIcon,
				"height": 175,
				"isDeleted": "",
				"level": 2,
				"login": true,
				"oldWeight": 49.4,
				"phone": "***",
				"rank": 11,
				"sex": userSex,
				"totalCalorie": 671,
				"totalSteps": 9406,
				"totalUsedTime": 536,
				"userId": userId,
				"userName": userName,
				"userPassword": "",
				"weight": 49.4
			},
			"to": curChatTo
		}
	};
	// 群组消息和个人消息的判断分支
	if (curChatUserId.indexOf(groupFlagMark) >= 0) {
		options.type = 'groupchat';

		options.to = curRoomId;
	}
	// easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
	conn.sendTextMessage(options);

	// 当前登录人发送的信息在聊天窗口中原样显示
	var msgtext = msg.replace(/\n/g, '<br>');
	var msg = {
		"type": "chat",
		"from": to,
		// "to" :curUserId ,
		"to": "send",
		"data": msgtext,
		"ext": {
			"from": {
				"address": "",
				"age": 21,
				"birthYear": 1994,
				"bmi": 16.130613,
				"gmtCreate": "",
				"gmtModify": "",
				"gpsX": 30.500119,
				"gpsY": 114.434681,
				"headIcon": headIcon,
				"height": 175,
				"isDeleted": "",
				"level": 2,
				"login": true,
				"oldWeight": 49.4,
				"phone": "***",
				"rank": 11,
				"sex": userSex,
				"totalCalorie": 671,
				"totalSteps": 9406,
				"totalUsedTime": 536,
				"userId": to,
				"userName": userName,
				"userPassword": "",
				"weight": 49.4
			},
			"to": curChatTo
		}
	};
	// {"userId":"1417511982256192001","userName":"陶妍菲","userPassword":"***","weight":49.4},"to":"null"}}
	appendMsg1(msg);
	turnoffFaces_box();
	turnoff();
	msgInput.value = "";
	msgInput.focus();

	setTimeout(function() {
		textSending = false;
	}, 1000);
};

var pictype = {
	"jpg": true,
	"gif": true,
	"png": true,
	"bmp": true
};
var sendFile = function() {
	var type = $("#sendfiletype").val();
	if (type == 'pic') {
		sendPic();
	} else {
		sendAudio();
	}
};
// 发送图片消息时调用方法
var sendPic = function() {
	var len = document.getElementById("momogrouplistUL").getElementsByTagName(
		"li").length;
	if (len < 1)
		return;

	var to = curChatUserId;
	if (to == null) {
		return;
	}
	// Easemob.im.Helper.getFileUrl为easemobwebim-sdk获取发送文件对象的方法，fileInputId为
	// input 标签的id值
	var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
	if (fileObj.url == null || fileObj.url == '') {
		$('#send-file-warning').html("<font color='#FF0000'>请选择发送图片</font>");
		return;
	}
	var filetype = fileObj.filetype;
	var filename = fileObj.filename;
	if (filetype in pictype) {
		document.getElementById("fileSend").disabled = true;
		document.getElementById("cancelfileSend").disabled = true;
		var opt = {
			type: 'chat',
			fileInputId: fileInputId,
			to: to,
			onFileUploadError: function(error) {
				$('#fileModal').modal('hide');
				var messageContent = error.msg + ",发送图片文件失败:" + filename;
				var msg = {
					"type": "chat",
					"from": to,
					// "to" : curUserId,
					"to": "send",
					"data": messageContent,

					"ext": {
						"from": {
							"userName": userName
						},
						"to": {
							"userName": "客服002"
						}
					}
				};
				// appendMsg1(curUserId, to, messageContent);
				appendMsg1(msg);
			},
			onFileUploadComplete: function(data) {
				$('#fileModal').modal('hide');
				var file = document.getElementById(fileInputId);
				if (file && file.files) {
					var objUrl = getObjectURL(file.files[0]);
					if (objUrl) {
						var img = document.createElement("img");
						img.src = objUrl;
						img.width = maxWidth;
					}
				} else {
					filename = data.filename || '';
					var img = document.createElement("img");
					img.src = data.uri + '/' + data.entities[0].uuid + '?token=';
					img.width = maxWidth;
				}
				/*
				 * appendMsg1(curUserId, to, { data : [ { type : 'pic', filename :
				 * filename, data : img } ] });
				 */
				var data = [{
					type: 'pic',
					filename: filename,
					data: img
				}];
				msg = {
					"type": "chat",
					"from": to,
					// "to" : curUserId,
					"to": "send",
					"data": data,
					"ext": {
						"from": {
							"sex": userSex,
							"userId": curUserId,
							"headIcon": headIcon,
							"userName": userName
						},
						"to": curChatTo
					}
				};
				// "sex":"F","userId":"1426469700539895401","headIcon":"2015512-115132498.jpg","userName":"Alone
				// .ffg"
				appendMsg1(msg);
				$('#fileModal').modal('hide');
			},
			// flashUpload: flashUpload,
			"ext": {
				"from": {
					"sex": userSex,
					"userId": curUserId,
					"headIcon": headIcon,
					"userName": userName
				},
				"to": curChatTo
			}
		};

		if (curChatUserId.indexOf(groupFlagMark) >= 0) {
			opt.type = 'groupchat';
			opt.to = curRoomId;
		}
		opt.apiUrl = apiURL;
		conn.sendPicture(opt);
		return;
	}
	$('#send-file-warning').html(
		"<font color='#FF0000'>不支持此图片类型" + filetype + "</font>");
};
var audtype = {
	"mp3": true,
	"wma": true,
	"wav": true,
	"amr": true,
	"avi": true
};
// 发送音频消息时调用的方法
var sendAudio = function() {
	var len = document.getElementById("momogrouplistUL").getElementsByTagName(
		"li").length;
	if (len < 1)
		return;
	var to = curChatUserId;
	if (to == null) {
		return;
	}
	// 利用easemobwebim-sdk提供的方法来构造一个file对象
	var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
	if (fileObj.url == null || fileObj.url == '') {
		$('#send-file-warning').html("<font color='#FF0000'>请选择发送音频</font>");
		return;
	}
	var filetype = fileObj.filetype;
	var filename = fileObj.filename;
	if (filetype in audtype) {
		document.getElementById("fileSend").disabled = true;
		document.getElementById("cancelfileSend").disabled = true;
		var opt = {
			type: "chat",
			fileInputId: fileInputId,
			to: to, // 发给谁
			onFileUploadError: function(error) {
				$('#fileModal').modal('hide');
				var messageContent = error.msg + ",发送音频失败:" + filename;
				var msg = {
					"data": messageContent,
					// "to" :curUserId,
					"to": "send",
					"from": to,
					"ext": {
						"from": {
							"userName": "客服001"
						},
						"to": curChatTo
					}
				};
				// appendMsg1(curUserId, to, messageContent);
				appendMsg1(msg);
			},
			onFileUploadComplete: function(data) {
				var messageContent = "发送音频" + filename;
				$('#fileModal').modal('hide');
				var msg = {
					"data": messageContent,
					// "to" : curUserId,
					"to": "send",
					"from": to,
					"ext": {
						"from": {
							"userName": "客服001"
						},
						"to": {
							"userName": "客服002"
						}
					}
				};
				// appendMsg1(curUserId, to, messageContent);
				appendMsg1(msg);
			},
			"ext": {
				"from": {
					"sex": userSex,
					"userId": curUserId,
					"headIcon": headIcon,
					"userName": userName
				},
				"to": curChatTo
			}
		};
		// 构造完opt对象后调用easemobwebim-sdk中发送音频的方法
		if (curChatUserId.indexOf(groupFlagMark) >= 0) {
			opt.type = 'groupchat';
			opt.to = curRoomId;
		}
		opt.apiUrl = apiURL;
		conn.sendAudio(opt);
		return;
	}
	$('#send-file-warning').html(
		"<font color='#FF0000'>不支持此音频类型" + filetype + "</font>");
};
// easemobwebim-sdk收到文本消息的回调方法的实现
var handleTextMessage = function(message) {

	var from = message.from; // 消息的发送者
	var mestype = message.type; // 消息发送的类型是群组消息还是个人消息
	var messageContent = message.data; // 文本消息体
	// TODO 根据消息体的to值去定位那个群组的聊天记录
	var room = message.to;
	// 普通聊天
	/*
	 * if (mestype == 'groupchat') { appendMsg(message.from, message.to,
	 * messageContent, mestype); }
	 */
	if (mestype == 'chat') {
		console.log('message:' + JSON.stringify(message));
		console.log("from:" + from);
		appendMsg1(message); // /////////////////appendMsg1New
	} else {
		console.log('message:' + JSON.stringify(message));
		console.log("from:" + from);
		appendMsg1(message); // /////////////////appendMsg1New
	}

};
// easemobwebim-sdk收到表情消息的回调方法的实现，message为表情符号和文本的消息对象，文本和表情符号sdk中做了
// 统一的处理，不需要用户自己区别字符是文本还是表情符号。
var handleEmotion = function(message) {
	var from = message.from;
	var room = message.to;
	var mestype = message.type; // 消息发送的类型是群组消息还是个人消息
	if (mestype == 'chat') {
		console.log('emoji message:' + JSON.stringify(message));
		appendMsg1(message); // /////////////////////appendMsg1New
	} else {
		// console.log('message:'+JSON.stringify(message));
		// console.log("from:"+from);
		appendMsg1(message); // /////////////////appendMsg1New
	}

};
// easemobwebim-sdk收到图片消息的回调方法的实现
var handlePictureMessage = function(message) {
	var filename = message.filename; // 文件名称，带文件扩展名
	var from = message.from; // 文件的发送者
	var mestype = message.type; // 消息发送的类型是群组消息还是个人消息
	var contactDivId = from;
	if (mestype == 'groupchat') {
		contactDivId = groupFlagMark + message.to;
	}
	var options = message;
	// 图片消息下载成功后的处理逻辑
	options.onFileDownloadComplete = function(response, xhr) {
		var objectURL = window.URL.createObjectURL(response);
		img = document.createElement("img");
		img.onload = function(e) {
			img.onload = null;
			window.URL.revokeObjectURL(img.src);
		};
		img.onerror = function() {
			img.onerror = null;
			if (typeof FileReader == 'undefined') {
				img.alter = "当前浏览器不支持blob方式";
				return;
			}
			img.onerror = function() {
				img.alter = "当前浏览器不支持blob方式";
			};
			var reader = new FileReader();
			reader.onload = function(event) {
				img.src = this.result;
			};
			reader.readAsDataURL(response);
		};
		img.src = objectURL;
		var pic_real_width = options.width;

		if (pic_real_width == 0) {
			$("<img/>").attr("src", objectURL).load(function() {
				pic_real_width = this.width;
				if (pic_real_width > maxWidth) {
					img.width = maxWidth;
				} else {
					img.width = pic_real_width;
				}
				appendMsg1(from, contactDivId, {
					data: [{
						type: 'pic',
						filename: filename,
						data: img
					}]
				});

			});
		} else {
			if (pic_real_width > maxWidth) {
				img.width = maxWidth;
			} else {
				img.width = pic_real_width;
			}

			message.data = [{
				type: 'pic',
				filename: filename,
				data: img
			}];

			appendMsg1(message); // ///////////////////////appendMsg1New
		}
	};

	var redownLoadFileNum = 0;
	options.onFileDownloadError = function(e) {
		// 下载失败时只重新下载一次
		if (redownLoadFileNum < 1) {
			redownLoadFileNum++;
			options.accessToken = options_c;
			Easemob.im.Helper.download(options);

		} else {
			appendMsg(from, contactDivId, e.msg + ",下载图片" + filename + "失败");
			redownLoadFileNum = 0;
		}

	};
	// easemobwebim-sdk包装的下载文件对象的统一处理方法。
	Easemob.im.Helper.download(options);
};

// easemobwebim-sdk收到音频消息回调方法的实现
var handleAudioMessage = function(message) {
	var filename = message.filename;
	var filetype = message.filetype;
	var from = message.from;
	var mestype = message.type; // 消息发送的类型是群组消息还是个人消息
	var contactDivId = from;
	if (mestype == 'groupchat') {
		contactDivId = groupFlagMark + message.to;
	}
	var options = message;
	options.onFileDownloadComplete = function(response, xhr) {
		var objectURL = window.URL.createObjectURL(response);
		var audio = document.createElement("audio");
		if (("src" in audio) && ("controls" in audio)) {
			audio.onload = function() {
				audio.onload = null;
				window.URL.revokeObjectURL(audio.src);
			};
			audio.onerror = function() {
				audio.onerror = null;
				appendMsg1(from, contactDivId, "当前浏览器不支持播放此音频:" + filename);
			};
			audio.controls = "controls";
			audio.src = objectURL;

			message.data = [{
				type: 'audio',
				filename: filename,
				data: audio
			}];
			appendMsg1(message); // ////////////////////appendMsg1New
			// audio.play();
			return;
		} else {
			message.data = [{
				type: 'audio',
				filename: filename || '',
				data: {
					currentSrc: objectURL
				},
				audioShim: true
			}];

		}
	};
	options.onFileDownloadError = function(e) {
		appendMsg(from, contactDivId, e.msg + ",下载音频" + filename + "失败");
	};
	options.headers = {
		"Accept": "audio/mp3"
	};
	Easemob.im.Helper.download(options);
};

// 处理收到文件消息
var handleFileMessage = function(message) {
	var filename = message.filename;
	var filetype = message.filetype;
	var from = message.from;

	var mestype = message.type; // 消息发送的类型是群组消息还是个人消息
	var contactDivId = from;
	if (mestype == 'groupchat') {
		contactDivId = groupFlagMark + message.to;
	}
	var options = message;
	options.onFileDownloadComplete = function(response, xhr) {
		var spans = "收到文件消息:" + filename + '   ';
		var content = spans + "【<a href='" + window.URL.createObjectURL(response) + "' download='" + filename + "'>另存为</a>】";
		appendMsg(from, contactDivId, content);
		return;
	};
	options.onFileDownloadError = function(e) {
		appendMsg(from, contactDivId, e.msg + ",下载文件" + filename + "失败");
	};
	Easemob.im.Helper.download(options);
};

// 收到视频消息
var handleVideoMessage = function(message) {

	var filename = message.filename;
	var filetype = message.filetype;
	var from = message.from;

	var mestype = message.type; // 消息发送的类型是群组消息还是个人消息
	var contactDivId = from;
	if (mestype == 'groupchat') {
		contactDivId = groupFlagMark + message.to;
	}
	var options = message;
	options.onFileDownloadComplete = function(response, xhr) {
		// var spans = "收到视频消息:" + filename;
		// appendMsg(from, contactDivId, spans);
		var objectURL = window.URL.createObjectURL(response);
		var video = document.createElement("video");
		if (("src" in video) && ("controls" in video)) {
			video.onload = function() {
				video.onload = null;
				window.URL.revokeObjectURL(video.src);
			};
			video.onerror = function() {
				video.onerror = null;
				appendMsg(from, contactDivId, "当前浏览器不支持播放此音频:" + filename);
			};
			video.src = objectURL;
			video.controls = "controls";
			video.width = "320";
			video.height = "240";
			message.data = [{
				type: 'video',
				filename: filename,
				data: video
			}];
			appendMsg1(message); // ////////////////////appendMsg1New
			// audio.play();
			return;
		}

	};
	options.onFileDownloadError = function(e) {
		appendMsg(from, contactDivId, e.msg + ",下载音频" + filename + "失败");
	};
	Easemob.im.Helper.download(options);
};

var handleLocationMessage = function(message) {
	var from = message.from;
	var to = message.to;
	var mestype = message.type;
	var content = message.addr;
	if (mestype == 'groupchat') {
		appendMsg(from, to, content, mestype);
	} else {
		appendMsg(from, from, content, mestype);
	}
};

var handleInviteMessage = function(message) {
	var type = message.type;
	var from = message.from;
	var roomId = message.roomid;

	// 获取当前登录人的群组列表
	conn.listRooms({
		success: function(rooms) {
			if (rooms) {
				for (var i = 0; i < rooms.length; i++) {
					var roomsName = rooms[i].name;
					var roomId = rooms[i].roomId;
					var existRoom = $('#contactgrouplistUL').children(
						'#group--' + roomId);
					if (existRoom && existRoom.length == 0) {
						var lielem = $('<li>').attr({
							'id': groupFlagMark + roomId,
							'class': 'offline',
							'className': 'offline',
							'type': 'groupchat',
							'displayName': roomsName,
							'roomId': roomId,
							'joined': 'false'
						}).click(function() {
							chooseContactDivClick(this);
						});
						$('<img>').attr({
							'src': 'img/head/group_normal.png'
						}).appendTo(lielem);
						$('<span>').html(roomsName).appendTo(lielem);
						$('#contactgrouplistUL').append(lielem);
						// return;
					}
				}
				// cleanListRoomDiv();//先将原群组列表中的内容清除，再将最新的群组列表加入
				// buildListRoomDiv("contracgrouplist", rooms);//群组列表页面处理
			}
		},
		error: function(e) {}
	});

};
var cleanListRoomDiv = function cleanListRoomDiv() {
	$('#contactgrouplistUL').empty();
};

var array = [];
// var cacheUser = {};
// 学员展示
var createMomogrouplistUL = function createMomogrouplistUL(msg) {
	var who;
	var userName_1;
	var ul;
	var fenzu;
	// var momogrouplistUL = document.getElementById("momogrouplistUL");
	// var momogrouplist = document.getElementById("momogrouplist");
	var momogrouplistUL = document.getElementById("momogrouplistUL");
	who = msg.from;
	var cacheUser = {};
	if (who in cacheUser) {
		return;
	}
	userName_1 = msg.ext.from.userName;
	var message1 = {
		"userSex": msg.ext.from.sex,
		"userId": who,
		"headIcon": msg.ext.from.headIcon,
		"userName": userName_1,
		"userAge": msg.ext.from.age
	}; // "userRemark":msg.userRemark
	cacheUser[who] = true;
	var lielem = document.createElement("li");
	$(lielem).attr({
		'id': who,
		'class': 'offline',
		'className': 'offline',
		'type': 'chat',
		'displayName': who,
		'position': 'relative',
		'data-value': JSON.stringify(message1),
		'title': userName_1,
		'value': JSON.stringify(message1)
	});
	lielem.onclick = function() {
		deleteLi = this;
		if (isDel) {
			// momogrouplistUL.removeChild(deleteLi);
			var child = document.getElementById(this.id);
			var parent = child.parentNode; // 这就是child的父节点。
			parent.removeChild(deleteLi);
			var chatDivId = curUserId + "-" + deleteLi.id;
			var chatDiv = document.getElementById(chatDivId); // $('#' +
			// chatDivId);
			if (chatDiv) {
				chatDiv.parentNode.removeChild(chatDiv);
				// chatDiv.remove();
			}
			if (deleteLi.id == curChatUserId) {
				var list = momogrouplistUL.childNodes;
				// var list =
				// momogrouplist.getElementsByTagName("ul").item(0).getElementsByTagName("li");
				if (list.length > 0) {
					chooseContactDivClick(list.item(0));
					// /showStudyMessage(list.item(0).id);
				} else {

					document.getElementById("null-nouser").style.display = "block";
					curChatUserId = "is null";
					$('#talkTo').html('<a href="#">' + "" + '</a>');
				}
			}

			isDel = false;
		} else {
			isDel = false;
			chooseContactDivClick(this);
			// //showStudyMessage(this.id);
		}

	};

	lielem.onmouseover = function() {
		document.getElementById(this.id + 'del').style.display = "block";
	};
	lielem.onmouseout = function() {
		document.getElementById(this.id + 'del').style.display = "none";
	};
	var imgelem = document.createElement("img");
	// ../file/FileCenter!showImage2.zk?name=msg.ext.from.headIcon
	var headIcon = "img/head/contact_normal.png";
	if (msg.ext.from.headIcon) {
		headIcon = '../file/FileCenter!showImage2.zk?name=' + msg.ext.from.headIcon;
	}
	imgelem.setAttribute("src", headIcon);
	imgelem.style.width = '35px';
	imgelem.style.height = '35px';
	imgelem.style.margin = '5px';
	lielem.appendChild(imgelem);
	var spanelem = document.createElement("span");
	if (userName_1.length > 15)
		spanelem.innerHTML = userName_1.substr(0, 13) + '...';
	else
		spanelem.innerHTML = userName_1;
	spanelem.id = who + "name";
	spanelem.style.width = '120px';
	// spanelem.style.color = '#fff';
	spanelem.style.marginLeft = '0px';
	lielem.appendChild(spanelem);
	var shanchu = document.createElement("img");
	shanchu.setAttribute("src", 'img/Delete.png');
	shanchu.id = who + "del";
	shanchu.style.width = '12px';
	shanchu.style.height = '12px';
	shanchu.style.display = "none";
	shanchu.style.position = "absolute";
	// shanchu.style.left = '140px';
	shanchu.style.top = '17px';
	shanchu.style.left = 650 * 0.28 - 12 + 'px'; // $('#content').width()
	shanchu.style.cursor = 'pointer';
	shanchu.onclick = function() {
		isDel = true;
	};
	lielem.appendChild(shanchu);
	// momogrouplistUL.appendChild(lielem);
	momogrouplistUL.insertBefore(lielem, momogrouplistUL.firstChild)
		// ul.appendChild(lielem);

};

// 显示聊天记录的统一处理方法
var appendMsg = function(who, contact, message, chattype) {

};
// 显示聊天记录的统一处理方法
var appendMsg1 = function(msg) {
	var who = msg.from; // 消息的发送者
	var contact = who;
	var to = msg.to; // 接收消息
	var message = msg.data; // 文本消息体
	var chattype = msg.type;
	if (who == "10001")
		return;
	nameSet = msg.ext.from.userName;
	/*
	 * if(chattype=='groupchat') curChatTo = msg.ext.to; else curChatTo =
	 * msg.ext.from;
	 */
	// var contactUL = document.getElementById("contactlistUL");
	var contactDivId = contact;
	if (chattype && chattype == 'groupchat') {
		contactDivId = groupFlagMark + to;
	}
	var contactLi = getContactLi(contactDivId);
	if (contactLi == null) {
		// console.log('append msg:' + message);
		createMomogrouplistUL(msg);
	} else {
		var father = document.getElementById("momogrouplistUL");
		father.insertBefore(contactLi, father.firstChild);
	}

	// 消息体 {isemotion:true;body:[{type:txt,msg:ssss}{type:emotion,msg:imgdata}]}
	var localMsg = null;
	// console.log('type of message:' + (typeof message) );
	if (typeof message == 'string') {
		localMsg = Easemob.im.Helper.parseTextMessage(message);
		localMsg = localMsg.body;
	} else {
		localMsg = message;
	}
	var headstr = [
		"<p1 style='color:#929292;font-weight:lighter;'>" + msg.ext.from.userName + "   <span></span>" + "   </p1>",
		"<p2 style='color:#929292;font-weight:lighter;'>" + getLoacalTimeString() + "<b></b><br/></p2>"
	];
	var header = $(headstr.join(''))

	var lineDiv = document.createElement("div");
	// lineDiv.style.height = 30+'px';
	lineDiv.style.padding = 5 + 'px';
	for (var i = 0; i < header.length; i++) {
		var ele = header[i];
		lineDiv.appendChild(ele);
	}
	var messageContent = localMsg;
	// console.log('appendMsg1 messageContent:'+messageContent);
	for (var i = 0; i < messageContent.length; i++) {
		var msg = messageContent[i];
		var type = msg.type;
		var data = msg.data;
		if (type == "emotion") {
			var eletext = "<p3><img src='" + data + "'/></p3>";
			var ele = $(eletext);
			for (var j = 0; j < ele.length; j++) {
				lineDiv.appendChild(ele[j]);
			}
		} else if (type == "pic" || type == 'audio' || type == 'video') {
			var filename = msg.filename;
			var fileele = $("<p3>" + filename + "</p3><br>");
			for (var j = 0; j < fileele.length; j++) {
				lineDiv.appendChild(fileele[j]);
			}
			lineDiv.appendChild(data);
		} else {
			if (to == "send") {
				var eletext = "<p>" + data + "</p>";
				var ele = $(eletext);
				ele[0].setAttribute("class", "chat-content-p3R");
				ele[0].setAttribute("className", "chat-content-p3R");
			} else {
				var eletext = " <p>" + data + "</p>";
				var ele = $(eletext);
				ele[0].setAttribute("class", "chat-content-p3");
				ele[0].setAttribute("className", "chat-content-p3");
			}
			// alert(ele.length+'--'+JSON.stringify(ele));
			for (var j = 0; j < ele.length; j++) {
				lineDiv.appendChild(ele[j]);
			}
		}
	}
	if (curChatUserId == null && chattype == null) {
		setCurrentContact(contact);
		if (time < 1) {
			$('#accordion3').click();
			time++;
		}
	}
	if (curChatUserId && curChatUserId.indexOf(contact) < 0) {
		var contactLi = getContactLi(contactDivId);
		if (contactLi == null) {
			return;
		}
		// contactLi.style.backgroundColor = "green";
		var badgespan = $(contactLi).children(".badge");
		if (badgespan && badgespan.length > 0) {
			var count = badgespan.text();
			var myNum = new Number(count);
			myNum++;
			badgespan.text(myNum);

		} else {
			$(contactLi).append('<span class="badge">1</span>');
		}
		/*
		 * //联系人不同分组的未读消息提醒 var badgespanGroup =
		 * $(contactLi).parent().parent().parent().prev()
		 * .children().children(".badgegroup"); if (badgespanGroup &&
		 * badgespanGroup.length == 0) {
		 * $(contactLi).parent().parent().parent().prev().children() .append('<span
		 * class="badgegroup">New</span>'); }
		 */
		// ///////////////添加消息来了提示
		// $('#actionSend').append('<span class="badgegroup">New</span>');
	}
	var msgContentDiv = getContactChatDiv(contactDivId);
	// if (curUserId == who) {
	if (to == "send") {
		lineDiv.style.textAlign = "right";
	} else {
		lineDiv.style.textAlign = "left";
		document.getElementById('audioPrompt').play();
		if (!remarkMessage) {
			remarkMessage = true;
			$('#actionSend').append('<span class="badgegroup">New</span>');
		}
	}
	var create = false;
	if (msgContentDiv == null) {
		msgContentDiv = createContactChatDiv(contactDivId);
		create = true;
	}
	msgContentDiv.appendChild(lineDiv);
	if (create) {
		document.getElementById(msgCardDivId).appendChild(msgContentDiv);
	}
	msgContentDiv.scrollTop = msgContentDiv.scrollHeight;
	return lineDiv;

};

var showAddFriend = function() {
	$('#addFridentModal').modal('toggle');
	$('#addfridentId').val('好友账号'); // 输入好友账号
	$('#add-frident-warning').html("");
};

// 添加输入框鼠标焦点进入时清空输入框中的内容
var clearInputValue = function(inputId) {
	$('#' + inputId).val('');
};

var showDelFriend = function() {
	$('#delFridentModal').modal('toggle');
	$('#delfridentId').val('好友账号'); // 输入好友账号
	$('#del-frident-warning').html("");
};

// 消息通知操作时条用的方法
var showNewNotice = function(message) {
	$('#confirm-block-div-modal').modal('toggle');
	$('#confirm-block-footer-body').html(message);
};

var showWarning = function(message) {
	$('#notice-block-div').modal('toggle');
	$('#notice-block-body').html(message);
};

// 主动添加好友操作的实现方法
var startAddFriend = function() {
	var user = $('#addfridentId').val();
	if (user == '') {
		$('#add-frident-warning').html("<font color='#FF0000'> 请输入好友名称</font>");
		return;
	}
	if (bothRoster)
		for (var i = 0; i < bothRoster.length; i++) {
			if (bothRoster[i].name == user) {
				$('#add-frident-warning').html(
					"<font color='#FF0000'> 已是您的好友</font>");
				return;
			}
		}
		// 发送添加好友请求
	conn.subscribe({
		to: user,
		message: "加个好友呗-" + getLoacalTimeString()
	});
	$('#addFridentModal').modal('hide');
	return;
};

// 回调方法执行时同意添加好友操作的实现方法
var agreeAddFriend = function(user) {
	conn.subscribed({
		to: user,
		message: "[resp:true]"
	});
};
// 拒绝添加好友的方法处理
var rejectAddFriend = function(user) {
	conn.unsubscribed({
		to: user,
		message: getLoacalTimeString()
	});
};

// 直接调用删除操作时的调用方法
var directDelFriend = function() {
	var user = $('#delfridentId').val();
	if (validateFriend(user, bothRoster)) {
		conn.removeRoster({
			to: user,
			success: function() {
				conn.unsubscribed({
					to: user
				});
				// 删除操作成功时隐藏掉dialog
				$('#delFridentModal').modal('hide');
			},
			error: function() {
				$('#del-frident-warning').html(
					"<font color='#FF0000'>删除联系人失败!</font>");
			}
		});
	} else {
		$('#del-frident-warning').html(
			"<font color='#FF0000'>该用户不是你的好友!</font>");
	}
};
// 判断要删除的好友是否在当前好友列表中
var validateFriend = function(optionuser, bothRoster) {
	for (var deluser in bothRoster) {
		if (optionuser == bothRoster[deluser].name) {
			return true;
		}
	}
	return false;
};

// 回调方法执行时删除好友操作的方法处理
var delFriend = function(user) {
	conn.removeRoster({
		to: user,
		groups: ['default'],
		success: function() {
			conn.unsubscribed({
				to: user
			});
		}
	});
};
// 删除好友
var removeFriendDomElement = function(userToDel, local) {
	var contactToDel;
	if (bothRoster.length > 0) {
		for (var i = 0; i < bothRoster.length; i++) {
			if (bothRoster[i].name == userToDel) {
				contactToDel = bothRoster[i];
				break;
			}
		}
	}
	if (contactToDel) {
		bothRoster.remove(contactToDel);
	}
	// 隐藏删除好友窗口
	if (local) {
		$('#delFridentModal').modal('hide');
	}
	// 删除通讯录
	$('#' + userToDel).remove();
	// 删除聊天
	var chatDivId = curUserId + "-" + userToDel;
	var chatDiv = $('#' + chatDivId);
	if (chatDiv) {
		chatDiv.remove();
	}
	if (curChatUserId != userToDel) {
		return;
	} else {
		var displayName = '';
		// 将第一个联系人作为当前聊天div
		if (bothRoster.length > 0) {
			curChatUserId = bothRoster[0].name;
			$('#' + curChatUserId).css({
				"background-color": "#33CCFF"
			});
			var currentDiv = getContactChatDiv(curChatUserId) || createContactChatDiv(curChatUserId);
			document.getElementById(msgCardDivId).appendChild(currentDiv);
			$(currentDiv).css({
				"display": "block"
			});
			displayName = '与' + curChatUserId + '聊天中';
		} else {
			$('#null-nouser').css({
				"display": "block"
			});
			displayName = '';
		}
		$('#talkTo').html('<a href="#">' + displayName + '</a>');
	}
};

// 清除聊天记录
var clearCurrentChat = function clearCurrentChat() {
	var currentDiv = getContactChatDiv(curChatUserId) || createContactChatDiv(curChatUserId);
	currentDiv.innerHTML = "";
};

// 显示成员列表
var showRoomMember = function showRoomMember() {
	if (groupQuering) {
		return;
	}
	groupQuering = true;
	queryOccupants(curRoomId);
};

// 根据roomId查询room成员列表
var queryOccupants = function queryOccupants(roomId) {
	var occupants = [];
	conn.queryRoomInfo({
		roomId: roomId,
		success: function(occs) {
			if (occs) {
				for (var i = 0; i < occs.length; i++) {
					occupants.push(occs[i]);
				}
			}
			conn.queryRoomMember({
				roomId: roomId,
				success: function(members) {
					if (members) {
						for (var i = 0; i < members.length; i++) {
							occupants.push(members[i]);
						}
					}
					showRoomMemberList(occupants);
					groupQuering = false;
				},
				error: function() {
					groupQuering = false;
				}
			});
		},
		error: function() {
			groupQuering = false;
		}
	});
};

var showRoomMemberList = function showRoomMemberList(occupants) {
	var list = $('#room-member-list')[0];
	var childs = list.childNodes;
	for (var i = childs.length - 1; i >= 0; i--) {
		list.removeChild(childs.item(i));
	}
	for (i = 0; i < occupants.length; i++) {
		var jid = occupants[i].jid;
		var userName = jid.substring(jid.indexOf("_") + 1).split("@")[0];
		var txt = $("<p></p>").text(userName);
		$('#room-member-list').append(txt);
	}
	$('#option-room-div-modal').modal('toggle');
};

var showRegist = function showRegist() {
	$('#loginmodal').modal('hide');
	$('#regist-div-modal').modal('toggle');
};

var getObjectURL = function getObjectURL(file) {
	var url = null;
	if (window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if (window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if (window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
};

var getLoacalTimeString = function getLoacalTimeString() {
	var date = new Date();
	var hour = date.getHours();
	if (hour < 10)
		hour = '0' + hour;
	var minu = date.getMinutes();
	if (minu < 10)
		minu = '0' + minu;
	var second = date.getSeconds();
	if (second < 10)
		second = '0' + second;
	var result = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '  ' + hour + ':' + minu + ':' + second;
	return result;
	// return new Date().toLocaleString();

}