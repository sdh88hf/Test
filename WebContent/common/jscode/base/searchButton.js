Ext.define("app.base.searchButton", {
	extend : "Ext.button.Button",
	alias : "widget.searchButton",
	text : '查询',
	handler : function() {
		var store = this.up("grid").store;

		var queryParam = {};

		this.ownerCt.items.each(function(item) {
			if (item.name && (item.getValue() || item.getValue() == 0)
					&& item.getValue() != "") {
				var paramname = item.name;
				if (item.getXType() == "datefield") {
					var date = new Date(item.value);
					queryParam[paramname] = date;
				} else {
					queryParam[paramname] = item.getValue();
				}
			}
		});

		if (this.ownerCt.menu) {
			this.ownerCt.menu.items.items[0].items.each(function(item) {
				if (item.name && (item.getValue() || item.getValue() == 0)
						&& item.getValue() != "") {
					var paramname = item.name;
					if (item.getXType() == "datefield") {
						var date = new Date(item.value);
						queryParam[paramname] = date.getTime();
					} else {
						queryParam[paramname] = item.getValue();
					}
				}
			});
		}
		
		store.getProxy().extraParams = queryParam;
		store.loadPage(1);
	}
});