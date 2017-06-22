$(".menuUl .bg").click(function() {
    var i = 0;
    var ele = $(this);
    var s = ele.attr("data-vl");
    for (i; i < $(".signLi").length; i++) {
        var el = $($(".signLi .bg")[i]);
        el.removeClass("curn");
        el.find(".ones").css("display", "block");
        el.find(".twos").css("display", "none");
        el.find(".right").css("display", "block");
        el.find(".down").css("display", "none");
        el.find("a").css("color", "white");
        el.parent().find(".secondMenu").stop(true, true).slideUp(200)
        el.attr("data-vl", "0");
    }

    if (s == 0) {
        ele.addClass("curn");
        ele.find(".ones").css("display", "none");
        ele.find(".twos").css("display", "block");
        ele.find(".right").css("display", "none");
        ele.find(".down").css("display", "block");
        ele.find("a").css("color", "#3fc371");
        ele.parent().find(".secondMenu").stop(true, true).slideDown(200);
        ele.attr("data-vl", "1");
    } else {
        ele.removeClass("curn");
        ele.find(".ones").css("display", "block");
        ele.find(".twos").css("display", "none");
        ele.find(".right").css("display", "block");
        ele.find(".down").css("display", "none");
        ele.find("a").css("color", "white");
        ele.parent().find(".secondMenu").stop(true, true).slideUp(200);
        ele.attr("data-vl", "0");
    }

    if (ele.attr('id') == 'menuBottom' && s == 0) {
        $("#menuList").animate({
            scrollTop: $('#lastsclool:last').offset().top
        }, 300, 'swing');
    }
})

function printTable() {
    $("#pageFrame").contents().find(".datagrid-view2 .datagrid-htable tbody")
    var b = $("#pageFrame").contents().find(".datagrid-view2 .datagrid-htable tbody").html();
    $("#pageFrame").contents().find(".datagrid-view2 .datagrid-btable tbody").prepend(b);
    $("#pageFrame").contents().find(".datagrid-view2 .datagrid-btable").jqprint({
        debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
        importCSS: false, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
        printContainer: true, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
        operaSupport: true //表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
    });
    $("#pageFrame").contents().find(".datagrid-view2 .datagrid-btable .datagrid-header-row").remove();
}

function play() {
    document.getElementById('audioPrompt').play();
}

function pause() {
    document.getElementById('audioPrompt').pause();
}
var curSeeUserId = ''; //标记每个页面当前查看的用户id
var curUserMessage = null; //当前选择开卡的用户
//保存二维码到本地
function saveQrCode() {
    var image = new Image();
    image.src = $('#head').attr("src");
    var canvas = document.getElementById("qrCode");
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    var type = 'jpeg';
    var imgData = canvas.toDataURL('image/jpeg');
    imgData = imgData.replace('image/jpeg', 'image/octet-stream');
    // 下载后的问题名
    var filename = $.trim($('#gymName').text()) + '.' + type;
    // download
    saveFile(imgData, filename);
    //window.location.href = imgData;
    //return false;
}
var _fixType = function(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    var r = type.match(/png|jpeg|bmp|gif/)[0];
    return 'image/' + r;
};
var saveFile = function(data, filename) {
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
};

