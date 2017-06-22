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
    $('#hideDiv').hide();
    $('#dg').datagrid({
        onLoadSuccess: function(data) {
            if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '登录超时,请重新登录!');
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
            //			$("a.popImage").fancybox({
            //				openEffect: 'elastic',
            //				closeEffect: 'elastic'
            //			});
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
    });

});
var val = 0;
/*$('#dlge').scroll(function() {
    if ($(this).scrollTop() >= 234) {
        $('.ke-toolbar').css({
            position: 'absolute',
            top: '41px',
            width: '620px'
        })
    } else {
        $('.ke-toolbar').css({
            position: 'inherit'
        })
    }
});*/
//编辑器开始
var editor;
KindEditor.ready(function(K) {
    // 自定义插件 #1
    KindEditor.lang({
        example1: '插入HTML'
    });
    KindEditor.plugin('example1', function(K) {
        var self = this,
            name = 'example1';
        self.clickToolbar(name, function() {
            chooseImage('file_title_img2');
        });
    });

    editor = K.create('#editor_id', {
        resizeType: 1,
        allowPreviewEmoticons: false,
        allowImageUpload: true,
        autoHeightMode: false,
        height: "440px",
        items: [
            'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
            'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
            'insertunorderedlist', '|', 'emoticons', 'link', 'source', 'example1'
        ],
    });
    $(".ke-container-default").css({
        "width": "630px"
    });
});

KindEditor.ready(function(K) {
    K('input[name=getHtml]').click(function(e) {
        alert(editor.html());
    });
    K('input[name=isEmpty]').click(function(e) {
        alert(editor.isEmpty());
    });
    K('input[name=getText]').click(function(e) {
        alert(editor.text());
    });
    K('input[name=selectedHtml]').click(function(e) {
        alert(editor.selectedHtml());
    });
    K('input[name=setHtml]').click(function(e) {
        editor.html('<h3>Hello KindEditor</h3>');
    });
    K('input[name=setText]').click(function(e) {
        editor.text('<h3>Hello KindEditor</h3>');
    });
    K('input[name=insertHtml]').click(function(e) {
        editor.insertHtml('<strong>插入HTML</strong>');
    });
    K('input[name=appendHtml]').click(function(e) {
        editor.appendHtml('<strong>添加HTML</strong>');
    });
    K('input[name=clear]').click(function(e) {
        editor.html('');
    });
});


////编辑器结束

function onOver(id) {
    $('#' + id).css({
        color: '#3fc370'
    });
}

function toOut(id) {
    $('#' + id).css({
        color: '#fff'
    });
}

function seveAticle(e) {
    var tL = $('#aticleTittle').val().trim().length;
    var aticalId = $('#seveAticle').attr('data-id');
    var data = {}
    if (tL <= 0 || tL > 30) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '文章标题不得为空，且长度不超过30');
        return false;
    } else {
        data.subject = $('#aticleTittle').val();
    }
    if ($("#coverimg").find('img').attr('src') == "images/regist_pic.png") {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请插入标题图片');
        return false;
    } else {
        if ($("#coverimg").find('img').attr('src')) {
            data.imageName = $('#coverimg img').attr('src').split('name=')[1];
        } else {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请插入标题图片');
        }
    }
    KindEditor.ready(function(K) {
        if (editor.isEmpty()) {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '文章内容不得为空');
            return false;
        } else {
            data.content = editor.html()
        }
    })
    data.icon = $('#coverimg2 img').attr('src').split('name=')[1];
    if (aticalId) {
        $.ajax({
            type: 'post',
            data: data,
            url: '../ngym/articleAction!newArticleOrUpdate.zk?id=' + aticalId,
            cache: false,
            beforeSend: function() {
                $(e).text('保存中...');
                msgLoading();
            },
            success: function(data) {
                data = $.parseJSON(data);
                if (data.STATUS == true) {
                    $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '文章保存成功');
                    $('#dlge').dialog('close');
                    $('#dg').datagrid('reload');
                }else{
                    $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '必要字段'+data.paraName+data.description);
                }
            },
            complete: function() {
                $(e).text('保存');
                msgLoading('close');
            },
            error: function(err) {
                console.log(err)
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '文章保存失败');
            }
        })
    } else {
        $.ajax({
            type: 'post',
            data: data,
            url: '../ngym/articleAction!newArticleOrUpdate.zk',
            cache: false,
            beforeSend: function() {
                $(e).text('保存中...');
            },
            success: function(data) {
                data = $.parseJSON(data);
                if (data.STATUS == true) {
                    $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '文章保存成功');
                    $('#dlge').dialog('close');
                    $('#dg').datagrid('reload');
                } else {
                    $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
                };
            },
            complete: function() {
                $(e).text('保存');
            },
            error: function() {
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '文章保存失败');
            }
        })
    }
}

