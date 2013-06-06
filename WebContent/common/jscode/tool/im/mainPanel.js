Ext.define("app.tool.im.mainPanel", {
	extend : "Ext.panel.Panel",
	alias: 'widget.toolImMainPanel',
	initComponent : function(){
		var me = this;
		Ext.apply(this,{
			items : []
			
		});
		
		me.callParent();
	}
});