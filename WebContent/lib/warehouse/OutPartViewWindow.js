Ext.define("Pcbms.warehouse.OutPartViewWindow", {
	extend : "Ext.window.Window",
	alias : "widget.opvwindow",
	width : 900,
	height : 600,
	modal : true,
	title : '出货单详情',
	statusData : ['初始化','挂起','完成'],
	layout : 'auto',
	loadData : function(str) {
		var me = this;
		me.down("#customerid").setValue(str["customerid"]);
		me.down("#region").setValue(str["region"]);
		me.down("#zipcode").setValue(str["zipcode"]);
		me.down("#company").setValue(str["company"]);
		me.down("#logistics").setValue(str["logistics"]);
		me.down("#receiver").setValue(str["receiver"]);
		me.down("#phone").setValue(str["phone"]);
		me.down("#logino").setValue(str["logino"]);
		me.down("#address").setValue(str["address"]);
		me.store.insert(0, str["deliveryList"]);
		me.down("#remarks").setValue(str["note"]);
		me.down("#deliverytime").setValue(new Date(str["deliverytime"]));
		me.down("#ckperson").setValue(str["ckperson"]);
		me.chid = str["chid"];

		me.setTitle("出货单详细 ("+me.statusData[str["status"]]+")"+str["chid"]);

		Ext.getBody().unmask();
	},
	initComponent : function() {
		var me = this;
		var storeid = me.storeId || "infoOutpartStore";
		me.store = Ext.create("Ext.data.ArrayStore", {
					fields : ['bcbh', 'qty', 'num', 'contractid','customerid',
							'deliveryDate', 'price', 'je', 'remarks',
							'cwbh'],
					storeId : storeid
				});

		Ext.applyIf(me, {
			items : [{
				"xtype" : "form",
				itemId : 'infoform',
				"layout" : {
					"type" : "auto"
				},
				height : '30%',
				"bodyPadding" : 10,
				"items" : [{
							"xtype" : "textfield",
							"fieldLabel" : "客户编号",
							name : 'deliveryTicket.customerid',
							itemId : 'customerid',
							readOnly : true
						}, {
							"xtype" : "textfield",
							name : 'deliveryTicket.region',
							itemId : 'region',
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
										itemId : 'zipcode',
										name : 'deliveryTicket.zipcode',
										"columnWidth" : 0.3
									}, {
										"xtype" : "textfield",
										"fieldLabel" : "公司名称",
										itemId : 'company',
										name : 'deliveryTicket.company',
										"columnWidth" : 0.3
									}, {
										"xtype" : "combobox",
										"fieldLabel" : "快递公司",
										itemId : 'logistics',
										name : 'deliveryTicket.logistics',
										store : ["优速快递", "圆通速递", "德邦", "KYE",
												"龙邦物流", "顺风速递", "申通快递"],
										"columnWidth" : 0.3
									}, {
										"xtype" : "textfield",
										"fieldLabel" : "联系人",
										itemId : 'receiver',
										name : 'deliveryTicket.receiver',
										"columnWidth" : 0.3
									}, {
										"xtype" : "textfield",
										"fieldLabel" : "联系电话",
										itemId : 'phone',
										name : 'deliveryTicket.phone',
										"columnWidth" : 0.3
									}, {
										"xtype" : "textfield",
										"fieldLabel" : "快递单号",
										itemId : 'logino',
										name : 'deliveryTicket.logino',
										"columnWidth" : 0.3
									}, {
										"xtype" : "textfield",
										"fieldLabel" : "详细地址",
										itemId : 'address',
										name : 'deliveryTicket.address',
										"columnWidth" : 0.9
									}]
						}]
			}, {
				xtype : 'gridpanel',
				height : '40%',
				store : me.store,
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
				height : '30%',
				bodyPadding : 5,
				layout : 'anchor',
				items : [{
							xtype : 'textareafield',
							anchor : '90%',
							itemId : 'remarks',
							flex : 1,
							fieldLabel : '备注'
						}, {
							xtype : 'container',
							layout : 'column',
							items : [{
										xtype : 'datefield',
										fieldLabel : '出货时间',
										itemId : 'deliverytime'
									}, {
										xtype : 'textfield',
										fieldLabel : '出货人',
										itemId : 'ckperson'
									}, {
										xtype : 'button',
										text : '快递单打印',
										iconCls :'print',
										handler : function() {
											tpmsprinter.print("delivery", {
														ids : [me.chid],
														clientid : me
																.down("#customerid")
																.getValue()
													});
										}
									}, {
										xtype : 'button',
										text : '出货单打印',
										iconCls :'print',
										handler : function() {
											tpmsprinter.print("stockout", {
														ids : [me.chid],
														clientid : me
																.down("#customerid")
																.getValue()
													});
										}
									}]

						}]
			}]
		});

		this.callParent();
	}
});