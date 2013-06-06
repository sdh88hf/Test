
Ext.define("Pcbms.warehouse.SearchInStockList", {
	extend : "Ext.grid.Panel",
	alias : "widget.isgrid",
	statusData : [ [ 0, "作废" ], [ 1, "初始化" ], [ 2, "生效" ] ],
	initComponent : function() {
		var storeid = "isListStore";
		var me = this;
		me.store = Ext.create("Ext.data.Store", {
			model : "InStock",
			storeId : storeid,
			proxy : Pcbms.ajaxProxy("/stockAction!searchInHistory.action")
		});
		Ext.applyIf(me, {
			columns : [ {
				header : "工程编号",
				width : 120,
				renderer : showDetial('pt').renderer,
				dataIndex : "bcbh"
			}, {
				header : "入库时间",
				width : 80,
				renderer : Ext.util.Format.dateRenderer("m-d H:i"),
				dataIndex : "rktime"
			}, {
				header : "入库数量",
				width : 80,
				dataIndex : "num"
			}, {
				header : "入库人",
				width : 80,
				dataIndex : "rkperson"
			}, {
				header : "入库类型",
				width : 80,
				dataIndex : "rktype"
			},{
				header : "入库单编号",
				width : 100,
				dataIndex : "rkid"
			},{
				header : '入库仓位',
				width : 80,
				dataIndex : 'cwbh'
			},{
				header : '备注信息',
				flex : 1,
				dataIndex : 'notes'
			} ],
			tbar : [ {
				xtype : "buttongroup",
				itemId : 'opbg',
				title : "操作",
				columns : 3,
				defaults : {
					scale : "small"
				},
				items : [ {
					text : '导出',
					iconCls :'export',
					handler : function(b) {
						
					}
				} ]
			}, "->", {
				xtype : "searchbg",
				title : "查询",
				columns : 3,
				defaults : {
					scale : "larger"
				},
				items : [ {
					xtype : "textfield",
					fieldLabel : "工程编号",
					labelAlign : "right",
					labelWidth : 70,
					name : "stockin.bcbh"
				}, {
					xtype : 'combobox',
					fieldLabel : '入库类型',
					value : '全部数据',
					labelWidth : 70,
					store : [ '全部数据', '生产入库', '外包入库' ],
					labelAlign : "right",
					name : 'stockin.rktype'
				}, Pcbms.searchbtn("查询", storeid, 'small'), {
					xtype : "datefield",
					fieldLabel : "入库时间起",
					allowBlank : true,
					labelAlign : "right",
					labelWidth : 70,
					name : "stockin.startdate"
				}, {
					xtype : "datefield",
					fieldLabel : "入库时间止",
					allowBlank : true,
					labelAlign : "right",
					labelWidth : 70,
					name : "projectFile.enddate"
				}, ]
			} ],
			bbar : Ext.create("Ext.PagingToolbar", {
				store : this.store,
				itemId : 'pagebar',
				displayInfo : true,
				beforePageText : "当前页",
				afterPageText : "总 {0} 页",
				displayMsg : "当前显示 {0} - {1} 条 一共 {2}条",
				emptyMsg : " 暂无信息"
			}),
			selModel : Ext.create("Ext.selection.CheckboxModel")

		});

		this.callParent();
	}
});