Ext.define("app.base.form", {
	extend : "Ext.form.Panel",
	
	loadData : function(data){
		var me = this;
		
		Ext.each(me.getForm().getFields().items, function() {
			var value = data[this.getName().replace("entity.","")];
			if (this.getName()
					&& value){
				if(this.getXType()=="checkboxfield"){
					for(var i = 0;i<value.length;i++){
						if(this.inputValue==value[i].id){
							this.setValue(true);
							console.log(this);
						}
					}
					
				}else{
					this.setValue(value);
				}
				
			}
		});
		
	},
	
	initComponent : function(){
		
		this.callParent();
	}
	
});