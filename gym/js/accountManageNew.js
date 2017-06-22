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
    showMessageA();
    showMessage();


});
// 百度地图API功能
function G(id) {
    return document.getElementById(id);
}

var map = new BMap.Map("l-map");
var top_right_navigation = new BMap.NavigationControl({
    anchor: BMAP_ANCHOR_TOP_RIGHT,
    type: BMAP_NAVIGATION_CONTROL_ZOOM
});
// map.centerAndZoom("北京", 10); // 初始化地图,设置城市和地图级别。
// var point = new BMap.Point(114.311831,30.558428);
// map.centerAndZoom(point,12);
// map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
// map.addControl(top_right_navigation);
// map.removeControl(top_right_navigation);
// map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
// map.disableDragging();
// var infoView = new BMap.InfoWindow("I am here");
// var addr;
var ac = new BMap.Autocomplete({
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
    // marker.enableDragging();
    // $('#gpsX').val(marker.point.lat);
    // $('#gpsY').val(marker.point.lng);
    marker.addEventListener("dragend", function(e) {
        geoc.getLocation(e.point, function(rs) {

            var addComp = rs.addressComponents;
            $('#address').val(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber);
        });
    });
    geoc.getLocation(result.center, function(rs) {

        var addComp = rs.addressComponents;
        $('#address').text(addComp.province + addComp.city);
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
        marker = new BMap.Marker(pp);
        map.addOverlay(marker); //添加标注
        marker.enableDragging();
        gpsX = marker.point.lat;
        gpsY = marker.point.lng;
        marker.addEventListener("dragend", function(e) {
            geoc.getLocation(e.point, function(rs) {
                var addComp = rs.addressComponents;
                $('#address').val(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber);
                gpsX = marker.point.lat;
                gpsY = marker.point.lng;
            });
        });
    }
    var local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
    });
    local.search(myValue);
}
// bd_decrypt(116.404, 39.915);
var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
var gg_lat, gg_lon, bd_lat, bd_lon;
//百度坐标转火星坐标
function bd_decrypt(bd_lat, bd_lon) {

    var x = bd_lon - 0.0065,
        y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    gg_lon = z * Math.cos(theta);
    gg_lat = z * Math.sin(theta);
    // console.log(gg_lat + ',' + gg_lon)
}
//火星坐标转百度坐标
function bd_encrypt(gg_lat, gg_lon) {
    var x = gg_lon,
        y = gg_lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    bd_lon = z * Math.cos(theta) + 0.0065;
    bd_lat = z * Math.sin(theta) + 0.006;
    // console.log(bd_lat + ',' + bd_lon)
}

function textChange(id) {
    var it = document.getElementById(id);
    it.style.height = (it.scrollHeight + 5) + 'px'
}

