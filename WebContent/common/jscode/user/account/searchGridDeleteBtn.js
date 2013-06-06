Ext.define("app.user.account.searchGridDeleteBtn",{
	extend : "Ext.button.Button",
	alias : "widget.userAccountSearchGridDeleteBtn",
	handler : function(){
		var me = this;
		var parentGrid = me.findParentByType("grid");
		
		var selectDatas = parentGrid.checkSelectRow(2);
		
		if(selectDatas){
			Ext.Msg.confirm("提示","确定要删除吗",function(y){
				if(y=="yes"){
					Ext.Ajax.request({
			    		url : 'account!delete.action',
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
				}
				
			});
		}
		
	}
});