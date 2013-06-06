Ext.define("app.base.grid", {
	extend : "Ext.grid.Panel",
	
	//日期
	dateRender : function(){return Ext.util.Format.dateRenderer(app.constant.date_render);},
	
	//日期加时间
	datetimeRender : function(){return Ext.util.Format.dateRenderer(app.constant.datetime_render);},
	
	//单元格编辑插件
	editingPlugin : function(){ return Ext.create('Ext.grid.plugin.CellEditing',{});},
	
	//行编辑插件
	rowEditingPlugin : function(){return Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        errorSummary : false,
        autoCancel: true
    });},
    
    //行复选框
    selModelPlugin : function(){return Ext.create("Ext.selection.CheckboxModel");},
	
	initComponent : function(){
		var me = this;
		if(me.paging){
			me.bbar = Ext.create('app.base.paging',{
				store:me.store
			});
		}

		me.tbar = Ext.create('app.base.auditbar',{
			compont : me.xtype,
			searchItems : me.searchItems
		});
		
		this.callParent();
	},
	
	//添加行
	addRow : function(){
		this.store.insert(0,new (Ext.ModelManager.getModel(this.model)));
		this.editing.cancelEdit();
		if(this.editing){
			this.editing.startEdit(0,0);
		}
	},
	
	//删除行
	deleteRow : function(){
		
		var recode = this.getSelectionModel().getSelection();
		
		this.store.remove(recode);
	},
	
	//验证选中行
	checkSelectRow : function(count,tip){
		if(!count){
			count = 1;
		}
		tip = tip || "请"+(count!=1?"至少":"")+"选择一行要删除的记录";
		
		var recode = this.getSelectionModel().getSelection();
		
		if(recode.length==0||(count==1&&recode.length>1)){
			app.alert(tip);
			return false;
		}
		
		var usedata = [];
		var ids = "";
		for(var i = 0;i<recode.length;i++){
			usedata.push(recode[i].data);
			ids += recode[i].data.id;
			if(i!=recode.length-1){
				ids += ",";
			}
		}
		usedata.unshift(ids);
		
		return usedata;
	}
	
});