function loginTimeout() {
    window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
var curId = null; //当前的id
var curSecondMenuId = null; //当前的包含二级目录的
function setHtml(id, value) {
    if (curId != null && id != curId) {
        var parentId = $($('#' + curId).parent().parent().parent().children('a')[0]).attr('id');
        if ($('#' + parentId + 'UL').attr('id')) {
            $('#' + curId).css({
                color: '#fff',
                'border-left': '#131313 solid 4px',
                'background-color': '#131313'
            });
            if (id != parentId) {
                $('#' + parentId + 'Img').attr('src', './css/images/remarkSecond_1.png');
                $('#' + parentId + 'UL').css({
                    'display': 'none'
                });
            }
        } else {
            if (($('#' + curId + 'UL').attr('id'))) {
                $('#' + curId + 'Img').attr('src', './css/images/remarkSecond_1.png');
                $('#' + curId + 'UL').css({
                    'display': 'none'
                });
            }
            $('#' + curId).css({
                color: '#fff',
                'border-left': '#333333 solid 4px',
                'background-color': '#333333'
            });
            document.getElementById(curId).style.background = "#333333 url('css/images/" + curId + "New_1.png') no-repeat 50px center";
        }
    }
    if (!($('#' + id + 'UL').attr('id'))) {
        $('#' + id).css({
            color: '#ffd200',
            'border-left': '#ffd200 solid 4px',
            'background-color': '#272727'
        });
    } else {
        $('#' + id).css({
            color: '#ffd200',
            'border-left': '#272727 solid 4px',
            'background-color': '#272727'
        });
        //curSecondMenuId = id;       
    }
    curId = id;

    if (value != '')
        $('#pageFrame').attr('src', value);
    else {
        if ($('#' + id + 'UL').css("display") == 'none') {
            $('#' + id + 'Img').attr('src', './css/images/remarkSecond_2.png');
            $('#' + id + 'UL').css({
                'display': 'block'
            });
        } else {
            $('#' + id + 'Img').attr('src', './css/images/remarkSecond_1.png');
            $('#' + id + 'UL').css({
                'display': 'none'
            });
        }
    }
}

function over(id) {
    if (id != curId) {
        //          console.log(1);
        $('#' + id).css({
            color: '#ffd200',
            //            'border-left': '#272727 solid 4px',
            'background': "#333333 url('css/images/" + id + "New_2.png') no-repeat 50px center"
        });
        //          document.getElementById(id).style.background = "#272727 url('css/images/" + id + "New_2.png') no-repeat 50px center";

    }
    event.cancelBubble = true;
    event.stopPropagation();
    return false;
}

function out(id) {
    if (id != curId) {
        $('#' + id).css({
            color: '#fff',
            'border-left': '#333333 solid 4px',
            'background-color': '#333333'
        });
        if (document.getElementById(id))
            document.getElementById(id).style.background = "#333333 url('css/images/" + id + "New_1.png') no-repeat 50px center";
    }
    event.cancelBubble = true;
    event.stopPropagation();
    return false;
}

function setHtml_1(value) {
    $('.secondA').removeClass('secondS');
    $('#' + value).addClass('secondS');
    var $print = $('#printButton');
    var userHtml = 0;
    if (auths) {
        auths.forEach(function(e) {
            if (e == '4') {
                userHtml = 1;
            }
        })
    }
    // if (userHtml == 0 && value == 'openCard') {
    //     $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无权操作此功能。');
    //     return false;
    // }
    $print.show();
    switch (value) {
        case 'superControl':
            ;
        case 'addPrivateCoachCourse':
            ;
        case 'openCard':
            ;
        case 'attendanceRecord':
            ;
        case 'attendanceStatistic':
            ;
        case 'storeInput':
            ;
        case 'storeRecord':
            ;
        case 'payInput':
            ;
        case 'borrowInput':
            ;
        case 'balance':
            ;
        case 'articleSend':
            ;
        case 'dataCheck':
            ;
        case 'dataSale':
            ;
        case 'dataCoach':
            ;
        case 'staffManagement':
            ;
        case 'roleManagement':
            ;
        case 'cardManage':
            ;
        case 'gameManage':
            ;
        case 'accountManageNew':
            ;
        case 'resultsTotal':
            $print.hide();
    }
    $('#pageFrame').attr('src', value + '.html');
    // return false;
}

function over_1(id) {
    if (id != curId) {
        $('#' + id).css({
            color: '#ffd200',
            'border-left': '#272727 solid 4px'
        });
        //          document.getElementById(id).style.background = "#272727 url('css/images/" + id + "New_2.png') no-repeat 50px center";
    }
    event.cancelBubble = true;
    event.stopPropagation();
    return false;
}

function out_1(id) {
    if (id != curId) {
        $('#' + id).css({
            color: '#fff',
            'border-left': '#131313 solid 4px',
            'background': '#131313'
        });
    }
    event.cancelBubble = true;
    event.stopPropagation();
    return false;
}
/*
  function setHtml(id,value){
      if(curSecondMenuId!=null&&curSecondMenuId!=id&&curSecondMenuId!=curId){
        $('#'+curSecondMenuId).css({color:'#fff','border-left':'#333333 solid 4px'});
        $('#'+curSecondMenuId).parent().css({'background':'#333333'});
        $('#'+curSecondMenuId).css('background','url(css/images/'+curSecondMenuId+'New_1.png) no-repeat 50px center');
        if($('#'+curSecondMenuId+'UL').attr('id')){
          $('#'+curSecondMenuId+'Img').attr('src','./css/images/remarkSecond_1.png');
          $('#'+curSecondMenuId+'UL').css({'display':'none'});
        }
      }
      if(curId!=null&&id!=curId){
        if(!($('#'+id+'UL').attr('id'))){
          $('#'+curId).css({color:'#fff','border-left':'#333333 solid 4px'});
          $('#'+curId).parent().css({'background':'#333333'});
          $('#'+curId).css('background',"url('css/images/"+curId+"New_1.png') no-repeat 50px center");
        }
        if($('#'+curId+'UL').attr('id')){
          $('#'+curId+'Img').attr('src','./css/images/remarkSecond_1.png');
          $('#'+curSecondId).css({color:'#fff'});
          $('#'+curSecondId).css({color:'#fff','border-left':'#333333 solid 4px'});
          $('#'+curSecondId).parent().css({'background':'#333333'});
          $('#'+curId+'UL').css({'display':'none'});
        }
      }
      if(!($('#'+id+'UL').attr('id'))){
        curId=id;
      }else{
        curSecondMenuId = id;       
      }
      $('#'+id).css({color:'#ffd200','border-left':'#ffd200 solid 4px'});
      $('#'+id).css('background',"url('css/images/"+id+"New_2.png') no-repeat 50px center");
      $('#'+id).parent().css({'background': '#131313'});
      if(value!='')
        $('#pageFrame').attr('src',value);
      else{
        if($('#'+id+'UL').css("display")=='none'||(curId!=id&&curSecondMenuId!=id)){
          $('#'+id+'Img').attr('src','./css/images/remarkSecond_2.png');
          $('#'+id+'UL').css({'display':'block'});
        }else{
          $('#'+id+'Img').attr('src','./css/images/remarkSecond_1.png');
          $('#'+id+'UL').css({'display':'none'});
        }
      }
  }
  function over(id){
    $('#'+id).css({color:'#ffd200','border-left':'#ffd200 solid 4px','background-color':'#131313'});
    $('#'+id).css('background',"url('css/images/"+id+"New_2.png') no-repeat 50px center");
  }
  function out(id){
    if(id!=curId&&id!=curSecondMenuId){
      $('#'+id).css({color:'#fff','border-left':'#333333 solid 4px','background-color':'#333333'});
      //$('#'+id).parent().css({'background': '#333333'});
      if(document.getElementById(id))
        $('#'+id).css('background',"url('css/images/"+id+"New_1.png') no-repeat 50px center");
    }
  } 
  
  var curSecondId=null;
  function setHtml_1(id,value){
    var parentId = $($('#'+id).parent().parent().parent().children('a')[0]).attr('id');
    if(curId!=null&&parentId!=curId){
      $('#'+curId).css({color:'#fff','border-left':'#333333 solid 4px'});
      $('#'+curId).parent().css({'background':'#333333'});
      $('#'+curId).css('background',"url('css/images/"+curId+"New_1.png') no-repeat 50px center");
    }
    if(curSecondId!=null&&id!=curSecondId){
      $('#'+curSecondId).css({color:'#fff'});
    }
    curSecondId=id;
    curId = curSecondMenuId;
    curSecondMenuId = null;
    $('#'+id).css({color:'#ffd200'});
    $('#pageFrame').attr('src',value);
  }
  function over_1(id){
    $('#'+id).css({color:'#ffd200','background-color':'#131313'});
    var parentId = $($('#'+id).parent().parent().children('a')[0]).attr('id');
    $('#'+parentId).css({color:'#ffd200','border-left':'#ffd200 solid 4px','background-color':'#131313'});
    $('#'+parentId).css('background',"url('css/images/"+id+"New_2.png') no-repeat 50px center");
  }
  function out_1(id){
    if(id!=curSecondId){
      var parentId = $($('#'+id).parent().parent().children('a')[0]).attr('id');
      //out(parentId);
      $('#'+id).css({color:'#fff'});
    }
  } 
  */
var auths;
$(function() {
    //$('#user').click(function(){});
    var supers = 0;
    var listshow = localStorage.getItem("auths")
    if (typeof(listshow) != "undefined") {
        $('.signLi').hide();
 
        if(listshow.indexOf("-")<0){
                auths = eval('(' + listshow + ')');
                var dil = [];
                $.each(auths,function(index, el) {
                    switch(Number(el)){
                        case 1: dil.push("1-0");break;
                        case 8: dil.push("8-0");break;
                        case 11: dil.push("11-0");break;
                        case 3: dil.push("3-0");dil.push("3-1");dil.push("3-2");break;
                        case 4: dil.push("4-0");dil.push("4-1");dil.push("4-2");dil.push("4-3");dil.push("4-4");dil.push("4-5");break;
                        case 5: dil.push("5-0");dil.push("5-1");dil.push("5-2");dil.push("5-3");dil.push("5-4");dil.push("5-5");dil.push("5-6");dil.push("5-7");break;
                        case 6: dil.push("6-0");dil.push("6-1");dil.push("6-2");dil.push("6-3");dil.push("6-4");dil.push("6-5");break;
                        case 10: dil.push("10-0");dil.push("10-1");dil.push("10-2");break;
                        case 7: dil.push("7-0");dil.push("7-1");dil.push("7-2");break;
                        case 9: dil.push("9-0");dil.push("9-1");dil.push("9-2");break;
                        case 0: dil.push("0-0");dil.push("0-1");dil.push("0-2");dil.push("0-3");dil.push("0-4");dil.push("0-5");dil.push("0-6");dil.push("0-7");dil.push("0-8");break;
                    }
                });
                $.each(dil,function(index, el) {
                    $('#auth' + el).show();
                    if (el == '1-0') supers = '1-0';
                });
            }else{            
                    var slists = eval('(' + listshow + ')');
                    var res = slists.map(function (item,index,input) {
                         return item.split("-")[0];
                    })
                    $.each(res,function(index, el) {
                        switch(Number(el)){
                            case 1: slists.push("1-0");break;
                            case 8: slists.push("8-0");break;
                            case 11: slists.push("11-0");break;1
                            case 3: slists.push("3-0");break;
                            case 4: slists.push("4-0");break;
                            case 5: slists.push("5-0");break;
                            case 6: slists.push("6-0");break;
                            case 10: slists.push("10-0");break;
                            case 7: slists.push("7-0");break;
                            case 9: slists.push("9-0");break;
                            case 0: slists.push("0-0");break;
                        }
                    });
                    $.each(slists,function(index, el) {
                        $('#auth' + el).show();
                        if (el == '1-0') supers = '1-0';
                    });
            }  
    }
    if (supers || !localStorage.getItem("auths")) {
        $('#superControl').trigger('click');
    }

    setTimeout(function() {
        //$('#operations').trigger('click');
        // $('#signIn').trigger('click');
        // $('#toSignIn').trigger('click');
        $.getJSON('GymAccountAction!getGymInfo.zk', {}, function(data) {
            var huanxin = localStorage.getItem("name");
            var gymName = '';
            var gymHeadIcon = '';
            if (data.STATUS) {
                if (!!data.cover) {
                    var covers = eval('(' + data.cover + ')');
                    gymHeadIcon = covers[0];
                }
                $('#gymName').text(data.gymName);
                gymName = data.gymName;
            }
            var chatState = localStorage.getItem("chat");
            //alert(huanxin+'---'+gymName+'---'+gymHeadIcon);
            // console.log(huanxin + '---' + gymName + '---' + gymHeadIcon);
            if (chatState == 'true') {
                login(huanxin, gymName, gymHeadIcon);
            }
        });

    }, 800);
    //注册
    // document.getElementById('chatInput').onkeydown = function(event) {
    //     var event = event || window.event; //这里的event兼容跟上面不同，关于event的兼容，请猛戳这里
    //     if (event.ctrlKey && event.keyCode == 13) {
    //         sendText();
    //         event.stopPropagation();
    //     }
    // };
    quicksList();
    $("#chatInput").keydown(function(event) {
        if (event.ctrlKey && event.keyCode == 13) {
            //e = $(this).val();
            //$(this).val(e + '<br>');
            event.returnValue = false;
            sendText();
            return false;
        }
    });
});

function textChange(id) {
    var it = document.getElementById(id);
    it.css('height', it.scrollHeight + 'px')
}

function textPut(id) {
    var it = document.getElementById(id);
    it.style.height = it.scrollHeight + 'px'
}

function logout() {
    $.getJSON("loginAction!logout.zk", function(data) {
        if (data.STATUS) {
            window.parent.location.replace("index.html");
        }
    });
}

function takeOut() {
    $.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;提示', '确认退出管理系统吗?', function(r) {
        if (r) {
            logout();
        }
    });
}