function textPut(id) {
    var it = document.getElementById(id);
    it.style.height = (it.scrollHeight + 5) + 'px'
}
var urlAccount;
var gpsX, gpsY;
//操作基本信息
function showMessageA() {
    $.getJSON('GymAccountAction!getGymInfo.zk', {}, function(data) {
        if (data.STATUS) {

            //$("#gymName").textbox('setValue',data.gym.gymName);
            if (!!data.gymName) {
                $("#gymName").val(data.gymName);
            }
            if (!!data.officePhone) {
                $("#gymPhone").val(data.officePhone);
            }

            //$("#description").textbox('setValue',data.gym.description);
            // $("#description").val(data.description);
            // textChange('description');
            // textPut('description');
            //$("#address").textbox('setValue',data.gym.address);
            // $("#address").val();
            // addr = data.address;
            if (!!data.address) {
                ac.setInputValue(data.address);
            }

            var point = new BMap.Point(116.404, 39.915);
            if (data.gpsX && data.gpsY) {
                gpsX = data.gpsX;
                gpsY = data.gpsY;
                bd_encrypt(gpsX, gpsY);
                point = new BMap.Point(bd_lon, bd_lat);
            }

            marker = new BMap.Marker(point);
            map.addOverlay(marker); //添加标注
            setTimeout(function() {
                map.centerAndZoom(point, 18);
            }, 200);

            $('#businessHours').val('00:00-00:00');
            $('#courseTime1').timespinner('setValue', '00:00');
            $('#courseTime2').timespinner('setValue', '00:00');
            if (!!data.businessHours) {
                $('#businessHours').val(data.businessHours);
                $('#courseTime1').timespinner('setValue', data.businessHours.split("-")[0]);
                $('#courseTime2').timespinner('setValue', data.businessHours.split("-")[1]);
            }


            //基本信息
            // $("#certificationA").val(data.certification);
            urlAccount = 'GymAccountAction!updateGymInfo.zk?id=' + data.id;
            if (!!data.cover) {
                var covers = eval('(' + data.cover + ')');
                var lens = covers.length;
                var divImg = ''
                for (var i = 0; i < lens; i++) {
                    divImg = divImg + '<div class="showImgDiv"><img id="imghead-' + i + '" class="" src="../file/FileCenter!showImage2.zk?name=' + covers[i] + '" onclick="chooseImage2(\'file_title_img\',' + i + ')" /><div class="deleteCover" onclick="removeCover(' + i + ')">×</div></div>';
                }
                $('#coverContant').append(divImg);
                $("#cover").val(data.cover);
            }

            $('.image-add').hide();

            $('.owntext').css('border-color', '#fff');
            $('.owntext').attr("disabled", "disabled");
            $('.checkComb input').attr("disabled", "disabled");
            if (!!data.serviceFacility) {
                for (var i = data.serviceFacility.length - 1; i >= 0; i--) {
                    $("input[value='" + data.serviceFacility[i] + "']").attr("checked", "checked");
                }
            }
        } else {
            if ('No Login!' == data.ERROR) {
                loginTimeout();
                return;
            }
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '获取信息失败!');
            //relogin();
        }
    });

}
var isEdit = 1; //标记是否编辑
function editAccount() {
    //$('.textbox-text').removeAttr("disabled");
    //$('.textbox').css({borderWidth:1});
    isEdit = 0;
    $('.owntext').css('border-color', '#ccc');
    $('.owntext').removeAttr("disabled");
    $('#services').attr("disabled", "disabled");
    $('.checkComb input').removeAttr("disabled");
    $('.checkService').show();
    $('#editTitle').hide();
    $('#saveTitle').show();
    $('#serv').show();
    $('.image-add').show();
    $('.deleteCover').show();
    $('#businessCtrl').show();
    $('#businessHours').hide();
    marker.enableDragging();
    map.addControl(top_right_navigation);
    // map.enableDragging();
    marker.addEventListener("dragend", function(e) {
        geoc.getLocation(e.point, function(rs) {
            var addComp = rs.addressComponents;
            $('#address').val(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber);
            gpsX = marker.point.lat;
            gpsY = marker.point.lng;
        });
    });
}

function checkFormA() {
    var name = $.trim($("#gymName").val());
    if (name == '' || name == null) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '场馆名称不能为空!');
        $("#gymName").focus();
        return false;
    }
    var gymPhone = $('#gymPhone').val();
    var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    var isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
    // var value=document.getElementById("ss").value.trim();
    if (!isMob.test(gymPhone) && !isPhone.test(gymPhone)) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请正确输入场馆电话!');
        return false;
    }
    if (!gymPhone) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '场馆电话不能为空!');
        return false;
    }
    if (!$("#address").val()) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '场馆地址不能为空!');
        return false;
    }
    if (!$('#courseTime1').timespinner('getValue') || !$('#courseTime2').timespinner('getValue')) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '营业时间不能为空!');
        return false;
    }

    var courseTime1 = $('#courseTime1').timespinner('getValue');
    var courseTime2 = $('#courseTime2').timespinner('getValue');
    if (parseInt(courseTime1.split(':')[0] + courseTime1.split(':')[1]) > parseInt(courseTime2.split(':')[0] + courseTime2.split(':')[1])) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '开始时间不能在结束时间之后!');
        return false;
    }
    if ($('.showImgDiv').length == 0) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请上传至少一张封面!');
        return false;
    }

    if ($("input[name='services']:checked").length == 0) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择至少一个设施!');
        return false;
    }
    // if (!$('#description').val()) {
    //     $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '简介不能为空!');
    //     return false;
    // }
    return true;
}
// var services = [];
var removeId = [];

function removeCover(i) {
    $.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;提示', '确认删除？', function(e) {
        if (e) {
            $('#imghead-' + i).parent().remove();
            removeId.push(i);
        }
    });
}

