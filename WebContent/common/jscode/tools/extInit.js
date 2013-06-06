var app = app||{};

app.ajaxHand = function(config){
	if(config.success){
		onsuccess = config.success;
	}else{
		onsuccess = function(result){
			app.alert("提示",result.msg);
		};
	}
	
	if(config.error){
		onerror = config.error;
	}else{
		onerror = function(result){
			app.alert('出现错误', '错误原因 <' + (result.msg||'未知') + ">");
		};
	}
	
	return function(response){
		var result = Ext.decode(response.responseText);
		
		if(result.success){
			onsuccess(result);
		}else{
			onerror(result);
		}
	};
	
};