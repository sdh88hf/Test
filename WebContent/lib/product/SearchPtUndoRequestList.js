//Ext.require("app.ptundorequest.model");

Ext.define("Pcbms.product.SearchPtUndoRequestList", {
	extend : "Ext.grid.Panel",
	alias : "widget.pturgrid",
	statusData : [[0,"全部"],[1, "未处理"], [2, "处理完成"], [3, "作废"]],
	initComponent : function() {
		var storeid = "ptudrListStore";
		var me = this;
		me.store = Ext.create("Ext.data.Store", {
			model : "PTUndoRequest",
			storeId : storeid,
			proxy : Pcbms.ajaxProxy("/ptredoRequestAction!searchRedoRequestList.action")
		});

		Ext.applyIf(me, {
			columns : [{
						header : "订单编号",
						width : 90,
						dataIndex : "prodId",
						renderer : showDetial('prod').renderer,
					}, {
						header : "问题详细",
						flex : 1,
						dataIndex : "problem"
					}, {
						header : "发现时间",
						width : 115,
						renderer : Ext.util.Format.dateRenderer("Y-m-d H:i"),
						dataIndex : "createtime"
					}, {
						header : "发现",
						width : 80,
						dataIndex : "creatorname"
					}, {
						header : "问题所属",
						width : 80,
						dataIndex : "receivername"
					}, {
						header : "解决时间",
						width : 115,
						renderer : Ext.util.Format.dateRenderer("Y-m-d H:i"),
						dataIndex:"resolvetime"
					},{
						header:"解决人",
						width : 80,
						dataIndex : 'resolvername'
					},{
						header : "问题状态",
						width : 60,
						dataIndex:"status",
						renderer : function(v, m, r) {
							switch(v){
							case 1:
								return "<span style='color:red'>未处理</span>";
							case 2:
								return "<span style='color:green'>已处理</span>";
							case 3:
								return "作废";
							}
							return "异常状态";
						}
					}],

			tbar : [{
				xtype : "buttongroup",
				itemId : 'opbg',
				title : "操作",
				// height : 80,
				columns : 1,
				defaults : {
					scale : "small"
				},
				items : [{
					text : '作废问题',
					iconCls:"invalid",
					handler : function(b) {
						var me = this;
						var s = checkGridSelect(b.up("gridpanel"), 1);
						if (s) {
							Ext.Msg.confirm("提示", "确定要作废选中项吗?", function(v) {
								if (v == "yes") {
									Ext.Ajax.request({
										url : "/ptredoRequestAction!disableRedoRequest.action?ptrrid="
												+ s[0].get("ptrrid"),
										success : new Pcbms.ajaxHandler({
											success : function(str) {
												Ext.Msg.alert("提示", str.msg);
												Ext.data.StoreManager
														.lookup(storeid).load();
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
				columns : 3,
				defaults : {
					scale : "larger"
				},
				items : [{
							xtype : "combobox",
							store : this.statusData,
							fieldLabel : "状态",
							itemId : 'status',
							labelAlign : "right",
							labelWidth : 60,
							value : 0,
							name : "redorequest.status"
						},{
							xtype : "textfield",
							fieldLabel : "订单编号",
							labelAlign : "right",
							labelWidth : 60,
							name : "redorequest.prodId"
						},   Pcbms.searchbtn("查询", storeid, 'small')]
			}],
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