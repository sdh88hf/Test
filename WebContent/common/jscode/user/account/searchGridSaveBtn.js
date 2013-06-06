Ext.define("app.user.account.searchGridSaveBtn",{
	extend : "Ext.button.Button",
	alias : "widget.userAccountSearchGridSaveBtn",
	handler : function(){
		var me = this;
		
		var parentGrid = me.findParentByType("grid");
		
		var updDatas = parentGrid.store.getUpdatedRecords();
		
		var newDatas = parentGrid.store.getNewRecords();
		
		var saveDatas = [];
		
		for(var i = 0;i<updDatas.length;i++){
			saveDatas.push(updDatas[i].data);
		}
		
		for(var i = 0;i<newDatas.length;i++){
			saveDatas.push(newDatas[i].data);
		}
		
		if(saveDatas.length==0){
			app.alert("错误提示","没有任何数据修改");
			return;
		}
		Ext.Ajax.request({
    		url : 'account!save.action',
    		type : 'json',
    		params : {
    			msg : Ext.encode(saveDatas)
    		},
    		success : new app.ajaxHand({
    			success : function(result){
    				Ext.slidetip.msg("提示",result.msg);
    				parentGrid.store.load();
    			}
    		})
    	});
	}
});