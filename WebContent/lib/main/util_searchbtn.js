Pcbms.searchbtn = function(text, storeId, type, method, scope) {
	if (!type) {
		type = 'medium';
	}
	var result = {
		scale : type,
		xtype : "button",
		itemId : 'searchbtnabc',
		text : text,
		handler : function(b) {
			// 默认的查询框 点击后执行查询
			var queryParam = {
				validquery : true
			};
			if (method) {
				queryParam = method.call(scope);
			}
			var store = Ext.data.StoreManager.lookup(storeId);
			b.ownerCt.items.each(function(item) {
						if (item.name) {
							var name = item.name;
							if (!item.isValid()) {
								queryParam.validquery = false;
								return;
							}
							
							if (item.departid) {
								queryParam[name] = item.departid;
							} else if (item.departid == 0) {
								queryParam[name] = "";
							} else if (item.getValue() || item.getValue() == 0) {
								if (item.getXType() == "datefield") {
									var date = new Date(item.value);
									queryParam[name] = date.getTime();
								} else {
									queryParam[name] = item.getValue();
								}
							}
						}
					});
			
			if (b.ownerCt.menu) {
				b.ownerCt.menu.items.items[0].items.each(function(item) {
							if (item.name) {
								var name = item.name;
								if (!item.isValid()) {
									queryParam.validquery = false;
									return;
								}
								if (item.departid) {
									queryParam[name] = item.departid;
								} else if (item.departid == 0) {
									queryParam[name] = "";
								} else if (item.getValue() || item.getValue() == 0) {
									if (item.getXType() == "datefield") {
										var date = new Date(item.value);
										queryParam[name] = date.getTime();
									} else {
										queryParam[name] = item.getValue();
									}
								}
							}
						});
			}

			if (queryParam.validquery) {
				store.getProxy().extraParams = queryParam;
				store.loadPage(1);
			} else {
				Ext.Msg.alert('查询错误', '你的查询参数错误,请检查!');
			}
		}
	};
	switch (type) {
		case 'medium' :
			result.rowspan = 2;
			result.iconCls = "searchbig";
			result.iconAlign = 'top';
			break;
		case 'small' :
			result.iconCls = "searchsmall";
			break;
		case 'big' :
			result.rowspan = 3;
			result.iconCls = "searchbig";
			result.iconAlign = 'top';
			break;
	}
	return result;
};