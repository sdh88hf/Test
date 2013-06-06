Ext.define("app.user.role.mainPanel", {
	extend : "Ext.panel.Panel",
	alias: 'widget.userRoleMainPanel',
	initComponent : function(){
		var me = this;
		Ext.apply(this,{
			layout : 'border',
			items : [
			         {
			        	 xtype : 'userRoleSearchGrid',
			        	 width : 600,
			        	 listeners : {
			        		 "itemclick":function(e,record){
			        			 me.roleid = record.data.id;
			        			 Ext.Ajax.request({
			        					url : 'role!query.action',
			        					params : {
			        						'entity.id' : me.roleid
			        					},
			        					success : new app.ajaxHand({
			        						success : function(result) {
			        							me.down("userPermissionShowTree").clearChecked();
			        							var data = result["searchList"][0];
			        							var permissions = data["permissionList"];
			        							
			        							for(var i = 0;i<permissions.length;i++){
			        								me.down("userPermissionShowTree").store.getNodeById(permissions[i].id).set("checked",true);
			        							}
			        						}
			        					})
			        				});
			        			 
			        			// console.log(me.down("userPermissionShowTree").store.getNodeById(1021).set("checked",true));
			        			// me.down("userPermissionShowTree").store.getNodeById(1021).data["checked"] = true;
			        		 }
			        	 },
			        	 region : "west"
			         },{
			        	 xtype : 'userPermissionShowTree',
			        	 region : 'center'
			         }
			         ]
			
			
		});
		
		me.callParent();
	}
});