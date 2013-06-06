Ext.define("app.user.account.searchGrid", {
	extend : "app.user.account.grid",
	alias: 'widget.userAccountSearchGrid',

	initComponent : function(){
		var me = this;
		me.editing = me.rowEditingPlugin();
		Ext.apply(this,{
			plugins : [me.editing],
			paging : true,
			selModel : me.selModelPlugin(),
			searchItems :[{
    			fieldLabel : '用户名',
    			xtype : 'textfield',
    			labelAlign : 'right',
    			name : 'entity.username',
    			labelWidth : 45
    		},{
    			fieldLabel : '邮箱',
    			xtype : 'textfield',
    			labelAlign : 'right',
    			name : 'entity.email',
    			labelWidth : 45
    		},{
    			fieldLabel : '上次登录起',
    			xtype : 'datefield',
    			labelAlign : 'right',
    			name : 'entity.lastLoginTime1',
    			labelWidth : 75
    		},{
    			fieldLabel : '上次登录止',
    			xtype : 'datefield',
    			labelAlign : 'right',
    			name : 'entity.lastLoginTime2',
    			labelWidth : 75
    		}]
		});
		
		me.callParent();
	}
});