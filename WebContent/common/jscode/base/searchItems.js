Ext.define("app.base.searchItems", {
			extend : "Ext.container.ButtonGroup",
			alias : "widget.searchItems",
			title : "查询",
			defaults : {
				scale : "larger"
			},
			columns : 3,
			showSrhMenu : function() {
				var me = this;
				if (!me.menu) {
					var itemsarr = [];
					var form = Ext.create("Ext.form.Panel", {
								layout : 'column',
								width : 440,
								frame : true,
								items : me.hitems
							});
					me.menu = Ext.createWidget("menu", {
								items : [form]
							});
				}
				me.menu.showBy(me);
			},
			hideSrhMenu : function() {
				var me = this;
				me.menu.hide();
			},
			listeners : {
				'beforerender' : function(e) {
				},
				'render' : function(e) {
					// e.getEl().on('mouseover', function() {
					//
					// e.showSrhMenu();
					// });
					e.getEl().on('keyup', function(v, h, o) {
						if (v.getKey() == v.ENTER) {
							e.down("searchButton").handler();
						}

					});
				}
			},
			initComponent : function() {
				var me = this;
				me.hitems = [];
				me.sitems = [];
				var i = 0;
				Ext.each(me.items, function(item) {
							if (i < 2) {
								me.sitems.push(item);
							} else {
								item["columnWidth"] = 0.5;
								me.hitems.push(item);
							}
							if (!item.hidden) {
								i++;
							}
						});
				me.sitems.push(Ext.create("app.base.searchButton"));
				me.items = me.sitems;
				if(me.hitems.length>0){
					me.tools = [{
						type : 'down',
						handler : function() {
							me.showSrhMenu();
						}
					}];
				}
				
				this.callParent();
			}
		});