Ext.define("app.user.permission.showtree", {
	// 继承自
	extend : "app.base.tree",
	alias : 'widget.userPermissionShowTree',
	rootVisible : false,
	lines : false,
	bodyPadding : 25,
	useArrows : true,
	// 依赖的实体
	// model : 'Account',

	initComponent : function() {
		var me = this;

		me.store = Ext.create("Ext.data.TreeStore", {
			storeId : "permissiontreestore",
			proxy : {
				type : 'ajax',
				// reader:{
				// type : 'json',
				// root : 'checkTreeList'
				// },
				url : 'permission!queryByRoleId.action'
			},
			sorters : [ {
				property : 'leaf',
				direction : 'ASC'
			}, {
				property : 'text',
				direction : 'ASC'
			} ]
		});
		
		me.tbar = Ext.create("app.base.auditbar", {
			compont : me.xtype
		});

		me.callParent();
	}
});