function newMemberCard() {
    $('#aticleTittle').val('');
    $('#coverimg').html('<img src="images/regist_pic.png">');
    $('#coverimg2 img').attr('src', "images/regist_pic.png");
    $(".ke-edit-iframe").contents().find(".ke-content").html('');
    $('#dlge').dialog('open').dialog('setTitle', '&nbsp;&nbsp;添加文章信息');

}

function editArticle(id) {
    var row = $('#dg').datagrid('getSelected');
    if (id) {
        $('#seveAticle').attr('data-id', id);
        $.ajax({
            type: 'get',
            url: '../ngym/articleAction!getById.zk?id=' + id,
            cache: false,
            success: function(data) {
                data = $.parseJSON(data);
                console.log(data.article.imageUrl);
                $('#aticleTittle').val(data.article.subject);
                $('#coverimg').html('<img src="../fatburn/file/FileCenter!showImage2.zk?name=' + data.article.imageUrl + '"></img>')
                $(".ke-edit-iframe").contents().find(".ke-content").html(data.article.content);
                $('#dlge').dialog('open').dialog('setTitle', '&nbsp;&nbsp;预览/编辑文章信息');
                $('#coverimg2 img').attr('src', "../fatburn/file/FileCenter!showImage2.zk?name=" + data.article.icon);
                artiIcon = data.icon;
            },
            error: function(err) {
                console.log(err);
            }
        })
    } else {
        if (row) {
            $('#seveAticle').attr('data-id', row.id);
            $.ajax({
                type: 'get',
                url: '../ngym/articleAction!getById.zk?id=' + row.id,
                cache: false,
                success: function(data) {
                    data = $.parseJSON(data);
                    console.log(data.article.imageUrl);
                    $('#aticleTittle').val(data.article.subject);
                    $('#coverimg').html('<img src="../fatburn/file/FileCenter!showImage2.zk?name=' + data.article.imageUrl + '"></img>');
                    $('#coverimg2 img').attr('src', "../fatburn/file/FileCenter!showImage2.zk?name=" + data.article.icon);
                    artiIcon = data.icon;
                    $(".ke-edit-iframe").contents().find(".ke-content").html(data.article.content);
                    $('#dlge').dialog('open').dialog('setTitle', '&nbsp;&nbsp;编辑文章信息');
                },
                error: function(err) {
                    console.log(err);
                }
            })
        } else {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择需要编辑的文章!');
        }
    }
}
$('#dlge').dialog({
    onClose: function() {
        $('#seveAticle').attr('data-id', '');
    }
})

function closeAreat() {
    $('#seveAticle').attr('data-id', '');
    $('#dlge').dialog('close');
    $('#dlg').dialog('close');
}

//上传图片
function chooseImage(id) {
    document.getElementById(id).click();
}
var dataImgTittle = null;

