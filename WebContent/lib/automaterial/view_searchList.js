Ext.require("app.automaterial.model");

Ext.define("Pcbms.view.searchAm", {
	extend : "Ext.grid.Panel",
	alias : "widget.amgrid",
	initComponent : function() {
		var storeid = "amListStore";
		var me = this;
		me.store = Ext.create("Ext.data.Store", {
			model : "AutoMaterial",
			storeId : storeid,
			proxy : Pcbms.ajaxProxy("/contractManagementAction!searchContractList.action")
		});
		Ext.applyIf(me, {
			columns : [{
						header : "板材材料",
						flex : 1,
						dataIndex : "bccl"
					}, {
						header : "板材供应商",
						flex : 1,
						dataIndex : "bcgys"
					}, {
						header : "板厚",
						flex : 1,
						dataIndex : "bh"
					}, {
						header : "板材型号",
						flex : 1,
						dataIndex : "bcxh"
					}, {
						header : "原料长",
						flex : 1,
						dataIndex : "ylccx"
					}, {
						header : "原料宽",
						flex : 1,
						dataIndex : "ylccy"
					}],

			tbar : [{
				xtype : "buttongroup",
				title : "操作",
				// height : 80,
				columns : 3,
				defaults : {
					scale : "small"
				},
				items : [{
					text : '删除',
					iconCls:"delete",
					handler : function(b) {
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {
							Ext.Msg.confirm("提示", "确定要删除选中项吗?", function(v) {
								if (v == "yes") {
									Ext.Ajax.request({
										url : "/autoMTAction!removeMaterialTicketBatch.action?batchid="
												+ me.wid,
										success : new Pcbms.ajaxHandler({
											success : function(str) {
												me.store.removeAll();
												Ext.Msg.alert("提示", str.msg);
												
											},
											error : function(r) {
												Ext.Msg.alert('出现错误', '原因 <'
																+ r.msg + ">");
											}
										})
									});

								}
							});

						}
					}
				}]
			}, "->", {
				xtype : "buttongroup",
				title : "查询",
				columns : 2,
				defaults : {
					scale : "larger"
				},
				items : [{
							xtype : 'textfield',
							fieldLabel : '批次号',
							name : 'batchid',
							itemId : 'pch',
							allowBlank : false,
							labelWidth : 40,
							flex : 1
						}, {
							text : '查询',
							iconCls:'searchsmall',
							scale : "small",
							handler : function() {
								if (me.down("#pch").isValid()) {
									deferLoading(me);
									Ext.Ajax.request({
										url : "/autoMTAction!searchMaterialTicketBatch.action?batchid="
												+ me.down("#pch").getValue(),
										success : new Pcbms.ajaxHandler({
											success : function(str) {
												
												me.wid = me.down("#pch").getValue();
												me.store.removeAll();
												me.store.insert(0,str.mtticket);
												
												
											},
											error : function(r) {
												Ext.Msg.alert('出现错误', '原因 <'
																+ r.msg + ">");
											}
										})
									});

								}
							}
						}]
			}],
			selModel : Ext.create("Ext.selection.CheckboxModel")

		});

		this.callParent();
	}
});