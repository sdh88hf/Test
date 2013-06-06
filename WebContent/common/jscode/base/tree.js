Ext.define("app.base.tree", {
	extend : "Ext.tree.Panel",
	initComponent : function(){
		
		this.callParent();
	},
	
	clearChecked : function(){
		
		this.diguiClear(this.getRootNode());		
	},
	getCheckedIds : function(){
		var ids = [];
		this.deguiGetCheckedIds(ids,this.getRootNode());
		return ids;
	},
	diguiClear : function(node){
		var me = this;
		node.eachChild(function(c){
			c.set("checked",false);
			me.diguiClear(c);
		});
	},
	deguiGetCheckedIds : function(ids,node){
		var me = this;
		node.eachChild(function(c){
			if(c.data.checked){
				ids.push(c.data.id);
			}
			me.deguiGetCheckedIds(ids,c);
		});
	}
	
	
});