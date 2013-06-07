Ext.define("app.user.account.searchGridUpdBtn",{
	extend : "Ext.button.Button",
	alias : "widget.userAccountSearchGridUpdBtn",
	handler : function(){
		var me = this;
		var parentGrid = me.findParentByType("grid");
		
		var selectData = parentGrid.checkSelectRow(1);
		if(selectData){
			Ext.create('Ext.Window', {
		        title: '修改用户',
		        width: 400,
		        height: 300,
		        plain: true,
		        layout: 'fit',
		        items: Ext.create("app.user.account.updForm",{
		        	parentGrid : parentGrid,
		        	dataid : selectData[0]
		        })
		    }).show();
		}
		
		//parentGrid.addRow();
	}
});