function saveMessageA() {
    if (checkFormA()) {
        clearSpecialStr('fm1');
        var gymName = $("#gymName").val();
        // var description = $("#description").val(); //textbox('getValue');
        var description = '无';
        var address = $("#address").val();
        var cover = [];
        $('.showImgDiv img').each(function() {
            var src = $(this).attr('src').split("=")[1];
            cover.push(src);
        })
        var certification = $("#certification").val();
        var gymPhone = $('#gymPhone').val();
        // var array = [];
        var services = [];
        bd_decrypt(gpsX, gpsY);
        $("input[name='services']").each(function() {
            if ($(this).is(':checked')) {
                // alert();
                services.push($(this).attr('value'));
            }
        })
        $('#businessHours').val($('#courseTime1').timespinner('getValue') + '-' + $('#courseTime2').timespinner('getValue'));
        var time = $('#businessHours').val();
        $.post(urlAccount, {
            gymName: gymName,
            description: description,
            certification: certification,
            cover: JSON.stringify(cover),
            address: address,
            serviceFacility: JSON.stringify(services),
            businessHours: time,
            officePhone: gymPhone,
            gpsX: gg_lat,
            gpsY: gg_lon
        }, function(data) {
            if (data.STATUS) {
                $('#editTitle').show();
                $('#saveTitle').hide();
                $('#serv').hide();
                $('.image-add').hide();
                $('.deleteCover').hide();
                //$('.textbox').css({borderWidth:0});
                //$('.textbox-text').attr("disabled","disabled");
                $('.owntext').css('border-color', '#fff');
                $('.owntext').attr("disabled", "disabled");
                $('.checkComb input').attr("disabled", "disabled");
                $('#businessCtrl').hide();
                $('#businessHours').show();
                // $('.checkService').hide();
                // textChange('description');
                // textPut('description');
                isEdit = 1;
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;信息', '保存成功!');
            } else {
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '保存失败!');
            }
        }, 'json');
        marker.disableDragging();
        map.removeControl(top_right_navigation);
        // map.disableDragging();
    }
}


//操作资质认证
var uploadImages = [];
var certificate; //证书字符串
var url;
var certificateName = [];
var update = 0; //标记是否为修改证书照片
var isEdit1 = 1; //标记是否编辑
function showMessage() {

    //var row = $('#dg').datagrid('getSelected');
    $.getJSON('GymAccountAction!getGymInfo.zk', {}, function(data) {
        if (data.STATUS) {
            //alert(JSON.stringify(data));
            $("#gymName1").val(data.gymName);
            $("#admin").val(data.businessNo);
            $("#adminPhone").val(data.adminPhone);
            //$("#newPwd").val(data.gym.admin_phone);
            $('#gymPhone_1').val(data.adminPhone);
            $("#zfbName").val(data.zfbName);
            $("#zfbAccount").val(data.zfbAccount);
            $("#certification").attr('src', '../file/FileCenter!showImage2.zk?name=' + data.certification[0].image);
            url = 'GymAccountAction!updateGymAdminInfo.zk?id=' + data.id;
            //加载证书
            // certificate = data.certification; //eval('(' + data.gym.certification + ')');
            // //alert(data.gym.certification);
            // if (certificate) {
            //     for (var i = 0; i < certificate.length; i++) {
            //         uploadImages[i] = certificate[i].image;
            //         certificateName[i] = certificate[i].name; //获取证书名称
            //     }
            // }

            // for (var i = 0; i < uploadImages.length; i++) {
            //     var imgURL = "../file/FileCenter!showImage2.zk?name=" + uploadImages[i];
            //     var id = uploadImages[i].split(".")[0];
            //     add(id);
            //     $("#" + id).attr("src", imgURL);
            //     $("#" + id).attr("alt", uploadImages[i]);
            //     $("#" + id + "name").val(certificateName[i]);
            // }
            // $('input').attr("disabled", "disabled");
            // $('input').css('border-color', '#fff');
            $('.textSafety').attr("disabled", "disabled");
            $('.textSafety').css('border-color', '#fff');
            //$('#image_container').children('input').css({borderWidth:0})
            //$('.certificateName input').attr("readonly","readonly");
            $('#hideDiv').hide();
        } else {
            if ('No Login!' == data.ERROR) {
                loginTimeout();
                return;
            }
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '获取信息失败!');
            //relogin();
        }
    });
    // $('input').css('border-color', '#fff');
    // $('input').attr("disabled", "disabled");
    //$('.textSafety').attr("disabled","disabled");
    //$('.textSafety').css({borderWidth:0});
}

