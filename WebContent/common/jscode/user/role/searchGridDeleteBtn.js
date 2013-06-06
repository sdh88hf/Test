Ext.define("app.user.role.searchGridDeleteBtn",{
	extend : "Ext.button.Button",
	alias : "widget.userRoleSearchGridDeleteBtn",
	handler : function(){
		var me = this;
		var parentGrid = me.findParentByType("grid");
		
		var selectDatas = parentGrid.checkSelectRow(2);
		
		if(selectDatas){
			Ext.Msg.confirm("提示","确定要删除吗",function(){
				Ext.Ajax.request({
		    		url : 'role!delete.action',
		    		type : 'json',
		    		params : {
		    			msg : selectDatas[0]
		    		},
		    		success : new app.ajaxHand({
		    			success : function(result){
		    				app.alert(result.msg);
		    				parentGrid.deleteRow();
		    			}
		    		})
		    	});
			});
		}
		
	}
});