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
            
        } else {
            if (data.ERROR == '未登录') {
                loginTimeout();
                return;
            }
        }
    }

function chooseImage(id) {
    document.getElementById(id).click();
}


//上传图片
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
                    $('#hideDiv').css('opacity',0.3).show();
                },
                success: function(data) {
                    data = $.parseJSON(data);
                    if (data.name) {
                        $('#imghead').html('');
                        var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
                        $('#hideDiv').hide().css('opacity',1);
                        $.ajax({
                            type:'get',
                            url:'../gym/GymAccountAction!getGymInfo.zk',
                            dataType:'json',
                            success: function(res){
                                if(res.STATUS){
                                    $.ajax({
                                        type:'get',
                                        url:'../gym/AppBootImagesAction!createOrUpdate.zk',
                                        data:{gymId:res.id,imageName:data.name},
                                        dataType:'json',
                                        success: function(res){
                                            if(res.STATUS){
                                                $('#imghead').html('<img src='+imgURL+' />');
                                                $.messager.show({
                                                    title: "消息",
                                                    timeout: 3000,
                                                    msg: '设置成功'
                                                });
                                            }else{
                                                $.messager.show({
                                                    title: "消息",
                                                    timeout: 3000,
                                                    msg: data.INFO
                                                });
                                            }
                                        }
                                    })
                                }else{
                                    $.messager.show({
                                        title: "消息",
                                        timeout: 1000,
                                        msg: data.INFO
                                    });
                                }
                            }
                        })
                        
                        $("#cover").val(data.name);

                        /*$("#imghidehead").one('load',function()            
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
                            })  */
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

function isTelephone(obj) //手机号正则判断
{
    var pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (pattern.test(obj)) {
        return true;
    } else {
        return false;
    }
}