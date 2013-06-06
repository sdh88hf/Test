
Ext.define("Pcbms.product.SeacrhGetcountList", {
	extend : "Ext.grid.Panel",
	alias : "widget.gcgrid",

	initComponent : function() {
		var me = this;

		var storeid = me.storeId || "gsListStoreId";

		this.store = Ext.create("Ext.data.Store", {
			model : "GetCount",
			storeId : storeid,
			proxy : Pcbms.ajaxProxy("/countingManagementAction!searchCounting.action")
		});

		Ext.applyIf(me, {
					columns : [{
								header : "LOT卡号",
								dataIndex : "lotid",
								flex : 0.5
							}, {
								header : "数量",
								xtype : "numbercolumn",
								dataIndex : "num",
								flex : 0.5
							}, {
								header : "当前工序",
								dataIndex : "stepname",
								flex : 0.5
							}, {
								header : "接收站签名",
								dataIndex : "recipientname",
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
							}],

					tbar : ["->", {
								xtype : "searchbg",
								items : [
										{
											xtype : "textfield",
											fieldLabel : "LOT卡号",
											labelAlign : "right",
											labelWidth : 60,
											name : "countDetail.lotid"
										},
										{
											xtype : "textfield",
											fieldLabel : "工序名称",
											labelAlign : "right",
											labelWidth : 60,
											name : "countDetail.stepid"
										},
										Pcbms.searchbtn("查询", storeid, 'small'),
										{
											xtype : "datefield",
											fieldLabel : "接收日期",
											labelAlign : "right",
											labelWidth : 60,
											name : "countDetail.accepttime"
										}, {
											xtype : "datefield",
											fieldLabel : "转出日期",
											labelAlign : "right",
											labelWidth : 60,
											name : "countDetail.handovertime"
										}]
							}],

					bbar : Ext.create("Ext.PagingToolbar", {
								store : this.store,
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