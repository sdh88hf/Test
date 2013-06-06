Ext.define("Pcbms.warehouse.CreateOutputWindow", {
	extend : "Ext.window.Window",
	alias : "widget.copwindow",
	width : 900,
	height : 600,
	modal : true,
	requires : ['Ext.ux.RowExpander','Pcbms.warehouse.ProductOutPartWindow'],
	title : '出货单确认创建',
	layout : 'auto',
	initComponent : function() {
		var me = this;
		var storeid = me.storeId || "cptWindowStore";

		me.store = Ext.create("Ext.data.Store", {
					fields : ['bcbh', 'qty', 'num', 'contractid',
							'deliveryDate', 'price', 'je', 'remarks',
							'saleSendId'],
					storeId : storeid,
					data : me.data
				});

		var data = me.data[0];

		Ext.applyIf(me, {
			items : [{
				"xtype" : "form",
				itemId : 'infoform',
				"layout" : {
					"type" : "auto"
				},
				height : '40%',
				"bodyPadding" : 10,
				"items" : [{
							"xtype" : "textfield",
							"fieldLabel" : "客户编号",
							name : 'deliveryTicket.customerid',
							itemId : 'customerId',
							value : data["customerId"],
							readOnly : true
						}, {
							"xtype" : "textfield",
							value : data["region"],
							name : 'deliveryTicket.region',
							"fieldLabel" : "收货人地区"
						}, {
							"xtype" : "container",
							"layout" : {
								"type" : "column"
							},
							"defaults" : {
								margin : "0 5 10 0"
							},
							"items" : [{
										"xtype" : "textfield",
										"fieldLabel" : "邮编",
										name : 'deliveryTicket.zipcode',
										value : data["zipcode"],
										"columnWidth" : 0.3
									}, {
										"xtype" : "textfield",
										"fieldLabel" : "公司名称",
										name : 'deliveryTicket.company',
										value : data["company"],
										"columnWidth" : 0.3
									}, {
										"xtype" : "combobox",
										"fieldLabel" : "快递公司",
										name : 'deliveryTicket.logistics',
										store : ["优速快递", "圆通速递", "德邦", "KYE",
												"龙邦物流", "顺风速递", "申通快递"],
										"columnWidth" : 0.3
									}, {
										"xtype" : "textfield",
										"fieldLabel" : "联系人",
										name : 'deliveryTicket.receiver',
										value : data["receiver"],
										"columnWidth" : 0.3
									}, {
										"xtype" : "textfield",
										"fieldLabel" : "联系电话",
										name : 'deliveryTicket.phone',
										value : data["phone"],
										"columnWidth" : 0.3
									}, {
										"xtype" : "textfield",
										"fieldLabel" : "快递单号",
										"columnWidth" : 0.3
									}, {
										"xtype" : "textfield",
										"fieldLabel" : "详细地址",
										value : data["address"],
										name : 'deliveryTicket.address',
										"columnWidth" : 0.9
									}, {
										hidden : true,
										xtype : "datefield",
										name : 'deliveryTicket.deliveryDate',
										submitFormat : "U000",
										value : data["deliveryDate"]
									}]
						}]
			}, {
				xtype : 'gridpanel',
				height : '40%',
				store : me.store,
				listeners : {
					'itemdblclick' : function(e, r) {

						me.infoWindow = Ext.create("Pcbms.warehouse.ProductOutPartWindow",
								{
									target : this,
									record : r
								});

						me.infoWindow.dataLoad(r);
						me.infoWindow.show();

					}

				},
				columns : [{
							header : "工程编号",
							dataIndex : "bcbh",
							width : 150
						}, {
							header : "申请发货量",
							dataIndex : "qty"
						}, {
							header : "实际库存量",
							flex : 1,
							dataIndex : "num"
						}, {
							header : "合同编号",
							flex : 1,
							dataIndex : "contractid"
						}, {
							header : "申请出货时间",
							flex : 1,
							renderer : Ext.util.Format.dateRenderer("Y-m-d"),
							dataIndex : "deliveryDate"
						}, {
							header : "单价",
							"xtype" : "numbercolumn",
							flex : 1,
							dataIndex : "price"
						}, {
							header : "小计",
							"xtype" : "numbercolumn",
							flex : 1,
							dataIndex : "je"
						}, {
							header : "备注",
							flex : 1,
							dataIndex : "remarks"
						}, {
							header : '仓位安排',
							flex : 1,
							renderer : function(v, m, r) {
								if (r.data["cwinfo"]
										&& r.data["cwinfo"].length > 0) {
									var str = "";

									for (var i = 0; i < r.data["cwinfo"].length; i++) {
										var item = r.data["cwinfo"][i];

										str += item['cwname'] + "("
												+ item['num'] + ")";

										if (i != r.data["cwinfo"].length - 1) {
											str += ",";
										}
									}

									return str;

								} else {
									return "默认仓位";

								}
							}
						}]
			}, {
				xtype : 'form',
				height : '20%',
				layout : 'anchor',
				items : [{
							xtype : 'textareafield',
							anchor : '90%',
							margin : '10 0 5 5',
							itemId : 'remarks',
							flex : 1,
							fieldLabel : '备注'
						}]
			}],
			buttons : [{
				text : '确认出货',
				iconCls : "accept",
				handler : function() {
					Ext.Msg.confirm("提示", "确定要出库吗?", function(v) {

						if (v == 'no')
							return;
						var params = {};

						var items = me.store.data.items;

						for (var i = 0; i < items.length; i++) {
							var item = items[i].data;
							params["sendList[" + i + "].bcbh"] = item["bcbh"];
							params["sendList[" + i + "].qty"] = item["qty"];
							params["sendList[" + i + "].saleSendId"] = item["saleSendId"];

							var ci = item["cwinfo"];

							if (ci && ci.length > 0) {
								for (var j = 0; j < ci.length; j++) {
									params["sendList[" + i + "].whList[" + j
											+ "].cwbh"] = ci[j]["cwname"];
									params["sendList[" + i + "].whList[" + j
											+ "].num"] = ci[j]["num"];
								}

							}

						}
						params["deliveryTicket.note"] = me.down("#remarks")
								.getValue();
						me.down("#infoform").getForm().submit({
							url : "/wareHouseManagementAction!createDeliveryTicket.action",
							params : params,
							waitMsg : '正在提交,请稍等..',
							success : function(form, action) {
								var fid = action.result.deliveryTicket.chid;
								var cid = me
								.down("#customerId")
								.getValue();
								Ext.Msg.alert("提示", action.result.msg, function() {
											Ext.data.StoreManager
													.lookup("cptWindowStore")
													.load();
										});
								Ext.Msg.confirm("提示", '提交成功,是否需要打印出库单!',
										function(v) {
											if (v == 'yes') {
												tpmsprinter.print("stockout", {
													ids : fid,
													clientid : cid
												});
											}
											Ext.Msg.confirm("提示",
													'是否需要打印快递单!', function(
															v) {
														if (v == 'yes') {
															tpmsprinter
																	.print(
																			"delivery",
																			{
																				ids : fid,
																				clientid : cid
																			});
														}
													});
											me.close();
										});
							},
							failure : Pcbms.formHandler
						});

					});
				}
			}]
		});

		this.callParent();
	}
});