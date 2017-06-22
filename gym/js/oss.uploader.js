
accessid = '';
accesskey = '';
host = '';
policyBase64 = '';
signature = '';
callbackbody = '';
filename = '';
key = '';
expire = 0;
now = timestamp = Date.parse(new Date()) / 1000; 

function send_request()
{
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    if (xmlhttp!=null)
    {
        phpUrl = '../OSSPolicyAction.zk' ;
        //phpUrl = 'policy.json' ;
    	//phpUrl = 'policy_test.json?'+new Date().getTime() ;
        xmlhttp.open( "GET", phpUrl, false );
        xmlhttp.send( null );
        return xmlhttp.responseText;
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
};

function get_signature()
{
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000; 
    console.log('get_signature ...');
    console.log('expire:' + expire.toString());
    console.log('now:', + now.toString());
    if (expire < now + 30 * 60)//30分钟
    {
        console.log('get new sign');
        body = send_request();
        var obj = eval ("(" + body + ")");
        host = obj['host'];
        policyBase64 = obj['policy'];
        accessid = obj['accessid'];
        signature = obj['signature'];
        expire = parseInt(obj['expire']);
        callbackbody = obj['callback'] ;
        key = obj['dir'];
        return true;
    }
    return false;
};

function set_upload_param(up)
{
    var ret = get_signature();
    if (ret == true)
    {
        new_multipart_params = {
            'key' : key + '${filename}',//OSS Object的名字 
            'policy': policyBase64,
            'OSSAccessKeyId': accessid, 
            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
            'callback' : callbackbody,
            'signature': signature,
        };

        up.setOption({
            'url': host,
            'multipart_params': new_multipart_params ,
            /*filters : {
            	  mime_types : [ //只允许上传图片和zip文件
            	    { title : "Image files", extensions : "jpg,gif,png" }, 
            	    { title : "Zip files", extensions : "zip" }
            	  ],
            	  max_file_size : '400kb', //最大只能上传400kb的文件
            	  prevent_duplicates : true //不允许选取重复文件
            	}*/
        });

        console.log('reset uploader');
        //uploader.start();
    }
}

var upButton;
var uploader = new plupload.Uploader({
	runtimes : 'html5,flash,silverlight,html4',
	browse_button : 'upImg',//'selectfiles', 
	container: document.getElementById('upcontainer'),
	flash_swf_url :'lib/plupload-2.1.2/js/Moxie.swf',//'js/Moxie.swf',
	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',//'js/Moxie.xap',
    url : 'http://oss.aliyuncs.com',
    drop_element : 'upcontainer',
	init: {
		PostInit: function() {
			//document.getElementById('ossfile').innerHTML = '';
/*			document.getElementById('uploadBtn').onclick = function() {
	            set_upload_param(uploader);
	            uploader.start();
	            return false;
			};*/
		},
		FilesAdded: function(up, files) {
			$('#upImg').hide();
			//$('#upImg').attr('id','upImg1');
			plupload.each(files, function(file){
				//document.getElementById('upcontainer').innerHTML = '<div id="' + file.id + '"style=\"margin-top:50px;\">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
				//+'<div class="progress" style="width:250px;height:10px;"><div class="progress-bar" style="width: 0%;height:100%;background:green;"></div></div>'
				//+'</div>';
				
				$($('#upcontainer').children('div')[0]).show();
				$($('#upcontainer').children('div')[1]).hide();
				$($('#upcontainer').children('div')[0]).attr({
            		'id':file.id
            	});
				$('#fileName').text(file.name + '(' + plupload.formatSize(file.size) + ')');
				console.log(file);
			});
            set_upload_param(uploader);
            uploader.start();
            //alert(1);
            return false;
		},
		UploadProgress: function(up, file){
			//alert(1);
			var d = document.getElementById(file.id);
			d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            var prog = d.getElementsByTagName('div')[0];
			var progBar = prog.getElementsByTagName('div')[0];
			progBar.style.width= 2.5*file.percent+'px';
			progBar.setAttribute('aria-valuenow', file.percent);
		},
		FileUploaded: function(up, file, info){
            //console.log('uploaded');
            //console.log(info.status);
            set_upload_param(up);
            if (info.status == 200)
            {
            	var src = 'http://zkimages.oss-cn-hangzhou.aliyuncs.com/'+key+file.name;
            	console.log(src);
            	//$('#upcontainer').html('<video id = "'+"v" + $.now()+'"style="width:100%;height:100%;" controls="controls"><source src="'+src+'" type="video/mp4"></video>');
            	//alert((file.type));
            	var fileType = (file.type).split('/')[0];
            	var fileTypeName = file.type.split('/')[1];
            	$($('#upcontainer').children('div')[0]).hide();
            	$($('#upcontainer').children('div')[1]).hide();
            	if(fileType=='video'){
            		$($('#upcontainer').children('video')[0]).show();
            		$('#upcontainer').attr('value','video');
            		$($('#upcontainer').children('video')[0]).attr({
            			'id':'v' + $.now(),//file.id,
            			'src':src,
            			'type':file.type
            		});
            	}else if(fileType=='image'){
            		$($('#upcontainer').children('img')[0]).show();
            		$('#upcontainer').attr('value','img');
            		$($('#upcontainer').children('img')[0]).attr({
            			'id':'v' + $.now(),//file.id,
            			'src':src
            		});
            	}else{
            		alert('请上传规定格式的文件！')
            		/*
            		$($('#upcontainer').children('audio')[0]).show();
            		$($('#upcontainer').children('audio')[0]).attr({
            			'id':'v' + $.now(),//file.id,
            			'src':src,
            			'type':file.type
            		});*/
            	}
            	$('#upfile').val(src);
            	//$('#upvideo').attr('src','http://zkimages.oss-cn-hangzhou.aliyuncs.com/1450925295973353001/movie.mp4');
                //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'success';
            }
            else
            {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
            } 
		},
		Error: function(up, err){
            set_upload_param(up);
			document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
		}
	}
});

uploader.init();