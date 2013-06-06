var app = app||{};

app.alert = function(title,content,type){
	if(!content){
		content = title;
		title = "";
	}
	
	if(type){
		Ext.Msg.alert(title,content);
	}else{
		Ext.slidetip.msg(title,content);
	}
	
};