Ext.define("app.user.role.grid", {
	// 继承自
	extend : "app.base.grid",

	// 依赖的实体
	model : 'Role',

	initComponent : function() {
		var me = this;
		
		if (!me.store) {
			me.store = Ext.create('app.base.store', {
				storeId : 'aa',
				url : 'role!query.action',
				model : me.model
			});
			me.store.load();
		}

		Ext.apply(this,{
			columns : [ {
				text : '角色名',
				flex : 1,
				dataIndex : 'roleName',
				editor : {
					allowBlank : false
				}
			}]
		});

		me.callParent();
	}
});