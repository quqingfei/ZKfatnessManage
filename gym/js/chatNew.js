var apiURL = null;
var userPhone, headIcon, userId, userSex, curUserId;
var curFromInfo;

var appkey = "zkim2014#stepper"; // 本地
// var appkey = "zkim2014#fatburn";// 云端
// var appkey = "zkim2014#zkim";// 云端测试
var conn = null;
// easemobwebim-sdk注册回调函数列表
$(document).ready(function() {
	conn = new Easemob.im.Connection();
	conn.init({
		https: false,
		onOpened: function() {
			conn.setPresence();
			handleOpen(conn);
		},
		//当连接关闭时的回调方法
		onClosed: function() {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "账号登录异常，请刷新页面或重新登录。");
			return;
			// conn.clear();
			// conn.onClosed();
		},
		onTextMessage: function(message) {
			handleTextMessage(message);
			// appendMsg(message, 'text');
		},
		onEmotionMessage: function(message) {
			handleEmotion(message);
			// appendMsg(message, 'emoji')
		},
		onPictureMessage: function(message) {
			handlePictureMessage(message);
			// appendMsg(message, 'pic');
		},
		onAudioMessage: function(message) {
			handleAudioMessage(message);
			// appendMsg(message, 'audio');
		},
		//收到联系人订阅请求的回调方法
		onPresence: function(message) {
			handlePresence(message);
		},
		//收到联系人信息的回调方法
		onRoster: function(message) {
			handleRoster(message);
		},
		onError: function(message) {
			//异常处理
			// handleOpen(conn);
			// console.log(message);
			// $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "聊天连接已断开,请重新登录");
			// return;
		}
	});
});
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
	return false;
};
// 处理连接时函数,主要是登录成功后对页面元素做处理
var handleOpen = function(conn) {
	// 从连接中获取到当前的登录人注册帐号名
	// console.log("成功登录");
	curUserId = conn.context.userId;
	// 获取当前登录人的联系人列表
	conn.getRoster({
		success: function(roster) {
			// 页面处理
			// hiddenWaitLoginedUI();
			// showChatUI();
			// console.log(roster);
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
// easemobwebim-sdk收到文本消息的回调方法的实现
var handleTextMessage = function(message) {
	// console.log('handleTextMessage' + JSON.stringify(message));
	var chatFrom = message.from;
	var chatIcon = message.ext.from.headIcon;
	var chatCont = message.data.replace(/\n/g, '<br>');
	var chatName = JSON.stringify(message.ext.from);
	// console.log(chatName);
	appendTab(chatFrom, chatIcon, chatName);
	appendMsg(chatFrom, chatIcon, chatCont);
};
var handleRoster = function(rosterMsg) {
	console.log('handleRoster:' + JSON.stringify(rosterMsg));
};

function handleEmotion(message) {
	// console.log('handleEmotion' + JSON.stringify(message));
	var chatFrom = message.from;
	var chatIcon = message.ext.from.headIcon;
	var chatData = message.data;
	var chatCont = '';
	var chatName = JSON.stringify(message.ext.from);
	// console.log(chatName);
	appendTab(chatFrom, chatIcon, chatName);
	$.each(chatData, function(n, value) {
		if (value.type == 'emotion') {
			chatCont = chatCont + '<img src="' + value.data + '" alt="" style="height: 16px;vertical-align: bottom;padding: 0 1px;" border="0" />';
		} else {
			chatCont = chatCont + parseNoteContent(value.data).replace(/\n/g, '<br>');
		}
	})
	appendMsg(chatFrom, chatIcon, chatCont);
}

function handlePictureMessage(message) {
	// console.log('handlePictureMessage' + JSON.stringify(message));
	var chatFrom = message.from;
	var chatIcon = message.ext.from.headIcon;
	var chatCont = '';
	var chatName = JSON.stringify(message.ext.from);
	// console.log(chatName);
	appendTab(chatFrom, chatIcon, chatName);
	var options = message;
	// 图片消息下载成功后的处理逻辑
	options.onFileDownloadComplete = function(response, xhr) {
		var objectURL = window.URL.createObjectURL(response);
		chatCont = '<img src="' + objectURL + '" alt="" style="max-width: 210px;min-height:16px;" border="0" />';
		appendMsg(chatFrom, chatIcon, chatCont);
	};
	options.onFileDownloadError = function(e) {
		chatCont = '[下载图片失败！]';
		appendMsg(chatFrom, chatIcon, chatCont);
	};
	Easemob.im.Helper.download(options);
}

function handleAudioMessage(message) {
	// console.log('handleAudioMessage' + JSON.stringify(message));
	var chatFrom = message.from;
	var chatIcon = message.ext.from.headIcon;
	var chatCont = '';
	var chatName = JSON.stringify(message.ext.from);
	// console.log(chatName);
	appendTab(chatFrom, chatIcon, chatName);
	var audioId = message.id;
	var audioLen = message.length;
	var audioWidth = audioLen + 40;
	if (audioWidth >= 120) audioWidth = 120;
	var options = message;
	options.onFileDownloadComplete = function(response, xhr) {
		var objectURL = window.URL.createObjectURL(response);
		var audioPlayer = '<a href="javascript:;" onclick="audioPlayer(\'' + audioId + '\')" class="audioPlayer" style="width:' + audioWidth + 'px;">' + audioLen + '``</a>'
		chatCont = audioPlayer + '<audio id="' + audioId + '" src="' + objectURL + '" style="display:none"></audio>';
		appendMsg(chatFrom, chatIcon, chatCont);
	};
	options.onFileDownloadError = function(e) {
		chatCont = '[下载音频失败]';
		appendMsg(chatFrom, chatIcon, chatCont);
	};
	options.headers = {
		"Accept": "audio/mp3"
	};
	Easemob.im.Helper.download(options);
}

//语音播放器功能
var audioNow = '';

function audioPlayer(id) {
	if (!!audioNow && audioNow != id) {
		var stop = document.getElementById(audioNow);
		stop.pause();
		$('#' + audioNow).prev().css('background-image', 'url(images/audio.png)');
		audioNow = '';
		clearInterval(player);
	} //停止当前正在播放的语音

	var audio = document.getElementById(id);
	var player;
	if (audio.paused) {
		audio.load(); //声音重加载
		audio.play(); // 这个就是播放  
		$('#' + id).prev().css('background-image', 'url(images/audio.gif)');
		audioNow = id;
		player = setInterval(function() {
			if (audio.ended) {
				$('#' + id).prev().css('background-image', 'url(images/audio.png)');
				audioNow = '';
				clearInterval(player);
			}
		}, 100);
	} else {
		audio.pause(); // 这个就是暂停
		$('#' + id).prev().css('background-image', 'url(images/audio.png)');
		audioNow = '';
		clearInterval(player);
	}
}

function handlePresence(message) {
	console.log('handlePresence' + JSON.stringify(message));
}
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
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "聊天连接已断开,请重新登录");
					return;
				} else {
					// alert("服务器器断开连接");
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "聊天连接已断开,请重新登录");
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
//数字补零
function PrefixInteger(num, n) {
	return (Array(n).join(0) + num).slice(-n);
}

function getTime(now) {
	var hour;
	if (now.getHours() <= 12) {
		hour = '上午 ' + now.getHours();
	} else if (now.getHours() <= 17) {
		hour = '下午 ' + PrefixInteger((now.getHours() - 12), 2);
	} else {
		hour = '晚上 ' + PrefixInteger((now.getHours() - 12), 2);
	}
	var time = PrefixInteger((now.getMonth() + 1), 2) + '月' + PrefixInteger(now.getDate(), 2) + '日 ' + hour + ':' + PrefixInteger(now.getMinutes(), 2);
	return time;
}
var timeCache = '';

function appendMsg(id, icon, cont) {
	if ($('#' + id).length == 0) {
		var div = '<div id="' + id + '" class="content-item" style="display:none;"></div>'
		$('#chatContents').append(div);
		timeCache = '';
	}
	var now = new Date();
	if (timeCache != getTime(now)) {
		timeCache = getTime(now);
		var partTime = '<div class="chat-time">' + getTime(now) + '</div>';
	} else {
		var partTime = '';
	}
	// var partTime = '<div class="chat-time">' + getTime(now) + '</div>';
	var partIcon = '<div class="chat-icon" style="background-image:url(../file/FileCenter!showImage2.zk?name=' + icon + ')"></div>';
	var partCont = '<div class="chat-text">' + cont + '</div>';
	var partDiv = '';
	if (icon == headIcon) {
		partDiv = '<div class="chat-this">' + partTime + partCont + partIcon + '</div>';
	} else {
		partDiv = '<div class="chat-other">' + partTime + partIcon + partCont + '</div>';
	}
	$('#' + id).append(partDiv);
	var msgNum = parseInt($('#tab' + id + ' .chat-num').text());
	if (msgNum > 98) msgNum = 98;
	if ($('.chosen').attr('id') != 'tab' + id) {
		$('#tab' + id + ' .chat-num').show();
		$('#tab' + id + ' .chat-num').text(msgNum + 1);
	}
	$('#chatContents').scrollTop($('#chatContents')[0].scrollHeight);
	//新消息角标
	if ($('#chatBox').css('display') == 'none') {
		newMsgSign();
	}
	$('.chat-text a').off('click').on('click', function() {
		var url = $(this).attr('data-href');
		$('#iframeCont').attr('src', url);
		$('#iframeInfo').dialog('open');
	})
}

function newMsgSign() {
	var newAll = 0;
	$('.chat-num').each(function() {
		newAll += parseInt($(this).text());
	})
	if (newAll > 99) {
		newAll = 99;
	}
	if (newAll > 0) {
		$('#newMsg').show();
	} else {
		$('#newMsg').hide();
	}
	$('#newMsg').text(newAll);
}

function appendTab(id, icon, name) {
	if ($('#tab' + id).length == 0) {
		var fromInfo = JSON.parse(name);
		var partClose = '<a class="chat-close" onclick="closeTab(\'' + id + '\')"></a>';
		var partIcon = '<div class="chat-icon" style="background-image:url(../file/FileCenter!showImage2.zk?name=' + icon + ')"></div>';
		var partName = '<div class="chat-user">' + fromInfo.userName + '</div>';
		var partNum = '<div class="chat-num">0</div>';
		var partFun = 'showTab(\'' + id + '\',\'' + fromInfo.userName + '\',\'' + fromInfo.sex + '\',\'' + fromInfo.age + '\')'
		var div = '<div id="tab' + id + '" class="chat-item" onclick="' + partFun + '">' + partClose + partIcon + partName + partNum + '</div>';
		$('#chatUsers').prepend(div);
	}
}

function closeTab(id) {
	if ('tab' + id == $('.chosen').attr('id')) {
		if ($('#tab' + id).next().attr('id')) $('#tab' + id).next().click();
		else $('#chatRight .chat-bottom').hide();
		$('#chatRight .chat-title').text('');
	}
	$('#' + id).remove();
	$('#tab' + id).remove();
	newMsgSign();
	event.stopPropagation();
	return false;
}

function sexInfo(sex) {
	switch (sex) {
		case 'M':
			return '男';
			break;
		case 'F':
			return '女';
			break;
		default:
			return '';
			break;
	}
}

function showTab(id, name, sex, age) {
	var title = name + '（' + sexInfo(sex) + ' ' + age + '岁）';
	if (sex == 'undefined' || age == 'undefined') {
		title = name;
	}
	$('#chatContents').children().hide();
	$('#' + id).show();
	$('#chatContents').scrollTop($('#chatContents')[0].scrollHeight);
	// $('#chatUsers').children().css('background-color', '#f3f3f3');
	// $('#tab' + id).css('background-color', '#D7EBDD');
	$('.chosen').removeClass('chosen');
	$('#tab' + id).addClass('chosen');
	$('#tab' + id + ' .chat-num').text('0');
	$('#tab' + id + ' .chat-num').hide();
	newMsgSign();
	$('#chatRight .chat-title').text(title);
	$('#chatRight .chat-bottom').show();
}

$('#chatEmo').on('click', function() {
	if ($('#chatEmoji').css('display') == 'none') {
		showEmotionDialog();
		$('#chatQuicks').hide();
	} else {
		$('#chatEmoji').hide();
	}
})

var emotionFlag = false;

var showEmotionDialog = function() {
	if (emotionFlag) {
		$('#chatEmoji').show();
		return;
	}
	emotionFlag = true;
	// Easemob.im.Helper.EmotionPicData设置表情的json数组
	var sjson = Easemob.im.Helper.EmotionPicData;

	for (var key in sjson) {
		var emotions = $('<img>').attr({
			"id": key,
			"src": sjson[key],
			"style": "display:inline-block;cursor:pointer;width:18px;height:18px;margin:3px;"
		}).click(function() {
			selectEmotionImg(this);
		});
		// var emotionBox
		// $('<li>').append(emotions).appendTo($('#emotionUL'));
		$('#chatEmoji').append(emotions);
	}
	$('#chatEmoji').show();
};

var selectEmotionImg = function(selImg) {
	var txt = document.getElementById('chatInput');
	txt.value = txt.value + selImg.id;
	txt.focus();
};
$("#chatSend").on('click', function() {
	sendText();
});
var sendText = function() {
	var msg = $('#chatInput').val();
	var to = $(".chosen").attr('id').split('tab')[1];
	if ($.trim(msg) != '') {
		var options = {
			from: userId,
			to: to,
			msg: msg,
			type: "chat",
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
				"to": to
			}
		};
		//发送文本消息接口
		conn.sendTextMessage(options);
		$('#chatInput').val('');
		var chatData = Easemob.im.Helper.parseTextMessage(msg);
		var chatCont = '';
		$('#chatEmoji').hide();
		$('#chatQuicks').hide();
		$.each(chatData.body, function(n, value) {
			if (value.type == 'emotion') {
				chatCont = chatCont + '<img src="' + value.data + '" alt="" style="height: 16px;vertical-align: bottom;padding: 0 1px;" border="0" />';
			} else {
				chatCont = chatCont + parseNoteContent(value.data).replace(/\n/g, '<br>');
			}
		})
		appendMsg(to, headIcon, chatCont);
	}

};
$('#chatPic').on('click', function() {
	$('#fileImg').click();
})
var picNum = 0;

function sendPic() {
	//图片接收者，如“test1”
	var to = $(".chosen").attr('id').split('tab')[1];;
	if (to == null) {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "请选择联系人");
		return;
	}
	//fileInputId：文件选择输入框的Id，SDK自动根据ID自动获取文件对象（含图片，或者其他类型文件）
	var fileInputId = 'fileImg';
	var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
	if (fileObj.url == null || fileObj.url == '') {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "请选择发送图片");
		return;
	}
	var filetype = fileObj.filetype;
	var filename = fileObj.filename;
	if (filetype in {
			"jpg": true,
			"jpeg": true,
			"gif": true,
			"png": true,
			"bmp": true
		}) {
		var opt = {
			fileInputId: fileInputId,
			to: to,
			onFileUploadError: function(error) {
				console.log(error);
				$('#' + to + '-' + picNum).attr('src', 'images/default.png');
				picNum++;
			},
			onFileUploadComplete: function(data) {
				var file = document.getElementById(fileInputId);
				var objUrl = getObjectURL(file.files[0]);
				// var chatCont = '';
				if (objUrl) {
					// chatCont = '<img src="' + objUrl + '" alt="" style="max-width: 210px;" border="0" />';
					$('#' + to + '-' + picNum).attr('src', objUrl);
				}
				// appendMsg(to, headIcon, chatCont);
				// $('#' + to + ' .chat-loading').hide();
				picNum++;
				// console.log(picNum);
				$('#fileImg').val('');
			},
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
				"to": to
			}
		};
		conn.sendPicture(opt);
		// var file = document.getElementById(fileInputId);
		// var objUrl = getObjectURL(file.files[0]);
		// var chatCont = '';
		// if (objUrl) {
		var chatCont = '<img id="' + to + '-' + picNum + '" src="images/loading.gif" alt="" style="max-width: 210px;min-height:16px;" border="0" />';
		// }
		// $('#' + to + ' .chat-loading').show();
		appendMsg(to, headIcon, chatCont);
		return;
	}
	$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "不支持此图片类型" + filetype);
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