function showChatBox() {
    if ($('#chatBox').css('display') == 'none') {
        $('#chatBox').show();
        $('#chatBox').animate({
            left: '250px'
        }, 200);
    } else {
        $('#chatBox').animate({
            left: '-350px'
        }, 200);

        setTimeout(function() {
            $('#chatBox').hide();
            $('#chatContents').children().hide();
            $('.chosen').removeClass('chosen');
        }, 200);
    }
}

$('#boxClose').on('click', function() {
    $('#chatBox').animate({
        left: '-350px'
    }, 200);

    setTimeout(function() {
        $('#chatBox').hide();
        $('#chatContents').children().hide();
        $('.chosen').removeClass('chosen');
    }, 200);
})

function showChat(value, index) {
    if ($('#dlgChat').css('display') == 'block') {
        $('#content').hide();
        $('#dlgChat').animate({
            width: '-=650px'
        }, 300);
        setTimeout(function() {
            $('#dlgChat').css({
                'display': 'none'
            });
        }, 300);
    } else {
        //$('#dlgChat').css({width:'0px',height:'0px'});
        $('#dlgChat').css({
            'display': 'block',
            left: 250,
            top: parseInt($('#menu').css('height')) - 2
        });
        $('#dlgChat').animate({
            width: '+=650px'
        }, 300);
        setTimeout(function() {
            $('#content').show();
        }, 295);
    }
    var msg = {};
}
//聊天窗口的响应函数
function iconOver(value) {
    $('#' + value + 'Chat').attr('src', 'images/' + value + '_1.png');
}