function editMessage() {
    $('#showCode').show();
    $('#editMessage').hide();
    $('#code').css('border-color', '#ccc');
    $('.textSafety').removeAttr("disabled");
    $('input').removeAttr("disabled");
    $('#adminPhone').attr("readonly", "readonly");
    //$('input').removeAttr("disabled");
    if (isEdit == 1) {
        $('.owntext').css('border-color', '#fff');
        $('.owntext').attr("disabled", "disabled");
    }
    $('#editTitleR').hide();
    $('#saveTitleR').show();
    //$('.certificateName input').attr("readonly","false");
}

$('#phoneChange').on('click', function() {
    phoneChange();
})



function phoneChange() {
    $('#showCode').show();
    $('#code').css('border-color', '#ccc');
    $('#code').removeAttr("disabled");
    $('#phoneChange').hide();
    // $('#phoneCode').show();
}

$('#codeCancle').on('click', function() {
    $('#phoneChange').show();
    // $('#phoneCode').hide();
    $('#showCode').hide();
    $('#showPhone').hide();
})
$('#codeCancle1').on('click', function() {
    $('#phoneChange').show();
    // $('#phoneCode').hide();
    $('#showCode').hide();
    $('#showPhone').hide();
})

$('#codeNext').on('click', function() {
    next();
})

function next() {
    if ($('#code').val() == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '验证码不能为空!');
        $("#code").focus();
        return false;
    }
    $.getJSON('GymAccountAction!checkCode.zk', {
        phone: $.trim($("#adminPhone").val()),
        code: $('#code').val()
    }, function(data) {
        if (!data.check) {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '验证码错误!');
            $("#code").focus();
            return;
        } else {
            if ('No Login!' == data.ERROR) {
                loginTimeout();
                return;
            }
            $('#code').val('');
            $('#showCode').hide();
            // $('#phoneCode').hide();
            $('.show-phone').css('border-color', '#ccc');
            $('.show-phone').removeAttr("disabled");

            $('#showPhone').show();
        }
    });
}
$('#phoneSure').on('click', function() {
    finish();
})

function finish() {
    if ($('#codeNew').val() == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '验证码不能为空!');
        $("#codeNew").focus();
        return false;
    }
    $.getJSON('GymAccountAction!updatePhone.zk', {
        phone: $.trim($("#phoneNew").val()),
        code: $('#codeNew').val()
    }, function(data) {
        if (data.STATUS) {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '手机号修改成功!');
            $('#adminPhone').val($.trim($("#phoneNew").val()));
            $('#codeNew').val('');
            $("#phoneNew").val('');
            $('.show-phone').css('border-color', '#ccc');
            $('.show-phone').removeAttr("disabled");
            $('#phoneChange').show();
            $('#showPhone').hide();
        } else {
            if ('No Login!' == data.ERROR) {
                loginTimeout();
                return;
            }
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
            $("#codeNew").focus();
            return;
        }
    });
}
$('#phoneCode').on('click', function() {
    toCode();
})

//账号验证
function toCode() {
    var adminPhone = $.trim($("#adminPhone").val());
    if (adminPhone == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '手机号不能为空!');
        $("#adminPhone").focus();
        return false;
    } else {
        $.getJSON('loginAction!smsCode.zk', {
            phone: adminPhone
        }, function(data) {
            if (data.STATUS) {
                //alert("验证码已发送，请注意查收！");
                // $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;信息', '验证码已发送，请注意查收！');
                // $('#phoneCode').css('background', '#3FA566');
                $('#phoneCode').unbind('click');
                var count = 60;
                var a = setInterval(function() {
                    $('#phoneCode').text(count + '秒后重新获取');
                    if (count == 0) {
                        // $('#btn-hover div').hide();
                        $('#phoneCode').on('click', function() {
                            toCode();
                        })
                        $('#phoneCode').text('点击获取验证码');
                        // $('#phoneCode').css('background', '#46C274');
                        clearInterval(a);
                    } else {
                        count--;
                    }
                }, 1000)
            } else {
                if ('No Login!' == data.ERROR) {
                    loginTimeout();
                    return;
                }
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
            }
        });
    }
}
$('#newCode').on('click', function() {
    newCode();
})