$('#chatComm').on('click', function() {
	if ($('#chatQuicks').css('display') == 'none') {
		$('#chatQuicks').show();
		$('#chatEmoji').hide();
	} else {
		$('#chatQuicks').hide();
	}
})

function quicksList() {
	$.post('../ngym/GymPhraseAction!list.zk', {}, function(data) {
		// data = eval('(' + data + ')');
		if (data.STATUS) {
			var quicks = data.rows;
			$.each(quicks, function(n, value) {
				var quickText = '<span>' + value.phrase + '</span>';
				var quickDel = '<a class="chat-close" onclick="quickDel(\'' + value.id + '\')"></a>';
				// var quickDiv = '<div id="' + value.id + '" class="quick-item">' + quickText + quickDel + '</div>';
				var quickDiv = $('<div>').attr({
					'id': value.id,
					'class': 'quick-item'
				}).click(function() {
					quickInput(this);
				});
				quickDiv.append(quickText + quickDel).appendTo($('#quickContent'));
				// .append(quickDiv);
			});
		} else {
			if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
				loginTimeout();
				return;
			}
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
};

function quickInput(obj) {
	var Qtext = $(obj).children('span').text();
	$('#chatInput').val($('#chatInput').val() + Qtext);
	$('#chatInput').focus();
	// console.log(obj);
};

function quickDel(id) {
	$.post('../ngym/GymPhraseAction!delete.zk', {
		id: id
	}, function(data) {
		// data = eval('(' + data + ')');
		if (data.STATUS) {
			$('#' + id).remove();
		} else {
			if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
				loginTimeout();
				return;
			}
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
		}
	}, 'json');
	event.stopPropagation();
};

$('#quickAdd').on('click', function() {
	var text = $('#quickInput').val();
	if (!!$.trim(text)) {
		$.post('../ngym/GymPhraseAction!add.zk', {
			phrase: text
		}, function(data) {
			// data = eval('(' + data + ')');
			if (data.STATUS) {
				$('#quickContent').html('');
				$('#quickInput').val('');
				quicksList();
			} else {
				if (('No Login!' == data.ERROR) || ('未登录' == data.ERROR)) {
					loginTimeout();
					return;
				}
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
			}
		}, 'json');
	}
})