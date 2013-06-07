Ext.define("app.user.account.updForm", {
	// 继承自
	extend : "app.user.account.form",
	loadById : function(){
		var me = this;
		Ext.Ajax.request({
			url : 'account!find.action',
			params : {
				'entity.id' : me.dataid
			},
			success : new app.ajaxHand({
				success : function(result,scope) {
					var entity = result.entity;
					me.loadData(entity);
				}
			})

		});
	},
	initComponent : function() {
		var me = this;
		
		me.callParent();
		
	}
});