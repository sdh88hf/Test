Ext.define("app.tool.im.mainPanel", {
	extend : "Ext.panel.Panel",
	alias: 'widget.toolImMainPanel',
	initComponent : function(){
		var me = this;
		Ext.apply(this,{
			layout : 'border',
			items : [
			         
			         
			         ]
			
		});
		
		me.callParent();
		
		
//		me.friendwin = Ext.create('widget.window', {
//            title: '好友列表',
//            closable: false,
//            width: 200,
//            minWidth: 150,
//            height: 550,
//            bodyStyle: 'padding: 5px;'
//        }).show();
		
	}
});