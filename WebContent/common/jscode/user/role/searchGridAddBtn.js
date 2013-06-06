Ext.define("app.user.role.searchGridAddBtn",{
	extend : "Ext.button.Button",
	alias : "widget.userRoleSearchGridAddBtn",
	handler : function(){
		var me = this;
		var parentGrid = me.findParentByType("grid");
		parentGrid.addRow();
	}
});