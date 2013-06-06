Ext.define("app.user.permission.showTreeSaveBtn",{
	extend : "Ext.button.Button",
	alias : "widget.userPermissionShowTreeSaveBtn",
	handler : function(){
		var me = this;
		
		var parentTree = me.findParentByType("treepanel");
		
		var parentPanel = me.findParentByType("userRoleMainPanel");
		
		console.log(parentTree.getCheckedIds());
		console.log(parentPanel.roleid);
		
		var roleid = parentPanel.roleid;
		
		var perids = parentTree.getCheckedIds().join(",");
		console.log(perids);
		if(!roleid){
			Ext.slidetip.msg("提示","请选择角色");
			return ;
		}
		
		Ext.Ajax.request({
    		url : 'role!saveRolePermission.action',
    		type : 'json',
    		params : {
    			msg : perids,
    			'entity.id' : roleid
    		},
    		success : new app.ajaxHand({
    			success : function(result){
    				Ext.slidetip.msg("提示",result.msg);
    			}
    		})
    	});
	}
});