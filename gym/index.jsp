<%@page import="com.zhaiker.dao.DaoFactory"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="com.zhaiker.sqlmap.accountLogin.AccountLogin,com.zhaiker.dao.CommonDao" %>
<%@page import="java.util.Date"%>
<%
	//当前用户（IP）是否存在恶意登录
	CommonDao<AccountLogin>	loginDao	=  DaoFactory.getDao(AccountLogin.class);
	AccountLogin loginException = new AccountLogin();
	loginException.setIp(request.getRemoteAddr());
	loginException.setStatus(AccountLogin.STATUS_ERROR);
	loginException.setGmtCreate(new Date());
	Integer exceptions = loginDao.getConditionCount(loginException);
	boolean ipException = false ;//IP异常
	if(exceptions >= 3){
		ipException = true;
	}
	//密码出错是否超过3次
	Object accountExcption = request.getAttribute("accountExcption");
	boolean loginExcpt = ipException || (accountExcption != null);
	//错误信息
	Object errorInfo = request.getAttribute("errorInfo");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>健身房管理系统</title>
<link rel="stylesheet" type="text/css" href="css/index.css"></link>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/utils.js"></script>
<script type="text/javascript">
	
	$(function(){
		var redirect = $.getUrlVar('redirect');
		if(redirect){
			$("#redirect").val(redirect);
		}
	});
	<%
		if(errorInfo != null){
	%>
			alert('<%=errorInfo%>');
	<%		
		}
	%>

	function changeCode(){
		var url = '../ValidateCodeAction.zk?' + new Date().getTime();
		$("#codeImg").attr('src',url);
	}
	
 	$(function() {
		$("#user_id").focus();
	}); 
 	
 	function checkForm(){
		var user_id = $("#user_id").val();
		if (user_id == '') {
			alert('请填写账号！');
			$("#user_id").focus();
			return false;
		}
		var user_pwd = $("#user_pwd").val();
		if (user_pwd == '') {
			alert('请填写密码！');
			$("#user_pwd").focus();
			return false;
		}
		<%
		if(loginExcpt == true){
		%>
			var code = $("#code").val();
			if (!code) {
				alert('请填写验证码！');
				$("#code").focus();
				return false;
			}
		<%		
			}
		%>
		return true;
 	}
</script>
</head>
<body>
<div id="zk_title"></div>
	<form method="post" action="loginAction.zk" onsubmit="return checkForm()">
		<input type="hidden" name="redirect" id="redirect" />
		<div class="head"></div>
		<div class="head_po">
			<div class="head_fop">
				<div class="head_sail">
					<div class="head_ppy">账 号：</div>
					<div class="head_max">
						<input type="text" class="head_fly" id="user_id" name="user_id" value="13012341234"/>
					</div>
				</div>
				<div class="head_sail">
					<div class="head_ppy">密 码：</div>
					<div class="head_max">
						<input type="password" class="head_fly" id="user_pwd" name="user_pwd" value="zkgymadmin"/>
					</div>
				</div>
				<%
					if(loginExcpt == true){
				%>
					<div class="head_sail">
						<div class="head_ppy">验证码：</div>
						<div class="head_max">
							<input id="code" name="code" type="text" style="border: 1px solid #aaaaaa; margin-top: 2px; width: 50px; height: 18px; float:left;" />
						    <div style=" float:left; width:50px; height:22px;  text-align:center; margin-left:5px;">
						    	<img id="codeImg" src="../ValidateCodeAction.zk" alt="验证码" title="点击刷新" style="cursor: pointer;width: 70px;height: 26px;" onclick="changeCode()" />
						    </div>
						</div>
					</div>
				<%		
					}
				%>
				<div class="head_xun">
					<div class="head_yi">
						<input type="submit" class="head_keyi" value="登 录" />
					</div>
					<div class="head_tian">
						<input type="reset" class="head_keyi" value="重 置" />
					</div>
				</div>
			</div>
		</div>
	</form>
</body>
 <script type="text/javascript" src="js/zk_title_bar-1.0.0.js"></script>
        <script>
            if(window.zk_Win_X()){
                new TitleBar("zk_title","#333333","燃脂部落健身场所管理系统","./css/images/logo.png");
            }else{
                console.log('不在应用程序中');
            }
        </script>
</html>