//新手机验证
function newCode() {
    var adminPhone = $.trim($("#phoneNew").val());
    if (adminPhone == '' || !isTelephone(adminPhone)) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请正确输入手机号!');
        $("#phoneNew").focus();
        return false;
    } else {
        $.getJSON('GymAccountAction!getCode.zk', {
            phone: adminPhone
        }, function(data) {
            if (data.STATUS) {
                //alert("验证码已发送，请注意查收！");
                // $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;信息', '验证码已发送，请注意查收！');
                // $('#newCode').css('background', '#3FA566');
                $('#newCode').unbind('click');
                var count = 60;
                var a = setInterval(function() {
                    $('#newCode').text(count + '秒后重新获取');
                    if (count == 0) {
                        // $('#btn-hover div').hide();
                        $('#newCode').on('click', function() {
                            newCode();
                        })
                        $('#newCode').text('点击获取验证码');
                        // $('#newCode').css('background', '#46C274');
                        clearInterval(a);
                    } else {
                        count--;
                    }
                }, 1000)
            } else {
                if ('No Login!' == data.ERROR) {
                    loginTimeout();
                    return;
                }
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
            }
        });
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
    if ($('.textSafety').attr("disabled") == "disabled")
        return;
    var value = $("#" + id).parent().parent().attr('value');
    $("#" + id).parent().parent().detach();
    event.stopPropagation();
    //var div = document.getElementById("image_container");
    /*
    var div = $('#image_container');
    div.children().each(function(i, n) {
        var obj = $(n)
        if (obj.attr('value') && (obj.attr('value') > value))
            obj.css('left', parseInt(obj.css('left')) - 92);
    });*/
    //var add = $('#addCertificate');
    //add.css('left', parseInt(add.css('left')) - 92);
}

function leftTo() {
    var container = $('#image_container');
    var add = $('#addCertificate');
    //alert(container.scrollLeft());
    if (container.scrollLeft() > 0)
        container.scrollLeft(container.scrollLeft() - 92);
}

function rightTo() {
    var container = $('#image_container');
    var add = $('#addCertificate');
    //alert(container.scrollLeft());
    if (container.scrollLeft() < (parseInt(add.css('left')) - 276))
        container.scrollLeft(container.scrollLeft() + 92);
}
var count = 0;

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
    /*
    var add = $('#addCertificate');
    $(div).css('left', parseInt(add.css('left')));
    add.css('left', parseInt(add.css('left')) + 92);
    var container = $('#image_container');
    if (parseInt(add.css('left')) >= 368)
        container.scrollLeft(parseInt(add.css('left')) - 276);
    */
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
        'class': 'certificateName'
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
        color: "red",
        border: "1px solid #c1c1c1",
        width: "12px",
        height: "12px",
        'font-size': "12px",
        left: 46,
        top: 0
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
var coverId;

function chooseImage2(id, i) {
    coverId = i;
    if (i == 'new') {
        var lens = $('.showImgDiv').length;
        if (lens >= 6) {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '封面不能超过6张！');
            return false;
        }
        if (removeId.length > 0) {
            coverId = removeId[0];
        } else {
            coverId = lens;
        }
    }
    if (isEdit == 1)
        return;
    document.getElementById(id).click();
}

function chooseImage1(id) {
    update = id;
    if (isEdit1 == 1)
        return;
    document.getElementById("image_file").click();
}

function chooseImage(id) {
    update = 0;
    if (isEdit1 == 1)
        return;
    document.getElementById(id).click();
}

