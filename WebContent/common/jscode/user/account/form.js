Ext.define("app.user.account.form", {
	// 继承自
	extend : "app.base.form",
	
	saveAccount : function(){
		var me = this;
		
		var params = me.getForm().getValues(true);
		
		me.getForm().submit({
			waitMsg : '正在提交',
			params : params,
			url : 'account!save.action',
			success : function(form,action){
				Ext.slidetip.msg("提示",action.result.msg);
				me.parentGrid.store.load();
				me.up("window").close();
			}
			
		});
		
	},
	initComponent : function() {
		var me = this;
		
		Ext.apply(me,{
			bodyPadding : 5,
			frame:true,
			items : [{
				xtype : 'textfield',
				fieldLabel : '用户名',
				name : 'entity.username',
				anchor : '90%'
			},{
				xtype : 'textfield',
				fieldLabel : '密码',
				name : 'entity.password',
				anchor : '90%'
			},{
				xtype : 'textfield',
				fieldLabel : '邮箱',
				name : 'entity.email',
				anchor : '90%'
			},{
	            xtype: 'checkboxgroup',
	            fieldLabel: '角色',
	            itemId : 'roles',
	            columns: 2,
	            items: [
	                {boxLabel: '超级管理员', name: 'roles',inputValue : 1},
	                {boxLabel: '董事长', name: 'roles',inputValue : 2}
	            ]
	        }],
	        buttons : [{
	        	text : '确定',
	        	handler : function(){
	        		me.saveAccount();
	        	}
	        }]
			
		});

		me.callParent();
		
		me.down()
	}
});