function uploadImage() {
    var viewFiles = document.getElementById("file_title_img");
    var prevDiv = document.getElementById('coverimg');
    //是否为图片类型            
    if (/image\/\w+/.test(viewFiles.files[0].type)) {
        //最大图片文件大小 500KB
        var imgSizeLimit = 5000 * 1024;
        if (viewFiles.files[0].size <= imgSizeLimit) {
            //上传图片
            $("#title_img_form")
                .ajaxSubmit({
                    type: 'post',
                    url: '../file/FileCenter!uploadImage2.zk',
                    cache: false,
                    beforeSubmit: function() {
                        msgLoading();
                    },
                    success: function(data) {
                        data = $.parseJSON(data);
                        if (data.name) {
                            dataImgTittle = data.name;
                            var imgURL = "../fatburn/file/FileCenter!showImage2.zk?name=" + data.name;
                            prevDiv.innerHTML = '<img class="img" src="' + imgURL + '" />';
                            msgLoading('close');
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

function uploadImage2() {
    var viewFiles = document.getElementById("file_title_img2");
    var prevDiv = document.getElementById('coverimg');
    //是否为图片类型            
    if (/image\/\w+/.test(viewFiles.files[0].type)) {
        //最大图片文件大小 500KB
        var imgSizeLimit = 5000 * 1024;
        if (viewFiles.files[0].size <= imgSizeLimit) {
            //上传图片
            $("#title_img_form2")
                .ajaxSubmit({
                    type: 'post',
                    url: '../file/FileCenter!uploadImage2.zk',
                    cache: false,
                    beforeSubmit: function() {
                        msgLoading();
                    },
                    success: function(data) {
                        data = $.parseJSON(data);
                        if (data.name) {
                            var imgURL = "../fatburn/file/FileCenter!showImage2.zk?name=" + data.name;
                            KindEditor.ready(function(K) {
                                K.insertHtml('#editor_id', '<img class="img" src="' + imgURL + '" />');
                            })
                            msgLoading('close');
                        } else {
                            //alert("上传图片出错！");
                            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上传图片出错！');
                            msgLoading('close');
                        }
                        $("#title_img_form2").resetForm();

                    },
                    error: function(XmlHttpRequest, textStatus, errorThrown) {
                        //alert("error");
                        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', 'error');
                    }
                });
        } else {
            //alert("图片大小不能超过" + (imgSizeLimit / 1024) + "KB!");
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "图片大小不能超过" + (imgSizeLimit / 1024) + "KB!");
            msgLoading('close');
        }
    } else {
        //alert('请选择图片类型的文件!');
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择图片类型的文件!');
    }
}

var artiIcon;

function uploadImage3() {
    var viewFiles = document.getElementById("file_title_img3");
    var prevDiv = document.getElementById('coverimg2');
    //是否为图片类型            
    if (/image\/\w+/.test(viewFiles.files[0].type)) {
        //最大图片文件大小 500KB
        var imgSizeLimit = 500 * 1024;
        if (viewFiles.files[0].size <= imgSizeLimit) {
            //上传图片
            $("#title_img_form3")
                .ajaxSubmit({
                    type: 'post',
                    url: '../file/FileCenter!uploadImage2.zk',
                    cache: false,
                    beforeSubmit: function() {
                        msgLoading();
                    },
                    success: function(data) {
                        data = $.parseJSON(data);
                        if (data.name) {
                            var imgURL = "../fatburn/file/FileCenter!showImage2.zk?name=" + data.name;
                            // KindEditor.ready(function(K) {
                            //     K.insertHtml('#editor_id', '<img class="img" src="' + imgURL + '" />');
                            // })
                            $('#coverimg2 img').attr('src', imgURL);
                            artiIcon = data.name;
                            msgLoading('close');
                        } else {
                            //alert("上传图片出错！");
                            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上传图片出错！');
                            msgLoading('close');
                        }
                        $("#title_img_form3").resetForm();

                    },
                    error: function(XmlHttpRequest, textStatus, errorThrown) {
                        //alert("error");
                        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', 'error');
                    }
                });
        } else {
            //alert("图片大小不能超过" + (imgSizeLimit / 1024) + "KB!");
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "图片大小不能超过" + (imgSizeLimit / 1024) + "KB!");
            msgLoading('close');
        }
    } else {
        //alert('请选择图片类型的文件!');
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择图片类型的文件!');
    }
}

function destroyAticle() {

    var row = $('#dg').datagrid('getSelected');
    if (row) {
        $.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;删除确认', '确认删除《' + row.subject + '》吗？', function(r) {
            if (r) {
                $.ajax({
                    type: 'get',
                    url: '../ngym/articleAction!delete.zk?id=' + row.id,
                    success: function(data) {
                        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '文章删除成功');
                        window.location.reload();
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            }
        });

    } else {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择要删除的文章!');
    }
}
var aticleId = '';

function send() {
    var row = $('#dg').datagrid('getSelected');
    if (!row) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择要推送的文章!');
        return;
    }
    aticleId = row.id;
    $('#dlg').dialog('open').dialog('setTitle', '&nbsp;&nbsp;推送文章信息');
}
var pushType = 'customer';
$('#chooseCusterm').change(function() {
    var n = $(this).val();
    console.log(n)
    if (!n) {
        return false;
    } else {
        pushType = n;
    }
})

function pushCuseterm(e) {
    $.ajax({
        type: 'get',
        url: '../ngym/articleAction!push.zk',
        data: {
            articleId: aticleId,
            pushType: pushType
        },
        beforeSend: function() {
            msgLoading();
        },
        success: function(data) {
            data = $.parseJSON(data);
            if (data.STATUS == true) {
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO + '！每月可推送' + data.pushTimeTotle + '次，已推送' + data.pushTime + '次');
                $('#dlg').dialog('close');
            } else {
                $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
            }
        },
        complete: function() {
            msgLoading('close');
        },
        error: function(err) {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '文章推送失败!');
        }
    })

}


//时间格式化
function formatTime(value) {
    var date = new Date((value));
    var result = date.format("yyyy-MM-dd hh:mm:ss"); //date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();//+':'+second;
    return result;
}
// 可执行操作
function formatAction(value, row, index) {
    var send = '<a href="javascript:;" onclick="send(\'' + row.id + '\')">推送</a>';
    var see = '<a href="javascript:;" onclick="editArticle(\'' + row.id + '\')">编辑&nbsp;&nbsp;&nbsp;&nbsp;</a>';
    var seeser = '<a href="javascript:;" onclick="openIframe(\'' + row.url + '?random=' + (Math.random() * 10000).toFixed(0) + '\')">预览&nbsp;&nbsp;&nbsp;&nbsp;</a>';
    var action;

    action = '<div class="action">' + seeser + see + send + '</div>';

    return action;
}

function formatTitle(value, row, index) {
    var vlenght = value.length;
    if (vlenght > 15) {
        return value.substring(0, 15) + "...";
    }
    return value
}

function formatUrl(value, row, index) {
    return '<a href="javascript:;" onclick="openIframe(\'' + value + '?random=' + (Math.random() * 10000).toFixed(0) + '\')">预览</a>';
}


function openIframe() {
    var row = $('#dg').datagrid('getSelected');
    if (!row) {
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择要预览的文章!');
        return;
    }
    var url = row.url + '?random=' + (Math.random() * 10000).toFixed(0);
    $('.copyurl').val(url)
    $('#srcUrl iframe').attr('src', url);
    $('#srcUrl').dialog('open').dialog('setTitle', '&nbsp;&nbsp;预览文章');
    var boxdtop = $('#srcUrl').offset().top;
    var boxdleft = $('#srcUrl').offset().left;
    $('#copyBox').css({
        top: boxdtop + 'px',
        left: boxdleft + 'px',
        opacity: 1
    });
}
$('#srcUrl').dialog({
    onClose: function() {
        $('#copyBox').css({
            top: 0,
            left: '-100%',
            opacity: 1
        });
    }
})

function formatStatus(value, row, index) {
    var send = '<a href="javascript:;" onclick="send(\'' + row.id + '\')">推送</a>';
    if (row.isPushed == 'n') {
        return '<div style=color:green>未推送</div>'
    } else {
        return '<div style=color:red>已推送</div>'
    }
}

function searchMemberCard() {
    var subject = $("#txt_word").searchbox("getValue");
    $("#dl").datagrid('load', {
        subject: subject
    });
    $("#txt_word").searchbox("setValue", '');
}