//上传封面图片
function uploadImage() {
    //alert('upload');
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
                            if ($("#imghead-" + coverId).length > 0) {
                                $("#imghead-" + coverId).attr("src", imgURL);
                            } else {
                                var divImg = '<div class="showImgDiv"><img id="imghead-' + coverId + '" class="" src="../file/FileCenter!showImage2.zk?name=' + data.name + '" onclick="chooseImage2(\'file_title_img\',' + coverId + ')" /><div class="deleteCover" onclick="removeCover(' + coverId + ')">×</div></div>';
                                $('#coverContant').append(divImg);
                                $('.deleteCover').show();
                                if (removeId.length > 0)
                                    removeId.shift();
                            }



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

//上传封面图片
function uploadImage1() {
    //alert('upload');
    var viewFiles = document.getElementById("file_title_img");
    //是否为图片类型            
    if (/image\/\w+/.test(viewFiles.files[0].type)) {
        //最大图片文件大小 500KB
        var imgSizeLimit = 5000 * 1024;
        if (viewFiles.files[0].size <= imgSizeLimit) {
            //上传图片
            msgLoading();
            $.post({
                url: '../file/FileCenter!uploadImage2.zk',
                data: viewFiles.files[0],
                success: function(data) {
                    msgLoading('close');
                    data = $.parseJSON(data);
                    if (data.name) {
                        var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
                        if ($("#imghead-" + coverId).length > 0) {
                            $("#imghead-" + coverId).attr("src", imgURL);
                        } else {
                            var divImg = '<div class="showImgDiv"><img id="imghead-' + coverId + '" class="" src="../file/FileCenter!showImage2.zk?name=' + data.name + '" onclick="chooseImage2(\'file_title_img\',' + coverId + ')" /><div class="deleteCover" onclick="removeCover(' + coverId + ')">×</div></div>';
                            $('#coverContant').append(divImg);
                            $('.deleteCover').show();
                            if (removeId.length > 0)
                                removeId.shift();
                        }



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

function checkForm() {
    var admin = $.trim($("#admin").val());
    if (admin == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '法人不能为空!');
        $("#admin").focus();
        return false;
    }
    var adminPhone = $.trim($("#adminPhone").val());
    if (adminPhone == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '手机号不能为空!');
        $("#adminPhone").focus();
        return false;
    } else if (!isTelephone(adminPhone)) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '手机号不正确!');
        $("#adminPhone").focus();
        return false;
    }

    var zfbName = $.trim($("#zfbName").val());
    if (zfbName == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '支付宝账户名不能为空!');
        $("#zfbName").focus();
        return false;
    }
    var zfbAccount = $.trim($("#zfbAccount").val());
    if (zfbAccount == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '支付宝账户不能为空!');
        $("#zfbAccount").focus();
        return false;
    }
    /*
    var newPwd = $.trim($("#newPwd").val());
    if (newPwd == '') {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '名称不能为空!');
        $("#newPwd").focus();
        return false;
    }*/
    var list = document.getElementById("image_container").getElementsByTagName("input");
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
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '证书名称为空！');
                $("#" + id).focus();
                return;
            }
            i = i + 1;
        }

    }
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

function saveMessage() {
    if (checkForm()) {
        var formImages = "";
        var imgObjArr = [];
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
        $("#certification").attr("value", "");
        $("#certification").val(formImages);
        //基本信息
        $("#certificationA").val(formImages);
        clearSpecialStr('fm');
        $('#fm').form('submit', {
            url: url,
            onSubmit: function() {
                return checkForm();
            },
            success: function(result) {
                var result = eval('(' + result + ')');
                if (result.STATUS) {
                    $('#showCode').hide();
                    $('#editMessage').show();
                    $('#saveTitleR').hide();
                    $('#editTitleR').show();
                    //$('input').css({borderWidth:0});
                    $('.textSafety').css('border-color', '#fff');
                    $('input').css('border-color', '#fff');
                    $('#newPassword').hide();
                    $('#addCertificate').hide();
                    $('.textSafety').attr("disabled", "disabled");
                    $('input').attr("disabled", "disabled");
                    isEdit1 = 1;
                    showMessage();
                    $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;信息', '保存成功!');
                } else {
                    $.messager.show({
                        title: '错误',
                        msg: '系统繁忙！'
                    });
                }
            }
        });
    }
}

$('#passTitle').on('click', function() {
    $('#showPass input').val('');
    $('#showPass').show();
})

$('#passSure').on('click', function() {
    var pass_1 = $('#passOld').val();
    var pass_2 = $('#passNew').val();
    var pass_3 = $('#passAgain').val();
    if (pass_2 != pass_3) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '确认密码与新密码不一致!');
        return;
    }
    if (pass_2.length > 18 || pass_2.length < 6) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '新密码长度不正确，请保证为6-18位!');
        return;
    }
    $.getJSON('loginAction!resetPwdByPwd.zk', {
        pwd: hex_md5(pass_1),
        newPwd: hex_md5(pass_2)
    }, function(data) {
        if (data.STATUS) {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;完成', '密码修改成功，请妥善保管新密码!');
            $('#showPass').hide();
            return;
        } else {
            if ('No Login!' == data.ERROR) {
                loginTimeout();
                return;
            }
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
        }
    });
})

$('#passCancle').on('click', function() {
    $('#showPass').hide();
})