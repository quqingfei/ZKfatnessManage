function loginTimeout() {
    window.top.location.replace('index.html?redirect=' + encodeURIComponent(location.href));
}
$(function() {
    //localTime();//启动日期计时器
    $('body').css('height', $(window).height()); //设置body的高度
    $('body').css('width', $(window).width());
    var height0 = $('body').height();
    var width0 = $('body').width();
    $('#center-region').css({
        'width': width0,
        'height': height0
    });
    $('#leftDiv').css({
        'height': height0 - 52
    });
    $('.dlg').css({
        'max-height': height0 - 50 - 40
    });
    $('#rightDiv').css({
        'height': height0 - 52
    });
    $('.message').css({
        'max-height': height0 - 52 - 40 - 40
    });
    // $('.textbox').css({
    //     'width': width0 * 0.55 - 40 - 60 - 10
    // });
    $('.owntext').css({
        'width': width0 * 0.55 - 40 - 60 - 10 - 20
    });
    // $('.textbox-text').css({
    //     'width': width0 * 0.55 - 40 - 60 - 10,
    //     'padding': 0,
    //     'font-size': 14
    // });
    // $('.showImgDiv').css({
    //     'width': width0 * 0.55 - 40 - 60 - 10
    // });
    //资质认证
    // $('#editMessage').css({
    //     'height': height0 - 10 - 40 - 60
    // });
    $('.textSafety').css({
        'width': width0 * 0.39 - 10 - 40 - 100
    });
    $(window).resize(function() {
        $('body').css('height', $(window).height()); //设置body的高度
        $('body').css('width', $(window).width());
        var height0 = $('body').height();
        var width0 = $('body').width();
        $('#center-region').css({
            'width': width0,
            'height': height0
        });
        $('#leftDiv').css({
            'height': height0 - 52
        });
        $('#rightDiv').css({
            'height': height0 - 52
        });
        $('.dlg').css({
            'max-height': height0 - 50 - 40
        });
        $('#message').css({
            'max-height': height0 - 52 - 40 - 40
        });
        // $('.textbox').css({
        //     'width': width0 * 0.55 - 40 - 60 - 10
        // });
        $('.owntext').css({
            'width': width0 * 0.55 - 40 - 60 - 10 - 20
        });
        // $('#description').css({
        //     'height': 75
        // });
        // textChange('description');
        // textPut('description');
        // $('.textbox-text').css({
        //     'width': width0 * 0.55 - 40 - 60 - 10,
        //     'padding': 0,
        //     'font-size': 14
        // });
        // $('.showImgDiv').css({
        //     'width': width0 * 0.55 - 40 - 60 - 10
        // });
        //资质认证
        // $('#editMessage').css({
        //     'height': height0 - 10 - 40 - 60
        // });
        $('.textSafety').css({
            'width': width0 * 0.39 - 10 - 40 - 100
        });
    });
    // $('#phoneCode').hide();
    // showMessageA();
    // showMessage();
    
});
$('#hideDiv').hide();
    $('#storeCode').focus();
    $('#storeCode').focus(function() {
        $('#storeCode').val('');
        document.onkeydown = function(e) {
            var ev = document.all ? window.event : e;
            if (ev.keyCode == 13) {
                //          storeCode();
                $('#storeCode').blur();
            }
        }
    });
    $('#storeCode').on("keydown",function(e) {
        if(e.keyCode==13){
            storeCode();
        }
    });
    function storeCode() {
        //  var code = '1477041617651126800';
        var code = $('#storeCode').val();
    /*    if (code == '' || code.length > 18) {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '条码不正确！');
        } else {*/
            //      ajaxData('http://192.168.1.250:8080/fatburn/gym/userAction!getUserByCode.zk', {
            //          code: code
            //      }, 'storeCodeBack')
            postData('../ngym/GymScoreAction!getById.zk', {
                id: code
            }, storeCodeBack)
        // }
    }
    var orderID = ''; 
    function storeCodeBack(data) {
        data = eval('(' + data + ')');
        if (data.STATUS) {
            // console.log(data);
            orderID = data.order.id;
            $('#orderimg').attr('src','../file/FileCenter!showImage2.zk?name='+data.order.cover);
            $('#ordername').text(data.order.name);
            $('#orderyuan').text(data.order.cashPrice);
            var nse = eval('(' + data.user + ')');
            $('#nnimg').attr('src','../file/FileCenter!showImage2.zk?name='+nse.headIcon);
            if(data.order.delivery=="n"){
                $('.goodsvbtn').removeClass('YESmai');
                $('.goodsvbtn').addClass('NOmai').text('确定兑换');
            }else{
                $('.goodsvbtn').removeClass('NOmai');
                $('.goodsvbtn').addClass('YESmai').text('已兑换');
            }
            if(nse.sex=="F"){
                $('.vipimg').addClass('faman');
            }else{
                $('.vipimg').addClass('man');
            }
            $('#nna').text(nse.userName);
            $('#nnb').text(nse.phone);
        } else {
        if (data.ERROR == '未登录') {
            loginTimeout();
            return;
        }
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '无效条形码！');
        }
    }
    $('.goodsvbtn').click(function(){
        if($(this).text()=="已兑换"){
            return false;
        }else if($(this).text()=="确定兑换"){
            $.ajax({
                type: 'post',
                url: '../fatburn/ngym/GymScoreAction!delivery.zk',
                data: {id: orderID},
                dataType: 'json',
                success: function(res){
                    if(res.STATUS){
                        window.location.href = 'storeXchangeRecord.html' 
                   }else{
                        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', res.INFO); 
                   }
                    
                }
            })
        }
    })

function removeCover(i) {
    $.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;提示', '确认删除？', function(e) {
        if (e) {
            $('#imghead-' + i).parent().remove();
            removeId.push(i);
        }
    });
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