// 定义过数实体
Ext.define('GetCount', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'id',
		type : 'int'
	}, {
		name : 'lotid',// lot卡号
		type : 'string'
	}, {
		name : 'ptid',// 工程编号
		type : 'string'
	}, {
		name : "stepid",// 工序编号
		type : "int"
	}, {
		name : 'num',// 数量
		type : 'int'
	}, {
		name : "isoutsourcing",// 是否外协
		type : "int"
	}, {
		name : "expectdate",// 预期时间
		type : "int"
	}, {
		name : "username",// 接收者
		type : "string"
	}, {
		name : "accepttime",// 接收时间
		type : "date",
		dateFormat : "time"
	}, {
		name : "overperson",// 转出人
		type : "string"
	}, {
		name : "handovertime",// 移交时间
		type : "date",
		dateFormat : "time"
	}, {
		name : "ipqc",// IPQC签名
		type : "string"
	}, {
		name : "operater",// 操作人
		type : "string"
	}, {
		name : "scrapnum",// 报废数
		type : "int"
	}, {
		name : "note",// 备注
		type : "string"
	}, {
		name : "intotime",//
		type : "date",
		dateFormat : "time"
	}, {
		name : "stepname",// 工序名称
		type : "string"
	}, {
		name : "beforestepname",
		type : "string"
	}, {
		name : "afterstepname",
		type : "string"
	} ]
});

// 工程下单管理列表
Ext.define("Pcbms.getcountListGrid", {
	extend : "Ext.grid.Panel",
	alias : "widget.getcountlistgrid",
	layout : "fit",
	tabConfig : {
		title : "过数管理",
		tooltip : "过数管理"
	},
	columns : [ {
		header : "工程编号",
		dataIndex : "ptid",
		flex : 0.5
	}, {
		header : "LOT卡号",
		dataIndex : "lotid",
		flex : 0.5
	}, {
		header : "数量",
		xtype : "numbercolumn",
		dataIndex : "num",
		flex : 0.5
	}, {
		header : "前工序",
		dataIndex : "beforestepname",
		flex : 0.5
	}, {
		header : "当前工序",
		dataIndex : "stepname",
		flex : 0.5
	}, {
		header : "后工序",
		dataIndex : "afterstepname",
		flex : 0.5
	}, {
		header : "接收站签名",
		dataIndex : "username",
		flex : 0.5
	}, {
		header : "接受时间",
		dataIndex : "accepttime",
		xtype : "datecolumn",
		format : "y 年 m 月 d 日",
		flex : 0.5
	}, {
		header : "转出站签名",
		dataIndex : "overperson",
		flex : 0.5
	}, {
		header : "转出日期",
		dataIndex : "handovertime",
		xtype : "datecolumn",
		format : "y 年 m 月 d 日",
		flex : 0.5
	}, {
		header : "IPQC签名",
		dataIndex : "ipqc",
		flex : 0.5
	}, {
		header : "报废数量",
		dataIndex : "scrapnum",
		flex : 0.5
	}, {
		header : "备注",
		dataIndex : "note",
		flex : 1
	} ],
	tbar : [ "->", {
		xtype : "buttongroup",
		title : "过数信息查询",
		columns : 4,
		defaults : {
			scale : "larger"
		},
		items : [ {
			xtype : "textfield",
			fieldLabel : "工程编号",
			labelAlign : "right",
			labelWidth : 60,
			name : "countDetail.ptid"
		}, {
			xtype : "textfield",
			fieldLabel : "LOT卡号",
			labelAlign : "right",
			labelWidth : 60,
			name : "countDetail.lotid"
		}, {
			xtype : "datefield",
			fieldLabel : "接收日期",
			labelAlign : "right",
			labelWidth : 60,
			name : "countDetail.accepttime"
		}, Pcbms.searchbtn("查询", "countListStore"), {
			xtype : "datefield",
			fieldLabel : "转出日期",
			labelAlign : "right",
			labelWidth : 60,
			name : "countDetail.handovertime"
		}, {
			xtype : "textfield",
			fieldLabel : "工序名称",
			labelAlign : "right",
			labelWidth : 60,
			name : "countDetail.stepid"
		} ]
	} ],

	initComponent : function() {

		this.store = Ext.create("Ext.data.Store", {
			model : "GetCount",
			storeId : "countListStore",
			proxy : new Pcbms.ajaxProxy(
					"/countingManagementAction!searchCounting.action")
		});

		// this.store.load();
		this.bbar = Ext.create("Ext.PagingToolbar", {
			store : this.store,
			displayInfo : true,
			beforePageText : "当前页",
			afterPageText : "总 {0} 页",
			displayMsg : "当前显示 {0} - {1} 条 一共 {2}条",
			emptyMsg : " 暂无信息"
		});

		this.selModel = Ext.create("Ext.selection.CheckboxModel", {

		});

		this.callParent();
	}

});