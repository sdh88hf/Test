Ext.define("app.user.account.form", {
	// 继承自
	extend : "app.base.form",
	
	saveAccount : function(){
		var me = this;
		
		var datas = me.getForm().getValues();
		
		var roles = datas["roles"];
		
		var params = {};
		
		if(Ext.typeOf(roles)=='array'){
			for(var i = 0;i<roles.length;i++){
				params["entity.roles["+i+"].id"] = roles[i];
			}
		}else{
			params["entity.roles[0].id"] = roles;
		}
		
		if(me.dataid){
			params["entity.id"] = me.dataid;
		}
		
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
	//加载角色
	loadRoles : function(){
		var me = this;
		Ext.Ajax.request({
			url : 'role!query.action',
			sync : true,
			success : new app.ajaxHand({
				success : function(result,scope) {
					var datas = result.searchList;
					
					for(var i = 0;i<datas.length;i++){
						me.getComponent("rolesgroup").add({
							boxLabel: datas[i].roleName, name: 'roles',inputValue : datas[i].id
						});
					}
					
					if(me.loadById){
						me.loadById();
					}
				}
			})

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
	            name : 'entity.roles',
	            itemId : 'rolesgroup',
	            columns: 2,
	            items: [
	                
	            ]
	        }],
	        buttons : [{
	        	text : '确定',
	        	handler : function(){
	        		me.saveAccount();
	        	}
	        }]
			
		});
		
		me.loadRoles();

		me.callParent();
		
	}
});