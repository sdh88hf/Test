Ext.define("app.base.paging", {
	extend : "Ext.toolbar.Paging",
	displayInfo: true,
	displayMsg:'{0}-{1}/{2}',
	emptyMsg:'无任何数据',
	initComponent : function(){
		var me = this;
		
		
		me.callParent();
	}
});