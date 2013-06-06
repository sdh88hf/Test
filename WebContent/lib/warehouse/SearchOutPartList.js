
Ext.define("Pcbms.warehouse.SearchOutPartList", {
	extend : "Ext.grid.Panel",
	alias : "widget.outpartgrid",
	statusData : [[0, "初始化"], [1, "挂起"], [2, "完成"]],
	
	initComponent : function() {
		var storeid = "outpartListStore";
		var me = this;
		me.store = Ext.create("Ext.data.Store", {
			model : "OutPart",
			storeId : storeid,
			proxy : Pcbms.ajaxProxy("/wareHouseManagementAction!searchDeliveryTicket.action")
		});

		Ext.applyIf(me, {
			columns : [{
						header : "出库单号",
						renderer:showDetial('op').renderer,
						width : 100,
						dataIndex : "chid"
					},{
						header:"出库单状态",
						renderer:function(value){
							switch(value){
							case 0:
								return "初始化";
							case 1:
								return "挂起";
							case 2:
								return "完成";
							}
							return "<span style=\"color:red\">未知状态</span>";
						},
						width : 70,
						dataIndex : "status"
					}, {
						header : "客户ID",
						width : 100,
						dataIndex : "customerid"
					},{
						header : "收货公司名",
						flex : 1,
						dataIndex : "company"
					},{
						header : "快递方式",
						width : 80,
						dataIndex : "logistics"
					}, {
						header : "快递单号",
						width : 100,
						dataIndex : "logino"
					}, {
						header : "创建时间",
						width : 80,
						renderer : Ext.util.Format.dateRenderer("Y-m-d"),
						dataIndex : "createtime"
					}, {
						header : "发货人",
						width : 80,
						dataIndex : "ckperson"
					}, {
						header : "备注信息",
						flex : 1,
						dataIndex : "note"
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
					text : '完成',
					iconCls:"accept",
					handler : function(b) {
						var me = this;
						var s = checkGridSelect(b.up("gridpanel"), 2);
						if (s) {

							var chids = [];

							for (var i = 0; i < s.length; i++) {
								chids.push(s[0].data['chid']);
							}

							Ext.Msg.confirm("提示", "确定要完成吗?", function(v) {
								if (v == "yes") {
									Ext.Ajax.request({
										params : {
											chIds : chids
										},
										url : "/wareHouseManagementAction!finishDeliveryTicket.action",
										success : new Pcbms.ajaxHandler({
											success : function(str) {
												Ext.Msg.alert("提示", str.msg,
														function() {
															Ext.data.StoreManager
																	.lookup(storeid)
																	.load();
														});
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
				}, {
					text : '挂起',
					iconCls:"pause",
					handler : function(b) {
						var me = this;
						var s = checkGridSelect(b.up("gridpanel"), 2);
						if (s) {

							var chids = [];

							for (var i = 0; i < s.length; i++) {
								chids.push(s[0].data['chid']);
							}

							Ext.Msg.confirm("提示", "确定要删除选中项吗?", function(v) {
								if (v == "yes") {
									Ext.Ajax.request({
										params : {
											chIds : chids
										},
										url : "/wareHouseManagementAction!holdDeliveryTicket.action",
										success : new Pcbms.ajaxHandler({
											success : function(str) {
												Ext.Msg.alert("提示", str.msg,
														function() {
															Ext.data.StoreManager
																	.lookup(storeid)
																	.load();
														});
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
				}, {
					text : '恢复',
					iconCls:"Restoration",
					handler : function(b) {
						var me = this;
						var s = checkGridSelect(b.up("gridpanel"), 2);
						if (s) {

							var chids = [];

							for (var i = 0; i < s.length; i++) {
								chids.push(s[0].data['chid']);
							}

							Ext.Msg.confirm("提示", "确定要删除选中项吗?", function(v) {
								if (v == "yes") {
									Ext.Ajax.request({
										params : {
											chIds : chids
										},
										url : "/wareHouseManagementAction!recoveDeliveryTicket.action",
										success : new Pcbms.ajaxHandler({
											success : function(str) {
												Ext.Msg.alert("提示", str.msg,
														function() {
															Ext.data.StoreManager
																	.lookup(storeid)
																	.load();
														});
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

				},{
					text : '出货单打印',
					iconCls :'print',
					handler : function(b){
						var s = checkGridSelect(b.up("gridpanel"), 2);
						if (s) {
							var ids = [];
							for(var i = 0;i<s.length;i++){
								ids.push(s[i].data["chid"]);
							}
							//开始打印数据
							tpmsprinter.print("stockout",{ids:ids, clientid:s[0].data["customerid"]});
						}
					}
				},{
					text : '快递单打印',
					iconCls :'print',
					handler : function(b){
						var s = checkGridSelect(b.up("gridpanel"), 2);
						if (s) {
							var ids = [];
							for(var i = 0;i<s.length;i++){
								ids.push(s[i].data["chid"]);
							}
							//开始打印数据
							tpmsprinter.print("delivery",{ids:ids, clientid:s[0].data["customerid"]});
						}
					}
				}]
			}, "->", {
				xtype : "searchbg",
				items : [{
							xtype : 'textfield',
							fieldLabel : '出货单号',
							labelAlign : "right",
							name : 'deliveryTicket.chid',
							cn : 'sdy',
							labelWidth : 60,
							flex : 1
						}, {
							xtype : "textfield",
							fieldLabel : "工程编号",
							labelAlign : "right",
							labelWidth : 60,
							name : 'deliveryTicket.bcbh'
						}, Pcbms.searchbtn("查询", storeid, 'small'), {
							xtype : "idcombo",
							fieldLabel : "合同编号",
							labelAlign : "right",
							labelWidth : 60,
							type : 2,
							name : 'deliveryTicket.contractid'
						}, {
							xtype : 'textfield',
							fieldLabel : '客户编号',
							labelAlign : "right",
							name : 'deliveryTicket.customerId',
							labelWidth : 60,
							flex : 1,
							onFocus : function() {
								return false;
								if (!this.clientWindow) {
									this.clientWindow = Ext.create(
											"Ext.window.Window", {
												width : 750,
												closeAction : 'hide',
												height : 300,
												modal : true,
												layout : 'fit',
												title : '客户选择',
												items : [{
															xtype : "clientgrid",
															target : this
														}]
											});

								}

								this.clientWindow.show();

							}
						}, {
							xtype : "combobox",
							store : this.statusData,
							fieldLabel : "状态",
							labelAlign : "right",
							labelWidth : 60,
							value : 0,
							name : "deliveryTicket.status"
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