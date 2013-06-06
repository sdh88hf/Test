Ext.Loader.setPath("app", "./common/jscode");

Ext.Loader.setConfig({
	enabled : true
});
Ext.namespace("Pcbms");
Ext.define("Pcbms.MainPanel", {
	id : "mainpanel",
	extend : "Ext.tab.Panel",
	activeTab : 0,
	region : "center",
	margins : "0 5 5 0",
	resizeTabs : true,
	tabWidth : 150,
	minTabWidth : 120,
	enableTabScroll : true,
	loadControl : function(control) {
		if (!control.controlType) {
			return;
		}

		var tab;
		if (!control.id) {
			control.id = control.controlType;
		}
		if (!(tab = this.getComponent(control.id))) {
			tab = this.add(Ext.apply({
				xtype : control.controlType,
				closable : true,
				autoScroll : true,
				border : true,
				title : control.text
			}, control));
			tab.on("close", function(p) {
				var node = Ext.getCmp("menulist").getRootNode().findChild("id",
						p.id, true);

				if (node) {
					// node.unselect();
				}
			});
			// var buttons = tab.query('button[funcscope]');
			// for ( var i = 0; i < buttons.length; i += 1) {
			// buttons[i].setDisabled(!myself.getRole(buttons[i].funcscope));
			// }
		}
		this.setActiveTab(tab);
		if (tab.initialization) {
			tab.initialization(control);
		}
	}
});

Ext.define("Pcbms.MenuTreePanel", {
	extend : "Ext.tree.Panel",
	id : "menulist",
	split : true,
	width : 180,
	region : "west",
	collapsible : true,
	collapseFirst : false,
	margins : "0 0 5 5",
	cmargins : "0 5 5 5",
	rootVisible : false,
	lines : false,
	autoScroll : true,
	useArrows : true,
	bodyPadding : 5,
	initComponent : function() {
		this.store = Ext.create("Ext.data.TreeStore", {
			storeId : "menustore",
			root : {
				expanded : true,
				children : myself.sortMenu()
			// myself.sortMenu()
			}
		});
		this.callParent();
	},
	listeners : {
		"itemclick" : function(model, selected, eOpts) {
			Ext.getCmp("mainpanel").loadControl(selected.raw);
		}
	}
});

/**
 * 页面初始化
 */
Ext.onReady(function() {

	// 默认是关闭的 载入完成后才将各个需要激活的按钮激活
	var mainpanel = Ext.create("Pcbms.MainPanel", {
		items : []
	});
	var menulist = Ext.create("Pcbms.MenuTreePanel", {
		title : "操作菜单"
	});
	Ext.create("Ext.container.Viewport", {
		id : "pcbms",
		layout : "border",
		items : [ new Ext.container.Container({
			region : "north",
			el : "header",
			height : 39
		}), menulist, mainpanel ]
	});

});
