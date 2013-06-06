Ext.define("app.base.store", {
	extend : "Ext.data.Store",
	pageSize:50,
    sorters: [{
        property: 'id',
        direction: 'DESC'
    }],
    constructor : function(config){
    	this.proxy = {
    		type:'ajax',
    		reader : {
    			type:'json',
    			root:"searchList",
    			totalProperty:'totalProperty'
    		},
    		actionMethods: {  
                read: 'POST'  
            },
    		url : config.url
    	};
    	this.model = config.model;
    	this.listeners = {
    			load : function(s,r,f,o,e){
    				if(!f){
    					app.alert("查询失败");
    				}
    			}
    			
    	};
    	
    	this.callParent();
    }
});