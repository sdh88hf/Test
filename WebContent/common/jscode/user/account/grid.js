Ext.define("app.user.account.grid", {
	// 继承自
	extend : "app.base.grid",

	// 依赖的实体
	model : 'Account',

	initComponent : function() {
		var me = this;
		
		if (!me.store) {
			me.store = Ext.create('app.base.store', {
				storeId : 'bb',
				url : 'account!query.action',
				model : me.model
			});
			me.store.load();
		}
		
		Ext.apply(this,{
			columns : [ {
				text : '用户名',
				dataIndex : 'username',
				editor : {
					allowBlank : false
				}
			}, {
				text : '密码',
				dataIndex : 'password',
				editor : {
					allowBlank : false
				}
			}, {
				text : '邮箱',
				flex : 1,
				dataIndex : 'email',
				editor : {
					value : 'sdh@163.com',
					vtype : 'email'
				}
			}, {
				text : '上次登录',
				renderer : me.dateRender(),
				flex : 1,
				dataIndex : 'lastLoginTime',
				editor : {
					xtype : 'datefield'
				}
			} ]
		});

		me.callParent();
	}
});