Ext.define("app.user.role.searchGrid", {
	extend : "app.user.role.grid",
	alias: 'widget.userRoleSearchGrid',

	initComponent : function(){
		var me = this;
		me.editing = me.rowEditingPlugin();
		Ext.apply(this,{
			plugins : [me.editing],
			selModel : me.selModelPlugin(),
			searchItems :[{
    			fieldLabel : '角色名',
    			xtype : 'textfield',
    			labelAlign : 'right',
    			name : 'entity.roleName',
    			labelWidth : 45
    		}]
		});
		
		me.callParent();
	}
});