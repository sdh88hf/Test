Ext.define("app.user.account.searchGridAddBtn",{
	extend : "Ext.button.Button",
	alias : "widget.userAccountSearchGridAddBtn",
	handler : function(){
		var me = this;
		//var parentGrid = me.findParentByType("grid");
		
		Ext.create('Ext.Window', {
	        title: 'Left Header, plain: true',
	        width: 400,
	        height: 200,
	        plain: true,
	        layout: 'fit',
	        items: {
	            border: false
	        }
	    }).show();
		
		
		//parentGrid.addRow();
	}
});