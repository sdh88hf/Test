<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
	String basePath = request.getContextPath() + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>酷仓宝</title>
	<style type="text/css">
			@import 'common/jslib/extjs/resources/css/ext-all-gray.css';
			@import 'common/css/slidetip.css';
	</style>
	
	<!-- ext lib -->
	<script type="text/javascript" src="common/jslib/extjs/ext-all-debug.js"></script>
	<script type="text/javascript" src="common/jslib/extjs/locale/ext-lang-zh_CN.js"></script>
	
	<!-- dwr lib -->
	<script type='text/javascript' src='<%=basePath%>dwr/engine.js'></script>
	<script type='text/javascript' src='<%=basePath%>dwr/util.js'></script>
	
	<script type='text/javascript' src='dwr/interface/UserDwrCall.js'></script>
	
	<!-- 引入所有model -->
	<script type="text/javascript" src="common/jscode/model/account.js"></script>
	<script type="text/javascript" src="common/jscode/model/role.js"></script>
	
	<!-- 引入系统文件 -->
	<script type="text/javascript" src="common/jscode/tools/slidetip.js"></script>
	<script type="text/javascript" src="common/jscode/tools/myAlert.js"></script>
	<script type="text/javascript" src="common/jscode/tools/constant.js"></script>
	<script type="text/javascript" src="common/jscode/tools/ajaxHand.js"></script>
	
	<script type="text/javascript" src="common/jscode/base/searchItems.js"></script>
	<script type="text/javascript" src="common/jscode/application.js"></script>
	
	<!-- 根据权限加载js文件 -->
	<s:iterator value="#request.perList" var="bean">
		<script type="text/javascript" src="common/jscode/<s:property value="#bean.jsUrl"/>.js"></script>
	</s:iterator>
	
	<script type="text/javascript">
	//开启dwr推送
	//dwr.engine.setActiveReverseAjax(true);
	var myself = {};
	/* myself.menus = [ 
					{id : "91",text : "欢迎使用本系统", parentid:"-1", leaf:0,controlType:"", expanded: true,iconCls:"" },
	{id : "92",text : "用户管理", parentid:"91", leaf:0,controlType:"", expanded: true,iconCls:"" },
	{id : "93",text : "账号管理", parentid:"92", leaf:1,controlType:"accountListGrid", expanded: true,iconCls:"" },
	{id : "94",text : "角色管理", parentid:"92", leaf:1,controlType:"roleListGrid", expanded: true,iconCls:"" }]; */
	
	myself.menus = ${perListJson};
	
	myself.sortMenu = function() {
		var children = [];
		
		for ( var i = 0; i < this.menus.length; i += 1) {
			if(this.menus[i].parentid==-1){
				children.push(this.menus[i]);
			}
		}
		
		for(var i = 0;i<children.length;i++){
			
			this.diguiMenu(children[i]);
		}
		
		return children;
	};
	
	myself.diguiMenu = function(child){
		delete child["checked"];
		var flag = 0;
		
		for ( var i = 0; i < this.menus.length; i += 1) {
			
			if(child.id == this.menus[i].parentid){
				
				if(child.children){
					child.children.push(this.menus[i]);
					flag = 1;
				}else{
					child.children = [this.menus[i]];
					flag = 1;
				}
			}	
			
		}
		
		if (flag == 0){
			return child;
		}else{
			
			for(var i = 0;i<child.children.length;i++){
				this.diguiMenu(child.children[i]);
			}
			
		}
		
	}
	
	function aa(a){
		alert(a);
	}
</script>
</head>


<body>
	<div id="header">
		欢迎使用本系统<a href='${pageContext.request.contextPath}/userLogout'>退出</a>
	</div>
</body>
</html>