function iconOut(value) {
    $('#' + value + 'Chat').attr('src', 'images/' + value + '.png');
}

function minWindow() {
    $('#dlgChat').hide();
}
var isMax = false; //标记是否已经最大化
function maxWindow() {
    if (!isMax) {
        $('#dlgChat').css({
            'width': $(window).width() * 0.99,
            'height': $(window).height() * 0.99,
            'left': $(window).width() * 0.01 / 2,
            'top': 0
        });
        $('#content').css({
            'height': $('#dlgChat').height() - 30
        });
        $('.chat01_content').css({
            'height': $('#content').height() - 50
        });
        $('#talkInputId').css({
            'width': $('#input_content').width() - 130
        });
        isMax = true;
    } else {
        //$('#dlgChat').css({'width':650,'height':500,'left':($(window).width()-650)/2,'top':($(window).height()-500)/2});
        $('#dlgChat').css({
            'width': 650,
            'height': 500
        });
        $('#dlgChat').css({
            left: 250,
            top: parseInt($('#menu').css('height')) - parseInt($('#dlgChat').css('height')) - 2,
            bottom: 0
        });
        $('#content').css({
            'height': $('#dlgChat').height() - 30
        });
        $('.chat01_content').css({
            'height': $('#content').height() - 50
        });
        $('#talkInputId').css({
            'width': $('#input_content').width() - 130
        });
        isMax = false;
    }
}

function closeWindow() {
    $('#content').hide();
    $('#dlgChat').animate({
        width: '-=650px',
        height: '-=500px',
        top: '+=500px'
    }, 300);
    setTimeout(function() {
        $('#dlgChat').hide();
    }, 300);
}
//屏蔽事件
function shield() {
    event.stopPropagation();
    return false;
}
//锁屏
function lock() {
    $('#shield').show();
    $('lockPwd').val('');
    $('lockPwd1').val('');
}
var pwd = "";

function toLock() {
    //pwd=$('#lockPwd').val();
    pwd = localStorage.getItem("pwd");
    $('#locking').hide();
    $('#locked').show();
    $('#lockPwd1').val('');
}

function openLock() {
    if (pwd == $('#lockPwd1').val()) {
        $('#locking').show();
        $('#locked').hide();
        $('#shield').hide();
    } else {
        $('#locked').animate({
            padding: '40px'
        }, 100);
        $('#locked').animate({
            padding: '0px'
        }, 100);
        $('#locked').animate({
            padding: '40px'
        }, 100);
        $('#locked').animate({
            padding: '0px'
        }, 100);
        //$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示','密码错误!');
    }
}

function notLock() {
    $('#shield').hide();
}

function send() {
    showChat();
}